<template>
  <el-divider />
    <el-row :gutter="20">
      <el-col :span="10">
        <el-input clearable v-model="openId" st placeholder="输入字符串,得到HashCode!"/>
      </el-col>
      <el-col :span="5">
        <el-popover
            placement="right-start" :width="200" trigger="click" :content="hashCode">
          <template #reference>
            <el-button type="success" class="convert-btn" @click="openIdToHashCode">转换</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
  <el-divider />
  <el-row :gutter="20">
    <el-col :span="10">
      <el-input type="number" clearable v-model="playerId" placeholder="输入玩家ID,计算服务器组和数据表Index!" />
    </el-col>
    <el-col :span="5">
      <el-popover
          placement="right-start" :width="200" trigger="click" :content="playerIdMsg">
        <template #reference>
          <el-button type="success" class="convert-btn" @click="playerIdChange">转换</el-button>
        </template>
      </el-popover>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {ref} from "vue";
  import {StringUtil} from "../../common/StringUtil";
import {ElMessage} from "element-plus/es";

  const playerId = ref();
  const playerIdMsg = ref();
  function playerIdChange() {
    if (playerId.value === undefined) {
      playerIdMsg.value= '玩家ID无效'
      return;
    }

    const num = Number(playerId.value)
    const f = Math.pow(10, (num % 10) + 1);
    if (num < f) {
      ElMessage.error("不是一个规则的玩家ID!")
      return;
    }
    playerIdMsg.value = "服务器组:"+Math.floor((num % f) / 10)
                 +"\t数据表索引:" + (Math.floor(num / f) % 10)
  }

  const openId = ref('');
  const hashCode = ref();
  function openIdToHashCode() {
    if (openId.value === undefined) {
      ElMessage.error("输入值为空!")
    }
    hashCode.value = ""+StringUtil.javaHashCode(openId.value);
    navigator.clipboard.writeText(hashCode.value).then(() => {
      ElMessage.success("复制成功");
    });
  }

</script>

<style scoped>

</style>
