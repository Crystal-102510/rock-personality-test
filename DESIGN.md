# DESIGN.md

> 把一面多巴胺攀岩墙折成一张会吐槽人的人格测试卡。

## 1. Visual Theme & Atmosphere

**Style**: Dopamine Flat Collage / 多巴胺扁平拼贴  
**Keywords**: 高饱和、拟人岩点、贴纸拼贴、不规则几何、运动感、毒舌、轻松、可分享  
**Tone**: 俏皮、直接、带一点坏笑 — NOT 心理诊断、幼儿卡通、橙白科普海报、健身品牌硬核风  
**Feel**: 像一家攀岩馆把所有彩色岩点、贴纸和便签撕下来，拼成一台会读心的测试机。

**Interaction Tier**: L2 流畅交互  
**Dependencies**: CSS + 原生 JavaScript；不引入运行时框架或重型动画库。

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds */
  --bg: #fff7de;
  --surface: #fffdf6;
  --surface-alt: #efe8ff;
  --surface-hover: #fff3b0;

  /* Borders */
  --border: #17152b;
  --border-soft: #d9d0b9;
  --border-hover: #5f3df5;

  /* Text */
  --text: #17152b;
  --text-secondary: #474159;
  --text-tertiary: #756e83;
  --text-on-dark: #fffdf6;

  /* Brand accents */
  --accent: #ff4f87;
  --accent-hover: #ec2f70;
  --purple: #6c4cff;
  --blue: #38bdf8;
  --cyan: #53e0d1;
  --yellow: #ffd84d;
  --orange: #ff8f3d;
  --green: #76d85b;
  --red: #ff615c;

  /* Hold palette */
  --hold-orange: #ff7a32;
  --hold-lilac: #a78bfa;
  --hold-yellow: #facc15;
  --hold-green: #65c466;
  --hold-pink: #ff5d8f;
  --hold-blue: #3aa8f5;
  --hold-red: #f05252;
  --hold-purple: #8b5cf6;
  --hold-black: #29273a;
  --hold-coral: #ff8a5b;
  --hold-moss: #66a95c;
  --hold-ice: #dceaf3;
  --hold-gold: #f6bd38;

  /* RGB variants */
  --bg-rgb: 255, 247, 222;
  --surface-rgb: 255, 253, 246;
  --accent-rgb: 255, 79, 135;
  --purple-rgb: 108, 76, 255;
  --text-rgb: 23, 21, 43;

  /* Semantic */
  --success: #2fa56f;
  --error: #d93854;
  --warning: #d58a00;
}
```

**Color Rules:**
- 所有界面颜色通过 CSS 变量引用，JavaScript 绘图也从计算样式读取变量。
- 每个主要岩点使用一个高饱和主色，阴影和面部统一使用全局文字色。
- 页面底色保持暖奶油色，让 13 种岩点色彩可同时存在而不刺眼。
- 正文只用深紫黑与次级灰紫；彩色不承担长段文字的可读性。

## 3. Typography Rules

**Font Stack:**
```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;600;700;800;900&family=Nunito:wght@700;800;900&display=swap');
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Noto Sans SC | clamp(3.3rem, 13vw, 6.8rem) | 900 | 0.96 | -0.06em |
| Section H2 | Noto Sans SC | clamp(1.7rem, 7vw, 2.7rem) | 900 | 1.12 | -0.035em |
| H3 | Noto Sans SC | 1.08rem | 800 | 1.35 | 0.01em |
| Body | Noto Sans SC | 1rem | 500 | 1.78 | 0.02em |
| Label | Nunito, Noto Sans SC | 0.75rem | 900 | 1.2 | 0.12em |
| Number | Nunito | 1rem | 900 | 1 | 0.02em |

**Typography Rules:**
- 中文标题使用紧凑字距和 900 粗度，正文保持至少 1.7 行高。
- 英文岩点名、进度数字和小标签使用 Nunito，形成圆润运动感。
- 每屏只有一个最高视觉层级，正文不使用彩色渐变。
- **NEVER use**: Times New Roman、默认宋体、细字重中文标题、仿手写正文。

