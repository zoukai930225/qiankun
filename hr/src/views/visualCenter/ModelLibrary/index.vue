<template>
  <ContentWrap>
     <search-form ref="searchRef" @get-list="getList" @handleAdd="handleAdd" />
     <div class="img-container" v-if="list.length > 0">
          <modelImg  v-for="(item,index) in list" :key="item.pictureUrl" :modelObj="item" :itemIndex="index" @openDetail ="openDetail" @success="getList"  @on-open="onOpen" @on-hide="onHide"/>
     </div>
     <div class="empty-wapper" v-else>
          <el-empty  description="暂无数据" />
     </div>
     
      <div class="pagination-wrapper">
      <Pagination
        :total="page.total"
        v-model:page="page.page"
        v-model:limit="page.size"
        :page-sizes="[12,24,36,48,60,120]"
        @pagination="getList()"
      />
    </div>
   </ContentWrap>
    <detail-drawer ref="formRef" @success="getList" :key="detailKey"/>
</template> 

<script lang="ts" setup>
import searchForm from './components/searchForm.vue';
import modelImg from './components/modelImg.vue';
import { ModelLibPageItem } from './components/Type';
import * as vcModelLibApi from '@/api/visualCenter/vcModelLib'
import DetailDrawer from './components/detailDrawer.vue';
import {isMultiLineTextOverflow,isSingleLineTextOverflow} from '@/utils/textIsOver'
const loading = ref(false)
const searchRef =ref()
const page = ref<ModelLibPageItem>({ ...new ModelLibPageItem() });
const list =ref([])
const formRef = ref();
const detailKey = ref(0)
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
     const {modelType,productType,...formParam} = searchRef?.value?.queryParams
     formParam.modelType = Array.isArray(modelType)? modelType.join(','):modelType 
     formParam.productType = Array.isArray(productType)? productType.join(','):productType 
     
     const reuqetParam= {...formParam, ...page.value}
     const data = await vcModelLibApi.pageList(reuqetParam)
     // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      return {
        ...item,
          visible:false,
        titleVible:false,
      }
    }) 
     page.value = { ... new ModelLibPageItem(data) }
  } finally {
    loading.value = false
  }
}
const handleAdd =() =>{
    openForm('add', '')
}
const openDetail =(id) =>{
    openForm('detail',id)
}
const openForm = (type: string, id?: string) => {
   detailKey.value++;
   nextTick(() => {
       if (formRef.value) {
        formRef.value.open(type, id)
      }   
   });
}

const onOpen =({index,type}) =>{  
     let element:any = null
     let keyString =''
     let isOver = false
       if(type === 0){
            element = document.querySelectorAll('.title-wapper')
            keyString ='visible'
            isOver = isMultiLineTextOverflow(element[index])
       }else{
            element = document.querySelectorAll('.goods-title')
            keyString='titleVible'
            isOver = isSingleLineTextOverflow(element[index])
       }
       console.log("ele",element[index])
       console.log("is",isOver)
       
    
      list.value.forEach(item => {
          item[keyString] = false
      });
      if(isOver){
          list.value[index][keyString] = true
      }
         
 }
 
 const onHide = (type = 0 ) =>{
    const titleVible = type === 0 ? 'visible':'titleVible'
    list.value.forEach(element => {
          element[titleVible] = false
      });
 }




onMounted(() => {
   getList()
})
</script>
<style lang="scss" scoped>
.img-container{
   width: 100%;
   // background-color: red;
   display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
   gap: 20px 20px;
     place-items: center;
     
}
</style>
