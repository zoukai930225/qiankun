<template>
    <div class="home_page">
        <home-page-banner />
        <el-row :gutter="20" class="home_page_body">
            <el-col :span="9" class="top">
                <home-page-to-do class="h_544" />
            </el-col>
            <el-col :span="9" class="top">
                <home-page-quick class="h_544" />
            </el-col>
            <el-col :span="6" class="top no_p_r">
                <home-page-calendar class="h_544" />
            </el-col>
            <el-col :span="18" class="top">
                <home-page-adhibition class="h_312" />
            </el-col>
            <el-col :span="6" class="top no_p_r">
                <home-page-notification class="h_312" />
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
export default { name: 'HomePage' };
</script>

<script lang="ts" setup>
import HomePageNotification from "./components/notification.vue";
import HomePageAdhibition from "./components/adhibition.vue";
import HomePageCalendar from "./components/calendar.vue";
import HomePageBanner from "./components/banner.vue";
import HomePageQuick from "./components/quick.vue";
import HomePageToDo from "./components/toDo.vue";

</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
