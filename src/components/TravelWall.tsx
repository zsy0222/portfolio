"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { travelPlacesV2 } from "@/data/travel-places-v2";
import { travelPostersV2 } from "@/data/travel-posters-v2";
import styles from "./TravelWall.module.css";

type Collection = "posters" | "tickets";
type Artwork = {
  id: string;
  city: string;
  region: string;
  image: string;
  counterpart?: string;
  story?: string;
};
type Selection = { collection: Collection; index: number };

const cityNames: Record<string, string> = {
  Wenzhou: "温州", Hulunbuir: "呼伦贝尔", "Ma'anshan": "马鞍山",
  "Qinghai–Gansu Loop": "青甘环线", "Xi'an": "西安", Nanjing: "南京",
  Chongqing: "重庆", Wuxi: "无锡", Harbin: "哈尔滨", "New Taipei": "新北",
  "Kuala Lumpur": "吉隆坡",
};
const hulunbuirStory = "/blog/experience-recording-and-replay";
const collections: Record<Collection, Artwork[]> = {
  posters: travelPostersV2.map((poster) => ({
    id: poster.id, city: poster.city, region: poster.region, image: poster.image,
    counterpart: travelPlacesV2.find((place) => place.id === poster.ticketId)?.image,
    story: poster.ticketId === "inner-mongolia" ? hulunbuirStory : undefined,
  })),
  tickets: travelPlacesV2.map((place) => ({
    id: place.id, city: place.city, region: place.countryOrRegion, image: place.image,
    counterpart: travelPostersV2.find((poster) => poster.ticketId === place.id)?.image,
    story: place.id === "inner-mongolia" ? hulunbuirStory : undefined,
  })),
};
const rotations = ["-1.2deg", "1.1deg", "-.7deg", ".8deg", "-1deg", ".5deg"];

