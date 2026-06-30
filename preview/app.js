const project = {
  title: "雨夜回信",
  logline: "一个失眠女孩在未来自己的提醒中，学会与过去和解。",
  synopsis:
    "雨夜里，长期失眠的林夏收到一封没有署名的信。她循着信上的地址来到空荡的公交站，遇见了十年后的自己。未来的林夏温和却回避关键问题，直到清晨第一班车到来，林夏终于意识到答案不是改变未来，而是停止惩罚现在的自己。",
  input: {
    brief: "一个失眠的女孩在雨夜遇见未来的自己",
    genre: "剧情",
    style: "电影感 / 治愈 / 轻科幻",
    duration: "60 秒",
    platform: "抖音 / 小红书",
    audience: "18 到 30 岁年轻女性",
    protagonist: "20 岁，长期失眠，情绪敏感",
    mood: "孤独 → 紧张 → 治愈"
  },
  acts: [
    "Act 1：雨夜失眠。林夏在房间里反复醒来，收到一封来自未来的信。",
    "Act 2：公交站相遇。她见到未来的自己，却发现对方隐瞒了最重要的真相。",
    "Act 3：清晨告别。林夏选择回到当下，给现在的自己一个新的开始。"
  ],
  scenes: [
    { id: "scene-1", title: "雨夜房间", purpose: "交代失眠状态" },
    { id: "scene-2", title: "公交站相遇", purpose: "制造奇遇和冲突" },
    { id: "scene-3", title: "清晨告别", purpose: "完成情绪释放" }
  ],
  shots: [
    {
      id: "shot-1",
      sceneId: "scene-1",
      title: "Shot 01",
      duration: "5s",
      meta: "全景 · 固定镜头",
      visual: "狭小房间里只有台灯亮着，窗外雨水模糊城市霓虹。",
      voice: "我已经很久没有真正睡着了。",
      prompt:
        "night bedroom, young Chinese woman in gray hoodie sitting on bed, rain on window, neon reflections, static wide shot, cinematic realistic lighting"
    },
    {
      id: "shot-2",
      sceneId: "scene-1",
      title: "Shot 02",
      duration: "6s",
      meta: "近景 · 慢推",
      visual: "桌面上一封湿润的白色信件，信封上写着：给今晚的你。",
      voice: "直到那封信出现在桌上。",
      prompt:
        "close-up of a damp white envelope on desk, handwritten Chinese text, warm desk lamp, slow push in, rainy night atmosphere"
    },
    {
      id: "shot-3",
      sceneId: "scene-2",
      title: "Shot 03",
      duration: "7s",
      meta: "中景 · 跟拍",
      visual: "空荡公交站被冷色灯光照亮，雨水在地面形成反光。",
      voice: "信上只有一个地址。",
      prompt:
        "empty bus stop at night, rain reflections on pavement, young woman walking with umbrella, cold cinematic light, tracking shot"
    },
    {
      id: "shot-4",
      sceneId: "scene-2",
      title: "Shot 04",
      duration: "8s",
      meta: "特写 · 慢推",
      visual: "未来的林夏转身，两人的眼睛在雨幕中对上。",
      voice: "你终于来了。",
      prompt:
        "close-up, 30-year-old Chinese woman with transparent umbrella turns around, calm eyes, rain curtain, slow push, cinematic tension"
    },
    {
      id: "shot-5",
      sceneId: "scene-3",
      title: "Shot 05",
      duration: "7s",
      meta: "近景 · 横移",
      visual: "清晨微光出现，未来的林夏把透明雨伞递给林夏。",
      voice: "答案不是未来给的，是我现在决定的。",
      prompt:
        "early morning light at bus stop, older woman handing transparent umbrella to younger woman, gentle smile, soft cinematic realism"
    }
  ]
};

let view = "dashboard";
let selectedScene = "scene-1";
let selectedShot = project.shots[0].id;

const content = document.querySelector("#content");

function setView(next) {
  view = next;
  document.querySelectorAll(".nav").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === view);
  });
  render();
}

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

function header(eyebrow, title, desc, action = "") {
  return `<div class="header"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p class="desc">${desc}</p></div>${action}</div>`;
}

function panel(title, body) {
  return `<section class="panel"><h2>${title}</h2>${body}</section>`;
}

function render() {
  if (view === "dashboard") return renderDashboard();
  if (view === "new") return renderNewProject();
  if (view === "script") return renderScript();
  if (view === "storyboard") return renderStoryboard();
  if (view === "export") return renderExport();
  renderHistory();
}

