<template>
  <div ref="chartRef" style="width: 124px; height: 124px;"></div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import * as echarts from 'echarts';

const props = defineProps({
  percentage: {
    type: Number,
    required: true,
    default: 0
  }
});

const chartRef = ref<HTMLDivElement>();
let chartInstance: echarts.ECharts | null = null;

const getOption = (value: number) => {
  return {
    tooltip: {
      show: true,
      formatter: function (params) {
        // 只展示完播率的tooltip
        if (params.name === '完播率') {
          return `完播率：${value}%`;
        } else {
          return '';
        }
      },
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      textStyle: {
        color: '#fff'
      },
      borderWidth: 0,
      padding: [8, 12]
    },
    legend: {
      show: false
    },
    series: [
      // 外层环 - 主要数据展示
      {
        type: 'pie',
        radius: ['38px', '62px'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [
          {
            value: value,
            name: '完播率',
            itemStyle: {
              color: '#3FC2FF'
            }
          },
          {
            value: 100 - value,
            name: '未完播',
            itemStyle: {
              color: '#FFFFFF'
            }
          }
        ],
        labelLine: {
          show: false
        },
        startAngle: 90,
        animation: false,
        zlevel: 2
      },
      // 内层环 - 创建3D阴影效果
      {
        type: 'pie',
        radius: ['31px', '38px'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [
          {
            value: value,
            name: '完播率阴影',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(63, 194, 255, 0.7)' },
                { offset: 1, color: 'rgba(43, 164, 220, 0.5)' }
              ])
            }
          },
          {
            value: 100 - value,
            name: '未完播阴影',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(240, 242, 245, 0.7)' },
                { offset: 1, color: 'rgba(240, 242, 245, 0.2)' }
              ])
            }
          }
        ],
        labelLine: {
          show: false
        },
        silent: true,
        animation: false,
        startAngle: 90,
        zlevel: 1
      },
      // 最内层 - 白色背景
      {
        type: 'pie',
        radius: ['0', '31px'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          scale: false
        },
        data: [
          {
            value: 100,
            itemStyle: {
              color: '#fff',
              shadowBlur: 5,
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowOffsetY: 1
            }
          }
        ],
        labelLine: {
          show: false
        },
        silent: true,
        animation: false,
        zlevel: 0
      }
    ]
  };
};

onMounted(() => {
  if (chartRef.value) {
    chartInstance = echarts.init(chartRef.value);
    chartInstance.setOption(getOption(props.percentage));

    window.addEventListener('resize', () => {
      chartInstance?.resize();
    });
  }
});

watch(() => props.percentage, (newValue) => {
  if (chartInstance) {
    chartInstance.setOption(getOption(newValue));
  }
});
</script>