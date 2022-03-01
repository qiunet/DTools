<template>
  <el-form
      label-position="top"
      label-width="250px"
      :model="regexData"
      style="max-width: 800px"
  >
    <el-form-item label="输入正则表达式:">
      <el-popover
          placement="bottom"
          trigger="hover"
          content="回车使正则表达式生效!"
      >
        <template #reference>
          <el-input size="large" clearable @change="regexData.inputEvent" v-model="regexData.inputRegex" placeholder="输入正则表达式" />
        </template>
      </el-popover>
    </el-form-item>
    <el-form-item label="输入需匹配字符:">
      <el-input  clearable autosize type="textarea" @input="regexData.inputEvent" v-model="regexData.inputContent" placeholder="输入需匹配字符" />
    </el-form-item>
    <el-divider>表达式匹配结果</el-divider>
      <div class="regex-match-text" v-if="regexData.matchText !== ''" v-html="regexData.matchText"></div>
  </el-form>
</template>

<script lang="ts" setup>

import {reactive} from "vue";
import {StringUtil} from "../../common/StringUtil";
import {ElMessage} from "element-plus";

  const regexData = reactive({
    /**
     * 正则表达式
     */
    inputRegex: '',
    /**
     * 输入内容
     */
    inputContent: '',
    /**
     * 匹配内容
     */
    matchText: '',

    inputEvent: (val: string) => {
      if (StringUtil.isEmpty(regexData.inputRegex)) {
        ElMessage.warning("需要先填写正则表达式!")
        return;
      }

      if (StringUtil.isEmpty(regexData.inputContent)) {
        return;
      }

      const colorArray = ['#b250e2','#347606', '#690d0d', '#1a9595', '#0c2b4f', '#868609'];
      regexData.matchText = regexData.inputContent
          .replace(new RegExp(regexData.inputRegex, 'g'),  (substring: string, args: number) => {
            const color = colorArray[args % colorArray.length];
            return ` <b style="color: ${color}; font-size: 22px">${substring}</b> `;
          })
          .replaceAll("\n", "<br />");
    }
  });

</script>

<style scoped>
  .regex-match-text {
    background-color: #f5f1f1;
    border-radius: 5px;
    font-size: 20px;
    padding: 10px;
    color: #94a6a6;
    width: 100%;
    border: 1px solid #313131;
  }
</style>
