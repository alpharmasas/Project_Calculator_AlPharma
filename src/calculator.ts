import type { Presentation } from './data';

export type Inputs = {
  lowId: string;
  highId: string;
  monthlyVials: number;
  lowPrice: number;
  highPrice: number;
  pharmacistSalary: number;
  assistantSalary: number;
  storageCostM3: number;
  otherLow: number;
  otherHigh: number;
};

export type CostRow = {
  rubro: string;
  low: number;
  high: number;
  saving: number;
  savingPct: number;
};

const monthlyWorkMinutes = 11300;
const benefitFactor = 1.4;

const ratePerMinute = (salary: number) => (salary * benefitFactor) / monthlyWorkMinutes;
const pct = (base: number, compared: number) => (base > 0 ? Math.max(0, (base - compared) / base) : 0);

export function calculate(inputs: Inputs, presentations: Presentation[]) {
  const low = presentations.find((item) => item.id === inputs.lowId) ?? presentations[0];
  const high = presentations.find((item) => item.id === inputs.highId) ?? presentations[1];
  const equivalentHighVials = inputs.monthlyVials * (low.contentMg / high.contentMg);
  const pharmacistRate = ratePerMinute(inputs.pharmacistSalary);
  const assistantRate = ratePerMinute(inputs.assistantSalary);

  const lowCosts = {
    reception: low.technicalReceptionMinutes * assistantRate * inputs.monthlyVials,
    preparation: low.pharmacistMinutes * pharmacistRate * inputs.monthlyVials,
    setup: low.assistantMinutes * assistantRate * inputs.monthlyVials,
    storage: low.volumeM3 * inputs.storageCostM3 * inputs.monthlyVials,
    waste: low.wasteKg * low.incinerationCostKg * inputs.monthlyVials,
    product: inputs.lowPrice * inputs.monthlyVials,
    other: inputs.otherLow * inputs.monthlyVials,
  };

  const highCosts = {
    reception: high.technicalReceptionMinutes * assistantRate * equivalentHighVials,
    preparation: high.pharmacistMinutes * pharmacistRate * equivalentHighVials,
    setup: high.assistantMinutes * assistantRate * equivalentHighVials,
    storage: high.volumeM3 * inputs.storageCostM3 * equivalentHighVials,
    waste: high.wasteKg * high.incinerationCostKg * equivalentHighVials,
    product: inputs.highPrice * equivalentHighVials,
    other: inputs.otherHigh * equivalentHighVials,
  };

  const rows: CostRow[] = [
    ['Recepción técnica', lowCosts.reception, highCosts.reception],
    ['Tiempo de reconstitución o dilución', lowCosts.preparation, highCosts.preparation],
    ['Tiempo de alistamiento', lowCosts.setup, highCosts.setup],
    ['Almacenamiento', lowCosts.storage, highCosts.storage],
    ['Disposición de residuos', lowCosts.waste, highCosts.waste],
    ['Costo del producto', lowCosts.product, highCosts.product],
    ['Otros costos', lowCosts.other, highCosts.other],
  ].map(([rubro, lowValue, highValue]) => ({
    rubro: String(rubro),
    low: Number(lowValue),
    high: Number(highValue),
    saving: Number(lowValue) - Number(highValue),
    savingPct: pct(Number(lowValue), Number(highValue)),
  }));

  const totalLow = rows.reduce((sum, row) => sum + row.low, 0);
  const totalHigh = rows.reduce((sum, row) => sum + row.high, 0);
  const totalSaving = totalLow - totalHigh;
  const lowMg = inputs.monthlyVials * low.contentMg;
  const highMg = equivalentHighVials * high.contentMg;

  const lowPharmacistMinutes = low.pharmacistMinutes * inputs.monthlyVials;
  const highPharmacistMinutes = high.pharmacistMinutes * equivalentHighVials;
  const lowAssistantMinutes = (low.assistantMinutes + low.technicalReceptionMinutes) * inputs.monthlyVials;
  const highAssistantMinutes = (high.assistantMinutes + high.technicalReceptionMinutes) * equivalentHighVials;
  const savedPharmacistMinutes = lowPharmacistMinutes - highPharmacistMinutes;
  const savedAssistantMinutes = lowAssistantMinutes - highAssistantMinutes;
  const savedMonthlyMinutes = savedPharmacistMinutes + savedAssistantMinutes;
  const lowWasteKg = low.wasteKg * inputs.monthlyVials;
  const highWasteKg = high.wasteKg * equivalentHighVials;
  const lowIncinerationMonthly = lowWasteKg * low.incinerationCostKg;
  const highIncinerationMonthly = highWasteKg * high.incinerationCostKg;
  const savedIncinerationMonthly = lowIncinerationMonthly - highIncinerationMonthly;
  const lowStorageM3 = low.volumeM3 * inputs.monthlyVials;
  const highStorageM3 = high.volumeM3 * equivalentHighVials;

  return {
    low,
    high,
    equivalentHighVials,
    rows,
    totalLow,
    totalHigh,
    totalSaving,
    totalSavingPct: pct(totalLow, totalHigh),
    annualSaving: totalSaving * 12,
    costPerMg: {
      low: totalLow / lowMg,
      high: totalHigh / highMg,
      saving: totalLow / lowMg - totalHigh / highMg,
    },
    time: {
      pharmacist: { low: lowPharmacistMinutes, high: highPharmacistMinutes },
      assistant: { low: lowAssistantMinutes, high: highAssistantMinutes },
      savedPharmacistMinutes,
      savedAssistantMinutes,
      savedMonthly: savedMonthlyMinutes,
      savedAnnualHours: (savedMonthlyMinutes * 12) / 60,
      salarySavingPharmacistMonthly: savedPharmacistMinutes * pharmacistRate,
      salarySavingAssistantMonthly: savedAssistantMinutes * assistantRate,
      salarySavingMonthly: savedPharmacistMinutes * pharmacistRate + savedAssistantMinutes * assistantRate,
      salarySavingAnnual: (savedPharmacistMinutes * pharmacistRate + savedAssistantMinutes * assistantRate) * 12,
      productionReductionPct: pct(lowPharmacistMinutes + lowAssistantMinutes, highPharmacistMinutes + highAssistantMinutes),
    },
    waste: {
      lowKg: lowWasteKg,
      highKg: highWasteKg,
      lowIncinerationMonthly,
      highIncinerationMonthly,
      savedMonthlyKg: lowWasteKg - highWasteKg,
      savedAnnualKg: (lowWasteKg - highWasteKg) * 12,
      savedIncinerationMonthly,
      savedIncinerationAnnual: savedIncinerationMonthly * 12,
      savingPct: pct(lowWasteKg, highWasteKg),
    },
    storage: {
      lowM3: lowStorageM3,
      highM3: highStorageM3,
      savedM3: lowStorageM3 - highStorageM3,
      annualSaving: (lowCosts.storage - highCosts.storage) * 12,
      savingPct: pct(lowStorageM3, highStorageM3),
    },
  };
}