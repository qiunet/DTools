<template>
  <span>&nbsp;&nbsp;[{{props.message.getDtString()}}]&nbsp;
    (<el-button size="small" type="text" @click="showDialog=true">{{props.message.getProtocolInfo()}}</el-button>)
    &nbsp;&lt;&lt;&lt;&nbsp;{{props.message.getRspString()}}</span><br />

    <el-dialog v-model="showDialog" :title="`Response[${props.message.getProtocolInfo()}]内容`" width="70%" >
      <el-scrollbar height="300px" id="json-view-output-area">
        <JsonTreeView
            :data="props.message.getRspString()"
            color-scheme="dark"
            root-key="Root"
            :max-depth=3
        />
      </el-scrollbar>
    </el-dialog>
</template>

<script lang="ts" setup>
  import { JsonTreeView } from "json-tree-view-vue3";
  import {ref} from "vue";

  const props = defineProps({
    // 提交协议内容
    message: {
      required: true,
      type: Object,
    }
  });

  const showDialog = ref(false);
</script>

<style scoped>
  span {
    display:inline-block;
    word-wrap:break-word;
    white-space:normal;
    width:100%;
  }

  #json-view-output-area {
    background-color: #313131;
  }
</style>
