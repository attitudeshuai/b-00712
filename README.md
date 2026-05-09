# 校园社团管理系统

## 项目介绍
本项目是一个基于 HTML, CSS (LayUI), JavaScript (ES6+) 开发的校园社团管理系统。系统主要服务于高校社团管理工作，提供社团信息展示、成员信息管理、以及系统用户登录与权限控制等功能。项目采用前端静态页面结合 localStorage 本地存储的架构，无需后端数据库即可运行演示。

## 核心功能

1. **登录验证**
   - 管理员登录（默认账号：admin / 123456）
   - 表单验证与错误提示
   - 登录状态持久化

2. **首页仪表盘**
   - 核心数据统计（社团总数、成员总数）
   - 社团类型分布图表 (ECharts)
   - 最新动态展示

3. **社团管理**
   - 社团列表展示
   - 按学院、社团类型筛选
   - 数据本地加载

4. **成员管理**
   - 成员列表分页展示
   - 成员搜索（姓名/学号）
   - 新增成员（包含学号唯一性校验）
   - 编辑/删除成员
   - 动态关联社团信息

5. **个人中心**
   - 管理员信息展示
   - 密码修改（同步更新登录凭证）

## 项目目录结构

```
project/
├── index.html              # 首页
├── login.html              # 登录页
├── public/
│   └── data/               # 初始 JSON 数据
│       ├── club.json
│       └── member.json
├── src/
│   ├── css/
│   │   └── style.css       # 全局样式
│   ├── js/
│   │   ├── common.js       # 公共逻辑 (Auth, Init, Layout)
│   │   ├── index.js        # 首页逻辑
│   │   ├── login.js        # 登录逻辑
│   │   ├── club.js         # 社团列表逻辑
│   │   ├── member.js       # 成员列表逻辑
│   │   ├── member_add.js   # 成员添加/编辑逻辑
│   │   └── profile.js      # 个人中心逻辑
│   └── pages/
│       ├── club/
│       │   └── list.html   # 社团列表页
│       ├── member/
│       │   ├── list.html   # 成员列表页
│       │   └── add.html    # 成员添加页
│       └── user/
│           └── profile.html # 个人中心页
├── package.json
└── README.md
```

## 部署与运行

### 1. 环境准备
确保已安装 Node.js 和 pnpm。

### 2. 安装依赖
```bash
pnpm install
```

### 3. 启动项目

#### 方式一：本地开发 (pnpm)
```bash
pnpm install
pnpm dev
```
启动后访问终端显示的本地地址（通常为 http://localhost:5173）。

#### 方式二：Docker 部署
本项目支持 Docker 一键启动：
```bash
docker compose up
```
启动后访问 http://localhost:3000。

### 4. 初始账号
- 用户名：`admin`
- 密码：`123456`

## 技术栈
- **HTML5 / CSS3**: 语义化标签，Flex/Grid 布局
- **JavaScript (ES6+)**: 模块化开发，DOM 操作
- **LayUI**: UI 界面框架
- **ECharts**: 数据可视化
- **Vite**: 开发构建工具
