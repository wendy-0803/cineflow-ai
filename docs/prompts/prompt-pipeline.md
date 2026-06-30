# Prompt 流水线设计

## 总原则

不要用一个巨大 Prompt 直接生成所有内容。CineFlow AI 的核心产品能力是把生成过程拆成可控流水线：

1. 创意理解
2. 故事结构
3. 角色设定
4. 场景拆分
5. 镜头脚本
6. 视频提示词优化
7. 一致性检查

这样做的好处：

- 结果更稳定。
- 用户可以局部修改。
- 方便排查是哪一步质量不好。
- 面试时能体现你对 AI 产品工程化的理解。

## Step 1: 创意理解

### 输入

- 用户的一句话创意
- 题材
- 风格
- 时长
- 平台
- 目标受众
- 主角
- 情绪

### 输出

```json
{
  "coreIdea": "",
  "targetAudienceInsight": "",
  "contentPromise": "",
  "riskNotes": [],
  "recommendedTone": ""
}
```

## Step 2: 故事结构

### 目标

把创意扩展为可拍摄的短片结构。

### 输出

```json
{
  "title": "",
  "logline": "",
  "synopsis": "",
  "threeActStructure": {
    "act1": "",
    "act2": "",
    "act3": ""
  },
  "emotionalCurve": [],
  "visualMotifs": []
}
```

## Step 3: 角色设定

### 目标

保证人物设定能在多镜头中保持一致。

### 输出

```json
{
  "characters": [
    {
      "name": "",
      "role": "",
      "identity": "",
      "appearance": "",
      "personality": "",
      "motivation": "",
      "visualConsistencyPrompt": "",
      "voiceTone": ""
    }
  ]
}
```

## Step 4: 场景拆分

### 目标

把故事拆成少量场景，每个场景有明确叙事功能。

### 输出

```json
{
  "scenes": [
    {
      "index": 1,
      "title": "",
      "purpose": "",
      "location": "",
      "timeOfDay": "",
      "summary": "",
      "keyEmotion": ""
    }
  ]
}
```

## Step 5: 镜头脚本

### 目标

把每个场景拆成可执行镜头。

### 输出

```json
{
  "shots": [
    {
      "sceneIndex": 1,
      "shotIndex": 1,
      "durationSec": 5,
      "shotSize": "medium",
      "cameraMovement": "",
      "visualDescription": "",
      "characterAction": "",
      "dialogueOrVoiceover": "",
      "subtitle": "",
      "soundDesign": "",
      "storyFunction": ""
    }
  ]
}
```

## Step 6: 视频提示词优化

### 目标

把镜头描述改写成适合 AI 视频工具的提示词。

### 输出

```json
{
  "optimizedShots": [
    {
      "shotIndex": 1,
      "genericVideoPrompt": "",
      "jimengPrompt": "",
      "klingPrompt": "",
      "runwayPrompt": "",
      "nanomoviePrompt": "",
      "negativePrompt": ""
    }
  ]
}
```

## Step 7: 一致性检查

### 检查项

- 角色外貌是否前后一致。
- 时长总和是否接近目标时长。
- 情绪曲线是否有变化。
- 镜头之间是否有叙事连接。
- 提示词是否过长或过抽象。
- 是否缺少旁白、字幕或音效。

### 输出

```json
{
  "isReadyToExport": true,
  "issues": [],
  "revisionSuggestions": []
}
```

## 局部重生成策略

用户修改某一幕时，不要重新生成整个项目。局部重生成需要带入：

- 原始项目输入
- 故事结构
- 角色卡
- 当前场景上下文
- 前一个镜头摘要
- 后一个镜头摘要
- 用户修改要求

这样可以避免重新生成后故事跑偏。
