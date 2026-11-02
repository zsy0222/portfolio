export type TravelPosterV2 = {
  id: string;
  region: string;
  city: string;
  landmark: string;
  image: string;
  /** Corresponding landscape ticket; absent when no ticket has been supplied. */
  ticketId?: string;
  note?: string;
};

/** Draft labels are transcribed from the supplied poster artwork. */
export const travelPostersV2: TravelPosterV2[] = [
  {
    id: "poster-01-wenzhou",
    region: "Zhejiang",
    city: "Wenzhou",
    landmark: "Tongpan Island",
    image: "/images/v2/travel-wall/posters/01-travel-poster.webp",
    ticketId: "zhejiang-wenzhou",
  },
  {
    id: "poster-02-hulunbuir",
    region: "Inner Mongolia",
    city: "Hulunbuir",
    landmark: "Hulunbuir Grassland",
    image: "/images/v2/travel-wall/posters/02-travel-poster.webp",
    ticketId: "inner-mongolia",
  },
  {
    id: "poster-03-maanshan",
    region: "Anhui",
    city: "Ma'anshan",
    landmark: "Caishiji",
    image: "/images/v2/travel-wall/posters/03-travel-poster.webp",
    ticketId: "anhui-maanshan",
  },
  {
    id: "poster-04-chaka-salt-lake",
    region: "Qinghai & Gansu",
    city: "Qinghai–Gansu Loop",
    landmark: "Chaka Salt Lake",
    image: "/images/v2/travel-wall/posters/04-travel-poster.webp",
    ticketId: "qinghai-gansu",
  },
  {
    id: "poster-05-xian",
    region: "Shaanxi",
    city: "Xi'an",
    landmark: "Giant Wild Goose Pagoda",
    image: "/images/v2/travel-wall/posters/05-travel-poster.webp",
    ticketId: "xian-shaanxi",
  },
  {
    id: "poster-06-nanjing",
    region: "Jiangsu",
    city: "Nanjing",
    landmark: "Xuanwu Lake · Sunset Skyline",
    image: "/images/v2/travel-wall/posters/06-travel-poster.webp",
  },
  {
    id: "poster-07-chongqing",
    region: "Chongqing",
    city: "Chongqing",
    landmark: "Riverfront Night View",
    image: "/images/v2/travel-wall/posters/07-travel-poster.webp",
    ticketId: "chongqing",
  },
  {
    id: "poster-08-wuxi",
    region: "Jiangsu",
    city: "Wuxi",
    landmark: "Changnan Street",
    image: "/images/v2/travel-wall/posters/08-travel-poster.webp",
    ticketId: "wuxi-jiangsu",
  },
  {
    id: "poster-09-harbin",
    region: "Heilongjiang",
    city: "Harbin",
    landmark: "Ice and Snow World",
    image: "/images/v2/travel-wall/posters/09-travel-poster.webp",
    ticketId: "harbin-heilongjiang",
  },
  {
    id: "poster-10-yehliu",
    region: "Taiwan",
    city: "New Taipei",
    landmark: "Yehliu Geopark",
    image: "/images/v2/travel-wall/posters/10-travel-poster.webp",
    ticketId: "taiwan-new-taipei",
  },
];
