import { embedUrl, slugify } from "@/lib/practices";
import { formatDay } from "./format";
import Media from "./Media";
import type { PracticesLabels, PublicEntry, PublicInstrument, PublicPractice } from "./types";
import s from "./practices.module.css";

export interface InstrumentViewProps {
  fullName: string;
  basePath: string;
  instrument: PublicInstrument;
  practice: PublicPractice | undefined;
  /** Entries linked to this instrument, newest first */
  buildLog: PublicEntry[];
  prev?: { slug: string; name: string };
  next?: { slug: string; name: string };
  labels: PracticesLabels;
}

type Vars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * An instrument's public page. Also rendered live in the dashboard editor,
 * so it takes plain data and has no server-only dependencies.
 */
const InstrumentView = ({ fullName, basePath, instrument: i, practice, buildLog, prev, next, labels }: InstrumentViewProps) => {
  const demoSrc = embedUrl(i.demo);
  const blocks: { title: string; body: React.ReactNode }[] = [];

  if (i.problem) {
    blocks.push({
      title: labels.problem,
      body: <div className={s.prose}>{i.problem.split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)}</div>,
    });
  }
  if (i.byMe.length || i.byAi.length) {
    blocks.push({
      title: labels.howAi,
      body: (
        <div className={s.split}>
          <div><h3>{labels.byMe}</h3><ul>{i.byMe.map((line, k) => <li key={k}>{line}</li>)}</ul></div>
          <div><h3>{labels.byAi}</h3><ul>{i.byAi.map((line, k) => <li key={k}>{line}</li>)}</ul></div>
        </div>
      ),
    });
  }
  if (i.images.length) {
    blocks.push({
      title: labels.gallery,
      body: (
        <div className={s.gallery}>
          {i.images.map((image, k) => (
            <figure key={k}>
              {/* eslint-disable-next-line @next/next/no-img-element -- remote URLs with unknown sizes */}
              <img src={image.url} alt={image.caption || i.name} loading="lazy" />
              {image.caption && <figcaption>{image.caption}</figcaption>}
            </figure>
          ))}
        </div>
      ),
    });
  }
  if (buildLog.length) {
    blocks.push({
      title: labels.buildLog,
      body: (
        <ol className={s.timeline}>
          {buildLog.map((entry) => (
            <li key={entry.id}>
              <time className={s.cond} dateTime={entry.date}>{formatDay(entry.date, labels.lang)}</time>
              <h3>{entry.title}</h3>
              {entry.body && <p>{entry.body}</p>}
              {entry.mediaUrl && <Media kind={entry.kind} url={entry.mediaUrl} title={entry.title} className={s.timelineMedia} />}
            </li>
          ))}
        </ol>
      ),
    });
  }

  return (
    <div className={s.root} style={{ "--c": practice?.color ?? "#55615F" } as Vars}>
      <header className={`${s.wrap} ${s.detailTop}`}>
        <a className={s.brand} href={basePath}>{fullName}</a>
        <a className={s.cond} href={`${basePath}#instrumentos`}>{labels.allInstruments}</a>
      </header>

      <main className={s.wrap}>
        <section className={s.detailHead}>
          <div>
            {practice && (
              <a className={`${s.tag} ${s.tagLink}`} href={`${basePath}#p-${slugify(practice.name)}`}>
                <span className={s.dot} />{practice.name}
              </a>
            )}
            <h1 className={s.detailH1}>{i.name}</h1>
            {i.summary && <p className={s.summary}>{i.summary}</p>}
          </div>
          <div>
            <dl className={s.detailFacts}>
              <dt>{labels.colKind}</dt><dd>{labels.kind[i.kind]}</dd>
              <dt>{labels.colStatus}</dt><dd><span className={s.status} data-status={i.status}>{labels.status[i.status]}</span></dd>
              {i.materials.length > 0 && (
                <><dt>{labels.materials}</dt><dd className={s.chips}>{i.materials.map((m) => <span key={m}>{m}</span>)}</dd></>
              )}
            </dl>
            {i.links.length > 0 && (
              <div className={s.actions}>
                {i.links.map((link, k) => (
                  <a key={k} className={s.btn} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
                ))}
              </div>
            )}
          </div>
        </section>

        {demoSrc && (
          <div className={s.demo}>
            <iframe
              src={demoSrc}
              title={`${labels.demo}: ${i.name}`}
              loading="lazy"
              allow="fullscreen; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
            />
          </div>
        )}

        {blocks.map((block, k) => (
          <section key={block.title} className={`${s.block} ${k === 0 ? s.firstBlock : ""}`}>
            <h2 className={s.h2small}>{block.title}</h2>
            {block.body}
          </section>
        ))}

        {(prev || next) && (
          <nav className={s.pager} aria-label={labels.allInstruments}>
            {prev ? <a href={`${basePath}/${prev.slug}`}><span className={s.cond}>{labels.previous}</span><b>{prev.name}</b></a> : <span />}
            {next && <a href={`${basePath}/${next.slug}`} style={{ textAlign: "right" }}><span className={s.cond}>{labels.next}</span><b>{next.name}</b></a>}
          </nav>
        )}
      </main>
    </div>
  );
};

export default InstrumentView;
