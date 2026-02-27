<template>
    <content-wrap>
       <div class="search">
         <el-input v-model="goodsNo" placeholder="请输入货品编码" prefix-icon="search" clearable  class="custom-select" @keydown.enter ="onSearch" @blur="onBlur" />
       </div>
      <div class="content-wapper" v-loading="loading">
         <el-empty v-if="list.length <= 0 " description="暂无数据"  class="empty-wapper"/>
       <div class="item-wappper" v-else>
           <div :class="selectdClass(index)" v-for="(item,index) in list" @click.stop="gotoDetail(item,index)"  :key="index">
               <div class="hoverBtn"></div>
              <div class="lefter">
                 <!-- <el-popover
                      :width="300"
                       :content="item.goodsNo"
                    :visible="item.titleVible"
                     effect="dark"  
                  >
                     <template #reference> -->
                      <!-- @mouseenter.stop="onOpen(index,1)" @mouseleave.stop ="onHide(1)" -->
                          <div class="goods-title">{{ item.goodsNo }}</div>
                     <!-- </template>
                  </el-popover> -->
                  <!-- <div class="goods-title">{{ item.goodsName }}</div> -->
                    <!-- <el-popover
                      :width="300"
                       :content="item.composition"
                    :visible="item.visible" 
                     effect="dark"
                  >
                     <template #reference> -->
                      <!-- @mouseenter.stop="onOpen(index)" @mouseleave.stop ="onHide" -->
                          <div class="goods-desc">{{ item.goodsName }}</div>
                     <!-- </template>
                  </el-popover> -->
              </div>
              <div class="righter">
                    <el-image
                  style="width: 112px; height: 160px;border-radius: 4px"
                  :src="item.mainImgUrl"
                  :preview-src-list="[item.mainImgUrl]"
                  :initial-index="0"
                  fit="cover"
                  preview-teleported
                   @click.stop="()=>{}"
                   :z-index="9999"
                   v-if="item.mainImgUrl"
                >
                <template #error>
                <div class="error-img-wapper">
                      <img :src="GoodsError" width="112px" height="112px"/>
                </div>
              </template>
                    </el-image>
                    <div class="error-img-wapper" v-else>
                      <img :src="GoodsError" width="112px" height="112px"/>
                </div>
              </div>
           </div>
       </div>
        <div class="pagination-wrapper">
          <Pagination
            :total="page.total"
            v-model:page="page.page"
            v-model:limit="page.size"
            :pageSizes="[8,12,16,20,32,160]"
            @pagination="getList()"
          />
      </div>
    </div>
  </content-wrap>
</template>
<script setup lang="ts">
import { GoodsPageItem } from './components/Type';
import * as packLibraryApi from '@/api/oa/assetLibrary/packLibrary'
import * as productInfoApi from '@/api/supplier/productInfo'
import { cloneDeep, debounce } from 'lodash-es';
import {isMultiLineTextOverflow,isSingleLineTextOverflow} from '@/utils/textIsOver'
import GoodsError from '@/assets/imgs/goodsError.svg'
const router = useRouter()

const page = ref<GoodsPageItem>({ ...new GoodsPageItem() });
const goodsNo =ref('')
const loading = ref(false)
const list:any = ref([])
// const descRef=ref(null)
const lastSearch = ref('')
const selected = ref(-1)


const onSearch = debounce(() => {
    page.value = { ...new GoodsPageItem() }
    getList()
}, 500);

const  onBlur = () => {
      // 只有值发生变化时才搜索
      if (goodsNo.value !== lastSearch.value) {
         onSearch();
      }
  }
