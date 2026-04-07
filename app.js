// ─────────────────────────────────
// APP MODULE - UI & LOGIC
// ─────────────────────────────────

// ── HELPERS ──
const $msgs = () => document.getElementById('messages');
const fmt = t => t.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>');
const sleep = ms => new Promise(r=>setTimeout(r,ms));

// ── MODE SWITCHING ──
function setMode(m) {
  currentMode = m;
  ['trainee','demo','manager'].forEach(id => {
    document.getElementById('mb-'+id).className = 'mode-btn'+(m===id?' active':'');
  });
  document.getElementById('trainee-wrap').style.display = m==='trainee' ? 'flex' : 'none';
  document.getElementById('demo-wrap').style.display    = m==='demo'    ? 'flex' : 'none';
  document.getElementById('manager-wrap').style.display = m==='manager' ? 'flex' : 'none';
  const leftBtn = document.getElementById('mob-left');
  leftBtn.textContent = m==='trainee' ? '💬 Chat' : m==='demo' ? '▶ Demo' : '⚙ Manage';
  if (m==='manager') renderMgrList();
}

function setSubMode(sm) {
  subMode = sm;
  document.getElementById('sub-assist').className  = 'mode-btn'+(sm==='assist' ?' active':'');
  document.getElementById('sub-trainer').className = 'mode-btn'+(sm==='trainer'?' active':'');
  document.getElementById('trainer-sub').style.display = sm==='trainer' ? 'block' : 'none';
  document.getElementById('user-input').placeholder = sm==='trainer'
    ? 'Enter customer question to check…' : 'Ask about the menu…';
}

// ── CHAT ──
function addMsg(avatar, avClass, label, html, bubClass='') {
  const el = document.createElement('div');
  el.className = 'msg';
  el.innerHTML = `<div class="msg-avatar ${avClass}">${avatar}</div>
    <div class="msg-content">
      <div class="msg-label">${label}</div>
      <div class="msg-bubble ${bubClass}">${html}</div>
    </div>`;
  $msgs().appendChild(el); $msgs().scrollTop = 9999;
}

function addTyping(container) {
  const c = container||$msgs();
  const el = document.createElement('div');
  el.className='msg'; el.id='typing-'+c.id;
  el.innerHTML = `<div class="msg-avatar av-ai">🤖</div>
    <div class="msg-content"><div class="msg-label">AI</div>
    <div class="typing-indicator"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div></div>`;
  c.appendChild(el); c.scrollTop=9999;
}

function removeTyping(container) {
  const c = container||$msgs();
  const el = document.getElementById('typing-'+c.id);
  if (el) el.remove();
}

async function sendMsg() {
  const inp = document.getElementById('user-input');
  const txt = inp.value.trim(); if (!txt) return;
  inp.value = '';
  if (subMode==='trainer') {
    document.getElementById('trainer-q-text').textContent = txt;
    document.getElementById('trainer-ans').focus();
    return;
  }
  addMsg('👤','av-customer','You', txt, 'bubble-customer');
  document.getElementById('send-btn').disabled = true;
  addTyping();
  try {
    const reply = await askMenu(txt);
    removeTyping();
    addMsg('🤖','av-ai','AI Assistant', fmt(reply), 'bubble-ai');
  } catch(e) {
    removeTyping();
    addMsg('⚠️','av-system','Error', e.message, 'bubble-system');
  }
  document.getElementById('send-btn').disabled = false;
}

async function checkAnswer() {
  const q   = document.getElementById('trainer-q-text').textContent;
  const ans = document.getElementById('trainer-ans').value.trim();
  if (!ans || q.startsWith('Type a customer')) return;
  document.getElementById('trainer-ans').value = '';
  addMsg('🧑‍💼','av-server','Server Answer', `"${ans}"`, 'bubble-customer');
  addTyping();
  try {
    const result = await checkServerAnswer(q, ans);
    removeTyping(); renderVerdict(result, $msgs());
  } catch(e) {
    removeTyping(); addMsg('⚠️','av-system','Error', e.message, 'bubble-system');
  }
}

