import { useState } from 'react'

type ProjectStatus = 'works:)' | 'beta' | 'in construction' | 'saved for later' | 'abandoned'

const statusOrder: ProjectStatus[] = ['works:)', 'beta', 'in construction', 'saved for later', 'abandoned']

interface Project {
  id: string
  name: string
  tagline: string
  status: ProjectStatus
  icon?: string
  url?: string
  tags: { label: string; type: 'outline' | 'grey' | 'blue' | 'green' }[]
  description: string
  oneliners?: string
  experience?: string
  screenshots?: {
    main?: string
    thumbs?: string[]
  }
}

const projects: Project[] = [
  {
    id: 'lambert',
    name: 'Lambert',
    tagline: 'Polish quarterly journal',
    status: 'works:)',
    icon: '/lambert_icon.png',
    url: 'https://thelambert.org',
    tags: [
      { label: 'thelambert.org', type: 'outline' },
    ],
    description:
      'A journal by and for Polish students abroad \u2014 a quarterly publication amplifying the voices of the Polish diaspora studying internationally. Lambert publishes essays, interviews, and creative works exploring Polish identity in global contexts, offering a dedicated space for cultural reflection, personal narrative, and the experience of navigating life between countries.',
    oneliners: 'Polish student journal abroad\nCulture, identity, diaspora',
  },
  {
    id: 'networker',
    name: 'Networker',
    tagline: 'Event Aggregator Browser',
    status: 'beta',
    icon: '/networker_icon.png',
    url: 'https://networker.events',
    tags: [
      { label: 'networker.events', type: 'outline' },
      { label: 'Pre-launch', type: 'grey' },
      { label: 'MVP, build in progress', type: 'green' },
    ],
    description:
      'Fragmentation of the professional events market and its anachronic information proliferation channels create an opening for a product enabling to browse ALL professional events. Networker is an enhanced event browser, which allows browsing ALL events in existence, through UI comprising ALL relevant data. Collecting cross-conference activity of users will enable easier expansion to a B2B event software provider, or... the LinkedIn competitor.',
    oneliners: 'Google Flights for professional events\nLinkedIn immune to AI-slop',
    experience:
      "This is my first project, that started off as I began attending professional conferences to write for a student newspaper. I began with wordpress, lovable, and later switched to Claude Code over the summer of '25. I mostly focused on UX/UI, and what started off as a barely-interactive app now includes some fancy framer motion techniques, resembling liquid glass (check the mobile browser version!). Now, after a short brake in September, I returned with a new spirit, and started off in the backend; I'm focusing on building a really good browser now, which is able to find and retreive event-specific data from otherwise-unfindable pages... and work towards something greater :)",
  },
  {
    id: 'edit',
    name: 'Edit',
    tagline: 'Organisation & workflow software',
    status: 'beta',
    icon: '/edit_icon.png',
    tags: [
      { label: 'In development', type: 'blue' },
    ],
    description:
      'A personal organisation software \u2014 Notion of my own \u2014 now expanding towards full organisation management with positions, roles and team structure. The next phase evolves Edit into a workflow automation platform (my own make.com), featuring assignable roles and a todo-delegation system that lets you route tasks through your organisation.',
    oneliners: 'Personal Notion \u2192 Org management \u2192 Workflow automation\nMake.com with roles and delegation',
  },
  {
    id: 'carte-blanche',
    name: 'Carte Blanche',
    tagline: 'Multi-source reading composer',
    status: 'in construction',
    tags: [
      { label: 'Concept', type: 'grey' },
    ],
    description:
      'A reading composer that aggregates content across Substack, Medium, BBC, TechCrunch, X, Bluesky, and newsletters into one place. Stage one: build an engine that gathers and fetches content for users. Stage two: a clean reader app. Stage three: automated newspaper layouting software that composes a personalised newspaper from the user\'s full reading list across all sources. The end goal: print user-profiled newspapers suited for the modern creator economy \u2014 bringing digital reading habits into physical media.',
    oneliners: 'All your reading in one place\nDigital-to-print personalised newspapers',
  },
  {
    id: 'readership',
    name: 'Readership',
    tagline: 'Widget-based news website builder',
    status: 'saved for later',
    tags: [
      { label: 'Early development', type: 'blue' },
    ],
    description:
      'A widget-based news website builder with field-specific algorithms for content curation and presentation. Plugs into Edit for sourcing articles, enabling organisations to spin up tailored news sites from their own content pipeline. Each widget is configurable with its own layout, filtering logic, and algorithmic feed.',
    oneliners: 'Squarespace for news\nEdit-powered content pipeline',
  },
  {
    id: 'uth',
    name: 'Uth',
    tagline: 'Personal tutoring platform',
    status: 'saved for later',
    icon: '/u_icon.png',
    url: 'https://uth.academy',
    tags: [
      { label: 'uth.academy', type: 'outline' },
      { label: 'Testing soon', type: 'blue' },
      { label: 'Demo, MVP-in-dev', type: 'blue' },
    ],
    description:
      'uth /youth/ \u2014 a period of life, when creativity and courage go together, and yearn for more experience. Driven by a belief, that one is young as long as he is willing to learn, Uth enables just that: tutors create their classes, and corporate clients schedule tutoring for their teams easily. In the bloom of the AI age, thousands of corporate professionals require upskilling in basic use of AI-powered tools, and there is no one better to teach it, than digitally-native tutors \u2014 students. Uth intends to disrupt the traditional courses/training industry, which set up humongous barriers of entry while charging thousands of dollars for obsolete diplomas. For a better, intergenerational workplace.',
    oneliners: 'Corporate Superprof\nRequalifying en masse',
    experience:
      "An idea of mine, aligned with my special interest in endeavours responding to market demand for interpersonal contact. After I launch lockin, I intend to test this one out in the field; may fail, may work, the point is too see to it.",
  },
  {
    id: 'lockin',
    name: 'Lockin',
    tagline: 'AI-powered studying platform',
    status: 'abandoned',
    icon: '/lockin_icon.png',
    url: 'https://lockinstudy.com',
    tags: [
      { label: 'lockinstudy.com', type: 'outline' },
      { label: 'Launching soon', type: 'blue' },
      { label: 'No public MVP', type: 'grey' },
    ],
    description:
      'A comprehensive study app, enabling accessible course content consumption and exam preparations. Students can pick between uploading their own content, sourcing it from the existing database, or buying premium content from other users. The content is then processed and appropriated to different studying methods, and utilises both gamified/focus modes to make studying approachable. Leveraging the users input enables scaling and reinforces the content generation processes.',
    screenshots: {
      main: '/screenshot1.png',
      thumbs: ['/screenshot2.png', '/screenshot3.png', '/screenshot4.png'],
    },
  },
]

