import PublicPage, { type PublicPageData } from "./PublicPage";
import styles from "./PagePreview.module.css";

interface Props {
  data: PublicPageData;
  /** Text shown in the fake browser address bar */
  address?: string;
  height: number;
  scale?: number;
}

/**
 * A scaled-down, non-interactive render of a public page inside a browser
 * frame. Stands in for the design's screenshot placeholders.
 */
const PagePreview = ({ data, address, height, scale = 0.5 }: Props) => (
  <div className={styles.frame}>
    {address !== undefined && (
      <div className={styles.bar}>
        <i className={styles.dot1} />
        <i className={styles.dot2} />
        <i className={styles.dot3} />
        <span>{address}</span>
      </div>
    )}
    <div className={styles.viewport} style={{ height }} aria-hidden="true" inert>
      <div className={styles.page} style={{ zoom: scale }}>
        <PublicPage data={data} />
      </div>
    </div>
  </div>
);

export default PagePreview;
