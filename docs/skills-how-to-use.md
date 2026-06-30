# Skills 是什么，该如何使用

## 1. Skills 是什么

在 Codex 里，skills 可以理解为“专门任务的操作说明书”。当任务涉及某类专业工作时，Codex 会先读取对应 skill 的说明，再按里面的方法做事。

它不是你项目里的技能点，也不是简历上的技能标签，而是 Codex 帮你完成任务时使用的工作流插件。

例如：

- 做 PDF：使用 `pdf` skill。
- 做 Word 文档：使用 `documents` skill。
- 做 PPT：使用 `presentations` skill。
- 做表格：使用 `spreadsheets` skill。
- 做 Figma 设计或读 Figma：使用 `figma` / `figma-use` / `figma-implement-design`。
- 做图片生成：使用 `imagegen`。
- 查 OpenAI 官方文档：使用 `openai-docs`。

## 2. 这个项目里最可能用到的 skills

### Figma 相关

当你要做产品原型时可以说：

> 帮我用 Figma 做 CineFlow AI 的低保真原型。

或：

> 根据 PRD 生成 Figma 页面，包括工作台、新建项目、脚本生成、分镜编辑、导出页。

Codex 会使用 Figma 相关 skill 和工具。

### PDF

当你要导出作品集或 PRD PDF 时可以说：

> 把这个项目 PRD 整理成一份 PDF。

或：

> 帮我生成一份适合面试展示的项目复盘 PDF。

Codex 会使用 PDF skill，并进行渲染检查。

### Presentations

当你要做面试汇报 PPT 时可以说：

> 帮我把 CineFlow AI 做成 8 页项目展示 PPT。

Codex 会使用 presentations skill。

### Documents

当你要写正式文档时可以说：

> 帮我把 PRD 整理成 Word 文档。

Codex 会使用 documents skill。

### Spreadsheets

当你做竞品调研表、用户反馈表时可以说：

> 帮我做一个竞品调研 Excel 表。

或：

> 帮我做一个用户反馈记录表。

Codex 会使用 spreadsheets skill。

### OpenAI Docs

当你要确认 OpenAI API 最新用法时可以说：

> 查一下 OpenAI API 当前推荐的结构化输出方式，并帮我接入项目。

Codex 会使用 openai-docs skill 和官方文档。

## 3. 你应该怎么和 Codex 配合

### 推荐方式

每次只推进一个明确任务：

- “帮我完成竞品调研模板。”
- “帮我把 PRD 改成面试可展示版本。”
- “帮我搭建 Next.js 项目。”
- “帮我先用 mock 数据做出分镜编辑页。”
- “帮我接入 AI 生成接口。”
- “帮我生成作品集 PDF。”

### 不推荐方式

不要一次说：

> 帮我把所有东西都做完。

这个项目包含产品、设计、开发、测试、部署和作品集，最好按阶段推进。

## 4. 这个项目的建议使用顺序

1. 不用特殊 skill：先完善 PRD、路线图、竞品调研。
2. 使用 Figma skill：做低保真或高保真原型。
3. 不用特殊 skill：搭建 Next.js MVP。
4. 使用 openai-docs skill：确认 AI API 接入方式。
5. 使用 spreadsheets skill：记录用户反馈和竞品分析。
6. 使用 pdf / presentations / documents skill：产出作品集、PPT、简历材料。

## 5. 你下一句可以直接这样说

如果你想继续产品部分：

> 先带我完成竞品调研和用户流程。

如果你想直接开始开发：

> 直接帮我搭建 Next.js 项目，并先做 mock 数据版 MVP。

如果你想先做面试材料：

> 帮我把这个项目包装成简历项目经历和 3 分钟面试讲述稿。
