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
    'Experienced in building responsive user experiences, API-driven architectures, and modern full-stack platforms using React, Next.js, Angular, and Node.js. Passionate about performance optimization, clean system design, and delivering seamless digital experiences.',
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
    name: 'thravos-marketplace',
    description:
      'Marketplace and athlete engagement platform with subscription coaching, secure APIs, and high-concurrency frontend performance.',
    language: 'JavaScript',
    languageColor: '#f1e05a',
    topics: ['react', 'nodejs', 'subscriptions', 'marketplace'],
    private: true,
    highlights: [
      'Scalable marketplace and athlete engagement systems',
      'Secure APIs for subscription-based coaching and recurring revenue',
      'Reusable React architecture and frontend modernization',
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
    bullets: [
      'Developing scalable marketplace and athlete engagement systems using modern frontend frameworks and backend services.',
      'Designing and integrating secure APIs for subscription-based coaching and recurring revenue workflows.',
      'Building responsive, performance-focused user experiences optimized for high-concurrency usage.',
      'Contributing to frontend modernization through reusable React architecture and API integration.',
      'Collaborating across product, engineering, and QA to improve feature delivery and platform stability.',
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


export const skills = {
  languages: [
    { name: 'JavaScript', color: '#f1e05a', pct: 32 },
    { name: 'TypeScript', color: '#3178c6', pct: 22 },
    { name: 'HTML', color: '#e34c26', pct: 14 },
    { name: 'CSS', color: '#563d7c', pct: 12 },
    { name: 'Python', color: '#3572A5', pct: 12 },
    { name: 'C++', color: '#f34b7d', pct: 8 },
  ],
  frameworks: [
    'React',
    'Next.js',
    'Angular',
    'Node.js',
    'Tailwind CSS',
    'LangChain',
  ],
  tools: [
    'Git',
    'GitHub',
    'Postman',
    'Jira',
    'Figma',
    'Mixpanel',
    'Vercel',
    'VS Code',
  ],
  data: ['MongoDB', 'Prisma', 'Vector embeddings'],
  backend: [
    'REST APIs',
    'Secure API design',
    'Authentication',
    'Schema design',
    'Protected routes',
    'Subscription workflows',
  ],
  frontend: [
    'Responsive UI',
    'Performance optimization',
    'Reusable React architecture',
    'High-concurrency UX',
  ],
  ai: ['RAG', 'Semantic search', 'LangChain', 'Document Q&A'],
  product: [
    'Regression testing',
    'Feature validation',
    'API documentation',
    'User stories',
    'Sprint planning',
    'QA workflows',
  ],
}

export type TabId = 'overview' | 'repositories' | 'experience' | 'skills'

export const tabs: { id: TabId; label: string; count?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'repositories', label: 'Work', count: repos.length },
  { id: 'experience', label: 'Experience', count: experience.length },
  { id: 'skills', label: 'Skills' },
]
