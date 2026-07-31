(() => {
  'use strict';

  const { questions, results, metricLabels } = window.ROCK_DATA;
  const app = document.querySelector('#app');
  const topbar = document.querySelector('#topbar');
  const backButton = document.querySelector('#backButton');
  const homeButton = document.querySelector('#homeButton');
  const restartTopButton = document.querySelector('#restartTopButton');
  const progressBar = document.querySelector('.scroll-progress span');
  const saveOverlay = document.querySelector('#saveOverlay');
  const closeSaveOverlay = document.querySelector('#closeSaveOverlay');
  const shareImage = document.querySelector('#shareImage');
  const toast = document.querySelector('#toast');

  const state = {
    view: 'home',
    questionIndex: 0,
    answers: [],
    metrics: [50, 50, 50, 50],
    result: null,
    transitionLocked: false,
    timers: []
  };

  const shapePaths = {
    jug: 'M55 142 C45 89 77 42 137 35 C203 27 272 50 279 112 C286 174 250 218 183 222 C113 227 64 204 55 142 Z',
    sloper: 'M48 164 C46 111 77 72 126 52 C179 30 248 48 273 94 C298 139 281 191 229 211 C171 234 81 219 48 164 Z',
    crimp: 'M48 161 L77 88 Q84 68 106 63 L250 75 Q274 78 278 102 L270 167 Q266 193 239 197 L83 194 Q44 190 48 161 Z',
    pocket: 'M43 150 C40 95 81 53 139 43 C208 31 277 65 284 125 C291 187 239 220 169 221 C94 222 48 201 43 150 Z',
    pinch: 'M52 121 C72 67 115 47 157 68 C183 80 203 69 223 70 C266 71 286 109 271 148 C257 186 223 211 184 202 C153 195 132 211 102 202 C58 189 39 155 52 121 Z',
    edge: 'M43 164 L76 85 Q82 70 99 67 L263 86 Q282 89 276 109 L249 187 Q244 204 225 202 L67 190 Q36 187 43 164 Z',
    pin: 'M87 176 C60 139 73 83 119 58 C162 35 217 49 243 91 C267 130 255 182 219 207 C174 237 115 214 87 176 Z',
    undercling: 'M50 150 C54 111 89 91 139 83 L251 65 Q276 61 282 85 L274 147 Q271 170 249 177 L116 211 C77 219 45 190 50 150 Z',
    foothold: 'M63 173 C48 138 62 96 96 76 C137 52 209 62 247 91 C276 114 277 158 249 184 C218 213 160 217 112 205 C88 199 72 190 63 173 Z',
    volume: 'M42 187 L150 48 Q163 31 180 48 L284 186 Q299 208 270 211 L65 214 Q22 214 42 187 Z',
    rough: 'M49 150 C50 95 92 52 153 45 C221 37 279 75 281 132 C284 189 234 221 168 222 C99 223 48 202 49 150 Z',
    smooth: 'M47 151 C48 96 92 53 154 46 C222 38 278 75 280 132 C282 188 235 219 169 220 C101 222 47 201 47 151 Z',
    textured: 'M47 151 C48 96 92 53 154 46 C222 38 278 75 280 132 C282 188 235 219 169 220 C101 222 47 201 47 151 Z'
  };

  const metricColors = ['--accent', '--purple', '--blue', '--green'];

  function clearTimers() {
    state.timers.forEach((timer) => window.clearTimeout(timer));
    state.timers = [];
  }

  function schedule(callback, delay) {
    const timer = window.setTimeout(callback, delay);
    state.timers.push(timer);
    return timer;
  }

  function getResult(id) {
    return results.find((item) => item.id === id) || results[0];
  }

  function faceMarkup(face) {
    const common = 'fill="none" stroke="var(--border)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"';
    if (face === 'wink') {
      return `<path d="M126 126 Q140 113 154 126" ${common}/><circle cx="198" cy="123" r="7" fill="var(--border)"/><path d="M145 158 Q166 176 193 154" ${common}/>`;
    }
    if (face === 'stern') {
      return `<path d="M120 111 L148 118 M210 111 L182 118" ${common}/><circle cx="140" cy="129" r="7" fill="var(--border)"/><circle cx="190" cy="129" r="7" fill="var(--border)"/><path d="M148 164 Q166 153 187 164" ${common}/>`;
    }
    if (face === 'side') {
      return `<circle cx="145" cy="125" r="9" fill="var(--surface)" stroke="var(--border)" stroke-width="6"/><circle cx="198" cy="125" r="9" fill="var(--surface)" stroke="var(--border)" stroke-width="6"/><circle cx="149" cy="126" r="4" fill="var(--border)"/><circle cx="202" cy="126" r="4" fill="var(--border)"/><path d="M154 160 Q176 170 198 157" ${common}/>`;
    }
    if (face === 'peek') {
      return `<circle cx="139" cy="128" r="8" fill="var(--border)"/><circle cx="192" cy="128" r="8" fill="var(--border)"/><path d="M151 157 Q165 164 181 157" ${common}/>`;
    }
    if (face === 'grin') {
      return `<path d="M125 120 Q139 110 152 120 M181 120 Q195 110 208 120" ${common}/><path d="M139 152 Q166 184 202 149 Q171 165 139 152 Z" fill="var(--surface)" stroke="var(--border)" stroke-width="7"/>`;
    }
    if (face === 'soft') {
      return `<circle cx="142" cy="128" r="7" fill="var(--border)"/><circle cx="191" cy="128" r="7" fill="var(--border)"/><path d="M149 157 Q168 171 190 155" ${common}/><path d="M117 148 L100 153 M215 148 L231 153" ${common}/>`;
    }
    return `<circle cx="140" cy="124" r="8" fill="var(--border)"/><circle cx="193" cy="124" r="8" fill="var(--border)"/><path d="M141 154 Q166 180 201 151" ${common}/>`;
  }

  function textureMarkup(result) {
    if (result.shape === 'pocket') {
      return `<ellipse cx="165" cy="91" rx="36" ry="27" fill="var(--border)"/><ellipse cx="165" cy="95" rx="22" ry="14" fill="var(--surface)" opacity=".28"/>`;
    }
    if (result.shape === 'jug') {
      return `<path d="M111 93 C124 64 190 58 213 89 C226 107 211 120 193 111 C169 99 145 103 122 116 C105 126 99 111 111 93 Z" fill="var(--border)" opacity=".88"/>`;
    }
    if (result.shape === 'rough') {
      return `<g fill="var(--surface)" opacity=".45"><circle cx="92" cy="113" r="6"/><circle cx="116" cy="83" r="4"/><circle cx="220" cy="96" r="6"/><circle cx="244" cy="145" r="4"/><circle cx="105" cy="177" r="5"/><circle cx="208" cy="185" r="5"/></g>`;
    }
    if (result.shape === 'textured') {
      return `<g fill="none" stroke="var(--border)" stroke-width="5" opacity=".28"><path d="M73 123 Q115 91 146 103 T240 87"/><path d="M69 158 Q117 128 157 142 T255 124"/><path d="M90 189 Q132 164 178 175 T246 163"/></g>`;
    }
    if (result.shape === 'volume') {
      return `<path d="M161 62 L161 198 M58 195 L268 195" fill="none" stroke="var(--border)" stroke-width="5" opacity=".22"/>`;
    }
    return '';
  }

  function renderHold(result, className = '') {
    const path = shapePaths[result.shape] || shapePaths.smooth;
    const limb = 'fill="none" stroke="var(--border)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"';
    return `
      <svg class="${className}" viewBox="0 0 320 280" aria-hidden="true">
        <path d="M72 151 Q35 140 24 112 M258 141 Q292 122 304 91 M112 212 Q92 243 72 260 M215 210 Q233 241 257 252" ${limb}/>
        <circle cx="21" cy="108" r="9" fill="var(--surface)" stroke="var(--border)" stroke-width="7"/>
        <circle cx="304" cy="88" r="9" fill="var(--surface)" stroke="var(--border)" stroke-width="7"/>
        <path d="${path}" fill="var(${result.color})" stroke="var(--border)" stroke-width="8" stroke-linejoin="round"/>
        ${textureMarkup(result)}
        ${faceMarkup(result.face)}
      </svg>
    `;
  }

  function renderDoodle(index) {
    const colors = ['--accent', '--purple', '--blue', '--green', '--orange'];
    const color = colors[index % colors.length];
    return `
      <svg class="question-doodle" viewBox="0 0 90 70" aria-hidden="true">
        <path d="M12 42 C8 22 25 9 47 13 C70 16 84 34 75 50 C67 65 44 62 27 58 C17 56 14 50 12 42 Z" fill="var(${color})" stroke="var(--border)" stroke-width="5"/>
        <circle cx="37" cy="36" r="4" fill="var(--border)"/>
        <circle cx="56" cy="36" r="4" fill="var(--border)"/>
        <path d="M39 48 Q48 55 58 47" fill="none" stroke="var(--border)" stroke-width="4" stroke-linecap="round"/>
      </svg>
    `;
  }

  function updateTopbar() {
    const isQuiz = state.view === 'quiz';
    const isResult = state.view === 'result';
    backButton.hidden = !isQuiz;
    backButton.disabled = state.questionIndex === 0 || state.transitionLocked;
    restartTopButton.hidden = !isResult;
  }

  function focusApp() {
    window.scrollTo({ top: 0, behavior: 'instant' });
    app.focus({ preventScroll: true });
  }

  function renderHome() {
    clearTimers();
    state.view = 'home';
    state.transitionLocked = false;
    updateTopbar();
    const hero = getResult('sloper');
    const floatOne = getResult('pocket');
    const floatTwo = getResult('crimp');
    const floatThree = getResult('rough');

    app.innerHTML = `
      <section class="view hero">
        <div class="hero-copy">
          <span class="badge">13 种岩点人格 · 娱乐测试</span>
          <h1 class="hero-title"><span>测测你是</span><span class="title-accent">哪种岩点</span></h1>
          <p class="hero-lede">有些人看着很好抓，靠近才发现根本无处下手。<strong>15 道生活题</strong>，看看别人和你相处时究竟是什么手感。</p>
          <button class="button" id="startButton" type="button">开始上墙 <span aria-hidden="true">→</span></button>
          <div class="hero-meta"><span class="badge">约 2 分钟</span><span class="badge">无需登录</span><span class="badge">毒，但不乱骂</span></div>
        </div>
        <div class="hero-stage" aria-hidden="true">
          <div class="hero-wall"></div>
          ${renderHold(hero, 'hero-character')}
          ${renderHold(floatOne, 'floating-hold one')}
          ${renderHold(floatTwo, 'floating-hold two')}
          ${renderHold(floatThree, 'floating-hold three')}
          <p class="sticker-note">别只看长相<br />上手才知道</p>
        </div>
      </section>
      <span class="collage-shape star" aria-hidden="true"></span>
      <span class="collage-shape zig" aria-hidden="true"></span>
    `;

    document.querySelector('#startButton').addEventListener('click', (event) => {
      burst(event.currentTarget);
      startQuiz();
    });
    focusApp();
  }

  function startQuiz() {
    state.answers = [];
    state.questionIndex = 0;
    state.metrics = [50, 50, 50, 50];
    state.result = null;
    history.replaceState(null, '', `${location.pathname}${location.search}`);
    renderQuestion();
  }

  function renderQuestion(direction = 'forward') {
    clearTimers();
    state.view = 'quiz';
    state.transitionLocked = false;
    updateTopbar();
    const question = questions[state.questionIndex];
    const progress = Math.round(((state.questionIndex + 1) / questions.length) * 100);
    const selected = state.answers[state.questionIndex];

    app.innerHTML = `
      <section class="view quiz-view">
        <div class="quiz-header">
          <div class="quiz-progress-copy">
            <p class="eyebrow">不要想太久，第一反应最准</p>
            <span class="quiz-counter"><strong>${state.questionIndex + 1}</strong> / ${questions.length}</span>
          </div>
          <div class="progress-track" aria-label="测试进度 ${progress}%"><span style="width:${progress}%"></span></div>
        </div>
        <article class="question-card ${direction === 'back' ? 'is-entering' : 'is-entering'}">
          <div class="question-scene">
            <span class="badge">${question.scene}</span>
            ${renderDoodle(state.questionIndex)}
          </div>
          <h1 class="question-title">${question.title}</h1>
          <div class="answers">
            ${question.answers.map((answer, index) => `
              <button class="answer" type="button" data-answer="${index}" aria-pressed="${selected === index}">
                <span class="answer-letter">${String.fromCharCode(65 + index)}</span>
                <span>${answer.text}</span>
              </button>
            `).join('')}
          </div>
        </article>
      </section>
    `;

    document.querySelectorAll('.answer').forEach((button) => {
      button.addEventListener('click', () => selectAnswer(Number(button.dataset.answer), button));
    });
    focusApp();
  }

  function selectAnswer(answerIndex, button) {
    if (state.transitionLocked) return;
    state.transitionLocked = true;
    state.answers[state.questionIndex] = answerIndex;
    button.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('.answer').forEach((item) => { item.disabled = true; });
    burst(button, 5);
    const card = document.querySelector('.question-card');
    schedule(() => card.classList.add('is-leaving'), 130);
    schedule(() => {
      if (state.questionIndex < questions.length - 1) {
        state.questionIndex += 1;
        renderQuestion();
      } else {
        showLoading();
      }
    }, 390);
  }

  function calculateResult() {
    const totals = [50, 50, 50, 50];
    state.answers.forEach((answerIndex, questionIndex) => {
      const answer = questions[questionIndex].answers[answerIndex];
      answer.delta.forEach((value, metricIndex) => {
        totals[metricIndex] += value * 1.5;
      });
    });
    state.metrics = totals.map((value) => Math.max(6, Math.min(96, Math.round(value))));

    const ranked = results.map((result) => {
      const distance = result.prototype.reduce((sum, target, index) => {
        const weight = index === 1 ? 1.08 : 1;
        return sum + Math.pow((state.metrics[index] - target) * weight, 2);
      }, 0);
      return { result, distance };
    }).sort((a, b) => a.distance - b.distance);

    state.result = ranked[0].result;
  }

  function showLoading() {
    clearTimers();
    state.view = 'loading';
    updateTopbar();
    const loader = getResult('pinch');
    const messages = ['正在读取你的抓点…', '检查你是否真的好拿捏…', '测量表面与实际的摩擦差…', '找到最像你的那块岩点…'];

    app.innerHTML = `
      <section class="view loading-view">
        <div class="loading-card">
          ${renderHold(loader, 'loading-character')}
          <p class="eyebrow">正在分析你的相处手感</p>
          <h1 class="loading-title">先别急着对号入座</h1>
          <p class="loading-copy" id="loadingCopy">${messages[0]}</p>
          <div class="loading-dots" aria-hidden="true"><span></span><span></span><span></span></div>
        </div>
      </section>
    `;
    focusApp();

    messages.slice(1).forEach((message, index) => {
      schedule(() => {
        const copy = document.querySelector('#loadingCopy');
        if (copy) copy.textContent = message;
      }, 480 * (index + 1));
    });
    schedule(() => {
      calculateResult();
      renderResult();
    }, 2050);
  }

  function metricMarkup() {
    return metricLabels.map((label, index) => `
      <article class="metric">
        <div class="metric-head"><span class="metric-name">${label}</span><strong class="metric-value">${state.metrics[index]}%</strong></div>
        <div class="metric-track"><span data-width="${state.metrics[index]}" style="background:var(${metricColors[index]})"></span></div>
      </article>
    `).join('');
  }

  function resultSection(mark, title, body, wide = false) {
    return `
      <article class="result-section reveal ${wide ? 'wide' : ''}">
        <h2><span class="section-mark">${mark}</span>${title}</h2>
        <p>${body}</p>
      </article>
    `;
  }

  function renderResult(result = state.result) {
    clearTimers();
    state.view = 'result';
    state.result = result;
    updateTopbar();

    app.innerHTML = `
      <section class="view result-view" style="--result-color:var(${result.color});--result-accent:var(${result.accent})">
        <header class="result-hero">
          <div class="result-type">
            <span class="badge">你的岩点人格</span>
            <h1 class="result-title">你是${result.name}</h1>
            <p class="result-en">${result.english}</p>
            <p class="result-subtitle">${result.subtitle}</p>
            <p class="hold-intro">${result.holdIntro}</p>
          </div>
          <div class="result-character-wrap">
            ${renderHold(result, 'result-character')}
            <div class="result-tags">${result.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
          </div>
        </header>

        <section class="metrics reveal" aria-label="人格数值">${metricMarkup()}</section>

        <section class="result-grid">
          ${resultSection('01', '第一眼的你', result.first)}
          ${resultSection('02', '实际接触手感', result.actual)}
          ${resultSection('＋', '你的抓点', result.grip)}
          ${resultSection('－', '你的滑点', result.slip)}
          <article class="result-section wide reveal">
            <h2><span class="section-mark">👀</span>别人眼中的你</h2>
            <div class="voices">
              ${result.voices.map((voice) => {
                const [label, ...copy] = voice.split('：');
                return `<p class="voice"><strong>${label}</strong><span>${copy.join('：')}</span></p>`;
              }).join('')}
            </div>
          </article>
          ${resultSection('↗', '人类使用说明', result.manual, true)}
        </section>

        <section class="verdict reveal">
          <span class="eyebrow">你的攀岩人格判词</span>
          <p>${result.verdict}</p>
        </section>

        <div class="result-actions reveal">
          <button class="button" id="saveCardButton" type="button">保存结果卡</button>
          <button class="button purple" id="shareButton" type="button">发给朋友测</button>
          <button class="button secondary" id="restartButton" type="button">重新测试</button>
        </div>
        <p class="result-disclaimer">本测试只负责娱乐和互相吐槽，不构成任何心理学或医学判断。</p>
      </section>
    `;

    const hash = `#result=${result.id}&m=${state.metrics.join(',')}`;
    history.replaceState(null, '', `${location.pathname}${location.search}${hash}`);
    document.querySelector('#saveCardButton').addEventListener('click', saveCard);
    document.querySelector('#shareButton').addEventListener('click', shareResult);
    document.querySelector('#restartButton').addEventListener('click', startQuiz);
    focusApp();
    initReveal();
    schedule(() => {
      document.querySelectorAll('.metric-track span').forEach((bar) => {
        bar.style.width = `${bar.dataset.width}%`;
      });
    }, 180);
  }

  function initReveal() {
    const nodes = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('in-view'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
  }

  function burst(target, amount = 7) {
    const rect = target.getBoundingClientRect();
    const colors = ['--yellow', '--accent', '--purple', '--cyan', '--green'];
    for (let index = 0; index < amount; index += 1) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      particle.style.background = `var(${colors[index % colors.length]})`;
      particle.style.setProperty('--dx', `${(index - amount / 2) * 18 + (Math.random() * 18 - 9)}px`);
      particle.style.setProperty('--dy', `${-34 - Math.random() * 62}px`);
      particle.style.transform = `rotate(${index * 23}deg)`;
      document.body.appendChild(particle);
      window.setTimeout(() => particle.remove(), 560);
    }
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    window.setTimeout(() => toast.classList.remove('show'), 1900);
  }

  function getCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function roundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
    const chars = [...text];
    const lines = [];
    let current = '';
    chars.forEach((char) => {
      const test = current + char;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = char;
      } else {
        current = test;
      }
    });
    if (current) lines.push(current);
    lines.slice(0, maxLines).forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
    return y + Math.min(lines.length, maxLines) * lineHeight;
  }

  function drawHoldCanvas(ctx, result, x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = getCssVar('--border');
    ctx.lineWidth = 8;
    ctx.fillStyle = getCssVar(result.color);
    const path = new Path2D(shapePaths[result.shape] || shapePaths.smooth);
    ctx.fill(path);
    ctx.stroke(path);

    ctx.strokeStyle = getCssVar('--border');
    ctx.fillStyle = getCssVar('--border');
    ctx.lineWidth = 8;
    if (result.face === 'wink') {
      ctx.beginPath(); ctx.arc(140, 126, 13, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      ctx.beginPath(); ctx.arc(198, 124, 7, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(140, 125, 8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(193, 125, 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.beginPath();
    if (result.face === 'stern') ctx.arc(167, 177, 25, Math.PI * 1.18, Math.PI * 1.82);
    else ctx.arc(168, 145, 31, Math.PI * 0.18, Math.PI * 0.82);
    ctx.stroke();
    ctx.restore();
  }

  async function createShareCard() {
    if (document.fonts?.ready) await document.fonts.ready;
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const ctx = canvas.getContext('2d');
    const result = state.result;
    const bg = getCssVar('--bg');
    const surface = getCssVar('--surface');
    const border = getCssVar('--border');
    const yellow = getCssVar('--yellow');
    const accent = getCssVar(result.color);
    const purple = getCssVar('--purple');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = yellow;
    ctx.beginPath();
    ctx.arc(940, 170, 190, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 9;
    ctx.stroke();

    ctx.fillStyle = purple;
    ctx.save();
    ctx.translate(70, 1150);
    ctx.rotate(-0.16);
    ctx.fillRect(-90, 0, 420, 110);
    ctx.strokeRect(-90, 0, 420, 110);
    ctx.restore();

    roundedRect(ctx, 68, 72, 944, 1296, 52);
    ctx.fillStyle = surface;
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 9;
    ctx.stroke();

    roundedRect(ctx, 116, 118, 280, 58, 29);
    ctx.fillStyle = yellow;
    ctx.fill();
    ctx.strokeStyle = border;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = border;
    ctx.font = '900 27px Nunito, "Noto Sans SC", sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('岩点人格 · RESULT', 144, 148);

    drawHoldCanvas(ctx, result, 250, 160, 1.85);

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = border;
    ctx.font = '900 54px "Noto Sans SC", sans-serif';
    ctx.fillText('你是', 116, 720);

    ctx.fillStyle = accent;
    ctx.font = '900 112px "Noto Sans SC", sans-serif';
    ctx.fillText(result.name, 116, 842);

    ctx.fillStyle = border;
    ctx.font = '900 54px "Noto Sans SC", sans-serif';
    const subtitleBottom = wrapCanvasText(ctx, result.subtitle, 116, 932, 820, 76, 3);

    const tagY = subtitleBottom + 22;
    let tagX = 116;
    result.tags.forEach((tag, index) => {
      ctx.font = '800 28px "Noto Sans SC", sans-serif';
      const width = ctx.measureText(tag).width + 48;
      roundedRect(ctx, tagX, tagY, width, 54, 27);
      ctx.fillStyle = index === 1 ? getCssVar('--cyan') : yellow;
      ctx.fill();
      ctx.strokeStyle = border;
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.fillStyle = border;
      ctx.textBaseline = 'middle';
      ctx.fillText(tag, tagX + 24, tagY + 28);
      tagX += width + 14;
    });

    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = border;
    ctx.font = '900 34px "Noto Sans SC", sans-serif';
    ctx.fillText('不一定好抓，但一定有点东西。', 116, 1282);
    ctx.font = '800 25px Nunito, "Noto Sans SC", sans-serif';
    ctx.fillStyle = getCssVar('--text-tertiary');
    ctx.fillText('ROCK HOLD PERSONALITY · 15 QUESTIONS', 116, 1326);

    return canvas.toDataURL('image/png');
  }

  async function saveCard(event) {
    const button = event.currentTarget;
    burst(button);
    button.disabled = true;
    button.textContent = '正在生成…';
    try {
      const dataUrl = await createShareCard();
      shareImage.src = dataUrl;
      saveOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      closeSaveOverlay.focus();
    } catch (error) {
      console.error(error);
      showToast('结果卡生成失败，请先截图保存');
    } finally {
      button.disabled = false;
      button.textContent = '保存结果卡';
    }
  }

  async function shareResult() {
    const text = `我是${state.result.name}：${state.result.subtitle}。你是哪种岩点？`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '岩点人格', text, url: location.href });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${location.href}`);
      showToast('结果链接已复制，发给朋友吧');
    } catch {
      showToast('可以直接截图或复制浏览器地址分享');
    }
  }

  function loadHashResult() {
    const params = new URLSearchParams(location.hash.slice(1));
    const resultId = params.get('result');
    if (!resultId) return false;
    const result = results.find((item) => item.id === resultId);
    if (!result) return false;
    const hashMetrics = (params.get('m') || '').split(',').map(Number);
    state.metrics = hashMetrics.length === 4 && hashMetrics.every(Number.isFinite)
      ? hashMetrics.map((value) => Math.max(0, Math.min(100, value)))
      : result.prototype.slice();
    state.result = result;
    renderResult(result);
    return true;
  }

  backButton.addEventListener('click', () => {
    if (state.view !== 'quiz' || state.questionIndex === 0 || state.transitionLocked) return;
    state.answers.splice(state.questionIndex, 1);
    state.questionIndex -= 1;
    renderQuestion('back');
  });

  homeButton.addEventListener('click', renderHome);
  restartTopButton.addEventListener('click', startQuiz);

  closeSaveOverlay.addEventListener('click', () => {
    saveOverlay.hidden = true;
    document.body.style.overflow = '';
    document.querySelector('#saveCardButton')?.focus();
  });

  saveOverlay.addEventListener('click', (event) => {
    if (event.target !== saveOverlay) return;
    saveOverlay.hidden = true;
    document.body.style.overflow = '';
  });

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
    topbar.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  window.addEventListener('hashchange', () => {
    if (!location.hash) renderHome();
  });

  if (!loadHashResult()) renderHome();
})();
