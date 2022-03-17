<template>
  <el-form
      label-width="250px"
      style="max-width: 800px"
  >
    <el-form-item label="源数字:">
       <el-input style="width:300px" v-model="input" placeholder="输入数字" />
    </el-form-item>
    <el-form-item label="源数值进制:">
      <el-select
          style="width:300px"
          value-key="radix"
          v-model="radixSrc"
          placeholder="选择进制"
      >
        <el-option
            v-for="item in radixes"
            :label="item.name"
            :value="item"
            :key="item.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="目标值进制:">
      <el-select
          style="width:300px"
          value-key="radix"
          v-model="radixDest"
          placeholder="选择进制"
      >
        <el-option
            v-for="item in radixes"
            :label="item.name"
            :value="item"
            :key="item.name"
        />
      </el-select>
    </el-form-item>
    <el-form-item ><el-button type="success" style="width:300px" @click="convert">转换</el-button></el-form-item>
    <el-divider />
    <el-form-item label="目标数字:">
      <b style="font-size:24px">{{output}}</b>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import {ref} from "vue";
  import {StringUtil} from "../../common/StringUtil";
  import {ElMessage} from "element-plus";

  interface IRadix {
    radix: number;
    name: string;
    regex: RegExp;
    errMsg: string;
  }

  const radixes:Array<IRadix> = [
    {
      radix: 2,
      name: '二进制',
      regex: /[01]+/,
      errMsg: '请输入0101数值'
    },
    {
      radix: 8,
      name: '八进制',
      regex:/o?[0-7]+/,
      errMsg: '请输入0-8范围的重复数值'
    },
    {
      radix: 10,
      name: '十进制',
      regex: /[0-9]+/,
      errMsg: '请输入0-9范围的重复数值'
    },
    {
      radix: 16,
      name: '十六进制',
      regex: /[0-9a-eA-E]+/,
      errMsg: '请输入a-e 0-9范围的重复数值'
    },
  ];

  const radixSrc = ref<IRadix>(radixes[0]);
  const radixDest = ref<IRadix>(radixes[2]);
  const input = ref<string>();
  const output = ref<string>();

  function convert() {
    if (input.value === undefined || ! radixSrc.value.regex.test(input.value)) {
      ElMessage.error("源数字"+radixSrc.value.errMsg)
      return;
    }
    try {
        const val: number = parseInt(input.value, radixSrc.value.radix);
        output.value = val.toString(radixDest.value.radix);
    }catch (e) {
      ElMessage.error("转换错误: "+e)
    }

  }
</script>

<style scoped>

</style>
