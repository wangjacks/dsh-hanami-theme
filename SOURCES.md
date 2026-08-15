# Hanami · 花見 — 来源与许可声明 (SOURCES)

版本 1.0.0 · 本文件逐项披露主题包引用的全部上游组件及其许可证，并给出按场景的合规建议。

> **重要前提**：Hanami 是"运行时加载"型主题——**包内不包含任何第三方代码或资源文件**，
> 引擎与模型均在浏览器运行时从 CDN 加载。本声明仍逐项披露来源，确保合规。

## 组件清单与许可证

| 组件 | 用途 | 来源 | 许可证 | 合规要点 |
|---|---|---|---|---|
| **Hanami 主题代码** | 主题本体（配色/樱花/看板娘集成/设置 UI） | 原创（本包） | **GPL-3.0**（见 `LICENSE`） | 与所驱动的 GPL 引擎保持一致，避免许可冲突 |
| **live2d-widgets@1.0.1** | 看板娘引擎 | [stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget) | **GPL-3.0 / GPL-3.0-or-later**（GitHub 与 npm 字段一致） | Copyleft：对外分发引擎或与之构成整体作品时，须提供 GPL-3.0 文本与对应源码；**个人设备内部使用不触发分发义务** |
| **live2d-widget-model-\*@1.0.5** | Cubism2 模型资源（静酱/小春/晴/响/Z16/Unity酱等） | [xiazeyu/live2d-widget-models](https://github.com/xiazeyu/live2d-widget-models)（npm 发布） | **GPL-2.0** | 分发须符合 GPL-2.0；个人使用无额外义务 |
| **fghrsh/live2d_api** | 模型仓库（Pio/Tia/B站22·33/静/海王星/丛云） | [fghrsh/live2d_api](https://github.com/fghrsh/live2d_api) | 代码 **MIT**（© 2018 FGHRSH）；**模型版权归原作者** | README 原文："API 内所有模型 **版权均属于原作者，仅供研究学习，不得用于商业用途**" |
| **hitokoto（一言）** | 看板娘一言工具 | [hitokoto-osc/hitokoto-api](https://github.com/hitokoto-osc/hitokoto-api) | **Apache-2.0** | 开发者文档："语句库在遵守使用协议的情况下允许任何人**免费使用**"；API 响应带每句来源字段（`from` / `from_who` / `creator`） |
| **Live2D Cubism SDK** | 渲染核心（`live2d.min.js` = Cubism2 核心；`live2dcubismcore.min.js` = Cubism5 核心） | [live2d.com/sdk](https://www.live2d.com/en/sdk/license/)（官方） | Live2D Proprietary / Open Software License 协议 | **免费下载与开发**；**公开发布**时：发布者年销售额 **< 1000 万日元（普通用户/小型企业）免费**，中型/大型企业须签署付费的 Publication License（官方页面标价：中型企业首发约 ¥50,000 + 月费 ¥20,000/平台；大型企业约 ¥300,000 + ¥100,000；视频类另有 5% 销售分成） |
| **CDN（jsDelivr / unpkg）** | 静态资源分发 | 各自服务 | 各自服务条款 | 仅作公共 CDN 使用，遵守其可接受使用政策 |

## 按场景的使用建议

| 场景 | 结论 |
|---|---|
| **个人设备使用**（当前场景） | ✅ 全部组件均允许；模型"仅供研究学习"涵盖个人学习用途 |
| **团队/组织内部使用** | ✅ 引擎 GPL-3.0 无分发义务（内部使用不构成分发）；模型内部**非商用**可 |
| **对外分发本主题包** | ⚠️ 包内不含第三方代码；但若与 GPL 引擎构成整体分发，须随包提供 GPL-3.0 条款与源码获取方式；GPL-2.0 模型包同理 |
| **商业用途** | ❌ fghrsh/live2d_api 内模型**明确禁止商用**；live2d-widget-model-\* 按 GPL-2.0 评估；Cubism SDK 年销售额 ≥1000 万日元须购买 Publication License。**商用前必须逐项取得授权** |

## 原始证据（2026-08 取证）

- live2d-widget 的 GPL-3.0 全文：`https://raw.githubusercontent.com/stevenjoezhang/live2d-widget/master/LICENSE`
- fghrsh/live2d_api 版权声明（README）：`https://github.com/fghrsh/live2d_api`
- 模型包 npm 清单（license 字段）：`https://registry.npmjs.org/live2d-widget-model-shizuku/1.0.5`（koharu、haru 同）
- hitokoto 开发者文档（语句库免费使用声明）：`https://developer.hitokoto.cn/sentence/`
- Live2D SDK Release License（官方授权页）：`https://www.live2d.com/en/sdk/license/`

## 免责声明

本声明基于 2026-08 对公开仓库与官方页面的核实；上游许可证可能随时变更，
正式使用或分发前请以各来源**最新文本**为准。本文件不构成法律意见。
