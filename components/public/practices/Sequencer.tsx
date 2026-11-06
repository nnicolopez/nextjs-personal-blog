import { monthMarks } from "./format";
import type { PracticesData } from "./types";
import s from "./practices.module.css";

type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

/**
 * Entries per practice per week, as a drum step sequencer. Each row links to
 * that practice further down the page. Pure CSS: one playhead sweep on load.
 */
const Sequencer = ({ data, anchor }: { data: PracticesData; anchor: (practiceId: string) => string }) => {
  const { labels, sequencer } = data;
  const byId = new Map(data.practices.map((p) => [p.id, p]));
  const marks = monthMarks(sequencer.weeks, labels.lang);
  const rows = sequencer.rows.filter((row) => byId.has(row.practiceId));
  if (rows.length === 0) return null;

  return (
    <div className={s.seq}>
      <div className={s.seqHead} aria-hidden="true">
        <span />
        {marks.map((mark, i) => <span key={sequencer.weeks[i]}>{mark}</span>)}
      </div>
      {rows.map((row) => {
        const practice = byId.get(row.practiceId)!;
        return (
          <a
            key={row.practiceId}
            href={`#${anchor(row.practiceId)}`}
            className={s.row}
            style={{ "--c": practice.color } as Vars}
            aria-label={`${practice.name}: ${row.total} ${labels.entriesCount}`}
          >
            <span className={s.rowLabel}>
              <span className={s.dot} />
              <span className={s.rowName}>{practice.name}</span>
              <span className={s.rowCount}>{row.total}</span>
            </span>
            {row.levels.map((level, col) => (
              <span
                key={sequencer.weeks[col]}
                className={`${s.cell} ${level ? s[`l${level}`] : ""}`}
                style={{ "--col": col } as Vars}
              />
            ))}
          </a>
        );
      })}
      <p className={s.seqFoot}>{labels.sequencerCaption}</p>
    </div>
  );
};

export default Sequencer;
