import { defineStore } from 'pinia'
import { ElLoading } from 'element-plus'
import { ref } from 'vue'

/**
 * 全局loading
 */
export const useLoadingStore = defineStore('loading', () => {
  const loadingInstance = ref<any>(null)
  const loadingCount = ref(0)

  /**
   * 显示loading
   */
  function showLoading() {
    loadingCount.value++
    if (loadingCount.value === 1) {
      loadingInstance.value = ElLoading.service({
        lock: true
      })
    }
  }

  /**
   * 隐藏loading
   */
  function hideLoading() {
    if (loadingCount.value > 0) {
      loadingCount.value--
    }
    if (loadingCount.value === 0 && loadingInstance.value) {
      loadingInstance.value.close()
      loadingInstance.value = null
    }
  }

  /**
   * 重置loading
   */
  function resetLoading() {
    if (loadingInstance.value) {
      loadingInstance.value.close()
      loadingInstance.value = null
    }
    loadingCount.value = 0
  }

  return {
    loadingInstance,
    loadingCount,
    showLoading,
    hideLoading,
    resetLoading
  }
})
