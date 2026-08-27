import type { Lang } from '@/lib/content'

/* Content for the rebuilt services page: the pain section, the section nav
   labels, and the two-axis finder. Kept out of service.ts so the three
   existing language blocks there stay untouched. */

export interface PainBlock {
  eyebrow: string
  title: string
  titleAccent: string
  quotes: string[]
  close: string
  closeAccent: string
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
  title: string
  titleAccent: string
  lead: string
  sizeLead: string
  sizeAfter: string
  painLead: string
  painAfter: string
  placeholder: string
  submit: string
  reset: string
  resultTitle: string
  resultEmpty: string
  planLabel: string
  weeksLabel: string
  whatLabel: string
  howLabel: string
  excludeLabel: string
  cta: string
  sizes: FinderSize[]
  pains: FinderPain[]
}

export interface PlanExtra {
  bestLabel: string
  addsLabel: string
  excludeLabel: string
  items: { best: string; adds?: string; excludes: string[] }[]
}

export interface MonitorBlock {
  eyebrow: string
  badge: string
  title: string
  titleAccent: string
  price: string
  unit: string
  lead: string
  scopeLabel: string
  scope: string[]
  excludeLabel: string
  excludes: string[]
  termsLabel: string
  terms: string[]
  cta: string
  note: string
  plansNote: string
  finderNote: string
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
  monitor: MonitorBlock
  pain: PainBlock
  finder: FinderBlock
  planExtra: PlanExtra
  nav: NavBlock
  eyebrows: { work: string; included: string; steps: string; price: string; compare: string; faq: string }
}

