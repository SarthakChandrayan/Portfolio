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
  resume: '/Sarthak Chandrayan Full Stack Engineer - Resume.pdf',
  site: 'https://sarthakchandrayan.com',
  bio: 'Full-Stack Engineer shipping production web and mobile apps in TypeScript, plus AI tools built on RAG and local LLMs.',
  summary:
    'About two years shipping production web and mobile apps and the APIs behind them, end to end in TypeScript. Lately also building AI products with RAG, LangChain, and local LLMs.',
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
  github?: string
  logo?: string
  /** Wide wordmark; rendered larger than the square project marks. */
  wideLogo?: boolean
}

export const repos: Repo[] = [
  {
    name: 'Planar (meeting analyzer)',
    description:
      'Local AI meeting analyzer. Paste an engineering meeting transcript and get a traceable record: decisions, requirements, tasks with owners and due dates, risks, open questions, and an implementation plan, each linked to the lines it came from.',
    language: 'Python',
    languageColor: '#3572A5',
    topics: ['fastapi', 'ollama', 'react'],
    private: false,
    github: 'https://github.com/SarthakChandrayan/SpecForge',
    logo: '/planar-logo.png',
    wideLogo: true,
    highlights: [
      'Runs fully offline on whichever Ollama model you configure (defaults to qwen3:4b, sized for a laptop CPU): four narrow passes reuse the cached transcript prefix, and JSON-schema-constrained output means a long generation never fails to parse',
      'The model cites line numbers instead of quoting; the backend checks each cited line supports the claim, drops what it cannot ground, and keeps owners and due dates only if they appear in the transcript',
      'Links between items are inferred from shared evidence, not generated, and the app assigns every ID',
      'Runs go to a background worker that survives a closed tab or restart, with time estimates that learn from past runs and a Markdown export',
    ],
  },
  {
    name: 'shrt (url shortener)',
    description:
      'Authenticated link shortener with expiring links and click analytics, on Neon Postgres with a React dashboard.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    topics: ['express', 'prisma', 'neon'],
    private: false,
    href: 'https://shrt.sarthakchandrayan.com/',
    github: 'https://github.com/SarthakChandrayan/SHRT---URL-shortener',
    logo: '/shrt-logo.png',
    highlights: [
      'Express API issues short codes, enforces expiration, and redirects while recording each click',
      'Click breakdowns for device, browser, OS, referrer, and country, plus a clicks-over-time chart',
      'Neon Auth JWTs protect the API, and each user manages their own links from the dashboard',
    ],
  },
  {
    name: 'Pedit (pdf - editor)',
    description:
      'In-browser PDF editor for text edits, annotations, drawings, and page changes, with saved versions on Neon Postgres.',
    language: 'TypeScript',
    languageColor: '#3178c6',
    topics: ['react', 'express', 'neon'],
    private: false,
    href: 'https://pedit.sarthakchandrayan.com/',
    github: 'https://github.com/SarthakChandrayan/Pedit',
    logo: '/PediT.png',
    wideLogo: true,
    highlights: [
      'Edit text, highlight, underline, and strikethrough on the page, then export a new PDF with pdf-lib',
      'Draw freehand, lines, arrows, and shapes, insert images, and reorder, rotate, duplicate, or delete pages',
      'Express API stores uploaded PDFs and version history in Neon Postgres',
    ],
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
      'Full-stack across Node.js/TypeScript REST APIs, MongoDB, Stripe, React Native, and Next.js.',
    bullets: [
      'Designed and shipped REST APIs and the client flows that use them, including Stripe payments, across the React Native app and the Next.js web apps.',
      'Implemented authentication, authorization, and request validation across the API.',
      'Built backend and client support for realtime features with Socket.IO: live updates during a session and persisted results when it ends.',
      'Developed and maintained three production websites with Next.js and React, using Decap CMS for MDX content through a Git-based publishing workflow.',
      'Coordinated API contract changes across web and mobile so both platforms stay consistent.',
    ],
  },
  {
    title: 'Software Engineering Intern',
    company: 'Thravos',
    companyUrl: 'https://thravos.io',
    location: 'Remote',
    period: 'Aug 2024 – Jan 2025',
    bullets: [
      'Owned QA workflows covering regression testing, bug reporting, feature validation, and release verification.',
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
  { name: 'Express', color: '#68a063' },
  { name: 'React', color: '#58a6ff' },
  { name: 'React Native', color: '#61dafb' },
  { name: 'Next.js', color: '#f0f6fc' },
  { name: 'Angular', color: '#f85149' },
  { name: 'Python', color: '#3572A5' },
  { name: 'FastAPI', color: '#009688' },
  { name: 'PostgreSQL', color: '#336791' },
  { name: 'Prisma', color: '#5a67d8' },
  { name: 'MongoDB', color: '#3fa037' },
  { name: 'Socket.IO', color: '#d2a8ff' },
  { name: 'Stripe', color: '#635bff' },
  { name: 'AWS', color: '#ff9900' },
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
      items: ['React', 'Next.js', 'Angular', 'Tailwind CSS'],
    },
    {
      title: 'Backend',
      items: ['Node.js', 'Express', 'Python', 'FastAPI', 'REST', 'Socket.IO', 'Stripe'],
    },
    {
      title: 'Data',
      items: ['PostgreSQL', 'Prisma', 'MongoDB'],
    },
    {
      title: 'AI',
      items: ['LangChain', 'RAG', 'Ollama'],
    },
    {
      title: 'Platform',
      items: ['AWS', 'Neon', 'Vercel'],
    },
  ],
}

export type SectionId =
  | 'about'
  | 'work'
  | 'experience'
  | 'skills'
  | 'activity'
  | 'contact'

export const sections: { id: SectionId; label: string; count?: number }[] = [
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work', count: repos.length },
  { id: 'experience', label: 'Experience', count: experience.length },
  { id: 'skills', label: 'Skills' },
  { id: 'activity', label: 'Activity' },
  { id: 'contact', label: 'Contact' },
]
