<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({ name: 'Logo' })

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse);

// const collapse = computed(() => appStore.getCollapse)

onMounted(() => {
  // if (unref(collapse)) show.value = false
})



// watch(
//   () => collapse.value,
//   (collapse: boolean) => {
//     if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
//       show.value = true
//       return
//     }
//     if (!collapse) {
//       setTimeout(() => {
//         show.value = !collapse
//       }, 400)
//     } else {
//       show.value = !collapse
//     }
//   }
// )

// watch(
//   () => layout.value,
//   (layout) => {
//     if (layout === 'top' || layout === 'cutMenu') {
//       show.value = true
//     } else {
//       if (unref(collapse)) {
//         show.value = false
//       } else {
//         show.value = true
//       }
//     }
//   }
// )
</script>

<template>
  <div class="view_btn">
    <router-link :class="[
      prefixCls,
      layout !== 'classic' ? `${prefixCls}__Top` : '',
      'flex !h-[var(--logo-height)] items-center cursor-pointer pl-22px relative decoration-none overflow-hidden'
    ]" to="/">
      <!-- <img class="h-[calc(var(--logo-height)-10px)] w-[calc(var(--logo-height)-10px)]" src="@/assets/imgs/logo.png"
        style="border-radius: 15px" />
      <div v-if="show" :class="['ml-10px text-20px font-500 logo-title-text-color']">
        {{ title }}
      </div> -->
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.view_btn {
  display: inline-flex;
  height: var(--top-tool-height);
  line-height: var(--top-tool-height);
}

.logo-title-text-color {
  // color: var(-logo-title-text-color);
  color: #333;
}

// .expand_btn {
//   height: var(--top-tool-height);
//   line-height: var(--top-tool-height);
//   display: inline-block;
//   border: none !important;
//   margin-left: 12px;
//   padding: 0px;

//   :deep() {
//     .el-icon {
//       width: 20px;
//       height: var(--top-tool-height);
//       line-height: var(--top-tool-height);

//       svg {
//         width: 20px;
//         height: 20px;
//       }
//     }
//   }
// }
</style>
