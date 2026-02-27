import { store } from '@/store'
import { defineStore } from 'pinia'

interface ImagePathStore {
  imagePath: string // 图片路径属性
}

export const useImagePathStore = defineStore('image-path', {
  state: (): ImagePathStore => ({
    imagePath: '' // 初始化图片路径属性
  }),
  getters: {
    getImagePath(): string {
      return this.imagePath
    }
  },
  actions: {
    async setImagePath(imagePath: string) {
      this.imagePath = imagePath
    },
    resetImagePath() {
      this.imagePath = ''
    }
  }
})

export const useImagePathStoreWithOut = () => {
  return useImagePathStore(store)
}
