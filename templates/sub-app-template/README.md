# WLP Sub App Template

Web App Lifecycle Platform 子应用模板。

## Quick Start

```bash
# 1. 复制模板
cp -r templates/sub-app-template my-sub-app
cd my-sub-app

# 2. 修改 package.json 中的 name 字段

# 3. 安装依赖
pnpm install

# 4. 启动开发
pnpm dev
```

## 注册到管理平台

1. 打开管理平台 → Registered Apps → 新增应用
2. 填写：
   - **Name**: 子应用唯一标识（如 `sub-order`）
   - **Display Name**: 显示名称（如 `订单管理`）
   - **Active Rule**: 路由前缀（如 `/order`）
   - **Entry Dev**: 本地开发地址（如 `http://localhost:5176`）
3. 刷新主应用，侧边栏出现新链接

## 自动部署（可选）

如果使用 Vercel 自动部署：

1. 在 Vercel 创建项目，关联你的 Git 仓库
2. 在 GitHub 仓库 Settings → Secrets 中添加：
   - `VERCEL_TOKEN` — Vercel 个人令牌
   - `VERCEL_ORG_ID` — Vercel 组织 ID
   - `VERCEL_PROJECT_ID` — Vercel 项目 ID
   - `WLP_API_URL` — 管理平台 API 地址
   - `WLP_APP_NAME` — 在管理平台注册的应用 name
3. 推代码到 `develop`/`staging`/`main` 分支即可自动部署

## 静态包上传（可选）

不使用 Vercel 时，可以手动部署：

```bash
pnpm build
# 将 dist 目录打成 zip
zip -r dist.zip dist/
```

在管理平台 → 应用详情 → 上传 dist.zip → 选择目标环境。
