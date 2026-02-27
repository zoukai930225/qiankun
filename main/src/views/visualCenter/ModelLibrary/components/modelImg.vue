<template>
     <div class="model-img-wapper" >
        <div class="img-wapper">
             <el-image
              style="width: 100%; height: 100%;border-radius:8px 8px 0px 0px ;"
              :src="getImgList[curindex]"
              :preview-src-list="getImgList"
              :initial-index="curindex"
              :key="modelObj.pictureUrl"
               preview-teleported
              fit="cover"
            />
            <div class="right-arrow common-arrow" @click="handleRight()">
              <el-icon><arrow-right /></el-icon>
             </div>
             <div class="common-arrow left-arrow" @click="handleLeft()" >
              <el-icon><arrow-left :color="isLeft"/></el-icon>
             </div>
        </div>
        <div class="bottom-wapper">
          <div class="infor-wapper">
           <span class="name-span">{{ modelObj.name }}</span>
           <div class="type-label-wapper">
               <span class="type-label-box">{{ modelObj.modelType === 1?'男模':"女模" }}</span>
               <span class="type-label-box">{{ modelObj.productType ===1? '内衣':'非内衣' }}</span>
           </div>
        </div>
          <div class="des-wapper">    
        <el-popover
                      :width="300"
                       :content="modelObj.remark"
                    :visible="modelObj.visible"
                    effect="dark" 
                  >
                     <template #reference>
                     <div class="title-wapper"  @mouseenter="() => emit('onOpen',{index:itemIndex,type:0})" @mouseleave.stop ="() => emit('onHide',0)"> {{modelObj.remark||' -'}}</div>
                     </template>
                  </el-popover>
        </div> 
        <div class="user-wapper">
           <div class="user-lefter">
               <img class="user-logo" :src="modelObj.updater?.avatarOrigin || DefaultAvatar " />
               <span>{{ modelObj.updater?.name || '-'}}</span>
           </div>
           <div class="time-righer">
           {{ modelObj.updatedAt || '' }}
        </div>
        </div>
        <div class="line"></div>
        <div class="action-wapper">
           <el-button type="danger" color="#EB3737" plain @click="handleDelete(modelObj.id)" style="width: 116px;">删除</el-button>
           <el-button type="primary" @click="handleDetail(modelObj.id)" style="width: 116px;">查看详情</el-button>
        </div>

        </div>
     </div>
</template> 
<script lang="ts" setup>
import * as vcModelLibApi from '@/api/visualCenter/vcModelLib'
import DefaultAvatar from '@/assets/imgs/avatar-defalut.svg'

const { t } = useI18n() // 国际化
const props =defineProps({
   modelObj:{
    type:Object,
    default:() => null
   },
   itemIndex:{
     type:Number,
     default:0
   }
})
const  emit =  defineEmits(['openDetail','success','onOpen','onHide'])
const curindex = ref(0)
const getImgList =computed(() =>props.modelObj.pictureUrl.split(','))
const size = getImgList.value.length
const message = useMessage() // 消息弹窗
const handleLeft = () =>{
  if(curindex.value > 0 ){
     curindex.value --;
     return 
  }
  if(curindex.value === 0 ){
    message.warning('已经是第一页')
  }
}
const handleRight = () =>{
  if(curindex.value < size - 1){
     curindex.value ++
     return
  }
  if(curindex.value === size -1){
    message.warning('已经是最后一页')
  }
}

const isLeft =computed(() =>{
 return curindex.value > 0  ? '80%':'36%'
})
const isRight = computed(() =>{
 return  curindex.value < size - 1 ? '80%':'36%'
})

const handleDetail =(id) =>{
  emit('openDetail',id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm('是否确定删除此条数据？')
    // 发起删除
    await vcModelLibApi.deleteById([id] )
    message.success(t('common.delSuccess'))
    // 刷新列表
    emit('success')
  } catch {}
}


</script>
<style lang="scss" scoped>
.model-img-wapper{
  width: 100%;
  height: 478px;
  background-color: #fff;
  border-radius: 8px 8px 8px 8px;
  border: 1px #CDCDCD solid;
  transition:
  transform 0.2s ease,
  box-shadow 0.2s ease;
  will-change: transform;

     &:hover {
      transform: scale(1.03);
      box-shadow:
        0 0 0 1px #b2cbed,
        0 6px 20px rgba(0, 0, 0, 0.12);
      z-index: 1;
      border-radius: 8px;
      .bottom-wapper{
        // background-color: #b2cbed;
        // opacity: 0.2;
      }
   }
}
.common-arrow{
  width: 36px;
  height: 34px;
  position: absolute;
  top:50%;
   transform: translateY(-50%);
   color: #E5E5E5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    line-height: 24px;
    cursor: pointer;
    opacity: 0.36;

    &:hover{
      color: #fff !important;
    }
}
 .left-arrow {
    border-radius: 0px 4px 4px 0px;
    background-color: #333333;
     &:hover{
      opacity: 0.8 !important;
     }
 }
 
 .right-arrow{
   right: 0;
    border-radius: 4px 0px 0px 4px;
    background-color: #333333;
   &:hover{
      opacity: 0.8 !important;
     }

 }
.img-wapper{
  width: calc(100% - 4px);
  height: 255px;
  background-color: #F2F3F7;
  border-radius: 8px 8px 0px 0px;
  position: relative;
  margin:2px 2px 0 2px;
  cursor: pointer;
}
.infor-wapper{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

   .name-span{
     color: #333333;
     font-size: 18px;
     text-align: center;
     line-height: 25px;
     margin-top: 6px;
     font-weight: 600;
     padding: 0 10px;
     height: 50px;
     width: calc(100% - 20px);
     display: flex;
     justify-content: center;
     align-items: center;
   }
   .type-label-wapper{
      width: 100%;
      height: 23px;
      display: flex;
      justify-content: center;
      margin-top: 10px;
      .type-label-box{
        background-color: #E7EAF1;
        font-size: 12px;
        color: #333333;
        line-height: 17px;
        padding:3px 10px;
        margin-right: 10px;
        border-radius: 2px 2px 2px 2px;
      
      }
   }
}
.title-wapper{
  // padding: 15px 10px 10px 10px;
  font-size: 14px;
  height: 40px;
  width: calc(100% - 20px);
  margin: 10px 10px 0 10px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 限制为2行 */
  overflow: hidden;
  line-height: 20px;
  position: relative;
  text-indent: 32px;
  cursor: pointer;
  &::before{
    content: '备注：';
    left: -33px;
    position: absolute;
    color: #666666;
    font-size: 14px;
  }
}

.user-wapper{
  padding: 10px 10px 0 10px;
  width: calc(100% - 20px);
  height: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  align-items: center;
  .user-lefter{
    height: 20px;
    display: flex;
    align-items: center;
     .user-logo{
      width: 20px;
      height: 20px;
      border-radius: 50% 50% 50% 50%;
     }
     span{
      margin-left: 10px;
     }
  }
  .time-righer{
      color: #666666;
     }
}
.line{
  margin: 5px 5px 6px 10px;
  width: calc(100% - 20px);
  border-bottom: 1px #CDCDCD dotted;
}
.action-wapper{
  padding: 0px 10px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
}
</style>
