<template>
  <s-w-drawer
    title="评论"
    v-model="visible"
    width="800"
    @open="handleOpen"
    @close="handleDrawerClose"
    @closed="emit('closed')"
  >
    <el-card shadow="never" class="!border-0">
      <el-card v-if="commentInfo.length" shadow="never" class="!mb-20px item-card">
        <div v-for="item in commentInfo" :key="item.id" class="comment-item">
          <div class="flex items-center font-size-14px mb-10px lh-20px">
            <div class="flex items-center mr-10px">
              <el-avatar
                :src="item.creator.avatarOrigin || DefaultAvatar"
                :size="16"
                class="mr-8px"
              />
              <span>{{ item.creator.name }}</span>
            </div>
            <span class="color-#8C8E90">{{ item.createdAt }}</span>
          </div>
          <p class="comment-text">
            {{ item.comment }}
          </p>
          <div v-if="item.file" class="flex mb-4px ml-24px">
            <div>
              <span class="font-size-14px lh-17px color-#666">附件：</span>
            </div>
            <component :is="getFileDom(item.file)" />
          </div>
        </div>
      </el-card>

      <el-card shadow="never" class="item-card">
        <el-form :model="formData" :rules="rules" ref="formRef">
          <el-form-item prop="comment">
            <s-textarea
              v-model="formData.comment"
              :maxlength="500"
              :rows="5"
              show-word-limit
              placeholder="请填写评论"
            />
          </el-form-item>

          <el-form-item>
            <el-upload
              ref="uploadRef"
              class="w100%"
              v-model:file-list="fileList"
              name="files"
              :data="{ code: 'SUPPLY_CHAIN' }"
              drag
              multiple
              :action="importUrl"
              :headers="uploadHeaders"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
            >
              <img src="@/assets/svgs/common/file_upload.svg" class="add-default-img" />
              <div class="el-upload__text"> 拖拽、粘贴上传或 <em>点击此处</em> </div>

              <template #file="{ file }">
                <div class="flex justify-between items-center">
                  <div v-if="file.response" class="flex items-center">
                    <el-image
                      :src="
                        isImage(file.name)
                          ? (file.response as any).data[0].fileUrl
                          : fileImage({ name: file.name, url: (file.response as any).data[0].fileUrl })
                      "
                      class="w-16px h-16px mr-8px"
                    />
                    <span>{{ file.name }}</span>
                  </div>
                  <el-button link type="info" @click="uploadRef?.handleRemove(file)">
                    <Icon icon="ep:close" />
                  </el-button>
                </div>
              </template>
            </el-upload>
          </el-form-item>
        </el-form>
      </el-card>
    </el-card>

    <template #footer>
      <el-button @click="handleDrawerClose">取消</el-button>
      <el-button type="primary" @click="handleSaveComment">保存</el-button>
    </template>
  </s-w-drawer>
</template>

<script setup lang="tsx">
import { commentListApi, updateCommentApi } from '@/api/supplier/comment'
import { ElLink, FormInstance, FormRules } from 'element-plus'
import { downloadByUrl2 } from '@/utils/download'
import { getAccessToken } from '@/utils/auth'
import fileExcel from '@/assets/imgs/excel.svg'
import filePdf from '@/assets/imgs/pdf.svg'
import fileDoc from '@/assets/imgs/doc.svg'
import filePpt from '@/assets/imgs/ppt.svg'
import { isImage } from '@/utils/file'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'

const message = useMessage()

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'closed'): void
}>()
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() })
const rules: FormRules = {
  comment: { required: true, message: '请输入评论' }
}
const formRef = ref<FormInstance>()
const fileList = ref<any[]>([])
const visible = ref(true)
const loading = ref(false)
const commentInfo = ref<
  {
    comment: string
    file: string
    creator: { name: string; avatarOrigin: string }
    id: string
    createdAt: string
  }[]
>([])
const formData = reactive({
  comment: '',
  file: ''
})
const uploadRef = ref()

watch(
  () => fileList.value,
  (val) => {
    const urls = val
      .filter((ele) => ele.response)
      .map((ele) => ele.response.data[0].fileUrl + '?name=' + ele.response.data[0].fileName)
      .join(',')
    const value: string = Array.from(new Set(urls.split(',')).values()).join(',')

    formData.file = value
  },
  { deep: true }
)

async function handleOpen() {
  loading.value = true
  try {
    const res = await commentListApi({ orderId: props.id })
    commentInfo.value = res.records
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleDrawerClose() {
  visible.value = false
}

async function handleSaveComment() {
  try {
    await formRef.value?.validate()
    const res = await updateCommentApi({ ...formData, orderId: props.id })
    if (res && res.success) {
      message.success('发表评论成功！')
      visible.value = false
      emit('closed')
    }
  } catch (error) {}
}

const fileImage = ({ name, url }) => {
  if (name && isImage(name)) {
    return url
  }

  const ext = url?.split('.').pop()?.toLowerCase() || ''

  if (['xls', 'xlsx'].includes(ext)) return fileExcel
  if (['pdf'].includes(ext)) return filePdf
  if (['doc', 'docx'].includes(ext)) return fileDoc
  if (['ppt', 'pptx'].includes(ext)) return filePpt
}

function handleUploadSuccess() {
  message.success('上传成功！')
}

function handleUploadError() {
  loading.value = false
  message.error('上传失败')
}

function getFileDom(file: string) {
  const files = file.split(',')

  return (
    <div>
      {files.map((fileUrl) => {
        const url = new URL(fileUrl)
        const name = url.searchParams.get('name')

        return (
          <div class="flex items-center mb-8px">
            <img src={fileImage({ name, url: fileUrl })} alt="" class="w16px mr-8px" />
            <ElLink type="primary" onClick={() => downloadByUrl2(fileUrl, name || fileUrl)}>
              <span class="lh-17px">{name}</span>
            </ElLink>
          </div>
        )
      })}
    </div>
  )
}

const handlePaste = async (evt) => {
  const txt = evt.clipboardData.getData('Text')
  if (typeof txt == 'string' && txt !== '') {
    return
  }
  let files: any[] = []
  const items = (evt.clipboardData || window.Clipboard).items
  if (!items.length) return
  for (let i = 0; i < items.length; i++) {
    files.push(items[i].getAsFile())
  }

  console.log(uploadRef.value)

  if (files.length) {
    files.forEach((ele) => {
      uploadRef.value?.handleStart(ele)
      uploadRef.value?.submit()
    })
  }
}

onBeforeMount(() => {
  handleOpen()
})

onMounted(() => {
  nextTick(() => {
    uploadRef.value?.$el.focus()
    uploadRef.value?.$el?.addEventListener('paste', handlePaste)
  })
})
</script>

<style scoped lang="less">
.custom-drawer-content {
  padding: 20px 0;
}

.item-card {
  border-radius: 10px;
  background-color: #f4f6fa;
}

.comment-item {
  border-bottom: 1px solid #ddd;
  margin-bottom: 14px;

  &:last-of-type {
    border-bottom: 0;
    margin-bottom: 0;
  }

  .comment-text {
    margin-bottom: 10px;
    margin-left: 24px;
    font-size: 14px;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    line-height: 1.2;
  }
}
</style>
