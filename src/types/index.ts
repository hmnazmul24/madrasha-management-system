export type PayloadType = {
  userName: string;
  role: "MADRASHA" | "ADMIN";
  id: string;
  madrashaName: string;
  visitingMadrashaId?: string;
  visitingMadrashaName?: string;
  exp: number;
};
