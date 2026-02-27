<template>
  <div class="container">
    <div v-for="(item, index) in dataList" :key="index" class="grid-item">
      <!-- <div class="step">step{{ index + 1 }}</div> -->
      <div class="step">
        <img class="step" v-if="item.type === 'RPA'" src="@/assets/imgs/dashboard/RPA.png" alt="" />
        <img class="step" v-if="item.type === 'DB'" src="@/assets/imgs/dashboard/DB.png" alt="" />
        <img class="step" v-if="item.type === 'DTS'" src="@/assets/imgs/dashboard/DTS.png" alt="" />
        <img class="step" v-if="item.type === 'API'" src="@/assets/imgs/dashboard/API.png" alt="" />
        <img class="step" v-if="item.type === 'ST'" src="@/assets/imgs/dashboard/ST.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, watch } from 'vue'

const props = defineProps<{
  list: Array<any>
}>()
const dataList = ref<any>([])

if (props.list) {
  dataList.value = props.list
}
// 监听props变化
watch(
  () => props.list,
  (newVal) => {
    dataList.value = newVal
  },
  { immediate: true }
)
</script>

<style lang="less">
/** 可配置的参数 可以调整试试 */
@colNum: 4; // 单行排列的步骤 试试 2、3、4、5、6
@colEven: @colNum * 2; // 两行元素数
@lineWidth: 26px; // 步骤间连线长度
@rowDistance: 40px; // 行间距
@colDistance: @lineWidth; // 列间距
@arrowSize: 6px; // 箭头大小
@stepColor: #cfbbfd; // 步骤颜色

.container {
  display: grid;
  grid-template-columns: repeat(@colNum, 1fr);
  gap: @rowDistance @colDistance;
}

.grid-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    position: absolute;
    right: (-@colDistance / 2);

    width: 36px;
    height: 15px;
    background-repeat: no-repeat;
    background-image: url('@/assets/imgs/dashboard/arrow.png');
    background-size: 100% 100%;
  }

  // 给每行最后一个步骤（除最后一行）添加向下的连接箭头
  &:nth-child(@{colNum}n) {
    &:not(:last-child) {
      .step {
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          bottom: -(@rowDistance / 2);
          width: 36px;
          height: 15px;
          background-repeat: no-repeat;
          background-image: url('@/assets/imgs/dashboard/arrow.png');
          background-size: 100% 100%;
          transform: translate(-50%, 50%) rotate(90deg);
        }
      }
    }
  }

  each(range(@colEven), {
        &:nth-child(@{colEven}n+@{value}) {
          @isEvenLine: boolean(@value > @colNum);
          @modNum: mod(@value, @colEven); // 余数 1、2、3、4、5、0
          color: if(@isEvenLine, #7dbcf7, #f38cd6);

          /** 偶数行旋转箭头，步骤倒序排列（使用transform交换位置） */
          & when (@isEvenLine) {
            @transN: (@colNum + 1 + @colEven - @value - @value);
            transform: translateX(calc(@transN * 100% + @transN * @colDistance));

            &::after {
              transform: translateX(50%) rotate(180deg) !important; // 旋转箭头
            }
          }

          // 最右排(n & n + 1 位)隐藏多余的箭头（如果container设置了overflow:hidden 则不用处理）
          & when (@modNum=@colNum), (@modNum=@colNum+1) {
            &::before, &::after {
              display: none;
            }
          }

          // 最后一个步骤在奇数行 需要隐藏连线箭头
          & when not (@isEvenLine) {
            &:last-child {
              &::before, &::after {
                display: none;
              }
            }
          }

        }
      }

    );
}

.step {
  position: relative;
}
</style>
