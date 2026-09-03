export const GITHUB_USER = 'SarthakChandrayan'

export const profile = {
  name: 'Sarthak Chandrayan',
  username: GITHUB_USER,
  title: 'Full-Stack Engineer',
  company: 'Thravos',
  companyUrl: 'https://thravos.io',
  location: 'Bengaluru, India',
  email: 'sarthak.chandrayan396@gmail.com',
  linkedin: 'https://linkedin.com/in/sarthak-chandrayan-98a755159',
  github: `https://github.com/${GITHUB_USER}`,
  avatar: '/avatar-lg.jpg',
  bio: 'Product-focused Full-Stack Engineer specializing in scalable web applications, high-performance frontend systems, and resilient backend integrations.',
  summary:
    'Experienced in building responsive user experiences, API-driven architectures, and modern full-stack platforms using React, Next.js, Angular, and Node.js. Passionate about performance optimization, clean system design, and delivering seamless digital experiences. Also work across TypeScript/Node APIs and the React Native, Next.js, and admin apps that consume them, keeping client behavior consistent when contracts change.',
}

export type Repo = {
  name: string
  description: string
  language: string
  languageColor: string
  topics: string[]
  private: boolean
  highlights: string[]
  href?: string
}

export const repos: Repo[] = [
  {
    name: 'thravos',
    description:
      'Consumer fitness platform. Shared APIs consumed by the React Native app, Next.js web, and admin.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    topics: ['react-native', 'nextjs', 'nodejs', 'mongodb'],
    private: true,
    highlights: [
      'Shared TypeScript/Node APIs used by the React Native app and Next.js web app',
      'Kept client behavior aligned so mobile and web hit the same contracts and show the same state',
      'Realtime features with persisted results across backend and clients',
    ],
    href: 'https://thravos.io',
  },
  {
    name: 'document-chat',
    description:
      'AI-powered document chat that answers questions from uploaded PDFs using semantic search and retrieval-augmented generation.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    topics: ['nextjs', 'langchain', 'prisma', 'rag', 'vercel'],
    private: false,
    highlights: [
      'Vector embedding pipelines with LangChain for RAG over PDFs',
      'Secure auth, protected API routes, and encrypted file handling',
      'Modular, performance-focused architecture deployed on Vercel',
    ],
  },
  {
    name: 'notification-system',
    description:
      'Foundation of a product notification system — schema design, backend APIs, and integration across the Thravos platform.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    topics: ['nodejs', 'mongodb', 'api'],
    private: true,
    highlights: [
      'Schema design and API integration for notifications',
      'Built during internship ownership of backend feature work',
    ],
  },
  {
    name: 'referral-leaderboard',
    description:
      'Referral leaderboard and competition backend used to drive engagement across coaching and athlete workflows.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    topics: ['nodejs', 'leaderboard'],
    private: true,
    highlights: [
      'Backend logic for referral competitions and ranking',
      'Worked with product, engineering, and QA on feature delivery',
    ],
  },
]

export type Role = {
  title: string
  company: string
  companyUrl: string
  location: string
  period: string
  current?: boolean
  summary?: string
  bullets: string[]
}

export const experience: Role[] = [
  {
    title: 'Full Stack Engineer',
    company: 'Thravos',
    companyUrl: 'https://thravos.io',
    location: 'Remote',
    period: 'Feb 2025 – Present',
    current: true,
    summary:
      'Full-stack across Node/TypeScript APIs, React Native, and Next.js. Own API design and client integration, and keep mobile and web in sync when contracts change.',
    bullets: [
      'Designed and shipped APIs and the client flows that use them, keeping status in sync across clients.',
      'Kept behavior aligned across the mobile app and the web app so both hit the same APIs and show the same state.',
      'Added authorization and request validation so only the right users can create or manage resources.',
      'Built backend and client support for realtime features, including live updates and persisting results.',
      'Worked in a TypeScript/Node codebase (REST, MongoDB, auth) and updated mobile and web together whenever API contracts changed.',
    ],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Thravos',
    companyUrl: 'https://thravos.io',
    location: 'Remote',
    period: 'Aug 2024 – Jan 2025',
    bullets: [
      'Owned QA testing workflows including regression testing, bug reporting, and feature validation.',
      'Managed Jira documentation and sprint tracking to streamline engineering workflows.',
      'Implemented backend logic for referral leaderboard and competition systems.',
      'Designed and developed the foundation of the notification system, including schema design and API integration.',
      'Collaborated with cross-functional teams on feature planning, testing, and product improvements.',
    ],
  },
  {
    title: 'Summer Intern',
    company: 'Thravos',
    companyUrl: 'https://thravos.io',
    location: 'Remote',
    period: 'Jun 2024 – Jul 2024',
    bullets: [
      'Created comprehensive Postman API documentation for internal and external development usage.',
      'Authored user stories and feature breakdowns to support early-stage product planning.',
      'Performed QA testing across the website and web application to identify and document issues.',
      'Designed application flow diagrams to align engineering and product teams.',
      'Participated in sprint discussions, project planning, and feature scoping.',
    ],
  },
]


export const stack = [
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Node.js', color: '#3fb950' },
  { name: 'React Native', color: '#61dafb' },
  { name: 'Next.js', color: '#f0f6fc' },
  { name: 'MongoDB', color: '#3fa037' },
  { name: 'Stripe', color: '#635bff' },
]

export const skills = {
  core: stack,
  groups: [
    {
      title: 'Mobile',
      items: ['React Native', 'Expo', 'Redux'],
    },
    {
      title: 'Web',
      items: ['React', 'Next.js', 'Angular'],
    },
    {
      title: 'Backend',
      items: ['Node.js', 'REST', 'Socket.IO', 'Stripe'],
    },
    {
      title: 'Platform',
      items: ['MongoDB', 'AWS'],
    },
  ],
}

export type TabId = 'overview' | 'repositories' | 'experience' | 'skills'

export const tabs: { id: TabId; label: string; count?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'repositories', label: 'Work', count: repos.length },
  { id: 'experience', label: 'Experience', count: experience.length },
  { id: 'skills', label: 'Skills' },
]
