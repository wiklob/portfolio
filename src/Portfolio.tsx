import { useEffect, useLayoutEffect, useRef, useState } from 'react'

type Block =
  | { kind: 'p'; text: string }
  | { kind: 'ul'; items: string[] }

interface Section {
  title: string
  blocks: Block[]
}

interface FolderItem {
  id: string
  name: string
  url: string
}

interface Project {
  id: string
  name: string
  tagline: string
  status: string
  icon?: string
  url?: string
  sections: Section[]
  items?: FolderItem[]
}

const projects: Project[] = [
  {
    id: 'lambert',
    name: 'Lambert',
    tagline: 'International Journal of Poles',
    status: '1st published',
    icon: '/lambert_icon.png',
    url: 'https://thelambert.org',
    sections: [
      {
        title: 'tldr',
        blocks: [
          {
            kind: 'p',
            text:
              'English-language quarterly written by Polish students from around the globe — articles on Polish culture, politics, economics, and the diaspora itself. There is no English-language publication discussing Polish affairs, especially not one written by the youth. So we made one.',
          },
        ],
      },
      {
        title: 'current progress',
        blocks: [
          {
            kind: 'p',
            text:
              'A 50-person team of editors, designers, and a non-editorial operations team. First edition of the quarterly out — 100 pages, some pretty good content, a few truly great pieces.',
          },
        ],
      },
      {
        title: 'upcoming changes',
        blocks: [
          {
            kind: 'p',
            text:
              "Restructuring from top-down divisions into mobile project managers — assigning these people to one field wastes them, they're too versatile for that. Expanding into a community model: open entry, but high editorial standard moved further down the pipeline. That's because a) I prefer to give everyone a chance, b) interviews were no better than a coin flip at predicting writer quality. Expanding the artist and photographer team into a call-for-commissions system. Growing social media, and producing audio-video — podcasts, TikToks, and others.",
          },
        ],
      },
      {
        title: 'what i do',
        blocks: [
          {
            kind: 'p',
            text:
              'Cofounder and "Operational Director" — the guy who makes it work. I wrote dedicated software for us (check [[edit]]), recruited most of the team, and together with my cofounder and editor-in-chief, delivered the first print edition for the Polish Business Forum. Now I begin the post-release phase of implementing all the learnings from the first run, getting proper financing, and establishing an NGO.',
          },
        ],
      },
      {
        title: 'what i learned',
        blocks: [
          {
            kind: 'ul',
            items: [
              "Before you run 20 articles through the production pipeline, run 2, and check whether the pipe doesn't leak.",
              'If you lower the entry requirements, the "weight" doesn\'t go away — it shifts further into production (= requires harsher verification downstream).',
              'Artists and creators are people who arrange chaos into beauty, but with little awareness of what happens before and after their work. Appreciate their creativity, but keep an eye on the progress.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'artists',
    name: 'Artist projects',
    tagline: 'Webdev for fashion',
    status: '3 done',
    icon: '/folder.png',
    sections: [
      {
        title: 'tldr',
        blocks: [
          {
            kind: 'p',
            text:
              "Artists inspire me, so I figured I'd work with some. Reached out to my friend at ESMOD in Paris (Fashion School), and so far I've done three small projects with two different artists (that's what I call all creators not bound by business). Deal: I work for free, they recommend me to the next artist and give me a couch when I'm in their city. Their networks are crazy.",
          },
        ],
      },
      {
        title: "how it's going",
        blocks: [
          {
            kind: 'p',
            text:
              "Very well. Three projects done, more on the way. Working with them is rewarding and doesn't take much time. I do the vibe coding myself first, then teach them the tools — to whatever extent they want. I'm good at translating their vision into digital form, and I can integrate my own implementation and design ideas without stepping on theirs. They never lack creativity in physical arts, but in digital, they often don't realise that literally anything can be built — animation, style, anything. That's where I'm useful.",
          },
        ],
      },
      {
        title: "what's next",
        blocks: [
          { kind: 'p', text: 'More projects. More friends. More places to sleep. A lot of fun.' },
        ],
      },
    ],
    items: [
      { id: 'shirts', name: 'shirts', url: 'https://shirtdatabase.com' },
      { id: 'skirts', name: 'skirts', url: 'https://skirtdatabase.com' },
      { id: 'trash', name: 'tr@$h', url: 'https://trh.netlify.app' },
    ],
  },
  {
    id: 'networker',
    name: 'Networker',
    tagline: 'Event Aggregator Browser',
    status: 'on hold',
    icon: '/networker_icon.png',
    url: 'https://networker.events',
    sections: [
      {
        title: 'tldr',
        blocks: [
          {
            kind: 'p',
            text:
              'Event aggregator browser — Google Flights for events. Browse all professional gatherings (conferences, summits, congresses, trade fairs) and see standardized data: agendas, speakers, floor plans. I built most of an MVP through 2025, paused in early 2026 to focus on Carte Blanche, plan to finish it this summer.',
          },
        ],
      },
      {
        title: 'why now',
        blocks: [
          {
            kind: 'p',
            text:
              "There's no comprehensive event listing page — nobody can credibly say \"we have all events.\" Conference apps suck; the whole industry's software is archaic, and even the simplest solutions (Luma) get great traction. Everything is B2B, because that's where the revenue is — B2C hasn't survived because of irregular usage patterns and zero willingness to pay on the participant side (the app is anything but crucial to attending).",
          },
          {
            kind: 'p',
            text:
              'Software is dirt cheap to build now. Path to revenue is long, and probably looks like: capture demand side first, then make deals with ticket sellers or integrate into the chain with your own products.',
          },
        ],
      },
      {
        title: 'how it went',
        blocks: [
          {
            kind: 'p',
            text:
              "Started May 2025. Re-learned full stack coding via Claude Code over the summer. I focused on frontend, my cofounder on backend — nice guy, but we didn't end up shipping together; he left in early September. I continued alone, but loneliness and inexperience don't go well together; made a proper return to it around January 2026. Most of the MVP is done — app, browser, chats, aggregator engine — but the aggregator isn't properly scaled, in coverage or depth. I switched to [[lambert|The Lambert]] (didn't want to work alone anymore), then to [[carte-blanche|Carte Blanche]], where the path to ramen profitability looks simpler. Plan to finish Networker over the summer.",
          },
        ],
      },
      {
        title: 'what i learned',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Have clear milestones.',
              'Make smaller MVPs.',
              'I can work alone, but eventually I run out of steam — get yourself a community, at the very least.',
              "Don't look for a cofounder between business students.",
              'Start with the hardest part. Keep your eye on the ball.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'edit',
    name: 'Edit',
    tagline: 'Notion for Lambert',
    status: 'works',
    icon: '/edit_icon.png',
    url: 'https://editapp.co',
    sections: [
      {
        title: 'about',
        blocks: [
          {
            kind: 'p',
            text:
              'A personal organisation software — Notion of my own — now expanding towards full organisation management with positions, roles and team structure. The next phase evolves Edit into a workflow automation platform (my own make.com), featuring assignable roles and a todo-delegation system that lets you route tasks through your organisation.',
          },
        ],
      },
      {
        title: 'oneliners',
        blocks: [
          {
            kind: 'ul',
            items: [
              'Personal Notion → Org management → Workflow automation',
              'Make.com with roles and delegation',
            ],
          },
        ],
      },
      {
        title: 'in production',
        blocks: [
          {
            kind: 'p',
            text: 'Now used at [[lambert|The Lambert]] — runs the whole 50-person team.',
          },
        ],
      },
    ],
  },
  {
    id: 'carte-blanche',
    name: 'Carte Blanche',
    tagline: 'New-gen Newspapers',
    status: 'main focus',
    icon: '/carteblanche.jpeg',
    sections: [
      {
        title: 'tldr',
        blocks: [
          {
            kind: 'p',
            text:
              'Newspapers are the only medium that never made it into the modern creative economy. Carte Blanche fixes that: an on-demand, custom-curated newspaper, distributed via printers in coffee stores. Print and go.',
          },
        ],
      },
      {
        title: 'the thesis',
        blocks: [
          { kind: 'p', text: 'Newspapers got stuck:' },
          {
            kind: 'ul',
            items: [
              'Legitimacy built on brands instead of editors → no creator economy.',
              'Each newspaper looks the same → zero customization.',
              'You have to walk to a kiosk → distribution sucks.',
            ],
          },
          {
            kind: 'p',
            text:
              "Flip all three and you get Carte Blanche. I like this framing because it shows I literally own a medium — but distribution is the #1 problem in the industry, so that's the lead.",
          },
        ],
      },
      {
        title: 'what it is',
        blocks: [
          {
            kind: 'p',
            text:
              'Anyone can compose their own finite newspaper. Pick your sources, get your paper. The pitch I keep coming back to: in times of abundance and infinity, finite sources become valuable. Humans cherry-pick what they read better than algorithms — they just need a tool that respects that.',
          },
          {
            kind: 'p',
            text:
              'The sharing layer is what makes it actually interesting. "Read what Paul Graham reads" — his favourite tweet, a quote from a book, a newspaper article, a breakthrough paper. He gets a "share to app" button and a revenue share; everyone else gets a curated brief of what inspires PG. Getting a few cool people to use it is crucial. If that happens, it might just get me to ramen profitable — which is all I want before I think bigger.',
          },
        ],
      },
      {
        title: 'distribution',
        blocks: [
          {
            kind: 'p',
            text:
              "The original sexy idea: people print themselves a newspaper at a coffee spot counter — meter-wide status symbol, read alongside their matcha. I still like it. But scaling printers sucks and printing costs money, so it's the second layer, not the first. The app works without it.",
          },
        ],
      },
      {
        title: 'where i am',
        blocks: [
          {
            kind: 'p',
            text:
              'Working demo, getting better day by day. New features daily. Free for everyone. Try it.',
          },
        ],
      },
      {
        title: "what's next",
        blocks: [
          {
            kind: 'p',
            text:
              "This is the simplest, most straightforward project I've had so far. Technically simple as fuck. I expect legal challenges around creative rights — they'll constrain the value, but I think it's a nice product even without breaking them lol.",
          },
        ],
      },
      {
        title: 'disclaimer',
        blocks: [
          {
            kind: 'p',
            text:
              "The name isn't great. Open to recommendations — write me if you have one.",
          },
        ],
      },
    ],
  },
]

const projectOrder = ['lambert', 'carte-blanche', 'edit', 'artists', 'networker']
const orderedProjects = [...projects].sort(
  (a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id)
)

const contacts = [
  { label: 'email', handle: 'wiktor.loboda@...', href: 'mailto:wiktor.loboda@icloud.com' },
  { label: 'twitter', handle: '@LobodaWiktor', href: 'https://x.com/LobodaWiktor' },
  { label: 'instagram', handle: '@wik.lob', href: 'https://www.instagram.com/wik.lob/' },
  { label: 'substack', handle: '@wiktorloboda', href: 'https://substack.com/@wiktorloboda' },
]

const aboutSections: Section[] = [
  {
    title: 'about me',
    blocks: [
      {
        kind: 'p',
        text:
          '20yo coder from Gdańsk, Poland. Studied programming in high school under Professor Szubartowski — although hardly his favourite. Went to humanities studies two years ago, found them useless a month in, but failed to drop out until now. Just didn\'t have the courage, apparently. Instead, I re-learned full stack coding with Claude Code, building cool stuff along the way (check out the actual projects: show > tell).',
      },
      {
        kind: 'p',
        text:
          'I built [[lambert|The Lambert]] — International Journal of Poles. I did the software ([[edit|my own free copy of Notion]] with org management on top, now adding n8n), did the recruitment, managed the whole thing, and delivered a print edition in late April 2026.',
      },
      {
        kind: 'p',
        text:
          'Earlier I worked on [[networker|Networker]]. Learned a lot, but was too lonely, and switched to something simpler. Now I work on [[carte-blanche|Carte Blanche]]: a new take on newspapers. Read about it or try it.',
      },
    ],
  },
  {
    title: 'how i introduce myself',
    blocks: [
      {
        kind: 'p',
        text:
          "I always tend to say, that im really good in the core stuff: I know how to read, write, think, speak, and do my best to listen. I like to decouple things into first principles; that allows me to question simple stuff in depth, and come up with risky but sexy ideas for projects (check out [[carte-blanche|Carte Blanche]]). I also consider myself a complete person — I'm not a genius in anything in particular, but am, in fact, an agentic generalist — I am good in organisation building, project management, but also in creative works or just coding in the basement.",
      },
      {
        kind: 'p',
        text:
          "I learned inDesign in a 20-hour day, just so we can deliver the quarterly journal; I taught myself full stack web dev via CC to a sufficient extent, so that the product works and the repo doesn't look like an atrocity. I am great in doing uncomfortable stuff that has to be done, insofar as I believe in the end goal; on the other hand, I am very very bad at doing things I don't believe in. I also have a lot of faith in people, what is great when they are, but has also led to some slip-ups when I misplaced my trust.",
      },
    ],
  },
  {
    title: 'also',
    blocks: [
      {
        kind: 'p',
        text:
          'I never wrote a journal of my own — instead, I just talk to random people about everything I feel, think or do. So if u want to know who I am, talk to those who know me. Whatever they say, alongside my actual work (projects), will be way more valuable, then whatever I write here.',
      },
    ],
  },
]

function ProjectIcon({ project, size }: { project: Project; size: number }) {
  if (project.icon) {
    return (
      <img
        className="pf-icon"
        src={project.icon}
        alt={project.name}
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <div
      className="pf-icon pf-icon--placeholder"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {project.name.charAt(0)}
    </div>
  )
}

type InlinePart =
  | { kind: 'text'; text: string }
  | { kind: 'ref'; target: string; label: string }
  | { kind: 'link'; href: string; label: string }

const REF_RE = /\[\[([^\]]+)\]\]/g

function parseInline(text: string): InlinePart[] {
  const parts: InlinePart[] = []
  let last = 0
  for (const m of text.matchAll(REF_RE)) {
    const idx = m.index ?? 0
    if (idx > last) parts.push({ kind: 'text', text: text.slice(last, idx) })
    const inner = m[1]
    const pipe = inner.indexOf('|')
    const target = pipe >= 0 ? inner.slice(0, pipe) : inner
    const explicitLabel = pipe >= 0 ? inner.slice(pipe + 1) : null
    if (/^https?:\/\//.test(target) || target.startsWith('mailto:')) {
      parts.push({ kind: 'link', href: target, label: explicitLabel ?? target })
    } else {
      const label =
        explicitLabel ?? projects.find(p => p.id === target)?.name ?? target
      parts.push({ kind: 'ref', target, label })
    }
    last = idx + m[0].length
  }
  if (last < text.length) parts.push({ kind: 'text', text: text.slice(last) })
  return parts
}

function InlineText({
  text,
  onRef,
}: {
  text: string
  onRef: (target: string) => void
}) {
  const parts = parseInline(text)
  return (
    <>
      {parts.map((p, i) => {
        if (p.kind === 'text') return <span key={i}>{p.text}</span>
        if (p.kind === 'link')
          return (
            <a
              key={i}
              className="pf-inline-link"
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {p.label}
            </a>
          )
        return (
          <button
            key={i}
            type="button"
            className="pf-inline-ref"
            onClick={() => onRef(p.target)}
          >
            {p.label}
          </button>
        )
      })}
    </>
  )
}

function RefLink({
  target,
  onRef,
  children,
}: {
  target: string
  onRef: (target: string) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className="pf-inline-ref"
      onClick={() => onRef(target)}
    >
      {children}
    </button>
  )
}

function SectionView({
  section,
  onRef,
}: {
  section: Section
  onRef: (target: string) => void
}) {
  return (
    <section className="pf-window-section">
      <div className="pf-window-section-title">// {section.title}</div>
      {section.blocks.map((b, i) =>
        b.kind === 'p' ? (
          <p key={i} className="pf-window-text">
            <InlineText text={b.text} onRef={onRef} />
          </p>
        ) : (
          <ul key={i} className="pf-window-list">
            {b.items.map((it, j) => (
              <li key={j}>
                <InlineText text={it} onRef={onRef} />
              </li>
            ))}
          </ul>
        )
      )}
    </section>
  )
}

function Window({
  ariaLabel,
  sourceRect,
  onClose,
  closeSignal,
  children,
}: {
  ariaLabel: string
  sourceRect: DOMRect | null
  onClose: () => void
  closeSignal: number
  children: React.ReactNode
}) {
  const windowRef = useRef<HTMLDivElement>(null)
  const [closing, setClosing] = useState(false)
  const initialCloseSignal = useRef(closeSignal)

  useLayoutEffect(() => {
    const win = windowRef.current
    if (!win || !sourceRect) return

    const winRect = win.getBoundingClientRect()
    const dx =
      sourceRect.left + sourceRect.width / 2 - (winRect.left + winRect.width / 2)
    const dy =
      sourceRect.top + sourceRect.height / 2 - (winRect.top + winRect.height / 2)
    const sx = sourceRect.width / winRect.width
    const sy = sourceRect.height / winRect.height
    const scale = Math.sqrt(sx * sy)

    win.style.transformOrigin = 'center center'
    win.style.transition = 'none'
    win.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    win.style.opacity = '0'

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!windowRef.current) return
        windowRef.current.style.transition =
          'transform 480ms cubic-bezier(0.16, 1, 0.3, 1), opacity 480ms cubic-bezier(0.16, 1, 0.3, 1)'
        windowRef.current.style.transform = ''
        windowRef.current.style.opacity = '1'
      })
    })
  }, [sourceRect])

  const handleClose = () => {
    const win = windowRef.current
    if (!win || !sourceRect) {
      onClose()
      return
    }
    const winRect = win.getBoundingClientRect()
    const dx =
      sourceRect.left + sourceRect.width / 2 - (winRect.left + winRect.width / 2)
    const dy =
      sourceRect.top + sourceRect.height / 2 - (winRect.top + winRect.height / 2)
    const sx = sourceRect.width / winRect.width
    const sy = sourceRect.height / winRect.height
    const scale = Math.sqrt(sx * sy)

    setClosing(true)
    win.style.transition =
      'transform 320ms cubic-bezier(0.7, 0, 0.84, 0), opacity 280ms cubic-bezier(0.7, 0, 0.84, 0)'
    win.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`
    win.style.opacity = '0'

    setTimeout(onClose, 320)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (closeSignal !== initialCloseSignal.current && !closing) {
      handleClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeSignal])

  return (
    <div className={`pf-modal ${closing ? 'pf-modal--closing' : ''}`}>
      <div className="pf-backdrop" onClick={handleClose} />
      <div className="pf-window" ref={windowRef} role="dialog" aria-label={ariaLabel}>
        <button
          className="pf-window-close"
          onClick={handleClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="pf-window-body">{children}</div>
      </div>
    </div>
  )
}

function ProjectBody({
  project,
  onRef,
}: {
  project: Project
  onRef: (target: string) => void
}) {
  return (
    <>
      <div className="pf-window-header">
        <ProjectIcon project={project} size={56} />
        <div>
          <div className="pf-window-name-row">
            <span className="pf-window-name">{project.name}</span>
            <span className="pf-status-pill">{project.status}</span>
          </div>
          <div className="pf-window-tagline">{project.tagline}</div>
        </div>
      </div>

      {project.url && (
        <a
          className="pf-window-link"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          → visit {project.url.replace(/^https?:\/\//, '')}
        </a>
      )}

      {project.items && (
        <div className="pf-folder-items">
          {project.items.map(item => (
            <a
              key={item.id}
              className="pf-folder-item"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="pf-folder-item-name">{item.name}</span>
              <span className="pf-folder-item-host">
                {item.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </span>
            </a>
          ))}
        </div>
      )}

      {project.sections.map((s, i) => (
        <SectionView key={i} section={s} onRef={onRef} />
      ))}
    </>
  )
}

function AboutBody({ onRef }: { onRef: (target: string) => void }) {
  return (
    <>
      {aboutSections.map((s, i) => (
        <SectionView key={i} section={s} onRef={onRef} />
      ))}
    </>
  )
}

function CvBody({ onRef }: { onRef: (target: string) => void }) {
  return (
    <div className="pf-cv">
      <header className="pf-cv-header">
        <div className="pf-cv-name">Wiktor Łoboda</div>
        <div className="pf-cv-meta">
          +48 696 010 006 · wiktor.loboda@icloud.com
        </div>
      </header>

      <section className="pf-cv-section">
        <div className="pf-window-section-title">// experience</div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">
            <RefLink target="carte-blanche" onRef={onRef}>Carte Blanche</RefLink> (2026 – Now)
          </div>
          <div className="pf-cv-entry-role">Founder</div>
          <ul className="pf-cv-entry-bullets">
            <li>
              On-demand custom-curated newspaper — bringing newspapers into the modern
              creator economy.
            </li>
            <li>Working demo live, free for everyone. Building solo.</li>
          </ul>
        </div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">
            <RefLink target="lambert" onRef={onRef}>The Lambert</RefLink> (December 2025 – Now)
          </div>
          <div className="pf-cv-entry-role">Cofounder, Operational Director</div>
          <ul className="pf-cv-entry-bullets">
            <li>
              English-language quarterly written by Polish students from around the
              globe. 50-person team. Delivered first 100-page print edition.
            </li>
            <li>
              Scouting, recruitment, onboarding, communications; social media and
              visuals; custom software development.
            </li>
            <li>General, hands-on leadership.</li>
          </ul>
        </div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">
            <RefLink target="networker" onRef={onRef}>Networker</RefLink> (April 2025 – Now)
          </div>
          <div className="pf-cv-entry-role">Founder</div>
          <ul className="pf-cv-entry-bullets">
            <li>Startup in the professional events industry: an event aggregator browser.</li>
            <li>
              Try it yourself at:{' '}
              <a
                className="pf-inline-link"
                href="https://networker.events"
                target="_blank"
                rel="noopener noreferrer"
              >
                networker.events
              </a>
              . Working and safe but not ready. Pre-launch.
            </li>
          </ul>
        </div>
      </section>

      <section className="pf-cv-section">
        <div className="pf-window-section-title">// education</div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">University of Amsterdam (dropped out)</div>
          <div className="pf-cv-entry-role">
            BA European Studies, Major in Law and Economics — Sept 2024 – June 2027
          </div>
          <ul className="pf-cv-entry-bullets">
            <li>1st year GPA 7,91/10. Courses on European history, culture, and politics.</li>
            <li>2nd year: major in Law and Economics.</li>
          </ul>
          <div className="pf-cv-entry-role">
            BSc Business Administration — Sept 2025 – June 2028
          </div>
        </div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">
            3rd Secondary School of the Polish Navy with Bilingual Branches, Gdynia
          </div>
          <div className="pf-cv-entry-role">Mathematics–Computer Science</div>
          <ul className="pf-cv-entry-bullets">
            <li>CS under Professor Szubartowski.</li>
            <li>Matura avg 92%.</li>
            <li>GPA avg 5,14/6.</li>
          </ul>
        </div>
      </section>

      <section className="pf-cv-section">
        <div className="pf-window-section-title">// additional</div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">Languages</div>
          <p className="pf-cv-entry-text">English C2, French B1, Polish C3.</p>
        </div>

        <div className="pf-cv-entry">
          <div className="pf-cv-entry-org">Intellectual interests</div>
          <p className="pf-cv-entry-text">
            Technical: business strategies, start-ups and founder-modes, AI systems
            in practice.
          </p>
          <p className="pf-cv-entry-text">
            Philosophical: truth, point of reference, learning theories, abundance.
          </p>
        </div>
      </section>
    </div>
  )
}

type ActiveWindow =
  | { kind: 'project'; project: Project; rect: DOMRect }
  | { kind: 'about'; rect: DOMRect }
  | { kind: 'cv'; rect: DOMRect }

function Portfolio() {
  const [active, setActive] = useState<ActiveWindow | null>(null)
  const [closeSignal, setCloseSignal] = useState(0)
  const pendingTarget = useRef<ActiveWindow | null>(null)
  const cardRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const aboutRef = useRef<HTMLButtonElement>(null)
  const cvRef = useRef<HTMLButtonElement>(null)

  const buildProjectTarget = (id: string): ActiveWindow | null => {
    const project = projects.find(p => p.id === id)
    if (!project) return null
    const el = cardRefs.current.get(id)
    const rect = (el ? el.getBoundingClientRect() : null) as DOMRect
    return { kind: 'project', project, rect }
  }

  const requestOpen = (target: ActiveWindow) => {
    if (active) {
      pendingTarget.current = target
      setCloseSignal(s => s + 1)
    } else {
      setActive(target)
    }
  }

  const handleRef = (id: string) => {
    const target = buildProjectTarget(id)
    if (target) requestOpen(target)
  }

  const openProject = (project: Project) => {
    const target = buildProjectTarget(project.id)
    if (target) requestOpen(target)
  }

  const openAbout = () => {
    const rect = (aboutRef.current?.getBoundingClientRect() ?? null) as DOMRect
    requestOpen({ kind: 'about', rect })
  }

  const openCv = () => {
    const rect = (cvRef.current?.getBoundingClientRect() ?? null) as DOMRect
    requestOpen({ kind: 'cv', rect })
  }

  const handleClosed = () => {
    if (pendingTarget.current) {
      const next = pendingTarget.current
      pendingTarget.current = null
      setActive(next)
    } else {
      setActive(null)
    }
  }

  const activeKey =
    active?.kind === 'project'
      ? `project:${active.project.id}`
      : active?.kind ?? 'none'

  return (
    <div className="pf-root">
      <aside className="pf-sidebar">
        <section className="pf-widget">
          <h1 className="pf-name">Wiktor Łoboda</h1>
          <div className="pf-role">Builder · Founder · Leader</div>
          <p className="pf-bio">
            Software dev, Organisation Leader, still a kid from Gdańsk, Poland.
            Cofounder of{' '}
            <RefLink target="lambert" onRef={handleRef}>
              The Lambert
            </RefLink>
            , english-language journal of polish youth; now focusing on{' '}
            <RefLink target="carte-blanche" onRef={handleRef}>
              Carte Blanche
            </RefLink>
            , reinventing newspapers for modern media era. Particular creative
            interest in media, art, and inter-human activities. Now also a
            drop-out. And I really love newspapers.
          </p>
          <div className="pf-bio-links">
            <button ref={aboutRef} className="pf-bio-link" onClick={openAbout}>
              about me
            </button>
            <button ref={cvRef} className="pf-bio-link" onClick={openCv}>
              my cv
            </button>
          </div>
        </section>

        <section className="pf-widget">
          <ul className="pf-contacts">
            {contacts.map(c => (
              <li key={c.label}>
                <a
                  className="pf-contact"
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                >
                  <span className="pf-contact-key">{c.label}</span>
                  <span className="pf-contact-arrow">→</span>
                  <span className="pf-contact-value">{c.handle}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      <main className="pf-main">
        <div className="pf-grid">
          {orderedProjects.map(project => {
            const isActive = active?.kind === 'project' && active.project.id === project.id
            return (
              <button
                key={project.id}
                ref={el => {
                  if (el) cardRefs.current.set(project.id, el)
                  else cardRefs.current.delete(project.id)
                }}
                className="pf-card"
                onClick={() => openProject(project)}
                style={{ visibility: isActive ? 'hidden' : undefined }}
              >
                <div className="pf-card-icon-wrap">
                  <ProjectIcon project={project} size={84} />
                  <span className="pf-status-pill pf-status-pill--corner">
                    {project.status}
                  </span>
                </div>
                <div className="pf-card-name">{project.name}</div>
                <div className="pf-card-tagline">{project.tagline}</div>
              </button>
            )
          })}
        </div>
      </main>

      {active?.kind === 'project' && (
        <Window
          key={activeKey}
          ariaLabel={active.project.name}
          sourceRect={active.rect}
          onClose={handleClosed}
          closeSignal={closeSignal}
        >
          <ProjectBody project={active.project} onRef={handleRef} />
        </Window>
      )}

      {active?.kind === 'about' && (
        <Window
          key={activeKey}
          ariaLabel="About me"
          sourceRect={active.rect}
          onClose={handleClosed}
          closeSignal={closeSignal}
        >
          <AboutBody onRef={handleRef} />
        </Window>
      )}

      {active?.kind === 'cv' && (
        <Window
          key={activeKey}
          ariaLabel="My CV"
          sourceRect={active.rect}
          onClose={handleClosed}
          closeSignal={closeSignal}
        >
          <CvBody onRef={handleRef} />
        </Window>
      )}
    </div>
  )
}

export default Portfolio
