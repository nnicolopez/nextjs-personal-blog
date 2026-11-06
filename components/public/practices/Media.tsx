import type { EntryKind } from "@/db/schema";
import { embedUrl } from "@/lib/practices";

/**
 * Media for a journal entry or a featured instrument. Images are remote URLs
 * the owner pasted, with unknown sizes, so a plain img fits better than
 * next/image here.
 */
const Media = ({ kind, url, title, className }: { kind: EntryKind | "image"; url: string; title: string; className?: string }) => {
  if (kind === "video") {
    const src = embedUrl({ kind: "video", url });
    if (!src) return null;
    return (
      <div className={className}>
        <iframe src={src} title={title} loading="lazy" allow="fullscreen; picture-in-picture" sandbox="allow-scripts allow-same-origin allow-presentation allow-popups" />
      </div>
    );
  }
  if (kind === "audio") {
    return (
      <div className={className}>
        <audio controls preload="none" src={url} aria-label={title} />
      </div>
    );
  }
  if (kind === "photo" || kind === "image") {
    return (
      <div className={className}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt={title} loading="lazy" />
      </div>
    );
  }
  return null;
};

export default Media;