export const EXTRA: Record<Lang, Extra> = {
  ja: {
    monitor: {
      eyebrow: 'Monitor',
      badge: '3社限定',
      title: 'いま、最初の3社を',
      titleAccent: '募集しています。',
      price: '€300',
      unit: '/ 1社',
      lead: '実装はAIで速く終わらせます。だから戦略から入っても、この金額で成立します。事例をつくらせていただく代わりの価格です。',
      scopeLabel: '含むもの',
      scope: ['WHYの言語化と戦略シート(1枚)', '構成とコピー', '1ページ', 'スマホ対応', '公開作業まで'],
      excludeLabel: '含まないもの',
      excludes: ['多言語', 'ページの追加', '写真撮影とロゴ制作', '公開後の運用'],
      termsLabel: 'お願いすること',
      terms: ['屋号と写真を出した事例掲載', '3ヶ月後に変化を数字で共有', '推薦文を1つ'],
      cta: 'モニターに応募する',
      note: '定価は事例が揃ってから公開します。',
      plansNote: 'モニター期間後の想定価格',
      finderNote: 'いまはモニター期間です。1ページの範囲なら3社限定 €300。',
    },
    pain: {
      eyebrow: 'About',
      title: 'サイトのことで、',
      titleAccent: 'こう思ったことはありませんか。',
      quotes: [
        'きれいなサイトはできた。でも、問い合わせは増えなかった。',
        '何を書けばいいか聞かれても、自分でも言葉にできない。',
        '同業と並んだとき、うちを選ぶ理由を説明できない。',
        'AIで全部できると言われて触ってみたが、あれこれ時間とお金を使っただけで完成しなかった。',
      ],
      close: 'どれも、',
      closeAccent: 'デザインの問題ではありません。',
    },
    finder: {
      eyebrow: 'Finder',
      title: 'あなたに合う進め方を、',
      titleAccent: 'その場でお出しします。',
      lead: '2つ選ぶだけです。連絡先の入力はいりません。',
      sizeLead: '私は',
      sizeAfter: 'で、',
      painLead: 'いま',
      painAfter: 'に困っています。',
      placeholder: '選んでください',
      submit: '見てみる',
      reset: 'リセット',
      resultTitle: 'おすすめの進め方',
      resultEmpty: '2つ選ぶと、ここに出ます。',
      planLabel: 'プラン',
      weeksLabel: '公開まで',
      whatLabel: 'まずやること',
      howLabel: '進め方',
      excludeLabel: 'このプランに含まないもの',
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
          plan: 1,
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
          plan: 1,
          weeks: '4週間',
          what: '日英韓は私が書きます。翻訳ではなく、その言語で読まれる文章として書き直します。仏語はネイティブ監修つきです。',
        },
        {
          label: '公開したあと何をすればいいかわからない',
          plan: 2,
          weeks: '初月から',
          what: '検索・SNS・紹介のどこから人を呼ぶかを設計図にして、月ごとにやることを決めます。',
        },
      ],
    },
    planExtra: {
      bestLabel: 'こんな方に',
      addsLabel: 'ランディングページの内容すべて ＋',
      excludeLabel: '含まないもの',
      items: [
        {
          best: '伝えたいことが1つに絞れている方。まず1枚で試したい方。',
          excludes: ['多言語', 'ページの追加', '公開後の運用'],
        },
        {
          best: '事業の顔として、何度も見られる場所が要る方。',
          adds: 'ランディングページの内容すべて ＋',
          excludes: ['公開後のマーケティング運用', '写真撮影とロゴ制作'],
        },
        {
          best: 'サイトはもうあり、公開後のマーケティングまで任せたい方。',
          excludes: ['新規のサイト制作', '大幅なデザイン変更'],
        },
      ],
    },
    nav: { why: 'なぜ', finder: '診断', work: '実績', how: '進め方', price: '料金', faq: '質問' },
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
    monitor: {
      eyebrow: 'Monitor',
      badge: '3분 한정',
      title: '지금, 첫 세 분을',
      titleAccent: '모시고 있습니다.',
      price: '€300',
      unit: '/ 1곳',
      lead: '구현은 AI로 빠르게 끝냅니다. 그래서 전략부터 시작해도 이 금액으로 성립합니다. 사례를 만들게 해 주시는 대신의 가격입니다.',
      scopeLabel: '포함하는 것',
      scope: ['WHY 언어화와 전략 시트(1장)', '구성과 카피', '1페이지', '모바일 대응', '오픈까지'],
      excludeLabel: '포함하지 않는 것',
      excludes: ['다국어', '페이지 추가', '사진 촬영과 로고 제작', '오픈 후 운영'],
      termsLabel: '부탁드리는 것',
      terms: ['상호와 사진을 낸 사례 게재', '3개월 뒤 변화를 숫자로 공유', '추천사 한 줄'],
      cta: '모니터 신청하기',
      note: '정가는 사례가 모이면 공개합니다.',
      plansNote: '모니터 기간 이후의 예상 가격',
      finderNote: '지금은 모니터 기간입니다. 1페이지 범위라면 3분 한정 €300.',
    },
    pain: {
      eyebrow: 'About',
      title: '사이트 때문에,',
      titleAccent: '이런 생각 해보신 적 있으시죠?',
      quotes: [
        '예쁜 사이트는 나왔습니다. 그런데 문의는 늘지 않았습니다.',
        '뭘 써야 하냐고 물으시는데, 저도 말로 정리가 안 됩니다.',
        '경쟁사와 나란히 놓였을 때, 우리를 골라야 할 이유를 설명하지 못합니다.',
        'AI로 다 된다는데, 결국 이것저것 시간과 돈만 쓰고 완성을 못 했습니다.',
      ],
      close: '전부',
      closeAccent: '디자인의 문제가 아닙니다.',
    },
    finder: {
      eyebrow: 'Finder',
      title: '맞는 진행 방식을',
      titleAccent: '바로 알려드릴게요.',
      lead: '두 가지만 고르시면 됩니다. 연락처는 받지 않습니다.',
      sizeLead: '저는',
      sizeAfter: '이고,',
      painLead: '지금',
      painAfter: '이 고민입니다.',
      placeholder: '선택해 주세요',
      submit: '확인하기',
      reset: '초기화',
      resultTitle: '추천 진행 방식',
      resultEmpty: '두 가지를 고르시면 여기에 나옵니다.',
      planLabel: '플랜',
      weeksLabel: '오픈까지',
      whatLabel: '먼저 할 일',
      howLabel: '진행 방식',
      excludeLabel: '이 플랜에 포함하지 않는 것',
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
          plan: 1,
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
          plan: 1,
          weeks: '4주',
          what: '한국어·일본어·영어는 제가 씁니다. 번역이 아니라 그 언어로 읽히는 글로 다시 씁니다. 불어는 원어민 감수를 붙입니다.',
        },
        {
          label: '공개한 다음에 뭘 해야 할지 모르겠다',
          plan: 2,
          weeks: '첫 달부터',
          what: '검색·SNS·소개 중 어디서 사람을 데려올지 설계도로 만들고, 달마다 할 일을 정합니다.',
        },
      ],
    },
    planExtra: {
      bestLabel: '이런 분께',
      addsLabel: '랜딩페이지 내용 전부 ＋',
      excludeLabel: '포함하지 않는 것',
      items: [
        {
          best: '할 말이 하나로 좁혀진 분. 우선 한 장으로 시험해 보고 싶은 분.',
          excludes: ['다국어', '페이지 추가', '오픈 후 운영'],
        },
        {
          best: '사업의 얼굴로, 여러 번 보게 될 자리가 필요한 분.',
          adds: '랜딩페이지 내용 전부 ＋',
          excludes: ['오픈 후 마케팅 운영', '사진 촬영과 로고 제작'],
        },
        {
          best: '사이트는 이미 있고, 오픈 후 마케팅까지 맡기고 싶은 분.',
          excludes: ['신규 사이트 제작', '대폭적인 디자인 변경'],
        },
      ],
    },
    nav: { why: '왜', finder: '진단', work: '작업물', how: '진행', price: '비용', faq: '질문' },
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
    monitor: {
      eyebrow: 'Monitor',
      badge: 'Three places',
      title: 'I am taking the',
      titleAccent: 'first three clients now.',
      price: '€300',
      unit: '/ client',
      lead: 'The build is fast because I use AI for it, and that is what makes starting from strategy work at this price. It is the price of being allowed to make a case study.',
      scopeLabel: 'Included',
      scope: ['The WHY, written up as a one-page strategy sheet', 'Structure and copy', 'One page', 'Mobile', 'Through to launch'],
      excludeLabel: 'Not included',
      excludes: ['Other languages', 'Extra pages', 'Photography and logo design', 'Running it after launch'],
      termsLabel: 'What I ask in return',
      terms: ['A case study using your name and photos', 'The numbers, three months on', 'One line of testimonial'],
      cta: 'Apply for a place',
      note: 'Standard pricing follows once the case studies exist.',
      plansNote: 'Expected pricing after the monitor period',
      finderNote: 'The monitor period is open. Within a single page, three places at €300.',
    },
    pain: {
      eyebrow: 'About',
      title: 'About your site —',
      titleAccent: 'has any of this sounded familiar?',
      quotes: [
        'The site looks good. The enquiries never came.',
        'They asked me what to write, and I could not put it into words.',
        'Next to my competitors, I cannot explain why anyone should pick me.',
        'They said AI could do all of it. I spent the time and the money on bits and pieces and never finished.',
      ],
      close: 'None of these is',
      closeAccent: 'a design problem.',
    },
    finder: {
      eyebrow: 'Finder',
      title: 'Tell me two things and',
      titleAccent: "I will tell you where to start.",
      lead: 'Two choices. No email required.',
      sizeLead: 'I am',
      sizeAfter: ', and',
      painLead: 'right now',
      painAfter: '.',
      placeholder: 'choose one',
      submit: 'Show me',
      reset: 'Reset',
      resultTitle: 'Where to start',
      resultEmpty: 'Choose both and it appears here.',
      planLabel: 'Plan',
      weeksLabel: 'To launch',
      whatLabel: 'First move',
      howLabel: 'How we run it',
      excludeLabel: 'Not in this plan',
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
          plan: 1,
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
          plan: 1,
          weeks: '4 weeks',
          what: 'I write Japanese, English and Korean myself — rewritten to read natively, not translated. French goes through a native editor.',
        },
        {
          label: 'I do not know what happens after launch',
          plan: 2,
          weeks: 'from month one',
          what: 'We map where the traffic comes from — search, social, referral — and set what to do each month.',
        },
      ],
    },
    planExtra: {
      bestLabel: 'Right if',
      addsLabel: 'Everything in the landing page, plus',
      excludeLabel: 'Not included',
      items: [
        {
          best: 'you have one thing to say and want to test it on a single page.',
          excludes: ['Other languages', 'Extra pages', 'Running it after launch'],
        },
        {
          best: 'this is the face of the business and people will come back to it.',
          adds: 'Everything in the landing page, plus',
          excludes: ['Running marketing after launch', 'Photography and logo design'],
        },
        {
          best: 'the site exists and you want the marketing after launch handled too.',
          excludes: ['Building a new site', 'A full redesign'],
        },
      ],
    },
    nav: { why: 'Why', finder: 'Finder', work: 'Work', how: 'Process', price: 'Price', faq: 'FAQ' },
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
