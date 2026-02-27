<template>
  <div class="drawer-wrapper">
    <el-drawer
      ref="drawerRef"
      :model-value="isShow"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="38.2%"
      @closed="handleBeforClose"
    >
      <div>
        <div class="drawerTitle">
          <div>{{ title }}</div>
          <div @click="emit('update:is-show', false)">
            <el-icon><CloseBold /></el-icon>
          </div>
        </div>
      </div>
      <div class="drawerContent">
        <el-card class="baseInfo" shadow="never">
          <div class="title">员工基本信息</div>
          <div class="content">
            <el-form label-position="top">
              <el-row :gutter="35">
                <el-col :span="12">
                  <el-form-item label="员工姓名">
                    <div class="item">{{ detail.employeeName || '--' }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="员工编号">
                    <div class="item">{{ detail.employeeNo || '--' }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号">
                    <div class="item">{{ detail.mobile || '--' }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="部门">
                    <div class="item">{{ detail.deptName || '--' }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="性别">
                    <div class="item">{{ genderOption[detail.gender!] }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
        <el-card v-loading="loading" class="postInfo" shadow="never">
          <div class="title">岗位信息</div>
          <div class="content">
            <el-form :model="formData" ref="formRef" label-position="top" :rules="rules">
              <el-row :gutter="35">
                <el-col :span="12">
                  <el-form-item label="员工状态" prop="status">
                    <div v-if="type === 1" class="item">{{
                      employeeStatusOptions[detail.status! - 1 || 0]?.label || '--'
                    }}</div>
                    <div v-else>
                      <el-select v-model="formData.status" placeholder="请选择员工状态" clearable>
                        <el-option
                          v-for="item in employeeStatusOptions"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="薪酬结算方式" prop="salarySettlementType">
                    <div v-if="type === 1" class="item">{{
                      salaryOptions[detail.salarySettlementType! - 1 || 0]?.label || '--'
                    }}</div>
                    <div v-else>
                      <el-select
                        v-model="formData.salarySettlementType"
                        placeholder="请选择薪酬结算方式"
                        clearable
                      >
                        <el-option
                          v-for="item in salaryOptions"
                          :key="item.value"
                          :value="item.value"
                          :label="item.label"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="工种" prop="rolesMask">
                    <div v-if="type === 1" class="item">
                      {{ transformRoles(detail.rolesMask!, rolesMasks) || '--' }}
                    </div>
                    <div v-else>
                      <el-select v-model="formData.rolesMask" placeholder="请选择工种" clearable>
                        <el-option
                          v-for="item in rolesMasks"
                          :key="item.code!"
                          :value="item.code!"
                          :label="item.rolesMaskName"
                        />
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="type === 2">
                <el-col>
                  <el-form-item class="btns">
                    <el-button type="primary" @click="onSubmit">确定</el-button>
                    <el-button @click="handleBeforClose">取消</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-card>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { getPersonDetail, updatePersonInfo } from '@/api/storage/system'
import { employeeStatusOptions, genderOption, salaryOptions, transformRoles } from '../../options'
import { cloneDeep } from 'lodash-es'
import { FormContext } from 'element-plus'

const message = useMessage()

const props = withDefaults(
  defineProps<{
    isShow: boolean
    id: string
    title: string
    type?: 1 | 2
    rolesMasks?: StorageSystem.PersonalManagement.RolesMaskItem[]
  }>(),
  {
    rolesMasks: () => [] as StorageSystem.PersonalManagement.RolesMaskItem[]
  }
)

const emit = defineEmits(['update:is-show', 'refresh'])

const detail = reactive<StorageSystem.PersonalManagement.ListItem>({})
const formData = ref<
  Pick<typeof detail, 'status' | 'salarySettlementType' | 'rolesMask' | 'userId'>
>({})
const rules = ref({
  status: [{ required: true, message: '请选择员工状态' }],
  salarySettlementType: [{ required: true, message: '请选择薪酬结算方式' }],
  rolesMask: [{ required: true, message: '请选择工种' }]
})
const drawerRef = ref()
const formRef = ref<FormContext>()
const loading = ref(false)

/** 关闭前 */
async function handleBeforClose() {
  emit('update:is-show', false)
  formRef.value?.resetFields()
}

/** 获取详情 */
async function getDetail() {
  try {
    const res = await getPersonDetail(props.id)
    Object.keys(res).forEach((key) => res[key] && (detail[key] = res[key] || ''))

    // 表单信息
    if (props.type === 2) {
      formData.value = cloneDeep(res)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/** 提交 */
async function onSubmit() {
  try {
    const res = await updatePersonInfo(formData.value)
    if (res.success) {
      emit('update:is-show', false)
      message.success('修改成功')
      emit('refresh')
    }
  } catch (error) {}
}

async function open() {
  loading.value = true
  await getDetail()
  emit('update:is-show', true)
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

defineExpose({ open })
</script>

<style lang="less" scoped>
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;

  .el-form {
    .el-form-item__content {
      & > div {
        width: 100%;
      }
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}
.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 16px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 0;
}

.baseInfo,
.postInfo {
  margin-bottom: 24px;
  border-radius: 8px;
  :deep(.el-card__body) {
    box-sizing: border-box;
    padding: 0;
  }

  .title {
    display: flex;
    align-items: center;
    margin-left: 12px;
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin: 13px 20px 0;

    .item {
      width: 260px;
      height: 32px;
      padding-left: 12px;
      line-height: 32px;
      font-size: 12px;
      color: #999;
      background: #f1f5f866;
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}
</style>
