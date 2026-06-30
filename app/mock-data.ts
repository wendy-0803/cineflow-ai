import type { Project, ProjectInput, Shot } from "./types";

export const defaultInput: ProjectInput = {
  brief: "一个失眠的女孩在雨夜遇见未来的自己",
  genre: "剧情",
  style: "电影感 / 治愈 / 轻科幻",
  duration: "60 秒",
  platform: "抖音 / 小红书",
  audience: "18 到 30 岁年轻女性",
  protagonist: "20 岁，长期失眠，情绪敏感",
  mood: "孤独 → 紧张 → 治愈",
  language: "中文"
};

export const mockProject: Project = {
  id: "project-rain-letter",
  title: "雨夜回信",
  status: "storyboard",
  updatedAt: "2026-06-30",
  versions: 3,
  input: defaultInput,
  logline: "一个失眠女孩在未来自己的提醒中，学会与过去和解。",
  synopsis:
    "雨夜里，长期失眠的林夏收到一封没有署名的信。她循着信上的地址来到空荡的公交站，遇见了十年后的自己。未来的林夏温和却回避关键问题，直到清晨第一班车到来，林夏终于意识到答案不是改变未来，而是停止惩罚现在的自己。",
  acts: [
    "Act 1：雨夜失眠。林夏在房间里反复醒来，收到一封来自未来的信。",
    "Act 2：公交站相遇。她见到未来的自己，却发现对方隐瞒了最重要的真相。",
    "Act 3：清晨告别。林夏选择回到当下，给现在的自己一个新的开始。"
  ],
  motifs: ["雨水", "公交站灯光", "未寄出的信", "清晨第一班车"],
  characters: [
    {
      name: "林夏",
      role: "主角",
      appearance: "20 岁，黑色短发，灰色连帽衫，眼下有轻微黑眼圈。",
      motivation: "想知道自己为什么一直无法睡着。",
      consistencyPrompt:
        "20-year-old Chinese woman, short black hair, gray hoodie, tired eyes, natural cinematic look"
    },
    {
      name: "未来的林夏",
      role: "关键引导者",
      appearance: "30 岁，深色风衣，神情温和，手里拿着一把透明雨伞。",
      motivation: "提醒年轻的自己不要被过去困住。",
      consistencyPrompt:
        "30-year-old Chinese woman, dark trench coat, transparent umbrella, calm expression, cinematic realism"
    }
  ],
  scenes: [
    {
      id: "scene-1",
      title: "雨夜房间",
      purpose: "交代主角失眠和情绪状态。",
      summary: "林夏在雨声中醒来，看到桌上的神秘信件。"
    },
    {
      id: "scene-2",
      title: "公交站相遇",
      purpose: "制造奇遇和核心冲突。",
      summary: "林夏来到公交站，与未来的自己隔着雨幕对视。"
    },
    {
      id: "scene-3",
      title: "清晨告别",
      purpose: "完成情绪释放和主题表达。",
      summary: "第一班车到来，林夏决定回到当下生活。"
    }
  ],
  shots: [
    {
      id: "shot-1",
      sceneId: "scene-1",
      index: 1,
      durationSec: 5,
      shotSize: "全景",
      movement: "固定镜头",
      visual: "狭小房间里只有台灯亮着，窗外雨水模糊城市霓虹。",
      action: "林夏坐在床边，盯着手机上的凌晨 3:17。",
      voiceover: "我已经很久没有真正睡着了。",
      subtitle: "我已经很久没有真正睡着了。",
      sound: "低频雨声，远处车流声。",
      prompt:
        "night bedroom, young Chinese woman in gray hoodie sitting on bed, rain on window, neon reflections, static wide shot, cinematic realistic lighting",
      negativePrompt: "cartoon, low quality, distorted face, extra fingers"
    },
    {
      id: "shot-2",
      sceneId: "scene-1",
      index: 2,
      durationSec: 6,
      shotSize: "近景",
      movement: "慢推",
      visual: "桌面上一封湿润的白色信件，信封上写着：给今晚的你。",
      action: "林夏伸手拿起信，动作迟疑。",
      voiceover: "直到那封信出现在桌上。",
      subtitle: "直到那封信出现在桌上。",
      sound: "纸张摩擦声，雨声稍强。",
      prompt:
        "close-up of a damp white envelope on desk, handwritten Chinese text, warm desk lamp, slow push in, rainy night atmosphere, cinematic macro shot",
      negativePrompt: "unreadable text, messy typography, overexposed"
    },
    {
      id: "shot-3",
      sceneId: "scene-2",
      index: 3,
      durationSec: 7,
      shotSize: "中景",
      movement: "跟拍",
      visual: "空荡公交站被冷色灯光照亮，雨水在地面形成反光。",
      action: "林夏撑伞走近站牌，看见一个熟悉的背影。",
      voiceover: "信上只有一个地址。",
      subtitle: "信上只有一个地址。",
      sound: "雨伞被雨点击打，远处公交刹车声。",
      prompt:
        "empty bus stop at night, rain reflections on pavement, young woman walking with umbrella, cold cinematic light, tracking shot, realistic film still",
      negativePrompt: "crowded street, bright daylight, fantasy style"
    },
    {
      id: "shot-4",
      sceneId: "scene-2",
      index: 4,
      durationSec: 8,
      shotSize: "特写",
      movement: "慢推",
      visual: "未来的林夏转身，两人的眼睛在雨幕中对上。",
      action: "未来的林夏轻声说：你终于来了。",
      voiceover: "她看起来像我，却比我安静得多。",
      subtitle: "你终于来了。",
      sound: "雨声突然压低，轻微心跳声。",
      prompt:
        "close-up, 30-year-old Chinese woman with transparent umbrella turns around, calm eyes, rain curtain, young woman reflected, slow push, cinematic tension",
      negativePrompt: "horror, exaggerated makeup, unstable face"
    },
    {
      id: "shot-5",
      sceneId: "scene-2",
      index: 5,
      durationSec: 8,
      shotSize: "双人中景",
      movement: "固定镜头",
      visual: "两人坐在公交站长椅两端，中间隔着一封信。",
      action: "林夏追问未来发生了什么，对方沉默。",
      voiceover: "我以为未来会给我答案。",
      subtitle: "我以为未来会给我答案。",
      sound: "雨棚滴水声，环境声留白。",
      prompt:
        "two Chinese women sitting apart on bus stop bench at rainy night, envelope between them, symmetrical composition, static medium shot, moody cinematic lighting",
      negativePrompt: "wrong age, inconsistent clothing, busy background"
    },
    {
      id: "shot-6",
      sceneId: "scene-3",
      index: 6,
      durationSec: 7,
      shotSize: "近景",
      movement: "横移",
      visual: "清晨微光出现，未来的林夏把透明雨伞递给林夏。",
      action: "林夏接过伞，终于露出很浅的笑。",
      voiceover: "可她只是把伞递给我。",
      subtitle: "可她只是把伞递给我。",
      sound: "雨声变小，清晨鸟鸣。",
      prompt:
        "early morning light at bus stop, older woman handing transparent umbrella to younger woman, gentle smile, lateral camera move, soft cinematic realism",
      negativePrompt: "dramatic fantasy, harsh shadows, duplicate people"
    },
    {
      id: "shot-7",
      sceneId: "scene-3",
      index: 7,
      durationSec: 6,
      shotSize: "远景",
      movement: "拉远",
      visual: "第一班公交驶来，未来的林夏在光里逐渐消失。",
      action: "林夏站在原地，看着公交门打开。",
      voiceover: "答案不是未来给的，是我现在决定的。",
      subtitle: "答案不是未来给的，是我现在决定的。",
      sound: "公交进站声，音乐进入温暖和弦。",
      prompt:
        "wide shot, first bus arriving at dawn, rainy bus stop, older woman fading into morning light, young woman holding umbrella, slow pull back, hopeful cinematic tone",
      negativePrompt: "sci-fi portal, heavy VFX, low resolution"
    },
    {
      id: "shot-8",
      sceneId: "scene-3",
      index: 8,
      durationSec: 5,
      shotSize: "特写",
      movement: "固定镜头",
      visual: "林夏回到房间，把信翻到背面，写下：今晚早点睡。",
      action: "她关掉台灯，画面停在清晨窗光。",
      voiceover: "那天早上，我第一次不再害怕天亮。",
      subtitle: "那天早上，我第一次不再害怕天亮。",
      sound: "笔尖划过纸面，台灯开关声。",
      prompt:
        "close-up of hand writing Chinese note on back of letter, morning window light, desk lamp turns off, quiet healing atmosphere, realistic cinematic shot",
      negativePrompt: "messy hands, unreadable writing, dark horror mood"
    }
  ]
};

export const historyProjects: Project[] = [
  mockProject,
  {
    ...mockProject,
    id: "project-meeting-ad",
    title: "AI 会议纪要广告",
    status: "draft",
    updatedAt: "2026-06-30",
    versions: 1,
    input: {
      ...defaultInput,
      brief: "一款 AI 会议纪要工具，让新人不再害怕开会",
      genre: "广告",
      style: "轻喜剧 / 职场 / 快节奏",
      duration: "30 秒",
      platform: "B 站 / 视频号"
    }
  },
  {
    ...mockProject,
    id: "project-tea-ad",
    title: "国风茶饮 30 秒广告",
    status: "exported",
    updatedAt: "2026-06-29",
    versions: 2,
    input: {
      ...defaultInput,
      brief: "用一杯茶表现城市年轻人的片刻松弛",
      genre: "广告",
      style: "国风 / 都市 / 清新",
      duration: "30 秒",
      platform: "小红书 / 抖音"
    }
  }
];

export function regenerateShot(shot: Shot): Shot {
  return {
    ...shot,
    visual: `${shot.visual} 画面节奏更紧，情绪转折更明确。`,
    prompt: `${shot.prompt}, stronger emotional turning point, clearer cinematic composition`
  };
}
