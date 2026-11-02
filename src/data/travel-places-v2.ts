export type TravelPlaceV2 = {
  id: string;
  countryOrRegion: string;
  city: string;
  landmark: string;
  image: string;
  /** Location labels are transcribed from the supplied concept images and need owner confirmation. */
  labelStatus: "draft-from-reference";
};

export const travelPlacesV2: TravelPlaceV2[] = [
  {
    id: "xian-shaanxi",
    countryOrRegion: "Shaanxi",
    city: "Xi'an",
    landmark: "Giant Wild Goose Pagoda",
    image: "/images/v2/travel-wall/concept-covers/01-xian-shaanxi.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "qinghai-gansu",
    countryOrRegion: "Qinghai & Gansu",
    city: "Qinghai–Gansu Loop",
    landmark: "Chaka Salt Lake",
    image: "/images/v2/travel-wall/concept-covers/02-qinghai-gansu.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "inner-mongolia",
    countryOrRegion: "Inner Mongolia",
    city: "Hulunbuir",
    landmark: "Hulunbuir Grassland",
    image: "/images/v2/travel-wall/concept-covers/03-inner-mongolia.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "chongqing",
    countryOrRegion: "Chongqing",
    city: "Chongqing",
    landmark: "Riverfront Night View",
    image: "/images/v2/travel-wall/concept-covers/04-chongqing.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "wuxi-jiangsu",
    countryOrRegion: "Jiangsu",
    city: "Wuxi",
    landmark: "Changnan Street",
    image: "/images/v2/travel-wall/concept-covers/05-wuxi-jiangsu.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "taiwan-new-taipei",
    countryOrRegion: "Taiwan",
    city: "New Taipei",
    landmark: "Yehliu Geopark",
    image: "/images/v2/travel-wall/concept-covers/06-taiwan-new-taipei.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "anhui-maanshan",
    countryOrRegion: "Anhui",
    city: "Ma'anshan",
    landmark: "Caishiji",
    image: "/images/v2/travel-wall/concept-covers/07-anhui-maanshan.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "harbin-heilongjiang",
    countryOrRegion: "Heilongjiang",
    city: "Harbin",
    landmark: "Ice and Snow World",
    image: "/images/v2/travel-wall/concept-covers/08-harbin-heilongjiang.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "zhejiang-wenzhou",
    countryOrRegion: "Zhejiang",
    city: "Wenzhou",
    landmark: "Tongpan Island",
    image: "/images/v2/travel-wall/concept-covers/09-zhejiang-wenzhou.webp",
    labelStatus: "draft-from-reference",
  },
  {
    id: "malaysia-kuala-lumpur",
    countryOrRegion: "Malaysia",
    city: "Kuala Lumpur",
    landmark: "Petronas Twin Towers",
    image: "/images/v2/travel-wall/concept-covers/10-malaysia-kuala-lumpur.webp",
    labelStatus: "draft-from-reference",
  },
];
