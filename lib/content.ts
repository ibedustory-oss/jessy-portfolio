export type Lang = 'ja' | 'ko' | 'en'

export const langs: Lang[] = ['ja', 'ko', 'en']

export const langLabels: Record<Lang, string> = {
  ja: 'JP',
  ko: 'KR',
  en: 'EN',
}

export interface ProjectDetail {
  about: string
  challenge: string
  concept: string
  process: string[]
  steps?: { name: string; desc: string; out?: string }[]
  result: string[]
  link?: { label: string; href: string }
  manifesto?: string
  showcase?: { label: string; href: string; img?: string }
  demos?: { label: string; href: string; genre?: string; img?: string }[]
}

export interface Project {
  slug: string
  category: string
  year: string
  title: string
  tagline: string
  overview: string
  roles: string[]
  hasDetail: boolean
  detail?: ProjectDetail
}

export interface Dict {
  meta: { title: string; description: string }
  nav: { work: string; services: string; about: string; contact: string }
  hero: {
    title: string
    sub: string
    name: string
    credential: string
    fields: string
    cta: string
  }
  intro: { heading: string; body: string; words: string[] }
  edge: {
    heading: string
    sub: string
    items: { title: string; body: string; proof: string }[]
    numbers: { v: string; l: string }[]
  }
  workSection: { heading: string; sub: string; view: string }
  projects: Project[]
  offer: {
    label: string
    heading: string
    body: string
    points: string[]
    cta: string
    note: string
  }
  how: {
    heading: string
    sub: string
    steps: { num: string; name: string; desc: string; items: string[] }[]
  }
  services: {
    heading: string
    note: string
    groups: { num: string; name: string; sub: string; items: string[] }[]
  }
  about: {
    heading: string
    name: string
    credential: string
    title: string
    body: string[]
  }
  career: {
    heading: string
    sub: string
    items: { period: string; role: string; org: string; desc: string }[]
  }
  contact: {
    heading: string
    line: string
    desc: string
    bullets: string[]
    cta: string
    form: {
      name: string
      email: string
      company: string
      message: string
      submit: string
    }
  }
  detailLabels: {
    about: string
    challenge: string
    concept: string
    role: string
    process: string
    result: string
    visual: string
    visualNote: string
    back: string
    next: string
    demos: string
    deliverable: string
  }
}

