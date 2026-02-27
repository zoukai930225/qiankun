import { getScWarehouseApi, getSupplierListByUserApi } from '@/api/supplier/appoint'
import { getScPersonsApi } from '@/api/supplier/purchase'
import { getAvailableSuppliersApi } from '@/api/supplier/supplierProduct'
import { defineStore } from 'pinia'

export const useSupplierProduct = defineStore('useSupplierProduct', () => {
  const supplierList = ref<Supplier.SupplierProduct.SupplierBasicInfoBO[]>([])
  const personList = ref<
    { userId: string; avatarOrigin: string; name: string; jobName?: string }[]
  >([])

  let timer: NodeJS.Timeout | null
  async function getSupplierList() {
    if (timer) clearTimeout(timer)

    timer = setTimeout(async () => {
      if (supplierList.value.length) return
      try {
        const res = await getAvailableSuppliersApi()
        supplierList.value = (res ?? []).map((ele) => ({
          value: ele.supplierId,
          label: ele.supplierName
        }))
      } catch (error) {
        console.log(error)
      } finally {
        if (timer) clearTimeout(timer)
      }
    }, 200)
  }

  async function getgetScPersons(orderHandlerList?: any[]) {
    try {
      const res = await getScPersonsApi()
      if (orderHandlerList) {
        const alreadyMap = new Map(orderHandlerList?.map((ele) => [ele.userId, ele]))
        personList.value = res.filter((ele) => !alreadyMap.has(ele.userId))
      } else {
        personList.value = res
      }
    } catch (error) {}
  }

  getSupplierList()

  return {
    supplierList,
    personList,
    getSupplierList,
    getgetScPersons
  }
})

export const useSupplierAppointment = defineStore('useSupplierAppointment', () => {
  const receivingWarehouseOps = ref<{ value: string; label: string }[]>([])
  const supplierIdOptions = ref<{ value: string; label: string }[]>([])

  /** 获取仓库列表 */
  async function getReceivingWarehouseOps() {
    if (receivingWarehouseOps.value.length > 0) return
    try {
      const res = await getScWarehouseApi()
      if (res) {
        receivingWarehouseOps.value = res.map((item: Supplier.Product.ReceivingWarehouseVo) => ({
          label: item.name,
          value: item.id
        }))
      }
    } catch (error) {}
  }

  async function getSupplierIdOptions() {
    supplierIdOptions.value = (await getSupplierListByUserApi()).map((ele) => ({
      value: ele.id,
      label: ele.abbreviationCompany
    }))
  }

  return {
    /** 仓库列表 */
    receivingWarehouseOps,
    /** 获取仓库列表 */
    getReceivingWarehouseOps,
    /** 供应商列表 */
    supplierIdOptions,
    /** 获取供应商下拉列表 */
    getSupplierIdOptions
  }
})
