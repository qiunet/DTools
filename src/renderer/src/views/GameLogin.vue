<template>
  <el-container style="height: 100%">
    <el-header height="70px">
      <el-row :gutter="2">
        <el-col :span="4">登录服地址: </el-col>
        <el-col :span="17"><v-choice-select :size="'default'" :styleData="{'width': '80%', 'max-width': '800px'}" :select="setting.loginUrl" :newValCheck="validHttpUrl" :useFunc="reloadServer" :delSelect="reloadServer" placeholder="填入Redis地址以及端口" /></el-col>
      </el-row>
      <el-divider />
    </el-header>
    <el-main>
      <el-table
          class="player-table-view"
          :data="loginData"
          empty-text	="当前还没有登录玩家账号"
       >
        <el-table-column label="ID" width="100"  prop="playerId"/>
        <el-table-column label="服务器" width="200"  prop="hostInfo"/>
        <el-table-column label="名称" width="120"  prop="name"/>
        <el-table-column label="M1" width="70"  prop="m1"/>
        <el-table-column label="M2" width="70"  prop="m2"/>
        <el-table-column fixed="right" label="操作" width="240">
          <template #default="scope">
            <el-button type="text" size="small" @click="showGmCommand(scope.row)" >GM命令</el-button>
            <el-button type="text" size="small" @click="showProtoTest(scope.row)">协议联调</el-button>
            <el-popconfirm title="是否登出?" confirm-button-text="直接登出" cancel-button-text="模拟断线重连"
                           @confirm="PlayerManager.logout(scope.row.openId)" @cancel="scope.row.reconnect()">
              <template #reference>
                <el-button type="text" size="small" >登出</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="player-table-view" type="success" style="width: 90%" @click="newLoginPlayer">新增登录玩家</el-button>
      <el-dialog v-model="gmCommandData.showDialog" :title="`玩家[${gmCommandData.currPlayer?.openId}]GM命令`" width="70%">
        <d-tool-command :command-list="gmCommandData.commandList" :send-message="gmCommandData.sendGmCommand"/>
      </el-dialog>
      <el-dialog v-model="protoTestData.showDialog" :title="`玩家[${protoTestData.currPlayer?.openId}]协议测试`" width="70%">
        <v-protocol-test :submit="protoTestData.submit" />
      </el-dialog>

    </el-main>
    <el-footer height="150px">
      <el-divider />
    </el-footer>
  </el-container>
</template>

<script lang="ts" setup>
import vChoiceSelect from "../components/ChoiceSelector.vue";
import dToolCommand from "../components/DToolCommand.vue";
import vProtocolTest from "../components/ProtocolTest.vue";

import {onUnmounted, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {PlayerData, PlayerManager} from "../common/PlayerData";
import {Protocol} from "../common/Protocol";
import DToolCommand from "../components/DToolCommand.vue";
import {GmCommandInfo} from "../../../preload/net/node/NodeClientResponse";
  interface IGmCommandData {
    showDialog: boolean;
    commandList:Array<GmCommandInfo>;
    currPlayer: PlayerData|undefined;
    sendGmCommand: (command: number, params: Array<string>) => void;
  }
  interface IProtoTestData {
    showDialog: boolean;
    currPlayer: PlayerData|undefined;
    submit: (protocolID: number, jsonString: string) => void;
  }

  const setting = ref(window.tool_api.setting());
  const loginData = PlayerManager.playerList;
  function showGmCommand(data: PlayerData) {
    data.on('gm-command-list', (commandList:Array<GmCommandInfo>) => {
      gmCommandData.commandList = commandList;
      gmCommandData.currPlayer = data;
      gmCommandData.showDialog = true;
    }, true);

    data.sendData(Protocol.GM_COMMAND_INDEX_REQ, {})
  }

  const gmCommandData = reactive<IGmCommandData>({
    commandList: [],
    showDialog: false,
    currPlayer: undefined as any,
    sendGmCommand: (command: number, params: Array<string>):void => {
      if (gmCommandData.currPlayer === undefined) {
        ElMessage.error("用户信息为空!")
        return;
      }

      gmCommandData.currPlayer.once('gm-command-success', () => {
        ElMessage.success("发送命令成功!")
        // gmCommandData.currPlayer = undefined;
        // gmCommandData.showDialog = false;
      });

      gmCommandData.currPlayer.sendData(Protocol.GM_COMMAND_REQ, {type: command, params: params});
    },
  });

  function showProtoTest(data: PlayerData) {
    protoTestData.showDialog = true;
    protoTestData.currPlayer = data;
  }

  const protoTestData = reactive<IProtoTestData>({
    showDialog: false,
    currPlayer: undefined,
    submit: (protocolId: number, jsonString: string) => {
      protoTestData.currPlayer?.once('proto-debug-response', () => {
        ElMessage.success("发送成功")
      });
      protoTestData.currPlayer?.sendData(Protocol.GM_DEBUG_PROTOCOL_REQ, {protocolId: protocolId, data: jsonString})
    },
  })

  /**
 * 新增登录玩家
 */
  function newLoginPlayer() {
    if (setting.value.loginUrl.current === '') {
      ElMessage.error("请先设置登录服地址!")
      return;
    }

    if (setting.value.protoFilePath.current === '') {
      ElMessage.error("请先设置 AllInOneProtobufProtocol.proto 地址!")
      return;
    }

    ElMessageBox.prompt('输入玩家OpenId:', '新增登录玩家', {
      confirmButtonText: '登录',
      inputPattern: /[0-9]+/,
      inputPlaceholder: '输入数值类型账号',
      inputErrorMessage: '请输入数值类型账号!'
    })
      .then(({ value }) => {
        if (loginData.value.find(pData => pData.openId === value)){
          ElMessage.error(`${value}重复登录`)
          return;
        }
        PlayerManager.login(value)
      }).catch(err => {})
  }
  /**
   * 校验新的http url
   * @param val
   */
  function validHttpUrl(val: string): boolean {
    if (! val.startsWith("http")) {
      ElMessage.error("请输入Http登录服地址!")
      return false;
    }

    return true;
  }
  /**
   * http url 重新改变
   */
  function reloadServer() {
      PlayerManager.destroy()
  }
</script>

<style scoped>
  .player-table-view {
    width: 90%;
    max-width:1000px;
  }
</style>
