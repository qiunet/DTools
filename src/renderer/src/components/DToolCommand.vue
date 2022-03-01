<template>
  <el-form :model="gmCommandData" label-width="120px"  style="max-width: 800px">
    <el-form-item label="选择GM命令:">
      <el-select size="large" v-model="currentCommand" value-key="type" style="width: 70%" placeholder="选择GM命令" @change="gmCommandData.change">
        <el-option
            v-for="item in gmCommandData.commandList"
            :label="item.name"
            :key="item.type"
            :value="item"
        />
      </el-select>
    </el-form-item>
    <template v-if="currentCommand !== undefined" v-for="(param, index) in currentCommand?.params">
      <el-form-item :label="param.name">
        <el-input-number style="width: 70%" clearable v-model="gmCommandData.commandData[index]" v-if="StringUtil.isJavaNumberType(param.type)" :placeholder="param.example" />
        <el-select
            size="large"
            class="setting-el-select"
            style="width: 70%"
            v-model="gmCommandData.commandData[index]"
            clearable
            filterable
            allow-create
            no-data-text="没有数据"
            :placeholder="param.example"
        >
          <el-option
              v-for="item in buildSelectList(param.name)"
              :key="item"
              :label="item"
              :value="item"
          />
        </el-select>
      </el-form-item>
    </template>
    <el-form-item v-if="currentCommand !== undefined">
      <el-button type="success" style="width: 70%" @click="gmCommandData.commit">发送GM命令</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import {JsonUtil} from "../common/JsonUtil";

  const props = defineProps({
    commandList: {
      required: true,
      type: Array
    },

    sendMessage: {
      required: true,
      type: Function
    }
  });

  import {StringUtil} from "../common/StringUtil";
   import {defineProps, reactive, ref} from "vue";
  import {GmCommandInfo, GmParam} from "../../../preload/net/node/NodeClientResponse";
  import {ElMessage} from "element-plus";
  import {CommonUtil} from "../common/CommonUtil";


  function buildSelectList(name: string): Array<string> {
    const list:Array<string> = [];
    const json = localStorage.getItem(name);
    if (json !== null && ! StringUtil.isEmpty(json)) {
      const array:Array<string> = JsonUtil.stringToJson(json);
      array.forEach(str => list.push(str));
    }
    return list;
  }

  const currentCommand = ref<GmCommandInfo>();
  const gmCommandData = reactive({
    commandList: [] = props.commandList as Array<GmCommandInfo>,

    commandData: {} as any,

    change: () => {
      gmCommandData.commandData = {};
    },

    commit: () => {
      if (currentCommand.value === undefined) {
        ElMessage.error("没有选择GM 命令")
        return;
      }

      for (let key in gmCommandData.commandData) {
        const index = parseInt(key);
        const param:GmParam = currentCommand.value.params[index]
        const val = gmCommandData.commandData[key];
        if (val === undefined) {
          ElMessage.error("请填写参数"+param.name)
          return;
        }

        if (!CommonUtil.isNullOrUndefined(val) && ! StringUtil.regexTest(val, param.regex)) {
          ElMessage.error("请正确填写参数"+param.name+" 示例:"+param.example)
          return;
        }

        if (param.type === "string") {
          let listString:string | null = localStorage.getItem(param.name);
          if (listString === null) {
            listString = "[]";
          }
          const arr: Array<string> = JSON.parse(listString);
          if (! arr.find((val0) => val0 === val)) arr.push(val)
          localStorage.setItem(param.name, JSON.stringify(arr, null, "\t"))
        }
      }

      const commandId = currentCommand.value.type;
      const arr = [];
      for (let i = 0; i < currentCommand.value.params.length; i++) {
        arr.push((gmCommandData.commandData[i]).toString())
      }

      const ret = props.sendMessage(commandId, arr)
      if (ret !== '') {
        ElMessage.error(ret);
      }
    }
  });
</script>

<style scoped>

</style>