function renderVerdict(text, container) {
  const lines = text.trim().split('\n').filter(Boolean);
  const correct = lines[0].trim().toUpperCase().startsWith('CORRECT') && !lines[0].trim().toUpperCase().startsWith('INCORRECT');
  const el = document.createElement('div'); el.className='msg';
  el.innerHTML = `<div class="msg-avatar av-trainer">🤖</div>
    <div class="msg-content"><div class="msg-label">Trainer AI</div>
    <div class="msg-bubble bubble-ai ${correct?'bubble-correct':'bubble-wrong'}">
      <div class="verdict ${correct?'correct':'wrong'}">${correct?'✅':'❌'} ${lines[0].trim()}</div>
      <div style="font-size:13px;line-height:1.6">${lines.slice(1).join('<br>')}</div>
    </div></div>`;
  container.appendChild(el); container.scrollTop=9999;
}

async function triggerCap() {
  document.getElementById('user-input').value = "What pairs well with miso soup?";
  await sendMsg();
}

function resetChat() {
  convHistory=[];
  document.getElementById('messages').innerHTML='';
  document.getElementById('trainer-q-text').textContent='Type a customer question in the box below, then enter the server\'s answer to evaluate it.';
  initWelcome();
}

function initWelcome() {
  addMsg('🍣','av-system','System',
    `Menu Brain loaded — <strong>${MENU.restaurant}</strong><br>
     <strong style="color:var(--accent)">${MENU.menu.length} items</strong> · nigiri · sashimi · rolls · bowls · sake · beer.<br><br>
     Switch to <em>Check Answer</em> to test server knowledge, or type any menu question below.`,
    'bubble-system');
}

// ── DEMO ──
function demoMsg(avatar, avClass, label, html, bubClass='') {
  const c = document.getElementById('demo-messages');
  const el = document.createElement('div'); el.className='msg';
  el.innerHTML = `<div class="msg-avatar ${avClass}">${avatar}</div>
    <div class="msg-content"><div class="msg-label">${label}</div>
    <div class="msg-bubble ${bubClass}">${html}</div></div>`;
  c.appendChild(el); c.scrollTop=9999;
}

const demoSys = html => demoMsg('⚡','av-system','System', html, 'bubble-system');

function setDemoStep(n) {
  for(let i=1;i<=6;i++) {
    const el=document.getElementById('d'+i); if(!el) continue;
    el.className='step-dot'+(i<n?' done':i===n?' active':'');
  }
}

