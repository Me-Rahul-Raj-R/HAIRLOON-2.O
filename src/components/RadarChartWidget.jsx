import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
export const RadarChartWidget = ({ analysisResult }) => {
  const shape = analysisResult.faceShape;
  let foreheadValue = 50;
  if (analysisResult.metrics.foreheadWidth === "Wide") foreheadValue = 85;
  else if (analysisResult.metrics.foreheadWidth === "Average") foreheadValue = 60;
  else if (analysisResult.metrics.foreheadWidth === "Narrow") foreheadValue = 35;
  let cheekValue = 50;
  if (analysisResult.metrics.cheekboneProminence === "High") cheekValue = 90;
  else if (analysisResult.metrics.cheekboneProminence === "Average") cheekValue = 65;
  else if (analysisResult.metrics.cheekboneProminence === "Soft") cheekValue = 40;
  let jawValue = 50;
  if (analysisResult.metrics.jawlineType === "Sharp" || analysisResult.metrics.jawlineType === "Angular") {
    jawValue = 85;
  } else if (analysisResult.metrics.jawlineType === "Rounded") {
    jawValue = 55;
  } else if (analysisResult.metrics.jawlineType === "Soft") {
    jawValue = 45;
  }
  let lengthValue = 60;
  if (analysisResult.metrics.faceLengthRatio === "Longer") lengthValue = 90;
  else if (analysisResult.metrics.faceLengthRatio === "Balanced") lengthValue = 70;
  else if (analysisResult.metrics.faceLengthRatio === "Equal") lengthValue = 50;
  let idealForehead = 70;
  let idealCheek = 70;
  let idealJaw = 60;
  let idealLength = 80;
  if (shape === "Round") {
    idealForehead = 65;
    idealCheek = 85;
    idealJaw = 50;
    idealLength = 60;
  } else if (shape === "Square") {
    idealForehead = 80;
    idealCheek = 75;
    idealJaw = 85;
    idealLength = 65;
  } else if (shape === "Heart") {
    idealForehead = 85;
    idealCheek = 75;
    idealJaw = 40;
    idealLength = 75;
  } else if (shape === "Diamond") {
    idealForehead = 45;
    idealCheek = 90;
    idealJaw = 45;
    idealLength = 75;
  } else if (shape === "Oblong") {
    idealForehead = 60;
    idealCheek = 60;
    idealJaw = 55;
    idealLength = 90;
  } else if (shape === "Pear") {
    idealForehead = 40;
    idealCheek = 65;
    idealJaw = 85;
    idealLength = 70;
  }
  const data = [
    { subject: "Forehead", "Your Fit": foreheadValue, "Golden Ratio": idealForehead },
    { subject: "Cheekbones", "Your Fit": cheekValue, "Golden Ratio": idealCheek },
    { subject: "Jawline", "Your Fit": jawValue, "Golden Ratio": idealJaw },
    { subject: "Face Length", "Your Fit": lengthValue, "Golden Ratio": idealLength }
  ];
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return <div className="bg-slate-950/95 border border-slate-800 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed space-y-1 shadow-lg">
          <p className="font-bold text-slate-300 uppercase tracking-widest border-b border-slate-900 pb-1 mb-1">
            {payload[0].payload.subject}
          </p>
          <p className="text-amber-400">
            Your Fit: <span className="font-black font-sans text-xs">{payload[0].value}</span> / 100
          </p>
          <p className="text-rose-400">
            Golden Ratio: <span className="font-black font-sans text-xs">{payload[1].value}</span> / 100
          </p>
        </div>;
    }
    return null;
  };
  return <div className="border border-slate-900 bg-slate-900/10 rounded-2xl p-4 space-y-3 shadow-inner">
      <div className="flex justify-between items-center">
        <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
          Symmetry vs. Golden Ratio ({shape})
        </h4>
        <span className="text-[8px] bg-rose-500/15 text-rose-300 font-bold border border-rose-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
          Biometric Radar
        </span>
      </div>

      <div className="h-[200px] w-full flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#334155" strokeDasharray="3 3" />
            <PolarAngleAxis
    dataKey="subject"
    stroke="#94a3b8"
    tick={{ fill: "#94a3b8", fontSize: 9, fontWeight: 700 }}
  />
            <PolarRadiusAxis
    angle={30}
    domain={[0, 100]}
    tick={{ fill: "#475569", fontSize: 8 }}
    axisLine={false}
  />
            <Radar
    name="Your Fit"
    dataKey="Your Fit"
    stroke="#f59e0b"
    fill="#f59e0b"
    fillOpacity={0.25}
  />
            <Radar
    name="Golden Ratio"
    dataKey="Golden Ratio"
    stroke="#ec4899"
    fill="#ec4899"
    fillOpacity={0.12}
    strokeDasharray="4 4"
  />
            <Tooltip content={<CustomTooltip />} />
            <Legend
    verticalAlign="bottom"
    height={36}
    iconSize={8}
    tickFormatter={(val) => val}
    wrapperStyle={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}
  />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>;
};
