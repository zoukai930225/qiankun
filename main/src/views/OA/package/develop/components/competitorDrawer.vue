<template>
  <div>
    <el-drawer v-model="isVisible" :with-header="false" :size="968" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">竞品信息</div>
            <img
              src="@/assets/imgs/system/fieldManageConfig/close.png"
              class="close"
              @click="reset"
            />
          </div>
          <ContentWrap>
            <div class="form-wapper">
              <div style="padding-bottom: 20px" v-if="isCompetitorEditable">
                <el-button type="primary" @click="handleAdd">
                  <Icon class="mr-5px" icon="ep:plus" />
                  新增
                </el-button>
              </div>
              <el-table
                class="SWCommonTable"
                v-horizontal-scroll="'always'"
                :header-cell-style="appStore.headerCellStyle"
                :data="dataList"
                :stripe="true"
                :show-overflow-tooltip="true"
                row-class-name="commonTableRow"
                width="100%"
              >
                <el-table-column
                  v-for="field in showTableColumns"
                  :key="field.code"
                  :prop="field.code"
                  :label="field.name"
                  :width="field.width || (field.code === 'imgUrl' ? '70px' : '130px')"
                >
                  <template #default="{ row, $index }">
                    <span
                      class="table-edite"
                      v-if="
                        !isEditable(row, field.code) &&
                        field.code !== 'imgUrl' &&
                        field.code !== 'competitiveLink'
                      "
                      @dblclick="handleDoubleClick(row, field.code)"
                    >
                      {{ row[field.code] }}
                    </span>
                    <!-- 链接点击跳转 -->
                    <span
                      class="table-edite"
                      v-if="!isEditable(row, field.code) && field.code === 'competitiveLink'"
                    >
                      <el-icon
                        color="#409eff"
                        @click="handleLinkTo(row[field.code])"
                        style="cursor: pointer; margin-right: 5px"
                        ><Link
                      /></el-icon>

                      <span @dblclick="handleDoubleClick(row, field.code)">
                        {{ row[field.code] }}
                      </span>
                    </span>
                    <!-- 文本编辑 -->
                    <el-input
                      v-if="isEditable(row, field.code) && field.type === 0"
                      class="table-input"
                      v-model="row[field.code]"
                      @keyup.enter="handleBlur(row, field.code)"
                      @blur="handleBlur(row, field.code)"
                      clearable
                    />
                    <!-- 上传图片 -->
                    <el-upload
                      v-if="field.type === 7"
                      :accept="fileType.join(',')"
                      :action="importUrl"
                      :before-upload="beforeUpload"
                      :headers="uploadHeaders"
                      class="upload"
                      :multiple="false"
                      name="files"
                      :data="{ code: 'NEW_PRODUCT', businessForeignKey: row.id }"
                      :on-error="uploadError"
                      :on-success="(e) => uploadSuccess(e, $index)"
                      :show-file-list="false"
                    >
                      <template v-if="row.imgUrl">
                        <img :src="row.imgUrl" class="upload-image" />
                        <div class="upload-handle" @click.stop>
                          <div class="handle-icon" @click="imagePreview(row.imgUrl)">
                            <Icon icon="ep:zoom-in" />
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <div class="upload-empty" v-if="defaultImg">
                          <slot name="empty">
                            <img :src="defaultImg" alt="" />
                          </slot>
                        </div>
                      </template>
                    </el-upload>
                  </template>
                </el-table-column>
                <!-- 添加操作列 -->
                <el-table-column
                  label="操作"
                  width="150"
                  fixed="right"
                  align="center"
                  v-if="isCompetitorEditable"
                >
                  <template #default="{ row, $index }">
                    <el-button
                      v-if="!row.id"
                      link
                      type="primary"
                      :icon="CircleCheck"
                      @click="saveHandle(row)"
                      >保存</el-button
                    >
                    <el-button link type="danger" :icon="Delete" @click="handleDel(row, $index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <!-- <div class="pagination"> -->
              <!-- 分页 -->
              <Pagination
                :total="total"
                v-model:page="params.page"
                v-model:limit="params.pageSize"
                @pagination="getList"
              />
              <!-- </div> -->
            </div>
          </ContentWrap>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts" setup>
import type { UploadProps } from 'element-plus'
import { Delete, CircleCheck } from '@element-plus/icons-vue'
import { createImageViewer } from '@/components/ImageViewer'
import { useAppStore } from '@/store/modules/app'
import { getCompetorsList, addCompetor, delCompetor, updateCompetitive } from '@/api/oa/new/develop'
import defaultImg from '@/assets/imgs/oa/develop/img-empty.png'
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
import { checkPermi } from '@/utils/permission'
import { getAccessToken } from '@/utils/auth'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const isVisible = ref(false)
const fileType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
type FileTypes =
  | 'image/apng'
  | 'image/bmp'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/webp'
  | 'image/x-icon'
