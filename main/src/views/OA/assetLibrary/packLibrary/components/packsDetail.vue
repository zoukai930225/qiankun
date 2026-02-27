<template>
   <ContentWrap>
      <div class="goods-info-wapper">
        <div class="good-gif">
            <img :src="GoodsImg" width="95px" height="95px"/>
        </div>
        <div class="infor-waper">
            <span class="good-no">{{ goods.goodsNo ||'' }}</span>
          <span class="good-desc">{{ goods.goodsName || '' }}</span>
        </div>
      </div>
      <div class="content-wapper">
         <div class="lefter-content">
          <div class="box-gap-wapper">
              <div class="title-line"></div>
              <span>产品信息</span>
         </div>
           <div class="product-infor-wapper">
             <el-image
                  style="width: 163px; height: 213px;"
                  :src="goodsUrl"
                  :preview-src-list="[goodsUrl]"
                  :initial-index="0"
                  fit="cover"
                  preview-teleported
                   @click.stop="()=>{}"
                >
                <template #error>
                <div class="error-img-wapper">
                      <img :src="GoodsError" width="112px" height="112px"/>
                </div>
              </template>
                    </el-image>
               <!-- <img :src="goodsUrl" width="163px" height="213px" v-if="goodsUrl" />
               <div class="error-img-wapper" v-else > 
                      <img :src="GoodsError" width="112px" height="112px"/>
               </div> -->
             
               <el-table :data="goodsList" style="width: calc(100% -163px)"  :cell-style="tableCellStyle"
                :border="true" :show-header="false" :span-method="objectSpanMethod"  :row-style="{height: '71px'}" >
                  <el-table-column prop="label" label="series" width="180" show-overflow-tooltip/>
                  <el-table-column prop="value" label="serisName" width="348"  show-overflow-tooltip/>
                  <el-table-column prop="secondLabel" label="地址" width="180"  show-overflow-tooltip/>
                  <el-table-column prop="secondValue" label="地址" show-overflow-tooltip/>
                </el-table>    
           </div>
           <div class="box-gap-wapper">
              <div class="title-line"></div>
              <span>库存数据</span>
         </div>
         <div class="product-infor-wapper">
               <el-table :data="GoodsInventoryData" style="width: calc(100% - 0px)" 
                  :header-cell-style="{ background: '#F2F6FC', color: '#666666' }"
                :border="true"   :row-style="{height: '45px'}" max-height="300">
                  <el-table-column prop="productCode" label="货品编码" width="180" show-overflow-tooltip/>
                  <el-table-column prop="goodsStock" label="库存数量"   show-overflow-tooltip/>
                  <el-table-column prop="shippingDayOne" label="最近1天出货量"   show-overflow-tooltip/>
                  <el-table-column prop="shippingDaySeven" label="最近7天出货量" show-overflow-tooltip/>
                    <el-table-column prop="shippingDayThirty" label="最近30天出货量" show-overflow-tooltip/>
                   <el-table-column prop="goodsStockSupportableAys" label="库存可支撑天数" show-overflow-tooltip/>
                </el-table>    
           </div>
            <div class="box-gap-wapper">
              <div class="title-line"></div>
              <span>供应商信息</span>
         </div>
          <div v-if="SuppliersList.length === 0" class="suppler-empty-wapper">
                <el-empty  description="暂无数据" />
          </div>
         <div class="suppler-infor-wapper" v-else>
                <div v-for="item in SuppliersList" :key="item" class="box-item">
                       <div class="item-lefter">
                          <div class="box-name" :title="item.abbreviationCompany">{{ item.abbreviationCompany }}</div>
                          <div class="box-desc" :title="item.fullCompany">{{ item.fullCompany }}
                          </div>
                       </div>
                       <div class="item-righter">
                         <img :src="companyUrl" :style="{ height: '98px',width:'98px',borderRadius:'10px' }" /> 
                       </div>
                </div>
           </div>
        </div>
        <div class="righter-content">
          <div class="box-gap-wapper">
            <div class="title-line"></div>
            <span>责任相关人员 </span>
            <div class="box-gap-text" @click="goto(0)">查看详情 <el-icon color="#0064FF" size="10px"><arrow-right  /></el-icon></div>
         </div>
         <el-table :data="pcManagerData" style="width: calc(100% - 0px)" 
                  :header-cell-style="{ background: '#F2F6FC', color: '#666666' }"
                :border="true" :show-header="false"   :row-style="{height: '45px'}" :cell-style="tableCellStyle"  >
                  <el-table-column prop="job" label="岗位" width="180" show-overflow-tooltip/>
                  <el-table-column prop="name" label="名称"   show-overflow-tooltip>
                       <template #default="{ row }">
                            <div class="user-wapper">
                                <LineAvatar :user="{image:row.name[0]?.avatarOrigin,name:row.name[0]?.name}" image="image"/>
                               <el-tooltip v-if="row?.name.length > 1">
                                <div class="more-order-handler"> +{{ row?.name.length - 1 }} </div>
                                <template #content>
                                  <div class="orderHandler">
                                    <div
                                      style="margin-top: 5px;"
                                      v-for="item in (row?.name as any[]).filter((_, index) => index > 0)"
                                      :key="item?.userId"
                                    >
                                      <LineAvatar :user="{image:item?.avatarOrigin,name:item?.name}" image="image"/>
                                    </div>
                                  </div>
                                </template>
                              </el-tooltip>
                            </div>
                              
                          </template>
                  </el-table-column>
          </el-table>
          <div class="box-gap-wapper">
            <div class="title-line"></div>
            <span>相关资料</span>
         </div>
           <el-table :data="pcAttachmentData" style="width: calc(100% - 0px)" 
                  :header-cell-style="{ background: '#F2F6FC', color: '#666666' }"
                :border="true" :show-header="false"   :row-style="{height: '45px'}" :cell-style="tableCellStyle"  >
                  <el-table-column prop="lable" label="货品编码" width="180" show-overflow-tooltip/>
                  <el-table-column prop="name" label="库存数量"   show-overflow-tooltip>
                      <template #default="{ row }">
                            <el-image
                              fit="contain"
                              :src="row.name"
                              :style="{ height: '40px' }"
                              :preview-src-list="[row.name]"
                              preview-teleported
                              lazy
                              hide-on-click-modal
                            >
                              <template #error>
                                <img src="@/assets/imgs/supplier/defaultImg.svg" :style="{ width: '40px' }" />
                              </template>
                            </el-image>
                      </template>
                  </el-table-column>
          </el-table>

              
        </div>
      </div>
   </ContentWrap>
