<template>
  <div>
    <el-row :gutter="20" style="padding-top: 15px">
      <el-col :span="10"><div class="datetime-stamp" id="col-timestamp">{{data.timestamp}}</div></el-col>
      <el-col :span="2"><div><el-button class="copy-btn" @click="copyToClipboard(data.timestamp)">复制</el-button></div></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10"><div class="datetime-stamp" id="col-time-string">{{data.timeString}}</div></el-col>
      <el-col :span="2"><div><el-button class="copy-btn" @click="copyToClipboard(data.timeString)">复制</el-button></div></el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="50">
      <el-col :span="8"><el-input style="width: 250px" v-model="data.inputTimeStamp" maxlength="13" placeholder="时间戳" ></el-input></el-col>
      <el-col :span="2">
        <el-popover
            placement="right-start" :width="200" trigger="click" :content="data.timestamp_content">
          <template #reference>
            <el-button class="convert-btn" @click="getterDtString">格式化时间</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
    <el-row :gutter="50">
      <el-col :span="8"><el-date-picker style="width: 250px" v-model="data.inputDateTime" type="datetime" placeholder="选择日期和时间"/></el-col>
      <el-col :span="2">
        <el-popover placement="right-start" :width="200" trigger="click" :content="data.datetime_content">
          <template #reference>
            <el-button class="convert-btn" @click="getterDateTimeStamp">转换时间戳</el-button>
          </template>
        </el-popover>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from "vue";
import {ElMessage, ElNotification} from "element-plus";
import {StringUtil} from "../../common/StringUtil";
import {DateUtil} from "../../common/DateUtil";
    let data = reactive({
      inputTimeStamp : "",
      inputDateTime: new Date(),
      timestamp : "",
      timeString : "",
      timestamp_content: "",
      datetime_content: "",
    });

    function getterDtString() {
      console.log(data.inputTimeStamp)
      if (data.inputTimeStamp === '' || ! StringUtil.isNumber(data.inputTimeStamp)) {
        data.timestamp_content = "输入值不是数值类型";
        return;
      }
      let stamp = Number(data.inputTimeStamp);
      if (data.inputTimeStamp.length < 11) {
        stamp *= 1000;
      }

      data.timestamp_content = DateUtil.dateFormat(new Date(stamp));
      navigator.clipboard.writeText(data.timestamp_content).then(() => {
        ElMessage.success("复制成功");
      });
    }

    function getterDateTimeStamp() {
      data.datetime_content = ""+(~~(data.inputDateTime.getTime() / 1000));
      navigator.clipboard.writeText(data.datetime_content).then(() => {
        ElMessage.success("复制成功");
      });
    }


    function refreshDatetime() {
      data.timestamp = DateUtil.currentTimeSeconds() + "";
      data.timeString = DateUtil.dateFormat(new Date())
    }

    function copyToClipboard(text: string|number) {
      navigator.clipboard.writeText(text.toString()).then(() => {
        ElNotification({
          title: '复制成功',
          duration: 1000,
          message: text.toString(),
          type: 'success',
          showClose: false
        })
      }).catch(err => {
        ElMessage.error("复制失败"+ err);
      });
    }

    setInterval(() => {
      refreshDatetime()
    }, 1000);
    refreshDatetime();
</script>

<style scoped>
.datetime-stamp {
  margin-left: 5px;
  font-size: 32px;
  color: mediumseagreen;
}
button.copy-btn, button.convert-btn {
  color: mediumseagreen;
}
</style>
