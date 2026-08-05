import { Project, BlogPost, ExperienceItem, EducationItem, SkillCategory, ProfileData } from '../types';

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'E-commerce Experience',
    category: 'Mobile & Web Design',
    status: 'Published',
    dateAdded: 'Oct 12, 2023',
    image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?auto=format&fit=crop&w=800&q=80',
    description: 'Re-imagining the shopping journey for a boutique home goods retailer with a focus on visual storytelling.',
    longDescription: 'A modern e-commerce mobile and desktop platform optimized for conversion, featuring high-fidelity micro-interactions, seamless guest checkout, and dynamic product showcase grids.',
    githubUrl: 'https://github.com/example/ecommerce-app',
    liveUrl: 'https://example.com/ecommerce',
    tags: ['MOBILE APP', 'UI/UX', 'REACT', 'TAILWIND'],
    featured: true,
  },
  {
    id: 'proj-2',
    name: 'SaaS Dashboard',
    category: 'Enterprise Solution',
    status: 'Published',
    dateAdded: 'Sep 28, 2023',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    description: 'Building a centralized analytics hub for distributed marketing teams with real-time data visualization.',
    longDescription: 'Enterprise analytics control center with custom modular chart builders, workspace permissions, automated reporting exports, and real-time streaming metrics.',
    githubUrl: 'https://github.com/example/saas-dashboard',
    liveUrl: 'https://example.com/saas',
    tags: ['WEB APP', 'SAAS', 'TYPESCRIPT', 'CHARTS'],
    featured: true,
  },
  {
    id: 'proj-3',
    name: 'Minimalist Branding',
    category: 'Identity Design',
    status: 'Draft',
    dateAdded: 'Nov 04, 2023',
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=800&q=80',
    description: 'Developing a cohesive visual language for an emerging tech startup, from logo to digital presence.',
    longDescription: 'Swiss-inspired minimalist brand identity system including typography guidelines, icon sets, brand collateral, and responsive design guidelines.',
    githubUrl: 'https://github.com/example/brand-identity',
    liveUrl: 'https://example.com/branding',
    tags: ['BRANDING', 'VISUAL DESIGN', 'FIGMA'],
    featured: true,
  },
  {
    id: 'proj-4',
    name: 'Architecture Portfolio',
    category: 'Website Design',
    status: 'Published',
    dateAdded: 'Aug 15, 2023',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Cinematic, full-screen architectural showcase featuring ultra-smooth parallax transitions and dark mode toggle.',
    longDescription: 'High-end portfolio for a renowned architecture firm highlighting physical structures with high-resolution gallery viewports and interactive 3D site plans.',
    githubUrl: 'https://github.com/example/arch-portfolio',
    liveUrl: 'https://example.com/architecture',
    tags: ['WEB DESIGN', 'THREEJS', 'PORTFOLIO'],
    featured: false,
  },
  {
    id: 'proj-5',
    name: 'AI Code Assistant UI',
    category: 'Developer Tools',
    status: 'Published',
    dateAdded: 'Dec 01, 2023',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    description: 'Generative AI interface with split-pane code editing, inline diffing, and real-time syntax highlighting.',
    longDescription: 'Next-generation code generation workspace with interactive prompt chaining, model comparison viewports, and automated test suite creation.',
    githubUrl: 'https://github.com/example/ai-code-ui',
    liveUrl: 'https://example.com/aicode',
    tags: ['AI', 'REACT', 'MONACO', 'TAILWIND'],
    featured: true,
  },
  {
    id: 'proj-6',
    name: 'FinTech Mobile Wallet',
    category: 'Mobile App',
    status: 'Published',
    dateAdded: 'Jan 10, 2024',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    description: 'Cross-border payment app with biometrics authentication, virtual card management, and expense categorizer.',
    longDescription: 'Secure mobile banking application with instant crypto-to-fiat conversion, peer-to-peer transfers, and visual monthly budgeting insights.',
    githubUrl: 'https://github.com/example/fintech-wallet',
    liveUrl: 'https://example.com/wallet',
    tags: ['FINTECH', 'MOBILE APP', 'IOS', 'ANDROID'],
    featured: false,
  }
];

