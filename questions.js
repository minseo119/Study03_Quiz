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
  },

  // ----- 세계지리 -----
  {
    id: "wg-01",
    category: "세계지리",
    question: "나일강 하류에 자리한 이집트의 수도는?",
    choices: ["카이로", "알렉산드리아", "룩소르", "아스완"],
    answer: 0,
    explanation: "카이로는 나일강 삼각주 남쪽 끝에 있는 이집트의 수도다.",
    source: { name: "Britannica 「Cairo」", url: "https://www.britannica.com/place/Cairo" }
  },
  {
    id: "wg-02",
    category: "세계지리",
    question: "안데스산맥이 서쪽 해안을 따라 길게 뻗어 있는 대륙은?",
    choices: ["남아메리카", "북아메리카", "아프리카", "오세아니아"],
    answer: 0,
    explanation: "안데스산맥은 남아메리카 서쪽을 따라 남북으로 이어진다.",
    source: { name: "Britannica 「Andes Mountains」", url: "https://www.britannica.com/place/Andes-Mountains" }
  },
  {
    id: "wg-03",
    category: "세계지리",
    question: "오스트레일리아 수도 특별 지역에 있는 오스트레일리아의 연방 수도는?",
    choices: ["캔버라", "시드니", "멜버른", "브리즈번"],
    answer: 0,
    explanation: "캔버라는 시드니에서 남서쪽으로 약 240km 떨어진 연방 수도다.",
    source: { name: "Britannica 「Canberra」", url: "https://www.britannica.com/place/Canberra" }
  },
  {
    id: "wg-04",
    category: "세계지리",
    question: "아마존강이 남아메리카를 가로질러 흘러드는 바다는?",
    choices: ["대서양", "태평양", "인도양", "카리브해"],
    answer: 0,
    explanation: "아마존강은 안데스산맥에서 시작해 동쪽으로 흘러 대서양에 이른다.",
    source: { name: "Britannica 「Amazon River」", url: "https://www.britannica.com/place/Amazon-River" }
  },
  {
    id: "wg-05",
    category: "세계지리",
    question: "수도가 키토이고 적도가 국토를 지나는 남아메리카의 나라는?",
    choices: ["에콰도르", "콜롬비아", "볼리비아", "파라과이"],
    answer: 0,
    explanation: "에콰도르의 수도 키토 근처에 적도를 표시한 기념물이 있다.",
    source: { name: "Britannica 「Ecuador」", url: "https://www.britannica.com/place/Ecuador" }
  },
  {
    id: "wg-06",
    category: "세계지리",
    question: "온타리오주에 있는 캐나다의 수도는?",
    choices: ["오타와", "토론토", "밴쿠버", "몬트리올"],
    answer: 0,
    explanation: "오타와는 온타리오주 남동부에 있는 캐나다의 수도다.",
    source: { name: "Britannica 「Ottawa」", url: "https://www.britannica.com/place/Ottawa" }
  },
  {
    id: "wg-07",
    category: "세계지리",
    question: "석호 위의 여러 섬에 세워져 운하가 길 역할을 하는 이탈리아의 도시는?",
    choices: ["베네치아", "피렌체", "나폴리", "밀라노"],
    answer: 0,
    explanation: "베네치아는 이탈리아 북동부 석호 안의 섬들에 세운 도시다.",
    source: { name: "Britannica 「Venice」", url: "https://www.britannica.com/place/Venice" }
  },
  {
    id: "wg-08",
    category: "세계지리",
    question: "지브롤터 해협은 지중해와 어느 바다를 잇는가?",
    choices: ["대서양", "홍해", "흑해", "인도양"],
    answer: 0,
    explanation: "지브롤터 해협은 유럽과 아프리카 사이에서 지중해와 대서양을 잇는다.",
    source: { name: "Britannica 「Strait of Gibraltar」", url: "https://www.britannica.com/place/Strait-of-Gibraltar" }
  },
  {
    id: "wg-09",
    category: "세계지리",
    question: "아프리카의 킬리만자로산이 있는 나라는?",
    choices: ["탄자니아", "케냐", "우간다", "에티오피아"],
    answer: 0,
    explanation: "킬리만자로산은 탄자니아 북동부, 케냐 국경 가까이에 있다.",
    source: { name: "Britannica 「Kilimanjaro」", url: "https://www.britannica.com/place/Kilimanjaro" }
  },
  {
    id: "wg-10",
    category: "세계지리",
    question: "수도가 오슬로인 북유럽의 나라는?",
    choices: ["노르웨이", "스웨덴", "핀란드", "덴마크"],
    answer: 0,
    explanation: "오슬로는 노르웨이의 수도이자 그 나라에서 인구가 가장 많은 도시다.",
    source: { name: "Britannica 「Oslo」", url: "https://www.britannica.com/place/Oslo" }
  },

  // ----- 과학 -----
  {
    id: "sc-01",
    category: "과학",
    question: "주기율표에서 원자 번호가 1인 원소는?",
    choices: ["수소", "헬륨", "리튬", "탄소"],
    answer: 0,
    explanation: "수소는 원자 번호 1로, 원자핵에 양성자가 하나뿐이다.",
    source: { name: "Britannica 「hydrogen」", url: "https://www.britannica.com/science/hydrogen" }
  },
  {
    id: "sc-02",
    category: "과학",
    question: "세포에서 호흡으로 에너지를 내어 ATP를 만드는 세포 소기관은?",
    choices: ["미토콘드리아", "리보솜", "골지체", "리소좀"],
    answer: 0,
    explanation: "미토콘드리아는 세포 호흡으로 ATP를 만드는 세포의 발전소다.",
    source: { name: "Britannica 「mitochondrion」", url: "https://www.britannica.com/science/mitochondrion" }
  },
  {
    id: "sc-03",
    category: "과학",
    question: "태양계에서 태양으로부터 네 번째로 가까운 행성은?",
    choices: ["화성", "지구", "금성", "목성"],
    answer: 0,
    explanation: "태양에서 가까운 순서는 수성, 금성, 지구, 화성이다.",
    source: { name: "Britannica 「Mars」", url: "https://www.britannica.com/place/Mars-planet" }
  },
  {
    id: "sc-04",
    category: "과학",
    question: "뉴턴의 운동 제2법칙에서 힘은 질량과 무엇의 곱인가?",
    choices: ["가속도", "속도", "변위", "운동량"],
    answer: 0,
    explanation: "제2법칙은 F = ma로, 힘은 질량과 가속도의 곱이다.",
    source: { name: "Britannica 「Newton's laws of motion」", url: "https://www.britannica.com/science/Newtons-laws-of-motion" }
  },
  {
    id: "sc-05",
    category: "과학",
    question: "1928년 푸른곰팡이에서 항생 물질 페니실린을 발견한 과학자는?",
    choices: ["플레밍", "파스퇴르", "코흐", "리스터"],
    answer: 0,
    explanation: "알렉산더 플레밍이 1928년에 페니실린을 발견했다.",
    source: { name: "Britannica 「Alexander Fleming」", url: "https://www.britannica.com/biography/Alexander-Fleming" }
  },
  {
    id: "sc-06",
    category: "과학",
    question: "소리를 전달하는 물질이 없어 소리가 전해지지 않는 곳은?",
    choices: ["진공", "물속", "공기", "강철"],
    answer: 0,
    explanation: "소리는 물질의 진동으로 전해지므로 매질이 없는 진공에서는 못 간다.",
    source: { name: "Britannica 「sound」", url: "https://www.britannica.com/science/sound-physics" }
  },
  {
    id: "sc-07",
    category: "과학",
    question: "적혈구 안에서 산소와 결합해 온몸으로 산소를 나르는 단백질은?",
    choices: ["헤모글로빈", "인슐린", "케라틴", "콜라겐"],
    answer: 0,
    explanation: "헤모글로빈은 폐에서 산소와 결합해 몸의 조직으로 산소를 나른다.",
    source: { name: "Britannica 「hemoglobin」", url: "https://www.britannica.com/science/hemoglobin" }
  },
  {
    id: "sc-08",
    category: "과학",
    question: "현재 지구 대기를 이루는 원소 가운데 양이 가장 많은 것은?",
    choices: ["질소", "산소", "아르곤", "탄소"],
    answer: 0,
    explanation: "질소는 지구 대기에 가장 많이 들어 있는 원소다.",
    source: { name: "Britannica 「nitrogen」", url: "https://www.britannica.com/science/nitrogen" }
  },
  {
    id: "sc-09",
    category: "과학",
    question: "1기압에서 순수한 물이 끓는 온도는 섭씨 몇 도인가?",
    choices: ["100℃", "90℃", "110℃", "120℃"],
    answer: 0,
    explanation: "해수면의 표준 기압인 1기압에서 물은 100℃에서 끓는다.",
    source: { name: "Britannica 「boiling point」", url: "https://www.britannica.com/science/boiling-point" }
  },
  {
    id: "sc-10",
    category: "과학",
    question: "프리즘을 지난 햇빛이 무지개색으로 나뉘는 현상은?",
    choices: ["분산", "반사", "간섭", "회절"],
    answer: 0,
    explanation: "빛의 색마다 굴절하는 정도가 달라 프리즘에서 색이 나뉜다.",
    source: { name: "Britannica 「dispersion」", url: "https://www.britannica.com/science/dispersion-physics" }
  }
];

if (typeof module !== "undefined") module.exports = QUESTIONS;
