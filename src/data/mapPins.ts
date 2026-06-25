export interface MapPin {
  id: string;
  x: number; // Percentage from left (0-100)
  y: number; // Percentage from top (0-100)
  personaId?: string; // Optional reference to a persona JSON
  titleKey: string; // Translation key for the pin title
  descKey: string; // Translation key for the pin description
  type: 'camp' | 'water' | 'battle' | 'shrine' | 'event';
}

export const mapPins: MapPin[] = [
  {
    id: "imam-hussain-camp",
    x: 20.9, y: 31.8,
    personaId: "imam-hussain",
    titleKey: "ui.pins.imamHussainCamp",
    descKey: "ui.pins.imamHussainCampDesc",
    type: "camp"
  },
  {
    id: "women-tents",
    x: 14.5,
    y: 30.5,
    personaId: "zaynab-bint-ali",
    titleKey: "ui.pins.womenTents",
    descKey: "ui.pins.womenTentsDesc",
    type: "camp"
  },
  {
    id: "tall-zaynabiyya",
    x: 25.5,
    y: 35.0,
    personaId: "zaynab-bint-ali",
    titleKey: "ui.pins.tallZaynabiyya",
    descKey: "ui.pins.tallZaynabiyyaDesc",
    type: "shrine"
  },
  {
    id: "maqtal",
    x: 45.0,
    y: 40.0,
    personaId: "imam-hussain",
    titleKey: "ui.pins.maqtal",
    descKey: "ui.pins.maqtalDesc",
    type: "shrine"
  },
  {
    id: "abbas-water",
    x: 76.1, y: 33.9,
    personaId: "abbas-ibn-ali",
    titleKey: "ui.pins.abbasWater",
    descKey: "ui.pins.abbasWaterDesc",
    type: "water"
  },
  {
    id: "umar-saad-camp",
    x: 65.0,
    y: 60.0,
    personaId: "umar-ibn-sad",
    titleKey: "ui.pins.umarSaadCamp",
    descKey: "ui.pins.umarSaadCampDesc",
    type: "camp"
  },
  {
    id: "habib-ibn-mazahir-position",
    x: 35.0,
    y: 20.0,
    personaId: "habib-ibn-mazahir",
    titleKey: "ui.pins.habibPosition",
    descKey: "ui.pins.habibPositionDesc",
    type: "battle"
  },
  {
    id: "zuhayr-position",
    x: 35.0,
    y: 50.0,
    personaId: "zuhayr-ibn-qayn",
    titleKey: "ui.pins.zuhayrPosition",
    descKey: "ui.pins.zuhayrPositionDesc",
    type: "battle"
  },
  {
    id: "ali-akbar-martyrdom",
    x: 55.0,
    y: 35.0,
    personaId: "ali-akbar",
    titleKey: "ui.pins.aliAkbarMartyrdom",
    descKey: "ui.pins.aliAkbarMartyrdomDesc",
    type: "battle"
  },
  {
    id: "qasim-martyrdom",
    x: 50.0,
    y: 45.0,
    personaId: "qasim-ibn-hasan",
    titleKey: "ui.pins.qasimMartyrdom",
    descKey: "ui.pins.qasimMartyrdomDesc",
    type: "battle"
  }
];