</template>

<script setup lang="ts">
import GoodsImg from '@/assets/imgs/goods.gif'
import * as packLibraryApi from '@/api/oa/assetLibrary/packLibrary'
import asyncWrapper from '@/utils/asyncWrapper'
import companyUrl from '@/assets/imgs/company.png'
import GoodsError from '@/assets/imgs/goodsError.svg'

const router = useRouter()
const goodsNo:any = ref('')
const goodsId:any = ref('')
const route = useRoute()
const goodsUrl = ref('')
const SuppliersList = ref([])
const pcManagerData:any =ref([
  {
           'job':'企划',
           'name':[],
          },
         {
           'job':'设计师',
           'name':[]
          },
           {
           'job':'供应商',
           'name':[]
          },
           {
           'job':'采购',
           'name':[]
          },
])
const pcAttachmentData:any = ref([
        {
            'lable':'设计图',
             'name':'-'
          },
           {
            'lable':'首单报价单',
             'name':'-'
          },
           {
            'lable':'文件资料包',
             'name':'-'
          },
])
const goodsList:any =ref([
   {
          label:'系列',
          value:'-',
          secondLabel:'工艺',
          secondValue:'-'
       },
       {
          label:'材质',
          value:"-",
          secondLabel:'规格尺寸',
          secondValue:"-"
       },
       {
          label:'条码',
          value:"-",
          secondLabel:'工艺',
          secondValue:"-"
       },
])
const goods = ref({
   goodsNo:'',
   goodsName:''
})
const GoodsInventoryData = ref([])
const getPackInfoData = async () =>{
  const [data,error] = await asyncWrapper(packLibraryApi.getPackInfo(goodsNo.value))
  if(!error){
      const { pcManagerVo,pcAttachmentVo} = data
        pcManagerData.value =[
          {
           'job':'企划',
           'name':[pcManagerVo?.enterprisePlanManager||'-'],
          },
         {
           'job':'设计师',
           'name':[pcManagerVo?.productionResearchHead ||'-']
          },
           {
           'job':'供应商',
           'name':[pcManagerVo?.chosenSupplierStaff ||'-']
          },
           {
           'job':'采购',
           'name':[pcManagerVo?.purchaseManagers ||'-']
          },
         ]
        pcAttachmentData.value = [
          {
            'lable':'设计图',
             'name':pcAttachmentVo?.productPictureUrl||'-'
          },
           {
            'lable':'首单报价单',
             'name':pcAttachmentVo?.quotationSheetFile ||'-'
          },
           {
            'lable':'文件资料包',
             'name':pcAttachmentVo?.documentInformationPackage||'-'
          },
        ]
  } 
}

