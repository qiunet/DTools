<template>
  <el-container style="height: 100%">
    <el-header height="140px">
      <div style="padding: 10px; font-size: 22px; color: gray">
      <el-row :gutter="2">
        <el-col :span="4">登录服地址: </el-col>
        <el-col :span="16"><v-choice-select :size="'default'" :styleData="{'width': '95%', 'max-width': '800px'}" :select="setting.loginUrl" :newValCheck="validHttpUrl" :useFunc="reloadServer" :delSelect="reloadServer" placeholder="填入登录服地址" /></el-col>
      </el-row>
      </div>
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
            <el-link type="primary" @click="showGmCommand(scope.row)" >GM命令</el-link>&nbsp;
            <el-link type="primary" @click="showProtoTest(scope.row)">协议联调</el-link>&nbsp;
            <el-popover :width="250" trigger="click">
                <p><b>是否登出?</b></p>
                <el-link type="danger" @click="brokenConnection(scope.row)">异常登出</el-link>&nbsp;
                <el-link type="primary" @click="brokenAndReconnection(scope.row)">断线重连</el-link>&nbsp;
                <el-button size="small" type="primary" @click="logout(scope.row)">正常登出</el-button>
              <template #reference>
                <el-link type="primary">登出</el-link>
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="player-table-view" type="success" style="width: 90%" @click="newLoginPlayer">新增登录玩家</el-button>
      <el-dialog v-model="gmCommandData.showDialog" :title="`玩家[${gmCommandData.currPlayer?.openId}]GM命令`" width="70%">
        <d-tool-command :command-list="gmCommandData.commandList" :send-message="gmCommandData.sendGmCommand"/>
      </el-dialog>
      <el-dialog v-model="protoTestData.showDialog" :title="`玩家[${protoTestData.currPlayer?.openId}]协议测试`" width="75%" @close="protoTestData.close">
        <v-protocol-test :submit="protoTestData.submit" :kcpPrepare="protoTestData.currPlayer?.kcpPrepare()" />
        <el-divider content-position="left">
          <el-space :spacer="spacer">
            <div>响应控制台</div>
            <div><el-link type="primary" @click="cleanupConsole">清空</el-link></div>
          </el-space>
        </el-divider>
        <el-scrollbar
              id="proto_response_output"
              ref="scrollbarRef"
              height="240px"
          >
            <div ref="innerRef">
              <rsp-message v-for="item in protoTestData.protoResponseOutput" :message="item" />
            </div>
          </el-scrollbar>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script lang="ts" setup>
import vChoiceSelect from "../components/ChoiceSelector.vue";
import dToolCommand from "../components/DToolCommand.vue";
import vProtocolTest from "../components/ProtocolTest.vue";
import rspMessage from "../components/RspMessage.vue";

import {h, reactive, ref} from "vue";
import {ElDivider, ElMessage, ElMessageBox, ElScrollbar} from "element-plus";
import {PlayerData, PlayerManager} from "../common/PlayerData";
import {Protocol} from "../common/Protocol";
import DToolCommand from "../components/DToolCommand.vue";
import {GmCommandInfo} from "../../../preload/net/node/NodeClientResponse";
import {ResponseInfo} from "../common/ResponseInfo";
  const spacer = h(ElDivider, { direction: 'vertical' })

  interface IGmCommandData {
    showDialog: boolean;
    commandList:Array<GmCommandInfo>;
    currPlayer: PlayerData|undefined;
    sendGmCommand: (command: number, params: Array<string>) => void;
  }
  interface IProtoTestData {
    submit: (protocolID: number, jsonString: string, kcp: boolean) => void;
    currPlayer: PlayerData|undefined;
    protoResponseOutput: Array<ResponseInfo>;
    showDialog: boolean;
    close: () => void;
  }

  function cleanupConsole() {
    protoTestData.protoResponseOutput.splice(0)
    protoTestData.currPlayer?.cleanupResponses()
  }

  const setting = ref(window.tool_api.setting());
  const loginData = PlayerManager.playerList;
  function showGmCommand(data: PlayerData) {
    data.on('gm-command-list', (commandList:Array<GmCommandInfo>) => {
      gmCommandData.commandList = commandList;
      gmCommandData.currPlayer = data;
      gmCommandData.showDialog = true;
    }, true);

    data.sendData(Protocol.GM_COMMAND_INDEX_REQ, {}, false)
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
      });

      gmCommandData.currPlayer.sendData(Protocol.GM_COMMAND_REQ, {type: command, params: params}, false);
    },
  });
 const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
 const innerRef = ref<HTMLDivElement>()
 function showProtoTest(data: PlayerData) {
    protoTestData.showDialog = true;
    if (protoTestData.currPlayer !== data) {
      protoTestData.currPlayer?.off('server-response');
      protoTestData.protoResponseOutput.splice(0);
   }
   let responseList: Array<ResponseInfo> = data.responseList;
   responseList.forEach(val => {
     protoTestData.protoResponseOutput.push(val)
   });
   protoTestData.currPlayer = data;
    scrollToBottom()
    data.on('server-response', (info: ResponseInfo) => {
      protoTestData.protoResponseOutput.push(info);
      scrollToBottom()
    })
  }

/**
 * 滚到最下面
 */
 function scrollToBottom() {
    setTimeout(() => {
      const height = innerRef.value?.clientHeight;
      scrollbarRef.value?.setScrollTop( (height?height:0) + 10);
    }, 10);

  }

  const protoTestData = reactive<IProtoTestData>({
    showDialog: false,
    currPlayer: undefined,
    protoResponseOutput: [],
    submit: (protocolId: number, jsonString: string, kcp: boolean) => {
      protoTestData.currPlayer?.once('proto-debug-response', () => {
        ElMessage.success("发送成功")
      });
      protoTestData.currPlayer?.sendData(Protocol.GM_DEBUG_PROTOCOL_REQ, {protocolId: protocolId, data: jsonString}, kcp)
    },
    close: () => {
      protoTestData.currPlayer?.off('server-response')
    }
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

  function logout(data: PlayerData) {
      PlayerManager.logout(data.openId)
  }

  function brokenConnection(data: PlayerData) {
    data.tcpClient?.destroy()
  }

  function brokenAndReconnection(data: PlayerData) {
    data.reconnect()
  }
</script>

<style scoped>
  .player-table-view {
    width: 90%;
    max-width:1000px;
  }

  fieldset {
    height: 180px;
    padding: 0 2px 2px 2px;
  }

  #proto_response_output {
    background-color: #313131;
    color: #94a6a6;
    border-radius: 5px;
    alignment: center;
    font-size: 16px;
    width: 100%;
    resize: none;
    height: 100%;
  }
</style>
