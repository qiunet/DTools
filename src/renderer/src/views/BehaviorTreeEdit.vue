<template>
  <el-container style="height: 100%">
    <el-aside width="250px">
      <el-tree
          style="height: 100%;"
          ref="treeRef"
          node-key="id"
          :data="treeData.files"
          class="filter-tree"
          @node-click="treeNodeClick"
          @node-contextmenu="rightClick"
          default-expand-all
          :props="treeData.defaultProps"
          :highlight-current="true"
          :allow-drag="allowDrag"
          :allow-drop="dragDrop"
          draggable
      >
        <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span><el-icon size="16" v-html="data.icon()"></el-icon></span>
          <span>&nbsp;&nbsp;</span>
          <span>{{ node.label }}</span>
        </span>
        </template>
      </el-tree>
      <el-dialog v-model="newActionForm.newActionVisible" title="新建行为节点">
        <el-form :model="newActionForm">
          <el-form-item label="选择行为类型:" label-width="140px">
            <el-select style="width: 70%" v-model="newActionForm.clazz" placeholder="选择一个行为类型" @change="newActionForm.clazzChange">
              <el-option
                  v-for="item in aiConfig.actionDocs"
                  :key="item.desc"
                  :label="item.desc"
                  :value="item.name"
              />
            </el-select>
          </el-form-item>
          <template v-for="doc in newActionForm.paramsDoc">
            <el-form-item :label="doc.desc" label-width="140px">
              <el-input-number style="width: 70%" clearable v-model="newActionForm.params[doc.name]" v-if="isNumberType(doc.type)"></el-input-number>
              <el-input clearable v-model="newActionForm.params[doc.name]" v-else style="width: 70%"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="newActionForm.newActionVisible = false">取消</el-button>
              <el-button type="primary" @click="newActionForm.commit">确定</el-button>
            </span>
        </template>
      </el-dialog>
      <vue3-menus :open="open" :event="event" :menus="menus">
        <template #label="{menu, index, activeIndex}">{{ menu.label }}</template>
      </vue3-menus>
    </el-aside>
    <el-main>
      <el-container style="height: 100%">
        <el-main>
          <template v-if="currData !== undefined">
            <el-container style="height: 100%">
              <el-header height="200px">
                <el-divider content-position="left">{{ currData.name }}</el-divider>
                <v-bht-node-param-edit v-if="currData.nodeName === 'action'" :curr-data="currData" />
              </el-header>

              <el-main style="margin: 20px">
                <v-condition-edit :currData="currData" />
              </el-main>

            </el-container>
          </template>
        </el-main>
        <el-footer height="100px" style="margin-right: 50px;">
          <el-row :gutter="2" justify="end" style="width: 100%;">
            <el-col :span="4"><el-button @click="$router.push('/Bht')" style="width: 100px; float: right" plain>取消</el-button></el-col>
            <el-col :span="4"><el-button @click="saveConfig" style="width: 100px; float: right" type="success" plain>保存</el-button></el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {TreeNode} from "element-plus/es/components/tree-v2/src/types";
import {
  BehaviorAction,
  BHTNode, InvertNode, ParallelExecutor,
  RandomExecutor, RepeatNode,
  RootExecutor,
  SelectorExecutor,
  SequenceExecutor
} from "../../../preload/utils/BehaviorTree";
import {defineComponent, nextTick, reactive, ref} from "vue";
import {ElMessage, ElMessageBox, ElTree} from "element-plus";
import {RClickMenu} from "../common/RClickMenu";
import {useRoute} from "vue-router";
import vConditionEdit from './../components/ConditionEdit.vue';
import vBhtNodeParamEdit from './../components/BhtNodeParamEdit.vue';
import {IAIConfig, IBhtActionConfig, IBhtActionParam} from "../../../preload/utils/AiConfig";
import {StringUtil} from "../common/StringUtil";

