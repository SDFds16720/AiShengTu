# AI Image Generation Studio

一款参考向日葵远程控制和ToDesk风格设计的文生图/图生图应用，支持多平台AI模型调用。

## 功能特性

- **多模型支持**: 支持OpenAI DALL-E、火山引擎等多个AI图片生成平台
- **灵活输入**: 支持文字描述生成图片（文生图）和上传图片生成新图片（图生图）
- **结果展示**: 优雅的图片展示区域，支持多图浏览
- **本地保存**: 一键保存生成的图片到本地
- **历史记录**: 保存生成历史，方便回顾和管理

## 技术栈

- **前端框架**: React 18 + TypeScript
- **UI组件库**: Ant Design 5.x
- **状态管理**: Zustand
- **HTTP客户端**: Axios
- **图片处理**: react-image-crop
- **拖拽上传**: react-dropzone

## 项目结构

```
src/
├── components/           # UI组件
│   ├── ModelSelector/    # 模型选择器
│   ├── InputArea/        # 输入区域(文字/图片)
│   ├── ImageUploader/    # 图片上传组件
│   ├── ResultDisplay/    # 结果展示区
│   ├── HistoryPanel/     # 历史记录面板
│   └── Layout/           # 布局组件
├── services/             # API服务层
│   ├── api/
│   │   ├── base.ts       # 基础API封装
│   │   ├── openai.ts     # OpenAI适配器
│   │   ├── volcano.ts    # 火山引擎适配器
│   │   └── index.ts      # 统一导出
│   └── ImageService.ts   # 图片处理服务
├── store/                # 状态管理
│   ├── useModelStore.ts  # 模型状态
│   ├── useImageStore.ts  # 图片状态
│   └── useHistoryStore.ts # 历史记录
├── types/                # TypeScript类型
│   ├── models.ts         # 模型类型
│   └── api.ts            # API类型
├── utils/                # 工具函数
│   ├── fileSaver.ts      # 文件保存
│   └── imageConverter.ts # 图片格式转换
└── App.tsx               # 主应用
```

## 界面布局

```
┌─────────────────────────────────────────┐
│  Logo    模型选择 ▼    设置    历史记录  │  ← 顶部导航栏
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────┐  ┌─────────────────┐ │
│   │             │  │                 │ │
│   │  模型选择   │  │   输入区域      │ │
│   │  卡片区域   │  │   (文字/图片)   │ │
│   │             │  │                 │ │
│   └─────────────┘  └─────────────────┘ │
│                                         │
│   ┌───────────────────────────────────┐ │
│   │                                   │ │
│   │      生成结果展示区域             │ │
│   │      (可滚动、多图展示)           │ │
│   │                                   │ │
│   └───────────────────────────────────┘ │
│                                         │
│   [ 生成图片 ]  [ 保存本地 ]  [ 清空 ]  │  ← 操作按钮
└─────────────────────────────────────────┘
```

## 架构设计

### API适配器模式

系统采用适配器模式统一封装不同AI平台的API，便于扩展新平台。

```typescript
// 抽象基类
interface ImageGenerationConfig {
  prompt?: string;
  image?: File;
  model: string;
  size?: string;
  quality?: string;
}

interface GenerationResult {
  imageUrl: string;
  taskId?: string;
  status: 'pending' | 'completed' | 'failed';
}

abstract class BaseImageAPI {
  abstract generate(config: ImageGenerationConfig): Promise<GenerationResult>;
  abstract getModels(): Promise<ModelInfo[]>;
  abstract checkStatus(taskId: string): Promise<GenerationResult>;
}

// API工厂
class APIFactory {
  static createAPI(provider: 'openai' | 'volcano' | 'custom'): BaseImageAPI {
    switch(provider) {
      case 'openai': return new OpenAIAPI();
      case 'volcano': return new VolcanoAPI();
      default: throw new Error('Unsupported provider');
    }
  }
}
```

### 状态管理

使用Zustand进行轻量级状态管理，主要包含：

- **useModelStore**: 当前选中的模型、可用模型列表
- **useImageStore**: 输入的图片、生成的图片
- **useHistoryStore**: 生成历史记录

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 配置API密钥

在项目根目录创建 `.env` 文件：

```env
REACT_APP_OPENAI_API_KEY=your_openai_api_key
REACT_APP_VOLCANO_API_KEY=your_volcano_api_key
REACT_APP_VOLCANO_ACCESS_KEY=your_volcano_access_key
```

### 启动开发服务器

```bash
npm start
# 或
yarn start
```

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

## 支持的AI平台

### OpenAI DALL-E

- **模型**: DALL-E 2, DALL-E 3
- **功能**: 文生图、图片变体
- **文档**: https://platform.openai.com/docs/guides/images

### 火山引擎

- **模型**: 多种文生图模型
- **功能**: 文生图、图生图
- **文档**: https://www.volcengine.com/docs/6791/1347773

## 设计规范

参考向日葵远程控制和ToDesk的UI风格：

- **主色调**: 蓝色系 `#1890ff`
- **背景色**: 浅灰 `#f5f7fa`
- **卡片圆角**: `8px`
- **阴影**: `0 2px 8px rgba(0,0,0,0.08)`
- **字体**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

## 扩展新平台

要添加新的AI平台支持，只需：

1. 在 `services/api/` 目录下创建新的适配器类，继承 `BaseImageAPI`
2. 在 `APIFactory` 中注册新的平台
3. 在模型配置中添加新平台的模型信息

示例：

```typescript
// services/api/stability.ts
class StabilityAPI extends BaseImageAPI {
  async generate(config: ImageGenerationConfig): Promise<GenerationResult> {
    // 实现Stability AI的调用逻辑
  }
}

// services/api/index.ts
class APIFactory {
  static createAPI(provider: 'openai' | 'volcano' | 'stability'): BaseImageAPI {
    switch(provider) {
      case 'stability': return new StabilityAPI();
      // ...
    }
  }
}
```

## 许可证

MIT

## 贡献指南

欢迎提交Issue和Pull Request！

---

**注意**: 使用前请确保您有相应AI平台的API访问权限，并遵守各平台的使用条款。
