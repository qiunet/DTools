<template>
  <template v-if="props.currData.nodeName === 'action'">
    <el-table :data="tableData.docs()" style="width: 100%">
      <el-table-column prop="desc" label="参数" width="100" />
      <el-table-column label="内容" width="400">
        <template #default="scope">
          {{props.currData.getParam(scope.row.name)}}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope">
          <el-button type="text" size="small" @click="updateActionParam(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="editDataForm.editActionParamVisible" title="编辑行为参数">
      <el-form :model="editDataForm">
        <el-form-item :label="editDataForm.doc.desc" label-width="100px">
          <el-input-number clearable style="width: 80%" v-bind="editDataForm.attrs" v-model="editDataForm.data" v-if="editDataForm.isNumber()" />
          <el-input clearable v-else style="width: 80%" v-bind="editDataForm.attrs" v-model="editDataForm.data" />
        </el-form-item>
      </el-form>

      <template #footer>
              <span class="dialog-footer">
                <el-button @click="editDataForm.editActionParamVisible = false">取消</el-button>
                <el-button type="success" @click="editDataForm.commit">确定</el-button>
              </span>
      </template>
    </el-dialog>
  </template>
</template>

<script lang="ts" setup>
import {defineComponent, reactive, ref} from "vue";
import { BHTNode} from "../../../preload/utils/BehaviorTree";
import {IAIConfig, IBhtActionParam} from "../../../preload/utils/AiConfig";
import {StringUtil} from "../common/StringUtil";
import {ElMessage} from "element-plus";

  const props = defineProps({
    currData: {
      required: true,
    },
  });

    function updateActionParam(doc: IBhtActionParam) {
      editDataForm.doc = doc;
      editDataForm.attrs = {};
      const node: any = props.currData;
      editDataForm.data = node.getParam(doc.name);
      const isNumber = StringUtil.isJavaNumberType(doc.type);
      if (doc.max > 0) {
          editDataForm.attrs[isNumber ? 'max' : 'maxlength'] = doc.max;
          if (! isNumber) {
            editDataForm.attrs['show-word-limit'] = true;
          }
      }
      if (doc.min > 0) {
        editDataForm.attrs[isNumber ? 'min' : 'minlength'] = doc.min;
      }
      editDataForm.editActionParamVisible = true;
    }


    const tableData = reactive({
      docs: () => {
        const node: any = props.currData as BHTNode;
        const aiConfig: IAIConfig = window.tool_api.aiConfigJson();
        let find: any = aiConfig.actionDocs.find(value => value.name === node.clazz);
        return find.params;
      }
    });

    const editDataForm = reactive({
      editActionParamVisible: false,
      doc: {} as IBhtActionParam,
      attrs: {} as any,
      data: '',

      isNumber: () => {
        return StringUtil.isJavaNumberType(editDataForm.doc.type);
      },

      commit: () => {
        let regex = editDataForm.doc.regex;
        if (! editDataForm.isNumber() && regex !== '' && ! StringUtil.regexTest(editDataForm.data, regex)) {
          ElMessage.error("不符合正则表达式: "+regex);
          return;
        }
        const node: any = props.currData;
        node.setParam(editDataForm.doc.name, editDataForm.data);
        editDataForm.editActionParamVisible = false;
      }
    });
</script>

<style scoped>

</style>
