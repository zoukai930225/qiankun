<template>
    <div>
        <el-image v-if="info[url] && fileIsImg(info[url])" style="
              width: 40px;
              height: 40px;
              border-radius: 4px;
              margin-right: 8px;
              vertical-align: middle;
            " :preview-teleported="true" :src="info[url]" :preview-src-list="[
                info[url] ? info[url] : ''
            ]" fit="cover" />
        <div class="row-center" v-if="info[url] && !fileIsImg(info[url])" style="width: 120px">
            <img style="
                width: 14px;
                height: 17px;
                color: #909399;
                margin-left: 10px;
                margin-right: 4px;
              " :src="getFileIcon(getFileName(info[url]))" />
            <div class="fileName" @click="fileDownload(info[url])">{{
                getFileName(info[url]) }}
            </div>
        </div>
    </div>
</template>

<script lang="tsx">
export default { name: 'LineFile' };
</script>

<script lang="tsx" setup>
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import fileDoc from '@/assets/imgs/file_doc.png'

const props = defineProps({
    info: { type: Object, default: () => { } },
    url: { type: String, default: 'url' },
});

const fileIsImg = (fileUrl) => {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
    const extension = fileUrl && fileUrl.toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    return isImg
}

const getFileIcon = (fileName) => {
    if (fileName) {
        if (fileName.includes('xlsx') || fileName.includes('xls')) {
            return fileExcel
        } else if (fileName.includes('pdf') || fileName.includes('xls')) {
            return filePdf
        } else {
            return fileDoc
        }
    }
}

const getFileName = (file) => {
    if (file) {
        let arr = file.split('?name=')
        if (arr.length > 1) {
            return arr[1]
        }
        const arr1 = file.url.split('/')
        if (arr1.length > 0) {
            return arr1[arr1.length - 1]
        }
    } else {
        return ''
    }
}

const fileDownload = (fileUrl) => {
    window.open(fileUrl, '_blank')
}

</script>
<style lang="scss" scoped>
.user {
    display: flex;
    align-items: center;

    .ava {
        margin-right: 10px;

        .name {
            font-size: 6px;
        }
    }
}
</style>
