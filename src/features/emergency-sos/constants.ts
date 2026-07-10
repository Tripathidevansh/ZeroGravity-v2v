export interface Helpline {
  label: string;
  number: string;
}

export const EMERGENCY_HELPLINES: Helpline[] = [
  { label: "National Emergency Number", number: "112" },
  { label: "Police", number: "100" },
  { label: "Women's Helpline", number: "1091" },
  { label: "Ambulance", number: "102" },
  { label: "Fire", number: "101" },
];
