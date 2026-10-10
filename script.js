"use strict";

// ===== 1. 상수 =====
const CATEGORIES = ["한국사", "세계지리", "과학", "예술과 문화"];
const CATEGORY_PREFIX = { "한국사": "kh", "세계지리": "wg", "과학": "sc", "예술과 문화": "ac" };
const QUESTIONS_PER_CATEGORY = 10;

// ===== 2. 순수 로직 =====

// Fisher–Yates 섞기. 원본은 그대로 두고 섞은 복사본을 돌려준다.
function shuffle(array, random = Math.random) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 카테고리의 문항을 섞어 한 판을 만든다. 보기 순서도 섞고 answer를 섞인 위치로 고친다.
function buildRound(questions, category, random = Math.random) {
  return prepareRound(questions.filter(q => q.category === category), random);
}

// 문항 순서와 보기 순서를 섞는다. 틀린 문제 다시 풀기에서도 쓴다.
function prepareRound(items, random = Math.random) {
  return shuffle(items, random).map(q => {
    const order = shuffle([0, 1, 2, 3], random);
    return {
      ...q,
      choices: order.map(i => q.choices[i]),
      answer: order.indexOf(q.answer)
    };
  });
}

// 맞히면 1점, 힌트를 쓰고 맞히면 0.5점, 틀리면 0점.
function scoreAnswer(isCorrect, usedHint) {
  if (!isCorrect) return 0;
  return usedHint ? 0.5 : 1;
}

// 힌트: 오답 번호 세 개 가운데 두 개를 무작위로 골라 돌려준다.
function pickHintRemovals(question, random = Math.random) {
  const wrong = [0, 1, 2, 3].filter(i => i !== question.answer);
  return shuffle(wrong, random).slice(0, 2);
}

// 한 판 기록에서 틀린(시간 초과 포함) 문항만 돌려준다.
function wrongQuestions(records) {
  return records.filter(r => !r.correct).map(r => r.question);
}

