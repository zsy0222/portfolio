import Image from "next/image";
import Link from "next/link";
import Icon from "./Icon";
import { travelPostersV2 } from "@/data/travel-posters-v2";
import { travelPlacesV2 } from "@/data/travel-places-v2";
import styles from "./BlogTravelPreview.module.css";

const featuredIds = ["poster-01-wenzhou", "poster-02-hulunbuir", "poster-07-chongqing"];

export default function BlogTravelPreview() {
  const featured = featuredIds.map(id => travelPostersV2.find(poster => poster.id === id)!);
  return (
    <section id="travel-wall" className={styles.section} aria-labelledby="travel-preview-title">
      <div className={styles.heading}>
        <span>THE TRAVEL ARCHIVE</span>
        <span>{String(travelPostersV2.length + travelPlacesV2.length).padStart(2, "0")} ARTWORKS / AN OPEN COLLECTION</span>
      </div>
      <div className={styles.spread}>
        <div className={styles.copy}>
          <span className={styles.kicker}>旅行墙 · POSTCARDS FROM ELSEWHERE</span>
          <h2 id="travel-preview-title">Places<br /><em>I carry.</em></h2>
          <p>把走过的风景，<br />留在文字之外。</p>
          <span className={styles.note}>海报、票根，和关于远方的记忆。</span>
          <Link href="/blog/travel" className={styles.open}>打开旅行墙 <Icon name="arrow-up-right" /></Link>
          <div className={styles.inventory}><span>{travelPostersV2.length} POSTERS</span><i aria-hidden="true" /><span>{travelPlacesV2.length} TRAVEL TICKETS</span></div>
        </div>
        <div className={styles.board} aria-label="Featured travel artworks">
          <div className={styles.registration} aria-hidden="true">TRAVEL / PERSONAL COLLECTION</div>
          {featured.map((poster, index) => (
            <Link key={poster.id} href={`/blog/travel?place=${poster.id}`} className={styles.print}
              aria-label={`打开${poster.city}旅行海报`}>
              <span className={styles.picture}>
                <Image src={poster.image} alt={`${poster.city} travel illustration`} fill
                  sizes="(max-width: 700px) 31vw, (max-width: 1000px) 22vw, 20vw" />
              </span>
              <span className={styles.caption}><b>{String(index + 1).padStart(2, "0")}</b>{poster.city}<Icon name="arrow-up-right" /></span>
            </Link>
          ))}
          <div className={styles.boardFoot}><span>海报插画 / POSTER ART</span><span>SELECT A PLACE ↗</span></div>
        </div>
      </div>
    </section>
  );
}
