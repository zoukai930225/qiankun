<template>
  <el-form :model="localForm" ref="customInfoRef" inline>
    <el-form-item label="品类" label-width="80px" :style="{ width: formWidth }" prop="category" label-position="right">
      <!-- <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.category"
        :placeholder="handlePlaceholder('请选择品类')"
        clearable
        :disabled="true"
      >
        <el-option
          :label="item.name"
          :value="item.code"
          v-for="item in categoryList"
          :key="item.code"
        />
      </el-select> -->
      <CategorySelect style="width: 206px" v-model="localForm.category" disabled />
    </el-form-item>
    <!-- 产品名称 -->
    <el-form-item
      label="产品名称"
      prop="productName"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      :rules="[{required: true, message: '请输入产品名称', trigger: 'blur'}]"
    >
      <el-input
        :style="{ width: formItemWidth }"
        placeholder="请输入产品名称"
        v-model="localForm.productName"
      ></el-input>
    </el-form-item>
  
    <!-- 建议产品编码 -->
    <el-form-item
      label="建议产品编码"
      label-position="right"
      prop="recommendProductCode"
      label-width="80px"
      :style="{ width: formWidth }"
    >
      <el-input
        :style="{ width: formItemWidth }"
        placeholder="请输入建议产品编码"
        v-model="localForm.recommendProductCode"
      ></el-input>
    </el-form-item>
    <!-- 品类：女生内裤 008-->
  
    <!-- 腰型 -->
    <el-form-item
      v-if="firstCategory === '008'"
      label="腰型"
      label-width="80px"
      :style="{ width: formWidth }"
      label-position="right"
      prop="womanpantsYx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.womanpantsYx"
        :placeholder="handlePlaceholder('请选择腰型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_WOMANPANTS_YX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 版型 -->
    <el-form-item
      v-if="firstCategory === '008'"
      label="版型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="womanpantsBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.womanpantsBx"
        :placeholder="handlePlaceholder('请选择版型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_WOMANPANTS_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 风格  -->
    <el-form-item
      v-if="firstCategory === '008'"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="womanpantsFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.womanpantsFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_WOMANPANTS_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：男士内裤 007-->
    <!-- 版型 -->
    <el-form-item
      v-if="firstCategory === '007'"
      label="版型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="manpantsBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.manpantsBx"
        :placeholder="handlePlaceholder('请选择版型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_MANPANTS_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 风格  -->
    <el-form-item
      v-if="firstCategory === '007'"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="manpantsFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.manpantsFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_MANPANTS_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：内衣 010-->
    <!-- 商品分类 -->
    <el-form-item
      v-if="firstCategory === '010'"
      label="商品分类"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="productCategory"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.productCategory"
        :placeholder="handlePlaceholder('请选择商品分类')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_UNDERWEAR_CATEGORY, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 杯型 -->
    <el-form-item
      v-if="firstCategory === '010'"
      label="杯型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="braBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.braBx"
        :placeholder="handlePlaceholder('请选择杯型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_UNDERWEAR_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- <el-form-item
      v-if="
        localForm.category === 'UNDERWEAR_CATEGORY_GROUP' &&
        localForm.productCategory &&
        localForm.productCategory === '内衣'
      "
      label="杯型:"
      label-width="80px"
      :style="{ width: formWidth }"
      prop="underwearBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.underwearBx"
        :placeholder="handlePlaceholder('请选择杯型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_UNDERWEAR_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item> -->
    <!-- 风格 -->
    <el-form-item
      v-if="firstCategory === '010'"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="braFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.braFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_BRA_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 款式  -->
    <el-form-item
      v-if="firstCategory === '010'"
      label="款式"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="underwearKs"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.underwearKs"
        :placeholder="handlePlaceholder('请选择款式')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_UNDERWEAR_KS, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 功能  -->
    <!-- <el-form-item
      v-if="firstCategory === '010'"
      label="功能:"
      label-width="80px"
      :style="{ width: formWidth }"
      prop="underwearGn"
    >
      <div v-if="onShow" class="selectView text1" :style="{ width: formWidth }">
        {{ showFunctionLables(localForm.underwearGn, getIntDictOptions(DICT_TYPE.NP_BRA_GN, true)) }}
      </div>
  
      <el-select
        v-else
        :style="{ width: formItemWidth }"
        v-model="localForm.underwearGn"
        :placeholder="handlePlaceholder('请选择功能')"
        clearable
        :disabled="forbidEdit"
        :multiple="true"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_BRA_GN, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item> -->
    <!-- 功能  -->
    <el-form-item
      v-if="firstCategory === '010'"
      label="功能"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="braGn"
    >
      <div v-if="onShow" class="selectView text1" :style="{ width: formWidth }">
        {{ showFunctionLables(localForm.braGn, getIntDictOptions(DICT_TYPE.NP_BRA_GN, true)) }}
      </div>
      <el-select
        v-else
        :style="{ width: formItemWidth }"
        v-model="localForm.braGn"
        :placeholder="handlePlaceholder('请选择功能')"
        clearable
        :disabled="forbidEdit"
        :multiple="true"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_BRA_GN, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：袜子 009-->
    <!-- 版型 -->
    <el-form-item
      v-if="firstCategory === '009'"
      label="版型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="socksBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.socksBx"
        :placeholder="handlePlaceholder('请选择版型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SOCKS_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 风格 -->
    <el-form-item
      v-if="firstCategory === '009'"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="socksFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.socksFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SOCKS_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      v-if="firstCategory === '009'"
      label="袜号"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="sockSize"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.sockSize"
        :placeholder="handlePlaceholder('请选择袜号')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SOCKS_SIZE, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：吊带背心 001-->
    <!-- 版型 -->
    <el-form-item
      v-if="firstCategory === '001'"
      label="版型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="suspendersBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.suspendersBx"
        :placeholder="handlePlaceholder('请选择版型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SUSPENDERS_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 杯垫 -->
    <el-form-item
      v-if="firstCategory === '001'"
      label="杯垫"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="suspendersBd"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.suspendersBd"
        :placeholder="handlePlaceholder('请选择杯垫')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SUSPENDERS_BD, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 领型 -->
    <el-form-item
      v-if="firstCategory === '001'"
      label="领型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="suspendersLx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.suspendersLx"
        :placeholder="handlePlaceholder('请选择领型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SUSPENDERS_LX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 风格 -->
    <el-form-item
      v-if="firstCategory === '001'"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="suspendersFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.suspendersFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SUSPENDERS_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：季节品 -->
    <!-- 类别 -->
    <el-form-item
      v-if="!['001', '005', '007', '008', '009', '010', '011'].includes(firstCategory)"
      label="类别"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="seasonalLb"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.seasonalLb"
        :placeholder="handlePlaceholder('请选择类别')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SEASONAL_LB, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 风格 -->
    <el-form-item
      v-if="!['001', '005', '007', '008', '009', '010', '011'].includes(firstCategory)"
      label="风格"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="seasonalFg"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.seasonalFg"
        :placeholder="handlePlaceholder('请选择风格')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_SEASONAL_FG, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：胸贴 011 -->
    <!-- 杯型 -->
    <el-form-item
      v-if="firstCategory === '011'"
      label="杯型"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="pastiesBx"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.pastiesBx"
        :placeholder="handlePlaceholder('请选择杯型')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_PASTIES_BX, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 厚度 -->
    <el-form-item
      v-if="firstCategory === '011'"
      label="厚度"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="pastiesHd"
    >
      <el-select
        style="width: 262px"
        v-model="localForm.pastiesHd"
        :placeholder="handlePlaceholder('请选择厚度')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_PASTIES_HD, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 功能 -->
    <el-form-item
      v-if="firstCategory === '011'"
      label="功能"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="pastiesGn"
    >
      <div v-if="onShow" class="selectView text1" :style="{ width: formWidth }">
        {{
          showFunctionLables(localForm.pastiesGn, getIntDictOptions(DICT_TYPE.NP_PASTIES_GN, true))
        }}
      </div>
      <el-select
        v-else
        :style="{ width: formItemWidth }"
        v-model="localForm.pastiesGn"
        :placeholder="handlePlaceholder('请选择功能')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_PASTIES_GN, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 品类：家居服 005-->
    <!-- 季节 -->
    <el-form-item
      v-if="firstCategory === '005'"
      label="季节"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="homeWearJj"
    >
      <el-select
        style="width: 205px"
        v-model="localForm.homeWearJj"
        :placeholder="handlePlaceholder('请选择季节')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_JJF_JJ, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
    <!-- 款式 -->
    <el-form-item
      v-if="firstCategory === '005'"
      label="款式"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="homeWearKs"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.homeWearKs"
        :placeholder="handlePlaceholder('请选择款式')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_JJF_KS, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  
    <!-- 厚度 -->
    <el-form-item
      v-if="firstCategory === '005'"
      label="厚度"
      label-width="80px"
      label-position="right"
      :style="{ width: formWidth }"
      prop="homeWearHd"
    >
      <el-select
        :style="{ width: formItemWidth }"
        v-model="localForm.homeWearHd"
        :placeholder="handlePlaceholder('请选择厚度')"
        clearable
        :disabled="forbidEdit"
      >
        <el-option
          v-for="dict in getIntDictOptions(DICT_TYPE.NP_JJF_HD, true)"
          :key="dict.code"
          :label="dict.label"
          :value="dict.code"
        />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
