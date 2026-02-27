<!--
 * @Date: 2024-06-03 09:28:29
-->

## 淘宝店管理后台

### git commit

```bash
git commit:
- feat：新功能（feature）
- fix：修补bug
- docs：文档（documentation）
- style： 格式（不影响代码运行的变动）
- refactor：重构（即不是新增功能，也不是修改bug的代码变动）
- test：增加测试
- chore：构建过程或辅助工具的变动
```

### 启动

### 安装依赖

```bash
  pnpm install
```

### 部署

```bash
# 本地开发环境
pnpm run dev

# 本地测试环境
pnpm run dev:test

# 线上开发环境
pnpm run build:dev

# 线上测试环境
pnpm run build:test

# 线上生产环境
pnpm run build:pro
```

```账号密码
admin
123456
```

```bash
- 自动化参考 https://puppeteer.bootcss.com/
# 为了方便抓去，添加标识规则
# id=`puppeteer-${页面路由名字}-${按钮功能名称}`
```
