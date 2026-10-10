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
  const items = questions.filter(q => q.category === category);
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

  console.log(`자체 점검 결과: 통과 ${pass}, 실패 ${fail}`);
  return { pass, fail };
}

// ===== 4. 실행 =====
if (typeof module !== "undefined" && typeof require !== "undefined" && require.main === module) {
  // Node.js에서 직접 실행할 때
  let questions = [];
  try { questions = require("./questions.js"); } catch (e) { /* 문항 파일이 아직 없을 수 있음 */ }
  const result = selfTest(questions);
  process.exitCode = result.fail === 0 ? 0 : 1;
}