const getGoodsData = async () =>{
  const [data,error] = await asyncWrapper(packLibraryApi.getGoodsInfo(goodsId.value))
  if(!error){
       goods.value = data
       goodsUrl.value = data.imgUrl||''
       goodsList.value = [
        {
          label:'系列',
          value:data.series||'-',
          secondLabel:'工艺',
          secondValue:data.craft||'-'
       },
       {
          label:'材质',
          value:data.material||'-',
          secondLabel:'规格尺寸',
          secondValue:data.packageSize||'-'
       },
       {
          label:'条码',
          value:data.barcode||'-',
          secondLabel:'工艺',
          secondValue:data.craft||'-'
       },
      ]
  } 
}

const getGoodsInventoryData = async () =>{
  const [data,error] = await asyncWrapper(packLibraryApi.getGoodsInventory(goodsId.value))
  if(!error){
     GoodsInventoryData.value = data
  } 
}

const getGoodsSuppliersData = async () =>{
  const [data,error] = await asyncWrapper(packLibraryApi.getGoodsSuppliers(goodsId.value))
  if(!error){
     SuppliersList.value = data
  } 
}

const goto = (type = 0) =>{
   if(type === 0){
    console.log(1)
      router.push({ name: 'PackageProduct' , query: {productCode:goodsNo.value} })
   }
   console.log("goto",type)
}


const init =() =>{
  
  if(route.query.goodsNo&&route.query.goodsId){
      goodsNo.value = route.query.goodsNo
      goodsId.value = route.query.goodsId
  }
  getPackInfoData()
  getGoodsData()
  getGoodsInventoryData()
  getGoodsSuppliersData()
}
init()
const tableCellStyle = ({ row, column, rowIndex, columnIndex }) => {
      // 设置第一列(columnIndex=0)和第三列(columnIndex=2)的背景色
      if (columnIndex === 0 || columnIndex === 2) {
        return {
          backgroundColor: '#F4F6FA', // 浅蓝色背景
          color:'#666666'
          // color: 'red' // 如果需要，也可以同时设置文字颜色
        }
      }else{
         return {
            color:'#333333'
         }
      }
      // 对于不需要特殊样式的列，可以返回空对象，或者不返回
    }

 const objectSpanMethod = ({ rowIndex, columnIndex }) => {
      if (rowIndex === 2 && columnIndex === 1) {
        return {
          rowspan: 1,   // 只跨1行（不跨行）
          colspan: 3    // 跨3列
        };
      } 
      // 关键：隐藏被合并的单元格
      // 因为第二列的第三行单元格向右合并了3列，所以它原本右侧的两个单元格（即第三列和第四列的第三行）需要隐藏
      else if (rowIndex === 2 && (columnIndex === 2 || columnIndex === 3)) {
        return {
          rowspan: 0,
          colspan: 0
        };
      }
}

