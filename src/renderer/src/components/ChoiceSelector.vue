<template>
  <el-select
      size="large"
      class="setting-el-select"
      :style="props.styleData"
      v-model="props.select.current"
      filterable
      allow-create
      :clearable="true"
      default-first-option
      :reserve-keyword="false"
      @clear="clear"
      @change="change"
      no-data-text="需要填入文件夹绝对路径"
      placeholder="需要填入文件夹绝对路径"
  >
    <el-option
        v-for="item in props.select.list"
        :key="item"
        :label="item"
        :value="item"
    />
  </el-select>
</template>

<script lang="ts" setup>
import {defineProps} from "vue";
import {StringUtil} from "../common/StringUtil";
import {ElMessage} from "element-plus";
  const props = defineProps(
      {
        select: {
          required: true,
          type: Object
        },
        useFunc: {
          required: true,
          type: Function,
        },
        delSelect: {
          required: true,
          type: Function,
        },

        styleData: {
          type: Object,
          required: false,
          default: {width: '500px'}
        },


        // 新值校验
        newValCheck: {
          type: Function,
          required: false,
          default: (val: string) => window.tool_api.isDir(val)
        }
      }
  );
  let currentVal = props.select.current;
  function clear() {
    props.delSelect()
  }

  function change(val: string) {
    if (StringUtil.isEmpty(val)) {
      props.select.current = currentVal;
      return;
    }

    if (!props.newValCheck(val)) {
      ElMessage.error("["+val+"]值错误!");
      props.select.current = currentVal;
      return false;
    }
    currentVal = val;
    props.select.current = val;
    if (props.useFunc(val)) {
      props.select.list.push(val);
      ElMessage.success("保存成功!");
    }else {
      ElMessage.success("切换成功!");
    }
  }

</script>

<style scoped>
.el-input__inner {
  width: 100%;
}
</style>
