import type { PracticesLabels, PublicInstrument } from "./types";
import s from "./practices.module.css";

/**
 * Stand-in visual for an instrument without screenshots: a spec plate in the
 * practice's color with its type, status, name and materials. Reads as a
 * deliberate object, not as an image that failed to load.
 */
const Plate = ({ instrument: i, labels, size = "lg" }: { instrument: PublicInstrument; labels: PracticesLabels; size?: "lg" | "sm" }) => (
  <div className={`${s.plate} ${size === "sm" ? s.plateSm : ""}`} aria-hidden="true">
    <div className={s.plateTop}>
      <span>{labels.kind[i.kind]}</span>
      {size === "lg" && <span className={s.status} data-status={i.status}>{labels.status[i.status]}</span>}
    </div>
    {size === "lg" ? (
      <div>
        <span className={s.plateName}>{i.name}</span>
        {i.materials.length > 0 && <span className={s.plateMaterials}>{i.materials.slice(0, 5).join(" / ")}</span>}
      </div>
    ) : (
      // In a card the name is right below, so the small plate shows what it's made of instead
      <span className={s.plateStack}>{i.materials.slice(0, 4).join(" / ") || labels.kind[i.kind]}</span>
    )}
  </div>
);

export default Plate;
