// 상식 퀴즈 문항. 형식은 PRD.md 4.1, 작성 규칙은 PRD.md 4.2를 따른다.
// 정답은 choices[0]에 두고 answer: 0으로 적는다. 화면에서는 보기를 섞는다.
const QUESTIONS = [
  // ----- 한국사 -----
  {
    id: "kh-01",
    category: "한국사",
    question: "백성을 가르치는 바른 소리라는 뜻의 '훈민정음'을 창제한 조선의 왕은?",
    choices: ["세종", "태종", "세조", "성종"],
    answer: 0,
    explanation: "세종이 1443년에 훈민정음을 만들고 1446년에 반포했다.",
    source: { name: "한국민족문화대백과사전 「훈민정음」", url: "https://encykorea.aks.ac.kr/Article/E0065805" }
  },
  {
    id: "kh-02",
    category: "한국사",
    question: "당나라 군대를 몰아내고 676년에 삼국 통일을 마무리한 신라의 왕은?",
    choices: ["문무왕", "무열왕", "진흥왕", "법흥왕"],
    answer: 0,
    explanation: "문무왕은 나당전쟁에서 이겨 676년에 삼국 통일을 완성했다.",
    source: { name: "한국민족문화대백과사전 「문무왕」", url: "https://encykorea.aks.ac.kr/Article/E0019473" }
  },
  {
    id: "kh-03",
    category: "한국사",
    question: "1597년 명량 해전에서 적은 수의 배로 일본 수군을 물리친 조선의 장수는?",
    choices: ["이순신", "원균", "권율", "김시민"],
    answer: 0,
    explanation: "이순신이 울돌목(명량)의 거센 물살을 이용해 일본 수군을 크게 이겼다.",
    source: { name: "한국민족문화대백과사전 「명량대첩」", url: "https://encykorea.aks.ac.kr/Article/E0018250" }
  },
  {
    id: "kh-04",
    category: "한국사",
    question: "1377년 청주 흥덕사에서 금속활자로 찍었으며 프랑스 국립도서관에 있는 책은?",
    choices: ["직지심체요절", "삼국사기", "동의보감", "팔만대장경"],
    answer: 0,
    explanation: "『직지심체요절』 하권은 청주 흥덕사에서 금속활자로 찍은 책이다.",
    source: { name: "한국민족문화대백과사전 「백운화상초록불조직지심체요절」", url: "https://encykorea.aks.ac.kr/Article/E0022266" }
  },
  {
    id: "kh-05",
    category: "한국사",
    question: "조선 정조 때 수원에 쌓은 성곽으로, 세계유산에 등재된 곳은?",
    choices: ["화성", "남한산성", "북한산성", "행주산성"],
    answer: 0,
    explanation: "정조는 수원에 화성을 쌓았고, 화성은 1997년 세계유산이 되었다.",
    source: { name: "한국민족문화대백과사전 「수원 화성」", url: "https://encykorea.aks.ac.kr/Article/E0064671" }
  },
  {
    id: "kh-06",
    category: "한국사",
    question: "1919년 독립선언서를 발표하며 전국으로 퍼진 만세 운동은?",
    choices: ["3·1 운동", "6·10 만세 운동", "광주 학생 항일 운동", "물산 장려 운동"],
    answer: 0,
    explanation: "1919년 3월 1일 독립선언서 발표와 함께 전국에서 만세 시위가 일어났다.",
    source: { name: "한국민족문화대백과사전 「3·1운동」", url: "https://encykorea.aks.ac.kr/Article/E0026772" }
  },
  {
    id: "kh-07",
    category: "한국사",
    question: "1971년 발굴되어 묻힌 사람이 백제 무령왕임이 밝혀진 무덤이 있는 도시는?",
    choices: ["공주", "부여", "익산", "서울"],
    answer: 0,
    explanation: "무령왕릉은 공주에 있으며, 지석이 나와 무덤 주인이 밝혀졌다.",
    source: { name: "한국민족문화대백과사전 「무령왕릉」", url: "https://encykorea.aks.ac.kr/Article/E0019018" }
  },
  {
    id: "kh-08",
    category: "한국사",
    question: "경주에 있으며 다보탑과 석가탑이 서 있는 신라의 절은?",
    choices: ["불국사", "해인사", "통도사", "송광사"],
    answer: 0,
    explanation: "불국사 대웅전 앞마당에 다보탑과 석가탑(삼층석탑)이 마주 서 있다.",
    source: { name: "한국민족문화대백과사전 「경주 불국사」", url: "https://encykorea.aks.ac.kr/Article/E0024933" }
  },
  {
    id: "kh-09",
    category: "한국사",
    question: "1876년 조선이 일본과 맺어 부산 등 항구를 열게 된 조약은?",
    choices: ["강화도 조약", "제물포 조약", "을사조약", "톈진 조약"],
    answer: 0,
    explanation: "강화도 조약으로 조선은 부산 외 두 항구를 열고 개항하게 되었다.",
    source: { name: "한국민족문화대백과사전 「강화도조약」", url: "https://encykorea.aks.ac.kr/Article/E0001508" }
  },
  {
    id: "kh-10",
    category: "한국사",
    question: "조선 시대 한양에 두어 인재를 기르던 국립 최고 교육 기관은?",
    choices: ["성균관", "향교", "서원", "서당"],
    answer: 0,
    explanation: "성균관은 조선의 국립 최고 교육 기관으로 한양에 있었다.",
    source: { name: "한국민족문화대백과사전 「성균관」", url: "https://encykorea.aks.ac.kr/Article/E0029204" }
  }
];

if (typeof module !== "undefined") module.exports = QUESTIONS;
