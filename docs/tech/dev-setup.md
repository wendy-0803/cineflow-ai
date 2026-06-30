# 开发启动记录

## 当前状态

已创建 Next.js 项目源码：

- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `app/mock-data.ts`
- `app/types.ts`

已额外创建无依赖静态预览版：

- `preview/index.html`
- `preview/styles.css`
- `preview/app.js`

## 依赖安装情况

本机默认 Node 是 `v12.22.12`，不能运行现代 Next.js。

Codex bundled runtime 提供了：

- Node.js：`C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
- pnpm：`C:\Users\zxw\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\pnpm.cmd`

当前 Next.js 依赖已安装，并已修正为使用 bundled Node runtime 启动。

## 环境变量

要启用真实 AI 生成接口，需要在项目根目录创建 `.env.local`，至少包含：

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

说明：

- `OPENAI_API_KEY` 必填。
- `OPENAI_MODEL` 可选，不填时默认使用 `gpt-4o-mini`。
- 接口路径为 `POST /api/generate/story`。

如果没有配置 `OPENAI_API_KEY`，脚本生成页会在真实调用失败后回退到示例脚本。

## 能立即打开的预览

直接打开：

`D:\zxw\CineFlow AI\preview\index.html`

或启动本地静态服务器：

```powershell
cd "D:\zxw\CineFlow AI\preview"
python -m http.server 3000
```

然后访问：

`http://localhost:3000`

## 运行 Next.js

```powershell
cd "D:\zxw\CineFlow AI"
.\start-next.ps1
```
