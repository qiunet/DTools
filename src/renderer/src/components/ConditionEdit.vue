<template>
  <template v-if="! props.currData.decorator && props.currData.nodeName !== 'root'">
    <el-divider content-position="left">条件</el-divider>
    <template v-for="(conditions, i) in props.currData.conditions">
      <el-table :data="conditions.conditionArray" style="width: 100%">
        <el-table-column prop="desc" label="条件描述" width="150" />
        <el-table-column prop="attrs_desc" label="内容描述" width="400" />
        <el-table-column prop="isNot" label="取反" width="80" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-link type="primary" @click="deleteCondition(conditions, scope.$index)">删除</el-link>&nbsp;
            <el-link type="primary" @click="updateCondition(conditions, scope.$index)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt-4" type="success" style="width: 100%" @click="addCondition(conditions)">增加条件</el-button>
      <el-divider v-if="i < props.currData.conditions.length - 1" content-position="center">或</el-divider>
    </template>
    <el-dialog v-model="conditionForm.visitableConditionEdit" :title="conditionForm.addCondition ? '增加条件': '编辑条件'">
      <el-form :model="conditionForm">
        <el-form-item label="条件类型:" label-width="140px">
          <el-select style="width: 70%" :disabled="!conditionForm.addCondition" v-model="conditionForm.type" placeholder="选择一个条件类型" @change="conditionForm.selectChange">
            <el-option
                v-for="item in aiConfig.conditionDocs"
                :key="item.desc"
                :label="item.desc"
                :value="item.type"
            />
          </el-select>
        </el-form-item>
        <template v-for="param in conditionForm.params">
          <el-form-item :label="param.desc + ':'" label-width="140px">
            <el-input-number style="width: 70%" clearable v-model="conditionForm.data[param.name]" v-if="isNumber(param.type)"></el-input-number>
            <el-input clearable v-model="conditionForm.data[param.name]" v-else style="width: 70%"></el-input>
          </el-form-item>
        </template>
        <el-form-item v-if="conditionForm.type !== ''" label="结果:" label-width="140px">
          <el-switch size="large" v-model="conditionForm.not" active-text="取反" inactive-text="正常"/>
        </el-form-item>
      </el-form>

      <template #footer>
              <span class="dialog-footer">
                <el-button @click="conditionForm.visitableConditionEdit = false">取消</el-button>
                <el-button type="success" v-if="conditionForm.addCondition" @click="conditionForm.commit">确定</el-button>
                <el-button type="success" v-else @click="conditionForm.update">确定</el-button>
              </span>
      </template>
    </el-dialog>
    <div style="width: 100%">
      <el-divider v-if="props.currData.conditions.length > 0" />
      <el-button class="mt-4" style="width: 100%" @click="addOrConditions">增加条件组</el-button>
    </div>
  </template>
</template>
<script lang="ts" setup>
import {defineComponent, defineProps, reactive, ref} from "vue";
import {ElMessage, ElMessageBox} from "element-plus";
import {Condition, Conditions} from "../../../preload/utils/Condition";
import {BHTNode} from "../../../preload/utils/BehaviorTree";
import {IAIConfig, IConditionConfig, IConditionParam} from "../../../preload/utils/AiConfig";
import {StringUtil} from "../common/StringUtil";

  const props = defineProps({
    currData: {
      required: true,
    },
  });

  function deleteCondition(conditions: Conditions, index: number) {
    ElMessageBox.confirm('确认要删除条件么?', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      conditions.delCondition(index);
      if (conditions.isEmpty()) {
        const node = props.currData as BHTNode;
        node.delConditions(conditions);
      }
    }).catch(err => {
      if (typeof err !== 'string') {
        console.error(err)
      }
    });
  }

  function addOrConditions() {
    addCondition0(new Conditions(''), true);
  }

  function isNumber(type: string): boolean {
    return StringUtil.isJavaNumberType(type);
  }

  const aiConfig: IAIConfig = window.tool_api.aiConfigJson();
  let currentConditions: Conditions;
  const conditionForm = reactive({
    visitableConditionEdit: false,
    newConditions: false,
    addCondition: false,
    index: 0,
    type: '',
    not: false,
    data: {} as Record<string, string>,
    params: [] as IConditionParam[],
    commit: () => {
      if (conditionForm.type === '') {
        ElMessage.error("没有选择条件类型");
        return;
      }

      conditionForm.data['type'] = conditionForm.type;
      if (conditionForm.not){
        conditionForm.data['not'] = 'true';
      }
      currentConditions.addCondition(new Condition(conditionForm.data))
      if (conditionForm.newConditions) {
        const node = props.currData as BHTNode;
        node.conditions.push(currentConditions);
      }
      conditionForm.visitableConditionEdit = false;
    },

    update: () => {
      let condition = currentConditions.getCondition(conditionForm.index);
      for (let param of conditionForm.params) {
        condition.setAttribute(param.name, conditionForm.data[param.name]);
      }
      if (! conditionForm.not) {
        condition.removeNot();
      }else {
        condition.setNot();
      }
      conditionForm.visitableConditionEdit = false;
    },

    clean: () => {
      conditionForm.addCondition = false;
      conditionForm.index = 0;
      conditionForm.type = '';
      conditionForm.not = false;
      conditionForm.data = {};
      conditionForm.params = [];
    },

    selectChange: () => {
      let find = aiConfig.conditionDocs.find(value => value.type === conditionForm.type);
      if (find !== undefined) {
        conditionForm.params = find.paramDoc;
      }
    }
  });

  function updateCondition(conditions: Conditions, index: number) {
    conditionForm.clean();
    currentConditions = conditions;
    let condition = conditions.getCondition(index);
    conditionForm.type = condition.getAttribute('type');
    conditionForm.data = condition.getAttrKeyValue();
    conditionForm.not = condition.isNot;
    conditionForm.index = index;
    conditionForm.selectChange();
    conditionForm.visitableConditionEdit = true;
  }

  function addCondition(conditions: Conditions) {
    addCondition0(conditions, false);
  }
  function addCondition0(conditions: Conditions, newConditions: boolean) {
    conditionForm.clean();
    currentConditions = conditions;
    conditionForm.addCondition = true;
    conditionForm.newConditions = newConditions;
    conditionForm.visitableConditionEdit = true;
  }
</script>

<style scoped>

</style>
