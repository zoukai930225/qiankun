import mitt, { Emitter } from 'mitt'

type Events = {
  'form:beforeSubmit': void
  'form:submit': void
  'upload:cleanupComplete': { success: boolean; error?: any } // transfer.vue删除oss文件成功或失败
  'upload:delete': void // transfer.vue删除oss文件用
}

const eventBus: Emitter<Events> = mitt<Events>()

export default eventBus