</script>

<style lang="scss" scoped>
.goods-info-wapper{
  width: calc(100% - 20px);
  height: 76px;
  border-radius: 8px;
   background: rgba(104, 127, 243, 0.08);
  padding: 0px 10px;
  display: flex;
  align-items: center; /* 垂直居中 */
  .good-gif{
    margin-right: 12px; /* 添加右边距，与文字分开 */
  }
  
  .infor-waper{
    flex: 1; /* 占据剩余空间 */
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden; /* 防止内容溢出 */
    
    .good-no {
      font-size: 20px;
      font-weight: 500;
      line-height: normal;
      letter-spacing: 0px;
      color: #333333;
      margin-bottom: 4px; /* 添加底部间距 */
    }
    
    .good-desc{
      font-size: 14px;
      font-weight: normal;
      line-height: 1.4; /* 增加行高提高可读性 */
      letter-spacing: 0px;
      color: #333333;
      
      /* 添加文字折行属性 */
      word-wrap: break-word;
      overflow-wrap: break-word;
      word-break: break-word;
      white-space: normal;
      
      /* 可选：限制显示行数并添加省略号 */
      display: -webkit-box;
      -webkit-line-clamp: 2; /* 限制显示2行 */
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.box-gap-wapper{
  width: 100%;
  height: 56px;
  display: flex;
  // align-items: center;
  
  
  .title-line{
    width: 3px;
    height: 10px;
    background: #0064FF;
    margin-top: 25px;
  }
  
  span{
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: 0px;
    color: #333333;
    margin-left: 5px;
    margin-top: 20px;
  }
  .box-gap-text{
    font-size: 14px;
    color: #0064FF;
    margin-left: auto;
    cursor: pointer;
  }
  .box-gap-text{
    margin-top: 20px;
  }
}

.content-wapper{
  width: 100%;
  display: flex;
  
  .lefter-content{
    // width: 1220px;
    width: calc(100% - 408px );

    .product-infor-wapper{
      width: 100%;
      display: flex;
      .error-img-wapper{
        width: 163px;
        height: 213px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F4F6FA;
      }
    }
    
    .suppler-infor-wapper{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 20px 20px;
      place-items: center;
      position: relative;
       .suppler-empty-wapper{
          width: 100%;
          display: flex;
          justify-content: center;
       }
      .box-item{
        width: 100%;
        height: 114px;
        background: #F4F6FA;
        box-sizing: border-box;
        border: 1px solid #E5E5E5;
        border-radius: 10px;
        padding: 8px 8px;
        display: flex;
        justify-content: space-between;
        transition:
        transform 0.2s ease,
        box-shadow 0.2s ease;
        will-change: transform;
        display: flex;
        align-items: center;
           &:hover{
            background: linear-gradient(179deg, #FFFFFF 1%, #F4F5FC 98%);
            box-sizing: border-box;
            border: 1px solid rgba(104, 127, 243, 0.2);
            // transform: scale(1.03);
         }
         .item-lefter{
          // margin-top: 30px;
          padding-right: 10px;
          width: calc(100% - 10px);
           .box-name{
            color: #333333;
            font-size: 14px;
            font-weight: 500;
            line-height: 20px;
             display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1; /* 限制为2行 */
            overflow: hidden;
            
           }
           .box-desc{
            margin-top: 13px;
            color: #666666;
            font-size: 14px;
             display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2; /* 限制为2行 */
            overflow: hidden;
           }
         }
      }  
       
    }
  }
  
  .righter-content{
    width: 388px;
    padding: 0px 10px;
  }
}
.user-wapper{
  width: 100%;
  display: flex;
  height: 23px;
  align-items: center;
}
.more-order-handler{
  margin-left: 10px;
  margin-top: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #eee;
  border: 1px solid #ccc;
  color: #999;
  cursor: default;
}
</style>