function ProjectIcon({ project }: { project: Project }) {
  if (project.icon) {
    return <img className="project-sidebar-icon" src={project.icon} alt={project.name} />
  }
  return (
    <div className="project-sidebar-icon-placeholder">
      {project.name.charAt(0)}
    </div>
  )
}

function ProjectDetailIcon({ project }: { project: Project }) {
  if (project.icon) {
    return <img className="project-detail-icon" src={project.icon} alt={project.name} />
  }
  return (
    <div className="project-detail-icon-placeholder">
      {project.name.charAt(0)}
    </div>
  )
}

function Projects() {
  const [selected, setSelected] = useState(0)
  const project = projects[selected]

  return (
    <div className="projects">
      <div className="projects-sidebar">
        <div className="projects-sidebar-title">Projects</div>
        {statusOrder.map(status => {
          const group = projects.filter(p => p.status === status)
          if (group.length === 0) return null
          return (
            <div key={status} className="projects-sidebar-group">
              <div className="projects-sidebar-status">{status}</div>
              {group.map(p => {
                const i = projects.indexOf(p)
                return (
                  <div
                    key={p.id}
                    className={`project-sidebar-item ${i === selected ? 'active' : ''}`}
                    onClick={() => setSelected(i)}
                  >
                    <ProjectIcon project={p} />
                    <div className="project-sidebar-info">
                      <span className="project-sidebar-name">{p.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      <div className="projects-main">
        <div className="project-detail" key={project.id}>
          <div className="project-detail-header">
            <ProjectDetailIcon project={project} />
            <div className="project-detail-title-area">
              <div className="project-detail-title">{project.name}</div>
              <div className="project-detail-subtitle">{project.tagline}</div>
            </div>
          </div>

          <div className="project-detail-tags">
            {project.tags.map((tag, i) => (
              <span key={i} className={`project-tag project-tag--${tag.type}`}>
                {tag.type === 'outline' && project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer">
                    {tag.label}
                  </a>
                ) : (
                  tag.label
                )}
              </span>
            ))}
          </div>

          {project.url && (
            <a
              className="project-visit-link"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit {project.name}
            </a>
          )}

          <div className="project-detail-section">
            <div className="project-detail-section-title">About</div>
            <div className="project-detail-text">{project.description}</div>
          </div>

          {project.oneliners && (
            <div className="project-detail-section">
              <div className="project-detail-section-title">Oneliners</div>
              <div className="project-detail-oneliners">
                {project.oneliners.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            </div>
          )}

          {project.experience && (
            <div className="project-detail-section">
              <div className="project-detail-section-title">My Experience</div>
              <div className="project-detail-text">{project.experience}</div>
            </div>
          )}

          {project.screenshots && (
            <div className="project-screenshots">
              {project.screenshots.main && (
                <img
                  className="project-screenshot-main"
                  src={project.screenshots.main}
                  alt={`${project.name} screenshot`}
                />
              )}
              {project.screenshots.thumbs && (
                <div className="project-screenshots-row">
                  {project.screenshots.thumbs.map((src, i) => (
                    <img
                      key={i}
                      className="project-screenshot-thumb"
                      src={src}
                      alt={`${project.name} screenshot ${i + 2}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Projects