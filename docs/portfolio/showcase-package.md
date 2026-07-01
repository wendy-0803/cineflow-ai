# CineFlow AI 展示包

这份文档把项目整理成四个可直接对外展示的部分：可展示链接、GitHub 仓库、项目说明文档和 Demo 录屏。

## 1. 可展示链接

- 线上地址：<https://cineflow-ai-seven.vercel.app/>
- 访问说明：该链接已完成 Vercel 部署；若某些网络环境无法直连，请配合录屏或 GitHub 仓库一起展示。

## 2. GitHub 仓库

- 仓库地址：<https://github.com/wendy-0803/cineflow-ai>
- 当前内容：
  - Next.js Web MVP
  - OpenAI 结构化生成接口
  - story / storyboard 两阶段生成
  - 低保真到高保真产品文档
  - 本地预览页与部署脚本

## 3. 项目说明文档

建议对外展示时优先引用这几份文档：

- `README.md`：项目总览与运行方式
- `docs/prd/PRD.md`：产品目标、用户、功能范围和页面流程
- `docs/prd/user-flow.md`：用户从工作台到导出的完整操作链路
- `docs/research/competitor-research.md`：竞品调研与切入点
- `docs/tech/technical-plan.md`：技术实现思路
- `docs/prompts/prompt-pipeline.md`：多阶段 Prompt 流水线
- `docs/portfolio/interview-packaging.md`：面试表达方式与项目包装

如果只想给别人一个最容易读的入口，推荐直接看：

1. `docs/portfolio/interview-packaging.md`
2. `docs/prd/PRD.md`
3. `docs/prd/user-flow.md`

## 4. Demo 录屏

### 录屏目标

让面试官在 1 到 2 分钟内看懂：

- 用户进来能干什么
- 这个项目解决了什么问题
- AI 生成链路是什么
- 结果能导出到哪里

### 推荐录屏顺序

1. 打开工作台首页
2. 新建一个短片项目
3. 填入题材、风格、时长、平台、受众
4. 点击生成脚本
5. 展示故事梗概、角色设定、分场景脚本
6. 进入分镜编辑
7. 展示局部重生成
8. 点击导出
9. 打开导出结果，强调 Markdown / JSON / PDF

### 录屏时长建议

- 最短版：60 秒
- 标准版：90 秒
- 面试讲解版：2 分钟

### 录屏收尾话术

你可以直接说：

> 这个项目不是直接做视频生成，而是把短视频创作中最容易卡住的前置规划环节产品化，帮助用户把一句创意快速拆成可执行的脚本、分镜和提示词，并能直接导出给即梦、可灵、Runway 这类工具使用。

## 5. 对外展示建议

如果是投简历或发面试作品集，建议组合为：

1. 公网链接
2. GitHub 仓库
3. 项目说明文档
4. 录屏视频

这样即使某个网络环境打不开线上地址，也不会影响整体展示。
