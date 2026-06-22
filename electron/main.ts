import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─ dist-electron/
// │  ├─ main.js
// │  └─ preload.js
// ├─ dist/
// │  └─ index.html

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(__dirname, '../public')

let win: BrowserWindow | null

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - VITE_
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  const publicPath = process.env.VITE_PUBLIC || path.join(__dirname, '../public')
  const distPath = process.env.DIST || path.join(__dirname, '../dist')

  win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(publicPath, 'vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'AI图片生成工作室',
    show: false,
  })

  // 窗口准备好后再显示，避免白屏
  win.once('ready-to-show', () => {
    win?.show()
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // 开发模式下打开开发者工具
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(distPath, 'index.html'))
  }
}

// 保存文件对话框
ipcMain.handle('save-image', async (_event, defaultName) => {
  const result = await dialog.showSaveDialog(win!, {
    title: '保存图片',
    defaultPath: defaultName,
    filters: [
      { name: 'PNG 图片', extensions: ['png'] },
      { name: 'JPEG 图片', extensions: ['jpg', 'jpeg'] },
      { name: '所有文件', extensions: ['*'] }
    ]
  })
  return result
})

// 保存 base64 图片到文件
ipcMain.handle('save-base64-image', async (_event, base64Data: string, defaultName: string) => {
  try {
    const result = await dialog.showSaveDialog(win!, {
      title: '保存图片',
      defaultPath: defaultName,
      filters: [
        { name: 'PNG 图片', extensions: ['png'] },
        { name: 'JPEG 图片', extensions: ['jpg', 'jpeg'] },
        { name: '所有文件', extensions: ['*'] }
      ]
    })

    if (result.canceled || !result.filePath) {
      return { canceled: true }
    }

    // 将 base64 数据写入文件
    const fs = await import('fs')
    const base64DataWithoutHeader = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64DataWithoutHeader, 'base64')

    await fs.promises.writeFile(result.filePath, buffer)
    console.log('[Main] Image saved to:', result.filePath)

    return { canceled: false, filePath: result.filePath }
  } catch (error: any) {
    console.error('[Main] Save image error:', error)
    throw error
  }
})

// 直接保存到指定文件夹（不弹出对话框）
ipcMain.handle('save-image-auto', async (_event, base64Data: string, savePath: string, filename: string) => {
  try {
    const fs = await import('fs')
    const path = await import('path')

    // 确保保存目录存在
    if (!fs.existsSync(savePath)) {
      await fs.promises.mkdir(savePath, { recursive: true })
      console.log('[Main] Created directory:', savePath)
    }

    const fullPath = path.join(savePath, filename)
    console.log('[Main] Auto saving to:', fullPath)

    // 将 base64 数据写入文件
    const base64DataWithoutHeader = base64Data.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64DataWithoutHeader, 'base64')

    await fs.promises.writeFile(fullPath, buffer)
    console.log('[Main] Image auto-saved to:', fullPath)

    return { success: true, filePath: fullPath }
  } catch (error: any) {
    console.error('[Main] Auto save error:', error)
    throw error
  }
})

// 选择文件夹
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(win!, {
    title: '选择图片保存文件夹',
    properties: ['openDirectory', 'createDirectory']
  })

  if (result.canceled || result.filePaths.length === 0) {
    return { canceled: true }
  }

  return { canceled: false, path: result.filePaths[0] }
})

// 选择文件对话框
ipcMain.handle('select-image', async () => {
  const result = await dialog.showOpenDialog(win!, {
    title: '选择图片',
    filters: [
      { name: '图片文件', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] },
      { name: '所有文件', extensions: ['*'] }
    ],
    properties: ['openFile']
  })
  return result
})

// 下载图片的实际逻辑
async function downloadImageFromUrl(url: string): Promise<string> {
  console.log('[Main] Downloading image:', url);

  const https = await import('https')
  const http = await import('http')

  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http

    const request = client.get(url, {
      timeout: 30000, // 30秒超时
    }, async (response) => {
      console.log('[Main] Response status:', response.statusCode);
      console.log('[Main] Response headers:', response.headers);

      // 处理重定向
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log('[Main] Redirecting to:', redirectUrl);
        if (redirectUrl) {
          // 递归处理重定向
          try {
            const result = await downloadImageFromUrl(redirectUrl);
            resolve(result);
          } catch (error) {
            reject(error);
          }
          return;
        }
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const chunks: Buffer[] = []
      let totalSize = 0

      response.on('data', (chunk) => {
        chunks.push(chunk)
        totalSize += chunk.length
        console.log('[Main] Received chunk, total size:', totalSize);
      })

      response.on('end', () => {
        console.log('[Main] Download complete, total size:', totalSize);
        const buffer = Buffer.concat(chunks)
        const base64 = buffer.toString('base64')

        // 根据 Content-Type 确定 MIME 类型
        const contentType = response.headers['content-type'] || 'image/png'
        const dataUrl = `data:${contentType};base64,${base64}`

        console.log('[Main] Base64 length:', dataUrl.length);
        resolve(dataUrl)
      })

      response.on('error', (error) => {
        console.error('[Main] Response error:', error);
        reject(error.message)
      })
    })

    request.on('error', (error) => {
      console.error('[Main] Request error:', error);
      reject(error.message)
    })

    request.on('timeout', () => {
      console.error('[Main] Request timeout');
      request.destroy()
      reject(new Error('下载超时'))
    })
  })
}

// 下载图片（绕过 CORS）
ipcMain.handle('download-image', async (_event, url: string) => {
  try {
    return await downloadImageFromUrl(url);
  } catch (error: any) {
    console.error('[Main] Download failed:', error);
    throw error;
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