export const initialExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Product Designer',
    company: 'Luminous Tech Solutions',
    period: '2021 — Present',
    isCurrent: true,
    location: 'San Francisco, CA',
    description: 'Leading the product design team in creating a next-generation SaaS platform. Focused on scalable design systems and mentoring junior designers while collaborating closely with the engineering team to ensure high-fidelity implementation.',
  },
  {
    id: 'exp-2',
    role: 'UI Developer & Design Engineer',
    company: 'Digital Craft Studio',
    period: '2018 — 2021',
    isCurrent: false,
    location: 'Austin, TX',
    description: 'Bridged the gap between high-level designs and functional code. Developed responsive, accessible web components and led the migration of legacy projects to modern frontend frameworks.',
  },
  {
    id: 'exp-3',
    role: 'Design Intern',
    company: 'Creative Flow Agency',
    period: '2017 — 2018',
    isCurrent: false,
    location: 'New York, NY',
    description: 'Assisted in the creation of visual assets for client campaigns and supported the design team in wireframing user flows for mobile applications.',
  }
];

export const initialEducation: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'B.S. in Computer Science & Human-Computer Interaction',
    institution: 'University of California, Berkeley',
    period: '2014 — 2018',
    location: 'Berkeley, CA',
    description: 'Focused on software engineering, user interface design, web architecture, and cognitive science. Graduated with honors.',
    gpaOrHonors: 'Magna Cum Laude',
  },
  {
    id: 'edu-2',
    degree: 'Professional Certification in UX Architecture & Systems',
    institution: 'Stanford Design School (d.school)',
    period: '2019',
    location: 'Palo Alto, CA',
    description: 'Specialized program on design thinking, enterprise design systems, accessibility compliance, and rapid interactive prototyping.',
  },
];

export const initialSkills: SkillCategory[] = [
  {
    id: 'skill-1',
    category: 'Design',
    iconName: 'edit_note',
    skills: ['User Interface', 'Experience Design', 'Figma', 'Prototyping', 'Design Systems', 'Typography', 'Micro-interactions', 'User Research']
  },
  {
    id: 'skill-2',
    category: 'Development',
    iconName: 'code',
    skills: ['HTML/CSS', 'React.js', 'Next.js', 'Tailwind CSS', 'TypeScript', 'JavaScript (ES6+)', 'Node.js', 'MongoDB', 'Git/GitHub', 'Web Performance']
  },
  {
    id: 'skill-3',
    category: 'Strategy & Ops',
    iconName: 'psychology',
    skills: ['Agile / Scrum', 'Design Tokens', 'Design Workshops', 'Accessibility (WCAG)', 'A/B Testing']
  }
];

export const initialProfile: ProfileData = {
  name: 'Dhruv Lad',
  title: 'Senior Product Designer & Developer',
  subtitle: 'Manage your work and showcase your creations',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  bioParagraph1: 'With over 8 years in the digital space, I\'ve learned that great design isn\'t just about how things look—it\'s about how they function. My journey started in traditional graphic design before moving into the world of UI/UX and Frontend Engineering.',
  bioParagraph2: 'I believe in building systems that are accessible, performant, and delightful to use. I thrive at the intersection of aesthetic precision and technical excellence, ensuring that every pixel serves a purpose in the user journey.',
  email: 'hello@portfolio.design',
  location: 'San Francisco, CA (Open to Remote)',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  resumeUrl: 'https://example.com/resume.pdf',
  yearsExperience: 8,
};

