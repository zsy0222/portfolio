"use client";
import StudioExperience from "./StudioExperience";
import { useWorldLocale } from "./WorldProvider";
export default function WorldRoom() {
  const { t } = useWorldLocale();
  return <div className="world-page world-room-page"><p className="world-eyebrow">01 / THE CREATOR’S ROOM</p><h1 className="world-title">{t("每个物件，都有一个故事。", "Every object holds a story.")}</h1><p className="world-intro">{t("点击电脑、书架、照片墙或笔记本，也可以直接使用场景下方的文字入口。", "Explore the computer, bookshelf, photo wall or notebook. Everything is also accessible through the links below.")}</p><StudioExperience/></div>;
}
