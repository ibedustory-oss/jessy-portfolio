import type { Lang } from '@/lib/content'

/* Content for the rebuilt services page: the pain section, the section nav
   labels, and the two-axis finder. Kept out of service.ts so the three
   existing language blocks there stay untouched. */

export interface CaseBlock {
  intro: string
  problemLabel: string
  decisionLabel: string
  outputLabel: string
  items: { meta: string; problem: string; decision: string; output: string }[]
}

export interface MapBlock {
  label: string
  sample: string
  xLeft: string
  xRight: string
  yTop: string
  yBottom: string
  points: { name: string; x: number; y: number; goal?: boolean }[]
}

export interface PainBlock {
  eyebrow: string
  title: string
  titleAccent: string
  quotes: string[]
  close: string
}

export interface FinderSize {
  label: string
  how: string
}
export interface FinderPain {
  label: string
  plan: number
  weeks: string
  what: string
}

export interface FinderBlock {
  eyebrow: string
  sheetLabel: string
  draftRef: string
  title: string
  titleAccent: string
  lead: string
  sizeLead: string
  painLead: string
  reset: string
  rowYou: string
  rowIssue: string
  weeksLabel: string
  whatLabel: string
  howLabel: string
  cta: string
  sizes: FinderSize[]
  pains: FinderPain[]
}

export interface PlanExtra {
  bestLabel: string
  excludeLabel: string
  items: { best: string; excludes: string[] }[]
}

export interface NavBlock {
  why: string
  finder: string
  work: string
  how: string
  price: string
  faq: string
}

export interface Extra {
  cases: CaseBlock
  map: MapBlock
  pain: PainBlock
  finder: FinderBlock
  planExtra: PlanExtra
  nav: NavBlock
  eyebrows: { work: string; included: string; steps: string; price: string; compare: string; faq: string }
}

