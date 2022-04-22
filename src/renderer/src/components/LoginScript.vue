<template>
  <el-form
      :model="formData"
      style="width: 95%; max-width: 800px"
      label-width="30px"
  >
    <el-form-item label="">
      <el-input :rows="20" type="textarea" resize="none" v-model="formData.context" placeholder="填写登录脚本"/>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" type="success" @click="formData.submitForm">保存</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

  import {reactive} from "vue";
  import {ElMessage} from "element-plus";

  const props = defineProps({
    // 提交协议内容
    submit: {
      required: true,
      type: Function,
    }
  });

  console.log("window.tool_api:"+window.tool_api)
  const path = window.tool_api.setting().loginScriptFilePath.current;
  // window.tool_api.reloadScriptContext(path);
  const logicContext = window.tool_api.scriptContext(path);

  const formData = reactive({
    context: logicContext,

    submitForm(){
      window.tool_api.saveScriptContext(path, formData.context);
    }
  });

</script>

<style scoped>

</style>
