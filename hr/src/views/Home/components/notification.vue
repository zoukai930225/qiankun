<template>
    <div class="home_page_card">
        <span class="home_page_title">消息通知</span>
        <span class="home_page_txt">站内信，查看我收到的消息！</span>
        <div :class="['notification_list', messages?.length ? 'border' : '']">
            <div v-if="messages?.length" @click="showMessage">
                <div v-for="item in messages" class="notification_list_item">
                    <div class="notification_list_item_title">
                        <img :src="notify" alt="" class="notify">
                        <span class="name">{{ getDictLabel(DICT_TYPE.MESSAGE_NOTICE_TYPE, item.noticeType) }}</span>
                    </div>
                    <div class="message">{{ item.messageTheme }}</div>
                </div>
            </div>
            <img v-else src="@/assets/svgs/home/empty.svg" alt="" class="empty">
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'HomePageNotification' };
</script>

<script lang="ts" setup>
import { userMessageStore } from '@/store/modules/userMessage';
import { DICT_TYPE, getDictLabel } from '@/utils/dict';
import notify from '@/assets/imgs/home/notify.svg';
import request from '@/config/axios';

const messageStore = userMessageStore();

const messages = computed(() => messageStore.messageList);

const initData = () => {
    request.post({ url: `/api/message/notice/getMessageList`, data: { page: 1, size: 4, isHandle: 0 } }).then((res: any) => {
        messageStore.setMessageData(res?.records?.length ? res.records : []);
    });
};

const showMessage = () => {
    messageStore.openVisible();
    messageStore.updateTabActiveName('wait');
}

onMounted(() => initData());

</script>

<style lang="scss" scoped>
@use '../style.scss';

.border {
    border-top: 1px solid #E5E5E5;
}

.notification_list {
    margin-top: 5px;
    height: calc(100% - 50px);
    position: relative;

    .empty {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }

    &_item {
        padding: 10px 5px;
        cursor: pointer;
        border-bottom: 1px solid #E5E5E5;

        .message {
            margin-top: 6px;
            color: #333;
            font-size: 14px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        &_title {
            color: #333;
            font-size: 14px;

            .notify {
                width: 14px;
                height: 14px;
            }

            .name {
                vertical-align: top;
                font-size: 14px;
                margin-left: 8px;
                font-weight: 500;
            }
        }

        &:hover {
            background: #F8F8F9;
        }
    }
}
</style>