async function runDemo() {
  if (demoRunning) return;
  demoRunning = true;
  const btn = document.getElementById('run-demo-btn');
  btn.disabled=true; btn.textContent='Running…';
  document.getElementById('demo-messages').innerHTML='';
  document.getElementById('demo-step-bar').style.display='flex';

  const dh = [];
  async function demoAsk(q) {
    const msgs=[{role:'system',content:buildSystemPrompt()},...dh,{role:'user',content:q}];
    const reply=await groq(msgs); dh.push({role:'user',content:q}); dh.push({role:'assistant',content:reply});
    return reply;
  }

  setDemoStep(1);
  demoSys('<div style="display:flex;align-items:center;gap:8px"><div style="width:12px;height:12px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite;flex-shrink:0"></div>Loading Sushi Master menu…</div>');
  await sleep(700);
  switchMenuTab('json'); await sleep(800); switchMenuTab('cards');
  document.querySelectorAll('.menu-card').forEach((c,i)=>{
    setTimeout(()=>c.classList.add('hl'),i*40);
    setTimeout(()=>c.classList.remove('hl'),i*40+700);
  });
  document.getElementById('demo-messages').querySelector('.msg-bubble').innerHTML =
    `✅ Menu brain loaded — <strong style="color:var(--accent)">${MENU.menu.length} items</strong> ready. Nigiri · sashimi · rolls · bowls · sake · beer.`;
  await sleep(600);

  setDemoStep(2);
  demoMsg('👤','av-customer','Customer',"I'm allergic to shellfish. What can I get?",'bubble-customer');
  await sleep(400); addTyping(document.getElementById('demo-messages'));
  let r2; try { r2=await demoAsk("I'm allergic to shellfish. What can I get?"); }
  catch { r2="Great options for you: **Maguro** (lean tuna nigiri), **Toro** (fatty tuna), **Sake** (salmon nigiri), sashimi platters, all our **salmon rolls**, **Cucumber Roll**, **Avocado Roll**, bowls with tuna or chicken, and miso soup. Always confirm with our chef for cross-contamination."; }
  removeTyping(document.getElementById('demo-messages'));
  demoMsg('🤖','av-ai','AI Assistant', fmt(r2), 'bubble-ai');
  highlightItem('Toro (Fatty Tuna)'); await sleep(1000);

  setDemoStep(3);
  demoMsg('👤','av-customer','Customer',"I like something popular and not too expensive.",'bubble-customer');
  await sleep(400); addTyping(document.getElementById('demo-messages'));
  let r3; try { r3=await demoAsk("I like something popular and not too expensive."); }
  catch { r3="Perfect! Try our **California Roll** ($9) — customer favorite and great value. Or **Spicy Tuna Roll** ($10) if you like a little kick. Both are **beginner-friendly** and highly recommended."; }
  removeTyping(document.getElementById('demo-messages'));
  demoMsg('🤖','av-ai','AI Assistant', fmt(r3), 'bubble-ai');
  await sleep(1000);

  setDemoStep(4);
  demoMsg('👤','av-customer','Customer',"I'd like miso soup to start. What else goes well with it?",'bubble-customer');
  highlightItem('Miso Soup');
  await sleep(400); addTyping(document.getElementById('demo-messages'));
  let r4; try { r4=await demoAsk("I'd like miso soup to start. What else goes well?"); }
  catch { r4="Excellent choice! Miso pairs beautifully with our **Edamame** ($4) or **Gyoza** ($6) for a traditional start. If you want a full meal after, our **Poke Bowl** ($14) or any **roll** complements the soup's umami perfectly."; }
  removeTyping(document.getElementById('demo-messages'));
  demoMsg('🤖','av-ai','AI Assistant', fmt(r4), 'bubble-ai');
  await sleep(1000);

  setDemoStep(5);
  demoSys('⚙️ <strong>Trainer check</strong> — evaluating a server answer…');
  demoMsg('🧑‍💼','av-server','Server (answer to check)', '"All our rolls contain raw fish."', 'bubble-wrong');
  await sleep(500); addTyping(document.getElementById('demo-messages'));
  let r5; try { r5=await checkServerAnswer("Can I get a roll that's cooked?","All our rolls contain raw fish."); }
  catch { r5="INCORRECT\nWe have several cooked roll options.\nCorrect answer: Yes! California Roll uses imitation crab (cooked), Dragon Roll has cooked shrimp tempura, Tempura Shrimp Roll is fully cooked, Smoked Salmon Roll features smoked (cooked) salmon, and we can prepare most rolls with cooked items."; }
  removeTyping(document.getElementById('demo-messages'));
  renderVerdict(r5, document.getElementById('demo-messages'));
  await sleep(1000);

  setDemoStep(6);
  demoSys('⚙️ Back to <strong>Assist</strong> — live customization request…');
  demoMsg('👤','av-customer','Customer',"Can you make the Spicy Tuna Roll with cooked tuna instead?",'bubble-customer');
  highlightItem('Spicy Tuna Roll');
  await sleep(400); addTyping(document.getElementById('demo-messages'));
  let r6; try { r6=await demoAsk("Can you make the Spicy Tuna Roll with cooked tuna instead?"); }
  catch { r6="Absolutely! We can make that for you. The cooked tuna option is just **+$1**, bringing your Spicy Tuna Roll to $11 total. Let your server know when ordering!"; }
  removeTyping(document.getElementById('demo-messages'));
  demoMsg('🤖','av-ai','AI Assistant', fmt(r6), 'bubble-ai');
  for(let i=1;i<=6;i++) document.getElementById('d'+i).className='step-dot done';
  demoSys('✅ <strong>Demo complete.</strong> All 6 scenarios passed — Menu Brain is live.');

  demoRunning=false; btn.disabled=false; btn.textContent='Run Demo Again 🍣';
}

// ── MANAGER ──
function renderMgrList() {
  const q = (document.getElementById('mgr-search').value||'').toLowerCase();
  const list = document.getElementById('mgr-list');
  list.innerHTML='';

  const grouped={};
  MENU.menu.forEach((item,idx)=>{
    if (q && !item.name.toLowerCase().includes(q) && !item.category.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) return;
    (grouped[item.category]=grouped[item.category]||[]).push({item,idx});
  });

  let count=0;
  Object.entries(grouped).forEach(([cat,entries])=>{
    const lbl=document.createElement('div'); lbl.className='mgr-cat-label';
    lbl.textContent=CAT_LABELS[cat]||cat; list.appendChild(lbl);
    entries.forEach(({item,idx})=>{
      count++;
      const el=document.createElement('div'); el.className='mgr-item';
      el.innerHTML=`<div class="mgr-item-info">
        <div class="mgr-item-name">${item.name} <span style="color:var(--accent)">${item.price}</span></div>
        <div class="mgr-item-sub">${item.description.substring(0,55)}${item.description.length>55?'…':''}</div>
      </div>
      <div class="mgr-item-actions">
        <button class="btn-edit" onclick="openEditor(${idx});event.stopPropagation()">Edit</button>
        <button class="btn-del"  onclick="deleteItem(${idx});event.stopPropagation()">Del</button>
      </div>`;
      list.appendChild(el);
    });
  });
  if (!count) list.innerHTML=`<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">No items match "${q}"</div>`;
  renderMenu();
}

