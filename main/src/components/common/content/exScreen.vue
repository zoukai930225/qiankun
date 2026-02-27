<template>
  <el-card shadow="never" class="ex-screen" ref="bodyRef" :body-class="!isDetails ? 'list_body' : 'details_body'">
    <el-scrollbar :height="height" class="ex-screen-scrollbar">
      <div class="ex-screen-body">
        <slot></slot>
      </div>
      <el-backtop v-if="isSite" :target="`.ex-screen-scrollbar .el-scrollbar__wrap`" :right="site.right"
        :bottom="site.bottom" />
    </el-scrollbar>
    <template #footer v-if="isDetails">
      <el-button @click="goBack">返回</el-button>
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script lang="ts">
export default { name: 'ExScreen' }
</script>

<script lang="ts" setup>
import { closeCurrentTag, toPrevView } from '@/utils/index'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { consistency } from '@/utils'

const props = defineProps({
  site: { type: Object, default: () => ({ right: 40, bottom: 60 }) },
  isDetails: { type: Boolean, default: false },
  isSite: { type: Boolean, default: true },
  name: { type: String, default: '' }
})

const { dataValue, bukValue, viewType } = inject(`${props.name}Details`, {
  dataValue: {},
  bukValue: {},
  viewType: 'view'
}) as any

let observer: ResizeObserver | null = null

const bodyRef = ref(), height = ref<number>(500), width = ref<number>(500);

const { getRouteInfo } = useRouteInfo()

const router = useRouter()

const goBack = () => {
  if (props.isDetails) {
    if (viewType.value !== 'view') {
      consistency(dataValue.value, bukValue.value, () => {
        backToPage()
      })
    } else {
      backToPage()
    }
  }
}

const backToPage = (name: string = '', query: any = {}) => {
  if (getRouteInfo(props.name)) {
    closeCurrentTag(router.currentRoute, router.push)
    const queryInfo: any = name === 'refresh' ? { operate: 'refresh', ...query } : {}
    router.push({ path: getRouteInfo(props.name), query: { ...queryInfo } })
  } else {
    toPrevView(router.currentRoute, router.push)
  }
}

const setHeight = (h: number, w: number) => {
  setTimeout(() => {
    height.value = h - (props.isDetails ? 76 : 24);
    width.value = w - 30;
  }, 500);
};

const handleResize = (entries: any) => {
  for (const entry of entries) {
    const { height, width } = entry.contentRect;
    setHeight(height, width);
  }
}

const onResize = () => {
  setTimeout(() => {
    if (bodyRef?.value?.$el?.offsetHeight) {
      height.value = (bodyRef.value.$el.offsetHeight - (props.isDetails ? 78 : 26));
      width.value = bodyRef.value.$el.offsetWidth - 30;
    }
  }, 500)
}

watchEffect(() => {
  onResize()
})

onMounted(() => {
  onResize()
  window.addEventListener('resize', onResize)
  observer = new ResizeObserver(handleResize)
  bodyRef?.value?.$el && observer.observe(bodyRef.value.$el)
})

onUnmounted(() => {
  observer && observer.disconnect();
  window.removeEventListener('resize', onResize);
});

defineExpose({ goBack, backToPage, height, width });

</script>
<style lang="scss" scoped>
.ex-screen {
  height: calc(100vh - var(--tags-view-item-height) - var(--top-tool-height) - var(--app-content-padding) - 12px);
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 8px;

  .ex-screen-body {
    height: 100%;
    padding-right: 12px;
  }

  :deep() {
    .el-card__body {
      padding: 12px 5px 12px 12px;
    }

    .el-form-item {
      vertical-align: top;
      margin: 0 0 16px 0;
    }

    .el-form-item__label {
      color: #666;
      font-size: 14px;
    }

    .list_body {
      height: calc(100% - 24px);
    }

    .details_body {
      height: calc(100% - 76px);
    }

    .el-card__footer {
      text-align: right;
      border-top: none;
      box-shadow: 0 -4px 10px #0000000a;
      padding: 10px;
    }

    .el-scrollbar__bar.is-vertical {
      width: 10px;

      .el-scrollbar__thumb {
        // background-color: #000 !important
      }
    }

    .table-form {
      .el-form-item {
        margin: 0 !important;

        &.is-error {
          margin-bottom: 15px !important;
        }
      }
    }
  }
}
</style>
