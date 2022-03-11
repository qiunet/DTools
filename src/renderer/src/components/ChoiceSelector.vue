<template>
  <el-select
      :size="props.size"
      class="setting-el-select"
      :style="props.styleData"
      v-model="props.select.current"
      :filterable="props.filterable"
      allow-create
      :clearable="props.clearable"
      default-first-option
      :reserve-keyword="false"
      @clear="clear"
      @change="change"
      no-data-text="没有数据"
      :placeholder="props.placeholder"
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
import {SelectSetting} from "../common/DToolsSetting";
  const props = defineProps(
      {
        // SelectSetting 对象
        select: {
          type: Object,
          required: true
        },

        clearable: {
          type: Boolean,
          default: true
        },

        size: {
          type: String,
          default: 'large'
        },

        placeholder: {
          type: String,
          default: "需要填入文件夹绝对路径"
        },
        // 是否可以过滤
        filterable: {
          type: Boolean,
          default: true
        },
        // 外面需要触发的方法传入
        useFunc: {
          type: Function,
        },
        // 外面需要触发的方法传入
        delSelect: {
          type: Function,
        },
        // 需要绑定的style
        styleData: {
          type: Object,
          default: {width: '500px'}
        },


        // 新值校验
        newValCheck: {
          type: Function,
          required: false,
          default: (val: string):boolean => {
            const result = window.tool_api.isDir(val);
            if (! result) {
              ElMessage.error("["+val+"]必须是文件夹路径!");
            }
            return result;
          }
        }
      }
  );
  let currentVal = props.select.current;
  function clear() {
    props.select.list.forEach((val: string, index: number) => {
      if (val === currentVal) {
        props.select.list.splice(index, 1);
      }
    });
    props.select.current = props.select.removeCurrentPath();
    ElMessage.warning("删除成功!");
    currentVal = props.select.current;
    if (props.delSelect !== undefined) {
      props.delSelect();
    }
  }

  function change(val: string) {
    if (StringUtil.isEmpty(val)) {
      props.select.current = currentVal;
      return;
    }

    if (!props.newValCheck(val)) {
      props.select.current = currentVal;
      return false;
    }
    currentVal = val;
    props.select.current = val;
    if (props.select.usePath(val)) {
      props.select.list.push(val);
      ElMessage.success("保存成功!");
    }else {
      ElMessage.success("切换成功!");
    }
    if (props.useFunc !== undefined) {
      props.useFunc();
    }
  }

</script>

<style scoped>
.el-input__inner {
  width: 100%;
}
</style>