const getList = async () =>{
  lastSearch.value =goodsNo.value
  try {
    loading.value = true

    const params = {
         "pageSize":page.value.size,"pageNum":page.value.page,
        "packLibraryGoodsNo":goodsNo.value,"supplierIds":[],
        "categories":[],"outOfStocks":[],
        "productionCycles":[],
        "levels":[],
        "userIds":[],
        packLibrary:true
      }

   const data = await productInfoApi.getProductInfoList(params)
    list.value = (data.records || []).map((item) => {
        item.goodsName = item.goodsName
                            .replace(/（/g, '(')   // 中文左括号转英文左括号
                            .replace(/）/g, ')') 
      return {
        ...item,
        visible:false,
        titleVible:false,
      }
    }) 
     page.value = { ... new GoodsPageItem(data) }    
  } finally {
    loading.value = false
  }
}

 getList()

 const onOpen =(index,type = 0 ) =>{
     let element:any = null
     let keyString =''
     let isOver = false
       if(type === 0){
            element = document.querySelectorAll('.goods-desc')
            keyString ='visible'
            isOver = isMultiLineTextOverflow(element[index])
       }else{
            element = document.querySelectorAll('.goods-title')
            keyString='titleVible'
            isOver = isMultiLineTextOverflow(element[index])
       }
      
    
      list.value.forEach(item => {
          item.titleVible = false
          item.visible = false
          
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



const url =''

const selectdClass = (index) =>{
  return index === selected.value ? 'good-item selectd':'good-item'
}

const gotoDetail =({goodsNo,goodsId},index) =>{ 
  selected.value = index
  setTimeout(() => {
       router.push({ name: 'PackageGallery', query: {goodsNo,goodsId} })   
  }, 500);  
}



</script>
<style lang="scss" scoped>
:deep(.custom-select  .el-input__wrapper){
    height: 42px;
    border-radius: 100px;
    opacity: 1;
    background: #FFFFFF;
    box-sizing: border-box;
    border: 1px solid #E5E5E5;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
}
.content-wapper{
  width: 100%;
  position: relative;
}
.item-wappper{
  width: 100%;
  margin-top: 30px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(389px, 1fr));
   gap: 20px 20px;
   place-items: center;
}
.empty-wappe{
  position: absolute;
  left: 50%;
  height: 50%;
  transform: translate(-50%,-50%);
}
.good-item{
  width: 100%;
  height: 192px;
  border-radius: 14px;
  opacity: 1;
  background: #FFFFFF;
  box-sizing: border-box;
  border: 1px solid #E5E5E5;
  display: flex;
  justify-content: space-between;
  padding: 16px 20px;
  position: relative;
  cursor: pointer;
  transition:
  transform 0.2s ease,
  box-shadow 0.2s ease;
  will-change: transform;
   &:hover{
    background: linear-gradient(179deg, #FFFFFF 1%, #F4F5FC 98%);
    box-sizing: border-box;
    border: 1px solid rgba(104, 127, 243, 0.2);
    box-shadow:  0px 0px 12px rgba(67, 72, 94, .15);
    // transform: scale(1.03);
     .hoverBtn{
      display: block;
     }
   }
   &.selectd{
    //  background:#fff;
     border: 1px solid #687FF3;
   }
}
.hoverBtn{
   display: none;
  width: 30px;
  height: 3px;
  position: absolute;
  transform:translateX(-50%) ;
  left: 50%;
  bottom: 5px;
  border-radius: 10px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(104, 127, 243, 0.4) 25%,
                            rgba(104, 127, 243, 0.4) 78%, rgba(255, 255, 255, 0) 100%);
}
.lefter{
  width:calc(100% - 132px);
  padding-right: 20px;
}
.goods-title{
  // width: 218px;
  font-size: 20px;
  font-weight: 500;
  color: #333333;
  margin-top: 24px;
  line-height: 24px;
  height: 26px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  // -webkit-line-clamp: 1; /* 限制为2行 */
  overflow: hidden;
  word-break: break-all;
}
.goods-desc{
  margin-top: 10px;
  // width:218px;
  color: #666666;
  height: 60px;
  line-height: 20px;
   display: -webkit-box;
  //  -webkit-box-orient: vertical;
  // -webkit-line-clamp: 2; /* 限制为2行 */
  overflow: hidden;
  word-break: break-all;
  }
.righter{
  width: 112px;
  height: 100%;
}
.error-img-wapper{
        width: 112px;
        height: 160px;
        display: flex;
        border-radius: 4px;
        justify-content: center;
        align-items: center;
        background-color: #F4F6FA;
      }

</style>