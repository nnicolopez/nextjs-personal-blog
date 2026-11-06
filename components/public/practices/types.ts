import type {
  EntryKind,
  InstrumentDemo,
  InstrumentImage,
  InstrumentKind,
  InstrumentLink,
  InstrumentStatus,
} from "@/db/schema";

/** What the "practices" template and instrument pages need, already filtered for the public. */

export interface PublicPractice {
  id: string;
  name: string;
  /** Hex color from the practice palette */
  color: string;
  description: string;
  showInSequencer: boolean;
}

export interface PublicInstrument {
  id: string;
  slug: string;
  practiceId: string;
  name: string;
  kind: InstrumentKind;
  status: InstrumentStatus;
  summary: string;
  problem: string;
  byMe: string[];
  byAi: string[];
  materials: string[];
  demo: InstrumentDemo | null;
  images: InstrumentImage[];
  links: InstrumentLink[];
  featured: boolean;
}

export interface PublicEntry {
  id: string;
  practiceId: string;
  instrumentId: string | null;
  date: string;
  kind: EntryKind;
  title: string;
  body: string;
  mediaUrl: string | null;
}

export interface PracticesLabels {
  lang: "es" | "en";
  instruments: string;
  instrumentsSub: string;
  journal: string;
  journalSub: string;
  sequencerCaption: string;
  showAll: string;
  filterBy: string;
  entriesCount: string;
  noInstruments: string;
  colInstrument: string;
  colKind: string;
  colStatus: string;
  colAi: string;
  kind: Record<InstrumentKind, string>;
  status: Record<InstrumentStatus, string>;
  problem: string;
  howAi: string;
  byMe: string;
  byAi: string;
  materials: string;
  gallery: string;
  buildLog: string;
  allInstruments: string;
  previous: string;
  next: string;
  demo: string;
}

export interface PracticesData {
  /** "/username", instrument pages live under it */
  basePath: string;
  practices: PublicPractice[];
  instruments: PublicInstrument[];
  /** Visible entries, newest first */
  entries: PublicEntry[];
  sequencer: { weeks: string[]; rows: { practiceId: string; total: number; levels: number[] }[] };
  labels: PracticesLabels;
}
