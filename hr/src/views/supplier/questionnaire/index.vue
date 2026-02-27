<template>
  <div class="wrapper" v-loading="loading">
    <div class="header">
      <div class="left">
        <span>考核时间：</span>
        <span>{{
          `${dayjs(questionnaireData?.startTime).format('YYYY-MM-DD hh:mm:ss')} ~
          ${dayjs(questionnaireData?.endTime).format('YYYY-MM-DD hh:mm:ss')}`
        }}</span>
      </div>
      <div class="right">
        <div>
          <span>供应商简称：</span>
          <span>{{ questionnaireData?.abbreviationCompany }}</span>
        </div>
        <div class="company">
          <span>公司名称：</span>
          <span>{{ questionnaireData?.fullCompany }}</span>
        </div>
        <div>
          <span>供应商类型：</span>
          <span>{{ getDictLabel(DICT_TYPE.SUPPLIER_TYPE, questionnaireData?.supplierType) }}</span>
        </div>
      </div>
    </div>

    <!-- 问卷内容 -->
    <div class="content" v-loading="submitLoading">
      <div class="title relative">
        <div class="name">
          <span>{{ questionnaireData?.abbreviationCompany }}考核问卷</span>
          <img :src="logo" />
        </div>
      </div>
      <!-- 提交后的结束页面 -->
      <div class="endContent" v-if="hasSubmit">
        <img class="img" src="@/assets/imgs/supplier/questionnaireEndLogo.png" alt="" />
        <div class="info">
          <div class="line1">问卷提交成功</div>
          <div class="line2">感谢您及时完成供应商考核评分问卷</div>
        </div>
      </div>
      <div class="questionList" v-if="!hasSubmit">
        <el-tabs v-model="showMyItem" @tab-change="getData">
          <el-tab-pane :name="0" label="我负责的考核项" />
          <el-tab-pane :name="1" label="全部考核项" />
        </el-tabs>
        <el-scrollbar>
          <div class="card" v-for="(module, index) in questionnaireData?.detailList" :key="index">
            <div class="card_head">
              <span class="card_head_title">{{ module.name }}</span>
              <span class="card_head_score">{{ `(总分${getModuleTotalScore(module)}分)` }}</span>
            </div>
            <div class="card_content">
              <div class="card_content_item" v-for="item in module.itemList" :key="item.id">
                <el-form scroll-to-error ref="formRef" hide-required-asterisk :model="item">
                  <div class="item_header">
                    <div class="item_header_title">
                      <div class="line"></div>
                      <div class="text">{{ item.assessmentItemName }}</div>
                      <div class="score">(分值:{{ item.maxScore }}分)</div>
                    </div>
                    <el-form-item
                      label="得分："
                      prop="score"
                      :rules="[
                        {
                          validator: (rule: any, value: any, callback: any) =>
                            validateScore(rule, value, callback, item)
                        }
                      ]"
                    >
                      <el-input-number
                        :disabled="!item.ratable"
                        :controls="false"
                        v-model="item.score"
                      />
                    </el-form-item>
                  </div>
                  <div class="desc" v-html="handleRules(item.rules)"></div>
                  <div class="remark">
                    <el-form-item v-if="item.ratable">
                      <s-text-area :rows="4" placeholder="请输入备注" v-model="item.comment" />
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <div class="footer">
      <el-button @click="handleBack">返回</el-button>
      <el-button
        v-if="!hasSubmit && questionnaireData?.detailList?.length"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
        >提交问卷</el-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import logo from '@/assets/imgs/supplier/questionnaireLogo.png'
import { getQuiz, saveQuiz } from '@/api/supplier/questionnaire'
import dayjs from 'dayjs'
import { formatDate } from '@/utils/formatTime'
const route = useRoute()
const router = useRouter()
const message = useMessage()
const questionnaireData = ref<any>()
const showMyItem = ref(0)

const getModuleTotalScore = (module: any) => {
  return module?.itemList?.reduce((sum, item: any) => sum + item.maxScore, 0)
}
const handleRules = (rules: any) => {
  const rulesStr = rules.replaceAll('\\n', '\n')
  return rulesStr.replaceAll('\n', '<br/>')
}

// 分数校验
const validateScore = (rule: any, value: any, callback: any, item) => {
  if ((value === '' || value === null || value === undefined) && item.ratable) {
    callback(new Error(`请输入分值`))
  } else if (!/^[0-9]\d*$/.test(value)) {
    callback(new Error(`请输入整数`))
  } else if (value > item.maxScore) {
    callback(new Error(`分值不能超过${item.maxScore}分`))
  } else if (value < 0) {
    callback(new Error(`分值不能小于0`))
  } else {
    callback()
  }
}

const formRef = ref()
const submitLoading = ref(false)
const hasSubmit = ref(false)
const handleSubmit = async () => {
  await Promise.all(formRef.value.map((form) => form.validate()))
  submitLoading.value = true
  try {
    const detailList = [] as any
    questionnaireData.value.detailList.forEach((detail: any) => {
      detailList.push(...detail.itemList)
    })
    const params = {
      ...questionnaireData.value,
      detailList,
      quizId: route.query.quizId
    }
    await saveQuiz(params)
    message.success('提交成功')
    hasSubmit.value = true
    router.push({
      name: 'SupplierQuestionnaireList',
      query: {
        // startTime: formatDate(questionnaireData.value?.startTime, 'YYYY-MM-DD HH:mm:ss'),
        // endTime: formatDate(questionnaireData.value?.endTime, 'YYYY-MM-DD HH:mm:ss')
        period: route.query.period
      }
    })
  } finally {
    submitLoading.value = false
  }
}

async function getData() {
  if (route.query.quizId) {
    loading.value = true
    hasSubmit.value = false
    try {
      const data = await getQuiz(route.query.quizId, { showMyItem: showMyItem.value === 0 })
      if (data && data.detailList) {
        const moduleNameMap = new Set(data.detailList.map((el) => el.assessmentModuleName))
        const detailList = Array.from(moduleNameMap).map((name: string) => {
          const itemList: any[] = []
          data.detailList.forEach((detail: any) => {
            if (detail.assessmentModuleName === name) {
              itemList.push(detail)
            }
          })
          itemList.sort((a, b) => a.assessmentItemSort - b.assessmentItemSort)
          return {
            name,
            itemList
          }
        })
        questionnaireData.value = {
          ...data,
          detailList
        }

        console.log(questionnaireData.value)
      }
    } finally {
      loading.value = false
    }
  }
}

function handleBack() {
  router.push({
    name: 'SupplierQuestionnaireList',
    query: {
      // startTime: formatDate(questionnaireData.value?.startTime, 'YYYY-MM-DD HH:mm:ss'),
      // endTime: formatDate(questionnaireData.value?.endTime, 'YYYY-MM-DD HH:mm:ss')
      period: route.query.period
    }
  })
}

const loading = ref(false)
onMounted(() => {
  getData()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
