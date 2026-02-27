<script lang="ts" setup>
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import { useLocaleStore } from '@/store/modules/locale'
import { getAccessToken, getTenantId } from '@/utils/auth'
import { isNumber } from '@/utils/is'
import { propTypes } from '@/utils/propTypes'
import { i18nChangeLanguage, IDomEditor, IEditorConfig } from '@wangeditor/editor'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { ElMessage } from 'element-plus'
import { PropType } from 'vue'

defineOptions({ name: 'Editor' })

type InsertFnType = (url: string, alt: string, href: string) => void

const localeStore = useLocaleStore()

const currentLocale = computed(() => localeStore.getCurrentLocale)

i18nChangeLanguage(unref(currentLocale).lang)

const props = defineProps({
  editorId: propTypes.string.def('wangeEditor-1'),
  height: propTypes.oneOfType([Number, String]).def('500px'),
  editorConfig: {
    type: Object as PropType<Partial<IEditorConfig>>,
    default: () => undefined
  },
  readonly: propTypes.bool.def(false),
  isToolbar: propTypes.bool.def(true),
  modelValue: propTypes.string.def(''),
  hideFullScreen: propTypes.bool.def(false)
})

const emit = defineEmits(['change', 'update:modelValue'])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef<IDomEditor>()

const valueHtml = ref('')

watch(
  () => props.modelValue,
  (val: string) => {
    if (val === unref(valueHtml)) return
    valueHtml.value = val
  },
  {
    immediate: true
  }
)

// 监听
watch(
  () => valueHtml.value,
  (val: string) => {
    console.log(val, '??????')
    emit('update:modelValue', val)
  }
)

const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor
}

// 编辑器配置
const editorConfig = computed((): IEditorConfig => {
  return Object.assign(
    {
      placeholder: '请输入内容...',
      readOnly: props.readonly,
      customAlert: (s: string, t: string) => {
        switch (t) {
          case 'success':
            ElMessage.success(s)
            break
          case 'info':
            ElMessage.info(s)
            break
          case 'warning':
            ElMessage.warning(s)
            break
          case 'error':
            ElMessage.error(s)
            break
          default:
            ElMessage.info(s)
            break
        }
      },
      autoFocus: false,
      scroll: true,
      MENU_CONF: {
        ['uploadImage']: {
          // server: import.meta.env.VITE_UPLOAD_URL,
          server: import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/oss/upload',
          // 单个文件的最大体积限制，默认为 2M
          maxFileSize: 5 * 1024 * 1024,
          // 最多可上传几个文件，默认为 100
          maxNumberOfFiles: 10,
          // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
          allowedFileTypes: ['image/*'],

          // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
          meta: { bussinessCode: UPLOAD_FILE_BISSONESSCODE.COMMON },
          // 将 meta 拼接到 url 参数中，默认 false
          metaWithUrl: true,

          // 自定义增加 http  header
          headers: {
            Accept: '*/*',
            token: getAccessToken(),
            'tenant-id': getTenantId()
          },

          // 跨域是否传递 cookie ，默认为 false
          withCredentials: true,

          // 超时时间，默认为 10 秒
          timeout: 5 * 1000, // 5 秒

          // form-data fieldName，后端接口参数名称，默认值wangeditor-uploaded-image
          fieldName: 'file',

          // 上传之前触发
          onBeforeUpload(file: File) {
            console.log(file)
            return file
          },
          // 上传进度的回调函数
          onProgress(progress: number) {
            // progress 是 0-100 的数字
            console.log('progress', progress)
          },
          onSuccess(file: File, res: any) {
            console.log('onSuccess', file, res)
          },
          onFailed(file: File, res: any) {
            console.log('onFailed', file, res)
          },
          onError(file: File, err: any, res: any) {
            console.error('onError', file, err, res)
          },
          // 自定义插入图片
          customInsert(res: any, insertFn: InsertFnType) {
            insertFn(res.data, 'image', res.data)
          }
        }
      },
      uploadImgShowBase64: true,
      hoverbarKeys: {
        text: {
          menuKeys: [
            // 'headerSelect',
            'insertLink',
            'bulletedList',
            '|',
            // 'bold',
            'through',
            'color',
            'bgColor',
            'clearStyle'
          ]
        }
      }
    },
    props.editorConfig || {}
  )
})

const editorStyle = computed(() => {
  return {
    height: isNumber(props.height) ? `${props.height}px` : props.height
  }
})

// 回调函数
const handleChange = (editor: IDomEditor) => {
  emit('change', editor)
}

// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = unref(editorRef.value)

  // 销毁，并移除 editor
  editor?.destroy()
})

const toolBarConfig = {
  toolbarKeys: [
    // 'headerSelect',
    // '|',
    'color',
    'bgColor',
    // 'bold',
    'italic',
    'through',
    'underline',
    'bulletedList',
    'numberedList',
    'fontSize',
    'lineHeight',
    'delIndent',
    'indent',
    'divider',
    'justifyCenter',
    'justifyJustify', // 两端对齐
    'justifyLeft', // 左对齐
    'justifyRight', // 右对齐
    'undo', // 撤销
    'redo', // 重做
    'clearStyle', // 清除格式
    'uploadImage', // 上传图片
    'fullScreen', // 全屏
    'todo'
  ]
}

if (props.hideFullScreen) {
  toolBarConfig.toolbarKeys = toolBarConfig.toolbarKeys.filter((item) => item !== 'fullScreen')
}

const getEditorRef = async (): Promise<IDomEditor> => {
  await nextTick()
  return unref(editorRef.value) as IDomEditor
}

defineExpose({
  getEditorRef
})
</script>

<template>
  <div class="border-1 border-solid border-[var(--tags-view-border-color)]">
    <!-- 工具栏 -->
    <Toolbar v-if="isToolbar" :editor="editorRef" :editorId="editorId" :defaultConfig="toolBarConfig"
      class="border-0 b-b-1 border-solid border-[var(--tags-view-border-color)]" />
    <!-- 编辑器 -->
    <Editor v-model="valueHtml" :defaultConfig="editorConfig" :editorId="editorId" :style="editorStyle"
      @on-change="handleChange" @on-created="handleCreated" />
  </div>
</template>

<style src="@wangeditor/editor/dist/css/style.css"></style>

<style scoped>
:deep(.w-e-text-container p) {
  white-space: normal !important;
  word-break: break-all !important;
  line-break: anywhere;
  height: auto;
}
</style>
