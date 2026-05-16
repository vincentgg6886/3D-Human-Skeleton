# OrthoVis 3D — 骨科3D骨骼交互可视化系统

<p align="center">
  <strong>一个面向骨科医学专业人员和医学生的人体3D骨骼交互可视化系统</strong>
</p>

<p align="center">
  <a href="https://guge.skyinai.co">在线演示</a> ·
  <a href="#功能特性">功能特性</a> ·
  <a href="#快速开始">快速开始</a> ·
  <a href="#技术栈">技术栈</a> ·
  <a href="#贡献指南">贡献指南</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT" />
  <img src="https://img.shields.io/badge/React-19-61dafb.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/Three.js-R3F-black.svg" alt="Three.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6.svg" alt="TypeScript" />
</p>

---

## 预览截图

<p align="center">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/309927823320059311/zFekwcQLVmVfDnGC.png" alt="OrthoVis 3D 主界面 - 3D骨骼模型与解剖层级导航" width="800" />
</p>

<p align="center">
  <img src="https://files.manuscdn.com/user_upload_by_module/session_file/309927823320059311/pdufycdGjrzhTWkq.png" alt="OrthoVis 3D 新手引导" width="800" />
</p>

---

## 项目简介

OrthoVis 3D 是一个基于 WebGL 的人体骨骼3D交互可视化系统，支持全身 **252 块骨骼** 的自由旋转、缩放、区域锁定查看、骨骼选择高亮、解剖层级导航、关节运动学模拟等功能。采用高级暗色调医疗级视觉设计，适用于骨科教学、临床参考和医学科普。

## 功能特性

### 3D 骨骼交互
- 全身 252 块骨骼的独立选择、高亮和信息展示
- 自由旋转、缩放、平移，支持鼠标和触屏操作
- 6 个预设视角（前/后/左/右/上方/重置）快速切换
- 8 大身体区域快速聚焦（颅骨、脊柱、胸廓、右上肢、左上肢、骨盆、右下肢、左下肢）

### 解剖层级导航
- 完整的骨骼层级树状结构，按区域分组
- 单击展开/折叠，支持显示/隐藏和锁定/解锁操作
- 选中骨骼自动高亮，3D 视图联动

### 关节运动学模拟
- 肩关节、肘关节、髋关节、膝关节的运动动画
- 支持前屈/后伸、外展/内收、旋前/旋后等 15 种运动类型
- 基于解剖学的枢轴点旋转（围绕关节面而非几何中心）
- 运动链联动（肩关节运动时上臂+前臂一起动）
- 可调节播放速度

### 显示模式
- **肌肉覆盖层**：可视化主要肌群附着位置
- **X 光模式**：半透明骨骼效果，模拟 X 光片视觉
- **标注模式**：显示骨骼中英文名称标签
- **病理效果**：15 种常见骨科病症的可视化展示

### 关节视图
- 肩、肘、髋、膝 4 大关节的预设视图
- 自动聚焦相关骨骼，高亮关节组成
- 显示关节类型、运动范围（ROM）等临床信息

### 移动端适配
- 完整的移动端底部导航栏
- 触屏手势支持（单指旋转、双指缩放/平移）
- 响应式面板布局，移动端全功能可用

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 8
- 支持 WebGL 2.0 的现代浏览器（Chrome / Edge / Firefox）

### 一键部署

```bash
# 1. 克隆仓库
git clone https://github.com/vincentgg6886/3D-Human-Skeleton.git
cd 3D-Human-Skeleton

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev
```

打开浏览器访问 `http://localhost:3000` 即可使用。无需任何额外配置或API密钥。

### 构建生产版本

```bash
pnpm build
```

构建产物输出到 `dist/` 目录，可直接部署到任何静态托管服务。

### 部署到各平台

| 平台 | 方式 |
|------|------|
| Vercel | 导入 GitHub 仓库，框架选 Vite，根目录设为 `client` |
| Netlify | 连接仓库，Build command: `pnpm build`，Publish: `dist` |
| GitHub Pages | 使用 `gh-pages` 分支部署 `dist` 目录 |
| Docker | 使用 nginx 镜像挂载 `dist` 目录 |
| 本地局域网 | `pnpm build && npx serve dist` |

### 3D 模型文件

模型文件通过 CDN 加载，无需手动下载，clone 后直接运行即可。

| 模型 | 大小 | 说明 |
|------|------|------|
| overview-skeleton.glb | 3.3 MB | 主骨架模型（147块骨骼） |
| upper-limb.glb | 6.6 MB | 上肢肌肉模型（44块肌肉） |
| lower-limb.glb | 5.9 MB | 下肢肌肉模型（53块肌肉） |

模型基于开放医学教育资源，采用 GLB 格式（glTF Binary）。如需本地加载，可下载模型放到 `client/public/models/` 目录并修改 `SkeletonScene.tsx` 中的 URL 为本地路径。

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 19 + TypeScript |
| 3D 渲染 | Three.js + React Three Fiber + Drei |
| 状态管理 | Zustand |
| 样式系统 | Tailwind CSS 4 |
| UI 组件 | shadcn/ui |
| 路由 | Wouter |
| 构建工具 | Vite |
| 3D 模型 | GLB 格式人体骨骼模型 |

## 项目结构

```
client/
  src/
    components/
      3d/
        SkeletonScene.tsx    # 核心3D场景（骨骼加载、交互、动画）
      ui/
        Toolbar.tsx          # 桌面端工具栏
        MobileNav.tsx        # 移动端底部导航
        SidePanel.tsx        # 侧边信息面板（层级/信息/关节/运动/病症/肌肉）
        TopHUD.tsx           # 顶部状态栏
        ViewPresets.tsx      # 视角预设按钮
        QuickRegionSelector.tsx  # 区域快速选择器
        OnboardingDialog.tsx # 新手引导
        LoadingScreen.tsx    # 加载动画
        ControlsHint.tsx     # 操作提示
    lib/
      store.ts              # Zustand 全局状态
      boneMapping.ts         # GLB节点到骨骼ID的映射
      skeletonData.ts        # 骨骼元数据（名称、描述、ROM）
      jointPresets.ts        # 关节视图预设
      jointMotionData.ts     # 关节运动动画数据
      pathologyData.ts       # 病理数据
      pathologyEffects.ts    # 病理视觉效果
      muscleFilter.ts        # 肌肉过滤逻辑
    pages/
      Home.tsx               # 主页面
    App.tsx                  # 路由入口
    index.css                # 全局样式和设计 tokens
```

## 在线演示

访问 [guge.skyinai.co](https://guge.skyinai.co) 体验完整功能。

> 建议使用 Chrome / Edge 浏览器，需要 WebGL 2.0 支持。

## 贡献指南

欢迎提交 Issue 和 Pull Request。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'Add some feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 创建 Pull Request

### 开发建议

- 骨骼映射数据在 `boneMapping.ts`，新增骨骼需要同步更新
- 关节运动数据在 `jointMotionData.ts`，新增运动类型需定义枢轴骨骼和运动链
- 病理数据在 `pathologyData.ts`，新增病症需关联受影响的骨骼ID

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 致谢

- 3D 骨骼模型来源于开放医学教育资源
- 使用 [Manus](https://manus.im) 辅助构建

---

<p align="center">
  如果这个项目对你有帮助，请给一个 ⭐ Star 支持一下！
</p>
