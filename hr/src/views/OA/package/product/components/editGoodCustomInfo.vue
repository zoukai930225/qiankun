<template>
  <el-form-item label="品类:" label-width="70px" :style="{ width: formWidth }" prop="category">
    <el-select
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
    </el-select>
  </el-form-item>
  <!-- 品类：女生内裤 -->

  <!-- 腰型 -->
  <el-form-item
    v-if="localForm.category === 'WOMANPANTS_CATEGORY_GROUP'"
    label="腰型:"
    label-width="70px"
    :style="{ width: formWidth }"
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
    v-if="localForm.category === 'WOMANPANTS_CATEGORY_GROUP'"
    label="版型:"
    label-width="70px"
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
    v-if="localForm.category === 'WOMANPANTS_CATEGORY_GROUP'"
    label="风格:"
    label-width="70px"
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

  <!-- 品类：男士内裤 -->
  <!-- 版型 -->
  <el-form-item
    v-if="localForm.category === 'MANPANTS_CATEGORY_GROUP'"
    label="版型:"
    label-width="70px"
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
    v-if="localForm.category === 'MANPANTS_CATEGORY_GROUP'"
    label="风格:"
    label-width="70px"
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

  <!-- 品类：内衣 -->
  <!-- 商品分类 -->
  <el-form-item
    v-if="localForm.category === 'UNDERWEAR_CATEGORY_GROUP'"
    label="商品分类:"
    label-width="70px"
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
    v-if="
      localForm.category === 'UNDERWEAR_CATEGORY_GROUP' &&
      localForm.productCategory &&
      localForm.productCategory !== '内衣'
    "
    label="杯型:"
    label-width="70px"
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
  <el-form-item
    v-if="
      localForm.category === 'UNDERWEAR_CATEGORY_GROUP' &&
      localForm.productCategory &&
      localForm.productCategory === '内衣'
    "
    label="杯型:"
    label-width="70px"
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
  </el-form-item>
  <!-- 风格 -->
  <el-form-item
    v-if="localForm.category === 'UNDERWEAR_CATEGORY_GROUP' && localForm.productCategory"
    label="风格:"
    label-width="70px"
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
    v-if="localForm.category === 'UNDERWEAR_CATEGORY_GROUP' && localForm.productCategory"
    label="款式:"
    label-width="70px"
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
  <el-form-item
    v-if="
      localForm.category === 'UNDERWEAR_CATEGORY_GROUP' &&
      localForm.productCategory &&
      localForm.productCategory === '内衣'
    "
    label="功能:"
    label-width="70px"
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
  </el-form-item>
  <!-- 功能  -->
  <el-form-item
    v-if="
      localForm.category === 'UNDERWEAR_CATEGORY_GROUP' &&
      localForm.productCategory &&
      localForm.productCategory !== '内衣'
    "
    label="功能:"
    label-width="70px"
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

  <!-- 品类：袜子 -->
  <!-- 版型 -->
  <el-form-item
    v-if="localForm.category === 'SOCKS_CATEGORY_GROUP'"
    label="版型:"
    label-width="70px"
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
    v-if="localForm.category === 'SOCKS_CATEGORY_GROUP'"
    label="风格:"
    label-width="70px"
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

  <!-- 品类：吊带背心 -->
  <!-- 版型 -->
  <el-form-item
    v-if="localForm.category === 'DDBX_CATEGORY_GROUP'"
    label="版型:"
    label-width="70px"
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
    v-if="localForm.category === 'DDBX_CATEGORY_GROUP'"
    label="杯垫:"
    label-width="70px"
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
    v-if="localForm.category === 'DDBX_CATEGORY_GROUP'"
    label="领型:"
    label-width="70px"
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
    v-if="localForm.category === 'DDBX_CATEGORY_GROUP'"
    label="风格:"
    label-width="70px"
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
    v-if="localForm.category === 'SEASONAL_CATEGORY_GROUP'"
    label="类别:"
    label-width="70px"
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
    v-if="localForm.category === 'SEASONAL_CATEGORY_GROUP'"
    label="风格:"
    label-width="70px"
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

  <!-- 品类：胸贴 -->
  <!-- 杯型 -->
  <el-form-item
    v-if="localForm.category === 'PASTIES_CATEGORY_GROUP'"
    label="杯型:"
    label-width="70px"
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
    v-if="localForm.category === 'PASTIES_CATEGORY_GROUP'"
    label="厚度:"
    label-width="70px"
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
    v-if="localForm.category === 'PASTIES_CATEGORY_GROUP'"
    label="功能:"
    label-width="70px"
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

  <!-- 品类：家居服 -->
  <!-- 季节 -->
  <el-form-item
    v-if="localForm.category === 'JJF_CATEGORY_GROUP'"
    label="季节:"
    label-width="70px"
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
    v-if="localForm.category === 'JJF_CATEGORY_GROUP'"
    label="款式:"
    label-width="70px"
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
    v-if="localForm.category === 'JJF_CATEGORY_GROUP'"
    label="厚度:"
    label-width="70px"
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
</template>

<script setup lang="ts">
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

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

const handlePlaceholder = (placeholder: string) => {
  if (props.onShow) {
    return ''
  }
  return placeholder
}

const localForm = ref({})

const showFunctionLables = (labels, dictList) => {
  let arr = []
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
    homeWearHd: localForm.value.homeWearHd
  }
}

defineExpose({
  updateLocalForm,
  getLocalForm
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
</style>
