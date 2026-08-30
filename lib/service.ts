import type { Lang } from '@/lib/content'

export interface ServiceContent {
  badge: string
  headline: string
  headlineAccent: string
  sub: string
  ctaPrimary: string
  ctaSecondary: string
  stats: { v: string; l: string }[]
  aiwhy: {
    eyebrow: string
    title: string
    lead: string
    canTitle: string
    can: string[]
    canNote: string
    cantTitle: string
    cant: string[]
    cantNote: string
  }
  workTitle: string
  workSub: string
  showroom: { label: string; href: string; img: string; url: string; cta: string }
  demos: { label: string; href: string; genre: string; img: string; url: string }[]
  includedTitle: string
  includedSub: string
  included: { title: string; desc: string }[]
  stepsTitle: string
  steps: { n: string; title: string; desc: string }[]
  priceTitle: string
  priceSub: string
  plans: {
    name: string
    price: string
    unit: string
    desc: string
    features: string[]
    cta: string
    featured?: boolean
  }[]
  priceNote: string
  compareTitle: string
  compareCols: string[]
  compareRows: { label: string; values: string[] }[]
  faqTitle: string
  faq: { q: string; a: string }[]
  finalTitle: string
  finalSub: string
  finalCta: string
  finalNote: string
}

const BASE = [
  { label: 'JOAYO', href: 'demos/joayo-restaurant.html', img: 'demo-joayo.jpg', url: 'joayo.paris' },
  { label: 'MILATES', href: 'demos/milates-paris.html', img: 'demo-milates.jpg', url: 'milates.paris' },
]
const withGenre = (g: string[]) => BASE.map((d, i) => ({ ...d, genre: g[i] }))

