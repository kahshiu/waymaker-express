// SECTION: ENUMS 
const EntityType = {
  NULL: 0,
  INDIVIDUAL: 1,
  COMPANY: 2,
}

const IcType = {
  NULL: 0,
  IC: 1,
  COMPANY_REGNO: 2,
}

const ScheduleState = {
  NULL: 0,
  EMAIL: 1,
  EMAIL_REMINDER: 2,
}

const MatterType = {
  NULL: 0,
}

const TemplateType = {
  NULL: 0,
  EMAIL_COMMON: 1,
}

// SECTION: STORES
const APP_NAME = "hecker_app";
const PORT_NO = 8022;
const VERSION = 1;

const MY_STATES = [
  { num: 0, short: "Not Selected", long: "Not Selected" },
  { num: 1, short: "JHR", long: "Johor" },
  { num: 2, short: "KDH", long: "Kedah" },
  { num: 3, short: "KTN", long: "Kelantan" },
  { num: 4, short: "MLK", long: "Malacca" },
  { num: 5, short: "NSN", long: "Negeri Sembilan" },
  { num: 6, short: "PHG", long: "Pahang" },
  { num: 7, short: "PNG", long: "Penang" },
  { num: 8, short: "PRK", long: "Perak" },
  { num: 9, short: "PLS", long: "Perlis" },
  { num: 10, short: "SBH", long: "Sabah" },
  { num: 11, short: "SWK", long: "Sarawak" },
  { num: 12, short: "SGR", long: "Selangor" },
  { num: 13, short: "TRG", long: "Terengganu" },
  { num: 20, short: "KUL", long: "Kuala Lumpur" },
  { num: 21, short: "LBN", long: "Labuan" },
  { num: 22, short: "PJY", long: "Putrajaya" },
];

module.exports = {
  // enums 
  EntityType,
  IcType,
  ScheduleState,
  MatterType,
  TemplateType,

  // statics
  APP_NAME,
  PORT_NO,
  VERSION,
  MY_STATES,
}