function renderDashboard() {
  content.innerHTML = `
    <div class="page">
      ${header("工作台", "把一句创意变成可执行短片方案", "mock 数据版 MVP：故事结构、角色卡、镜头分镜、提示词复制和导出。", `<button class="primary" onclick="setView('new')">新建短片项目</button>`)}
      <div class="metrics">
        <div class="metric"><span class="meta">当前项目</span><strong>${project.title}</strong></div>
        <div class="metric"><span class="meta">镜头数量</span><strong>${project.shots.length} 个</strong></div>
        <div class="metric"><span class="meta">总时长</span><strong>33 秒</strong></div>
      </div>
      <div class="grid-2">
        ${panel("最近项目", `
          <button class="list-item" onclick="setView('storyboard')"><span><strong>${project.title}</strong><br><span class="meta">已生成分镜 · 3 个版本</span></span><span>→</span></button>
          <button class="list-item" onclick="setView('new')"><span><strong>AI 会议纪要广告</strong><br><span class="meta">草稿 · 待生成故事</span></span><span>→</span></button>
        `)}
        ${panel("示例模板", `
          <div class="templates">
            <button class="template" onclick="setView('new')">剧情短片</button>
            <button class="template" onclick="setView('new')">产品广告</button>
            <button class="template" onclick="setView('new')">知识科普</button>
            <button class="template" onclick="setView('new')">情绪短片</button>
          </div>
        `)}
      </div>
    </div>`;
}

function renderNewProject() {
  content.innerHTML = `
    <div class="page">
      ${header("新建项目", "用最少字段描述短片创意", "必填字段保持克制，降低 AI 视频新手的启动成本。", `<button class="ghost" onclick="setView('dashboard')">返回</button>`)}
      <div class="form">
        ${panel("基础信息", `
          ${field("一句话创意", project.input.brief, true)}
          <div class="form-grid">
            ${field("题材", project.input.genre)}
            ${field("风格", project.input.style)}
            ${field("时长", project.input.duration)}
            ${field("平台", project.input.platform)}
          </div>
        `)}
        ${panel("高级设置", `
          ${field("目标受众", project.input.audience)}
          ${field("主角设定", project.input.protagonist)}
          ${field("情绪基调", project.input.mood)}
          <button class="primary" style="width:100%;margin-top:14px" onclick="setView('script')">生成故事方案</button>
        `)}
      </div>
    </div>`;
}

function renderScript() {
  content.innerHTML = `
    <div class="page">
      ${header("脚本生成", `脚本方案：${project.title}`, "先确认故事方向和角色一致性，再进入镜头级编辑。", `<button class="ghost">重新生成故事</button>`)}
      ${panel("标题与一句话卖点", `<h3>${project.title}</h3><p class="muted">${project.logline}</p>`)}
      <div class="grid-2">
        ${panel("故事梗概", `<p class="muted">${project.synopsis}</p>`)}
        ${panel("三幕结构", `<ol>${project.acts.map((act) => `<li>${act}</li>`).join("")}</ol>`)}
      </div>
      <div class="grid-2">
        ${panel("角色卡", `<p><strong>林夏</strong><br><span class="muted">20 岁，黑色短发，灰色连帽衫，长期失眠。</span></p><p><strong>未来的林夏</strong><br><span class="muted">30 岁，深色风衣，手持透明雨伞。</span></p>`)}
        ${panel("分场景脚本预览", project.scenes.map((scene) => `<button class="list-item"><span><strong>${scene.title}</strong><br><span class="meta">${scene.purpose}</span></span></button>`).join(""))}
      </div>
      <div style="text-align:right"><button class="primary" onclick="setView('storyboard')">生成镜头分镜 →</button></div>
    </div>`;
}

function renderStoryboard() {
  const shots = project.shots.filter((shot) => shot.sceneId === selectedScene);
  const shot = project.shots.find((item) => item.id === selectedShot) || shots[0] || project.shots[0];
  content.innerHTML = `
    <div class="storyboard">
      <aside class="rail">
        <div class="row"><strong>场景列表</strong><span class="meta">33s</span></div>
        ${project.scenes.map((scene) => `<button class="scene ${scene.id === selectedScene ? "active" : ""}" onclick="selectScene('${scene.id}')"><strong>${scene.title}</strong><br><span class="meta">${scene.purpose}</span></button>`).join("")}
        <button class="ghost" style="width:100%;margin-top:12px">重生成场景</button>
      </aside>
      <section class="shots">
        ${header("分镜编辑", "镜头分镜表", "每个镜头都能编辑、复制提示词或局部重生成。", `<button class="primary" onclick="setView('export')">导出</button>`)}
        ${shots.map((item) => `<button class="shot ${item.id === shot.id ? "active" : ""}" onclick="selectShot('${item.id}')"><div class="row"><strong>${item.title}</strong><span>${item.duration} · ${item.meta}</span></div><p>${item.visual}</p></button>`).join("")}
      </section>
      <aside class="detail">
        <div class="row"><div><span class="meta">当前镜头</span><h2>${shot.title}</h2></div><button class="small" onclick="regenerate()">局部重生成</button></div>
        ${field("时长", shot.duration)}
        ${field("景别 / 运镜", shot.meta)}
        ${textarea("画面描述", shot.visual)}
        ${textarea("旁白 / 字幕", shot.voice)}
        ${textarea("AI 视频提示词", shot.prompt)}
        <div class="actions"><button class="ghost">保存修改</button><button class="primary" onclick="copyPrompt()">复制提示词</button></div>
      </aside>
    </div>`;
}