export const SERVICE: Record<Lang, ServiceContent> = {
  ja: {
    badge: 'いま相談を受け付けています',
    headline: '選ばれる理由から、',
    headlineAccent: '一緒につくります。',
    sub: 'Webサイトの制作会社ではありません。何を言うかから、一緒に決めます。',
    ctaPrimary: '相談する',
    ctaSecondary: 'つくったものを見る',
    stats: [
      { v: '4P', l: '商品・価格・売り方・伝え方まで設計' },
      { v: '1枚', l: '戦略シートに言語化してから作る' },
      { v: '4言語', l: '日英韓は私が書き、仏語は監修つき' },
      { v: '12年+', l: '事業とプロダクトをつくってきた年数' },
    ],
    aiwhy: {
      eyebrow: 'Why',
      title: '「つくる」は、AIで安くなりました。',
      lead: 'サイトを作るだけなら、もう誰でもできます。実装は私もAIで速く済ませます。それでも売れるサイトと売れないサイトが分かれるのは、作る前の「決め」が違うからです。',
      canTitle: 'AIで速くなったこと',
      can: ['実装とコーディング', 'デザイン案の物量', '多言語の下書き'],
      canNote: '私もAIで作ります。だから戦略込みで2〜4週間です。',
      cantTitle: 'AIには決められないこと',
      cant: ['誰に売るか', 'なぜあなたから買うのか', '何を言って、何を捨てるか'],
      cantNote: 'ここが私の仕事です。決めた理由ごと、戦略シートでお渡しします。',
    },
    workTitle: 'コンセプトデモ',
    workSub: '実在の店舗ではなく、「誰に・なぜ・どう売るか」から設計した自主制作です。',
    showroom: {
      label: 'Le Showroom',
      href: 'demos/showroom.html',
      img: 'demo-showroom.jpg',
      url: 'le-showroom',
      cta: '入場する',
    },
    demos: withGenre(['韓国料理店 / パリ1区', 'ウェルネス / 個人スタジオ']),
    includedTitle: '一緒に考えること',
    includedSub: 'Webサイトは、この積み上げの最後にできる成果物です。',
    included: [
      { title: '診断', desc: '目標の言い換えではなく、何が障害かを名指しします。ここが曖昧なまま作ったものは、全部飾りになります。' },
      { title: '用事と代替案', desc: 'どんな時に呼ばれるのか。うちが無ければお客はどうするのか。競合リストより先に、ここを見ます。' },
      { title: '戦場と勝ち筋', desc: 'どこで戦い、どこで戦わないか。「Xではなく、Y」の形になるまで絞ります。' },
      { title: '構成とコピー', desc: '決めた戦略をそのまま言葉にします。原稿をご用意いただく必要はありません。' },
      { title: 'デザインと実装', desc: '業種とポジショニングに合わせて設計します。スマホ対応、多言語、ドメイン設定、公開まで。' },
      { title: '公開と引き継ぎ', desc: 'ドメイン設定から公開まで。更新のやり方もお渡しします。公開後のマーケティング運用は別で、サイト制作には含みません。' },
    ],
    stepsTitle: '進め方',
    steps: [
      { n: '01', title: '聞く', desc: '30分ほど。事業のことと、いま何に困っているかを聞かせてください。' },
      { n: '02', title: '言語化する', desc: '診断から初手まで、8行の戦略シートにまとめて合意します。' },
      { n: '03', title: 'つくる', desc: '戦略をコピーとデザインに落とします。画像ではなく、実際に開けるページで確認いただきます。' },
      { n: '04', title: '渡す', desc: 'ドメインを設定して公開。更新のやり方もお渡しします。' },
      { n: '05', title: '動かす', desc: '公開してからが本番です。北極星の数字を月に一度いっしょに見て、次の一手を決めます。' },
    ],
    priceTitle: '聞くところから、公開したあとまで。',
    priceSub: '税別。着手前に金額を確定します。',
    plans: [
      {
        name: 'サイト制作',
        price: '¥200,000',
        unit: '〜 (€800〜)',
        desc: '1ページでも、10ページでも。戦略から立ち上げる、事業の顔になるサイト。',
        features: [
          '戦略シート8行(診断 → 初手)',
          '構成とコピー',
          'ページ数は相談して決定',
          '多言語',
          'スマホ対応',
          'ドメイン設定と公開',
        ],
        cta: '相談する',
      },
      {
        name: 'マーケティングパートナー',
        price: '¥15,000',
        unit: '〜 (€60〜) / 月',
        desc: '公開したあとが本体です。数字を見ながら、月ごとに次の一手を回します。',
        features: ['月1回の数字レビューと次の一手', 'サイトの更新と改善', 'SNSや記事との連携', 'いつでも解約'],
        cta: '相談する',
        featured: true,
      },
    ],
    priceNote: 'ページ数と内容で変わるため、ヒアリングの後に確定金額をお出しします。着手後の追加請求はありません。',
    compareTitle: 'どこに頼むか',
    compareCols: ['Jessy', '制作会社', 'フリーランス'],
    compareRows: [
      { label: '戦略', values: ['WHY・STP・4Pから', '要件を聞いて制作', '人による'] },
      { label: '公開まで', values: ['2〜4週間', '2〜3ヶ月', '1〜2ヶ月'] },
      { label: 'コピー', values: ['戦略シートから私が書く', '原稿は支給', '人による'] },
      { label: '多言語', values: ['4言語が標準', '別料金', 'たいてい非対応'] },
      { label: '公開後', values: ['更新手順つき・運用は別途', '保守契約', '都度依頼'] },
    ],
    faqTitle: 'よくある質問',
    faq: [
      { q: 'サイトだけ欲しいのですが。', a: 'お受けします。ただ、診断はどのプランでも最初にやります。何が問題かを決めずに作ると、コピーもデザインも決められないからです。' },
      { q: 'どれくらいかかりますか。', a: '戦略の言語化に1週間、制作に1〜3週間。1ページなら2週間、10ページ規模で4週間です。' },
      { q: 'ロゴも写真もないのですが。', a: 'よくあります。ロゴがない状態から始めた案件もありますし、写真は撮影の段取りから相談できます。' },
      { q: '公開したあと、自分で直せますか。', a: '直せます。更新の手順をお渡しします。触るのが不安なら、月額で引き受けます。' },
      { q: '英語や韓国語も書けますか。', a: '日本語・英語・韓国語は私が書きます。フランス語は書いたあと、ネイティブに見てもらいます。' },
      { q: '途中で「やっぱりこうしたい」となったら。', a: '戦略シートが固まる前なら何度でも変えられます。固まったあとも、決めた範囲の調整に追加料金はいただきません。' },
    ],
    finalTitle: 'まず30分、話しませんか。',
    finalSub: '事業の話を聞かせてください。いま何を先にやるべきかを、その場で整理してお返しします。',
    finalCta: '相談する',
    finalNote: '24時間以内に返信します。',
  },

  ko: {
    badge: '지금 상담 신청을 받고 있습니다',
    headline: '왜 선택받는지부터,',
    headlineAccent: '함께 만듭니다.',
    sub: '웹사이트 제작사가 아닙니다. 무엇을 말할지부터 같이 정합니다.',
    ctaPrimary: '상담하기',
    ctaSecondary: '작업물 보기',
    stats: [
      { v: '4P', l: '제품·가격·유통·프로모션까지 설계' },
      { v: '1장', l: '전략 시트로 정리한 뒤에 제작' },
      { v: '4개 언어', l: '한·일·영 직접 작성, 불어는 원어민 감수' },
      { v: '12년+', l: '사업과 프로덕트를 만들어 온 경력' },
    ],
    aiwhy: {
      eyebrow: 'Why',
      title: '"만드는 일"은 AI로 싸졌습니다.',
      lead: '사이트를 만들기만 하는 거라면 이제 누구나 할 수 있습니다. 구현은 저도 AI로 빠르게 끝냅니다. 그런데도 팔리는 사이트와 안 팔리는 사이트가 갈리는 건, 만들기 전의 "결정"이 다르기 때문입니다.',
      canTitle: 'AI로 빨라진 것',
      can: ['구현과 코딩', '디자인 시안의 물량', '다국어 초안'],
      canNote: '저도 AI로 만듭니다. 전략까지 포함해 2~4주면 되는 이유입니다.',
      cantTitle: 'AI가 정하지 못하는 것',
      cant: ['누구에게 팔지', '왜 여기서 사야 하는지', '무엇을 말하고 무엇을 버릴지'],
      cantNote: '이게 제 일입니다. 결정한 이유까지 전략 시트 한 장으로 드립니다.',
    },
    workTitle: '콘셉트 데모',
    workSub: '실제 매장이 아니라, "누구에게·왜·어떻게 팔까"부터 설계한 자체 제작 데모입니다.',
    showroom: {
      label: 'Le Showroom',
      href: 'demos/showroom.html',
      img: 'demo-showroom.jpg',
      url: 'le-showroom',
      cta: '입장하기',
    },
    demos: withGenre(['한식당 / 파리 1구', '웰니스 / 개인 스튜디오']),
    includedTitle: '함께 정리하는 것',
    includedSub: '웹사이트는 이 과정의 맨 끝에 나오는 결과물입니다.',
    included: [
      { title: '진단', desc: '목표를 다시 말하는 게 아니라, 무엇이 걸림돌인지 짚어냅니다. 여기가 흐릿하면 그 위에 만든 건 전부 장식이 됩니다.' },
      { title: '찾는 순간과 대안', desc: '언제 우리를 찾는지, 우리가 없으면 어디로 가는지. 경쟁사 리스트보다 이걸 먼저 봅니다.' },
      { title: '싸울 곳과 이기는 법', desc: '어디서 싸우고 어디서는 안 싸울지. \'X가 아니라 Y\'의 형태가 나올 때까지 좁힙니다.' },
      { title: '구성과 카피', desc: '정해진 전략을 그대로 카피로 옮깁니다. 원고를 준비하실 필요는 없습니다.' },
      { title: '디자인과 구현', desc: '업종과 포지셔닝에 맞춰 설계합니다. 모바일 대응, 다국어, 도메인 설정, 오픈까지.' },
      { title: '오픈과 인수인계', desc: '도메인 연결부터 오픈까지. 수정하는 방법도 함께 드립니다. 오픈 후 마케팅 운영은 별도이며 사이트 제작에는 포함하지 않습니다.' },
    ],
    stepsTitle: '진행 방식',
    steps: [
      { n: '01', title: '듣기', desc: '30분이면 됩니다. 사업 이야기와 지금 무엇이 어려운지 들려주세요.' },
      { n: '02', title: '언어화', desc: '진단부터 첫 수까지, 여덟 줄짜리 전략 시트로 정리해서 같이 확정합니다.' },
      { n: '03', title: '만들기', desc: '전략을 카피와 디자인으로 옮깁니다. 시안 이미지가 아니라 실제로 열리는 페이지로 확인합니다.' },
      { n: '04', title: '전달', desc: '도메인을 연결해 오픈합니다. 수정 방법도 함께 드립니다.' },
      { n: '05', title: '운영', desc: '오픈하고 나서가 진짜 시작입니다. 북극성 지표를 한 달에 한 번 같이 보고, 다음 한 수를 정합니다.' },
    ],
    priceTitle: '듣는 것부터, 오픈한 뒤까지.',
    priceSub: '부가세 별도. 착수 전에 금액을 확정합니다.',
    plans: [
      {
        name: '사이트 제작',
        price: '₩1,200,000',
        unit: '~ (€800~)',
        desc: '한 페이지든, 열 페이지든. 전략부터 세우는, 사업의 얼굴이 되는 사이트.',
        features: [
          '전략 시트 여덟 줄(진단 → 첫 수)',
          '구성과 카피',
          '페이지 수는 상담 후 결정',
          '다국어',
          '모바일 대응',
          '도메인 연결과 오픈',
        ],
        cta: '상담하기',
      },
      {
        name: '마케팅 파트너',
        price: '₩90,000',
        unit: '~ (€60~) / 월',
        desc: '오픈한 다음이 진짜 일입니다. 숫자를 같이 보면서, 달마다 다음 한 수를 정합니다.',
        features: ['한 달에 한 번, 지표 리뷰와 다음 한 수', '사이트 업데이트와 개선', 'SNS·콘텐츠 연계', '언제든 해지 가능'],
        cta: '상담하기',
        featured: true,
      },
    ],
    priceNote: '페이지 수와 범위에 따라 달라지므로, 상담 후에 확정 견적을 드립니다. 착수 후 추가 청구는 없습니다.',
    compareTitle: '어디에 맡길까',
    compareCols: ['Jessy', '제작사', '프리랜서'],
    compareRows: [
      { label: '전략', values: ['WHY·STP·4P부터', '요구사항대로 제작', '사람마다 다름'] },
      { label: '오픈까지', values: ['2~4주', '2~3개월', '1~2개월'] },
      { label: '카피', values: ['전략 시트를 바탕으로 직접 작성', '원고는 직접 준비', '사람마다 다름'] },
      { label: '다국어', values: ['4개 언어가 기본', '추가 비용', '대부분 불가'] },
      { label: '오픈 후', values: ['수정 방법 전달·운영은 별도', '유지보수 계약', '건별 의뢰'] },
    ],
    faqTitle: '자주 묻는 질문',
    faq: [
      { q: '사이트만 필요한데요.', a: '가능합니다. 다만 어떤 플랜이든 진단을 맨 먼저 합니다. 무엇이 문제인지 정하지 않으면 카피도 디자인도 정할 수 없기 때문입니다.' },
      { q: '기간은 얼마나 걸리나요?', a: '전략 정리에 1주, 제작에 1~3주. 1페이지면 2주, 10페이지 규모면 4주입니다.' },
      { q: '로고도 사진도 없는데요.', a: '흔한 일입니다. 로고 없이 시작한 프로젝트도 있고, 사진은 촬영 준비부터 함께 정할 수 있습니다.' },
      { q: '오픈 후에 직접 수정할 수 있나요?', a: '네. 수정 방법을 정리해 드립니다. 직접 만지기 부담스러우면 월정액으로 맡아 드립니다.' },
      { q: '일본어나 영어도 쓸 수 있나요?', a: '한국어·일본어·영어는 제가 직접 씁니다. 프랑스어는 작성 후 원어민 감수를 거칩니다.' },
      { q: '중간에 방향을 바꾸고 싶어지면요?', a: '전략 시트가 확정되기 전에는 몇 번이든 바꿀 수 있습니다. 확정 후에도 정해진 범위 안의 조정에는 추가 요금이 없습니다.' },
    ],
    finalTitle: '먼저 30분, 이야기해 볼까요?',
    finalSub: '사업 이야기를 들려주세요. 지금 무엇을 먼저 해야 할지, 그 자리에서 정리해 드립니다.',
    finalCta: '상담하기',
    finalNote: '24시간 안에 답변드립니다.',
  },

  en: {
    badge: 'Currently taking new projects',
    headline: 'First the why.',
    headlineAccent: 'Then the website.',
    sub: 'Not a web studio. We start by deciding what to say.',
    ctaPrimary: 'Start a conversation',
    ctaSecondary: 'See the work',
    stats: [
      { v: '4Ps', l: 'product, price, place, promotion — mapped' },
      { v: '1 page', l: 'strategy sheet agreed before any design' },
      { v: '4', l: 'JA EN KO written by me, FR supervised' },
      { v: '12+ yrs', l: 'building products and businesses' },
    ],
    aiwhy: {
      eyebrow: 'Why',
      title: 'AI made building cheap.',
      lead: "Anyone can ship a website now. I build with AI myself, and fast. What still separates sites that sell from sites that don't is everything decided before the build.",
      canTitle: 'What AI made fast',
      can: ['Implementation and code', 'Design variations at volume', 'Multilingual drafts'],
      canNote: 'I build with AI too. That is why strategy plus build takes 2\u20134 weeks.',
      cantTitle: "What AI can't decide",
      cant: ['Who you sell to', 'Why anyone buys from you', 'What to say, and what to cut'],
      cantNote: 'That part is my job. You get the reasoning too, on one strategy sheet.',
    },
    workTitle: 'Concept demos',
    workSub: 'Not real businesses. Self-directed pieces, each built from who, why and how to sell.',
    showroom: {
      label: 'Le Showroom',
      href: 'demos/showroom.html',
      img: 'demo-showroom.jpg',
      url: 'le-showroom',
      cta: 'Enter',
    },
    demos: withGenre(['Korean restaurant / Paris 1er', 'Wellness / private studio']),
    includedTitle: 'What we work out together',
    includedSub: 'The website is the final artifact of this stack.',
    included: [
      { title: 'The diagnosis', desc: 'Not a restated goal — a named obstacle. Anything built on a vague diagnosis is decoration.' },
      { title: 'The job, and the alternatives', desc: 'When people call you in, and where they would go if you did not exist. This comes before any list of competitors.' },
      { title: 'Where to play, how to win', desc: 'Where you fight and where you refuse to. Narrowed until it reads as X-no, Y-yes.' },
      { title: 'Structure & copy', desc: 'The strategy, written straight into words. You do not need to prepare any copy.' },
      { title: 'Design & build', desc: 'Designed to fit your industry and position. Mobile, multilingual, domain setup, launch.' },
      { title: 'Launch and hand-over', desc: 'Domain, launch, and a guide to updating it yourself. Running marketing afterwards is separate and not part of the build.' },
    ],
    stepsTitle: 'How it works',
    steps: [
      { n: '01', title: 'Listen', desc: 'About 30 minutes. Tell me about the business and what is hard right now.' },
      { n: '02', title: 'Verbalize', desc: 'Diagnosis through first move, agreed on an eight-line strategy sheet.' },
      { n: '03', title: 'Build', desc: 'Strategy becomes copy and design. You review real pages, not mockups.' },
      { n: '04', title: 'Hand over', desc: 'Domain set up, site live, and a guide to updating it yourself.' },
      { n: '05', title: 'Run', desc: 'Launch is where it starts. Once a month we look at the north-star number together and pick the next move.' },
    ],
    priceTitle: 'From listening to after opening.',
    priceSub: 'Tax excluded. Fixed before work begins.',
    plans: [
      {
        name: 'Website build',
        price: '¥200,000',
        unit: '+ (€800+)',
        desc: 'One page or ten. The face of your business, built from strategy up.',
        features: [
          'The eight-line strategy sheet (diagnosis to first move)',
          'Structure and copy',
          'Page count decided together',
          'Multilingual',
          'Mobile-ready',
          'Domain setup and launch',
        ],
        cta: 'Start a conversation',
      },
      {
        name: 'Marketing partner',
        price: '¥15,000',
        unit: '+ (€60+) / month',
        desc: 'This is the real engagement. We watch the numbers and turn the next move, month by month.',
        features: ['A monthly look at the numbers, and the next move', 'Site updates and improvements', 'Social and content tie-ins', 'Cancel anytime'],
        cta: 'Start a conversation',
        featured: true,
      },
    ],
    priceNote: 'The final quote depends on page count and scope, fixed after our first conversation. No surprise charges after we start.',
    compareTitle: 'Your options',
    compareCols: ['Jessy', 'Agency', 'Freelancer'],
    compareRows: [
      { label: 'Strategy', values: ['Why, STP and 4Ps first', 'Builds to your spec', 'Varies'] },
      { label: 'Time to launch', values: ['2–4 weeks', '2–3 months', '1–2 months'] },
      { label: 'Copy', values: ['Written by me, from the strategy sheet', "You provide it", 'Varies'] },
      { label: 'Languages', values: ['Four as standard', 'Extra cost', 'Rarely offered'] },
      { label: 'After launch', values: ['Update guide, running it is separate', 'Maintenance contract', 'Per request'] },
    ],
    faqTitle: 'FAQ',
    faq: [
      { q: 'I just want a website.', a: 'Happy to. But the diagnosis happens first on every plan. Until the problem is named, neither the copy nor the design can be decided.' },
      { q: 'How long does it take?', a: 'One week to verbalize the strategy, one to three weeks to build. Two weeks for a single page, four for a ten-page site.' },
      { q: 'I have no logo and no photos.', a: 'Very common. Some projects started with no logo at all, and photography can be arranged from scratch.' },
      { q: 'Can I edit the site myself after launch?', a: 'Yes. You get a guide to updating it. If you would rather not touch it, the monthly plan covers that.' },
      { q: 'Can you write in English or Korean?', a: 'Japanese, English and Korean I write myself. French is written, then reviewed by a native speaker.' },
      { q: 'What if I change my mind midway?', a: 'Before the strategy sheet is agreed, change anything as often as you like. After that, adjustments within the agreed scope cost nothing extra.' },
    ],
    finalTitle: 'Thirty minutes on your business.',
    finalSub: 'Tell me about it, and by the end of the call you will know what to do first.',
    finalCta: 'Start a conversation',
    finalNote: 'Replies within 24 hours.',
  },
}
