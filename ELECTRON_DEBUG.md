# Electron API 调试指南

## 问题诊断步骤

### 1. 确认您正在运行 Electron 应用

**正确的启动命令：**
```bash
npm run electron:dev
```

**错误的启动命令（不会加载 Electron API）：**
```bash
npm run dev  # ❌ 这只在浏览器中运行
```

### 2. 检查控制台日志

在 Electron 应用中按 `F12` 打开开发者工具，查看 Console 标签：

**应该看到的日志：**
```
[App] Checking Electron API...
[App] window.electronAPI: {downloadImage: ƒ, saveImageAuto: ƒ, ...}
[App] Available methods: ['saveImage', 'saveBase64Image', 'saveImageAuto', 'selectImage', 'selectDirectory', 'downloadImage', 'onMainProcessMessage']
[App] ✅ Electron API loaded successfully
```

**如果看到错误：**
```
[App] ⚠️ Electron API not loaded!
```
说明 preload 脚本没有正确加载。

### 3. 手动测试 API

在开发者工具的 Console 中运行：

```javascript
// 检查 API 是否存在
console.log(window.electronAPI);

// 测试选择文件夹
window.electronAPI.selectDirectory().then(result => {
  console.log('Selected directory:', result);
});

// 测试下载图片（使用一个示例 URL）
window.electronAPI.downloadImage('https://example.com/image.jpg').then(dataUrl => {
  console.log('Downloaded, length:', dataUrl.length);
});
```

### 4. 检查进程

确认以下进程正在运行：
- `electron.exe` - Electron 主进程
- `node.exe` - Vite 开发服务器

在任务管理器中应该看到这两个进程。

### 5. 常见问题及解决方案

#### 问题 1: `window.electronAPI` 是 undefined

**原因：**
- 没有使用 `npm run electron:dev` 启动
- Preload 脚本路径错误
- Context isolation 配置问题

**解决方案：**
1. 确保使用正确的启动命令
2. 检查 `dist-electron/preload.js` 是否存在
3. 查看主进程控制台是否有错误

#### 问题 2: Electron 窗口打开但显示空白

**原因：**
- Vite 开发服务器未启动
- 端口 3000 被占用

**解决方案：**
1. 检查终端是否有 Vite 相关错误
2. 尝试更改端口：修改 `vite.config.ts` 中的 `server.port`

#### 问题 3: Preload 脚本加载失败

**原因：**
- TypeScript 编译错误
- 路径配置问题

**解决方案：**
1. 检查 `dist-electron/` 目录
2. 重新构建：`npm run build`
3. 重启 Electron：`npm run electron:dev`

### 6. 完全重置

如果以上方法都不行，尝试完全重置：

```bash
# 1. 停止所有进程
# 2. 删除构建文件
rm -rf dist dist-electron node_modules/.vite

# 3. 重新安装依赖（可选）
npm install

# 4. 重新构建
npm run build

# 5. 启动 Electron
npm run electron:dev
```

### 7. 检查文件结构

确认以下文件存在：

```
AiShengTu/
├── dist/
│   └── index.html
├── dist-electron/
│   ├── main.js
│   └── preload.js
├── electron/
│   ├── main.ts
│   └── preload.ts
└── package.json
```

### 8. 查看主进程日志

Electron 主进程的日志会输出到启动 `npm run electron:dev` 的终端窗口，查看是否有错误信息。

## 测试检查清单

- [ ] 使用 `npm run electron:dev` 启动（不是 `npm run dev`）
- [ ] Electron 窗口已打开（不是浏览器窗口）
- [ ] 开发者工具中显示 `[App] ✅ Electron API loaded successfully`
- [ ] `window.electronAPI` 存在且包含方法
- [ ] 主进程终端没有错误

## 联系支持

如果问题仍然存在，请提供：
1. 控制台完整日志
2. 主进程终端输出
3. 截图显示您正在使用 Electron 应用（不是浏览器）