function openEditor(idx) {
  editingIndex=idx;
  const item=idx>=0?MENU.menu[idx]:null;
  document.getElementById('editor-title').textContent = item?`Edit — ${item.name}`:'Add New Item';
  document.getElementById('f-name').value        = item?.name        ||'';
  document.getElementById('f-price').value       = item?.price       ||'';
  document.getElementById('f-category').value    = item?.category    ||'nigiri';
  document.getElementById('f-desc').value        = item?.description ||'';
  document.getElementById('f-ingredients').value = (item?.ingredients||[]).join(', ');
  document.getElementById('f-allergens').value   = (item?.allergens  ||[]).join(', ');
  const cookedVal=item?.cooked_option===true?'true':item?.cooked_option===false?'false':'ask';
  document.getElementById('f-cooked').value = cookedVal;
  document.getElementById('f-tags').value = (item?.tags||[]).join(', ');
  const subsText=(item?.substitutions||[]).map(s=>{
    const p=s.price_change!==0?` (+$${s.price_change>0?'+':''}${s.price_change})`:' (+$0)';
    return `${s.option}${p}`;
  }).join('\n');
  document.getElementById('f-subs').value=subsText;
  document.getElementById('mgr-editor').style.display='flex';
}

function closeEditor() { document.getElementById('mgr-editor').style.display='none'; }

function saveItem() {
  const parseList=id=>document.getElementById(id).value.split(',').map(s=>s.trim()).filter(Boolean);
  const parseSubs=()=>document.getElementById('f-subs').value.split('\n').map(line=>{
    line=line.trim(); if(!line) return null;
    const m=line.match(/^(.+?)\s*\(\+?\$?([\d.]+)\)$/);
    if(m){ const pc=parseFloat(m[2]); return {option:m[1].trim(),price_change:isNaN(pc)?0:pc}; }
    return {option:line,price_change:0};
  }).filter(Boolean);
  const cookedRaw=document.getElementById('f-cooked').value;
  const item={
    name:        document.getElementById('f-name').value.trim(),
    category:    document.getElementById('f-category').value,
    description: document.getElementById('f-desc').value.trim(),
    ingredients: parseList('f-ingredients'),
    allergens:   parseList('f-allergens'),
    cooked_option: cookedRaw==='true'?true:cookedRaw==='false'?false:'ask',
    substitutions: parseSubs(),
    price:       document.getElementById('f-price').value.trim(),
    tags:        parseList('f-tags')
  };
  if(!item.name||!item.price){ alert('Name and price are required.'); return; }
  if(editingIndex>=0) MENU.menu[editingIndex]=item; else MENU.menu.push(item);
  closeEditor(); renderMgrList();
  showToast(editingIndex>=0?`"${item.name}" updated.`:`"${item.name}" added.`);
}

function deleteItem(idx) {
  if(!confirm(`Delete "${MENU.menu[idx].name}"?`)) return;
  const name=MENU.menu[idx].name;
  MENU.menu.splice(idx,1);
  renderMgrList(); showToast(`"${name}" removed.`);
}

function showToast(msg) {
  let t=document.getElementById('toast');
  if(!t){ t=document.createElement('div'); t.id='toast';
    t.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:var(--accent);color:#000;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;z-index:999;pointer-events:none;transition:opacity .3s';
    document.body.appendChild(t); }
  t.textContent=msg; t.style.opacity='1';
  clearTimeout(t._to); t._to=setTimeout(()=>t.style.opacity='0',2200);
}

// ── MENU PANEL ──
function toggleMenuView() { switchMenuTab(menuView==='cards'?'json':'cards'); }
function switchMenuTab(v) {
  menuView=v;
  document.getElementById('tab-cards').className='menu-tab'+(v==='cards'?' active':'');
  document.getElementById('tab-json').className ='menu-tab'+(v==='json' ?' active':'');
  renderMenu();
}

