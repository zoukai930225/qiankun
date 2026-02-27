<div class="chanyan-list">
  <!-- 第一个默认显示 -->
  <div class="first-chanyan-item">
    <div class="chanyan-label">风格</div>
    <div class="chanyan-content">{{ designDetail['style'] || '--' }}</div>

    <div class="edit-first-btn" @click="openEditPopover('style')">去更改</div>
    <editPopover
      :ref="(el) => (popoverRefs['style'] = el)"
      @close="handleClose"
      :listDic="listDic"
      :supplierOptions="supplierOptions"
    />

  </div>
  <div v-for="(label, key) in labelMap" :key="key" class="chanyan-item">
    <div class="chanyan-label">{{ label }}</div>

    <!-- 水洗标识 -->
    <div v-if="key === 'washLabel'" style="width: 220px">
      <div v-if="designDetail.washLabel">
        <div
          v-for="item in designDetail?.washLabel?.split(',')"
          :key="item"
          style="margin-right: 10px"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="item"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="designDetail?.washLabel?.split(',')"
            show-progress
            :initial-index="4"
            fit="cover"
          />
        </div>
      </div>
      <div v-else style="width: 220px">
        <div class="empty-img">
          <img src="@/assets/imgs/oa/product/displayInfo/empty.png" alt="" />
          暂无图片
        </div>
      </div>
    </div>
    <!-- 烫唛照片-->
    <div v-else-if="key === 'tmPicture'" style="width: 220px">
      <div v-if="designDetail.tmPicture">
        <!-- {{ designDetail.tmPicture }} -->
        <div
          v-for="item in designDetail.tmPicture?.split(',')"
          :key="item"
          style="margin-right: 10px"
        >
          <el-image
            style="width: 100px; height: 100px"
            :src="item"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="designDetail.tmPicture?.split(',')"
            show-progress
            :initial-index="4"
            fit="cover"
          />
        </div>
      </div>
      <div v-else style="width: 220px">
        <div class="empty-img">
          <img src="@/assets/imgs/oa/product/displayInfo/empty.png" alt="" />
          暂无图片
        </div>
      </div>
    </div>
    <!-- 面料成分 -->
    <div
      v-else-if="key === 'component'"
      style="display: flex; flex-wrap: wrap; width: 220px"
    >
      <div
        class="mianliao"
        v-for="item in (designDetail?.component &&
          designDetail?.component.split(',')) ||
        []"
        :key="item"
        :style="{
          marginBottom: designDetail?.component.split(',').length > 1 ? '10px' : '0'
        }"
      >
        {{ item }}
      </div>
    </div>
    <!-- 供应商选择 -->
    <div class="chanyan-content" v-else-if="key === 'supplier'" style="width: 220px">
      {{ formatSupplier(designDetail?.supplier) || '--' }}
    </div>

    <!-- 尺码 -->
    <div class="chanyan-content" v-else-if="key === 'size'" style="width: 220px">
      {{
        JSON.parse(designDetail[key]) && Array.isArray(JSON.parse(designDetail[key]))
          ? JSON.parse(designDetail[key]).join(',')
          : '--'
      }}
    </div>

    <!-- 颜色 -->
    <div class="chanyan-content" v-else-if="key === 'color'" style="width: 220px">
      {{ formatColor(designDetail?.color) || '--' }}
    </div>

    <!-- 安全类别 -->
    <div
      class="chanyan-content"
      v-else-if="key === 'securityCategory'"
      style="width: 220px"
    >
      {{
        formatDictData('SECURITY_CATEGORY', designDetail?.securityCategory) || '--'
      }}
    </div>

    <!-- 执行标准 -->
    <div
      class="chanyan-content"
      v-else-if="key === 'executionStandards'"
      style="width: 220px"
    >
      {{
        formatDictData('EXECUTION_STANDARDS', designDetail?.executionStandards) ||
        '--'
      }}
    </div>
    <!-- 材质/功能 -->
    <div class="chanyan-content" v-else-if="key === 'material'" style="width: 220px">
      {{ formatDictData('MATERIAL_FUNCTION', designDetail?.material) || '--' }}
    </div>
    <!-- 是否现货 -->
    <div class="chanyan-content" v-else-if="key === 'isStock'" style="width: 220px">
      {{ formatIsStock(designDetail?.isStock) || '--' }}
    </div>

    <div class="chanyan-content" v-else>{{ designDetail[key] || '--' }}</div>

    <div class="edit-btn" @click="openEditPopover(key)">去更改</div>
    <editPopover
      :ref="(el) => (popoverRefs[key] = el)"
      @close="handleClose"
      :listDic="listDic"
      :supplierOptions="supplierOptions"
    />

  </div>
</div>

<el-form-item
          label="品类:"
          label-width="70px"
          :style="{ width: formWidth }"
          prop="category"
        > <el-select
            :style="{ width: formItemWidth }"
            v-model="localForm.category"
            :placeholder="handlePlaceholder('请选择品类')"
            clearable
            :disabled="true"
          > <el-option
              :label="item.name"
              :value="item.code"
              v-for="item in categoryList"
              :key="item.code"
            /> </el-select> </el-form-item> <!-- 品类：女生内裤 -->

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
            {{
              showFunctionLables(
                localForm.underwearGn,
                getIntDictOptions(DICT_TYPE.NP_BRA_GN, true)
              )
            }}
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
              showFunctionLables(
                localForm.pastiesGn,
                getIntDictOptions(DICT_TYPE.NP_PASTIES_GN, true)
              )
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
