/**
 * ============================================================
 *  Hanami · 花見 — 二次元主题 (Anime Theme)
 *  Version 1.0.0
 *  合规：上游组件许可证见 SOURCES.md 与 LICENSE（引擎 GPL-3.0、模型 GPL-2.0/
 *        仅供学习、Cubism SDK 按官方条款）；本包运行时从 CDN 加载，不含第三方代码。
 * ============================================================
 *  这是动态 Cordis 插件的 code.client 函数体（async function body，
 *  执行后返回插件对象；纯 JavaScript，无 JSX/TS/import）。
 *
 *  安装到新设备（步骤详见 README.md）：
 *    1) 新建会话时选择「创造模式」预设（即 cordis，唯一带 cordis_define / cordis_run 工具的预设）
 *    2) agent 读取本文件，执行：
 *         cordis_define({ kind: 'new', idPrefix: 'hanami' },
 *                        name: 'Hanami · 二次元主题',
 *                        purpose: '...',
 *                        code: { client: <本文件内容> })
 *           （idPrefix 会被主机截断，实际 pluginId 形如 hanam-1，记下它用于重新激活）
 *    3) cordis_run 激活；首次运行需在 UI 批准客户端插件。
 *
 *  功能：
 *    - 6 套配色预设（亮/暗双模式，选择存 localStorage）
 *    - 樱花飘落氛围动画（设置开关）
 *    - Live2D 看板娘：live2d-widgets@1.0.1 主流引擎，多 CDN 回退，
 *      右下角停靠、可拖动、悬停工具栏（换模型/换装/一言/拍照/隐藏）
 *
 *  依赖（浏览器需可访问）：
 *    - jsDelivr / unpkg（引擎与模型 CDN，多镜像回退）
 *    - cubism.live2d.com（Cubism5 核心，仅 Cubism3+ 模型时使用）
 * ============================================================
 */
