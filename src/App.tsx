import { useState } from 'react';
import { BarChart3, Boxes, Calculator, Clock3, Leaf, ShieldCheck, Sparkles, WalletCards } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { calculate, type Inputs } from './calculator';
import { defaults, presentations } from './data';
import logoAlpharma from './assets/logo-alpharma.png';

const money = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const moneyOneDecimal = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const number = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });
const percent = new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 1 });
const colors = ['#103d38', '#22b4c7', '#2c4975', '#0f766e', '#7ea6a1', '#8fa8cf', '#6b7d8f'];

function numericValue(value: string, fallback: number) {
  const parsed = Number(value.replace(/[^0-9.-]/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function currencyInput(value: number) {
  return money.format(value);
}

function minuteLabel(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? `${number.format(parsed)} min` : '';
}

function currencyLabel(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? money.format(parsed) : '';
}

function currencyOneDecimalLabel(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? moneyOneDecimal.format(parsed) : '';
}

function piePercentLabel(props: { cx?: string | number; cy?: string | number; midAngle?: number; outerRadius?: string | number; percent?: number }) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percentValue = Number(props.percent ?? 0);

  if (percentValue < 0.025) return null;

  const radius = outerRadius + 18;
  const angle = -Number(props.midAngle ?? 0) * Math.PI / 180;
  const x = cx + radius * Math.cos(angle);
  const y = cy + radius * Math.sin(angle);

  return <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#536b68" fontSize={11} fontWeight={500}>{percent.format(percentValue)}</text>;
}

function decimalLabel(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? number.format(parsed) : '';
}

function wasteLabel(props: { x?: string | number; y?: string | number; width?: string | number; value?: unknown; cost?: number }) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const kg = decimalLabel(props.value);
  const cost = Number(props.cost ?? 0);

  return (
    <g>
      <text x={x + width / 2} y={y - 12} textAnchor="middle" fill="#344c49" fontSize={12} fontWeight={800}>{kg} kg</text>
      <rect x={x + width / 2 - 35} y={y + 3} width="70" height="18" rx="5" fill="#f6fbf8" stroke="#b8d2cf" />
      <text x={x + width / 2} y={y + 16} textAnchor="middle" fill="#103d38" fontSize={11} fontWeight={800}>{money.format(cost)}</text>
    </g>
  );
}

function verticalMoneyLabel(props: { x?: string | number; y?: string | number; width?: string | number; height?: string | number; value?: unknown; color: string }) {
  const x = Number(props.x ?? 0);
  const y = Number(props.y ?? 0);
  const width = Number(props.width ?? 0);
  const height = Number(props.height ?? 0);
  const centerX = x + width / 2;
  const isTall = height > 46;
  const labelY = isTall ? y + 12 : y - 5;

  return (
    <text
      x={centerX}
      y={labelY}
      textAnchor={isTall ? 'end' : 'start'}
      fill={isTall ? '#ffffff' : props.color}
      fontSize={11}
      fontWeight={500}
      transform={`rotate(-90 ${centerX} ${labelY})`}
    >
      {currencyLabel(props.value)}
    </text>
  );
}

function App() {
  const [inputs, setInputs] = useState<Inputs>(defaults);
  const result = calculate(inputs, presentations);
  const compatibleHighOptions = presentations.filter((item) => item.molecule === result.low.molecule && item.contentMg >= result.low.contentMg);
  const monthlyData = result.rows.map((row) => ({ rubro: row.rubro.replace('Tiempo de ', ''), [result.low.label]: row.low, [result.high.label]: row.high, ahorro: row.saving }));
  const pieData = result.rows.filter((row) => row.saving > 0).map((row) => ({ name: row.rubro, value: row.saving }));
  const costDistributionData = result.rows.filter((row) => row.low > 0).map((row) => ({ name: row.rubro, value: row.low }));
  const lowMg = inputs.monthlyVials * result.low.contentMg;
  const highMg = result.equivalentHighVials * result.high.contentMg;
  const unitCostData = result.rows.map((row) => ({ rubro: row.rubro.replace('Tiempo de ', ''), [result.low.label]: row.low / lowMg, [result.high.label]: row.high / highMg }));
  const timeData = [
    { item: 'Químico', [result.low.label]: result.time.pharmacist.low, [result.high.label]: result.time.pharmacist.high },
    { item: 'Auxiliar + recepción', [result.low.label]: result.time.assistant.low, [result.high.label]: result.time.assistant.high },
  ];
  const timeSavingsData = [
    { item: 'Químico', tiempo: result.time.savedPharmacistMinutes, ahorro: result.time.salarySavingPharmacistMonthly },
    { item: 'Auxiliar + recepción', tiempo: result.time.savedAssistantMinutes, ahorro: result.time.salarySavingAssistantMonthly },
    { item: 'Total', tiempo: result.time.savedMonthly, ahorro: result.time.salarySavingMonthly },
  ];
  const wasteData = [
    { item: result.low.label, kg: result.waste.lowKg, costo: result.waste.lowIncinerationMonthly },
    { item: result.high.label, kg: result.waste.highKg, costo: result.waste.highIncinerationMonthly },
    { item: 'Ahorro', kg: result.waste.savedMonthlyKg, costo: result.waste.savedIncinerationMonthly },
  ];
  const storageData = [
    { item: result.low.label, m3: result.storage.lowM3, costo: result.storage.lowM3 * inputs.storageCostM3 },
    { item: result.high.label, m3: result.storage.highM3, costo: result.storage.highM3 * inputs.storageCostM3 },
    { item: 'Ahorro', m3: result.storage.savedM3, costo: result.storage.annualSaving / 12 },
  ];

  const update = (key: keyof Inputs, value: string) => {
    setInputs((current) => ({ ...current, [key]: numericValue(value, Number(current[key])) }));
  };

  const chooseLow = (id: string) => {
    const selected = presentations.find((item) => item.id === id) ?? result.low;
    const nextHigh = presentations.find((item) => item.molecule === selected.molecule && item.contentMg > selected.contentMg) ?? selected;
    setInputs((current) => ({ ...current, lowId: selected.id, highId: nextHigh.id, lowPrice: selected.defaultPrice, highPrice: nextHigh.defaultPrice }));
  };

  const chooseHigh = (id: string) => {
    const selected = presentations.find((item) => item.id === id) ?? result.high;
    setInputs((current) => ({ ...current, highId: selected.id, highPrice: selected.defaultPrice }));
  };

  return (
    <main>
      <section className="hero">
        <div className="page-banner">
          <div className="banner-copy">
            <div className="eyebrow"><Sparkles size={16} /> Calculadora farmacéutica</div>
            <h1>Calculadora Altos Volumenes</h1>
            <p>Comparación de rentabilidad, tiempos de preparación, residuos y almacenamiento para decisiones de alto volumen.</p>
          </div>
          <div className="brand-lockup">
            <img src={logoAlpharma} alt="Al Pharma - Una Esperanza de Vida" />
          </div>
        </div>
        <div className="summary-band">
          <div className="hero-panel">
            <span>Mejor opción estimada</span>
            <strong>{result.high.label}</strong>
            <small>{percent.format(result.totalSavingPct)} de ahorro mensual frente a {result.low.label}</small>
          </div>
          <div className="hero-metrics" aria-label="Resumen de comparación">
            <article>
              <span>Ahorro mensual</span>
              <strong>{money.format(result.totalSaving)}</strong>
            </article>
            <article>
              <span>Equivalencia</span>
              <strong>{number.format(result.equivalentHighVials)} viales</strong>
            </article>
            <article>
              <span>Tiempo liberado</span>
              <strong>{number.format(result.time.savedMonthly / 60)} h</strong>
            </article>
          </div>
        </div>
      </section>

      <section className="workspace">
        <aside className="controls" aria-label="Parámetros de cálculo">
          <div className="section-title"><Calculator size={18} /> Parámetros</div>
          <div className="parameter-layout">
            <div className="parameter-grid">
              <label>Presentación de baja concentración
                <select value={inputs.lowId} onChange={(event) => chooseLow(event.target.value)}>
                  {presentations.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <label>Presentación de alta concentración
                <select value={inputs.highId} onChange={(event) => chooseHigh(event.target.value)}>
                  {compatibleHighOptions.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
                </select>
              </label>
              <label>Consumo mensual de viales ({result.low.label})
                <input type="number" value={inputs.monthlyVials} onChange={(event) => update('monthlyVials', event.target.value)} />
              </label>
              <label>Salario químico<input inputMode="numeric" value={currencyInput(inputs.pharmacistSalary)} onChange={(event) => update('pharmacistSalary', event.target.value)} /></label>
              <label>Salario regente<input inputMode="numeric" value={currencyInput(inputs.assistantSalary)} onChange={(event) => update('assistantSalary', event.target.value)} /></label>
              <label>Precio {result.low.label}<input inputMode="numeric" value={currencyInput(inputs.lowPrice)} onChange={(event) => update('lowPrice', event.target.value)} /></label>
              <label>Precio {result.high.label}<input inputMode="numeric" value={currencyInput(inputs.highPrice)} onChange={(event) => update('highPrice', event.target.value)} /></label>
              <label className="storage-input">Costo de uso del metro cúbico
                <input inputMode="numeric" value={currencyInput(inputs.storageCostM3)} onChange={(event) => update('storageCostM3', event.target.value)} />
              </label>
            </div>
            <div className="equivalence"><ShieldCheck size={18} /> <strong>{number.format(inputs.monthlyVials)} viales de {result.low.label}</strong><span>se suplen con {number.format(result.equivalentHighVials)} viales de {result.high.label}.</span></div>
          </div>
        </aside>

        <section className="dashboard">
          <div className="kpi-grid">
            <article><WalletCards /><span>Ahorro mensual</span><strong>{money.format(result.totalSaving)}</strong><small>{money.format(result.annualSaving)} al año</small></article>
            <article><BarChart3 /><span>Ahorro porcentual</span><strong>{percent.format(result.totalSavingPct)}</strong><small>{money.format(result.costPerMg.saving)} por mg</small></article>
            <article><Clock3 /><span>Tiempo evitado</span><strong>{number.format(result.time.savedMonthly / 60)} h</strong><small>{number.format((result.time.savedMonthly * 12) / 60)} horas/año</small></article>
            <article><Leaf /><span>Residuos evitados</span><strong>{number.format(result.waste.savedAnnualKg)} kg</strong><small>{percent.format(result.waste.savingPct)} menos residuos</small></article>
            <article><Leaf /><span>Costos evitados incineración</span><strong>{money.format(result.waste.savedIncinerationAnnual)}</strong><small>{number.format(result.waste.savedAnnualKg)} kg evitados al año</small></article>
            <article><Boxes /><span>Ahorro almacenamiento</span><strong>{money.format(result.storage.annualSaving)}</strong><small>Proyección anual</small></article>
            <article><ShieldCheck /><span>Espacio liberado</span><strong>{number.format(result.storage.savedM3)} m³</strong><small>Uso mensual de bodega</small></article>
          </div>

          <div className="chart-card wide">
            <div className="section-title"><WalletCards size={18} /> Costos mensuales por unidad generadora</div>
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={monthlyData} margin={{ top: 10, right: 8, left: -18, bottom: 58 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="rubro" angle={-36} textAnchor="end" interval={0} height={78} tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(value) => `$${Math.round(Number(value) / 1000000)}M`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => money.format(Number(value))} />
                <Bar dataKey={result.low.label} fill="#2c4975" radius={[6, 6, 0, 0]} minPointSize={5}>
                  <LabelList dataKey={result.low.label} content={(labelProps) => verticalMoneyLabel({
                    x: labelProps.x,
                    y: labelProps.y,
                    width: labelProps.width,
                    height: labelProps.height,
                    value: labelProps.value,
                    color: '#2c4975',
                  })} />
                </Bar>
                <Bar dataKey={result.high.label} fill="#22b4c7" radius={[6, 6, 0, 0]} minPointSize={5}>
                  <LabelList dataKey={result.high.label} content={(labelProps) => verticalMoneyLabel({
                    x: labelProps.x,
                    y: labelProps.y,
                    width: labelProps.width,
                    height: labelProps.height,
                    value: labelProps.value,
                    color: '#0f766e',
                  })} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card wide">
            <div className="section-title"><BarChart3 size={18} /> Costo por miligramo por unidad generadora</div>
            <ResponsiveContainer width="100%" height={310}>
              <BarChart data={unitCostData} layout="vertical" margin={{ top: 8, right: 58, left: 116, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(value) => moneyOneDecimal.format(Number(value))} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="rubro" width={112} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => moneyOneDecimal.format(Number(value))} />
                <Bar dataKey={result.low.label} fill="#2c4975" radius={[0, 6, 6, 0]}>
                  <LabelList dataKey={result.low.label} position="right" formatter={currencyOneDecimalLabel} fontSize={11} fontWeight={500} fill="#2c4975" />
                </Bar>
                <Bar dataKey={result.high.label} fill="#22b4c7" radius={[0, 6, 6, 0]}>
                  <LabelList dataKey={result.high.label} position="right" formatter={currencyOneDecimalLabel} fontSize={11} fontWeight={500} fill="#22b4c7" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card savings-distribution-card">
            <div className="section-title"><BarChart3 size={18} /> Distribución del ahorro</div>
            <div className="donut-with-table">
              <ResponsiveContainer width="100%" height={255}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={84} paddingAngle={2} label={piePercentLabel} labelLine={false}>
                    {pieData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                  </Pie>
                  <Tooltip formatter={(value) => money.format(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
              <div className="value-table" aria-label="Valores monetarios de la distribución del ahorro">
                {pieData.map((row, index) => (
                  <div className="value-row" key={row.name}>
                    <span><i style={{ background: colors[index % colors.length] }} />{row.name}</span>
                    <strong style={{ color: colors[index % colors.length] }}>{money.format(row.value)}</strong>
                  </div>
                ))}
              </div>
            </div>
            <div className="legend-list">{pieData.map((row, index) => <span key={row.name}><i style={{ background: colors[index % colors.length] }} />{row.name}</span>)}</div>
          </div>

          <div className="chart-card">
            <div className="section-title"><BarChart3 size={18} /> Distribución de costos de {result.low.label}</div>
            <ResponsiveContainer width="100%" height={255}>
              <PieChart>
                <Pie data={costDistributionData} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={2}>
                  {costDistributionData.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip formatter={(value) => money.format(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="legend-list">{costDistributionData.slice(0, 5).map((row, index) => <span key={row.name}><i style={{ background: colors[index % colors.length] }} />{row.name}</span>)}</div>
          </div>

          <div className="chart-card">
            <div className="section-title"><Clock3 size={18} /> Cuidado del equipo</div>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart data={timeData} layout="vertical" margin={{ left: 28, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="item" width={92} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => `${number.format(Number(value))} min`} />
                <Bar dataKey={result.low.label} fill="#2c4975" radius={[0, 6, 6, 0]}>
                  <LabelList dataKey={result.low.label} position="right" formatter={minuteLabel} />
                </Bar>
                <Bar dataKey={result.high.label} fill="#22b4c7" radius={[0, 6, 6, 0]}>
                  <LabelList dataKey={result.high.label} position="right" formatter={minuteLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="section-title"><Clock3 size={18} /> Ahorro en tiempos y salarios</div>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart data={timeSavingsData} margin={{ top: 18, right: 24, left: -12, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="item" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `$${Math.round(Number(value) / 1000)}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value, name) => name === 'ahorro' ? money.format(Number(value)) : `${number.format(Number(value))} min`} />
                <Bar yAxisId="left" dataKey="tiempo" name="Tiempo ahorrado" fill="#22b4c7" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="tiempo" position="top" formatter={minuteLabel} />
                </Bar>
                <Bar yAxisId="right" dataKey="ahorro" name="Ahorro económico" fill="#2c4975" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="ahorro" position="top" formatter={currencyLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="section-title"><Leaf size={18} /> Ahorro en disposición total de residuos</div>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart data={wasteData} margin={{ top: 18, right: 26, left: -14, bottom: 22 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="item" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value, name) => name === 'costo' ? money.format(Number(value)) : `${number.format(Number(value))} kg`} />
                <Bar dataKey="kg" name="Residuos mensuales" fill="#22b4c7" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="kg" content={(labelProps) => wasteLabel({
                    x: labelProps.x,
                    y: labelProps.y,
                    width: labelProps.width,
                    value: labelProps.value,
                    cost: wasteData[Number(labelProps.index)]?.costo,
                  })} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="section-title"><Boxes size={18} /> Ahorro en almacenamiento</div>
            <ResponsiveContainer width="100%" height={255}>
              <BarChart data={storageData} margin={{ top: 18, right: 26, left: -14, bottom: 22 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="item" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(value) => money.format(Number(value))} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value, name) => name === 'costo' ? money.format(Number(value)) : `${number.format(Number(value))} m³`} />
                <Bar dataKey="costo" name="Costo mensual de almacenamiento" fill="#8fa8cf" radius={[6, 6, 0, 0]}>
                  <LabelList dataKey="costo" position="top" formatter={currencyLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </section>
    </main>
  );
}

export default App;