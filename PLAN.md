# Web 应用生命周期管理平台 — 实施规划

## 项目目标

基于微前端架构，实现一套 Web 应用的全生命周期管理平台，涵盖：
- 微前端子应用加载与路由分发
- 多环境部署管理
- 资源上报与版本管理
- 开发联调
- 发版迭代流程

## 技术选型

| 模块 | 方案 |
|------|------|
| 微前端框架 | wujie（无界） |
| 主应用 | React 18 + TypeScript + Vite |
| 子应用 | React 18 + TypeScript + Vite（各子应用独立） |
| 包管理 | pnpm workspace（monorepo） |
| CI/CD | GitHub Actions |
| 静态托管 | Cloudflare Pages |
| 后端 API | Cloudflare Workers（Serverless） |
| 数据库 | Supabase（PostgreSQL） |
| 缓存 | Upstash Redis |
| 配置中心 | GitHub 仓库（JSON 文件，Git as DB） |
| DNS | Cloudflare DNS（免费） |

## 免费资源清单

| 资源 | 平台 | 免费额度 |
|------|------|---------|
| 代码仓库 | GitHub | 无限 |
| CI/CD | GitHub Actions | 2000 分钟/月 |
| 前端托管 + CDN | Cloudflare Pages | 无限带宽，500 次构建/月 |
| Serverless API | Cloudflare Workers | 10 万次请求/天 |
| 数据库 | Supabase | 500MB PostgreSQL |
| Redis 缓存 | Upstash | 1 万次请求/天 |
| DNS 解析 | Cloudflare | 免费 |

## 项目结构

```
webapp-lifecycle-platform/
├── PLAN.md                          # 本文件
├── package.json                     # monorepo 根配置
├── pnpm-workspace.yaml              # pnpm workspace 配置
├── apps/
│   ├── main-app/                    # 主应用（基座）
│   │   ├── src/
│   │   │   ├── main.tsx
│   │   │   ├── App.tsx
│   │   │   ├── micro/               # 微前端加载逻辑
│   │   │   │   ├── apps.ts          # 子应用注册表
│   │   │   │   └── loader.ts        # 动态加载器
│   │   │   ├── layout/              # 全局布局
│   │   │   └── router/              # 路由配置
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── sub-supplier/                # 子应用：商户管理
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   └── sub-goods/                   # 子应用：商品管理
│       ├── src/
│       ├── package.json
│       └── vite.config.ts
├── packages/
│   └── shared/                      # 公共工具库
│       ├── src/
│       └── package.json
├── config/                          # 配置中心（Git as DB）
│   ├── apps.json                    # 子应用注册清单
│   ├── routes.json                  # 路由配置表
│   └── environments.json            # 环境配置
├── scripts/                         # 构建/部署脚本
│   └── report-assets.ts             # 资源上报脚本（OE）
└── .github/
    └── workflows/
        ├── build-main.yml           # 主应用构建部署
        ├── build-sub-app.yml        # 子应用构建部署
        └── deploy.yml               # 发版流程
```

## 实施阶段

### Phase 1：核心链路（当前阶段）
1. 搭建 monorepo 项目骨架
2. 实现主应用（基座 + 路由分发 + wujie 加载）
3. 实现 2 个子应用（supplier + goods）
4. 配置资源清单，主应用动态加载子应用
5. 本地联调验证

### Phase 2：部署上线
1. 配置 GitHub Actions 自动构建
2. 子应用部署到 Cloudflare Pages
3. 构建后自动更新 config/apps.json 资源清单
4. 主应用从配置仓库拉取资源清单动态加载

### Phase 3：管理平台
1. Supabase 搭建数据库（应用注册、发布记录）
2. Cloudflare Workers 实现后端 API
3. 管理平台 UI（应用面板 + 应用管理）

### Phase 4：发版流程
1. GitHub Actions workflow_dispatch 实现发版流程
2. 环境选择、分支选择、状态检查
3. 发布审批（PR Review）
4. 一键回滚

### Phase 5：开发联调
1. 本地 dev server 代理配置
2. Host 映射工具
3. 联调域名自动生成

## 架构示意

```
用户访问
  │
  ▼
主应用 (main.xxx.pages.dev)
  │
  ├── / (首页)                      → 主应用自身渲染
  ├── #/supplier/*                  → 加载 supplier.xxx.pages.dev
  ├── #/goods/*                     → 加载 goods.xxx.pages.dev
  └── #/purchase/*                  → 加载 purchase.xxx.pages.dev（后续扩展）
  │
  │  启动时拉取
  ▼
config/apps.json（子应用资源清单）
  │
  │  GitHub Actions 构建后自动更新
  ▼
各子应用仓库 push → Actions 构建 → 部署到 Cloudflare Pages → 更新 apps.json
```