export default function TravelWall() {
  const [collection, setCollection] = useState<Collection>("posters");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [showCounterpart, setShowCounterpart] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedFromRef = useRef<HTMLButtonElement | null>(null);
  const backLinkRef = useRef<HTMLAnchorElement>(null);
  const artwork = selection ? collections[selection.collection][selection.index] : null;
  const isOpen = selection !== null;
  const isTicket = selection?.collection === "tickets" ? !showCounterpart : showCounterpart;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialCollection: Collection = params.get("collection") === "tickets" ? "tickets" : "posters";
    const placeId = params.get("place") ?? params.get("poster");
    const index = collections[initialCollection].findIndex((item) => item.id === placeId);
    const frame = requestAnimationFrame(() => {
      setCollection(initialCollection);
      if (index >= 0) setSelection({ collection: initialCollection, index });
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (!dialog.open) dialog.showModal();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  const restoreFocus = () => {
    setSelection(null);
    setShowCounterpart(false);
    (openedFromRef.current ?? backLinkRef.current)?.focus({ preventScroll: true });
  };
  const closeArtwork = () => { dialogRef.current?.close(); };
  const moveArtwork = (direction: number) => {
    setSelection((current) => current ? {
      ...current,
      index: (current.index + direction + collections[current.collection].length) % collections[current.collection].length,
    } : null);
    setShowCounterpart(false);
    dialogRef.current?.scrollTo({ top: 0 });
  };

  return (
    <div className={styles.page}>
      <div className={styles.topline}>
        <Link href="/blog" ref={backLinkRef} className={styles.backLink}><span aria-hidden="true">←</span> BACK TO BLOG</Link>
        <span>THE TRAVEL ARCHIVE <span className={styles.toplineDivider}>/</span> {collections.posters.length + collections.tickets.length} ARTWORKS</span>
      </div>

      <header className={styles.intro}>
        <div>
          <p className={styles.eyebrow}><span aria-hidden="true" /> 旅行墙 · TRAVEL JOURNAL</p>
          <h1>Places<br /><em>I carry.</em></h1>
        </div>
        <div className={styles.introAside}>
          <div className={styles.archiveSeal} aria-hidden="true"><span>KEEP THE</span><i>✳</i><span>LITTLE THINGS</span></div>
          <p className={styles.chineseIntro}>把走过的风景，<br />留在这里。</p>
          <p className={styles.introNote}>旅行主题插画，收集成海报与纪念票根。<br />点开一张，停留片刻。</p>
        </div>
      </header>

      <div className={styles.collectionBar}>
        <div className={styles.collectionSwitch} role="group" aria-label="旅行作品形式">
          <button type="button" aria-pressed={collection === "posters"} onClick={() => setCollection("posters")}>
            <span>海报</span> POSTERS <sup>{collections.posters.length}</sup>
          </button>
          <button type="button" aria-pressed={collection === "tickets"} onClick={() => setCollection("tickets")}>
            <span>票根</span> TICKETS <sup>{collections.tickets.length}</sup>
          </button>
        </div>
        <span className={styles.collectionHint} aria-live="polite">{String(collections[collection].length).padStart(2, "0")} PIECES <span aria-hidden="true">·</span> {collection === "posters" ? "PORTRAIT EDITION" : "TICKET EDITION"}</span>
      </div>

      <section className={`${styles.wall} ${collection === "tickets" ? styles.ticketWall : ""}`} aria-label={collection === "posters" ? "旅行海报墙" : "旅行纪念票根墙"} key={collection}>
        {collections[collection].map((place, index) => (
          <button key={place.id} type="button" className={styles.card}
            style={{ "--card-rotation": rotations[index % rotations.length], "--arrival": `${Math.min(index, 5) * 45}ms` } as CSSProperties}
            aria-label={`查看${cityNames[place.city] ?? place.city}旅行${collection === "posters" ? "海报" : "票根"}`} aria-haspopup="dialog"
            onClick={(event) => { openedFromRef.current = event.currentTarget; setShowCounterpart(false); setSelection({ collection, index }); }}>
            <span className={styles.paperFrame}>
              <span className={styles.paperTape} aria-hidden="true" />
              <span className={styles.imageFrame}>
                <Image src={place.image} alt={`${cityNames[place.city] ?? place.city} · ${collection === "posters" ? "旅行海报插画" : "纪念票根插画"}`}
                  fill sizes={collection === "posters" ? "(max-width: 600px) 85vw, (max-width: 1000px) 42vw, 27vw" : "(max-width: 700px) 85vw, 43vw"}
                  className={styles.cardImage} loading={index < 3 ? "eager" : "lazy"} />
                <span className={styles.openCue} aria-hidden="true">OPEN ARTWORK <span>↗</span></span>
              </span>
              <span className={styles.paperFooter} aria-hidden="true"><span>CHENMU / TRAVEL COLLECTION</span><span>{String(index + 1).padStart(2, "0")}</span></span>
            </span>
            <span className={styles.cardCaption}>
              <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.cardPlace}><span className={styles.cardRegion}>{place.region}</span><span className={styles.cardCity}>{cityNames[place.city] ?? place.city}<span>{place.city}</span></span></span>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </section>

      <div className={styles.closingNote}>
        <span className={styles.eyebrow}>THE JOURNEY CONTINUES</span>
        <p>有些风景，<em>会一直带在身上。</em></p>
        <Link href="/blog">回到文字里 <span aria-hidden="true">↗</span></Link>
      </div>

      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="travel-artwork-title" aria-describedby="travel-artwork-description"
        onClose={restoreFocus}
        onCancel={(event) => { event.preventDefault(); closeArtwork(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeArtwork(); }}
        onKeyDown={(event) => {
          if (event.altKey || event.ctrlKey || event.metaKey) return;
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); moveArtwork(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
        {artwork && selection && (
          <div className={styles.journal}>
            <div className={styles.journalToolbar}>
              <span>TRAVEL ARCHIVE <span aria-hidden="true">/</span> {String(selection.index + 1).padStart(2, "0")}</span>
              <button type="button" onClick={closeArtwork} className={styles.closeButton} aria-label="关闭旅行作品" autoFocus>关闭 <span aria-hidden="true">×</span></button>
            </div>
            <div className={`${styles.artworkStage} ${isTicket ? styles.ticketStage : ""}`}>
              <Image key={`${artwork.id}-${showCounterpart}`} src={showCounterpart && artwork.counterpart ? artwork.counterpart : artwork.image}
                alt={`${cityNames[artwork.city] ?? artwork.city} · ${isTicket ? "纪念票根插画" : "旅行海报插画"}`}
                fill sizes="(max-width: 850px) 94vw, 65vw" className={styles.artworkImage} loading="eager" />
            </div>
            <div className={styles.journalInfo}>
              <p className={styles.eyebrow}>{artwork.region}</p>
              <h2 id="travel-artwork-title">{cityNames[artwork.city] ?? artwork.city}<span>{artwork.city}</span></h2>
              <p id="travel-artwork-description" className={styles.artworkDescription}>旅行主题插画 · {isTicket ? "纪念票根" : "收藏海报"}</p>
              {artwork.counterpart && (
                <div className={styles.artworkSwitch} role="group" aria-label="查看作品版本">
                  <button type="button" aria-pressed={!isTicket} onClick={() => setShowCounterpart(selection.collection === "tickets")}>海报 POSTER</button>
                  <button type="button" aria-pressed={isTicket} onClick={() => setShowCounterpart(selection.collection === "posters")}>票根 TICKET</button>
                </div>
              )}
              <div className={styles.storyBlock}>
                <span className={styles.storyRule} aria-hidden="true" />
                {artwork.story ? <><p>从一张风景，<br /><em>回到那年夏天。</em></p><Link href={artwork.story} onClick={closeArtwork}>读呼伦贝尔的旅行随想 <span aria-hidden="true">↗</span></Link></> : <p>将风景收藏，<br /><em>让记忆慢慢展开。</em></p>}
              </div>
              <div className={styles.journalNavigation}>
                <button type="button" onClick={() => moveArtwork(-1)} aria-label="上一件旅行作品">← <span>上一件</span></button>
                <span aria-live="polite" aria-atomic="true">{String(selection.index + 1).padStart(2, "0")} / {String(collections[selection.collection].length).padStart(2, "0")}<span className={styles.srOnly}> · {cityNames[artwork.city] ?? artwork.city}</span></span>
                <button type="button" onClick={() => moveArtwork(1)} aria-label="下一件旅行作品"><span>下一件</span> →</button>
              </div>
              <p className={styles.keyboardHint}>← → 切换作品 <span>ESC 关闭</span></p>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
