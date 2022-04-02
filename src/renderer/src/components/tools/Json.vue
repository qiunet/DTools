<template>
  <div>
    <div style="align-items: center; padding-top: 20px">
      <el-button type="text" size="large" @click="data.dialogVisible = true; showJsonView = false;">
        点击按钮粘贴Json文本<el-icon class="el-icon--right"><Upload /></el-icon>
      </el-button>

      <el-dialog
          v-model="data.dialogVisible"
          title="导入Json文本"
          width="50%"
      >
        <el-input
            id="custom-json-string-input"
            placeholder="粘贴Json数据"
            v-model="data.jsonString"
            type="textarea"
            :rows="20"
        />

        <template #footer>
          <span class="dialog-footer">
            <el-button type="primary" @click="handleClose">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-divider></el-divider>
    <JsonTreeView
        id="json-view-output-area"
        :data="data.jsonData"
        v-show="showJsonView"
        root-key="Root"
        :max-depth=3
    />
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import { JsonTreeView } from "json-tree-view-vue3";
import {Upload} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {StringUtil} from "../../common/StringUtil";
  const showJsonView = ref(false);
  let data = reactive({
    jsonData : '{}',
    jsonString: '',
    dialogVisible: false,
  });

  function handleClose() {
    if (StringUtil.isEmpty(data.jsonString)) {
      ElMessage.warning("Json内容为空");
      return;
    }

    data.jsonData = data.jsonString
    data.dialogVisible = false
    showJsonView.value = true;
  }
</script>

<style scoped>
</style>

