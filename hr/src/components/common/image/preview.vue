<template>
    <el-image :src="imageSrc" class="logo" :key="key" lazy @error="handleImageError" v-bind="props" alt="暂无图片"
        v-loading="loading" @load="load" />
</template>

<script lang="ts">
export default { name: 'PreviewImage' }
</script>

<script lang="ts" setup>
import { v4 as uuidv4 } from 'uuid'

const key = ref<string>(uuidv4()), imageSrc = ref<any>(''), loading = ref<boolean>(false);

const props = defineProps({
    url: { type: String, required: true, default: '' },
    props: { default: () => { } },
});

const supportsWebP = () => {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') == 0);
};

const handleImageError = () => {
    if (imageSrc.value.includes('format,webp')) {
        imageSrc.value = `${formatOnePic(props.url)}?x-oss-process=image/format,jpg|quality,q_20`;
        loading.value = true;
        key.value = uuidv4();
    }
};

const formatOnePic = (url) => url ? `${url.split(',')[0]}` : '';

watchEffect(() => {
    if (!supportsWebP()) {
        imageSrc.value = `${formatOnePic(props.url)}?x-oss-process=image/format,jpg|quality,q_20`;
        loading.value = true;
    } else {
        imageSrc.value = `${formatOnePic(props.url)}?x-oss-process=image/format,webp|quality,q_20`;
        loading.value = true;
    }
});

const load = () => {
    loading.value = false;
};

</script>

<style lang="scss" scoped></style>