export const initialBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Architecting Scalable React & TypeScript Applications in 2026',
    slug: 'architecting-scalable-react-typescript-apps',
    category: 'Engineering Architecture',
    status: 'Published',
    dateAdded: 'Jan 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Key strategies for structuring large-scale web applications with modern state management, strict type boundaries, and modular component design.',
    content: `Building large-scale React applications requires more than just knowing component syntax. As products grow, codebase maintainability and team velocity depend directly on structural discipline and strong architectural boundaries.

### 1. Domain-Driven Directory Organization
Instead of grouping files by type (e.g. \`/components\`, \`/hooks\`, \`/types\`), structure your application by domain feature modules:

\`\`\`
src/
├── features/
│   ├── authentication/
│   ├── dashboard/
│   └── portfolio/
├── shared/
│   ├── components/
│   └── utils/
\`\`\`

This ensures that developers working on a feature can locate all related logic, state, and UI representations in a unified context.

### 2. Strict Type Isolation
Avoid passing loose \`any\` or overly generic types across boundaries. Define central interface definitions in domain schemas and enforce type-safe API client wrappers to capture runtime contract mismatches early.

### 3. Performance Optimization & Lazy Hydration
By leveraging React 18 concurrent features, server-side data proxies, and dynamic imports for non-critical views, page load times drop dramatically while preserving crisp interaction fluidity.`,
    tags: ['React', 'TypeScript', 'Frontend', 'Architecture'],
    author: 'Dhruv Lad',
    featured: true,
  },
  {
    id: 'blog-2',
    title: 'Designing Intentional Micro-Interactions for Modern Web Apps',
    slug: 'designing-intentional-micro-interactions',
    category: 'UI/UX Design',
    status: 'Published',
    dateAdded: 'Feb 02, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'How subtle animation cues, spring physics, and tactical hover feedback elevate user comprehension and product polish.',
    content: `Micro-interactions are the secret handshake between a product and its user. When crafted with purpose, they turn routine tasks into memorable, fluid visual moments.

### The Anatomy of a Great Micro-Interaction
Every meaningful UI feedback loop consists of four key components:
1. **Trigger:** A user gesture like a button press, drag, or hover state.
2. **Rule:** The underlying constraint governing how state transitions behave.
3. **Feedback:** Visual, tactile, or motion response signaling completion.
4. **Loops & Modes:** Persistent visual cues reflecting current state.

> "Details aren't just details; they make the product." — Charles Eames

### Motion with Physics
When applying animations, avoid linear easings. Use cubic-bezier curves or spring physics parameters to make UI elements feel weighted and tactile.`,
    tags: ['UI/UX', 'Animation', 'Design Systems', 'CSS'],
    author: 'Dhruv Lad',
    featured: true,
  },
  {
    id: 'blog-3',
    title: 'Building Enterprise Express & MongoDB APIs with Resilient Fallbacks',
    slug: 'building-enterprise-express-mongodb-apis',
    category: 'Backend Development',
    status: 'Published',
    dateAdded: 'Mar 18, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    excerpt: 'Implementing hybrid JSON file storage and MongoDB synchronization to guarantee zero-downtime local preview and cloud resilience.',
    content: `When building modern portfolio management backends, backend services should remain operational whether connected to cloud database instances or offline local file stores.

### Hybrid Storage Strategy
By abstracting database access behind a unified service layer, backend controllers can seamlessly read and write to local JSON persistence while syncing asynchronously with MongoDB when cloud credentials are established.

\`\`\`ts
// Service abstraction layer pattern
export class DatabaseService {
  async getCollection(name: string) {
    if (this.isMongoConnected()) {
      return this.getMongoCollection(name);
    }
    return this.getLocalStoreCollection(name);
  }
}
\`\`\`

### API Security & Middleware Hygiene
Always validate incoming payload bodies using Zod schemas, sanitize request headers using Helmet, and apply per-IP rate limiting to shield endpoints from high-concurrency automated scripts.`,
    tags: ['Node.js', 'Express', 'MongoDB', 'Backend'],
    author: 'Dhruv Lad',
    featured: false,
  }
];

