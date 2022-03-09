<template>
  <el-container style="width: 100%;">
    <el-aside width="200px">
      <el-form label-position="top" label-width="200px" :model="dataForm" style="max-width: 200px">
        <el-form-item label="Redis地址">
          <v-choice-select :select="setting.redisSelect" :newValCheck="validRedisUrl" :useFunc="reloadRedisServer" :delSelect="reloadRedisServer" placeholder="填入Redis地址以及端口" />
        </el-form-item>
        <el-form-item label="服务地址">
          <el-select size="large" v-model="currentServer" value-key="serverId" style="width:500px" @change="changeServer" placeholder="选择服务器">
            <el-option
                v-for="item in dataForm.serverPath"
                :label="item.serverId"
                :key="item.serverId"
                :value="item"
             >
              <span>{{ item.serverId }}</span>
              <span style="float: right; color: grey">{{ item.host }}: {{ item.nodePort }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户列表">
          <el-select size="large" v-model="dataForm.currentUser" value-key="playerId" style="width:500px" placeholder="选择玩家" no-data-text="当前没有用户在线">
            <el-option
                v-for="item in dataForm.userList"
                :label="item.playerId"
                :key="item.playerId"
                :value="item"
            >
              <span>{{ item.playerId }}</span>
              <span style="float: right; color: grey">{{ item.openId }}: {{ item.playerId }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 100%" type="success" @click="refresh">刷新</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm title="是否清除已有输入的GM命令记录?" @confirm="clearRubbish">
            <template #reference>
              <el-button type="primary" style="width: 100%"><el-icon><brush-filled /></el-icon>&nbsp;&nbsp;清除GM命令缓存</el-button>
            </template>
          </el-popconfirm>

        </el-form-item>
      </el-form>

    </el-aside>
    <el-main style="margin-top: 30px; margin-left: 30px;">
      <template v-if="dataForm.currentUser !== undefined" >
          <vDToolsCommand :commandList="commandList" :sendMessage="sendMessage" />
      </template>
    </el-main>
  </el-container>

</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {ServerInfo} from "../../../preload/net/node/ServerInfo";
import {ElMessage} from "element-plus";
import {StringUtil} from "../common/StringUtil";
import {CommonUtil} from "../common/CommonUtil";
import {UserInfo} from "../../../preload/net/node/NodeClientResponse";
import vDToolsCommand from "../components/DToolCommand.vue"
import vChoiceSelect from "../components/ChoiceSelector.vue";
import { BrushFilled} from "@element-plus/icons-vue";


  function clearRubbish() {
    localStorage.clear()
    ElMessage.success("清理成功")
}

  const setting = ref(window.tool_api.setting());
  const currentServer = ref();
  const dataForm = reactive({
    /**
     * 服务器路径
     */
    serverPath: [] as Array<ServerInfo>,
    /**
     * 服务器路径
     */
    userList: [] as Array<UserInfo>,
    /**
     * 当前用户
     */
    currentUser: undefined as any
  });


/**
 * 校验redis
 * @param url
 */
function validRedisUrl(url: string) {
  const arr = url.split(":");
  if (arr.length != 2) {
    ElMessage.error("请输入Redis地址, 格式: host(地址):port(端口)")
    return false;
  }

  if (! CommonUtil.existIn(arr[0], 'localhost', '127.0.0.1')
   && ! StringUtil.dRegexTest(arr[0], /^((2[0-4]\d|25[0-5]|[1]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[1]?\d\d?)$/)) {
    ElMessage.error("请输入正确的Ip地址")
    return false;
  }

  if (! StringUtil.isNumber(arr[1]) || parseInt(arr[1]) < 1000 || parseInt(arr[1]) > 65536) {
    ElMessage.error("请输入正确的端口")
    return false;
  }
  return true;
}

onMounted(() => {
  if (window.tool_api.setting().protoFilePath.current === '') {
    ElMessage.warning('需要指定`AllInOneProtobufProtocol.proto`文件路径')
  }
});

onUnmounted(() => {
  window.node_client_api.destroy()
});
/**
 * 服务器变更
 * @param item
 */
  function changeServer(item: ServerInfo) {
    window.node_client_api.destroy()
    window.node_client_api.connect(item.host, item.nodePort, onData)
    .then(result => {
      window.node_client_api.getOnlineUser();
      window.node_client_api.getCommandIndex();
    })
  }

  function reloadRedisServer() {
    dataForm.serverPath = [];
    currentServer.value = undefined;
    window.redis_api.changeRedis().then(open => {
      if (! open) {
        ElMessage.error("Redis连接失败, 请检查是否Redis是否开启!")
        return;
      }
      window.redis_api.serverList().then(list => {
        dataForm.serverPath = list;
      });
    });
  }

  if (setting.value.redisSelect.current !== '') {
    reloadRedisServer()
  }

  function refresh() {
     dataForm.currentUser = undefined;
     dataForm.serverPath = [];
     reloadRedisServer()
  }

  function sendMessage(command: number, params: string[]):string {
    const playerId = dataForm.currentUser.playerId;
    return window.node_client_api.sendCommand(playerId, command, params);
  }

  const commandList = ref([]);
  function onData(openId: string, protocol:number, obj: any){
    console.log("==[",openId,"]Response [",protocol,"] Message:== ", obj)
    switch(protocol) {
      case 613:
        dataForm.userList = obj.userList;
        if (obj.userList !== undefined && obj.userList.length > 0) {
          dataForm.currentUser = obj.userList[0];
        }
        if (! dataForm.userList || dataForm.userList.length == 0) {
            ElMessage.warning("当前没有用户在线!")
        }
        break;
      case 607:
        commandList.value = obj.list;
        break;
      case 615:
        if (obj.success) {
          ElMessage.success("发送成功");
        }else {
          ElMessage.error("执行错误: "+obj.errMsg);
        }
        break;
        case 701:
          // server pong
          break;
      default:
        console.info("Unknown protocol!")
    }
  }
</script>

<style scoped>

</style>
