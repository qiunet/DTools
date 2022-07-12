<template>
  <el-form
      :model="formData"
      style="width: 95%; max-width: 800px"
      label-width="80px"
  >
    <el-form-item label="选择协议:">
      <el-select
          style="width: 100%;"
          placeholder="选择协议类名"
          v-model="formData.selectRequestID"
          @change="formData.reqChange"
          filterable
      >
        <!--   去掉前面的十一位 ProtoReq_     -->
        <el-option
            v-for="info in reqEnum"
            :label="info.className"
            :value="info.protocolID"
            :key="info.protocolID"
        >
          <span>{{info.className}}</span>
          <span style="float: right; color:#94a6a6 ">{{info.comment}}</span>
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="协议类型">
      <el-switch
          width="150"
          active-text="KCP"
          inactive-text="TCP"
          v-model="formData.kcp"
      />
    </el-form-item>
    <el-form-item label="协议内容">
      <el-input :autosize="{ minRows: 3, maxRows:8 }" type="textarea" resize="none" v-model="formData.protocolData" placeholder="填写请求数据"/>
    </el-form-item>
    <el-form-item>
      <el-button style="width: 100%" type="success" @click="formData.submitForm">请求协议</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>

import {reactive, ref} from "vue";
  import {ElMessage} from "element-plus";

  const props = defineProps({
    // 提交协议内容
    submit: {
      required: true,
      type: Function,
    }
  });

  const reqEnum = window.client_api.requestEnum();

  const formData = reactive({
    selectRequestID: undefined,
    /**
     * 协议数据
     */
    protocolData: '',

    kcp: false,

    reqChange(val: number) {
      let obj = window.client_api.buildProtoTypeInfo(val);
      formData.protocolData = JSON.stringify(obj, null, '\t')
    },

    submitForm(){
      if (formData.selectRequestID === undefined) {
        ElMessage.error("请选择协议. 填写请求数据!")
        return;
      }
      props.submit(formData.selectRequestID, formData.protocolData, formData.kcp)
    }
  });


</script>

<style scoped>

</style>
