export type Presentation = {
  id: string;
  label: string;
  molecule: string;
  contentMg: number;
  defaultPrice: number;
  pharmacistMinutes: number;
  assistantMinutes: number;
  technicalReceptionMinutes: number;
  volumeM3: number;
  wasteKg: number;
  incinerationCostKg: number;
};

export const defaults = {
  lowId: 'Mustal_50mg',
  highId: 'Mustal_500mg',
  monthlyVials: 100,
  lowPrice: 7892,
  highPrice: 50700,
  pharmacistSalary: 5000000,
  assistantSalary: 2500000,
  storageCostM3: 75000,
  otherLow: 0,
  otherHigh: 0,
};

export const presentations: Presentation[] = [
  { id: 'Alonat_50mg', label: 'Alonat 50 mg', molecule: 'Alonat', contentMg: 50, defaultPrice: 21000, pharmacistMinutes: 0.56, assistantMinutes: 1, technicalReceptionMinutes: 1.5, volumeM3: 0.000068231, wasteKg: 0.03, incinerationCostKg: 2000 },
  { id: 'Alonat_350mg', label: 'Alonat 350 mg', molecule: 'Alonat', contentMg: 350, defaultPrice: 120800, pharmacistMinutes: 1.33, assistantMinutes: 1.5, technicalReceptionMinutes: 2, volumeM3: 0.000132327, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Yutaxan_30mg', label: 'Yutaxan 30 mg', molecule: 'Yutaxan', contentMg: 30, defaultPrice: 16300, pharmacistMinutes: 0.65, assistantMinutes: 1, technicalReceptionMinutes: 1.2, volumeM3: 0.00005632, wasteKg: 0.03, incinerationCostKg: 2000 },
  { id: 'Yutaxan_100mg', label: 'Yutaxan 100 mg', molecule: 'Yutaxan', contentMg: 100, defaultPrice: 29680, pharmacistMinutes: 0.923, assistantMinutes: 1.5, technicalReceptionMinutes: 1.8, volumeM3: 0.000096, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Yutaxan_300mg', label: 'Yutaxan 300 mg', molecule: 'Yutaxan', contentMg: 300, defaultPrice: 122500, pharmacistMinutes: 1.31066, assistantMinutes: 2, technicalReceptionMinutes: 2.2, volumeM3: 0.0002075, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Megafive_500mg', label: 'Megafive 500 mg', molecule: 'Megafive', contentMg: 500, defaultPrice: 6788, pharmacistMinutes: 0.95, assistantMinutes: 1, technicalReceptionMinutes: 1.3, volumeM3: 0.00006039, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Megafive_1gr', label: 'Megafive 1 gr', molecule: 'Megafive', contentMg: 1000, defaultPrice: 13200, pharmacistMinutes: 1.2, assistantMinutes: 1.5, technicalReceptionMinutes: 1.8, volumeM3: 0.00011856, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Aldacit_100mg', label: 'Aldacit 100 mg', molecule: 'Aldacit', contentMg: 100, defaultPrice: 11000, pharmacistMinutes: 0.95, assistantMinutes: 1, technicalReceptionMinutes: 2, volumeM3: 0.00009072, wasteKg: 0.03, incinerationCostKg: 2000 },
  { id: 'Aldacit_500mg', label: 'Aldacit 500 mg', molecule: 'Aldacit', contentMg: 500, defaultPrice: 30500, pharmacistMinutes: 1.349, assistantMinutes: 1.5, technicalReceptionMinutes: 2.5, volumeM3: 0.00009072, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Aldacit_1gr', label: 'Aldacit 1 gr', molecule: 'Aldacit', contentMg: 1000, defaultPrice: 54700, pharmacistMinutes: 1.91558, assistantMinutes: 2, technicalReceptionMinutes: 3, volumeM3: 0.000104125, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Mustal_50mg', label: 'Mustal 50 mg', molecule: 'Mustal', contentMg: 50, defaultPrice: 7892, pharmacistMinutes: 0.5609756098, assistantMinutes: 1, technicalReceptionMinutes: 1.2, volumeM3: 0.0000235984, wasteKg: 0.025, incinerationCostKg: 2000 },
  { id: 'Mustal_500mg', label: 'Mustal 500 mg', molecule: 'Mustal', contentMg: 500, defaultPrice: 50700, pharmacistMinutes: 0.95, assistantMinutes: 1.5, technicalReceptionMinutes: 2, volumeM3: 0.000109809, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Mustal_1gr', label: 'Mustal 1 gr', molecule: 'Mustal', contentMg: 1000, defaultPrice: 87400, pharmacistMinutes: 1.3333333333, assistantMinutes: 2, technicalReceptionMinutes: 2.5, volumeM3: 0.00011856, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Al_Oxa_50mg', label: 'Al Oxa 50 mg', molecule: 'Al Oxa', contentMg: 50, defaultPrice: 54000, pharmacistMinutes: 0.6054878049, assistantMinutes: 1, technicalReceptionMinutes: 1.5, volumeM3: 0.00010952, wasteKg: 0.03, incinerationCostKg: 2000 },
  { id: 'Al_Oxa_100mg', label: 'Al Oxa 100 mg', molecule: 'Al Oxa', contentMg: 100, defaultPrice: 100400, pharmacistMinutes: 0.9365, assistantMinutes: 1.5, technicalReceptionMinutes: 1.8, volumeM3: 0.00010952, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Al_Oxa_200mg', label: 'Al Oxa 200 mg', molecule: 'Al Oxa', contentMg: 200, defaultPrice: 175000, pharmacistMinutes: 1.3219966667, assistantMinutes: 2, technicalReceptionMinutes: 2, volumeM3: 0.0001764, wasteKg: 0.045, incinerationCostKg: 2000 },
  { id: 'Uromida_1gr', label: 'Uromida 1 gr', molecule: 'Uromida', contentMg: 1000, defaultPrice: 111851, pharmacistMinutes: 0.95, assistantMinutes: 1, technicalReceptionMinutes: 1.8, volumeM3: 0.0001, wasteKg: 0.035, incinerationCostKg: 2000 },
  { id: 'Uromida_2gr', label: 'Uromida 2 gr', molecule: 'Uromida', contentMg: 2000, defaultPrice: 211286, pharmacistMinutes: 1.42, assistantMinutes: 1.5, technicalReceptionMinutes: 2.2, volumeM3: 0.000162, wasteKg: 0.045, incinerationCostKg: 2000 },
];