// 문항 데이터가 PRD 4.1·4.2 형식을 지키는지 검사하고 오류 문장 배열을 돌려준다.
function validateQuestions(questions) {
  if (!Array.isArray(questions)) return ["QUESTIONS가 배열이 아님"];
  const errors = [];
  const seen = new Set();

  questions.forEach((q, n) => {
    if (!q || typeof q !== "object") { errors.push(`${n + 1}번째 항목: 객체가 아님`); return; }
    const label = typeof q.id === "string" && q.id ? q.id : `${n + 1}번째 항목`;

    ["id", "category", "question", "explanation"].forEach(key => {
      if (typeof q[key] !== "string" || q[key].trim() === "") errors.push(`${label}: ${key} 없음`);
    });
    if (!CATEGORIES.includes(q.category)) {
      errors.push(`${label}: 알 수 없는 카테고리 "${q.category}"`);
    } else if (!new RegExp(`^${CATEGORY_PREFIX[q.category]}-\\d{2}$`).test(q.id)) {
      errors.push(`${label}: id가 ${CATEGORY_PREFIX[q.category]}-00 꼴이 아님`);
    }
    if (seen.has(q.id)) errors.push(`${label}: id 중복`);
    seen.add(q.id);

    if (!Array.isArray(q.choices) || q.choices.length !== 4) {
      errors.push(`${label}: 보기가 4개가 아님`);
    } else {
      if (q.choices.some(c => typeof c !== "string" || c.trim() === "")) errors.push(`${label}: 빈 보기`);
      if (new Set(q.choices).size !== 4) errors.push(`${label}: 보기 중복`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${label}: answer가 0~3이 아님`);

    const s = q.source;
    if (!s || typeof s.name !== "string" || s.name.trim() === "") errors.push(`${label}: 출처 이름 없음`);
    if (!s || typeof s.url !== "string" || !s.url.startsWith("https://")) errors.push(`${label}: 출처 링크가 https://로 시작하지 않음`);
  });

  CATEGORIES.forEach(category => {
    const count = questions.filter(q => q && q.category === category).length;
    if (count !== QUESTIONS_PER_CATEGORY) errors.push(`${category}: 문항 ${count}개 (${QUESTIONS_PER_CATEGORY}개여야 함)`);
  });
  return errors;
}

// ===== 3. 자체 점검 =====
// node script.js --test 또는 브라우저 주소 끝 ?test 로 실행한다.
function selfTest(questions) {
  let pass = 0;
  let fail = 0;
  function check(name, ok) {
    if (ok) { pass++; console.log("통과: " + name); }
    else { fail++; console.error("실패: " + name); }
  }

  const sample = [1, 2, 3, 4, 5, 6, 7, 8];
  const shuffled = shuffle(sample);
  check("shuffle은 같은 원소를 모두 담은 배열을 돌려준다",
    shuffled.length === sample.length && sample.every(x => shuffled.includes(x)));
  check("shuffle은 원본 배열을 바꾸지 않는다",
    sample.join(",") === "1,2,3,4,5,6,7,8");

  const fake = [];
  for (let i = 1; i <= 10; i++) {
    fake.push({ id: "kh-" + String(i).padStart(2, "0"), category: "한국사",
      question: "문제 " + i, choices: ["정답" + i, "오답A" + i, "오답B" + i, "오답C" + i], answer: 0 });
  }
  fake.push({ id: "wg-01", category: "세계지리", question: "다른 카테고리",
    choices: ["가", "나", "다", "라"], answer: 0 });
  const round = buildRound(fake, "한국사");
  check("buildRound는 고른 카테고리의 문항 10개로 한 판을 만든다",
    round.length === 10 && round.every(q => q.category === "한국사"));
  check("보기를 섞은 뒤에도 answer가 원래 정답 문장을 가리킨다",
    round.every(q => q.choices[q.answer] === "정답" + q.question.replace("문제 ", "")));
  check("scoreAnswer: 맞히면 1점", scoreAnswer(true, false) === 1);
  check("scoreAnswer: 틀리면 0점", scoreAnswer(false, false) === 0 && scoreAnswer(false, true) === 0);

  // 정상 데이터 40개를 만들어 하나씩 망가뜨려 본다.
  function goodSet() {
    const list = [];
    CATEGORIES.forEach(c => {
      for (let i = 1; i <= 10; i++) {
        list.push({ id: `${CATEGORY_PREFIX[c]}-${String(i).padStart(2, "0")}`, category: c,
          question: "문제", choices: ["가", "나", "다", "라"], answer: 0, explanation: "해설",
          source: { name: "출처", url: "https://example.org" } });
      }
    });
    return list;
  }
  const noChoice = goodSet(); noChoice[0].choices = ["가", "나", "다"];
  check("validateQuestions: 보기가 3개면 오류", validateQuestions(noChoice).some(e => e.includes("보기가 4개가 아님")));
  const dup = goodSet(); dup[0].choices = ["가", "가", "다", "라"];
  check("validateQuestions: 보기가 중복되면 오류", validateQuestions(dup).some(e => e.includes("보기 중복")));
  const http = goodSet(); http[0].source.url = "http://example.org";
  check("validateQuestions: 출처가 http면 오류", validateQuestions(http).some(e => e.includes("https")));
  const short = goodSet(); short.pop();
  check("validateQuestions: 카테고리 문항 수가 10이 아니면 오류", validateQuestions(short).some(e => e.includes("10개여야 함")));

  check("scoreAnswer: 힌트를 쓰고 맞히면 0.5점", scoreAnswer(true, true) === 0.5);
  const hintQ = { choices: ["가", "나", "다", "라"], answer: 2 };
  let hintOk = true;
  for (let t = 0; t < 50; t++) {
    const removed = pickHintRemovals(hintQ);
    if (removed.length !== 2 || removed[0] === removed[1] || removed.includes(hintQ.answer)) hintOk = false;
  }
  check("pickHintRemovals: 서로 다른 오답 두 개만 고른다", hintOk);
  const recs = [
    { question: { id: "a" }, correct: true },
    { question: { id: "b" }, correct: false },
    { question: { id: "c" }, correct: false, timedOut: true }
  ];
  check("wrongQuestions: 틀린 문항(시간 초과 포함)만 돌려준다",
    wrongQuestions(recs).map(q => q.id).join() === "b,c");

  const realErrors = validateQuestions(questions);
  realErrors.forEach(e => console.error("  문항 오류: " + e));
  check("실제 문항 데이터가 형식 검사를 통과한다", realErrors.length === 0);
  check("모든 해설이 80자 이하다",
    Array.isArray(questions) && questions.length > 0 && questions.every(q => q.explanation.length <= 80));

  console.log(`자체 점검 결과: 통과 ${pass}, 실패 ${fail}`);
  return { pass, fail };
}

// ===== 4. 상태와 화면 조작 (브라우저에서만) =====
const MODE_LABELS = { practice: "연습", speed: "스피드", hint: "힌트" };
const MODE_RULES = {
  practice: "시간 제한 없음 · 틀린 문제 다시 풀기 · 순위표에 기록되지 않음",
  speed: "문항마다 15초 · 맞히면 1점",
  hint: "문항마다 오답 2개 지우기 1번 · 힌트 쓰고 맞히면 0.5점"
};
const state = {
  category: null,
  mode: "practice",
  round: [],
  index: 0,
  score: 0,
  records: [],   // { question, chosen, correct, points, usedHint, timedOut }
  answered: false,
  usedHint: false,
  retry: false,       // 틀린 문제 다시 풀기 중인가(채점 안 함)
  firstScore: 0,      // 처음 판의 점수. 다시 풀기를 해도 바뀌지 않는다
  firstTotal: 0,
  timerId: null,
  timeLeft: 0
};
const TIME_LIMIT = 15;

// 타이머는 언제나 하나만 돈다. 새로 시작하기 전과 화면을 떠날 때 반드시 멈춘다.
function stopTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function renderTimer() {
  const el = $("quiz-timer");
  el.textContent = `남은 시간 ${state.timeLeft}초`;
  el.classList.toggle("urgent", state.timeLeft <= 5);
}

function startTimer() {
  stopTimer();
  state.timeLeft = TIME_LIMIT;
  renderTimer();
  state.timerId = setInterval(() => {
    state.timeLeft--;
    renderTimer();
    if (state.timeLeft <= 0) {
      stopTimer();
      answer(null);          // 시간 초과
    }
  }, 1000);
}

function $(id) { return document.getElementById(id); }

function showScreen(name) {
  if (name !== "quiz") stopTimer();
  ["start", "mode", "quiz", "result"].forEach(s => { $("screen-" + s).hidden = s !== name; });
  window.scrollTo(0, 0);
}

function formatScore(n) { return Number.isInteger(n) ? String(n) : n.toFixed(1); }

function renderStart() {
  const box = $("category-buttons");
  box.innerHTML = "";
  const errors = validateQuestions(typeof QUESTIONS !== "undefined" ? QUESTIONS : null);
  CATEGORIES.forEach(category => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category;
    btn.disabled = errors.length > 0;
    btn.addEventListener("click", () => renderModeSelect(category));
    box.appendChild(btn);
  });
  if (errors.length > 0) {
    $("data-error").hidden = false;
    $("data-error").textContent = "문항 데이터 오류: " + errors[0];
    console.error(errors);
  }
  showScreen("start");
}

function renderModeSelect(category) {
  state.category = category;
  $("mode-title").textContent = `${category} · 모드를 고르세요`;
  const box = $("mode-buttons");
  box.innerHTML = "";
  ["practice", "speed", "hint"].forEach(mode => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mode-button";
    const name = document.createElement("strong");
    name.textContent = MODE_LABELS[mode];
    const rule = document.createElement("span");
    rule.className = "rule";
    rule.textContent = MODE_RULES[mode];
    btn.append(name, rule);
    btn.addEventListener("click", () => startRound(category, mode));
    box.appendChild(btn);
  });
  showScreen("mode");
}

