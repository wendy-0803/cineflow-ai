"use client";

import {
  Archive,
  ArrowRight,
  Bot,
  Check,
  Clipboard,
  Copy,
  Download,
  FileJson,
  FileText,
  History,
  LayoutDashboard,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  Sparkles,
  Wand2
} from "lucide-react";
import type { ReactNode } from "react";
import { startTransition, useMemo, useState } from "react";
import { defaultInput, historyProjects, mockProject, regenerateShot } from "./mock-data";
import type { GeneratedStory, GeneratedStoryboard, Project, ProjectInput, Shot, ViewKey } from "./types";

const views: { key: ViewKey; label: string }[] = [
  { key: "dashboard", label: "工作台" },
  { key: "new", label: "新建项目" },
  { key: "script", label: "脚本生成" },
  { key: "storyboard", label: "分镜编辑" },
  { key: "export", label: "导出" },
  { key: "history", label: "历史项目" }
];

const styleOptions = ["电影感", "商业广告", "治愈短片", "剧情短片", "知识科普"];
const toolOptions = ["即梦", "可灵", "Runway", "纳米大片"];

export default function Home() {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [input, setInput] = useState<ProjectInput>(defaultInput);
  const [project, setProject] = useState<Project>(mockProject);
  const [selectedSceneId, setSelectedSceneId] = useState(project.scenes[0]?.id ?? "");
  const [selectedShotId, setSelectedShotId] = useState(project.shots[0]?.id ?? "");
  const [copyState, setCopyState] = useState("复制提示词");
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [isGeneratingStoryboard, setIsGeneratingStoryboard] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [storyboardError, setStoryboardError] = useState<string | null>(null);

  const selectedShot = useMemo(
    () => project.shots.find((shot) => shot.id === selectedShotId) ?? project.shots[0],
    [project.shots, selectedShotId]
  );
  const sceneShots = project.shots.filter((shot) => shot.sceneId === selectedSceneId);
  const totalDuration = project.shots.reduce((sum, shot) => sum + shot.durationSec, 0);
  const currentProgress = project.status === "draft" ? 24 : project.status === "script" ? 52 : project.status === "storyboard" ? 82 : 100;

  async function startProject() {
    setGenerationError(null);
    setStoryboardError(null);
    setIsGeneratingStory(true);
    setView("script");

    try {
      const response = await fetch("/api/generate/story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input })
      });
      const data = (await response.json()) as { story?: GeneratedStory; error?: string; details?: string };
      if (!response.ok || !data.story) throw new Error(data.error || data.details || "故事生成失败，请稍后重试。");

      const nextProject = buildProjectFromGeneratedStory(input, data.story);
      startTransition(() => {
        setProject(nextProject);
        setSelectedSceneId(nextProject.scenes[0]?.id ?? "");
        setSelectedShotId(nextProject.shots[0]?.id ?? "");
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "故事生成失败，请稍后重试。";
      setGenerationError(message);
      setProject({
        ...mockProject,
        input,
        title: input.brief.includes("会议") ? "AI 会议纪要广告" : mockProject.title,
        status: "script",
        updatedAt: new Date().toISOString().slice(0, 10)
      });
    } finally {
      setIsGeneratingStory(false);
    }
  }

  async function refineStoryboard() {
    setStoryboardError(null);
    setIsGeneratingStoryboard(true);
    setView("storyboard");

    try {
      const response = await fetch("/api/generate/storyboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ project })
      });
      const data = (await response.json()) as { storyboard?: GeneratedStoryboard; error?: string; details?: string };
      if (!response.ok || !data.storyboard) throw new Error(data.error || data.details || "分镜生成失败，请稍后重试。");

      const nextProject = buildProjectFromGeneratedStoryboard(project, data.storyboard);
      startTransition(() => {
        setProject(nextProject);
        setSelectedSceneId(nextProject.scenes[0]?.id ?? "");
        setSelectedShotId(nextProject.shots[0]?.id ?? "");
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "分镜生成失败，请稍后重试。";
      setStoryboardError(message);
      setProject({
        ...project,
        status: "storyboard",
        versions: project.versions + 1,
        updatedAt: new Date().toISOString().slice(0, 10),
        shots: project.shots.map((shot, index) => ({
          ...regenerateShot(shot),
          targetTool: shot.targetTool ?? (index % 2 === 0 ? "kling" : "jimeng"),
          promptLayers: shot.promptLayers ?? makePromptLayers(shot),
          continuityNote: shot.continuityNote ?? "保持主角表情、服装和时间线一致。"
        }))
      });
    } finally {
      setIsGeneratingStoryboard(false);
    }
  }

  function updateShot(id: string, patch: Partial<Shot>) {
    setProject((current) => ({
      ...current,
      updatedAt: new Date().toISOString().slice(0, 10),
      shots: current.shots.map((shot) => (shot.id === id ? { ...shot, ...patch } : shot))
    }));
  }

  function handleRegenerateShot(id: string) {
    setProject((current) => ({
      ...current,
      versions: current.versions + 1,
      updatedAt: new Date().toISOString().slice(0, 10),
      shots: current.shots.map((shot) =>
        shot.id === id
          ? {
              ...regenerateShot(shot),
              promptLayers: makePromptLayers(shot),
              continuityNote: "与前后镜头保持时间、服装、情绪和空间关系一致。"
            }
          : shot
      )
    }));
  }

  async function copyPrompt(prompt: string) {
    await navigator.clipboard.writeText(prompt);
    setCopyState("已复制");
    window.setTimeout(() => setCopyState("复制提示词"), 1200);
  }

  function exportMarkdown() {
    const content = buildMarkdown(project);
    downloadFile(`${project.title}.md`, content, "text/markdown;charset=utf-8");
  }

  function exportJson() {
    downloadFile(`${project.title}.json`, JSON.stringify(project, null, 2), "application/json;charset=utf-8");
  }

  function downloadFile(filename: string, content: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="shell">
      <TopNav current={view} onNavigate={setView} />
      <div className="workspace">
        <aside className="sidebar">
          <div className="product-mark">
            <span className="mark-icon">
              <Sparkles size={18} />
            </span>
            <div>
              <strong>CineFlow AI</strong>
              <small>短片脚本与分镜创作工作台</small>
            </div>
          </div>

          <div className="project-card">
            <span className="eyebrow">当前项目</span>
            <strong>{project.title}</strong>
            <p>{project.logline}</p>
            <div className="project-chip-row">
              <span>{project.status === "storyboard" ? "分镜已生成" : project.status === "script" ? "脚本已生成" : "草稿"}</span>
              <span>{project.versions} 版</span>
            </div>
          </div>

          <nav className="side-nav">
            {views.map((item) => (
              <button key={item.key} className={view === item.key ? "active" : ""} onClick={() => setView(item.key)}>
                {navIcon(item.key)}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="side-note">
            <strong>创作流程</strong>
            <span>创意输入 → 故事确认 → 二阶段分镜 → 局部修改 → 导出投喂</span>
          </div>
        </aside>

        <section className="content">
          <div className="workspace-hero">
            <div>
              <span className="eyebrow">视频创作工作台</span>
              <h1>把一句创意拆成可执行的脚本和分镜</h1>
              <p>
                这个版本更强调面试展示：左侧是项目状态，中间是创作主流程，右侧是编辑和导出动作。分镜页已经改成二阶段生成，先做故事，再细化镜头。
              </p>
            </div>
            <div className="hero-metrics">
              <Metric label="故事完整度" value={`${currentProgress}%`} />
              <Metric label="镜头数" value={`${project.shots.length} 镜`} />
              <Metric label="总时长" value={`${totalDuration} 秒`} />
            </div>
          </div>

          {view === "dashboard" && <Dashboard project={project} onNavigate={setView} />}
          {view === "new" && (
            <NewProject input={input} setInput={setInput} onStart={startProject} onBack={() => setView("dashboard")} />
          )}
          {view === "script" && (
            <ScriptPage
              project={project}
              input={input}
              isGenerating={isGeneratingStory}
              generationError={generationError}
              onRetry={startProject}
              onNext={refineStoryboard}
            />
          )}
          {view === "storyboard" && (
            <StoryboardPage
              project={project}
              selectedSceneId={selectedSceneId}
              selectedShot={selectedShot ?? project.shots[0]}
              sceneShots={sceneShots}
              totalDuration={totalDuration}
              copyState={copyState}
              isGenerating={isGeneratingStoryboard}
              storyboardError={storyboardError}
              onSelectScene={(sceneId) => {
                setSelectedSceneId(sceneId);
                setSelectedShotId(project.shots.find((shot) => shot.sceneId === sceneId)?.id ?? project.shots[0]?.id ?? "");
              }}
              onSelectShot={setSelectedShotId}
              onUpdateShot={updateShot}
              onRegenerateShot={handleRegenerateShot}
              onCopyPrompt={copyPrompt}
              onRefine={refineStoryboard}
              onExport={() => setView("export")}
            />
          )}
          {view === "export" && (
            <ExportPage
              project={project}
              onBack={() => setView("storyboard")}
              onMarkdown={exportMarkdown}
              onJson={exportJson}
            />
          )}
          {view === "history" && (
            <HistoryPage
              currentProject={project}
              onOpen={(nextProject) => {
                setProject(nextProject);
                setSelectedSceneId(nextProject.scenes[0]?.id ?? "");
                setSelectedShotId(nextProject.shots[0]?.id ?? "");
                setView(nextProject.status === "draft" ? "new" : "storyboard");
              }}
            />
          )}
        </section>
      </div>
    </main>
  );
}

function TopNav({ current, onNavigate }: { current: ViewKey; onNavigate: (view: ViewKey) => void }) {
  return (
    <header className="topbar">
      <button className="brand-button" onClick={() => onNavigate("dashboard")}>
        <Sparkles size={18} />
        <span>CineFlow AI</span>
      </button>
      <div className="top-actions">
        <button className={current === "new" ? "text-button active" : "text-button"} onClick={() => onNavigate("new")}>
          <Plus size={16} />
          新建项目
        </button>
        <button
          className={current === "history" ? "text-button active" : "text-button"}
          onClick={() => onNavigate("history")}
        >
          <History size={16} />
          历史项目
        </button>
        <button className="icon-button" aria-label="设置">
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}

function Dashboard({ project, onNavigate }: { project: Project; onNavigate: (view: ViewKey) => void }) {
  return (
    <div className="page-stack">
      <div className="two-column">
        <Panel
          title="创作概览"
          action={
            <button className="ghost-button small" onClick={() => onNavigate("script")}>
              继续生成
              <ArrowRight size={15} />
            </button>
          }
        >
          <div className="metric-row">
            <Metric label="当前项目" value={project.title} />
            <Metric label="项目状态" value={statusLabel(project.status)} />
            <Metric label="镜头总数" value={`${project.shots.length}`} />
          </div>
          <div className="timeline-banner">
            <div>
              <strong>工作流</strong>
              <p>输入创意，先得到故事包；确认后再进入镜头级细化和导出。</p>
            </div>
            <div className="timeline-dots">
              <span className="done" />
              <span className="done" />
              <span className="done" />
              <span />
              <span />
            </div>
          </div>
        </Panel>

        <Panel title="快捷模板">
          <div className="template-grid">
            {styleOptions.map((item) => (
              <button key={item} className="template-card" onClick={() => onNavigate("new")}>
                <Wand2 size={18} />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </Panel>
      </div>

      <div className="two-column">
        <Panel title="最近项目">
          <ProjectListItem title={project.title} meta="已生成故事 · 进入分镜编辑 · 已支持导出" onClick={() => onNavigate("storyboard")} />
          <ProjectListItem title="AI 会议纪要广告" meta="草稿 · 待生成故事" onClick={() => onNavigate("new")} />
          <ProjectListItem title="国风茶饮 30 秒广告" meta="已导出 · 2 个版本" onClick={() => onNavigate("history")} />
        </Panel>

        <Panel title="导出适配">
          <div className="export-options compact">
            {toolOptions.map((tool) => (
              <button className="tool-pack" key={tool}>
                <Clipboard size={16} />
                {tool}
              </button>
            ))}
          </div>
          <div className="check-list">
            {["故事方案", "角色卡", "分镜表", "提示词包"].map((item) => (
              <span key={item}>
                <Check size={15} />
                {item}
              </span>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function NewProject({
  input,
  setInput,
  onStart,
  onBack
}: {
  input: ProjectInput;
  setInput: (input: ProjectInput) => void;
  onStart: () => Promise<void>;
  onBack: () => void;
}) {
  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="新建项目"
        title="输入最少的参数，开始一条完整创作链"
        description="把创作者真正会填的内容收敛成一个轻量表单，避免一上来就被复杂字段劝退。"
        action={
          <button className="ghost-button" onClick={onBack}>
            <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
            返回
          </button>
        }
      />

      <div className="form-layout">
        <Panel title="基础信息">
          <label className="field wide">
            <span>一句话创意</span>
            <textarea value={input.brief} onChange={(event) => setInput({ ...input, brief: event.target.value })} />
          </label>
          <div className="form-grid">
            <Field label="题材" value={input.genre} onChange={(genre) => setInput({ ...input, genre })} />
            <Field label="风格" value={input.style} onChange={(style) => setInput({ ...input, style })} />
            <Field label="时长" value={input.duration} onChange={(duration) => setInput({ ...input, duration })} />
            <Field label="平台" value={input.platform} onChange={(platform) => setInput({ ...input, platform })} />
          </div>
        </Panel>

        <Panel title="高级设置">
          <Field label="目标受众" value={input.audience} onChange={(audience) => setInput({ ...input, audience })} />
          <Field label="主角设定" value={input.protagonist} onChange={(protagonist) => setInput({ ...input, protagonist })} />
          <Field label="情绪走向" value={input.mood} onChange={(mood) => setInput({ ...input, mood })} />
          <Field label="生成语言" value={input.language} onChange={(language) => setInput({ ...input, language })} />
          <button className="primary-button full" onClick={onStart}>
            <Sparkles size={17} />
            生成故事包
          </button>
        </Panel>
      </div>
    </div>
  );
}

function ScriptPage({
  project,
  input,
  isGenerating,
  generationError,
  onRetry,
  onNext
}: {
  project: Project;
  input: ProjectInput;
  isGenerating: boolean;
  generationError: string | null;
  onRetry: () => Promise<void>;
  onNext: () => Promise<void>;
}) {
  const canContinue = project.shots.length > 0 && !isGenerating;

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="脚本生成"
        title={`故事包 · ${project.title}`}
        description="这一步先确认故事方向、角色卡和场景结构，再把结果送到分镜阶段。"
        action={
          <button className="ghost-button" onClick={onRetry} disabled={isGenerating}>
            {isGenerating ? <LoaderCircle size={16} className="spin" /> : <RefreshCw size={16} />}
            {isGenerating ? "生成中" : "重新生成"}
          </button>
        }
      />

      {isGenerating && (
        <section className="hero-status generating">
          <div className="status-icon">
            <Bot size={18} />
          </div>
          <div>
            <strong>正在生成故事包</strong>
            <p>我们会先产出故事结构、角色卡和分场景骨架，确认之后再进入镜头细化。</p>
          </div>
        </section>
      )}

      {generationError && !isGenerating && (
        <section className="hero-status error">
          <div className="status-icon">
            <RefreshCw size={18} />
          </div>
          <div>
            <strong>真实生成暂时失败，当前显示的是示例内容</strong>
            <p>{generationError}</p>
          </div>
          <button className="ghost-button small" onClick={onRetry}>
            重试
          </button>
        </section>
      )}

      <div className="two-column">
        <Panel title="故事梗概">
          <div className="story-card">
            <h3>{project.title}</h3>
            <p>{project.logline}</p>
          </div>
        </Panel>

        <Panel title="输入参数">
          <div className="mini-input-grid">
            <KeyValue label="题材" value={input.genre} />
            <KeyValue label="风格" value={input.style} />
            <KeyValue label="时长" value={input.duration} />
            <KeyValue label="平台" value={input.platform} />
          </div>
        </Panel>
      </div>

      <div className="two-column">
        <Panel title="三幕结构">
          <ol className="act-list">
            {project.acts.map((act) => (
              <li key={act}>{act}</li>
            ))}
          </ol>
        </Panel>
        <Panel title="角色卡">
          {project.characters.map((character) => (
            <div className="character-row" key={character.name}>
              <strong>{character.name}</strong>
              <span>{character.role}</span>
              <p>{character.appearance}</p>
              <p>{character.motivation}</p>
            </div>
          ))}
        </Panel>
      </div>

      <Panel title="场景预览">
        <div className="scene-preview-grid">
          {project.scenes.map((scene) => (
            <article key={scene.id} className="scene-preview-card">
              <strong>{scene.title}</strong>
              <span>{scene.purpose}</span>
              <p>{scene.summary}</p>
            </article>
          ))}
        </div>
      </Panel>

      <div className="sticky-actions">
        <button className="primary-button" onClick={onNext} disabled={!canContinue}>
          进入分镜二阶段生成
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
}

function StoryboardPage({
  project,
  selectedSceneId,
  selectedShot,
  sceneShots,
  totalDuration,
  copyState,
  isGenerating,
  storyboardError,
  onSelectScene,
  onSelectShot,
  onUpdateShot,
  onRegenerateShot,
  onCopyPrompt,
  onRefine,
  onExport
}: {
  project: Project;
  selectedSceneId: string;
  selectedShot: Shot;
  sceneShots: Shot[];
  totalDuration: number;
  copyState: string;
  isGenerating: boolean;
  storyboardError: string | null;
  onSelectScene: (sceneId: string) => void;
  onSelectShot: (shotId: string) => void;
  onUpdateShot: (shotId: string, patch: Partial<Shot>) => void;
  onRegenerateShot: (shotId: string) => void;
  onCopyPrompt: (prompt: string) => void;
  onRefine: () => Promise<void>;
  onExport: () => void;
}) {
  return (
    <div className="storyboard-layout">
      <aside className="scene-rail">
        <div className="rail-header">
          <strong>场景列表</strong>
          <span>{totalDuration}s</span>
        </div>
        {project.scenes.map((scene) => (
          <button
            key={scene.id}
            className={selectedSceneId === scene.id ? "scene-item active" : "scene-item"}
            onClick={() => onSelectScene(scene.id)}
          >
            <strong>{scene.title}</strong>
            <span>{scene.purpose}</span>
          </button>
        ))}
        <button className="ghost-button full" onClick={onRefine} disabled={isGenerating}>
          {isGenerating ? <LoaderCircle size={16} className="spin" /> : <RefreshCw size={16} />}
          {isGenerating ? "细化中" : "二阶段重生成"}
        </button>
      </aside>

      <section className="shot-list">
        <PageHeader
          eyebrow="分镜编辑"
          title="镜头分镜表"
          description="镜头级字段已经展开到镜头运动、机位、光线、构图、连续性和提示词层次。"
          action={
            <button className="primary-button" onClick={onExport}>
              <Download size={17} />
              导出
            </button>
          }
        />

        {storyboardError && (
          <section className="hero-status error">
            <div className="status-icon">
              <RefreshCw size={18} />
            </div>
            <div>
              <strong>分镜二阶段真实生成失败，当前显示的是强化示例</strong>
              <p>{storyboardError}</p>
            </div>
          </section>
        )}

        <div className="shot-grid">
          {sceneShots.map((shot) => (
            <button
              key={shot.id}
              className={selectedShot.id === shot.id ? "shot-card active" : "shot-card"}
              onClick={() => onSelectShot(shot.id)}
            >
              <div>
                <strong>Shot {String(shot.index).padStart(2, "0")}</strong>
                <span>
                  {shot.durationSec}s · {shot.shotSize} · {shot.movement}
                </span>
              </div>
              <p>{shot.visual}</p>
              <div className="shot-tags">
                <span>{shot.targetTool ?? "generic"}</span>
                <span>{shot.promptLayers?.length ? `${shot.promptLayers.length} 层提示` : "单层提示"}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <aside className="detail-panel">
        <div className="detail-title">
          <div>
            <span>当前镜头</span>
            <strong>Shot {String(selectedShot.index).padStart(2, "0")}</strong>
          </div>
          <button className="icon-button" onClick={() => onRegenerateShot(selectedShot.id)} aria-label="局部重生成">
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="compact-grid">
          <Field
            label="时长"
            value={`${selectedShot.durationSec}`}
            onChange={(value) => onUpdateShot(selectedShot.id, { durationSec: Number(value) || 1 })}
          />
          <Field label="景别" value={selectedShot.shotSize} onChange={(shotSize) => onUpdateShot(selectedShot.id, { shotSize })} />
          <Field label="运镜" value={selectedShot.movement} onChange={(movement) => onUpdateShot(selectedShot.id, { movement })} />
          <Field
            label="机位"
            value={selectedShot.cameraAngle ?? ""}
            onChange={(cameraAngle) => onUpdateShot(selectedShot.id, { cameraAngle })}
          />
        </div>

        <TextArea label="画面描述" value={selectedShot.visual} onChange={(visual) => onUpdateShot(selectedShot.id, { visual })} />
        <TextArea label="动作 / 台词" value={selectedShot.action} onChange={(action) => onUpdateShot(selectedShot.id, { action })} />
        <TextArea label="旁白 / 字幕" value={selectedShot.voiceover} onChange={(voiceover) => onUpdateShot(selectedShot.id, { voiceover, subtitle: voiceover })} />
        <TextArea
          label="AI 视频提示词"
          value={selectedShot.prompt}
          onChange={(prompt) => onUpdateShot(selectedShot.id, { prompt })}
          rows={5}
        />
        <TextArea
          label="负向提示词"
          value={selectedShot.negativePrompt}
          onChange={(negativePrompt) => onUpdateShot(selectedShot.id, { negativePrompt })}
          rows={3}
        />

        <div className="detail-card">
          <strong>提示词层次</strong>
          <div className="layer-list">
            {(selectedShot.promptLayers?.length ? selectedShot.promptLayers : makePromptLayers(selectedShot)).map((layer) => (
              <span key={layer}>{layer}</span>
            ))}
          </div>
          <p>{selectedShot.continuityNote || "保持主角服装、时间线和情绪一致。"}</p>
        </div>

        <div className="detail-actions">
          <button className="ghost-button" onClick={() => onCopyPrompt(selectedShot.prompt)}>
            <Copy size={16} />
            {copyState}
          </button>
          <button className="primary-button" onClick={() => onRefine()}>
            <Sparkles size={16} />
            重新细化
          </button>
        </div>
      </aside>
    </div>
  );
}

function ExportPage({
  project,
  onBack,
  onMarkdown,
  onJson
}: {
  project: Project;
  onBack: () => void;
  onMarkdown: () => void;
  onJson: () => void;
}) {
  const markdown = buildMarkdown(project);

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="导出"
        title={`导出项目 · ${project.title}`}
        description="把分镜方案整理成 Markdown、JSON 和下游工具可复用的提示词包。"
        action={
          <button className="ghost-button" onClick={onBack}>
            <ArrowRight size={16} style={{ transform: "rotate(180deg)" }} />
            返回分镜
          </button>
        }
      />

      <div className="export-layout">
        <Panel title="导出选项">
          <div className="export-options">
            <button onClick={onMarkdown}>
              <FileText size={18} />
              Markdown
            </button>
            <button onClick={onJson}>
              <FileJson size={18} />
              JSON
            </button>
            <button disabled>
              <Archive size={18} />
              PDF
            </button>
          </div>
          <div className="check-list">
            {["故事方案", "角色卡", "分镜表", "提示词包"].map((item) => (
              <span key={item}>
                <Check size={15} />
                {item}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="导出预览">
          <pre className="preview">{markdown}</pre>
        </Panel>
      </div>

      <Panel title="下游工具适配">
        <div className="tool-pack-row">
          {toolOptions.map((tool) => (
            <button className="tool-pack" key={tool}>
              <Clipboard size={16} />
              {tool} 提示词包
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function HistoryPage({
  currentProject,
  onOpen
}: {
  currentProject: Project;
  onOpen: (project: Project) => void;
}) {
  const projects = [currentProject, ...historyProjects.filter((item) => item.id !== currentProject.id)];

  return (
    <div className="page-stack">
      <PageHeader
        eyebrow="历史项目"
        title="管理不同创作版本"
        description="保留项目快照、版本变化和导出状态，方便面试时讲完整个迭代过程。"
      />

      <div className="filter-row">
        <label className="search-box">
          <Search size={16} />
          <input placeholder="搜索项目" />
        </label>
        <button className="ghost-button">状态：全部</button>
        <button className="ghost-button">排序：最近更新</button>
      </div>

      <div className="history-list">
        {projects.map((item) => (
          <article className="history-row" key={item.id}>
            <div>
              <strong>{item.title}</strong>
              <span>
                {statusLabel(item.status)} · 更新于 {item.updatedAt} · {item.versions} 个版本
              </span>
            </div>
            <div className="row-actions">
              <button className="primary-button small" onClick={() => onOpen(item)}>
                打开
              </button>
              <button className="ghost-button small">复制</button>
              <button className="ghost-button small">版本历史</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function PageHeader({
  eyebrow,
  title,
  description,
  action
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function Panel({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="key-value">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({
  label,
  value,
  rows = 4,
  onChange
}: {
  label: string;
  value: string;
  rows?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function ProjectListItem({ title, meta, onClick }: { title: string; meta: string; onClick?: () => void }) {
  return (
    <button className="project-list-item" onClick={onClick}>
      <div>
        <strong>{title}</strong>
        <span>{meta}</span>
      </div>
      <ArrowRight size={16} />
    </button>
  );
}

function navIcon(key: ViewKey) {
  const size = 16;
  if (key === "dashboard") return <LayoutDashboard size={size} />;
  if (key === "new") return <Plus size={size} />;
  if (key === "script") return <FileText size={size} />;
  if (key === "storyboard") return <Clipboard size={size} />;
  if (key === "export") return <Download size={size} />;
  return <History size={size} />;
}

function statusLabel(status: Project["status"]) {
  if (status === "draft") return "草稿";
  if (status === "script") return "已生成故事";
  if (status === "storyboard") return "已生成分镜";
  return "已导出";
}

function buildProjectFromGeneratedStory(input: ProjectInput, story: GeneratedStory): Project {
  const baseShots = story.shots.map((shot, index) => ({
    ...shot,
    targetTool: index % 2 === 0 ? "kling" : "jimeng",
    promptLayers: makePromptLayers(shot),
    continuityNote: "保持人物服装、灯光和情绪连续。"
  }));

  return {
    id: `project-${Date.now()}`,
    title: story.title,
    status: "script",
    updatedAt: new Date().toISOString().slice(0, 10),
    versions: 1,
    input,
    logline: story.logline,
    synopsis: story.synopsis,
    acts: story.acts,
    motifs: story.motifs,
    characters: story.characters,
    scenes: story.scenes,
    shots: baseShots
  };
}

function buildProjectFromGeneratedStoryboard(project: Project, storyboard: GeneratedStoryboard): Project {
  return {
    ...project,
    title: storyboard.title || project.title,
    status: "storyboard",
    versions: project.versions + 1,
    updatedAt: new Date().toISOString().slice(0, 10),
    shots: storyboard.shots.map((shot) => ({
      ...shot,
      targetTool: shot.targetTool ?? "generic",
      promptLayers: shot.promptLayers ?? makePromptLayers(shot),
      continuityNote: shot.continuityNote ?? "保持主角、服装、时间和空间关系一致。"
    }))
  };
}

function makePromptLayers(shot: Shot) {
  return [
    `主体: ${shot.visual.slice(0, 28)}`,
    `镜头: ${shot.shotSize} / ${shot.movement}`,
    `光线: ${shot.lighting ?? "自然光"}`,
    `构图: ${shot.composition ?? "中景构图"}`,
    `连续性: ${shot.continuityNote ?? "保持角色与时间线一致"}`
  ];
}

function buildMarkdown(project: Project) {
  return `# ${project.title}

## 一句话卖点
${project.logline}

## 故事梗概
${project.synopsis}

## 三幕结构
${project.acts.map((act) => `- ${act}`).join("\n")}

## 分镜表
${project.shots
  .map(
    (shot) => `### Shot ${String(shot.index).padStart(2, "0")}
- 场景: ${shot.sceneId}
- 时长: ${shot.durationSec}s
- 景别: ${shot.shotSize}
- 运镜: ${shot.movement}
- 画面: ${shot.visual}
- 动作: ${shot.action}
- 旁白: ${shot.voiceover}
- 字幕: ${shot.subtitle}
- 音效: ${shot.sound}
- 提示词: ${shot.prompt}
- 负向提示词: ${shot.negativePrompt}`
  )
  .join("\n\n")}
`;
}
