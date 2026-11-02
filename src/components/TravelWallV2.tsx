"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { travelPostersV2 } from "@/data/travel-posters-v2";
import { travelPlacesV2 } from "@/data/travel-places-v2";
import styles from "./TravelWallV2.module.css";
import { PortfolioHeader } from "./PortfolioShell";

type Collection = "posters" | "tickets";
type Memory = {
  id: string;
  region: string;
  city: string;
  landmark: string;
  image: string;
  ticket?: string;
};

const collections: Record<Collection, Memory[]> = {
  posters: travelPostersV2.map((poster) => ({
    ...poster,
    ticket: travelPlacesV2.find((place) => place.id === poster.ticketId)?.image,
  })),
  tickets: travelPlacesV2.map((place) => ({
    ...place,
    region: place.countryOrRegion,
    ticket: place.image,
  })),
};

export default function TravelWallV2() {
  const [collection, setCollection] = useState<Collection>("posters");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [roomHref, setRoomHref] = useState("/v2");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openedFromRef = useRef<HTMLButtonElement | null>(null);
  const places = collections[collection];
  const selectedPlace = selectedIndex === null ? null : places[selectedIndex];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const place = params.get("poster") ?? params.get("place");
    const index = collections.posters.findIndex(p => p.id === place || travelPostersV2.find(poster => poster.id === p.id)?.ticketId === place);
    const frame = requestAnimationFrame(() => {
      if (params.get("from") === "graybox") setRoomHref("/v2/graybox");
      if (index >= 0) setSelectedIndex(index);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedIndex]);

  const closeMemory = () => {
    dialogRef.current?.close();
    setSelectedIndex(null);
    setShowTicket(false);
    openedFromRef.current?.focus({ preventScroll: true });
  };

  const moveMemory = (direction: number) => {
    setSelectedIndex((current) => current === null ? null : (current + direction + places.length) % places.length);
    setShowTicket(false);
    dialogRef.current?.querySelector(`.${styles.journal}`)?.scrollTo({ top: 0 });
  };

  return (
    <>
    <PortfolioHeader />
    <div className={styles.page}>
      <div className={styles.grain} aria-hidden="true" />
      <header className={styles.topbar}>
        <Link className={styles.backLink} href={roomHref}><span aria-hidden="true">←</span> BACK TO ROOM</Link>
        <span className={styles.version}>PERSONAL ARCHIVE <span>/</span> VOL. 02</span>
      </header>

      <section className={styles.intro} aria-labelledby="travel-title">
        <div className={styles.eyebrow}><span /> A LITTLE FURTHER FROM HOME</div>
        <div className={styles.headingRow}>
          <h1 id="travel-title">Places<br /><em>I carry.</em></h1>
          <div className={styles.introAside}>
            <span className={styles.compass} aria-hidden="true">✳</span>
            <p>Some places stay with you.<br />These are a few of mine.</p>
            <a href="#destination-wall" className={styles.exploreLink}>EXPLORE THE COLLECTION <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className={styles.collectionBar}>
          <div className={styles.collectionSwitch} aria-label="Artwork collection">
            <button aria-pressed={collection === "posters"} onClick={() => setCollection("posters")} type="button">POSTERS <sup>{collections.posters.length}</sup></button>
            <button aria-pressed={collection === "tickets"} onClick={() => setCollection("tickets")} type="button">TRAVEL TICKETS <sup>{collections.tickets.length}</sup></button>
          </div>
          <span className={styles.wallHint}>CHOOSE A PLACE. OPEN A MEMORY.</span>
        </div>
      </section>

      <section id="destination-wall" className={`${styles.wall} ${collection === "tickets" ? styles.ticketWall : ""}`} aria-label={`${collection === "posters" ? "Travel posters" : "Travel tickets"} — choose a destination`} key={collection}>
        {places.map((place, index) => (
          <button className={styles.card} key={place.id} style={{ "--arrival": `${Math.min(index, 5) * 70}ms` } as CSSProperties}
            onClick={(event) => { openedFromRef.current = event.currentTarget; setSelectedIndex(index); setShowTicket(false); }}
            aria-label={`Open ${place.city} memory, ${place.landmark}`} aria-haspopup="dialog" type="button">
            <span className={styles.imageFrame}>
              <Image src={place.image} alt={`${place.city} — ${place.landmark} travel artwork`} fill
                sizes={collection === "tickets" ? "(max-width: 680px) 94vw, 46vw" : "(max-width: 680px) 90vw, (max-width: 1000px) 45vw, 29vw"}
                className={styles.cardImage} loading={index < 3 ? "eager" : "lazy"} />
              <span className={styles.frameShine} aria-hidden="true" />
              <span className={styles.openCue}>ENTER MEMORY <span aria-hidden="true">↗</span></span>
            </span>
            <span className={styles.cardCaption}>
              <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.cardPlace}>
                <span className={styles.cardRegion}>{place.region}</span>
                <span className={styles.cardCity}>{place.city}</span>
                <span className={styles.cardLandmark}>{place.landmark}</span>
              </span>
              <span className={styles.cardArrow} aria-hidden="true">↗</span>
            </span>
          </button>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>The map is still<br /><em>unfolding.</em></p>
        <div><span>MORE PLACES. MORE STORIES.</span><Link href={roomHref}>BACK TO MY ROOM <span aria-hidden="true">↗</span></Link></div>
      </footer>

      <dialog className={styles.dialog} ref={dialogRef} aria-labelledby="journal-title" aria-describedby="journal-description"
        onCancel={(event) => { event.preventDefault(); closeMemory(); }}
        onClick={(event) => { if (event.target === event.currentTarget) closeMemory(); }}>
        {selectedPlace && (
          <section className={styles.journal}>
            <div className={styles.journalToolbar}>
              <span>THE TRAVEL ARCHIVE <span className={styles.toolbarDivider}>/</span> {String((selectedIndex ?? 0) + 1).padStart(2, "0")}</span>
              <button aria-label="Close travel memory" className={styles.closeButton} onClick={closeMemory} type="button" autoFocus>CLOSE <span aria-hidden="true">×</span></button>
            </div>
            <div className={`${styles.journalImage} ${showTicket || collection === "tickets" ? styles.journalTicket : ""}`} key={`${selectedPlace.id}-${showTicket}`}>
              <Image src={showTicket && selectedPlace.ticket ? selectedPlace.ticket : selectedPlace.image}
                alt={`${selectedPlace.city} ${showTicket || collection === "tickets" ? "travel ticket" : "travel poster"}`}
                fill sizes="(max-width: 800px) 94vw, 54vw" className={styles.journalCover} loading="eager" />
            </div>
            <div className={styles.journalInfo}>
              <div className={styles.journalEyebrow}><span /> {selectedPlace.region}</div>
              <h2 id="journal-title">{selectedPlace.city}</h2>
              <p className={styles.journalLandmark}>{selectedPlace.landmark}</p>
              {selectedPlace.ticket && collection === "posters" && (
                <div className={styles.artworkSwitch} aria-label="View artwork format">
                  <button aria-pressed={!showTicket} onClick={() => setShowTicket(false)} type="button">POSTER</button>
                  <button aria-pressed={showTicket} onClick={() => setShowTicket(true)} type="button">TRAVEL TICKET <span aria-hidden="true">↗</span></button>
                </div>
              )}
              <p className={styles.journalMessage} id="journal-description">A place to keep<br /><em>the little things.</em></p>
              <p className={styles.emptyMessage}>The artwork is here. The photos, films, and stories from this journey are still to come.</p>
              <div className={styles.contentSlots} aria-label="Journey content availability">
                <div><span>01</span><strong>PHOTOGRAPHS</strong><small>Coming soon</small></div>
                <div><span>02</span><strong>SHORT FILMS</strong><small>Coming soon</small></div>
                <div><span>03</span><strong>FIELD NOTES</strong><small>Coming soon</small></div>
              </div>
              <div className={styles.journalNavigation}>
                <button onClick={() => moveMemory(-1)} aria-label="Previous destination" type="button"><span aria-hidden="true">←</span> PREVIOUS</button>
                <span>{String((selectedIndex ?? 0) + 1).padStart(2, "0")} / {String(places.length).padStart(2, "0")}</span>
                <button onClick={() => moveMemory(1)} aria-label="Next destination" type="button">NEXT <span aria-hidden="true">→</span></button>
              </div>
            </div>
          </section>
        )}
      </dialog>
    </div>
    </>
  );
}