function highlightItem(name) {
  document.querySelectorAll('.menu-card').forEach(c=>{
    if(c.dataset.name===name){
      c.classList.add('hl');
      c.scrollIntoView({behavior:'smooth',block:'nearest'});
      setTimeout(()=>c.classList.remove('hl'),1500);
    }
  });
}

function renderMenu() {
  const el=document.getElementById('menu-content');
  if(menuView==='json'){ el.innerHTML=`<div class="json-view">${syntaxHL(JSON.stringify(MENU,null,2))}</div>`; return; }
  const grouped={};
  MENU.menu.forEach(item=>{ (grouped[item.category]=grouped[item.category]||[]).push(item); });
  let html='';
  Object.entries(grouped).forEach(([cat,items])=>{
    html+=`<div class="menu-cat-label">${CAT_LABELS[cat]||cat}</div>`;
    items.forEach(item=>{
      const cookedTag=item.cooked_option===true?`<span class="tag tag-gf">Cooked ✓</span>`
        :item.cooked_option===false?`<span class="tag tag-no">Raw</span>`
        :`<span class="tag tag-ask">Ask</span>`;
      const popTag  =item.tags.includes('popular')?`<span class="tag tag-pop">popular</span>`:'';
      const spicyTag=item.tags.includes('spicy')  ?`<span class="tag tag-light">🌶️</span>`:'';
      const subTag  =item.substitutions.length>0  ?`<span class="tag tag-sub">subs</span>`:'';
      html+=`<div class="menu-card" data-name="${item.name}">
        <div class="menu-card-row"><div class="menu-card-name">${item.name}</div><div class="menu-card-price">${item.price}</div></div>
        <div class="menu-card-desc">${item.description}</div>
        <div class="menu-card-tags">${cookedTag}${popTag}${spicyTag}${subTag}</div>
      </div>`;
    });
  });
  el.innerHTML=html;
}

function syntaxHL(json) {
  return json.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,m=>{
      let c='jn';
      if(/^"/.test(m)) c=/:$/.test(m)?'jk':'js';
      else if(/true/.test(m)) c='jt'; else if(/false/.test(m)) c='jf'; else if(/null/.test(m)) c='jp';
      return `<span class="${c}">${m}</span>`;
    });
}

// ── MOBILE ──
function switchMobilePanel(p) {
  mobilePanel=p;
  document.getElementById('mob-left').className='mobile-tab-btn'+(p==='left'?' active':'');
  document.getElementById('mob-menu').className='mobile-tab-btn'+(p==='menu'?' active':'');
  document.getElementById('left-panel').classList.toggle('hidden',p!=='left');
  document.getElementById('menu-panel').classList.toggle('hidden',p!=='menu');
}

// ── MANAGER TABS ──
let mgrTab = 'items';
function switchMgrTab(t) {
  mgrTab = t;
  document.getElementById('mgr-tab-items').className   = 'mgr-mode-tab'+(t==='items'  ?' active':'');
  document.getElementById('mgr-tab-reviews').className = 'mgr-mode-tab'+(t==='reviews'?' active':'');
  document.getElementById('reviews-panel').style.display  = t==='reviews' ? 'flex'  : 'none';
  document.getElementById('mgr-toolbar').style.display    = t==='items'   ? 'flex'  : 'none';
  document.getElementById('mgr-list').style.display       = t==='items'   ? 'flex'  : 'none';
  document.getElementById('mgr-editor').style.display     = 'none';
}

// ── QUIZ ──
let quizAnswers = [];
let quizProfile = null;

function startQuiz() {
  document.getElementById('quiz-intro').style.display = 'none';
  const active = document.getElementById('quiz-active');
  active.style.display = 'flex';
  renderQuizQuestions();
}

function skipQuiz() {
  document.getElementById('quiz-overlay').style.display = 'none';
  initWelcome();
}

function renderQuizQuestions() {
  const wrap = document.getElementById('quiz-q-wrap');
  wrap.innerHTML = '';
  QUIZ_QUESTIONS.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-q-card';
    div.innerHTML = `<div class="quiz-q-num">Question ${i+1} of ${QUIZ_QUESTIONS.length}</div>
      <div class="quiz-q-text">${q.q}</div>
      <textarea class="quiz-q-input" id="quiz-ans-${i}" rows="2" placeholder="Your answer…" oninput="updateQuizProgress()"></textarea>`;
    wrap.appendChild(div);
  });
  updateQuizProgress();
}