const dictionaries: Record<Lang, Dict> = {
  /* ------------------------------------------------------------------ JA */
  ja: {
    meta: {
      title: 'Jessy (Giyoung) Jung｜新規事業・ブランド・Web・SNS',
      description:
        '新規事業やブランドの0→1から、Web制作・SNSまで支援するJessy (Giyoung) Jungのポートフォリオ。',
    },
    nav: { work: 'Work', services: 'Services', about: 'About', contact: 'Contact' },
    hero: {
      title: 'アイデアを、事業に。',
      sub: 'まだ形になっていないアイデアから、事業、ブランド、Web、SNSまで一緒につくります。',
      name: 'Jessy (Giyoung) Jung',
      credential: '米国公認会計士（U.S. CPA）',
      fields: 'Strategy / Business / Brand / Web / Social',
      cta: 'Projectsを見る',
    },
    intro: {
      heading: 'What I do',
      body: '事業をつくるとき、ブランド、Web、SNSを別々には考えません。「誰に、何を、なぜ届けるのか」から考え、必要なものを一緒につくります。',
      words: ['Business', 'Brand', 'Web', 'Social'],
    },
    edge: {
      heading: 'The Difference',
      sub: '戦略と実装と数字を、同じ人が地続きで見ます。',
      items: [
        {
          title: '実装がわかる',
          body: 'エンジニアとして8年、実際にコードを書いてきました。だからスコープを切るとき、どこが重くてどこが軽いかが読めます。エンジニアと同じ言葉で話せます。',
          proof: 'Ateamでプロジェクトエンジニア8年。日本・インドネシアで新規サービス開発をリード。',
        },
        {
          title: '数字を持てる',
          body: '米国公認会計士です。ユニットエコノミクスと価格から逆算して、事業として成立するかを先に確かめます。新規事業のP&Lを持った経験があります。',
          proof: 'nonpiで新規事業のP&Lを主導。2,500社以上が使う採用SaaSのGTM・機能企画を担当。',
        },
        {
          title: 'AIで運用まで作る',
          body: '企画から品質チェック、配信までをAIエージェントの仕組みとして組み立てました。編集部の規模でやる作業が、毎週それで動いています。',
          proof: 'Atelier Why:動画選定→AI品質ゲート→制作→メール/LINE配信まで自動化し、サブスクとして運営中。',
        },
      ],
      numbers: [
        { v: '8年', l: 'エンジニアとしての開発経験' },
        { v: '2,500社+', l: 'GTMを担当したSaaSの導入社数' },
        { v: '毎週', l: 'AIで回す編集オペレーション' },
        { v: '3言語', l: '日本語・英語・韓国語で仕事' },
      ],
    },
    workSection: {
      heading: 'Selected Work',
      sub: '自ら0から立ち上げたプロジェクトを中心に。',
      view: 'Case Studyを見る',
    },
    projects: [
      {
        slug: 'atelier-why',
        category: 'MEDIA / EDUCATION / 0→1',
        year: '2025 —',
        title: 'Atelier Why',
        tagline: 'AI時代を生きる親のためのメディア。',
        overview:
          'AI時代の子育て・英語・教育・思考力をテーマにしたメディア。コンセプト設計からブランド、コンテンツ、Web、SNSまで一貫して立ち上げ・運営。',
        roles: ['Founder', 'Concept', 'Branding', 'Content', 'Web', 'SNS', 'Media Development'],
        hasDetail: true,
        detail: {
          about:
            'AI時代の子育て・英語・教育・思考力をテーマにしたメディア。週ごとのテーマ設計、動画キュレーション、思考力ワークシート、記事、SNS、メール配信まで、企画と運営のすべてをゼロから立ち上げた。',
          challenge:
            '子ども向けの教育コンテンツは世の中に無限にあるのに、「今週、何をどう届ければいいか」に答えてくれるものがない。情報が多すぎる時代、いちばん難しいのは「選ぶこと」。その負担を親から引き受けるサービスを、コンセプトから設計する必要があった。',
          concept:
            '「なぜ？」から始まる学びを、毎週届く形に。AIによるキュレーションと編集の視点を組み合わせ、動画・ワークシート・記事を年齢別の週次プログラムとして編集する。英語を教える教材ではなく、考える力を育てるメディアとして設計した。',
          process: ['Concept', 'Brand', 'Web', 'Product', 'Content', 'Launch', 'Operation'],
          result: [
            'サブスクリプションサービスとしてローンチ',
            '年齢別・週次プログラムの継続運営',
            'Web・SNS・メール・LINEを横断するブランド構築',
            'AIを組み込んだ編集オペレーションの構築',
          ],
          link: { label: 'atelier-why.com', href: 'https://atelier-why.com' },
        },
      },
      {
        slug: 'food-school',
        category: 'FOOD / LOCAL / BUSINESS DEVELOPMENT',
        year: '2026 —',
        title: '食の学校',
        tagline: '食から、地域の未来をつくる。',
        overview:
          '地域の食文化・技術・人を起点に、新しい学び・体験・事業をつくるプロジェクト。事業コンセプトからブランド、採用、SNS、体験設計まで横断して担当。',
        roles: [
          'Project Development',
          'Concept',
          'Branding',
          'Experience Design',
          'Recruiting',
          'SNS',
          'Communication',
          'Business Development',
        ],
        hasDetail: true,
        detail: {
          about:
            '新潟・弥彦と燕三条エリアを舞台に、地域の食文化・技術・人を起点として、新しい学びと事業をつくるプロジェクト。事業コンセプトの設計から、募集コミュニケーション、SNS、体験プログラムまでを横断して担当。',
          challenge:
            '地域には食の技術と文化が確かにあるのに、それを「仕事」として受け取る次の担い手が足りない。求人でも、料理教室でもない。地域の食を起点に、働き方と事業のつくり方そのものを学ぶ枠組みが必要だった。',
          concept:
            '開業の一巡目を、資本を張る前に生きる。座学ではなく、地域の現場で事業の一巡を経験する学びとして設計。コンセプトから募集コミュニケーション、SNS、体験プログラムまでを一つのブランドとして構築した。',
          process: ['Research', 'Concept', 'Brand', 'Recruiting', 'Content', 'Experience'],
          result: [
            'プロジェクトのローンチと0期生募集の開始',
            '採用コミュニケーション・LPの設計',
            'SNS・リール運用の立ち上げ',
            '地域の生産者・事業者との連携づくり',
          ],
        },
      },
      {
        slug: 'social-brand',
        category: 'SOCIAL / CONTENT / BRAND',
        year: 'Ongoing',
        title: 'Social / Brand Communication',
        tagline: 'フォロワー数ではなく、ブランドの声をつくる。',
        overview:
          'SNSを数字のためではなく、ブランドの人格を伝える場として設計する。Brand Voiceの定義から、コンテンツ戦略、フィード・リール・ストーリーの設計、Webとの連携、キャンペーンまで。',
        roles: [
          'Brand Voice',
          'Content Strategy',
          'Feed / Reel / Story',
          'Campaign',
          'Editorial Concept',
        ],
        hasDetail: false,
      },
    ],
    offer: {
      label: '戦略とWeb',
      heading: '「なぜ選ばれるのか」から、一緒につくります。',
      body: 'WHYの言語化、ターゲティング、ポジショニング、4P。戦略を決めてから、Webサイトという形にします。',
      points: ['WHY・STP・4Pの戦略シート', '原稿の準備は不要', '戦略から公開まで一気通貫'],
      cta: '料金と進め方を見る',
      note: 'いま相談を受け付けています。',
    },
    how: {
      heading: 'From zero to one.',
      sub: 'まだ形になっていないものを、事業にするまでの4つのステップ。',
      steps: [
        {
          num: '01',
          name: 'FIND',
          desc: 'まだ言葉になっていない価値を見つける。',
          items: ['Research', 'Customer', 'Market', 'Insight'],
        },
        {
          num: '02',
          name: 'DEFINE',
          desc: '「何をつくるのか」を言葉にする。',
          items: ['Concept', 'Positioning', 'Brand', 'Story', 'Customer'],
        },
        {
          num: '03',
          name: 'BUILD',
          desc: '実際に形にする。',
          items: ['Business', 'Service', 'Brand', 'Website', 'Content'],
        },
        {
          num: '04',
          name: 'GROW',
          desc: '人に届ける。',
          items: ['Social', 'Content', 'Community', 'Campaign', 'PR'],
        },
      ],
    },
    services: {
      heading: 'Services',
      note: 'できることを細かく並べるより、大きく三つ。',
      groups: [
        {
          num: '01',
          name: 'Zero-to-One',
          sub: '新規事業・プロジェクト立ち上げ',
          items: [
            'Business Development',
            'Concept',
            'New Business',
            'Service Design',
            'Research',
            'Project Direction',
          ],
        },
        {
          num: '02',
          name: 'Brand & Web',
          sub: 'ブランドとWebを、一つの体験として',
          items: [
            'Brand Concept',
            'Website',
            'Landing Page',
            'Information Architecture',
            'UX',
            'Copywriting',
            'Creative Direction',
          ],
        },
        {
          num: '03',
          name: 'Social & Content',
          sub: 'ブランドの声を、コンテンツに',
          items: [
            'SNS Strategy',
            'Instagram',
            'Content Planning',
            'Content Direction',
            'Creative Direction',
            'Media Operation',
          ],
        },
      ],
    },
    about: {
      heading: 'About',
      name: 'Jessy (Giyoung) Jung',
      credential: '米国公認会計士（U.S. CPA）',
      title: '0→1 Product Manager / Business Builder',
      body: [
        '新規事業やブランドの0→1を中心に、事業企画、コンセプト、ブランド、Web、SNSまで横断して仕事をしています。',
        'キャリアは、エンジニア8年 → 米国公認会計士 → SaaSプロダクトマネージャー → 事業立ち上げ。実装・数字・プロダクトの三つの言葉を話せることが、PMとしての差別化です。',
        '今はその全部をAIエージェントに接続し、「考える→作る→運用する」が途切れない体制をつくっています。',
      ],
    },
    career: {
      heading: 'Career',
      sub: 'エンジニアリング、ビジネス、プロダクト、そして0→1へ。',
      items: [
        {
          period: '2026 —',
          role: 'Project Leader',
          org: '食の学校プロジェクト',
          desc: '地域の食文化を起点に、事業立ち上げと一体になった学びの場をつくるプロジェクトを主導。',
        },
        {
          period: '2026 —',
          role: 'Founder',
          org: 'Atelier Why',
          desc: 'AI時代の家庭学習メンバーシップを、コンテンツから配信まで立ち上げ・運営。',
        },
        {
          period: '2024 – 2026',
          role: 'Product Manager',
          org: 'Thinkings株式会社',
          desc: '2,500社以上が利用する採用SaaS「sonar ATS」のGTM・機能企画を担当。',
        },
        {
          period: '2021 – 2023',
          role: 'Product Manager / Division Manager',
          org: 'nonpi',
          desc: '新規事業の立ち上げとP&L、組織開発・人事制度設計を主導。',
        },
        {
          period: '2018 – 2019',
          role: 'Tax Associate',
          org: 'BDO USA',
          desc: '米国ミシガン州にて、法人・個人の税務申告と日系駐在員の税務に従事。',
        },
        {
          period: '2008 – 2016',
          role: 'Project Engineer',
          org: 'Ateam Inc.',
          desc: 'Web・モバイルサービスの開発と、日本・インドネシアでの新規サービス立ち上げをリード。',
        },
      ],
    },
    contact: {
      heading: 'Have something you want to build?',
      line: 'まだ形になっていなくても、大丈夫です。',
      desc: 'たとえば、こんな段階からご相談いただけます。',
      bullets: [
        '新しい事業を始めたい',
        'ブランドを作りたい',
        'Webを作りたい',
        'SNSを整理したい',
        'アイデアはあるが、まだまとまっていない',
      ],
      cta: '相談する →',
      form: {
        name: 'お名前',
        email: 'メール',
        company: '会社名 / プロジェクト名',
        message: 'ご相談内容',
        submit: '送信する →',
      },
    },
    detailLabels: {
      about: 'About',
      challenge: 'Challenge',
      concept: 'Concept',
      role: 'My Role',
      process: 'Process',
      result: 'Result',
      visual: 'Visual Output',
      visualNote: 'Visuals coming soon',
      back: 'Back to Work',
      next: 'Next Project',
      demos: 'Live Demos',
      deliverable: 'Deliverable',
    },
  },

  /* ------------------------------------------------------------------ KO */
  ko: {
    meta: {
      title: 'Jessy (Giyoung) Jung｜비즈니스·브랜드·웹·SNS',
      description:
        '새로운 비즈니스와 브랜드의 0→1 단계부터 웹사이트와 SNS까지 함께 만드는 Jessy (Giyoung) Jung의 포트폴리오.',
    },
    nav: { work: 'Work', services: 'Services', about: 'About', contact: 'Contact' },
    hero: {
      title: '아이디어를, 비즈니스로.',
      sub: '아직 형태가 없는 아이디어에서 시작해 비즈니스, 브랜드, 웹사이트, SNS까지 함께 만듭니다.',
      name: 'Jessy (Giyoung) Jung',
      credential: '미국 공인회계사 (U.S. CPA)',
      fields: 'Strategy / Business / Brand / Web / Social',
      cta: 'Projects 보기',
    },
    intro: {
      heading: 'What I do',
      body: '비즈니스를 만들 때 브랜드, 웹, SNS를 따로 생각하지 않습니다. "누구에게, 무엇을, 왜 전할 것인가"에서 시작해, 필요한 것을 함께 만듭니다.',
      words: ['Business', 'Brand', 'Web', 'Social'],
    },
        edge: {
      heading: 'The Difference',
      sub: '전략, 구현, 숫자를 한 사람이 끊김 없이 봅니다.',
      items: [
        {
          title: '구현을 아는 PM',
          body: '엔지니어로 8년, 직접 코드를 짰습니다. 그래서 스코프를 자를 때 어디가 무겁고 어디가 가벼운지 보입니다. 엔지니어와 같은 언어로 이야기할 수 있습니다.',
          proof: 'Ateam에서 프로젝트 엔지니어 8년. 일본·인도네시아에서 신규 서비스 개발 리드.',
        },
        {
          title: '숫자로 판단하는 PM',
          body: '미국 공인회계사입니다. 유닛 이코노믹스와 가격에서 역산해, 사업이 되는지부터 먼저 확인합니다. 신규 사업의 P&L을 직접 맡아 본 경험이 있습니다.',
          proof: 'nonpi에서 신규 사업 P&L 주도. 2,500개사 이상이 쓰는 채용 SaaS의 GTM·기능 기획 담당.',
        },
        {
          title: 'AI로 운영까지 만드는 PM',
          body: '기획부터 품질 체크, 발송까지를 AI 에이전트 구조로 짰습니다. 편집팀 규모의 일이 매주 그 시스템으로 돌아갑니다.',
          proof: 'Atelier Why: 영상 선정→AI 품질 게이트→제작→메일/LINE 발송까지 자동화해 구독 서비스로 운영 중.',
        },
      ],
      numbers: [
        { v: '8년', l: '엔지니어 개발 경력' },
        { v: '2,500개사+', l: 'GTM을 담당한 SaaS의 도입 기업 수' },
        { v: '매주', l: 'AI로 돌아가는 편집 운영' },
        { v: '3개 언어', l: '일본어·영어·한국어로 일합니다' },
      ],
    },
    workSection: {
      heading: 'Selected Work',
      sub: '직접 0부터 만든 프로젝트 중심으로.',
      view: 'Case Study 보기',
    },
    projects: [
      {
        slug: 'atelier-why',
        category: 'MEDIA / EDUCATION / 0→1',
        year: '2025 —',
        title: 'Atelier Why',
        tagline: 'AI 시대를 살아가는 부모를 위한 미디어.',
        overview:
          'AI 시대의 육아·영어·교육·사고력을 주제로 한 미디어. 콘셉트 설계부터 브랜드, 콘텐츠, 웹, SNS까지 일관되게 만들고 운영하고 있습니다.',
        roles: ['Founder', 'Concept', 'Branding', 'Content', 'Web', 'SNS', 'Media Development'],
        hasDetail: true,
        detail: {
          about:
            'AI 시대의 육아·영어·교육·사고력을 주제로 한 미디어. 주간 테마 설계, 영상 큐레이션, 사고력 워크시트, 아티클, SNS, 이메일 발송까지 기획과 운영 전체를 0에서 만들었다.',
          challenge:
            '아이를 위한 교육 콘텐츠는 세상에 넘쳐나는데, "이번 주에 무엇을 어떻게 보여줄까"에 답해주는 것은 없다. 정보가 너무 많은 시대, 가장 어려운 것은 "고르는 일". 그 부담을 부모에게서 덜어주는 서비스를 콘셉트부터 설계해야 했다.',
          concept:
            '"왜?"에서 시작하는 배움을, 매주 도착하는 형태로. AI 큐레이션과 에디토리얼 관점을 결합해 영상·워크시트·아티클을 연령별 주간 프로그램으로 편집한다. 영어를 가르치는 교재가 아니라, 생각하는 힘을 키우는 미디어로 설계했다.',
          process: ['Concept', 'Brand', 'Web', 'Product', 'Content', 'Launch', 'Operation'],
          result: [
            '구독 서비스로 론칭',
            '연령별 주간 프로그램의 지속 운영',
            '웹·SNS·이메일·LINE을 아우르는 브랜드 구축',
            'AI를 결합한 1인 운영 에디토리얼 체계',
          ],
          link: { label: 'atelier-why.com', href: 'https://atelier-why.com' },
        },
      },
      {
        slug: 'food-school',
        category: 'FOOD / LOCAL / BUSINESS DEVELOPMENT',
        year: '2026 —',
        title: '식(食)의 학교',
        tagline: '음식에서 시작해, 지역의 미래를 만듭니다.',
        overview:
          '지역의 식문화·기술·사람을 기점으로 새로운 배움·경험·비즈니스를 만드는 프로젝트. 사업 콘셉트부터 브랜드, 리크루팅, SNS, 경험 설계까지 폭넓게 담당.',
        roles: [
          'Project Development',
          'Concept',
          'Branding',
          'Experience Design',
          'Recruiting',
          'SNS',
          'Communication',
          'Business Development',
        ],
        hasDetail: true,
        detail: {
          about:
            '니가타현 야히코와 쓰바메산조 지역을 무대로, 지역의 식문화·기술·사람을 기점으로 새로운 배움과 비즈니스를 만드는 프로젝트. 사업 콘셉트 설계부터 모집 커뮤니케이션, SNS, 경험 프로그램까지 폭넓게 담당.',
          challenge:
            '지역에는 분명 음식의 기술과 문화가 있는데, 그것을 "일"로 이어받을 다음 세대가 부족하다. 채용 공고도, 요리 교실도 아닌, 지역의 음식을 기점으로 일하는 방식과 사업을 만드는 방법 자체를 배우는 틀이 필요했다.',
          concept:
            '창업의 첫 사이클을, 자본을 걸기 전에 살아보기. 강의실이 아니라 지역의 현장에서 사업의 한 사이클을 경험하는 배움으로 설계. 콘셉트부터 모집 커뮤니케이션, SNS, 경험 프로그램까지 하나의 브랜드로 구축했다.',
          process: ['Research', 'Concept', 'Brand', 'Recruiting', 'Content', 'Experience'],
          result: [
            '프로젝트 론칭과 0기생 모집 시작',
            '리크루팅 커뮤니케이션·LP 설계',
            'SNS·릴스 운영 시작',
            '지역 생산자·사업자와의 연결 구축',
          ],
        },
      },
      {
        slug: 'social-brand',
        category: 'SOCIAL / CONTENT / BRAND',
        year: 'Ongoing',
        title: 'Social / Brand Communication',
        tagline: '팔로워 수가 아니라, 브랜드의 목소리를 만듭니다.',
        overview:
          'SNS를 숫자를 위한 것이 아니라, 브랜드의 인격을 전하는 공간으로 설계합니다. Brand Voice 정의부터 콘텐츠 전략, 피드·릴스·스토리 설계, 웹과의 연계, 캠페인까지.',
        roles: [
          'Brand Voice',
          'Content Strategy',
          'Feed / Reel / Story',
          'Campaign',
          'Editorial Concept',
        ],
        hasDetail: false,
      },
    ],
    offer: {
      label: '전략과 웹',
      heading: '"왜 선택받는지"부터, 함께 만듭니다.',
      body: 'WHY의 언어화, 타깃팅, 포지셔닝, 4P까지. 전략을 정한 다음, 웹사이트로 완성합니다.',
      points: ['WHY·STP·4P 전략 시트', '원고 준비는 필요 없음', '전략부터 오픈까지 한 번에'],
      cta: '요금과 진행 방식 보기',
      note: '지금 상담 신청을 받고 있습니다.',
    },
    how: {
      heading: 'From zero to one.',
      sub: '아직 형태가 없는 것을 비즈니스로 만들기까지, 네 단계.',
      steps: [
        {
          num: '01',
          name: 'FIND',
          desc: '아직 말로 정리되지 않은 가치를 찾습니다.',
          items: ['Research', 'Customer', 'Market', 'Insight'],
        },
        {
          num: '02',
          name: 'DEFINE',
          desc: '"무엇을 만들 것인가"를 말로 정리합니다.',
          items: ['Concept', 'Positioning', 'Brand', 'Story', 'Customer'],
        },
        {
          num: '03',
          name: 'BUILD',
          desc: '실제로 형태를 만듭니다.',
          items: ['Business', 'Service', 'Brand', 'Website', 'Content'],
        },
        {
          num: '04',
          name: 'GROW',
          desc: '사람들에게 전달합니다.',
          items: ['Social', 'Content', 'Community', 'Campaign', 'PR'],
        },
      ],
    },
    services: {
      heading: 'Services',
      note: '세부 서비스를 나열하기보다, 크게 세 가지.',
      groups: [
        {
          num: '01',
          name: 'Zero-to-One',
          sub: '새로운 비즈니스·프로젝트의 시작',
          items: [
            'Business Development',
            'Concept',
            'New Business',
            'Service Design',
            'Research',
            'Project Direction',
          ],
        },
        {
          num: '02',
          name: 'Brand & Web',
          sub: '브랜드와 웹을 하나의 경험으로',
          items: [
            'Brand Concept',
            'Website',
            'Landing Page',
            'Information Architecture',
            'UX',
            'Copywriting',
            'Creative Direction',
          ],
        },
        {
          num: '03',
          name: 'Social & Content',
          sub: '브랜드의 목소리를 콘텐츠로',
          items: [
            'SNS Strategy',
            'Instagram',
            'Content Planning',
            'Content Direction',
            'Creative Direction',
            'Media Operation',
          ],
        },
      ],
    },
    about: {
      heading: 'About',
      name: 'Jessy (Giyoung) Jung',
      credential: '미국 공인회계사 (U.S. CPA)',
      title: '0→1 Product Manager / Business Builder',
      body: [
        '새로운 비즈니스와 브랜드의 0→1 단계에서 사업 기획, 콘셉트, 브랜딩, 웹사이트, SNS까지 폭넓게 함께하고 있습니다.',
        '커리어는 엔지니어 8년 → 미국 공인회계사 → SaaS 프로덕트 매니저 → 사업 론칭. 구현·숫자·프로덕트, 세 가지 언어를 모두 말할 수 있다는 것이 PM으로서의 차별점입니다.',
        '지금은 그 전부를 AI 에이전트에 연결해, \"생각한다 → 만든다 → 운영한다\"가 끊기지 않는 체계를 만들고 있습니다.',
      ],
    },
    career: {
      heading: 'Career',
      sub: '엔지니어링, 비즈니스, 프로덕트, 그리고 0→1로.',
      items: [
        {
          period: '2026 —',
          role: 'Project Leader',
          org: '식(食)의 학교 프로젝트',
          desc: '지역 식문화를 기점으로, 사업 론칭과 배움이 하나 된 프로젝트를 리드.',
        },
        {
          period: '2026 —',
          role: 'Founder',
          org: 'Atelier Why',
          desc: 'AI 시대의 가정 학습 멤버십을 콘텐츠부터 배송까지 구축·운영.',
        },
        {
          period: '2024 – 2026',
          role: 'Product Manager',
          org: 'Thinkings (Japan)',
          desc: '2,500개사 이상이 쓰는 채용 SaaS "sonar ATS"의 GTM과 기능 기획 담당.',
        },
        {
          period: '2021 – 2023',
          role: 'Product Manager / Division Manager',
          org: 'nonpi',
          desc: '신규 사업 론칭과 P&L, 조직 개발·인사 제도 설계를 주도.',
        },
        {
          period: '2018 – 2019',
          role: 'Tax Associate',
          org: 'BDO USA',
          desc: '미국 미시간주에서 법인·개인 세무 신고와 일본 주재원 세무 담당.',
        },
        {
          period: '2008 – 2016',
          role: 'Project Engineer',
          org: 'Ateam Inc.',
          desc: '웹·모바일 서비스 개발과 일본·인도네시아 신규 서비스 론칭 리드.',
        },
      ],
    },
    contact: {
      heading: 'Have something you want to build?',
      line: '아직 아이디어가 완성되지 않아도 괜찮습니다.',
      desc: '예를 들어, 이런 단계부터 이야기할 수 있습니다.',
      bullets: [
        '새로운 비즈니스를 시작하고 싶다',
        '브랜드를 만들고 싶다',
        '웹사이트를 만들고 싶다',
        'SNS를 정리하고 싶다',
        '아이디어는 있지만 아직 정리되지 않았다',
      ],
      cta: '이야기 나누기 →',
      form: {
        name: '이름',
        email: '이메일',
        company: '회사 / 프로젝트',
        message: '문의 내용',
        submit: '보내기 →',
      },
    },
    detailLabels: {
      about: 'About',
      challenge: 'Challenge',
      concept: 'Concept',
      role: 'My Role',
      process: 'Process',
      result: 'Result',
      visual: 'Visual Output',
      visualNote: 'Visuals coming soon',
      back: 'Back to Work',
      next: 'Next Project',
      demos: 'Live Demos',
      deliverable: 'Deliverable',
    },
  },

  /* ------------------------------------------------------------------ EN */
  en: {
    meta: {
      title: 'Jessy (Giyoung) Jung — Independent Business & Brand Builder',
      description:
        'Business development, branding, web and social strategy by Jessy (Giyoung) Jung, U.S. CPA.',
    },
    nav: { work: 'Work', services: 'Services', about: 'About', contact: 'Contact' },
    hero: {
      title: 'Ideas into reality.',
      sub: 'I build businesses, brands and ideas from zero to one.',
      name: 'Jessy (Giyoung) Jung',
      credential: 'U.S. CPA',
      fields: 'Strategy / Business / Brand / Web / Social',
      cta: 'View selected work',
    },
    intro: {
      heading: 'What I do',
      body: "When I build a business, I don't treat brand, web and social as separate projects. I start from who it is for, what it offers and why it matters — then build what's needed, end to end.",
      words: ['Business', 'Brand', 'Web', 'Social'],
    },
        edge: {
      heading: 'The Difference',
      sub: 'Strategy, build and numbers, watched by the same person without a handoff.',
      items: [
        {
          title: 'Speaks implementation',
          body: 'Eight years writing code before I ever wrote a spec. When I cut scope I can tell what is expensive and what is cheap, and I can say it in the same language the engineers use.',
          proof: 'Project engineer at Ateam for 8 years; led new service development in Japan and Indonesia.',
        },
        {
          title: 'Owns the numbers',
          body: 'I am a U.S. CPA. I work backwards from unit economics and pricing to check whether something holds up as a business first. I have owned a new-business P&L.',
          proof: 'Led new-business P&L at nonpi; GTM and feature planning for a recruiting SaaS used by 2,500+ companies.',
        },
        {
          title: 'Builds AI operations',
          body: 'Planning, quality checks and distribution are wired together as an agent system. Work that would take an editorial team now runs on it every week.',
          proof: 'Atelier Why: curation → AI quality gates → production → email/LINE delivery, automated and running as a subscription.',
        },
      ],
      numbers: [
        { v: '8 yrs', l: 'as a software engineer' },
        { v: '2,500+', l: 'companies on the SaaS I ran GTM for' },
        { v: 'Weekly', l: 'AI-powered editorial operation' },
        { v: '3', l: 'working languages — JA · EN · KO' },
      ],
    },
    workSection: {
      heading: 'Selected Work',
      sub: 'Projects I founded and built from zero.',
      view: 'View case study',
    },
    projects: [
      {
        slug: 'atelier-why',
        category: 'MEDIA / EDUCATION / 0→1',
        year: '2025 —',
        title: 'Atelier Why',
        tagline: 'A media brand for parents raising children in the age of AI.',
        overview:
          'A media brand exploring parenting, English, education and thinking skills in the age of AI. Founded and operated end to end — from concept and brand to content, web and social.',
        roles: ['Founder', 'Concept', 'Branding', 'Content', 'Web', 'SNS', 'Media Development'],
        hasDetail: true,
        detail: {
          about:
            'A media brand on parenting, English, education and thinking skills in the age of AI. Weekly theme design, video curation, thinking-skills worksheets, articles, social and email — the whole editorial operation, built from zero.',
          challenge:
            "There is an infinite supply of educational content for children, yet nothing that answers the question parents actually have: what should we watch this week, and how? In an age of too much information, choosing is the hardest part. The service had to be designed from the concept up to take that burden off parents.",
          concept:
            'Learning that starts with "why?", delivered every week. Combining AI-powered curation with an editorial point of view, videos, worksheets and articles are edited into age-based weekly programs. Designed not as English-teaching material, but as a media brand that grows thinking skills.',
          process: ['Concept', 'Brand', 'Web', 'Product', 'Content', 'Launch', 'Operation'],
          result: [
            'Launched as a subscription service',
            'Ongoing weekly programs by age group',
            'A brand spanning web, social, email and LINE',
            'An AI-powered editorial operation, built from scratch',
          ],
          link: { label: 'atelier-why.com', href: 'https://atelier-why.com' },
        },
      },
      {
        slug: 'food-school',
        category: 'FOOD / LOCAL / BUSINESS DEVELOPMENT',
        year: '2026 —',
        title: 'Food School',
        tagline: 'Building the future of a region, starting from food.',
        overview:
          'A project that turns a region’s food culture, craft and people into new forms of learning, experience and business. Responsible across business concept, brand, recruiting, social and experience design.',
        roles: [
          'Project Development',
          'Concept',
          'Branding',
          'Experience Design',
          'Recruiting',
          'SNS',
          'Communication',
          'Business Development',
        ],
        hasDetail: true,
        detail: {
          about:
            'Set in Yahiko and the Tsubame-Sanjo area of Niigata, Japan — a project that builds new learning and business from the region’s food culture, craft and people. Responsible across business concept, recruiting communication, social and experience programs.',
          challenge:
            'The region has real culinary craft and culture — but not enough people to carry it forward as a livelihood. Not a job posting, not a cooking class: it needed a framework for learning how to build a way of working, and a business, starting from local food.',
          concept:
            'Live the first cycle of starting a business — before betting your capital on it. Designed not as classroom study but as learning through a full business cycle in the field. Concept, recruiting communication, social and experience programs were built as one coherent brand.',
          process: ['Research', 'Concept', 'Brand', 'Recruiting', 'Content', 'Experience'],
          result: [
            'Project launch and first-cohort recruiting',
            'Recruiting communication and landing page',
            'Social and short-form video operation',
            'Partnerships with local producers and businesses',
          ],
        },
      },
      {
        slug: 'social-brand',
        category: 'SOCIAL / CONTENT / BRAND',
        year: 'Ongoing',
        title: 'Social / Brand Communication',
        tagline: 'Not follower counts — a brand voice.',
        overview:
          'Social designed not for numbers, but as the place where a brand’s character comes through. From brand voice and content strategy to feed, reels, stories, campaigns and how it all connects back to the web.',
        roles: [
          'Brand Voice',
          'Content Strategy',
          'Feed / Reel / Story',
          'Campaign',
          'Editorial Concept',
        ],
        hasDetail: false,
      },
    ],
    offer: {
      label: 'Strategy & Web',
      heading: 'First the why. Then the website.',
      body: 'We articulate your why, decide targeting and positioning, map the 4Ps — then ship it all as a site.',
      points: ['A one-page strategy sheet', 'No copy needed from you', 'Strategy through launch, one thread'],
      cta: 'See pricing and process',
      note: 'Currently taking new projects.',
    },
    how: {
      heading: 'From zero to one.',
      sub: 'Four steps from something that doesn’t exist yet to a working business.',
      steps: [
        {
          num: '01',
          name: 'FIND',
          desc: 'Find the value that hasn’t been put into words yet.',
          items: ['Research', 'Customer', 'Market', 'Insight'],
        },
        {
          num: '02',
          name: 'DEFINE',
          desc: 'Put what to build into words.',
          items: ['Concept', 'Positioning', 'Brand', 'Story', 'Customer'],
        },
        {
          num: '03',
          name: 'BUILD',
          desc: 'Make it real.',
          items: ['Business', 'Service', 'Brand', 'Website', 'Content'],
        },
        {
          num: '04',
          name: 'GROW',
          desc: 'Bring it to people.',
          items: ['Social', 'Content', 'Community', 'Campaign', 'PR'],
        },
      ],
    },
    services: {
      heading: 'Services',
      note: 'Three ways of working — not a menu of deliverables.',
      groups: [
        {
          num: '01',
          name: 'Zero-to-One',
          sub: 'New business & project development',
          items: [
            'Business Development',
            'Concept',
            'New Business',
            'Service Design',
            'Research',
            'Project Direction',
          ],
        },
        {
          num: '02',
          name: 'Brand & Web',
          sub: 'Brand and web as one experience',
          items: [
            'Brand Concept',
            'Website',
            'Landing Page',
            'Information Architecture',
            'UX',
            'Copywriting',
            'Creative Direction',
          ],
        },
        {
          num: '03',
          name: 'Social & Content',
          sub: 'A brand voice, made into content',
          items: [
            'SNS Strategy',
            'Instagram',
            'Content Planning',
            'Content Direction',
            'Creative Direction',
            'Media Operation',
          ],
        },
      ],
    },
    about: {
      heading: 'About',
      name: 'Jessy (Giyoung) Jung',
      credential: 'U.S. CPA',
      title: '0→1 Product Manager / Business Builder',
      body: [
        'I work with businesses and ideas at the zero-to-one stage — shaping concepts, building brands, creating websites and designing how they communicate with the world.',
        'My path: eight years as an engineer → U.S. CPA → SaaS product manager → founder. Speaking all three languages — implementation, numbers and product — is what sets me apart as a PM.',
        'Today I wire all of it into AI agents so the full loop — think, build, operate — never breaks.',
      ],
    },
    career: {
      heading: 'Career',
      sub: 'Engineering, business, product — and now, zero to one.',
      items: [
        {
          period: '2026 —',
          role: 'Project Leader',
          org: 'Food School Project',
          desc: 'Leading a project where launching a real food business and learning are one and the same, built on a region’s culinary culture.',
        },
        {
          period: '2026 —',
          role: 'Founder',
          org: 'Atelier Why',
          desc: 'Built and run a home-learning membership for the AI era — from content to delivery, single-handedly.',
        },
        {
          period: '2024 – 2026',
          role: 'Product Manager',
          org: 'Thinkings (Japan)',
          desc: 'GTM and feature planning for sonar ATS, a recruitment SaaS used by 2,500+ organizations.',
        },
        {
          period: '2021 – 2023',
          role: 'Product Manager / Division Manager',
          org: 'nonpi',
          desc: 'Led new business launches with P&L ownership, plus org development and HR design.',
        },
        {
          period: '2018 – 2019',
          role: 'Tax Associate',
          org: 'BDO USA',
          desc: 'Corporate, individual and expatriate tax in Troy, Michigan.',
        },
        {
          period: '2008 – 2016',
          role: 'Project Engineer',
          org: 'Ateam Inc.',
          desc: 'Built web and mobile services; led new service launches in Japan and Indonesia.',
        },
      ],
    },
    contact: {
      heading: 'Have something you want to build?',
      line: 'It doesn’t have to be fully formed yet.',
      desc: 'You can start a conversation from any of these stages.',
      bullets: [
        'I want to start a new business',
        'I want to build a brand',
        'I want to build a website',
        'I want to sort out our social presence',
        'I have an idea, but it isn’t clear yet',
      ],
      cta: "Let's talk.",
      form: {
        name: 'Name',
        email: 'Email',
        company: 'Company / Project',
        message: 'Message',
        submit: 'Send →',
      },
    },
    detailLabels: {
      about: 'About',
      challenge: 'Challenge',
      concept: 'Concept',
      role: 'My Role',
      process: 'Process',
      result: 'Result',
      visual: 'Visual Output',
      visualNote: 'Visuals coming soon',
      back: 'Back to Work',
      next: 'Next Project',
      demos: 'Live Demos',
      deliverable: 'Deliverable',
    },
  },
}

export function getDict(lang: Lang): Dict {
  return dictionaries[lang] ?? dictionaries.en
}

export function isLang(value: string): value is Lang {
  return (langs as string[]).includes(value)
}

export const CONTACT_EMAIL = 'ibedu.story@gmail.com'
