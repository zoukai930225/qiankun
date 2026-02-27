<template>
  <el-dialog v-model="dialogVisible" :title="dialogTitle" ref="formRef" width="60%">
    <div class="content-wapper">
      <div class="flex-column">
        <div class="flex-column flex-right">
          <div ref="textRef" class="rich-editor" :contenteditable="true" @blur="onBlur"></div>
          <el-button type="primary" style="width: 100px; margin-right: 20px" @click="submit"
            >确定</el-button
          >
        </div>

        <div class="flex-row bottom-container">
          <div class="dic-left">
            <span class="dic-title">字典引用</span>
            <div
              v-for="(value, index) in tags"
              :key="index"
              @click="tapTag(value, index)"
              class="tagItem"
              :class="{ active: currentIndex == index }"
            >
              <div class="tagSelect-text">{{ value.name }}</div>
            </div>
          </div>
          <div class="dic-desc">
            {{ tags[currentIndex]?.desc || '' }}
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  getColumnName,
  sysExpressionList,
  sysExpressionUpdate,
  getDetailById
} from '@/api/system/dynamicTableDic/index'
defineOptions({ name: 'SystemDictTypeForm' })
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('公式编辑器') // 弹窗的标题
const formRef = ref() // 表单 Ref

interface RichDataVO {
  id: string | undefined
  value: string
  index: number
}

const currentId = ref() //当前id
const tags = ref([
  { name: undefined, desc: undefined, value: undefined, type: undefined, expression: undefined }
]) //数据库 基础字段+新增字段集合
const currentIndex = ref(0) // 当前点击的第几个tags

const textRef = ref<HTMLDivElement>()
const range = shallowRef<Range>()
const selection = shallowRef<Selection | null>(null)
/**
 * @description 输入框失焦 获取到最后的输入框信息
 */
const onBlur = () => {
  selection.value = window.getSelection()
  range.value = selection.value?.getRangeAt(0)
}

onMounted(() => {
  setTimeout(() => {
    textRef.value?.focus()
  })
})

// 点击基础字段
const tapTag = (value, index) => {
  currentIndex.value = index
  const item: RichDataVO = {
    id: `${index}`,
    value: value.name,
    index: index
  }
  getSpanTag(item)
}

const emit = defineEmits(['success'])
const submit = async () => {
  if (!textRef.value!.innerHTML) {
    message.error('请输入公式')
    return
  }
  const text = formatParams(getTextAndParams())

  const params = {
    id: currentId.value,
    expression: text,
    filedName: currentItem.value.filedName,
    filed: currentItem.value.filed,
    filedDescribe: currentItem.value.filedDescribe,
    expressionHtml: textRef.value!.innerHTML || ''
  }

  await sysExpressionUpdate(params)
  message.success('操作成功')
  dialogVisible.value = false
  emit('success')
  textRef.value!.innerHTML = ''
}

// 格式化需要传给后端的数据格式
const formatParams = (obj) => {
  console.log(obj, 'ongjjgg')

  if (!obj.text) return ''
  const arr = obj.params.map((item) => item.name)
  const tagsMap = new Map(tags.value.map((item) => [item.name, item]))

  const resultStr = arr.reduce((str, item) => {
    const tag = tagsMap.get(item)
    if (tag) {
      const regex = new RegExp(tag?.name || '', 'g')
      if (tag.type == 1) {
        const foundItem = tags.value.find((item) => item.value == tag.value)
        return str.replace(regex, foundItem?.expression)
      } else {
        return str.replace(regex, tag.value)
      }
    }
    return str
  }, obj.text)

  return resultStr
}

/**
 * @description 点击item展示到输入框
 */
