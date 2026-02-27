/* eslint-disable */
const path = require('path')
const fs = require('fs')

const args = process.argv

const mode = args[2] || 'drawer'

const fileList = args[3] || undefined
if (fileList === undefined) {
  console.log('缺少参数：页面文件参数')
  return
}

const fsList = fileList.split("/")

const fsName = fsList[fsList.length - 1]

const basePath = path.dirname(__dirname)

const tsFilePath = './src/router/modules/details.ts';

let tsContent = fs.readFileSync(tsFilePath, 'utf8');

const index = path.join(__dirname, 'temp', pageChoose(mode))
const detail = path.join(__dirname, 'temp', detailChoose(mode))
const style = path.join(__dirname, 'temp', 'style.temp')
const config = path.join(__dirname, 'temp', 'config.temp')
const configDetails = path.join(__dirname, 'temp', 'config-details.temp')
const executable = path.join(__dirname, 'temp', 'executable.temp')

var indexStr = fs.readFileSync(index, { encoding: 'utf-8' })
var detailStr = fs.readFileSync(detail, { encoding: 'utf-8' })
var styleStr = fs.readFileSync(style, { encoding: 'utf-8' })
var configStr = fs.readFileSync(config, { encoding: 'utf-8' })
var configDetailsStr = fs.readFileSync(configDetails, { encoding: 'utf-8' })
var executableStr = fs.readFileSync(executable, { encoding: 'utf-8' })

indexStr = indexStr.replace('*page*', replaceStr(fsName))
indexStr = indexStr.replace('*page-details*', fsName)
indexStr = indexStr.replace('*page-table*', replaceStr(fsName))
indexStr = indexStr.replace('*page-name*', replaceStr(fsName))
indexStr = indexStr.replace('*page-components*', replaceStr(fsName))
indexStr = indexStr.replace('*page-provide*', replaceStr(fsName))
indexStr = indexStr.replace('*page-list-name*', args[4])

detailStr = detailStr.replace('*page*', replaceStr(fsName))
detailStr = detailStr.replace('*page-details*', replaceStr(fsName))
detailStr = detailStr.replace('*page-form*', replaceStr(fsName))
detailStr = detailStr.replace('*page-provide*', replaceStr(fsName))
detailStr = detailStr.replace('*page-executable*', replaceStr(fsName))
detailStr = detailStr.replace('*page-class*', fsName)

styleStr = styleStr.replace('*page*', fsName)

const pagePath = [basePath, 'src', 'views', ...fsList].join('\\')

try {
  // 检查目录是否存在
  if (fs.existsSync(pagePath)) {
    console.log('⚠ 目录已存在');
  } else {
    // 递归创建目录
    fs.mkdirSync(pagePath, { recursive: true });
    console.log('✓ 目录创建成功');
    createPageFiles()
  }
} catch (error) {
  console.error('❌ 创建页面失败:', error.message);
  process.exit(1);
}

function createPageFiles() {
  const listModulePath = [basePath, 'src', 'views', ...fsList, 'page'].join('\\')
  fs.mkdirSync(listModulePath)
  const detailModulePath = [basePath, 'src', 'views', ...fsList, 'details'].join('\\')
  fs.mkdirSync(detailModulePath)
  const componentsPath = [basePath, 'src', 'views', ...fsList, 'components'].join('\\')
  fs.mkdirSync(componentsPath)

  fs.writeFileSync(path.join(listModulePath, 'index.vue'), Buffer.from(indexStr))
  fs.writeFileSync(path.join(listModulePath, 'styles.scss'), Buffer.from(styleStr))
  fs.writeFileSync(path.join(detailModulePath, 'index.vue'), Buffer.from(detailStr))
  fs.writeFileSync(path.join(detailModulePath, 'styles.scss'), Buffer.from(styleStr))
  fs.writeFileSync(path.join(listModulePath, 'config.tsx'), Buffer.from(configStr))

  if (mode === 'details') {
    fs.writeFileSync(path.join(detailModulePath, 'details.tsx'), Buffer.from(configDetailsStr))
    fs.writeFileSync(path.join(detailModulePath, 'executable.tsx'), Buffer.from(executableStr))
    const customTs = `{
        path: '${fsName}Details',
        component: () => import('@/views/${fileList}/details/index.vue'),
        name: '${replaceStr(fsName)}Details',
        meta: {
          title: '${args[4]}信息',
          noCache: false,
          hidden: true,
          canTo: true,
          keepAlive: true
        }
      },
      // <!-- INJECT_ROUTER -->`;
    tsContent = tsContent.replace(`// <!-- INJECT_ROUTER -->`, customTs);
    fs.writeFileSync(tsFilePath, tsContent);
  }
}


function replaceStr(str) {
  str = str.toLowerCase();
  var reg = /\b(\w)|\s(\w)/g;
  return str.replace(reg, function (m) {
    return m.toUpperCase()
  });
}

function detailChoose(str) {
  var name = 'detail.temp'
  switch (str) {
    case 'dialog': name = 'detail-dialog.temp'; break;
    case 'details': name = 'detail-tab.temp'; break;
    default: break;
  }
  return name;
}

function pageChoose(str) {
  var name = 'index.temp'
  switch (str) {
    case 'details': name = 'index-tab.temp'; break;
    default: break;
  }
  return name;
}