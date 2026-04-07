// ─────────────────────────────────
// API MODULE - GROQ CALLS
// ─────────────────────────────────

async function groq(messages, temperature=0.4, maxTokens=300) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method:'POST',
    headers:{'Authorization':`Bearer ${GROQ_KEY}`,'Content-Type':'application/json'},
    body: JSON.stringify({ model:GROQ_MODEL, messages, temperature, max_tokens:maxTokens })
  });
  if (!r.ok) throw new Error(await r.text());
  return (await r.json()).choices[0].message.content;
}

async function askMenu(q) {
  const msgs = [{role:'system',content:buildSystemPrompt()},...convHistory,{role:'user',content:q}];
  const reply = await groq(msgs);
  convHistory.push({role:'user',content:q});
  convHistory.push({role:'assistant',content:reply});
  return reply;
}

async function checkServerAnswer(question, answer) {
  const p = `Customer asked: "${question}"\nServer answered: "${answer}"\n\nEvaluate against the menu. Reply:\n1. CORRECT or INCORRECT (first word on first line)\n2. One sentence why\n3. If incorrect: the correct answer in one sentence.\nNo preamble.`;
  return groq([{role:'system',content:buildSystemPrompt()},{role:'user',content:p}], 0.2, 200);
}

async function runReviewAnalysis() {
  const btn = document.getElementById('ai-analyze-btn');
  const out = document.getElementById('ai-analysis-output');
  btn.disabled = true; btn.textContent = '⏳ Analyzing…';
  out.style.display = 'none';

  try {
    const reply = await groq([
      { role:'system', content:'You are a restaurant operations consultant. Give concise, actionable advice.' },
      { role:'user',   content:`Based on Sushi Master's strong reputation (4.8★, 99% recommend, 624 reviews):\n\nGive me the top 3 most impactful things management should do THIS WEEK to improve the customer experience. Be specific and direct. Format as numbered list.` }
    ], 0.4, 400);

    out.innerHTML = `<div class="review-section" style="border-color:var(--accent)">
      <div class="review-section-title">✨ AI Recommendations</div>
      <div style="font-size:13px;line-height:1.7;white-space:pre-wrap">${fmt(reply)}</div>
    </div>`;
    out.style.display = 'block';
  } catch(e) {
    out.innerHTML = `<div class="review-section"><div style="color:var(--red);font-size:12px">Error: ${e.message}</div></div>`;
    out.style.display = 'block';
  }
  btn.disabled = false; btn.innerHTML = '✨ AI: What should we improve?';
}

async function submitQuiz() {
  const btn = document.getElementById('quiz-submit-btn');
  btn.disabled = true; btn.textContent = 'Evaluating…';

  quizAnswers = QUIZ_QUESTIONS.map((q,i) => ({
    question: q.q,
    topic: q.topic,
    answer: document.getElementById('quiz-ans-'+i).value.trim()
  }));

  const evalPrompt = `You are evaluating a sushi restaurant trainee's menu knowledge.
Menu context: ${JSON.stringify(MENU, null, 2)}

The trainee answered these 5 questions. For each, give a score (0=wrong, 1=partial, 2=correct) and one-line feedback.
Then give an overall profile: list their STRONG areas, WEAK areas, and 2 specific things to focus on.

Questions and answers:
${quizAnswers.map((a,i)=>`Q${i+1} [${a.topic}]: ${a.question}\nAnswer: ${a.answer}`).join('\n\n')}

Respond in this exact JSON format:
{
  "scores": [{"q":1,"score":0,"feedback":"..."},{"q":2,"score":1,"feedback":"..."},{"q":3,"score":2,"feedback":"..."},{"q":4,"score":0,"feedback":"..."},{"q":5,"score":1,"feedback":"..."}],
  "strong": ["topic1","topic2"],
  "weak": ["topic3","topic4"],
  "focus": ["specific thing 1","specific thing 2"],
  "summary": "One sentence overall assessment"
}`;

  let profile;
  try {
    const raw = await groq([
      { role:'system', content:'You are a training evaluator. Respond only with valid JSON.' },
      { role:'user', content: evalPrompt }
    ], 0.2, 600);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    profile = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch(e) {
    profile = null;
  }

  quizProfile = profile;
  showQuizResults(profile);
}
