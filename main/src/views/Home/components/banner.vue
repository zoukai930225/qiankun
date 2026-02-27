<template>
    <div class="home_page_banner">
        <img :src="horn" class="banner_horn">
        <div class="banner_text">
            <span>{{ txt }}</span>
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'HomePageBanner' };
</script>

<script lang="ts" setup>
import horn from '@/assets/svgs/home/horn.svg';

const txt = computed(() => `从工作台开始！让每一天的努力都闪耀光芒～`);

</script>

<style lang="scss" scoped>
.home_page_banner {
    height: 50px;
    padding: 15px 16px;
    line-height: 20px;
    border-radius: 10px;
    background: #EEF4FF;
    box-sizing: border-box;
    border: 1px solid rgba(0, 100, 255, 0.3);

    .banner_horn {
        height: 20px;
        width: 20px;
        margin-right: 10px;
    }

    .banner_text {
        display: inline-block;
        color: var(--el-color-primary);
        font-size: 16px;
        font-family: PingFang SC;
        white-space: nowrap;
        overflow: hidden;
        width: calc(100% - 32px);
        position: relative;
        height: 20px;
    }

    .banner_text span {
        display: inline-block;
        position: absolute;
        animation: marquee 30s linear infinite;
        white-space: nowrap;
        left: 100%;
    }

    @keyframes marquee {
        0% {
            left: 100%;
        }

        100% {
            left: -100%;
        }
    }
}
</style>
