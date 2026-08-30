import type { Lang } from '@/lib/content'

/* Content for the rebuilt services page: the pain section, the section nav
   labels, and the two-axis finder. Kept out of service.ts so the three
   existing language blocks there stay untouched. */

export interface SheetBlock {
  label: string
  ref: string
  meta: string
  hypLabel: string
  rows: { k: string; v?: string; key?: boolean; hyp?: boolean }[]
  caption: string
}

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

export interface SheetRefs {
  pain: string
  alt: string
  field: string
  north: string
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
  heroTrust: string
  sheetRefs: SheetRefs
  sheet: SheetBlock
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
    heroTrust: 'パリ拠点 · 日英韓は自分で書く · 24時間以内に返信',
    sheetRefs: {
      pain: 'シート 01 · 診断',
      alt: 'シート 03 · 代替案',
      field: 'シート 04–05 · 戦場と勝ち筋',
      north: 'シート 07 · 北極星',
    },
    sheet: {
      label: 'Strategy sheet',
      ref: 'N°01',
      meta: '作成 Jessy Jung · 対象 JOAYO — Restaurant coréen, Paris 1er',
      hypLabel: '仮説',
      rows: [
        { k: '診断', v: 'パリ中心部の韓国料理は、観光客向けの一軒として読まれる' },
        { k: '用事', v: '座ってちゃんとした一食を食べたい時' },
        { k: '代替案', v: '近隣の韓国風ビストロ / チェーン' },
        { k: '戦場', v: 'パリ1区。昼と夜、予約のお客' },
        { k: '勝ち筋', v: '速さではなく、時間のかかり方を看板に', key: true },
        { k: '危うい仮説', v: '待つことを価値と読んでもらえるか', hyp: true },
        { k: '北極星', v: '再訪の予約数' },
        { k: '初手', v: '甕の庭をトップに。メニュー説明は1品だけ' },
      ],
      caption: '',
    },
    cases: {
      intro: '実在の店舗ではありません。「誰に・なぜ・どう売るか」を先に決めて、その判断のままつくった自主制作です。',
      problemLabel: '問題',
      decisionLabel: '決めたこと',
      outputLabel: 'かたち',
      items: [
        {
          meta: 'Restaurant coréen / Paris 1er',
          problem: 'パリの中心で韓国料理を出すと、観光客向けの一軒として流される。',
          decision: '速さではなく、時間のかかり方を看板にした。醤も漬けものも待ってできる、という店の性格を先に見せる。',
          output: '甕の並ぶ庭をトップに置き、代表料理は甕に吊るした韓紙の札で示す。メニューは説明を1品だけに絞り、残りは名前と価格で通す。',
        },
        {
          meta: 'Pilates / Paris',
          problem: 'スタジオは料金と設備で比べられ、教える人の考え方が見えない。',
          decision: '設備ではなく人を主役にした。読み物として設計し、指導者の判断を誌面で見せる。',
          output: '表紙がめくれて中面が始まる構成。号数と目次を持つ一冊として組んだ。',
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
      lead: '初回の相談は、この下書きから始まります。',
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
          what: '診断から始めます。何が障害かが1行で書けるまで、デザインには入りません。',
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
          best: '公開したあと、数字を見ながら一緒に動かしたい方。',
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
    heroTrust: '파리 기반 · 한·일·영 직접 작성 · 24시간 안에 답장',
    sheetRefs: {
      pain: '시트 01 · 진단',
      alt: '시트 03 · 대안',
      field: '시트 04–05 · 싸울 곳과 이기는 법',
      north: '시트 07 · 북극성',
    },
    sheet: {
      label: 'Strategy sheet',
      ref: 'N°01',
      meta: '작성 Jessy Jung · 대상 JOAYO — 한식당, 파리 1구',
      hypLabel: '가설',
      rows: [
        { k: '진단', v: '파리 한복판의 한식은 관광객용 한 곳으로 읽힌다' },
        { k: '찾는 순간', v: '앉아서 제대로 된 한 끼를 먹고 싶을 때' },
        { k: '대안', v: '주변의 퓨전 비스트로 / 프랜차이즈' },
        { k: '싸울 곳', v: '파리 1구. 점심과 저녁, 예약 손님' },
        { k: '이기는 법', v: '빠름이 아니라, 시간이 드는 방식을 간판으로', key: true },
        { k: '위험한 가설', v: '기다림을 가치로 읽어줄 것인가', hyp: true },
        { k: '북극성', v: '다시 찾는 예약의 수' },
        { k: '첫 수', v: '장독대를 첫 화면에. 메뉴 설명은 하나만' },
      ],
      caption: '',
    },
    cases: {
      intro: '실제 매장이 아닙니다. 누구에게·왜·어떻게 팔지를 먼저 정하고, 그 판단 그대로 만든 자체 제작입니다.',
      problemLabel: '문제',
      decisionLabel: '정한 것',
      outputLabel: '형태',
      items: [
        {
          meta: 'Restaurant coréen / Paris 1er',
          problem: '파리 한복판에서 한식을 내면 관광객용 한 곳으로 흘러간다.',
          decision: '빠름이 아니라 시간이 드는 방식을 간판으로 삼았다. 장도 김치도 기다려야 된다는 성격을 먼저 보여준다.',
          output: '장독대를 첫 화면에 놓고, 대표 메뉴는 항아리에 매단 한지 札로 보여준다. 메뉴는 설명을 한 가지에만 붙이고 나머지는 이름과 가격으로 간다.',
        },
        {
          meta: 'Pilates / Paris',
          problem: '스튜디오는 가격과 시설로 비교되고, 가르치는 사람의 생각은 보이지 않는다.',
          decision: '시설이 아니라 사람을 주인공으로 세웠다. 읽을거리로 설계해 지도자의 판단을 지면에 담는다.',
          output: '표지가 넘어가며 본문이 시작되는 구성. 호수와 목차를 가진 한 권으로 짰다.',
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
        '예쁜 사이트는 나왔어요. 그런데 문의는 안 늘더라고요.',
        '뭘 써야 하냐고 묻는데, 저도 말로는 정리가 안 돼요.',
        '옆 가게랑 나란히 놓고 보면, 우리를 골라야 할 이유를 저도 설명 못 하겠어요.',
        'AI로 다 된다길래 해봤는데, 이것저것 시간이랑 돈만 쓰고 완성을 못 했어요.',
      ],
      close: '전부 디자인의 문제가 아닙니다.',
    },
    finder: {
      eyebrow: 'Sheet',
      sheetLabel: 'Strategy sheet',
      draftRef: '초안',
      title: '두 가지만 고르시면,',
      titleAccent: '초안 한 장이 나옵니다.',
      lead: '첫 상담은 이 초안에서 시작합니다.',
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
          how: '이미 가지고 계신 문장과 결과물부터 정리하고, 부족한 부분만 새로 만듭니다. 처음부터 다시 하지 않습니다.',
        },
        {
          label: '작은 팀으로 하는 중',
          how: '결정권 있는 분도 첫 미팅에 같이 계시는 게 좋습니다. 나중에 원점으로 돌아가는 일을 막기 위해서입니다.',
        },
        {
          label: '매장을 운영 중',
          how: '방문까지의 동선과 검색에서 보이는 방식을 먼저 정한 뒤에 페이지 구성에 들어갑니다.',
        },
      ],
      pains: [
        {
          label: '무슨 말을 해야 할지 모르겠다',
          plan: 0,
          weeks: '3~4주',
          what: '진단부터 합니다. 무엇이 걸림돌인지 한 줄로 적히기 전까지는 디자인에 들어가지 않습니다.',
        },
        {
          label: '사이트는 있는데 문의가 없다',
          plan: 0,
          weeks: '2주',
          what: '지금 사이트를 읽고 어디서 이탈하는지 봅니다. 새로 만드는 것보다 한 페이지로 좁히는 게 빠를 때가 많습니다.',
        },
        {
          label: '여러 언어로 운영하고 싶다',
          plan: 0,
          weeks: '4주',
          what: '한국어·일본어·영어는 제가 씁니다. 번역이 아니라 그 언어로 읽히는 글로 다시 씁니다. 불어는 원어민 감수를 붙입니다.',
        },
        {
          label: '오픈한 다음에 뭘 해야 할지 모르겠다',
          plan: 1,
          weeks: '첫 달부터',
          what: '검색·SNS·소개 중 어디서 손님이 오게 할지 정하고, 북극성 지표를 같이 보면서 달마다 다음 한 수를 정합니다.',
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
          best: '오픈한 다음, 숫자를 보면서 같이 움직이고 싶은 분.',
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
    heroTrust: 'Based in Paris · JA/KO/EN written in-house · Replies within a day',
    sheetRefs: {
      pain: 'Sheet 01 · Diagnosis',
      alt: 'Sheet 03 · Alternatives',
      field: 'Sheet 04–05 · Where and how',
      north: 'Sheet 07 · North star',
    },
    sheet: {
      label: 'Strategy sheet',
      ref: 'N°01',
      meta: 'By Jessy Jung · For JOAYO — Korean restaurant, Paris 1er',
      hypLabel: 'bet',
      rows: [
        { k: 'Diagnosis', v: 'Korean food in central Paris reads as a tourist stop' },
        { k: 'The job', v: 'A proper sit-down meal, not a quick fix' },
        { k: 'Alternatives', v: 'Nearby Korean-style bistros and chains' },
        { k: 'Where we play', v: 'Paris 1er. Lunch, dinner, bookings' },
        { k: 'How we win', v: 'Lead with how long things take, not how fast', key: true },
        { k: 'Riskiest bet', v: 'That waiting reads as value', hyp: true },
        { k: 'North star', v: 'Returning reservations' },
        { k: 'First move', v: 'Jars on the first screen. One dish described' },
      ],
      caption: '',
    },
    cases: {
      intro: 'None of these are real shops. Each began by deciding who it is for, why, and how it sells, and was then built exactly as that decision.',
      problemLabel: 'Problem',
      decisionLabel: 'Decision',
      outputLabel: 'Form',
      items: [
        {
          meta: 'Korean restaurant / Paris 1er',
          problem: 'Korean food in the centre of Paris gets read as one more option for tourists.',
          decision: 'Lead with how long things take rather than how fast they arrive. The jang and the kimchi have to wait, and that is the character of the place.',
          output: 'A yard of fermentation jars opens the page, and the signature dishes hang from them on hanji tags. Only one dish on the menu carries a description; the rest run as a name and a price.',
        },
        {
          meta: 'Pilates / Paris',
          problem: 'Studios get compared on price and equipment, and the teacher behind them stays invisible.',
          decision: 'Put the person ahead of the room. Build it as something to read, where her judgement is the content.',
          output: 'A cover that turns into a spread, with an issue number and a contents page.',
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
      title: 'Two choices,',
      titleAccent: 'one sheet.',
      lead: 'The first conversation starts from this draft.',
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
          what: 'We start with the diagnosis. Design waits until the obstacle fits on one line.',
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
          best: 'the site is live and you want someone watching the numbers with you.',
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
