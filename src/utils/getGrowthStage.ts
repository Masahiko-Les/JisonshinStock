export type GrowthStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const getGrowthStage = (count: number): GrowthStage => {
  if (count <= 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  if (count <= 9) return 4;
  if (count <= 12) return 5;
  if (count <= 15) return 6;
  if (count <= 18) return 7;
  if (count <= 22) return 8;
  if (count <= 29) return 9;
  return 10;
};