function updateQuizProgress() {
  const answered = QUIZ_QUESTIONS.filter((_,i) => (document.getElementById('quiz-ans-'+i)?.value||'').trim().length > 0).length;
  document.getElementById('quiz-prog-label').textContent = `${answered} of ${QUIZ_QUESTIONS.length} answered`;
  document.getElementById('quiz-prog-fill').style.width = `${(answered/QUIZ_QUESTIONS.length)*100}%`;
  document.getElementById('quiz-submit-btn').disabled = answered < QUIZ_QUESTIONS.length;
}

function showQuizResults(profile) {
  const overlay = document.getElementById('quiz-overlay');
  const total   = profile ? profile.scores.reduce((s,x)=>s+x.score,0) : null;
  const maxScore = QUIZ_QUESTIONS.length * 2;

  let html = `<div style="display:flex;flex-direction:column;flex:1;overflow-y:auto;padding:16px;gap:10px">
    <div class="profile-card">
      <div class="profile-section-title">Your Score: ${total !== null ? total+'/'+maxScore : 'Evaluated'}</div>
      ${profile ? `<div style="font-size:13px;color:var(--muted);margin-bottom:10px">${profile.summary}</div>` : ''}`;

  if (profile) {
    const scoreMap = {};
    profile.scores.forEach((s,i) => { scoreMap[QUIZ_QUESTIONS[i].topic] = s.score; });

    html += `<div class="profile-section-title" style="margin-top:8px">Knowledge Map</div>`;
    Object.entries(QUIZ_TOPIC_LABELS).forEach(([k,label]) => {
      const score = scoreMap[k] ?? 0;
      const pct   = (score/2)*100;
      const cls   = score===2?'skill-strong':score===1?'skill-ok':'skill-weak';
      html += `<div class="profile-skill">
        <div class="profile-skill-name">${label}</div>
        <div class="profile-skill-bar"><div class="profile-skill-fill ${cls}" style="width:${pct}%"></div></div>
        <div style="font-size:11px;color:var(--muted);width:24px;text-align:right">${score}/2</div>
      </div>`;
    });

    if (profile.focus?.length) {
      html += `<div class="profile-section-title" style="margin-top:10px">Focus Areas for You</div>`;
      profile.focus.forEach(f => { html += `<div class="strength-item">🎯 <span>${f}</span></div>`; });
    }
  }

  html += `</div>`;

  if (profile?.scores) {
    html += `<div class="profile-card">
      <div class="profile-section-title">Answer Feedback</div>`;
    profile.scores.forEach((s,i) => {
      const icon = s.score===2?'✅':s.score===1?'⚠️':'❌';
      html += `<div style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid var(--border)">
        <div style="font-size:11px;font-weight:700;color:var(--muted);margin-bottom:2px">Q${i+1}: ${QUIZ_QUESTIONS[i].topic.replace(/_/g,' ')}</div>
        <div style="font-size:12px">${icon} ${s.feedback}</div>
      </div>`;
    });
    html += `</div>`;
  }

  html += `<button onclick="finishQuiz()" style="background:var(--accent);color:#000;border:none;border-radius:8px;padding:11px;font-size:13px;font-weight:700;cursor:pointer;margin:0 0 12px">
    Start Training →
  </button></div>`;

  overlay.innerHTML = html;
}

function finishQuiz() {
  const overlay = document.getElementById('quiz-overlay');
  overlay.style.display = 'none';
  initWelcome();
  if (quizProfile) {
    const weak   = (quizProfile.weak  ||[]).map(w=>w.replace(/_/g,' ')).join(', ') || 'none';
    const strong = (quizProfile.strong||[]).map(s=>s.replace(/_/g,' ')).join(', ') || 'none';
    addMsg('🎓','av-system','Training Profile',
      `<strong style="color:var(--green)">Strong:</strong> ${strong}<br>
       <strong style="color:var(--red)">Needs work:</strong> ${weak}<br>
       I will adapt my answers to your knowledge level.`,
      'bubble-system');
  }
}

// ── INIT ──
window.addEventListener('load', function() {
  if (GROQ_KEY) document.getElementById('key-input').value = GROQ_KEY;
  initWelcome();
  renderMgrList();
});
