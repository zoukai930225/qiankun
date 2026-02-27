<template>
  <div>
    <el-drawer v-model="visible" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968"
      @closed="handleCloseDrawer">
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <div class="contain">
        <el-card>
          <div>
            <Tips>资产审查
              <template #link>
                <el-button :text="true" type="primary" @click="detailHandle()">点击查看 公司详情<el-icon class="el-icon--right">
                    <ArrowRight />
                  </el-icon></el-button>
              </template>
            </Tips>
          </div>
        </el-card>
        <el-card>
          <div>
            <Tips>验厂考核
              <template #link>
                <el-button :text="true" type="primary" @click="detailVerifyHandle()">点击查看 验厂考核<el-icon
                    class="el-icon--right">
                    <ArrowRight />
                  </el-icon></el-button>
              </template>
            </Tips>
          </div>
        </el-card>
        <el-card>
          <div>
            <Tips class="m-bot">综合评估</Tips>
            <div class="assess-item" v-for="item in scoreInfo" :key="item.id">
              <div :class="['score-box', item.assessType !== '1' ? 'notfirst-box' : '']"><span>{{
                item.assessType !== '1' ? (item.assessType === '2' ? '复验' : '终验') : '初验'
                  }}</span>
                <span class="score">{{ item.score }} 分</span>
              </div>
              <div class="radio-box">
                <el-radio-group v-model="item.assessResult">
                  <el-radio value="1" disabled>通过</el-radio>
                  <el-radio value="0" disabled>不通过</el-radio>
                </el-radio-group>
              </div>
              <div>
                <s-text-area v-model="item.assessOpinion" placeholder="请填写具体原因" disabled
                  :autosize="{ minRows: 5, maxRows: 5 }" />
              </div>
            </div>
          </div>
        </el-card>
      </div>
      <!-- <div class="drawerFooter">
      <el-button :disabled="btnDisabled" type="primary" @click="submitHandle">提交</el-button
      >
    </div> -->
    </el-drawer>
    <SupplierInfo ref="supplierRef" :type="formType" />
    <VerifyInfo ref="verifyRef" />
  </div>
</template>
<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getSupplierById, getAssessById } from '@/api/supplier'
import Tips from './tips.vue'
import SupplierInfo from './info.vue'
import VerifyInfo from './verify.vue'
defineOptions({ name: 'ScanInfo' })
const visible = ref(false)
const curId = ref('')
const open = (id: string) => {
  visible.value = true
  curId.value = id
  getData()
  getScoreDate()
}
const scoreInfo = ref([])
const title = ref('')
const list = ref([
  {
    id: '1',
    assessType: '1',
    score: '0',
    assessResult: '',
    assessOpinion: ''
  },
  {
    id: '2',
    assessType: '2',
    score: '0',
    assessResult: '',
    assessOpinion: ''
  },
  {
    id: '3',
    assessType: '3',
    score: '0',
    assessResult: '',
    assessOpinion: ''
  }
])
const formType = ref<'add' | 'edit'>('edit')
// 获取信息
const getData = async () => {
  const res = await getSupplierById(curId.value)
  const { fullCompany } = res
  title.value = fullCompany
}

const convertData = (str: any) => {
  if (!str) {
    return 0
  }
  const num = Number(str) // 转换成数字
  return String(num).replace(/\.00$/, '') // 将数字转回字符串并去掉 .0
}
const getScoreDate = async () => {
  const res = await getAssessById({ supplierId: curId.value })
  if (res && res.length > 0) {
    res.sort((a, b) => {
      return Number(a['assessType']) - Number(b['assessType'])
    })
    scoreInfo.value = res.map((item: any) => {
      return {
        ...item,
        score: convertData(item.score)
      }
    })
  } else {
    scoreInfo.value = list.value
  }
}
// 提交
const btnDisabled = ref(false)
const submitHandle = async () => { }
// 关闭
const handleCloseDrawer = () => {
  visible.value = false
}
// 查看详情
const supplierRef = ref()
const detailHandle = () => {
  supplierRef.value.open(curId.value)
  formType.value = 'edit'
}
const verifyRef = ref()
const detailVerifyHandle = () => {
  verifyRef.value.open(curId.value)
}
defineExpose({
  open
})
onMounted(() => { })
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.m-bot {
  margin-bottom: 20px;
}

.drawerTitle {
  display: flex;
  justify-content: space-between;
}

.drawer {
  background-color: #f6f6f6;

  .el-drawer__header {
    margin-bottom: 0;

    .el-drawer__title {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      font-style: normal;
    }
  }
}

.assess-item {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;

  .score-box {
    display: flex;
    align-items: center;
    font-size: 12px;

    .score {
      font-size: 16px;
      color: #0064ff;
      padding-left: 20px;
      text-align: top;
    }
  }

  .notfirst-box {
    padding-top: 16px;
  }

  .radio-box {
    padding: 10px 0;
  }
}

.el-card {
  border-radius: 8px;

  &+.el-card {
    margin-top: 20px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