const props = defineProps({
  formWidth: {
    type: String,
    default: ''
  },
  formItemWidth: {
    type: String,
    default: ''
  },
  forbidEdit: {
    type: Boolean,
    default: false
  },
  onShow: {
    type: Boolean,
    default: false
  },
  categoryList: {
    type: Array,
    default: () => []
  }
})

const firstCategory = computed(() =>
  localForm.value.category ? localForm.value.category?.split('-')[0] : ''
)

const handlePlaceholder = (placeholder: string) => {
  if (props.onShow) {
    return ''
  }
  return placeholder
}

const localForm = ref<any>({})

const showFunctionLables = (labels, dictList) => {
  let arr = [] as any
  dictList &&
    Array.isArray(dictList) &&
    dictList.forEach((item) => {
      if (labels && Array.isArray(labels) && labels.includes(item.code)) {
        arr.push(item.label)
      }
    })
  return arr.join(',') || '--'
}

const updateLocalForm = (form: any) => {
  localForm.value = form
}

const getLocalForm = () => {
  return {
    category: localForm.value.category,
    womanpantsYx: localForm.value.womanpantsYx,
    womanpantsBx: localForm.value.womanpantsBx,
    womanpantsFg: localForm.value.womanpantsFg,
    manpantsBx: localForm.value.manpantsBx,
    manpantsFg: localForm.value.manpantsFg,
    productCategory: localForm.value.productCategory,
    braBx: localForm.value.braBx,
    underwearBx: localForm.value.underwearBx,
    underwearKs: localForm.value.underwearKs,
    underwearGn: localForm.value.underwearGn,
    braGn: localForm.value.braGn,
    braFg: localForm.value.braFg,
    socksBx: localForm.value.socksBx,
    socksFg: localForm.value.socksFg,
    sockSize: localForm.value.sockSize,
    suspendersBx: localForm.value.suspendersBx,
    suspendersBd: localForm.value.suspendersBd,
    suspendersLx: localForm.value.suspendersLx,
    suspendersFg: localForm.value.suspendersFg,
    seasonalLb: localForm.value.seasonalLb,
    seasonalFg: localForm.value.seasonalFg,
    pastiesBx: localForm.value.pastiesBx,
    pastiesHd: localForm.value.pastiesHd,
    pastiesGn: localForm.value.pastiesGn,
    homeWearJj: localForm.value.homeWearJj,
    homeWearKs: localForm.value.homeWearKs,
    homeWearHd: localForm.value.homeWearHd,
    productName: localForm.value.productName,
    recommendProductCode: localForm.value.recommendProductCode,
  }
}

const customInfoRef = ref()

const valueCheck = async () => {
  const valid = await customInfoRef?.value?.validate()
  return valid
}

defineExpose({
  updateLocalForm,
  getLocalForm,
  valueCheck
})
</script>

<style lang="scss" scoped>
.selectView {
  border-radius: 4px;
  background: #f8f8f8;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  color: #666666;
  margin-right: 10px;
  padding-left: 10px;
  padding-right: 10px;
}
:deep() {
  .el-form-item {
    margin-right: 0px;
    .el-form-item__label {
      padding-right: 12px !important;
    }
  }
}
</style>