const showTableColumns = ref([
  { name: '店铺', code: 'store', type: 0, require: true },
  { name: '链接', code: 'competitiveLink', type: 0, require: true, width: 220 },
  { name: '销量', code: 'salesVolume', type: 0, require: false },
  { name: '客单价', code: 'customerUnitPrice', type: 0, require: false },
  { name: '平台备注', code: 'remarks', type: 0, require: false },
  { name: '图片', code: 'imgUrl', type: 7, require: false }
])

const props = defineProps({
  isCompetitorEditable: {
    type: Boolean,
    default: true
  }
})
const total = ref(0)
const params = ref({
  page: 1,
  pageSize: 10
})

const handleLinkTo = (link: string) => {
  window.open(link)
}

const handleDoubleClick = (row: any, code: string) => {
  let obj = {
    store: undefined,
    competitiveLink: undefined,
    salesVolume: undefined,
    customerUnitPrice: undefined,
    remarks: undefined,
    imgUrl: undefined
  }
  for (let key in obj) {
    let name = key + 'Editable'
    row[name] = false
  }
  let name = code + 'Editable'
  row[name] = true
}
const handleBlur = (row, key) => {
  let name = key + 'Editable'
  if (row.id) {
    row[name] = false
    saveHandle(row)
  }
}

// 判断是否编辑状态
const isEditable = (row, key) => {
  let name = key + 'Editable'
  return row[name]
}

const dataList = ref<any[]>([])
// 新增
const handleAdd = () => {
  if (!checkPermi(['oa:newDevelop:maintainInfo'])) {
    return message.error('您没有权限维护运营信息')
  }
  let obj = {
    store: undefined,
    competitiveLink: undefined,
    salesVolume: undefined,
    customerUnitPrice: undefined,
    remarks: undefined,
    imgUrl: undefined
  }
  let item = {}
  for (let key in obj) {
    let name = key + 'Editable'
    item[name] = true
  }
  dataList.value.push({ ...obj, ...item })
}

const currentId = ref('') // 当前编辑的 id
const open = async (id) => {
  isVisible.value = true
  currentId.value = id
  getList()
}
// 列表
const getList = async () => {
  const res = await getCompetorsList({ ...params.value, devPlanId: currentId.value })
  dataList.value = res.records || []
  total.value = res.total
}

// 上传图片
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const fileSize = 5
  const imgSize = rawFile.size / 1024 / 1024 < fileSize
  const imgType = fileType
  if (!imgType.includes(rawFile.type as FileTypes))
    message.notifyWarning('上传图片不符合所需的格式！')
  if (!imgSize) message.notifyWarning(`上传图片大小不能超过 ${fileSize}M！`)
  return imgType.includes(rawFile.type as FileTypes) && imgSize
}

// 图片上传成功提示
const uploadSuccess = async (res: any, index: number) => {
  dataList.value[index].imgUrl = res.data[0].fileUrl
  saveHandle(dataList.value[index])
  // console.log(dataList.value)
}

// 图片上传错误提示
const uploadError = () => {
  message.notifyError('图片上传失败，请您重新上传！')
}

const imagePreview = (path: string) => {
  createImageViewer({
    zIndex: 9999999,
    urlList: [path]
  })
}
// 提交
const saveHandle = async (row: any) => {
  const { store, competitiveLink } = row
  if (!store) {
    message.error('请输入店铺名称')
    return
  }
  if (!competitiveLink) {
    message.error('请输入链接')
    return
  }
  // let reg = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g
  // if (!reg.test(competitiveLink)) {
  //   message.error('请输入正确的链接')
  //   return
  // }
  try {
    if (!row.id) {
      await addCompetor({ ...row, npDevelopmentPlanId: currentId.value })
    } else {
      let obj = JSON.parse(JSON.stringify(row))
      if (obj.jsonData) {
        delete obj.jsonData
      }
      await updateCompetitive(obj)
    }

    // message.success('操作成功')
    getList()
  } catch (error) {}
}
// 删除
const handleDel = async (row: any, index: number) => {
  // 删除二次确认
  await message.confirm('确认删除吗？')
  if (!row.id) {
    dataList.value.splice(index, 1)
  } else {
    await delCompetor({ id: row.id })
    getList()
  }
  message.success('删除成功')
}
const reset = () => {
  dataList.value = []
  isVisible.value = false
  currentId.value = ''
  emit('success')
}

const emit = defineEmits(['success'])

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
  // background-image: url('@/assets/imgs/drawer_bg.png') !important;
  // background-size: cover !important;

  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

:deep(.el-input__wrapper) {
  box-shadow: none !important;
  border: 1px solid #e5e5e5;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  padding-bottom: 18px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.form-wapper {
  width: 100%;
  .header-wapper {
    margin-bottom: 16px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 5px;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

:deep(.upload) {
  width: 50px;
  height: 50px;

  .el-upload {
    position: relative;
    width: 50px;
    height: 50px;

    .upload-empty {
      width: 50px;
      height: 50px;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      text-align: center;

      .handle-icon {
        color: #fff;
        padding-top: 15px;
      }
    }

    &:hover {
      .upload-handle {
        opacity: 1;
      }
    }
  }

  .upload-image {
    width: 50px;
    height: 50px;
  }
}
</style>
