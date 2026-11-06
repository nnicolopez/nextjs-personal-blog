import type { PublicPageData } from "../PublicPage";
import { formatDay } from "./format";
import Media from "./Media";
import PracticesBoard from "./PracticesBoard";
import type { PracticesData } from "./types";
import s from "./practices.module.css";

const SOCIAL_LABELS = { linkedin: "LinkedIn", github: "GitHub", instagram: "Instagram" } as const;
const JOURNAL_SIZE = 6;

type Vars = React.CSSProperties & Record<`--${string}`, string>;

/** The "practices" template: sequencer, instruments and the latest journal entries. */
const PracticesPage = ({ data, practices }: { data: PublicPageData; practices: PracticesData }) => {
  const { labels } = practices;
  const byId = new Map(practices.practices.map((p) => [p.id, p]));
  const journal = practices.entries.slice(0, JOURNAL_SIZE);
  const social = (Object.keys(SOCIAL_LABELS) as (keyof typeof SOCIAL_LABELS)[]).filter((key) => data.socialLinks[key]);

  const intro = (
    <>
      <h1 className={s.h1}>{data.headline || data.fullName}</h1>
      {data.bio && <p className={s.lede}>{data.bio}</p>}
      {social.length > 0 && (
        <div className={s.social}>
          {social.map((key) => (
            <a key={key} href={data.socialLinks[key]} target="_blank" rel="noopener noreferrer me">{SOCIAL_LABELS[key]}</a>
          ))}
        </div>
      )}
    </>
  );

  return (
    <div className={s.root}>
      <header className={`${s.wrap} ${s.top}`}>
        <a className={s.brand} href={practices.basePath}>{data.fullName}</a>
        <nav aria-label={labels.instruments}>
          <ul className={s.nav}>
            {practices.instruments.length > 0 && <li><a href="#instrumentos">{labels.instruments}</a></li>}
            {journal.length > 0 && <li><a href="#bitacora">{labels.journal}</a></li>}
          </ul>
        </nav>
      </header>

      <main>
        <PracticesBoard data={practices} intro={intro} />

        {journal.length > 0 && (
          <section className={s.sec} id="bitacora">
            <div className={s.wrap}>
              <div className={s.secHead}>
                <h2 className={s.h2}>{labels.journal}</h2>
                <p>{labels.journalSub}</p>
              </div>
              <div className={s.log}>
                {journal.map((entry) => {
                  const practice = byId.get(entry.practiceId);
                  return (
                    <article key={entry.id} className={s.entry} style={{ "--c": practice?.color ?? "#55615F" } as Vars}>
                      {entry.mediaUrl && <Media kind={entry.kind} url={entry.mediaUrl} title={entry.title} className={s.media} />}
                      <time className={s.cond} dateTime={entry.date}>{formatDay(entry.date, labels.lang)}</time>
                      {practice && <span className={s.tag}><span className={s.dot} />{practice.name}</span>}
                      <h3 className={s.entryTitle}>{entry.title}</h3>
                      {entry.body && <p>{entry.body}</p>}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className={`${s.wrap} ${s.footer}`}>
        <span>PersonalCMS</span>
      </footer>
    </div>
  );
};

export default PracticesPage;