const getSpanTag = (params: RichDataVO) => {
  // 创建前缀
  let prefix = `<span contenteditable="false" disabled="disabled" class="el-tag el-tag--primary rich-param" data-param="${params.id}">`
  // 创建后缀
  let suffix = '</span>'
  // 创建span元素
  let el = document.createElement('span')
  // 将前缀和后缀插入span元素
  el.innerHTML = prefix + params.value + suffix
  // 去掉外层的span
  let frag = document.createDocumentFragment()
  let node = frag.appendChild(el.firstChild!)
  // 插入tag
  range.value?.insertNode(node)
  // 设置光标
  range.value?.setStartAfter(node)
  range.value?.collapse(true)
  // 不移除selection会到聚焦点击的文本
  selection.value?.removeAllRanges()
  // 添加选区
  selection.value?.addRange(range.value!)
}

/**
 * @description 获取构建的html里面的文本和参数
 */
const getTextAndParams = () => {
  // 获取文本中的参数元素
  const paramsEls = textRef.value?.getElementsByClassName('rich-param')
  // 获取文本的innerHTML
  let innerHTML = textRef.value!.innerHTML
  // 定义参数数组
  let params = [{}]
  params = []
  // 如果参数元素存在
  if (paramsEls) {
    // 遍历参数元素
    for (let index = 0; index < paramsEls.length; index++) {
      // 将参数元素转换为HTMLSpanElement类型
      const element = paramsEls[index] as HTMLSpanElement
      // 获取参数元素在innerHTML中的索引
      const idx = innerHTML.indexOf(element.outerHTML)
      // 将参数元素添加到参数数组中
      params.push({
        name: element.innerText,
        id: element.dataset.param,
        index: idx
      })
      // 将参数元素的outerHTML替换为innerHTML
      innerHTML = innerHTML.replace(element.outerHTML, element.innerText)
    }
  }
  // 返回文本和参数数组
  return {
    text: textRef.value!.innerText,
    params
  }
}

/** 打开弹窗 */
const open = async (tableName: string, id?: string) => {
  dialogVisible.value = true
  currentId.value = id
  initDataList(tableName)
  setTimeout(() => {
    textRef.value?.focus()
    getDetail()
  })
}

const currentItem = ref()
// 根据id获取详情
const getDetail = async () => {
  const res = await getDetailById(currentId.value)
  const textRefValue = textRef.value

  nextTick(() => {
    if (textRefValue) {
      textRefValue.innerHTML = res.expression ? res.expressionHtml : ''
    }
  })
  currentItem.value = res
}
// 获取基础字段列表 （添加字段列表 + 基础字段列表）
const initDataList = async (tableName) => {
  try {
    const params = {
      tableName: tableName
    }
    const [columnRes, expressionRes] = await Promise.all([
      getColumnName(params),
      sysExpressionList({})
    ])

    tags.value = [
      ...columnRes.map((item) => ({
        name: item.COLUMN_COMMENT,
        desc: '',
        type: 0, //系统字段
        value: item.COLUMN_NAME,
        expression: ''
      })),
      ...expressionRes.records.map((item) => ({
        name: item.filedName,
        type: 1, //新增字段
        desc: item.filedDescribe,
        value: item.filed,
        expression: item.expression
      }))
    ]
  } catch (error) {}
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;
  flex-direction: row;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.rich-editor {
  width: 100%;
  min-height: 150px;
  padding: 10px;
  box-sizing: border-box;
  overflow: auto;
  border-radius: 5px;
  font-size: 14px;
  word-break: break-all;
  outline: none;
}

.tagSelect-text {
  cursor: pointer;
  padding-right: 6px;
}

:deep(.rich-param) {
  font-size: 14px;
  margin: 0 5px;
  cursor: pointer;
}

.flex-right {
  align-items: self-end;
}

.bottom-container {
  background: #f5f5f5;
  border-top: 1px solid #ccc;
  margin-top: 10px;
}

.dic-left {
  height: 300px;
  border-right: 1px solid #ccc;
  width: 150px;
  overflow-y: scroll;
  padding-left: 20px;
}

.active {
  background: white;
}
.tagItem {
  padding: 5px 0;
}

.dic-desc {
  padding: 10px;
}

.dic-title {
  font-weight: bold;
  margin-bottom: 20px;
}
.content-wapper {
  padding: 0 10px;
}
</style>
