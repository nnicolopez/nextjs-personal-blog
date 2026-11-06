"use client";

import { useState } from "react";
import { monthMarks } from "./format";
import Media from "./Media";
import type { PracticesData, PublicInstrument } from "./types";
import s from "./practices.module.css";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * The sequencer and the instruments it filters. They share one piece of state
 * (the selected practice), so they live in the same client component; the
 * hero copy around the sequencer stays server-rendered and is passed in.
 */
const PracticesBoard = ({ data, intro }: { data: PracticesData; intro: React.ReactNode }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const { labels } = data;
  const byId = new Map(data.practices.map((p) => [p.id, p]));
  const color = (practiceId: string): Vars => ({ "--c": byId.get(practiceId)?.color ?? "#55615F" });
  const href = (i: PublicInstrument) => `${data.basePath}/${i.slug}`;

  const visible = data.instruments.filter((i) => !selected || i.practiceId === selected);
  const featured = visible.find((i) => i.featured);
  const rest = visible.filter((i) => i !== featured);
  const marks = monthMarks(data.sequencer.weeks, labels.lang);

  const toggle = (id: string) => {
    const next = selected === id ? null : id;
    setSelected(next);
    if (next) document.getElementById("instrumentos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className={`${s.wrap} ${s.hero}`}>
        <div>{intro}</div>
        {data.sequencer.rows.length > 0 && (
          <div className={`${s.seq} ${selected ? s.filtering : ""}`}>
            <div className={s.seqHead} aria-hidden="true">
              <span />
              {marks.map((mark, i) => <span key={data.sequencer.weeks[i]}>{mark}</span>)}
            </div>
            {data.sequencer.rows.map((row) => {
              const practice = byId.get(row.practiceId);
              if (!practice) return null;
              return (
                <button
                  key={row.practiceId}
                  type="button"
                  className={s.row}
                  style={color(row.practiceId)}
                  aria-pressed={selected === row.practiceId}
                  aria-label={`${practice.name}: ${row.total} ${labels.entriesCount}. ${labels.filterBy}`}
                  onClick={() => toggle(row.practiceId)}
                >
                  <span className={s.rowLabel}>
                    <span className={s.dot} />
                    <span>{practice.name}</span>
                  </span>
                  {row.levels.map((level, col) => (
                    <span
                      key={data.sequencer.weeks[col]}
                      className={`${s.cell} ${level ? s[`l${level}`] : ""}`}
                      style={{ "--col": col } as Vars}
                    />
                  ))}
                </button>
              );
            })}
            <div className={s.seqFoot}>
              <span>{labels.sequencerCaption}</span>
              {selected && <button type="button" onClick={() => setSelected(null)}>{labels.showAll}</button>}
            </div>
          </div>
        )}
      </section>

      {data.instruments.length > 0 && (
        <section className={s.sec} id="instrumentos">
          <div className={s.wrap}>
            <div className={s.secHead}>
              <h2 className={s.h2}>{labels.instruments}</h2>
              <p>{labels.instrumentsSub}</p>
            </div>

            {featured && (
              <article className={s.featured} style={color(featured.practiceId)}>
                <div className={s.shot}>
                  {featured.images[0] ? (
                    <Media kind="image" url={featured.images[0].url} title={featured.images[0].caption || featured.name} />
                  ) : (
                    <span className={s.shotEmpty} aria-hidden="true" />
                  )}
                </div>
                <div>
                  <span className={s.tag}><span className={s.dot} />{byId.get(featured.practiceId)?.name}</span>
                  <h3 className={s.featTitle}><a href={href(featured)}>{featured.name}</a></h3>
                  <p className={s.muted}>{featured.summary}</p>
                  <dl className={s.facts}>
                    <dt>{labels.colKind}</dt><dd>{labels.kind[featured.kind]}</dd>
                    <dt>{labels.colStatus}</dt><dd><span className={s.status} data-status={featured.status}>{labels.status[featured.status]}</span></dd>
                    {featured.byAi[0] && <><dt>{labels.colAi}</dt><dd>{featured.byAi[0]}</dd></>}
                  </dl>
                </div>
              </article>
            )}

            {rest.length > 0 && (
              <>
                <div className={`${s.idxHead} ${s.cond}`} aria-hidden="true">
                  <span /><span>{labels.colInstrument}</span><span>{labels.colKind}</span><span>{labels.colStatus}</span><span>{labels.colAi}</span>
                </div>
                <ul className={s.index}>
                  {rest.map((i) => (
                    <li key={i.id} className={s.item} style={color(i.practiceId)}>
                      <span className={s.bar} />
                      <div>
                        <h3 className={s.itemTitle}><a href={href(i)}>{i.name}</a></h3>
                        <p className={s.sum}>{i.summary}</p>
                      </div>
                      <span className={s.cond}>{labels.kind[i.kind]}</span>
                      <span className={`${s.cond} ${s.status}`} data-status={i.status}>{labels.status[i.status]}</span>
                      <p className={s.ai}>{i.byAi[0] ?? ""}</p>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {visible.length === 0 && <p className={s.empty}>{labels.noInstruments}</p>}
          </div>
        </section>
      )}
    </>
  );
};

export default PracticesBoard;
