# AI Image Generation Studio

一款基于 Electron 的桌面应用，参考向日葵远程控制和 ToDesk 风格设计，支持多平台 AI 图片生成。

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Electron](https://img.shields.io/badge/Electron-42.4.1-green)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## ✨ 功能特性

### 核心功能
- 🎨 **多模型支持** - 支持 OpenAI DALL-E 和火山引擎 Doubao-Seedream 系列模型
- 🖼️ **文生图/图生图** - 支持文字描述生成和图片转换
- 💾 **智能保存** - 支持自动保存到指定文件夹和手动选择位置
- 📊 **任务管理** - 实时显示生成状态（生成中/成功/失败）
- 📜 **历史记录** - 自动保存生成历史，支持重新下载
- ⚙️ **灵活配置** - 应用内配置 API 密钥，无需修改代码

### 技术亮点
- 🖥️ **桌面应用** - 基于 Electron，跨平台支持
- 🚀 **高性能** - Vite 构建，快速启动和热更新
- 💾 **持久化存储** - Zustand + localStorage，配置自动保存
- 🎯 **状态管理** - 实时任务状态追踪，颜色标识（黄色-生成中，绿色-成功，红色-失败）
- 🔒 **安全认证** - Bearer Token 认证，支持自定义 API 端点
- 📦 **CORS 友好** - 通过 Electron 主进程下载，绕过浏览器限制

## 🚀 快速开始

### 环境要求
- Node.js >= 16.x
- npm >= 8.x

### 安装依赖

```bash
npm install
```

### 启动开发模式

**⚠️ 重要：必须使用以下命令启动 Electron 应用**

```bash
npm run electron:dev
```

**❌ 不要使用** `npm run dev`（这只会在浏览器中运行，无法使用 Electron API）

### 构建生产版本

```bash
npm run electron:build
```

### 本地打包

```bash
build-local.bat
```

## 📖 使用指南

### 1. 配置 API 密钥

1. 点击右上角 **"设置"** 按钮
2. 选择对应的平台标签（OpenAI / 火山引擎）
3. 启用平台开关
4. 输入 API Key
5. （可选）修改 API Base URL
6. 点击 **"保存配置"**

### 2. 配置自动保存（可选）

1. 在设置中选择 **"通用设置"** 标签
2. 启用 **"启用自动保存"**
3. 点击 **"选择文件夹"** 选择保存位置
4. 保存配置后，生成的图片会自动保存到指定文件夹

### 3. 生成图片

1. 选择 AI 模型（如 `Doubao-Seedream 5.0`）
2. 在左侧输入框中输入文字描述
3. （可选）上传参考图片
4. 点击 **"生成图片"** 按钮
5. 查看右侧任务状态面板了解生成进度
6. 生成成功后图片显示在结果区域

### 4. 保存图片

- **自动保存已启用** - 图片自动保存到指定文件夹
- **自动保存未启用** - 点击"保存"按钮，选择保存位置

## 🎯 支持的模型

### 火山引擎 Doubao-Seedream 系列

| 模型 ID | 名称 | 描述 | 推荐场景 |
|---------|------|------|---------|
| `doubao-seedream-5-0-260128` | Doubao-Seedream 5.0 | 最新版本，高质量 | 专业创作 |
| `doubao-seedream-4-5` | Doubao-Seedream 4.5 | 平衡质量和速度 | 日常使用 |
| `doubao-seedream-4-0` | Doubao-Seedream 4.0 | 稳定版本 | 可靠生成 |
| `doubao-seedream-3-5` | Doubao-Seedream 3.5 | 经济实惠 | 批量生成 |

### OpenAI DALL-E 系列

| 模型 ID | 名称 | 描述 |
|---------|------|------|
| `dall-e-3` | DALL-E 3 | 最新版本，高质量 |
| `dall-e-2` | DALL-E 2 | 支持图生图 |

## 🏗️ 项目结构

```
AiShengTu/
├── electron/                 # Electron 主进程
│   ├── main.ts              # 主进程入口
│   └── preload.ts           # 预加载脚本
├── src/
│   ├── components/          # React 组件
│   │   ├── ModelSelector/   # 模型选择器
│   │   ├── InputArea/       # 输入区域
│   │   ├── ImageUploader/   # 图片上传
│   │   ├── ResultDisplay/   # 结果展示
│   │   ├── TaskStatusPanel/ # 任务状态面板 ⭐
│   │   ├── HistoryPanel/    # 历史记录
│   │   ├── SettingsModal/   # 设置弹窗
│   │   └── Layout/          # 布局
│   ├── services/            # 服务层
│   │   ├── api/             # API 适配器
│   │   │   ├── base.ts      # 基类
│   │   │   ├── openai.ts    # OpenAI 适配器
│   │   │   ├── volcano.ts   # 火山引擎适配器
│   │   │   └── index.ts     # 工厂类
│   │   ├── GenerationService.ts  # 生成服务 ⭐
│   │   └── ImageService.ts  # 图片处理
│   ├── store/               # 状态管理
│   │   ├── useModelStore.ts # 模型状态
│   │   ├── useImageStore.ts # 图片状态
│   │   ├── useHistoryStore.ts # 历史记录
│   │   ├── useTaskStore.ts  # 任务状态 ⭐
│   │   └── useAPIConfigStore.ts # API 配置 ⭐
│   ├── config/              # 配置
│   │   └── models.ts        # 模型配置 ⭐
│   ├── types/               # TypeScript 类型
│   └── App.tsx              # 主应用
├── dist/                    # 前端构建输出
├── dist-electron/           # Electron 构建输出
└── build-output/            # 打包输出目录
```

## 🎨 界面布局

```
┌────────────────────────────────────────────────────────┐
│  AI图片生成工作室              [设置]                   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌────────────────────────┐  ┌──────────────────────┐ │
│  │  模型选择               │  │  任务状态            │ │
│  │  ├─ 火山引擎模型列表    │  │  ├─ 生成中 (黄色)   │ │
│  │  └─ OpenAI 模型列表     │  │  ├─ 成功 (绿色)     │ │
│  └────────────────────────┘  │  └─ 失败 (红色)     │ │
│                              └──────────────────────┘ │
│  ┌────────────────────────┐  ┌──────────────────────┐ │
│  │  输入描述               │  │  历史记录            │ │
│  │  ├─ 文字输入框          │  │  ├─ 图片预览        │ │
│  │  └─ [生成] [清空]       │  │  └─ 下载/删除       │ │
│  └────────────────────────┘  └──────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │  生成结果展示                                      │ │
│  │  ├─ 图片网格展示                                  │ │
│  │  └─ [保存] [清空]                                 │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## 🔧 技术栈

### 前端
- **React 18** - UI 框架
- **TypeScript 5.5** - 类型安全
- **Ant Design 5.x** - UI 组件库
- **Zustand** - 状态管理
- **Axios** - HTTP 客户端

### 桌面应用
- **Electron 42.4.1** - 跨平台桌面框架
- **Vite 5.x** - 构建工具
- **vite-plugin-electron** - Electron 集成

### 图片处理
- **react-dropzone** - 文件拖拽上传
- **react-image-crop** - 图片裁剪
- **file-saver** - 文件保存

## 📦 核心功能实现

### 任务状态管理

```typescript
type TaskStatus = 'pending' | 'generating' | 'success' | 'failed';

interface Task {
  id: string;
  status: TaskStatus;
  prompt?: string;
  model: string;
  errorMessage?: string;
  createdAt: number;
}
```

- 🟡 **黄色** - 生成中
- 🟢 **绿色** - 生成成功
- 🔴 **红色** - 生成失败（显示错误原因）

### 自动保存功能

1. 用户选择保存文件夹
2. 启用自动保存开关
3. 生成成功后自动保存到指定位置
4. 无需每次选择保存位置

### CORS 问题解决

通过 Electron 主进程下载图片，绕过浏览器 CORS 限制：

```typescript
// 主进程
ipcMain.handle('download-image', async (_event, url: string) => {
  // 使用 Node.js 下载，无 CORS 限制
  const buffer = await downloadImage(url);
  return buffer.toString('base64');
});

// 渲染进程
const dataUrl = await window.electronAPI.downloadImage(imageUrl);
```

## 🔐 安全性

- ✅ Bearer Token 认证
- ✅ API Key 本地存储，不上传服务器
- ✅ Context Isolation 隔离
- ✅ 禁用 Node Integration
- ✅ 预加载脚本白名单暴露 API

## 📝 开发笔记

### 修复的关键问题

1. **Preload 脚本格式错误** - 必须使用 CommonJS 格式
2. **模型提供商识别错误** - 使用配置中的 provider 字段而非字符串匹配
3. **CORS 限制** - 通过 Electron 主进程下载绕过
4. **图片保存失败** - 实现 Base64 自动转换和保存

### 打包优化

- 包大小从 109MB 优化到 101MB
- 使用 Terser 压缩
- Code splitting 分离第三方库
- 移除多余的语言文件

## 🐛 故障排除

### Electron API 未加载

**症状**：控制台显示 `window.electronAPI` 为 `undefined`

**解决方案**：
1. 确认使用 `npm run electron:dev` 启动
2. 不要使用 `npm run dev`
3. 检查 `dist-electron/preload.js` 是否存在

### 图片保存失败

**症状**：提示 CORS 错误或网络错误

**解决方案**：
1. 确认使用 Electron 应用（不是浏览器）
2. 检查网络连接
3. 查看主进程日志输出

### 模型不存在错误

**症状**：提示模型不存在或无权限

**解决方案**：
1. 确认 API Key 正确
2. 确认账号有访问该模型的权限
3. 检查火山引擎控制台确认模型 ID

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**注意**：使用前请确保您有相应 AI 平台的 API 访问权限，并遵守各平台的使用条款。

## 📚 相关文档

- [Electron 官方文档](https://www.electronjs.org/docs)
- [火山引擎 AI 文生图文档](https://www.volcengine.com/docs/6791/1347773)
- [OpenAI Images API](https://platform.openai.com/docs/api-reference/images)
- [React 官方文档](https://react.dev/)
- [Ant Design 组件库](https://ant.design/)