**Text Decoration:**
- Hero H1 使用两段纯色切换和硬边错位投影，不使用正文渐变。
- Result H1 使用对应岩点主色的短横高亮，避免整段渐变降低可读性。
- Section H2 不使用投影，只用贴纸编号或短下划线装饰。

## 4. Component Stylings

### Buttons

```css
.button {
  min-height: 54px;
  border: 2px solid var(--border);
  border-radius: 999px;
  padding: 0.9rem 1.4rem;
  background: var(--accent);
  color: var(--text-on-dark);
  box-shadow: 4px 5px 0 var(--border);
  font: 800 1rem/1 'Noto Sans SC', sans-serif;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}
.button:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 5px 7px 0 var(--border); }
.button:active { transform: translate(3px, 4px); box-shadow: 1px 1px 0 var(--border); }
.button:focus-visible { outline: 3px solid var(--yellow); outline-offset: 3px; }
.button:disabled { background: var(--border-soft); color: var(--text-tertiary); box-shadow: none; cursor: not-allowed; }
```

### Cards

```css
.card {
  border: 2px solid var(--border);
  border-radius: 28px;
  background: var(--surface);
  box-shadow: 6px 7px 0 var(--border);
  transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms ease;
}
.card:hover { transform: translateY(-3px) rotate(-0.25deg); box-shadow: 8px 10px 0 var(--border); }
.card:focus-within { outline: 3px solid var(--purple); outline-offset: 4px; }
```

### Navigation

```css
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(var(--bg-rgb), .86);
  border-bottom: 1px solid transparent;
  transition: border-color 180ms ease, box-shadow 180ms ease;
}
.topbar.scrolled { border-bottom-color: var(--border); box-shadow: 0 3px 0 rgba(var(--text-rgb), .08); }
.topbar button:hover { transform: rotate(-2deg) scale(1.03); }
.topbar button:focus-visible { outline: 3px solid var(--purple); outline-offset: 3px; }
.topbar button:disabled { opacity: .45; }
```

### Links

```css
.link { color: var(--text); text-decoration-thickness: 2px; text-underline-offset: 4px; }
.link:hover { color: var(--purple); text-underline-offset: 7px; }
.link:focus-visible { outline: 3px solid var(--yellow); outline-offset: 3px; }
```

