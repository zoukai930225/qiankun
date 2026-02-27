<template>
  <div>
    <el-drawer v-bind="$attrs" :append-to-body="true" v-model="modelValue" :size="drawerWidth" :with-header="true"
      @open="open" @close="handleClose" :before-close="handleBeforClose" :close-on-click-modal="closeOnClickModal"
      :style="{ 'border-radius': borderRadius }" class="SWDrawer-background" :show-close="false" :body-class="bodyClass"
      @closed="handleClosed">
      <template #header="{ }">
        <div class="flex justify-between">
          <div class="SWDrawer-header">
            <span v-if="!$slots.header" style="font-size: 16px; font-weight: 600; color: #333333">{{
              title
            }}</span>
            <slot name="header"></slot>
          </div>

          <div class="mb-16px">
            <el-link v-if="fullscreenBtn" type="info" :underline="false" class="mr-12px"
              @click="fullscreen = !fullscreen">
              <Icon icon="ep:full-screen" :size="20" />
            </el-link>

            <el-link type="info" :underline="false" @click="handleClose">
              <Icon icon="ep:close" :size="20" />
            </el-link>
          </div>
        </div>
      </template>
      <slot></slot>
      <template #footer v-if="showBottom">
        <div class="swDrawer-footer px-20px">
          <slot name="footer"></slot>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import { DrawerProps } from 'element-plus'

const props = withDefaults(
  defineProps<
    Partial<DrawerProps> & {
      width?: string | number
      title?: string
      showBeforClose?: boolean
      showBottom?: boolean
      modelValue: boolean
      closeOnClickModal?: boolean
      bodyClass?: any
      fullscreenBtn?: boolean
    }
  >(),
  {
    width: 936,
    title: '',
    showBeforClose: false,
    showBottom: true,
    modelValue: false,
    closeOnClickModal: true
  }
)

const fullscreen = ref(false)

const modelValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

onMounted(() => { })

const open = () => {
  emit('open')
}
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
  emit('closed')
}
const handleBeforClose = (done: () => void) => {
  if (props.showBeforClose) {
    emit('before-close', done)
  } else {
    done()
    emit('update:modelValue', false)
    emit('close')
    emit('closed')
  }
}

const borderRadius = computed(() => (fullscreen.value ? '0 !important' : '8px 0px 0px 8px'))
const drawerWidth = computed(() => (fullscreen.value ? '100%' : props.width))

function handleClosed() {
  emit('closed')
  emit('closed')
}

const emit = defineEmits(['close', 'open', 'update:modelValue', 'before-close', 'closed'])

defineExpose({ handleClose })
</script>

<style lang="scss" scoped>
.swDrawer-footer {
  height: 52px;
  /* 自动布局 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 0px 0px 8px 8px;
  background: #ffffff;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
}
</style>

<style lang="scss">
.SWDrawer-background {
  .el-drawer__header {
    background: #f8f8f9;
    margin-bottom: 0px;
    padding-bottom: 0px;
    box-sizing: border-box;
    border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-color: #f0f0f0;
  }

  .el-drawer__close-btn {
    margin-bottom: 16px;
    margin-right: -5px;
  }

  .el-drawer__footer {
    margin-bottom: 0px;
    padding: 0px !important;
  }

  .el-drawer {
    background: #f8f8f9;
  }

  .el-drawer__body {
    background: #f8f8f9;
    margin: 0px !important;
    padding-bottom: 0px !important;
    overflow: auto;
  }
}
</style>
