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
            <el-button type="primary" @click="data.handleClose">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
    <el-divider></el-divider>
    <json-viewer
        id="json-view-output-area"
        :value="data.jsonData"
        v-show="showJsonView"
        :expand-depth=5
        style="height: 400px; overflow:auto"
        copyable
        boxed
        sort
    />
  </div>
</template>

<script lang="ts">
import {reactive, ref} from 'vue'
import JsonViewer from 'vue-json-viewer';
import {Upload} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {StringUtil} from "../common/StringUtil";

export default {
  name: "Json",
  components: {
    JsonViewer,
    Upload
  },

  setup() {
    let data = reactive({
      jsonData : '',
      jsonString: '',
      dialogVisible: false,

      handleClose: function() {
        if (StringUtil.isEmpty(data.jsonString)) {
          ElMessage.warning("Json内容为空");
          return;
        }

        showJsonView.value = true;
        try {
          data.jsonData = JSON.parse(data.jsonString)
          data.dialogVisible = false
        }catch (e) {
          ElMessage.error('Json格式错误:'+ e)
        }
      },
    });

    const showJsonView = ref(false);
    return {
      showJsonView,
      data
    }
  }
}
</script>

<style scoped>
</style>