export const EXTRA: Record<Lang, Extra> = {
  ja: {
    cases: {
      intro: '実在の店舗ではありません。「誰に・なぜ・どう売るか」を先に決めて、その判断のままつくった自主制作です。',
      problemLabel: '問題',
      decisionLabel: '決めたこと',
      outputLabel: 'かたち',
      items: [
        {
          meta: 'Restaurant & épicerie / Paris',
          problem: '飲食と物販を一つの看板でやると、どちらの店なのかが伝わらない。',
          decision: '入り口を二枚に分けた。同じブランドの下で、食べる店と買う店の役割をはっきりさせる。',
          output: '扉が二枚のトップページ。どちらを開くかが、訪問者への最初の問いになる。',
        },
        {
          meta: 'Pilates / Paris',
          problem: 'スタジオは料金と設備で比べられ、教える人の考え方が見えない。',
          decision: '設備ではなく人を主役にした。読み物として設計し、指導者の判断を誌面で見せる。',
          output: '表紙がめくれて中面が始まる構成。号数と目次を持つ一冊として組んだ。',
        },
        {
          meta: 'Cabinet japonais / Paris',
          problem: '整体は体験しないと伝わらない。効能を並べるほど、かえって疑わしく見える。',
          decision: '効果を売らず、身体の側から語らせた。「Le corps sait se redresser.」を軸に据える。',
          output: '余白と短い言葉だけで構成した、静かな一枚。',
        },
        {
          meta: 'Cuisine coréenne / Paris',
          problem: '高級店ほど、情報を足すほど安く見える。',
          decision: '席数と条件を先に出した。「Quinze couverts.」を見出しにして、選ぶ側を絞る。',
          output: '写真を絞り、組版と余白だけで格をつくったページ。',
        },
      ],
    },
    map: {
      label: 'Positioning map',
      sample: '例 · パリの韓国料理店',
      xLeft: '日常',
      xRight: '特別な日',
      yTop: 'ローカライズ',
      yBottom: '韓国式',
      points: [
        { name: '韓国風ビストロ', x: 26, y: 26 },
        { name: 'ファインダイニング', x: 70, y: 20 },
        { name: '町の定食', x: 28, y: 72 },
        { name: 'うちの店', x: 74, y: 74, goal: true },
      ],
    },
    pain: {
      eyebrow: 'About',
      title: 'サイトの相談で、',
      titleAccent: 'よくこう言われます。',
      quotes: [
        'きれいなサイトはできた。でも、問い合わせは増えなかった。',
        '何を書けばいいか聞かれても、自分でも言葉にできない。',
        '同業と並んだとき、うちを選ぶ理由を説明できない。',
        'AIで全部できると言われて触ってみたが、あれこれ時間とお金を使っただけで完成しなかった。',
      ],
      close: 'どれも、デザインの問題ではありません。',
    },
    finder: {
      eyebrow: 'Sheet',
      sheetLabel: 'Strategy sheet',
      draftRef: '下書き',
      title: '2つ選ぶだけで、',
      titleAccent: '進め方が1枚になります。',
      lead: '実際にお渡しする戦略シートの、最初の数行です。',
      sizeLead: '私は',
      painLead: 'いま',
      reset: 'リセット',
      rowYou: '事業',
      rowIssue: 'いま',
      weeksLabel: '公開まで',
      whatLabel: '何から始めるか',
      howLabel: 'どう一緒に進めるか',
      cta: 'この内容で相談する',
      sizes: [
        {
          label: 'これから始めるところ',
          how: '最初の30分で事業のことを伺い、戦略シートを1枚つくるところから始めます。屋号もロゴもない状態で構いません。',
        },
        {
          label: 'ひとりで事業をしている',
          how: 'すでにある言葉と実績を棚卸ししてから、足りないところだけをつくります。ゼロからやり直しません。',
        },
        {
          label: '小さなチームでやっている',
          how: '決裁に関わる方にも最初のヒアリングに入っていただきます。あとから振り出しに戻るのを防ぐためです。',
        },
        {
          label: '店舗を持っている',
          how: '来店までの動線と検索での見え方を先に決めてから、ページの構成に入ります。',
        },
      ],
      pains: [
        {
          label: '何を伝えればいいか決まっていない',
          plan: 0,
          weeks: '3〜4週間',
          what: 'WHYの言語化から始めます。誰に・なぜ・何を言わないかが1枚に収まるまで、デザインには入りません。',
        },
        {
          label: 'サイトはあるが問い合わせが来ない',
          plan: 0,
          weeks: '2週間',
          what: 'いまのサイトを読んで、どこで離脱しているかを見ます。作り直すより1ページに絞ったほうが早いことも多いです。',
        },
        {
          label: '多言語で出したい',
          plan: 0,
          weeks: '4週間',
          what: '日英韓は私が書きます。翻訳ではなく、その言語で読まれる文章として書き直します。仏語はネイティブ監修つきです。',
        },
        {
          label: '公開したあと何をすればいいかわからない',
          plan: 1,
          weeks: '初月から',
          what: '検索・SNS・紹介のどこから人を呼ぶかを設計図にして、月ごとにやることを決めます。',
        },
      ],
    },
    planExtra: {
      bestLabel: 'こんな方に',
      excludeLabel: '含まないもの',
      items: [
        {
          best: '事業の顔になる場所が要る方。1枚で始めて、あとから増やすこともできます。',
          excludes: ['決済システム(追加料金で対応可)', '写真撮影とロゴ制作', 'ドメイン・サーバー費用'],
        },
        {
          best: 'サイトはもうあり、公開後のマーケティングまで任せたい方。',
          excludes: ['新規のサイト制作', '大幅なデザイン変更'],
        },
      ],
    },
    nav: { why: 'なぜ', finder: 'シート', work: '実績', how: '進め方', price: '料金', faq: '質問' },
    eyebrows: {
      work: 'Work',
      included: 'Scope',
      steps: 'Process',
      price: 'Price',
      compare: 'Compare',
      faq: 'FAQ',
    },
  },

  ko: {
    cases: {
      intro: '실제 매장이 아닙니다. 누구에게·왜·어떻게 팔지를 먼저 정하고, 그 판단 그대로 만든 자체 제작입니다.',
      problemLabel: '문제',
      decisionLabel: '정한 것',
      outputLabel: '형태',
      items: [
        {
          meta: 'Restaurant & épicerie / Paris',
          problem: '식당과 판매를 한 간판으로 하면 어느 쪽 가게인지 전달되지 않는다.',
          decision: '입구를 두 개로 나눴다. 같은 브랜드 아래에서 먹는 곳과 사는 곳의 역할을 분명히 한다.',
          output: '문이 두 개인 첫 화면. 어느 쪽을 열지가 방문자에게 던지는 첫 질문이 된다.',
        },
        {
          meta: 'Pilates / Paris',
          problem: '스튜디오는 가격과 시설로 비교되고, 가르치는 사람의 생각은 보이지 않는다.',
          decision: '시설이 아니라 사람을 주인공으로 세웠다. 읽을거리로 설계해 지도자의 판단을 지면에 담는다.',
          output: '표지가 넘어가며 본문이 시작되는 구성. 호수와 목차를 가진 한 권으로 짰다.',
        },
        {
          meta: 'Cabinet japonais / Paris',
          problem: '정체는 받아보지 않으면 전달되지 않는다. 효능을 늘어놓을수록 오히려 의심스러워 보인다.',
          decision: '효과를 팔지 않고 몸 쪽에서 말하게 했다. "Le corps sait se redresser."를 축으로 삼는다.',
          output: '여백과 짧은 문장만으로 구성한 조용한 한 장.',
        },
        {
          meta: 'Cuisine coréenne / Paris',
          problem: '고급 매장일수록 정보를 더할수록 싸 보인다.',
          decision: '좌석 수와 조건을 먼저 내놨다. "Quinze couverts."를 제목으로 걸어 고르는 쪽을 좁힌다.',
          output: '사진을 줄이고 조판과 여백만으로 격을 만든 페이지.',
        },
      ],
    },
    map: {
      label: 'Positioning map',
      sample: '예시 · 파리의 한식당',
      xLeft: '일상',
      xRight: '특별한 날',
      yTop: '현지화',
      yBottom: '한국식',
      points: [
        { name: '퓨전 비스트로', x: 26, y: 26 },
        { name: '파인다이닝', x: 70, y: 20 },
        { name: '동네 백반', x: 28, y: 72 },
        { name: '우리 가게', x: 74, y: 74, goal: true },
      ],
    },
    pain: {
      eyebrow: 'About',
      title: '사장님들께',
      titleAccent: '자주 듣는 말입니다.',
      quotes: [
        '예쁜 사이트는 나왔습니다. 그런데 문의는 늘지 않았습니다.',
        '뭘 써야 하냐고 물으시는데, 저도 말로 정리가 안 됩니다.',
        '경쟁사와 나란히 놓였을 때, 우리를 골라야 할 이유를 설명하지 못합니다.',
        'AI로 다 된다는데, 결국 이것저것 시간과 돈만 쓰고 완성을 못 했습니다.',
      ],
      close: '전부 디자인의 문제가 아닙니다.',
    },
    finder: {
      eyebrow: 'Sheet',
      sheetLabel: 'Strategy sheet',
      draftRef: '초안',
      title: '두 가지만 고르시면,',
      titleAccent: '진행 방식이 한 장이 됩니다.',
      lead: '실제로 드리는 전략 시트의 첫 몇 줄입니다.',
      sizeLead: '저는',
      painLead: '지금',
      reset: '초기화',
      rowYou: '사업',
      rowIssue: '지금',
      weeksLabel: '오픈까지',
      whatLabel: '무엇부터',
      howLabel: '어떻게 함께',
      cta: '이 내용으로 상담하기',
      sizes: [
        {
          label: '이제 시작하는 단계',
          how: '첫 30분 동안 사업 이야기를 듣고, 전략 시트 한 장을 만드는 것부터 시작합니다. 상호도 로고도 없어도 괜찮습니다.',
        },
        {
          label: '혼자 사업을 하는 중',
          how: '이미 있는 말과 실적을 정리한 다음, 부족한 부분만 만듭니다. 처음부터 다시 하지 않습니다.',
        },
        {
          label: '작은 팀으로 하는 중',
          how: '결정권이 있는 분도 첫 미팅에 함께 들어와 주십시오. 나중에 원점으로 돌아가는 걸 막기 위해서입니다.',
        },
        {
          label: '매장을 운영 중',
          how: '방문까지의 동선과 검색에서 보이는 방식을 먼저 정한 뒤에 페이지 구성에 들어갑니다.',
        },
      ],
      pains: [
        {
          label: '무엇을 말해야 할지 정해지지 않았다',
          plan: 0,
          weeks: '3~4주',
          what: 'WHY를 언어화하는 것부터 합니다. 누구에게·왜·무엇을 말하지 않을지가 한 장에 담기기 전까지는 디자인에 들어가지 않습니다.',
        },
        {
          label: '사이트는 있는데 문의가 없다',
          plan: 0,
          weeks: '2주',
          what: '지금 사이트를 읽고 어디서 이탈하는지 봅니다. 새로 만드는 것보다 한 페이지로 좁히는 게 빠를 때가 많습니다.',
        },
        {
          label: '여러 언어로 내고 싶다',
          plan: 0,
          weeks: '4주',
          what: '한국어·일본어·영어는 제가 씁니다. 번역이 아니라 그 언어로 읽히는 글로 다시 씁니다. 불어는 원어민 감수를 붙입니다.',
        },
        {
          label: '공개한 다음에 뭘 해야 할지 모르겠다',
          plan: 1,
          weeks: '첫 달부터',
          what: '검색·SNS·소개 중 어디서 사람을 데려올지 설계도로 만들고, 달마다 할 일을 정합니다.',
        },
      ],
    },
    planExtra: {
      bestLabel: '이런 분께',
      excludeLabel: '포함하지 않는 것',
      items: [
        {
          best: '사업의 얼굴이 될 자리가 필요한 분. 한 장으로 시작해 나중에 늘려도 됩니다.',
          excludes: ['결제 시스템(추가 요금으로 가능)', '사진 촬영과 로고 제작', '도메인·서버 비용'],
        },
        {
          best: '사이트는 이미 있고, 오픈 후 마케팅까지 맡기고 싶은 분.',
          excludes: ['신규 사이트 제작', '대폭적인 디자인 변경'],
        },
      ],
    },
    nav: { why: '왜', finder: '시트', work: '작업물', how: '진행', price: '비용', faq: '질문' },
    eyebrows: {
      work: 'Work',
      included: 'Scope',
      steps: 'Process',
      price: 'Price',
      compare: 'Compare',
      faq: 'FAQ',
    },
  },

  en: {
    cases: {
      intro: 'None of these are real shops. Each began by deciding who it is for, why, and how it sells, and was then built exactly as that decision.',
      problemLabel: 'Problem',
      decisionLabel: 'Decision',
      outputLabel: 'Form',
      items: [
        {
          meta: 'Restaurant & épicerie / Paris',
          problem: 'One sign over both a kitchen and a shop tells a passer-by neither.',
          decision: 'Split the entrance in two. One brand, two clearly separated jobs: a place to eat and a place to buy.',
          output: 'A cover made of two doors. Which one you open is the first question the site asks.',
        },
        {
          meta: 'Pilates / Paris',
          problem: 'Studios get compared on price and equipment, and the teacher behind them stays invisible.',
          decision: 'Put the person ahead of the room. Build it as something to read, where her judgement is the content.',
          output: 'A cover that turns into a spread, with an issue number and a contents page.',
        },
        {
          meta: 'Cabinet japonais / Paris',
          problem: 'Manual therapy does not translate to someone who has not had it. Listing benefits makes it sound less credible.',
          decision: 'Stop selling the effect and let the body speak. Build everything around "Le corps sait se redresser."',
          output: 'One quiet page held together by white space and a few short lines.',
        },
        {
          meta: 'Cuisine coréenne / Paris',
          problem: 'The more a fine dining room explains itself, the cheaper it reads.',
          decision: 'Lead with the constraint. "Quinze couverts." as the headline, which narrows who books before they scroll.',
          output: 'Few photographs, and the standing built from typesetting and space alone.',
        },
      ],
    },
    map: {
      label: 'Positioning map',
      sample: 'Example · Korean restaurant, Paris',
      xLeft: 'Everyday',
      xRight: 'Occasion',
      yTop: 'Localised',
      yBottom: 'Korean',
      points: [
        { name: 'Fusion bistro', x: 26, y: 26 },
        { name: 'Fine dining', x: 70, y: 20 },
        { name: 'Neighbourhood', x: 28, y: 72 },
        { name: 'Your shop', x: 74, y: 74, goal: true },
      ],
    },
    pain: {
      eyebrow: 'About',
      title: 'What owners',
      titleAccent: 'keep telling me.',
      quotes: [
        'The site looks good. The enquiries never came.',
        'They asked me what to write, and I could not put it into words.',
        'Next to my competitors, I cannot explain why anyone should pick me.',
        'They said AI could do all of it. I spent the time and the money on bits and pieces and never finished.',
      ],
      close: 'None of these is a design problem.',
    },
    finder: {
      eyebrow: 'Sheet',
      sheetLabel: 'Strategy sheet',
      draftRef: 'Draft',
      title: 'Choose two, and',
      titleAccent: 'the plan fits on one sheet.',
      lead: 'These are the opening lines of the strategy sheet you would actually get.',
      sizeLead: 'I am',
      painLead: 'right now',
      reset: 'Reset',
      rowYou: 'Business',
      rowIssue: 'Now',
      weeksLabel: 'To launch',
      whatLabel: 'Where we start',
      howLabel: 'How we work together',
      cta: 'Start from this',
      sizes: [
        {
          label: 'about to start something',
          how: 'We spend the first thirty minutes on the business itself and write a one-page strategy sheet. No name and no logo yet is fine.',
        },
        {
          label: 'running a business alone',
          how: 'We take stock of the words and proof you already have, then build only what is missing. Nothing gets restarted from zero.',
        },
        {
          label: 'working as a small team',
          how: 'Whoever signs off joins the first conversation. That is what keeps the project from going back to square one later.',
        },
        {
          label: 'running a physical shop',
          how: 'We settle how people find and reach the shop before touching the page structure.',
        },
      ],
      pains: [
        {
          label: 'I have not decided what to say',
          plan: 0,
          weeks: '3–4 weeks',
          what: 'We start by writing the WHY. Design waits until who, why, and what we refuse to say all fit on one page.',
        },
        {
          label: 'I have a site but no enquiries',
          plan: 0,
          weeks: '2 weeks',
          what: 'I read the current site and find where people leave. Narrowing to a single page is often faster than rebuilding.',
        },
        {
          label: 'I need it in several languages',
          plan: 0,
          weeks: '4 weeks',
          what: 'I write Japanese, English and Korean myself — rewritten to read natively, not translated. French goes through a native editor.',
        },
        {
          label: 'I do not know what happens after launch',
          plan: 1,
          weeks: 'from month one',
          what: 'We map where the traffic comes from — search, social, referral — and set what to do each month.',
        },
      ],
    },
    planExtra: {
      bestLabel: 'Right if',
      excludeLabel: 'Not included',
      items: [
        {
          best: 'you need a place that works as the face of the business. Start with one page and add later.',
          excludes: ['A payment system (available for an added fee)', 'Photography and logo design', 'Domain and hosting fees'],
        },
        {
          best: 'the site exists and you want the marketing after launch handled too.',
          excludes: ['Building a new site', 'A full redesign'],
        },
      ],
    },
    nav: { why: 'Why', finder: 'Sheet', work: 'Work', how: 'Process', price: 'Price', faq: 'FAQ' },
    eyebrows: {
      work: 'Work',
      included: 'Scope',
      steps: 'Process',
      price: 'Price',
      compare: 'Compare',
      faq: 'FAQ',
    },
  },
}