function renderExport() {
  const md = buildMarkdown();
  content.innerHTML = `
    <div class="page">
      ${header("导出", `导出项目：${project.title}`, "把分镜方案变成可交付、可复制、可投喂下游视频工具的格式。", `<button class="ghost" onclick="setView('storyboard')">返回分镜</button>`)}
      <div class="export-grid">
        ${panel("导出设置", `<div class="actions"><button class="primary" onclick="downloadMarkdown()">Markdown</button><button class="ghost" onclick="downloadJson()">JSON</button><button class="ghost" disabled>PDF P1</button></div><p class="muted" style="margin-top:18px">包含故事方案、角色卡、分镜表和视频提示词。</p>`)}
        ${panel("导出预览", `<pre class="preview">${escapeHtml(md)}</pre>`)}
      </div>
      ${panel("下游工具适配", `<div class="tool-row"><button class="tool">即梦提示词包</button><button class="tool">可灵提示词包</button><button class="tool">Runway 提示词包</button><button class="tool">通用版</button></div>`)}
    </div>`;
}

function renderHistory() {
  content.innerHTML = `
    <div class="page">
      ${header("历史项目", "管理创作方案和版本", "第一版用 mock 数据呈现项目管理能力，后续接数据库保存。")}
      <div class="history-row"><div><strong>${project.title}</strong><br><span class="meta">已生成分镜 · 更新于 2026-06-30 · 3 个版本</span></div><div class="actions"><button class="primary" onclick="setView('storyboard')">打开</button><button class="ghost">复制</button><button class="ghost">版本历史</button></div></div>
      <div class="history-row"><div><strong>AI 会议纪要广告</strong><br><span class="meta">草稿 · 更新于 2026-06-30 · 1 个版本</span></div><div class="actions"><button class="primary" onclick="setView('new')">打开</button><button class="ghost">复制</button><button class="ghost">版本历史</button></div></div>
      <div class="history-row"><div><strong>国风茶饮 30 秒广告</strong><br><span class="meta">已导出 · 更新于 2026-06-29 · 2 个版本</span></div><div class="actions"><button class="primary" onclick="setView('export')">打开</button><button class="ghost">复制</button><button class="ghost">版本历史</button></div></div>
    </div>`;
}

function field(label, value, area = false) {
  return `<label class="field"><span>${label}</span>${area ? `<textarea>${value}</textarea>` : `<input value="${escapeHtml(value)}" />`}</label>`;
}

function textarea(label, value) {
  return `<label class="field"><span>${label}</span><textarea>${value}</textarea></label>`;
}

function selectScene(id) {
  selectedScene = id;
  selectedShot = project.shots.find((shot) => shot.sceneId === id)?.id || selectedShot;
  renderStoryboard();
}

function selectShot(id) {
  selectedShot = id;
  renderStoryboard();
}

function regenerate() {
  const shot = project.shots.find((item) => item.id === selectedShot);
  if (shot) {
    shot.visual += " 画面节奏更紧，情绪转折更明确。";
    shot.prompt += ", stronger emotional turning point";
  }
  renderStoryboard();
}

async function copyPrompt() {
  const shot = project.shots.find((item) => item.id === selectedShot);
  await navigator.clipboard.writeText(shot?.prompt || "");
  alert("已复制当前镜头提示词");
}

function buildMarkdown() {
  const rows = project.shots.map((shot) => `| ${shot.title} | ${shot.duration} | ${shot.meta} | ${shot.visual} | ${shot.prompt} |`).join("\\n");
  return `# ${project.title}

## 一句话卖点
${project.logline}

## 故事梗概
${project.synopsis}

## 分镜表
| 镜头 | 时长 | 景别/运镜 | 画面 | 视频提示词 |
|---|---:|---|---|---|
${rows}
`;
}

function downloadMarkdown() {
  download(`${project.title}.md`, buildMarkdown(), "text/markdown;charset=utf-8");
}

function downloadJson() {
  download(`${project.title}.json`, JSON.stringify(project, null, 2), "application/json;charset=utf-8");
}

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

render();