### Tags / Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  padding: .4rem .72rem;
  border: 2px solid var(--border);
  border-radius: 999px;
  background: var(--yellow);
  color: var(--text);
  font: 900 .75rem/1 Nunito, sans-serif;
  letter-spacing: .08em;
}
```

### Answer Options

```css
.answer {
  min-height: 58px;
  width: 100%;
  border: 2px solid var(--border);
  border-radius: 18px;
  background: var(--surface);
  color: var(--text);
  text-align: left;
  transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease;
}
.answer:hover { background: var(--surface-hover); transform: translateX(4px); }
.answer:active, .answer[aria-pressed='true'] { background: var(--yellow); transform: translate(3px, 3px); box-shadow: none; }
.answer:focus-visible { outline: 3px solid var(--purple); outline-offset: 3px; }
.answer:disabled { opacity: .55; cursor: wait; }
```

## 5. Layout Principles

**Container:**
- Max width: 1120px
- App/quiz narrow width: 720px
- Mobile padding: 18px；desktop padding: 32px

**Spacing Scale:**
- Full section padding: clamp(44px, 8vw, 96px)
- Component gap: 16px / 24px / 36px
- Card internal padding: clamp(20px, 5vw, 38px)

**Grid:**
```css
.result-grid { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(280px, .9fr); gap: 24px; }
.metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
```

首页采用“中间主角色 + 四周漂浮岩点贴纸”的不对称构图；答题页保持单列聚焦；结果页先身份卡，再进入两列信息区，移动端全部折叠为单列。

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | 无阴影，仅 2px 线框 | 小标签、进度轨道 |
| Sticker | 3px 4px 0 var(--border) | 小装饰、提示卡 |
| Card | 6px 7px 0 var(--border) | 题目卡、结果模块 |
| Hero | 10px 12px 0 var(--border) | 首页主岩点、分享卡预览 |

阴影只使用硬边错位，不使用大面积模糊阴影；这样维持扁平拼贴感，也减少手机 GPU 压力。

## 7. Animation & Interaction

**Motion Philosophy**: 岩点像贴纸一样弹入、眨眼、轻晃；所有大位移只发生一次，持续动画保持幅度小。  
**Tier**: L2

### Dependencies

```html
<!-- No external animation dependency. -->
```

### Entrance Animation

```css
@keyframes pop-in {
  from { opacity: 0; transform: translateY(22px) scale(.92) rotate(-2deg); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(0); }
}
.view.is-active > * { animation: pop-in 520ms cubic-bezier(.2,.9,.25,1.25) both; }
.view.is-active > *:nth-child(2) { animation-delay: 70ms; }
.view.is-active > *:nth-child(3) { animation-delay: 140ms; }
```

### Scroll Behavior

```js
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.14 });
document.querySelectorAll('.reveal').forEach((node) => observer.observe(node));
```

### Hover & Focus States

```css
button { -webkit-tap-highlight-color: transparent; }
button:hover { filter: saturate(1.04); }
button:focus-visible { outline: 3px solid var(--purple); outline-offset: 3px; }
```

### Special Effects
- Hero 标题分两段依次弹入。
- 四周岩点使用不同相位的轻浮动与偶发眨眼。
- 点击主按钮产生 6 个短命彩纸粒子。
- 题目切换使用向左退出、从右弹入的卡片转场。
- 加载页依次显示“读取抓点 / 检查摩擦力 / 判断是否好拿捏”。
- 结果身份卡 scale-in，信息块滚动 reveal；顶部细进度线随滚动变化。

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## 8. Do's and Don'ts

### Do
- 用岩点本身的轮廓、眼睛和肢体动作表达人格。
- 结果内容遵循“第一印象 → 真实手感 → 抓点 → 滑点 → 使用说明”的阅读节奏。
- 毒舌只针对相处方式，结尾必须补回一种值得认领的能力。
- 保证每个答题选项一屏内易读、单手可点。
- 分享卡与完整结果页分开设计，前者必须三秒内读完。
- 保持 13 个结果等质量、等概率可达。

### Don't
- ❌ 不复刻参考图的橙白科普宣传栏。
- ❌ 不使用恋爱经历、身材、原生家庭、精神疾病、职场能力或性取向作为毒舌素材。
- ❌ 不把真实心理诊断术语当作人格标签。
- ❌ 不用五颜六色的长段文字。
- ❌ 不用照片式岩点或写实攀岩馆背景。
- ❌ 不把所有装饰都做成圆形 blob；必须混用碎纸、箭头、星芒和岩点轮廓。
- ❌ 不让持续动画影响答题阅读或引发明显掉帧。
- ❌ 不隐藏返回、重测和保存结果卡入口。
- ❌ 不要求登录，不收集姓名、生日、学校、住址或其他安全问题式信息。
- ❌ 不让结果只有挖苦而没有可认领的优点。

## 9. Responsive Behavior

**Breakpoints:**

| Name | Width | Key Changes |
|------|-------|-------------|
| Desktop | > 900px | Hero 左文右角色；结果双列；分享卡旁置 |
| Tablet | 601–900px | Hero 上下布局；结果单列；装饰减少 25% |
| Mobile | ≤ 600px | 单列、全宽按钮、标题缩放、装饰避开文字、底部固定主 CTA |

**Touch Targets:** minimum 48 × 48px  
**Collapsing Strategy:** 所有双列信息块在移动端按阅读顺序折叠；装饰元素不参与文档流；长结果卡不横向滚动。

```css
@media (max-width: 600px) {
  .app-shell { width: 100%; padding-inline: 18px; }
  .result-grid, .metric-grid { grid-template-columns: 1fr; }
  .button { width: 100%; min-height: 56px; }
  .decor[data-mobile-hide='true'] { display: none; }
}
```