// ================= shared per-run stores =================
const petalStore = (() => {
  let enabled = true
  const listeners = new Set()
  return {
    isEnabled: () => enabled,
    setEnabled: (v) => {
      enabled = v
      listeners.forEach((fn) => fn(v))
    },
    subscribe: (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
})()

const live2dStore = (() => {
  let enabled = true
  let status = 'idle'
  let message = ''
  let retrySeq = 0
  const listeners = new Set()
  const emit = () => listeners.forEach((fn) => fn())
  return {
    isEnabled: () => enabled,
    getStatus: () => status,
    getMessage: () => message,
    setEnabled: (v) => { enabled = v; emit() },
    setStatus: (s, m) => { status = s; message = m || ''; emit() },
    retry: () => { retrySeq += 1; emit() },
    subscribe: (fn) => { listeners.add(fn); return () => listeners.delete(fn) },
    key: () => enabled + ':' + retrySeq,
  }
})()

// ================= theme presets =================
const SEMANTIC = {
  '--dsw-alias-state-error-primary': { light: '#E5484D', dark: '#FF7A85' },
  '--dsw-alias-state-success-primary': { light: '#2FA87A', dark: '#5BD6A0' },
  '--dsw-alias-state-warn-primary': { light: '#F2A33C', dark: '#FFC46B' },
}
function buildTokens(palette) {
  return {
    '--dsw-alias-bg-base': palette.bgBase,
    '--dsw-alias-bg-layer-1': palette.layer1,
    '--dsw-alias-bg-layer-2': palette.layer2,
    '--dsw-alias-bg-overlay': palette.overlay,
    '--dsw-alias-border-l1': palette.border1,
    '--dsw-alias-border-l2': palette.border2,
    '--dsw-alias-brand-primary': palette.brand,
    '--dsw-alias-label-primary': palette.label1,
    '--dsw-alias-label-secondary': palette.label2,
    '--dsw-specific-sidebar-fill': palette.sidebar,
    ...SEMANTIC,
  }
}
const PRESETS = {
  sakura: {
    label: '🌸 桜 Sakura',
    palette: {
      bgBase: { light: '#FFF6F9', dark: '#171327' },
      layer1: { light: '#FFFFFF', dark: '#221C3E' },
      layer2: { light: '#FDEBF1', dark: '#2B2450' },
      overlay: { light: '#FFFFFF', dark: '#282148' },
      border1: { light: '#F6D9E2', dark: '#39305F' },
      border2: { light: '#EDC4D2', dark: '#4A4078' },
      brand: { light: '#F0466F', dark: '#FF8FAB' },
      label1: { light: '#463A5A', dark: '#EAE4FB' },
      label2: { light: '#7E7196', dark: '#A79DD1' },
      sidebar: { light: '#FBE9F0', dark: '#1E1936' },
    },
  },
  lavender: {
    label: '💜 紫苑 Lavender',
    palette: {
      bgBase: { light: '#F8F5FF', dark: '#171129' },
      layer1: { light: '#FFFFFF', dark: '#221B3C' },
      layer2: { light: '#F1EBFF', dark: '#2C2350' },
      overlay: { light: '#FFFFFF', dark: '#282047' },
      border1: { light: '#E6DFF8', dark: '#3A3260' },
      border2: { light: '#D6CBF0', dark: '#4B4078' },
      brand: { light: '#7C5CF0', dark: '#B39DFF' },
      label1: { light: '#3F3660', dark: '#EAE4FB' },
      label2: { light: '#7E7499', dark: '#A79DD1' },
      sidebar: { light: '#F1EBFF', dark: '#1D1733' },
    },
  },
  mint: {
    label: '🍃 薄荷 Mint',
    palette: {
      bgBase: { light: '#F1FBF8', dark: '#0E1E1A' },
      layer1: { light: '#FFFFFF', dark: '#172A25' },
      layer2: { light: '#E3F7F0', dark: '#1E3931' },
      overlay: { light: '#FFFFFF', dark: '#1C302A' },
      border1: { light: '#D6F0E6', dark: '#2E4A41' },
      border2: { light: '#BEE5D6', dark: '#3C5F53' },
      brand: { light: '#0E9F74', dark: '#4FD1B5' },
      label1: { light: '#173A31', dark: '#E0F5EE' },
      label2: { light: '#5F8579', dark: '#9CC9BB' },
      sidebar: { light: '#E3F7F0', dark: '#122620' },
    },
  },
  moon: {
    label: '🌙 月夜 Moon',
    palette: {
      bgBase: { light: '#F3F7FF', dark: '#0D1729' },
      layer1: { light: '#FFFFFF', dark: '#14233B' },
      layer2: { light: '#E4EDFF', dark: '#1B2F4D' },
      overlay: { light: '#FFFFFF', dark: '#182A45' },
      border1: { light: '#D9E4FA', dark: '#2C4264' },
      border2: { light: '#C2D4F2', dark: '#3A5378' },
      brand: { light: '#3E7BFA', dark: '#7FB0FF' },
      label1: { light: '#22314F', dark: '#E3EBFA' },
      label2: { light: '#64789B', dark: '#9DB4D8' },
      sidebar: { light: '#E4EDFF', dark: '#101E33' },
    },
  },
  mono: {
    label: '🖋️ 墨白 Mono',
    palette: {
      bgBase: { light: '#F7F7F5', dark: '#111111' },
      layer1: { light: '#FFFFFF', dark: '#1A1A1A' },
      layer2: { light: '#ECECEA', dark: '#232323' },
      overlay: { light: '#FFFFFF', dark: '#1E1E1E' },
      border1: { light: '#E2E2DF', dark: '#333333' },
      border2: { light: '#CBCBC8', dark: '#454545' },
      brand: { light: '#26261F', dark: '#E8E8E2' },
      label1: { light: '#26261F', dark: '#ECECEA' },
      label2: { light: '#6E6E66', dark: '#A8A8A0' },
      sidebar: { light: '#ECECEA', dark: '#161616' },
    },
  },
  citrus: {
    label: '🍊 蜜柑 Citrus',
    palette: {
      bgBase: { light: '#FFF8F0', dark: '#221710' },
      layer1: { light: '#FFFFFF', dark: '#2E2016' },
      layer2: { light: '#FFEFDF', dark: '#3D2A1B' },
      overlay: { light: '#FFFFFF', dark: '#35251A' },
      border1: { light: '#F8E3D0', dark: '#4D3827' },
      border2: { light: '#F0D3B8', dark: '#614833' },
      brand: { light: '#F26A2E', dark: '#FFA55C' },
      label1: { light: '#4A3122', dark: '#F8EAE0' },
      label2: { light: '#8F6F58', dark: '#C6A58D' },
      sidebar: { light: '#FFEFDF', dark: '#2A1D14' },
    },
  },
}

const themeStore = (() => {
  let preset = 'sakura'
  try {
    const saved = localStorage.getItem('dsh-anime-preset')
    if (saved && PRESETS[saved]) preset = saved
  } catch (e) { /* ignore */ }
  const listeners = new Set()
  return {
    getPreset: () => preset,
    setPreset: (id) => {
      if (id !== preset && PRESETS[id]) {
        preset = id
        try { localStorage.setItem('dsh-anime-preset', id) } catch (e) { /* ignore */ }
        listeners.forEach((fn) => fn())
      }
    },
    subscribe: (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
  }
})()

// ================= live2d-widgets engine (npm live2d-widgets@1.0.1, stevenjoezhang/live2d-widget) =================
const NPM_BASE = {
  'cdn.jsdelivr.net': 'https://cdn.jsdelivr.net/npm/',
  'fastly.jsdelivr.net': 'https://fastly.jsdelivr.net/npm/',
  'gcore.jsdelivr.net': 'https://gcore.jsdelivr.net/npm/',
  'unpkg.com': 'https://unpkg.com/',
}
const GH_BASE = {
  'cdn.jsdelivr.net': 'https://cdn.jsdelivr.net/gh/',
  'fastly.jsdelivr.net': 'https://fastly.jsdelivr.net/gh/',
  'gcore.jsdelivr.net': 'https://gcore.jsdelivr.net/gh/',
  'unpkg.com': 'https://fastly.jsdelivr.net/gh/',
}
const ENGINE_ESM = [
  'https://cdn.jsdelivr.net/npm/live2d-widgets@1.0.1/+esm',
  'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.1/+esm',
  'https://gcore.jsdelivr.net/npm/live2d-widgets@1.0.1/+esm',
]
const ENGINE_MODULE = [
  'https://cdn.jsdelivr.net/npm/live2d-widgets@1.0.1/dist/waifu-tips.js',
  'https://fastly.jsdelivr.net/npm/live2d-widgets@1.0.1/dist/waifu-tips.js',
  'https://gcore.jsdelivr.net/npm/live2d-widgets@1.0.1/dist/waifu-tips.js',
  'https://unpkg.com/live2d-widgets@1.0.1/dist/waifu-tips.js',
]
const CUBISM5_CORE = 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'

function loadModuleScript(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.type = 'module'
    el.src = src
    el.onload = () => resolve()
    el.onerror = () => reject(new Error('模块加载失败：' + src))
    document.head.appendChild(el)
  })
}

async function loadEngine() {
  const failures = []
  for (const url of ENGINE_ESM) {
    const host = url.split('/')[2]
    try {
      const mod = await import(url)
      const fn = mod && mod.initWidget
      if (fn) {
        return { init: (cfg) => fn(cfg), npm: NPM_BASE[host] || NPM_BASE['fastly.jsdelivr.net'], gh: GH_BASE[host] || GH_BASE['fastly.jsdelivr.net'] }
      }
      failures.push('esm:' + host + '(no export)')
    } catch (e) {
      failures.push('esm:' + host)
    }
  }
  for (const url of ENGINE_MODULE) {
    const host = url.split('/')[2]
    try {
      await loadModuleScript(url)
      const fn = window.initWidget
      if (typeof fn === 'function') {
        return { init: (cfg) => fn(cfg), npm: NPM_BASE[host] || NPM_BASE['fastly.jsdelivr.net'], gh: GH_BASE[host] || GH_BASE['fastly.jsdelivr.net'] }
      }
      failures.push('module:' + host + '(no global)')
    } catch (e) {
      failures.push('module:' + host)
    }
  }
  throw new Error('引擎不可用 [' + failures.join(' | ') + ']')
}

function cleanupWidgetDom() {
  try {
    const w = document.getElementById('waifu')
    if (w && w.remove) w.remove()
    const t = document.getElementById('waifu-toggle')
    if (t && t.remove) t.remove()
  } catch (e) { /* ignore */ }
}

function setWidgetVisible(visible) {
  try {
    const w = document.getElementById('waifu')
    if (w) {
      if (visible) {
        w.classList.remove('waifu-hidden')
        w.classList.add('waifu-active')
      } else {
        w.classList.add('waifu-hidden')
      }
    }
    const t = document.getElementById('waifu-toggle')
    if (t) t.style.display = visible ? '' : 'none'
  } catch (e) { /* ignore */ }
}

function mountWidget(engine) {
  try {
    localStorage.removeItem('waifu-disabled')
    localStorage.removeItem('waifu-display')
    localStorage.removeItem('waifu-message-priority')
  } catch (e) { /* ignore */ }
  const dist = engine.npm + 'live2d-widgets@1.0.1/dist/'
  engine.init({
    waifuPath: dist + 'waifu-tips.json',
    cdnPath: engine.gh + 'fghrsh/live2d_api/',
    cubism2Path: dist + 'live2d.min.js',
    cubism5Path: CUBISM5_CORE,
    modelId: 0,
    drag: true,
    showToggleAfterQuit: true,
    logLevel: 'warn',
  })
}

const CSS = [
  '.dsh-anime-petals{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:9999}',
  '.dsh-anime-petal{position:absolute;top:-32px;width:14px;height:14px;background:linear-gradient(135deg,#ffd9e4 0%,#ff9db8 55%,#ff7fa3 100%);border-radius:150% 0 150% 0;opacity:0;animation:dsh-anime-fall var(--dur,11s) linear var(--delay,0s) infinite;will-change:transform,opacity}',
  '.dsh-anime-petal:nth-child(1){left:6%;--dur:12s;--delay:0s;--sway:46px;--scale:.8;--op:.8;--spin:320deg}',
  '.dsh-anime-petal:nth-child(2){left:22%;--dur:15s;--delay:2.4s;--sway:-38px;--scale:.65;--op:.7;--spin:-260deg}',
  '.dsh-anime-petal:nth-child(3){left:38%;--dur:11s;--delay:5.1s;--sway:30px;--scale:.9;--op:.85;--spin:280deg}',
  '.dsh-anime-petal:nth-child(4){left:55%;--dur:14s;--delay:1.2s;--sway:-52px;--scale:.7;--op:.75;--spin:-300deg}',
  '.dsh-anime-petal:nth-child(5){left:71%;--dur:12.5s;--delay:7.6s;--sway:34px;--scale:.85;--op:.8;--spin:340deg}',
  '.dsh-anime-petal:nth-child(6){left:88%;--dur:16s;--delay:3.9s;--sway:-42px;--scale:.6;--op:.7;--spin:-320deg}',
  '@keyframes dsh-anime-fall{0%{transform:translate3d(0,0,0) rotate(-45deg) scale(var(--scale,1));opacity:0}10%{opacity:var(--op,.8)}80%{opacity:var(--op,.8)}100%{transform:translate3d(var(--sway,30px),calc(100vh + 60px),0) rotate(calc(-45deg + var(--spin,300deg))) scale(var(--scale,1));opacity:0}}',
  '.dsh-anime-setting-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--dsw-alias-border-l2)}',
  '.dsh-anime-setting-copy{display:flex;flex-direction:column;min-width:0}',
  '.dsh-anime-setting-title{color:var(--dsw-alias-label-primary);font-size:14px;line-height:22px}',
  '.dsh-anime-setting-desc{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px;margin-top:2px}',
  '.dsh-anime-switch{position:relative;flex:none;width:36px;height:20px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);cursor:pointer;padding:0;transition:background .18s ease}',
  ".dsh-anime-switch[aria-checked='true']{background:var(--dsw-alias-brand-primary);border-color:var(--dsw-alias-brand-primary)}",
  '.dsh-anime-switch-knob{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .18s ease}',
  ".dsh-anime-switch[aria-checked='true'] .dsh-anime-switch-knob{transform:translateX(16px)}",
  '.dsh-anime-switch:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
  '.dsh-anime-select{flex:none;max-width:200px;height:28px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;padding:0 8px;cursor:pointer}',
  '.dsh-anime-select:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
  '.dsh-anime-retry{flex:none;height:26px;padding:0 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);font:inherit;font-size:12px;cursor:pointer}',
  '.dsh-anime-retry:hover{background:var(--dsw-alias-bg-layer-1)}',
  '.dsh-anime-retry:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px}',
  '.dsh-anime-link{flex:none;font-size:12px;line-height:20px;color:var(--dsw-alias-brand-primary);text-decoration:none}',
  '.dsh-anime-link:hover{text-decoration:underline}',
  '.dsh-anime-link:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:2px;border-radius:4px}',
  '#waifu-toggle{background-color:#fa0;border-radius:5px;bottom:66px;cursor:pointer;display:flex;justify-content:flex-end;right:0;margin-right:-100px;padding:5px;position:fixed;transition:margin-right 1s;width:60px;z-index:9991}',
  '#waifu-toggle.waifu-toggle-active{margin-right:-50px}',
  '#waifu-toggle.waifu-toggle-active:hover{margin-right:-30px}',
  '#waifu-toggle svg{fill:#fff;height:25px}',
  '#waifu{bottom:-500px;right:0;position:fixed;transform:translateY(25px);transition:transform .3s ease-in-out,bottom 3s ease-in-out;z-index:9990}',
  '#waifu.waifu-active{bottom:0}',
  '#waifu.waifu-hidden{display:none}',
  '#waifu:hover{transform:translateY(20px)}',
  '#waifu-tips{animation:waifu-shake 50s ease-in-out 5s infinite;background-color:rgba(236,217,188,.5);border:1px solid rgba(224,186,140,.62);border-radius:12px;box-shadow:0 3px 15px 2px rgba(191,158,118,.2);font-size:14px;line-height:24px;margin:-30px 20px;min-height:70px;opacity:0;overflow:hidden;padding:5px 10px;position:absolute;text-overflow:ellipsis;transition:opacity 1s;width:250px;word-break:break-all}',
  '#waifu-tips.waifu-tips-active{opacity:1;transition:opacity .2s}',
  '#waifu-tips span{color:#0099cc}',
  '#live2d{cursor:grab;height:240px;position:relative;width:240px}',
  '#live2d:active{cursor:grabbing}',
  '#waifu-tool{align-items:center;display:flex;flex-direction:column;gap:5px;opacity:0;position:absolute;left:-10px;top:70px;transition:opacity 1s}',
  '#waifu:hover #waifu-tool{opacity:1}',
  '#waifu-tool svg{cursor:pointer;display:block;fill:#7b8c9d;height:25px;transition:fill .3s}',
  '#waifu-tool svg:hover{fill:#0684bd}',
  '@keyframes waifu-shake{0%,100%{transform:translate(0,0) rotate(0)}10%{transform:translate(1px,-2px) rotate(-.5deg)}20%{transform:translate(1px,1px) rotate(1deg)}30%{transform:translate(2px,1px) rotate(.5deg)}40%{transform:translate(1px,2px) rotate(.5deg)}50%{transform:translate(-1px,1px) rotate(-.5deg)}60%{transform:translate(1px,-1px) rotate(.5deg)}70%{transform:translate(-1px,-1px) rotate(.5deg)}80%{transform:translate(-1px,0) rotate(-.5deg)}}',
  '@media (prefers-reduced-motion:reduce){.dsh-anime-petal{display:none}.dsh-anime-switch,.dsh-anime-switch-knob{transition:none}#waifu-tips{animation:none}}',
].join('\n')

// ================= react hooks / components =================
function usePetalsEnabled() {
  const [enabled, setEnabled] = React.useState(petalStore.isEnabled())
  React.useEffect(() => petalStore.subscribe(setEnabled), [])
  return enabled
}
function useLive2dState() {
  const [, force] = React.useState(0)
  React.useEffect(() => live2dStore.subscribe(() => force((n) => n + 1)), [])
  return live2dStore
}
function useThemeState() {
  const [, force] = React.useState(0)
  React.useEffect(() => themeStore.subscribe(() => force((n) => n + 1)), [])
  return themeStore
}

function PetalField() {
  const enabled = usePetalsEnabled()
  if (!enabled) return null
  const petals = []
  for (let i = 0; i < 6; i += 1) {
    petals.push(React.createElement('span', { key: i, className: 'dsh-anime-petal' }))
  }
  return React.createElement('div', { className: 'dsh-anime-petals', 'aria-hidden': 'true' }, petals)
}

function PetalToggleRow() {
  const enabled = usePetalsEnabled()
  return React.createElement('div', { className: 'dsh-anime-setting-row' }, [
    React.createElement('div', { key: 'copy', className: 'dsh-anime-setting-copy' }, [
      React.createElement('div', { key: 't', className: 'dsh-anime-setting-title' }, '樱花瓣飘落动画'),
      React.createElement('div', { key: 'd', className: 'dsh-anime-setting-desc' }, '二次元主题氛围效果：粉樱花瓣缓缓飘落（关闭后仅保留配色）'),
    ]),
    React.createElement('button', {
      key: 'sw', type: 'button', role: 'switch',
      'aria-checked': enabled,
      className: 'dsh-anime-switch',
      'aria-label': '樱花瓣飘落动画',
      onClick: () => petalStore.setEnabled(!enabled),
    }, React.createElement('span', { className: 'dsh-anime-switch-knob' })),
  ])
}

function PresetRow() {
  const store = useThemeState()
  const preset = store.getPreset()
  const options = Object.keys(PRESETS).map((id) =>
    React.createElement('option', { key: id, value: id }, PRESETS[id].label))
  return React.createElement('div', { className: 'dsh-anime-setting-row' }, [
    React.createElement('div', { key: 'copy', className: 'dsh-anime-setting-copy' }, [
      React.createElement('div', { key: 't', className: 'dsh-anime-setting-title' }, '主题预设'),
      React.createElement('div', { key: 'd', className: 'dsh-anime-setting-desc' }, '切换整套配色（亮/暗模式各有对应色，选择会记住）'),
    ]),
    React.createElement('select', {
      key: 'sel',
      className: 'dsh-anime-select',
      value: preset,
      'aria-label': '主题预设',
      onChange: (e) => store.setPreset(e.target.value),
    }, options),
  ])
}

function Live2dToggleRow() {
  const store = useLive2dState()
  const enabled = store.isEnabled()
  const status = store.getStatus()
  const message = store.getMessage()
  let desc
  if (status === 'loading') desc = '正在加载看板娘…'
  else if (status === 'ok') desc = '已显示（右下角，可拖动；悬停看板娘可换模型/换装）'
  else if (status === 'error') desc = '加载失败：' + message
  else desc = '二次元看板娘（右下角，可拖动）'
  return React.createElement('div', { className: 'dsh-anime-setting-row' }, [
    React.createElement('div', { key: 'copy', className: 'dsh-anime-setting-copy' }, [
      React.createElement('div', { key: 't', className: 'dsh-anime-setting-title' }, 'Live2D 看板娘'),
      React.createElement('div', { key: 'd', className: 'dsh-anime-setting-desc' }, desc),
    ]),
    status === 'error'
      ? React.createElement('button', {
          key: 'retry',
          type: 'button',
          className: 'dsh-anime-retry',
          onClick: () => store.retry(),
        }, '重试')
      : React.createElement('button', {
          key: 'sw', type: 'button', role: 'switch',
          'aria-checked': enabled,
          className: 'dsh-anime-switch',
          'aria-label': 'Live2D 看板娘',
          onClick: () => store.setEnabled(!enabled),
        }, React.createElement('span', { className: 'dsh-anime-switch-knob' })),
  ])
}

function SourcesRow() {
  return React.createElement('div', { className: 'dsh-anime-setting-row' }, [
    React.createElement('div', { key: 'copy', className: 'dsh-anime-setting-copy' }, [
      React.createElement('div', { key: 't', className: 'dsh-anime-setting-title' }, '来源与许可'),
      React.createElement('div', { key: 'd', className: 'dsh-anime-setting-desc' }, '引擎 live2d-widgets (GPL-3.0) · 模型 live2d-widget-model-* (GPL-2.0) 与 fghrsh/live2d_api（模型仅供学习、不得商用）· Cubism SDK 官方条款（发布需年销售额<1000万日元）· 一言 (Apache-2.0)。个人使用无碍，分发/商用请先取得授权。'),
    ]),
    React.createElement('a', {
      key: 'link',
      className: 'dsh-anime-link',
      href: 'https://github.com/stevenjoezhang/live2d-widget',
      target: '_blank',
      rel: 'noreferrer',
    }, '引擎源码'),
  ])
}

// ================= plugin =================
return {
  inject: ['timer'],
  apply(ctx) {
    const theme = ctx.get('theme')
    let disposeTokens = null
    const applyPreset = (id) => {
      if (theme === undefined) return
      const p = PRESETS[id] || PRESETS.sakura
      disposeTokens = theme.overrideTokens('anime-preset', buildTokens(p.palette))
    }
    applyPreset(themeStore.getPreset())
    ctx.effect(() => themeStore.subscribe(() => applyPreset(themeStore.getPreset())))
    ctx.effect(() => () => {
      if (disposeTokens) {
        try { disposeTokens() } catch (e) { /* ignore */ }
        disposeTokens = null
      }
    })
    ctx.effect(() => styles.insert(CSS))

    let widgetMounted = false
    let loadSeq = 0
    const onRejection = (event) => {
      if (!live2dStore.isEnabled()) return
      const reason = event && event.reason
      const detail = String((reason && (reason.message || reason)) || reason || 'unknown')
      console.error('[anime-live2d] widget rejection:', detail)
      live2dStore.setStatus('error', '看板娘初始化失败：' + detail)
    }
    const onError = (event) => {
      if (!live2dStore.isEnabled()) return
      const msg = event && event.message
      if (msg) console.error('[anime-live2d] window error:', msg)
    }
    window.addEventListener('unhandledrejection', onRejection)
    window.addEventListener('error', onError)
    ctx.effect(() => () => {
      window.removeEventListener('unhandledrejection', onRejection)
      window.removeEventListener('error', onError)
    })

    async function resync() {
      const seq = ++loadSeq
      cleanupWidgetDom()
      widgetMounted = false
      if (!live2dStore.isEnabled()) {
        live2dStore.setStatus('idle')
        return
      }
      live2dStore.setStatus('loading')
      try {
        const engine = await loadEngine()
        if (seq !== loadSeq) return
        mountWidget(engine)
        if (seq !== loadSeq) {
          cleanupWidgetDom()
          return
        }
        widgetMounted = true
        let waited = 0
        const poll = ctx.interval(() => {
          waited += 250
          if (document.getElementById('waifu-tool')) {
            poll()
            if (seq === loadSeq) live2dStore.setStatus('ok')
          } else if (document.getElementById('waifu')) {
            if (waited > 3000) {
              poll()
              if (seq === loadSeq) live2dStore.setStatus('error', '看板娘组件异常（容器已挂载但未完成初始化）')
            }
          } else if (waited >= 25000) {
            poll()
            if (seq === loadSeq) live2dStore.setStatus('error', '看板娘初始化超时（请检查网络后重试）')
          }
        }, 250)
      } catch (err) {
        if (seq !== loadSeq) return
        const detail = String((err && err.message) || err)
        console.error('[anime-live2d] load failed:', detail)
        live2dStore.setStatus('error', detail)
      }
    }
    let lastKey = live2dStore.key()
    ctx.effect(() => live2dStore.subscribe(() => {
      const k = live2dStore.key()
      if (k === lastKey) return
      lastKey = k
      if (!live2dStore.isEnabled()) {
        if (widgetMounted) setWidgetVisible(false)
        live2dStore.setStatus('idle')
        return
      }
      if (widgetMounted) {
        setWidgetVisible(true)
        live2dStore.setStatus('ok')
        return
      }
      resync()
    }))
    resync()
    ctx.effect(() => () => {
      cleanupWidgetDom()
      widgetMounted = false
    })

    const slots = ctx.get('slots')
    if (slots === undefined) return
    slots.inject('settings.general.item', () => slots.register(
      { name: 'settings.general.item', id: 'anime-preset', order: 29, label: '主题预设' },
      () => React.createElement(PresetRow),
    ))
    slots.inject('shell.overlay', () => slots.register(
      { name: 'shell.overlay', id: 'anime-sakura-petals', order: 90 },
      () => React.createElement(PetalField),
    ))
    slots.inject('settings.general.item', () => slots.register(
      { name: 'settings.general.item', id: 'anime-sakura-toggle', order: 30, label: '樱花瓣飘落动画' },
      () => React.createElement(PetalToggleRow),
    ))
    slots.inject('settings.general.item', () => slots.register(
      { name: 'settings.general.item', id: 'anime-live2d-toggle', order: 31, label: 'Live2D 看板娘' },
      () => React.createElement(Live2dToggleRow),
    ))
    slots.inject('settings.general.item', () => slots.register(
      { name: 'settings.general.item', id: 'anime-sources', order: 32, label: '来源与许可' },
      () => React.createElement(SourcesRow),
    ))
  },
}
