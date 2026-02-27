import * as OtrEvaluationRelationshipApi from '@/api/otr/evaluationRelationship/index'
export const memberTypeList = ref([
  {
    type: 0,
    value: '被评价人'
  },
  {
    type: 1,
    value: '本人'
  },
  {
    type: 2,
    value: '直接上级'
  },
  {
    type: 3,
    value: '同事'
  },
  {
    type: 4,
    value: '下级'
  },
  {
    type: 5,
    value: '其他'
  },
  // {
  //   type: 6,
  //   value: '间接上级'
  // },
  {
    type: 7,
    value: '斜线上级'
  }
])

export const suveryList = ref([])

// 根据问卷id 查询 可以设置的评价关系
export const getBySurveyId = async (questionnaireId) => {
  const data = await OtrEvaluationRelationshipApi.getBySurveyId(questionnaireId).catch(() => {})
  if (data) {
    suveryList.value = data || []
  }
}

// 0:被评价人 1-本人 2-直接上级 3-同事 4-下级 5-其他 6-间接上级 7-斜线上级
export const isShowSurveyInfo = (type: Number) => {
  if (type === 0) {
    return true
  } else {
    let isExist = false
    suveryList.value.forEach((item) => {
      if (item && Number(item) === type) {
        isExist = true
      }
    })
    return isExist
  }
}