export default defineComponent({

  components: {
    vConditionEdit,
    vBhtNodeParamEdit
  },

  setup() {
    const route = useRoute();
    const filename: string = <string> route.params.file;

    const xmlFilePath = window.path.join(window.tool_api.setting().aiCfgPathSelect.current, filename);
    let executor = RootExecutor.parse(window.tool_api.xmlObject(xmlFilePath));

    const treeData = reactive({
      files: [executor],

      defaultProps : {
        children: 'children',
        label: 'name',
      },
    });

    let currNode: TreeNode;
    let currData = ref();
    const open = ref(false);
    const event = ref({});

    function treeNodeClick(node: any, data: TreeNode) {
      currNode = data;
      open.value = false;
      currData.value = currNode.data;
    }

    function rightClick(e: PointerEvent, node: any, data: TreeNode) {
      open.value = false;
      nextTick(() => {
        currNode = data;
        event.value = e;
        open.value = true;
        e.preventDefault();
      });
    }

    const aiConfig = ref(window.tool_api.aiConfigJson());

    const menus = ref([
        new RClickMenu("编辑", "编辑节点",
            () => {currData.value = currNode.data;},
            '<svg class="icon" viewBox="0 0 1024 1024"xmlns="http://www.w3.org/2000/svg" width="1em" height="1em"><path d="M699.733333 597.333333v34.133334a34.133333 34.133333 0 0 1-34.133333 34.133333H358.4a34.133333 34.133333 0 0 1-34.133333-34.133333v-34.133334h375.466666z" fill="#2c2c2c" p-id="2049"></path><path d="M614.4 85.333333a34.133333 34.133333 0 0 1 2.56 68.164267L614.4 153.6H204.8v716.8h614.4V363.264a34.133333 34.133333 0 0 1 68.181333-2.56l0.085334 2.56V870.4a68.266667 68.266667 0 0 1-64.853334 68.181333L819.2 938.666667H204.8a68.266667 68.266667 0 0 1-68.181333-64.853334L136.533333 870.4V153.6a68.266667 68.266667 0 0 1 64.853334-68.181333L204.8 85.333333h409.6z" fill="#2c2c2c" p-id="2050"></path><path d="M821.077333 111.616a34.133333 34.133333 0 0 1 49.117867 47.325867l-2.048 2.116266-349.696 332.629334a34.133333 34.133333 0 0 1-49.083733-47.325867l2.048-2.133333L821.077333 111.616z" fill="#2c2c2c" p-id="2051"></path></svg>',
            () => false, true,),

        new RClickMenu("新建顺序执行器", "顺序执行器",
            () => {
              createExecutor("顺序执行器", (name) => new SequenceExecutor({name: name}))
            }, RootExecutor.SEQUENCE_ICON,
            (): boolean => {
              return ! currNode.data.canAddChild;
            }
        ),
      new RClickMenu("新建选择执行器", "选择执行器",
          () => {
            createExecutor("选择执行器", (name) => new SelectorExecutor({name: name}))
          }, RootExecutor.SELECTOR_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild;
          }
      ),
      new RClickMenu("新建随机执行器", "随机执行器",
          () => {
            createExecutor("随机执行器", (name) => new RandomExecutor({name: name}))
          }, RootExecutor.RANDOM_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild;
          }
      ),
      new RClickMenu("新建并行执行器", "并行执行器",
          () => {
            createExecutor("并行执行器", (name) => new ParallelExecutor({name: name}))
          }, RootExecutor.PARALLEL_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild
          },
          true
      ), new RClickMenu("新建反转装饰节点", "反转装饰节点",
          () => {
            currNode.data.children.push(new InvertNode({}))
          }, RootExecutor.INVERT_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild
          },
          false
      ), new RClickMenu("新建重复装饰节点", "重复装饰节点",
          () => {
            ElMessageBox.prompt('请输入重复次数!', `新建重复装饰节点`,
            {confirmButtonText: '创建', cancelButtonText: '取消', inputPattern: /[0-9]+/, inputErrorMessage: '请输入数字类型'}
            ).then(({ value }) => {
              if ( parseInt(value) < 2) {
                return ElMessage.error("请输入大于1的数值");
              }
              currNode.data.children.push(new RepeatNode({count: value}));
              ElMessage({type: 'success', message: `创建成功`,})
            }).catch((err) => {
              if (typeof err !== 'string')console.error(err);
            })
          }, RootExecutor.REPEAT_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild
          },
          true
      ),
      new RClickMenu("新建行为", "新建行为节点",
          () => {newActionForm.newActionVisible = true;}, RootExecutor.ACTION_ICON,
          (): boolean => {
            return ! currNode.data.canAddChild;
          }, true
      ),
        new RClickMenu('删除', '删除该节点以及子节点',
            () => {
              ElMessageBox.confirm('确定删除节点及其子节点吗?')
                  .then(() => {
                    let parent: TreeNode | undefined = currNode.parent;
                    if (parent === undefined) {
                      return;
                    }
                    const arr: any[] = parent.data.children;
                    const index = arr.findIndex(d => d.id === currNode.data.id) ;
                    parent.data.children.splice(index, 1);
                  }).catch(() => {
                // catch error
              });
            },
            '<svg class="icon" width="1em" height="1em" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M341.312 85.312l64-85.312h213.376l64 85.312H960v85.376H64V85.312h277.312zM170.688 256h682.624v768H170.688V256zM256 341.312v597.376h512V341.312H256z m213.312 85.376v426.624H384V426.688h85.312z m170.688 0v426.624H554.688V426.688H640z" fill="#2c2c2c" p-id="2045"></path></svg>',
            (): boolean => {
              return currNode.data.nodeName === 'root';
            }
        ),
    ]);

    function createExecutor(nodeName: string, create: (name: string) => BHTNode) {
      ElMessageBox.prompt('请输入节点名称, 不能与现有重复!', `新建${nodeName}节点`, {confirmButtonText: '创建', cancelButtonText: '取消',}).then(({ value }) => {
        currNode.data.children.push(create(value));
        ElMessage({type: 'success', message: `创建 ${value} 成功`,})
      }).catch((err) => {
        console.error(err);
        ElMessage({type: 'info', message: '取消...',})
      })
    }

    function isNumberType(type: string): boolean {
      return StringUtil.isJavaNumberType(type);
    }

    function allowDrag(node: any) {
      // root 不让调动
      return node.data.nodeName !== 'root';
    }

    function dragDrop(node: any, next: any, type: string): boolean {
      if (node === next) {
        return false;
      }

      if(next.data.nodeName === 'root' && type !== 'inner') {
        return false;
      }

      if (next.data.nodeName == 'action' && type === 'inner') {
        return false;
      }

      return true;
    }

    function saveConfig() {
      window.tool_api.saveToXml(executor.toXmlObject(), xmlFilePath)
      ElMessage.success("保存成功")
    }
    const newActionForm = reactive({
      newActionVisible: false,
      clazz : '',
      params: {},
      paramsDoc: [] as Array<IBhtActionParam>,
      commit: () => {
        currNode.data.children.push(new BehaviorAction({clazz: newActionForm.clazz, params: newActionForm.params}));
        ElMessage({type: 'success', message: `创建成功`,})
        newActionForm.newActionVisible = false;
      },

      clazzChange: () => {
        const config:IAIConfig = window.tool_api.aiConfigJson();
        const find: IBhtActionConfig|undefined = config.actionDocs.find((action) => action.name === newActionForm.clazz);
        if (find === undefined) {
          return;
        }
        newActionForm.paramsDoc = find.params;
      }
    });


    return {
      open,
      event,
      menus,
      aiConfig,
      dragDrop,
      treeData,
      currData,
      allowDrag,
      saveConfig,
      rightClick,
      isNumberType,
      treeNodeClick,
      newActionForm
    }
  }
});
</script>

<style scoped>

</style>
