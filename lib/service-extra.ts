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
  whatLabel: string
  howLabel: string
  cta: string
  sizes: FinderSize[]
  pains: FinderPain[]
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
  pain: PainBlock
  finder: FinderBlock
  nav: NavBlock
  eyebrows: { work: string; included: string; steps: string; price: string; compare: string; faq: string }
}

export const EXTRA: Record<Lang, Extra> = {
  ja: {
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
      whatLabel: 'まずやること',
      howLabel: '進め方',
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
          what: 'WHYの言語化から始めます。誰に・なぜ・何を言わないかが1枚に収まるまで、デザインには入りません。',
        },
        {
          label: 'サイトはあるが問い合わせが来ない',
          plan: 0,
          what: 'いまのサイトを読んで、どこで離脱しているかを見ます。作り直すより1ページに絞ったほうが早いことも多いです。',
        },
        {
          label: '多言語で出したい',
          plan: 1,
          what: '日英韓は私が書きます。翻訳ではなく、その言語で読まれる文章として書き直します。仏語はネイティブ監修つきです。',
        },
        {
          label: '公開したあと何をすればいいかわからない',
          plan: 2,
          what: '検索・SNS・紹介のどこから人を呼ぶかを設計図にして、月ごとにやることを決めます。',
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
      whatLabel: '먼저 할 일',
      howLabel: '진행 방식',
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
          what: 'WHY를 언어화하는 것부터 합니다. 누구에게·왜·무엇을 말하지 않을지가 한 장에 담기기 전까지는 디자인에 들어가지 않습니다.',
        },
        {
          label: '사이트는 있는데 문의가 없다',
          plan: 0,
          what: '지금 사이트를 읽고 어디서 이탈하는지 봅니다. 새로 만드는 것보다 한 페이지로 좁히는 게 빠를 때가 많습니다.',
        },
        {
          label: '여러 언어로 내고 싶다',
          plan: 1,
          what: '한국어·일본어·영어는 제가 씁니다. 번역이 아니라 그 언어로 읽히는 글로 다시 씁니다. 불어는 원어민 감수를 붙입니다.',
        },
        {
          label: '공개한 다음에 뭘 해야 할지 모르겠다',
          plan: 2,
          what: '검색·SNS·소개 중 어디서 사람을 데려올지 설계도로 만들고, 달마다 할 일을 정합니다.',
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
      whatLabel: 'First move',
      howLabel: 'How we run it',
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
          what: 'We start by writing the WHY. Design waits until who, why, and what we refuse to say all fit on one page.',
        },
        {
          label: 'I have a site but no enquiries',
          plan: 0,
          what: 'I read the current site and find where people leave. Narrowing to a single page is often faster than rebuilding.',
        },
        {
          label: 'I need it in several languages',
          plan: 1,
          what: 'I write Japanese, English and Korean myself — rewritten to read natively, not translated. French goes through a native editor.',
        },
        {
          label: 'I do not know what happens after launch',
          plan: 2,
          what: 'We map where the traffic comes from — search, social, referral — and set what to do each month.',
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