function startRound(category, mode) {
  state.category = category;
  state.mode = mode;
  state.round = buildRound(QUESTIONS, category);
  state.retry = false;
  state.index = 0;
  state.score = 0;
  state.records = [];
  renderQuestion();
  showScreen("quiz");
}

// 연습 모드에서 방금 판에 틀린 문항만 다시 낸다. 채점하지 않는다.
function startRetry() {
  const wrong = wrongQuestions(state.records);
  if (wrong.length === 0) return;
  state.round = prepareRound(wrong);
  state.retry = true;
  state.index = 0;
  state.records = [];
  renderQuestion();
  showScreen("quiz");
}

function renderQuestion() {
  const q = state.round[state.index];
  state.answered = false;
  $("quiz-title").textContent = state.retry
    ? `${state.category} · 다시 풀기 · 채점 안 함`
    : `${state.category} · ${MODE_LABELS[state.mode]}`;
  $("quiz-progress").textContent = `${state.index + 1} / ${state.round.length}`;
  $("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
  $("quiz-score").hidden = state.retry;
  $("quiz-question").textContent = q.question;

  const box = $("quiz-choices");
  box.innerHTML = "";
  q.choices.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "choice";
    btn.textContent = text;
    btn.addEventListener("click", () => answer(i));
    box.appendChild(btn);
  });
  $("quiz-feedback").hidden = true;

  // 힌트는 문항마다 한 번. 새 문항에서 다시 쓸 수 있다.
  state.usedHint = false;
  const hint = $("hint-button");
  hint.hidden = state.mode !== "hint";
  hint.disabled = false;
  hint.textContent = "힌트 (오답 2개 지우기)";

  $("quiz-timer").hidden = state.mode !== "speed";
  if (state.mode === "speed") startTimer();
  else stopTimer();
}

