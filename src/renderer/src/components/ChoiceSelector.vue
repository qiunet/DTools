<template>
  <el-select
      size="large"
      class="setting-el-select"
      style="width:500px;"
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
  declare interface ISelectSetting {

  }

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
        }
      }
  );

  function clear() {
    props.delSelect()
  }

  function change(val: string) {
    if (StringUtil.isEmpty(val)) {
      return;
    }

    if (! window.tool_api.isDir(val)) {
      ElMessage.error("["+val+"]不是一个文件夹!");
      return false;
    }

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

</style>
