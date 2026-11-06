import { slugify } from "@/lib/practices";
import type { PublicPageData } from "../PublicPage";
import { formatDay } from "./format";
import Media from "./Media";
import Plate from "./Plate";
import Sequencer from "./Sequencer";
import type { PracticesData, PublicInstrument } from "./types";
import s from "./practices.module.css";

const SOCIAL_LABELS = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram" } as const;
const JOURNAL_SIZE = 8;

type Vars = React.CSSProperties & Record<`--${string}`, string>;

/**
 * The "practices" template. Reading order: who this is (hero), how steady the
 * practice is (sequencer), what to look at first (featured instrument), each
 * practice with its instruments, then the process (journal).
 */
const PracticesPage = ({ data, practices: d }: { data: PublicPageData; practices: PracticesData }) => {
  const { labels } = d;
  const byId = new Map(d.practices.map((p) => [p.id, p]));
  const anchor = (practiceId: string) => `p-${slugify(byId.get(practiceId)?.name ?? practiceId) || practiceId}`;
  const href = (i: PublicInstrument) => `${d.basePath}/${i.slug}`;
  const color = (practiceId: string): Vars => ({ "--c": byId.get(practiceId)?.color ?? "#55615F" });
  const social = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).filter((key) => data.socialLinks[key]);

  const featured = d.instruments.find((i) => i.featured);
  const journal = d.entries.slice(0, JOURNAL_SIZE);
  const instrumentName = new Map(d.instruments.map((i) => [i.id, i]));
  // Practices with nothing public yet stay off the page
  const tracks = d.practices
    .map((p) => ({
      practice: p,
      instruments: d.instruments.filter((i) => i.practiceId === p.id && i !== featured),
      allInstruments: d.instruments.filter((i) => i.practiceId === p.id).length,
      entries: d.entries.filter((e) => e.practiceId === p.id),
    }))
    .filter((t) => t.allInstruments > 0 || t.entries.length > 0);

  const socialLinks = social.map((key) => (
    <a key={key} href={data.socialLinks[key]} target="_blank" rel="noopener noreferrer me">{SOCIAL_LABELS[key]}</a>
  ));

  return (
    <div className={s.root}>
      <header className={`${s.wrap} ${s.top}`}>
        <a className={s.brand} href={d.basePath}>{data.fullName}</a>
        <nav aria-label={data.fullName}>
          <ul className={s.nav}>
            {tracks.length > 0 && <li><a href="#practicas">{labels.practicesTitle}</a></li>}
            {journal.length > 0 && <li><a href="#bitacora">{labels.journal}</a></li>}
          </ul>
        </nav>
      </header>

      <main>
        <section className={`${s.wrap} ${s.hero}`}>
          <h1 className={s.h1}>{data.headline || data.fullName}</h1>
          <div className={s.heroSide}>
            {data.bio && <p className={s.lede}>{data.bio}</p>}
            {tracks.length > 0 && (
              <ul className={s.legend} aria-label={labels.practicesTitle}>
                {tracks.map(({ practice }) => (
                  <li key={practice.id} style={color(practice.id)}>
                    <a href={`#${anchor(practice.id)}`}><span className={s.dot} />{practice.name}</a>
                  </li>
                ))}
              </ul>
            )}
            {socialLinks.length > 0 && <div className={s.social}>{socialLinks}</div>}
          </div>
        </section>

        {d.sequencer.rows.length > 0 && d.entries.length > 0 && (
          <section className={`${s.wrap} ${s.band}`} aria-labelledby="constancia">
            <h2 id="constancia" className={s.bandTitle}>{labels.consistency}</h2>
            <Sequencer data={d} anchor={anchor} />
          </section>
        )}

        {featured && (
          <section className={s.sec} aria-labelledby="en-foco">
            <div className={s.wrap}>
              <h2 id="en-foco" className={s.h2}>{labels.featured}</h2>
              <article className={s.featured} style={color(featured.practiceId)}>
                <a className={s.shot} href={href(featured)} tabIndex={-1} aria-hidden="true">
                  {featured.images[0] ? (
                    <Media kind="image" url={featured.images[0].url} title={featured.images[0].caption || featured.name} />
                  ) : (
                    <Plate instrument={featured} labels={labels} />
                  )}
                </a>
                <div>
                  <span className={s.tag}><span className={s.dot} />{byId.get(featured.practiceId)?.name}</span>
                  <h3 className={s.featTitle}><a href={href(featured)}>{featured.name}</a></h3>
                  <p className={s.muted}>{featured.summary}</p>
                  {(featured.byMe[0] || featured.byAi[0]) && (
                    <dl className={s.facts}>
                      {featured.byMe[0] && <><dt>{labels.byMe}</dt><dd>{featured.byMe[0]}</dd></>}
                      {featured.byAi[0] && <><dt>{labels.byAi}</dt><dd>{featured.byAi[0]}</dd></>}
                    </dl>
                  )}
                  <a className={s.more} href={href(featured)}>{labels.seeInstrument}</a>
                </div>
              </article>
            </div>
          </section>
        )}

        {tracks.length > 0 && (
          <section className={s.sec} id="practicas" aria-labelledby="practicas-titulo">
            <div className={s.wrap}>
              <div className={s.secHead}>
                <h2 id="practicas-titulo" className={s.h2}>{labels.practicesTitle}</h2>
                <p>{labels.practicesSub}</p>
              </div>
              {tracks.map(({ practice, instruments, allInstruments, entries }) => (
                <article key={practice.id} id={anchor(practice.id)} className={s.track} style={color(practice.id)}>
                  <div className={s.trackSide}>
                    <h3 className={s.trackTitle}><span className={s.dot} />{practice.name}</h3>
                    {practice.description && <p className={s.muted}>{practice.description}</p>}
                    <p className={s.trackMeta}>
                      {allInstruments} {allInstruments === 1 ? labels.instrumentOne : labels.instrumentMany}, {entries.length} {entries.length === 1 ? labels.entryOne : labels.entryMany}
                    </p>
                    {entries[0] && (
                      <div className={s.latest}>
                        <span className={s.cond}>{labels.latestEntry}, {formatDay(entries[0].date, labels.lang)}</span>
                        <p>{entries[0].title}</p>
                      </div>
                    )}
                  </div>
                  {instruments.length > 0 ? (
                    <ul className={s.cards}>
                      {instruments.map((i) => (
                        <li key={i.id} className={s.card}>
                          <a href={href(i)} className={s.cardLink}>
                            <span className={s.cardThumb}>
                              {i.images[0] ? <Media kind="image" url={i.images[0].url} title="" /> : <Plate instrument={i} labels={labels} size="sm" />}
                            </span>
                            <span className={s.cardName}>{i.name}</span>
                          </a>
                          {i.summary && <p className={s.sum}>{i.summary}</p>}
                          <span className={`${s.cond} ${s.status}`} data-status={i.status}>{labels.status[i.status]}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className={s.trackEmpty}>
                      {allInstruments > 0 && featured?.practiceId === practice.id ? labels.featuredAbove : labels.noInstruments}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {journal.length > 0 && (
          <section className={s.sec} id="bitacora" aria-labelledby="bitacora-titulo">
            <div className={s.wrap}>
              <div className={s.secHead}>
                <h2 id="bitacora-titulo" className={s.h2}>{labels.journal}</h2>
                <p>{labels.journalSub}</p>
              </div>
              <ol className={s.log}>
                {journal.map((entry) => {
                  const practice = byId.get(entry.practiceId);
                  const instrument = entry.instrumentId ? instrumentName.get(entry.instrumentId) : undefined;
                  return (
                    <li key={entry.id} className={s.entry} style={color(entry.practiceId)}>
                      <div className={s.entryMeta}>
                        <time className={s.cond} dateTime={entry.date}>{formatDay(entry.date, labels.lang)}</time>
                        {practice && <span className={s.tag}><span className={s.dot} />{practice.name}</span>}
                      </div>
                      <div className={s.entryBody}>
                        <h3 className={s.entryTitle}>{entry.title}</h3>
                        {entry.body && <p>{entry.body}</p>}
                        {instrument && <a className={s.entryLink} href={href(instrument)}>{instrument.name}</a>}
                      </div>
                      {entry.mediaUrl && <Media kind={entry.kind} url={entry.mediaUrl} title={entry.title} className={s.media} />}
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>
        )}
      </main>

      <footer className={`${s.wrap} ${s.footer}`}>
        <span className={s.brand}>{data.fullName}</span>
        {socialLinks.length > 0 && <div className={s.social}>{socialLinks}</div>}
        <span>{labels.madeWith}</span>
      </footer>
    </div>
  );
};

export default PracticesPage;