function useHint() {
  if (state.answered || state.usedHint) return;
  state.usedHint = true;
  const q = state.round[state.index];
  const buttons = $("quiz-choices").children;
  pickHintRemovals(q).forEach(i => {
    buttons[i].classList.add("removed");
    buttons[i].disabled = true;
  });
  const hint = $("hint-button");
  hint.textContent = "힌트 사용함";
  hint.disabled = true;
}

function answer(chosen) {
  if (state.answered) return;          // 답을 고른 뒤에는 아무 변화 없음
  state.answered = true;
  stopTimer();                         // 답을 고르거나 시간이 다 되면 그 자리에서 멈춤
  const q = state.round[state.index];
  const timedOut = chosen === null;
  const correct = !timedOut && chosen === q.answer;
  const points = state.retry ? 0 : scoreAnswer(correct, state.usedHint);
  state.score += points;
  state.records.push({ question: q, chosen, correct, points, usedHint: state.usedHint, timedOut });
  $("hint-button").disabled = true;

  const buttons = $("quiz-choices").children;
  Array.from(buttons).forEach((btn, i) => {
    if (i === q.answer) btn.classList.add("correct");
    else if (i === chosen) btn.classList.add("wrong");
  });

  const verdict = $("feedback-verdict");
  verdict.textContent = correct ? "정답!" : (timedOut ? "시간 초과" : "오답");
  verdict.className = "verdict " + (correct ? "ok" : "bad");
  $("feedback-explanation").textContent = q.explanation;
  $("feedback-source").textContent = q.source.name;
  $("feedback-source").href = q.source.url;
  $("next-button").textContent = state.index === state.round.length - 1 ? "결과 보기" : "다음";
  $("quiz-score").textContent = `점수 ${formatScore(state.score)}`;
  $("quiz-feedback").hidden = false;
}

function next() {
  if (state.index < state.round.length - 1) {
    state.index++;
    renderQuestion();
  } else {
    renderResult();
  }
}

function renderResult() {
  if (!state.retry) {
    state.firstScore = state.score;
    state.firstTotal = state.round.length;
  }
  const right = state.records.filter(r => r.correct).length;
  $("result-title").textContent = state.retry
    ? `${state.category} · ${MODE_LABELS[state.mode]} · 다시 풀기 결과`
    : `${state.category} · ${MODE_LABELS[state.mode]}`;
  // 다시 풀기를 해도 처음 판의 점수를 그대로 보여 준다.
  $("result-score").textContent = `${formatScore(state.firstScore)} / ${state.firstTotal}`;
  $("result-note").textContent = state.retry
    ? `다시 풀기 ${state.records.length}문항 중 ${right}문항 맞힘 · 채점 안 함 · 순위표에 기록되지 않음`
    : "순위표에 기록되지 않음";
  $("result-note").hidden = state.mode !== "practice";
  $("retry-button").hidden = !(state.mode === "practice" && wrongQuestions(state.records).length > 0);

  const list = $("result-list");
  list.innerHTML = "";
  state.records.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r.question.question;
    const tag = document.createElement("span");
    tag.className = "tag " + (r.correct ? "ok" : "bad");
    const right = r.question.choices[r.question.answer];
    if (r.correct && r.usedHint) tag.textContent = `정답 (힌트 0.5점): ${right}`;
    else if (r.correct) tag.textContent = `정답: ${right}`;
    else if (r.timedOut) tag.textContent = `시간 초과 → 정답 ${right}`;
    else tag.textContent = `오답: ${r.question.choices[r.chosen]} → 정답 ${right}`;
    li.appendChild(tag);
    list.appendChild(li);
  });
  showScreen("result");
}

function initApp() {
  $("next-button").addEventListener("click", next);
  $("again-button").addEventListener("click", () => startRound(state.category, state.mode));
  $("home-button").addEventListener("click", renderStart);
  $("back-button").addEventListener("click", renderStart);
  $("hint-button").addEventListener("click", useHint);
  $("retry-button").addEventListener("click", startRetry);
  renderStart();
  if (new URLSearchParams(location.search).has("test")) selfTest(QUESTIONS);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initApp);
}

// ===== 5. Node.js 실행 =====
if (typeof module !== "undefined" && typeof require !== "undefined" && require.main === module) {
  // Node.js에서 직접 실행할 때
  let questions = [];
  try { questions = require("./questions.js"); } catch (e) { /* 문항 파일이 아직 없을 수 있음 */ }
  const result = selfTest(questions);
  process.exitCode = result.fail === 0 ? 0 : 1;
}
