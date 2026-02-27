import { defineStore } from 'pinia'
import { getDeptTreeByKefan } from '@/api/storage/attendance'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { getGoodsClassificationByRolesMask } from '@/api/storage/system/goodsClassfication'
import { getAllocationInterceptDetail } from '@/api/storage/salary/examine'

export const useSalary = defineStore('useSalary', () => {
  const departmentOptions = ref<any[]>([])
  const departmentProps = ref({
    label: 'name',
    value: 'id',
    children: 'children',
    checkStrictly: false,
    emitPath: true,
    multiple: true
  })
  const currentClassification = ref<
    StorageSystem.GoodsClassfication.CurrentClassificationListItem[]
  >([])
  const currentRolesMask = ref('')
  const allocationInterception = ref(0)
  const accountingMethodOps = getIntDictOptions(DICT_TYPE.ACCOUNTTING_METHOD, true) // 薪资结算方式选项

  /**
   * 获取部门列表
   */
  async function getDepartmentList() {
    try {
      const res = await getDeptTreeByKefan()
      res?.children.pop('')
      departmentOptions.value = res?.children
    } catch (err) {}
  }

  /** 获取当前工种下的分类 */
  async function getCurrentClassificationByRolesMask(roleMask: string) {
    try {
      const res = await getGoodsClassificationByRolesMask({ roleMask })
      currentClassification.value = res
    } catch (error) {}
  }

  /** 获取拦截件剩余产量 */
  async function getAllocationInterceptInfo(dataDate: string) {
    try {
      const res = await getAllocationInterceptDetail({ dataDate })
      allocationInterception.value = res.quantity
    } catch (error) {}
  }

  return {
    departmentOptions,
    departmentProps,
    accountingMethodOps,
    currentClassification,
    currentRolesMask,
    allocationInterception,
    getDepartmentList,
    getCurrentClassificationByRolesMask,
    getAllocationInterceptInfo
  }
})
