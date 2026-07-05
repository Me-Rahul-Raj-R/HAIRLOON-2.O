import React, { useState, useEffect, useRef } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Heart, 
  Activity, 
  Shield, 
  Coins, 
  TrendingUp, 
  UserCheck, 
  Smile, 
  ThumbsUp, 
  Check, 
  Zap, 
  Sparkles, 
  RotateCcw, 
  Play, 
  Pause, 
  Sliders, 
  Cpu, 
  Layers, 
  Video, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Flame, 
  Plus, 
  X,
  Lock,
  RefreshCw,
  Clock,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts";

// ----------------------------------------------------------------------
// DATA & CONFIG
// ----------------------------------------------------------------------

const STRETCHES = [
  {
    id: "wrist_flex",
    name: "Stylist Wrist Flexor & Carpal Stretch",
    target: "Repetitive shearing strain, wrist/carpal fatigue",
    description: "Extend your arm forward with the palm facing up. Use your other hand to gently pull your fingers downward toward your body. Hold and breathe deeply.",
    duration: 15, // seconds
    color: "from-amber-500/20 to-rose-500/10",
    icon: Zap,
    animationType: "wrist"
  },
  {
    id: "shoulder_squeeze",
    name: "Scapular Squeeze & Spine Release",
    target: "Shoulder blades & chronic back pain from standing",
    description: "Keep your elbows bent at 90 degrees next to your torso. Slowly squeeze your shoulder blades backward together as if holding an orange between them.",
    duration: 15,
    color: "from-indigo-500/20 to-purple-500/10",
    icon: Activity,
    animationType: "shoulders"
  },
  {
    id: "neck_release",
    name: "Lateral Neck Flexion Relief",
    target: "Cervical spine stiffness from bending over clients",
    description: "Gently lower your right ear toward your right shoulder without lifting your shoulder. Use your hand for subtle weight to extend the neck musculature.",
    duration: 15,
    color: "from-teal-500/20 to-emerald-500/10",
    icon: Heart,
    animationType: "neck"
  }
];

const DE_ESCALATION_SCENARIOS = [
  {
    id: "color_dispute",
    clientMessage: "Wait... this highlights are way too brassy! This is NOT the ash blonde balayage I showed you in the reference. I can't leave the salon looking like this!",
    options: [
      {
        text: "Calmly validate, offer a quick conditioning toner glaze, and reference the visual pre-service contract sheet.",
        score: 95,
        feedback: "Excellent! Reassuring them with a concrete, stress-free action plan while gently referencing the signed visual agreement diffuses anxiety instantly.",
        response: "I completely understand your concern, and I want you to love your hair! Let's take a look at our pre-service blueprint. We went with a level 9, which can sometimes throw warm undertones under this bright styling light. I can easily apply a specialized cooler toner at the bowl for 10 minutes to neutralize that brassiness completely, free of charge. How does that sound?"
      },
      {
        text: "Tell the client that level 9 gold always has warm pigments and that they should have listened during the initial consultation.",
        score: 30,
        feedback: "Defensive. Shifting blame onto the client makes them feel ignored and intensifies their panic, fueling negative reviews.",
        response: "Well, during the consult I told you that your natural red undertones would cause warmth. Ash blonde is impossible on your hair in a single session without damage, so this is what you get."
      },
      {
        text: "Apologize excessively, offer a full refund, and say you feel terrible about ruining their day.",
        score: 60,
        feedback: "Submissive. While polite, excessive panic undermines your professional credibility and confirms their fear that the hair is 'ruined'.",
        response: "Oh my gosh, I am so incredibly sorry! You are totally right, it looks terrible. Let me just refund everything right now and you don't have to pay a single cent. I feel so awful."
      }
    ]
  },
  {
    id: "length_panic",
    clientMessage: "I asked for a subtle trim, but you cut off at least 3 inches! My hair is way too short now, this is a complete disaster!",
    options: [
      {
        text: "Show the ruler on the signed Pre-Service Contract and explain how face-framing layers shift visual perception.",
        score: 90,
        feedback: "Strong professional composure. Displaying structural proof while offering visual styling styling tips restores absolute confidence.",
        response: "I hear you, and it can definitely feel shocking at first! If we look at our digital roadmap, we measured exactly 1.5 inches of damaged split ends to remove. Because we added textured layers around your cheeks, it can visually feel shorter because of the spring bounce. Let me style it with a relaxed wave to show you the true movement."
      },
      {
        text: "Insist that you cut exactly what they told you and that they are misremembering.",
        score: 15,
        feedback: "High-friction conflict. This leads straight to chargebacks, screams, and permanent brand damage.",
        response: "That's not true. You told me to cut where the damage starts, and that was 3 inches. You signed for it, so you can't blame me."
      }
    ]
  }
];

export default function LabHub() {
  const [labTab, setLabTab] = useState("physical"); // "physical" | "digital"

  // --- Physical State ---
  const [activeStretch, setActiveStretch] = useState(STRETCHES[0]);
  const [stretchTimer, setStretchTimer] = useState(15);
  const [isStretching, setIsStretching] = useState(false);
  
  // Custom stretch-animation tick
  const [stretchFrame, setStretchFrame] = useState(0);

  // No-show shield inputs
  const [stylistCount, setStylistCount] = useState(4);
  const [avgServicePrice, setAvgServicePrice] = useState(120);
  const [noShowRate, setNoShowRate] = useState(15); // %
  const [isShieldActive, setIsShieldActive] = useState(false);

  // Pre-service Contract Board
  const [contractLength, setContractLength] = useState(2); // inches to trim
  const [contractColor, setContractColor] = useState("Honey Butter Balayage");
  const [contractTexture, setContractTexture] = useState("Relaxed Waves");
  const [contractTerms, setContractTerms] = useState(true);
  const [contractSigned, setContractSigned] = useState(false);
  const signatureCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // De-escalation Sandbox
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0);
  const [selectedDeEscalationOption, setSelectedDeEscalationOption] = useState(null);
  const [customDeEscalationText, setCustomDeEscalationText] = useState("");
  const [customSandboxFeedback, setCustomSandboxFeedback] = useState(null);

  // Salon Overhead / Profitability Calculator
  const [rentPrice, setRentPrice] = useState(2400);
  const [inflationFactor, setInflationFactor] = useState(8); // % increase in utilities & rent
  const [staffRetentionBonus, setStaffRetentionBonus] = useState(true); // toggles extra 15% efficiency

  // --- Digital 3D Simulation State ---
  // Kui Wu's Hair Interpolation parameters
  const [interpolationMethod, setInterpolationMethod] = useState("kui_wu"); // "standard" | "kui_wu"
  const [guideHairCount, setGuideHairCount] = useState(40);
  const [windStrength, setWindStrength] = useState(60);
  const [springStiffness, setSpringStiffness] = useState(70);
  
  // Ref for Hair physics Canvas
  const hairCanvasRef = useRef(null);

  // Mobile Hardware Optimization parameters
  const [strandDensity, setStrandDensity] = useState(45000); // number of total hairs
  const [lodMode, setLodMode] = useState("smart_decimation"); // "none" | "smart_decimation"
  const [targetDevice, setTargetDevice] = useState("mid_range_phone"); // "low_end", "mid_range_phone", "next_gen"

  // ----------------------------------------------------------------------
  // EFFECTS & PHYSICS LOOPS
  // ----------------------------------------------------------------------

  // Stretch break Timer
  useEffect(() => {
    let interval = null;
    if (isStretching && stretchTimer > 0) {
      interval = setInterval(() => {
        setStretchTimer((prev) => prev - 1);
        setStretchFrame((prev) => (prev + 1) % 40); // animate frame
      }, 1000);
    } else if (stretchTimer === 0) {
      setIsStretching(false);
      setStretchTimer(activeStretch.duration);
    }
    return () => clearInterval(interval);
  }, [isStretching, stretchTimer]);

  // Handle stretch switch
  const selectStretch = (stretch) => {
    setActiveStretch(stretch);
    setStretchTimer(stretch.duration);
    setIsStretching(false);
    setStretchFrame(0);
  };

  // HTML5 Canvas Physics Simulator: Guide Hair Interpolation (Kui Wu's Algorithm)
  useEffect(() => {
    const canvas = hairCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.04;

      // Base coordinates for hair root block
      const rootX = canvas.width / 2;
      const rootY = 40;

      // Render Head/Cap sphere
      ctx.beginPath();
      ctx.arc(rootX, rootY, 35, 0, Math.PI, true);
      ctx.fillStyle = "#1e293b";
      ctx.fill();
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wind displacement logic
      const currentWind = (windStrength / 100) * 45 * Math.sin(time * 2);
      const windNoise = Math.cos(time * 3.5) * (windStrength / 100) * 12;

      // We simulate guide hairs
      const totalVisualHairs = 120;
      const guidesCount = Math.min(guideHairCount, totalVisualHairs);

      for (let i = 0; i < totalVisualHairs; i++) {
        // Is this a direct Guide Hair or an Interpolated Hair?
        const isGuide = i % Math.max(1, Math.round(totalVisualHairs / guidesCount)) === 0;

        // Spread root points around head circumference
        const angle = Math.PI * 0.15 + (Math.PI * 0.7 * (i / totalVisualHairs));
        const startX = rootX + Math.cos(angle) * 35;
        const startY = rootY - Math.sin(angle) * 35;

        // Bezier points to simulate bending
        const cp1x = startX + Math.cos(angle) * 30 + (currentWind * 0.4);
        const cp1y = startY - Math.sin(angle) * 30 + 40;

        let cp2x, cp2y, endX, endY;

        if (interpolationMethod === "kui_wu") {
          // Kui Wu's method: Smooth continuous math, high stiffness feedback, no zigzags
          const damping = springStiffness / 100;
          cp2x = startX + Math.cos(angle) * 80 + currentWind * (1.2 - damping * 0.3) + windNoise * 0.5;
          cp2y = startY - Math.sin(angle) * 80 + 120;

          endX = startX + Math.cos(angle) * 130 + currentWind * (1.6 - damping * 0.5);
          endY = startY - Math.sin(angle) * 130 + 190;

          // Draw silky smooth spline
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.strokeStyle = isGuide 
            ? "rgba(129, 140, 248, 0.95)" // Solid Indigo guide
            : "rgba(45, 212, 191, 0.45)"; // Soft Teal interpolated
          ctx.lineWidth = isGuide ? 2.5 : 1.2;
          ctx.stroke();
        } else {
          // Standard Interpolation: Causes dramatic, mechanical kink/zigzag artifacts when bending
          // This occurs because we calculate a linear interpolation from guides which breaks on deformations
          const factor = i % 8; // spatial offset to simulate broken interpolation
          const artifactSeverity = (windStrength / 100) * 22 * (1 - (springStiffness / 120));
          
          cp2x = startX + Math.cos(angle) * 85 + currentWind + (factor % 2 === 0 ? artifactSeverity : -artifactSeverity);
          cp2y = startY - Math.sin(angle) * 80 + 115 + (factor % 3 === 0 ? 10 : -10);

          endX = startX + Math.cos(angle) * 125 + currentWind + (factor % 2 !== 0 ? artifactSeverity * 1.5 : -artifactSeverity * 1.5);
          endY = startY - Math.sin(angle) * 125 + 185;

          // Drawing jagged line
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(cp1x, cp1y);
          ctx.lineTo(cp2x, cp2y);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = isGuide 
            ? "rgba(239, 68, 68, 0.9)" // Red standard guide
            : "rgba(245, 158, 11, 0.65)"; // Amber jagged interpolated
          ctx.lineWidth = isGuide ? 2.2 : 1.4;
          ctx.stroke();

          // Highlight mechanical kink errors on interpolated hairs
          if (!isGuide && Math.abs(artifactSeverity) > 5 && i % 15 === 0) {
            ctx.beginPath();
            ctx.arc(cp2x, cp2y, 4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(239, 68, 68, 0.85)";
            ctx.fill();
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw anchor info
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px monospace";
      ctx.fillText(interpolationMethod === "kui_wu" ? "KUI WU INTERPOLATION ACTIVE (SILKY)" : "GUIDE INTERPOLATION ARTIFACTS (ZIGZAGS)", 15, 20);

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [interpolationMethod, guideHairCount, windStrength, springStiffness]);

  // --- Signature Canvas Handlers ---
  const startDrawing = (e) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#10b981"; // Emerald
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = signatureCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setContractSigned(false);
  };

  // --- De-escalation custom grading ---
  const handleCustomDeEscalationSubmit = () => {
    if (!customDeEscalationText.trim()) return;

    // AI Simulated analysis of response
    const textLower = customDeEscalationText.toLowerCase();
    let score = 50;
    let feedback = "Neutral response. Ensure you actively apologize, validate, propose a precise fix, and refer back to agreed parameters.";

    if (textLower.includes("sorry") || textLower.includes("apologize") || textLower.includes("understand")) {
      score += 15;
    }
    if (textLower.includes("toner") || textLower.includes("glaze") || textLower.includes("fix") || textLower.includes("adjust")) {
      score += 15;
    }
    if (textLower.includes("contract") || textLower.includes("blueprint") || textLower.includes("pre-service") || textLower.includes("agreed")) {
      score += 15;
    }
    if (textLower.includes("fault") || textLower.includes("wrong") || textLower.includes("your choice")) {
      score -= 20;
    }

    score = Math.min(100, Math.max(10, score));

    if (score >= 80) {
      feedback = "Excellent! You handled this professionally. By acknowledging feelings, formulating an instant micro-fix, and checking the parameters, you saved the client relationship.";
    } else if (score >= 55) {
      feedback = "Moderate performance. While you are trying to address the issue, adding structural validations (mentioning the blueprint) and clear, jargon-free options would bolster your scores.";
    } else {
      feedback = "Critical Friction. The phrasing feels defensive or dismissive. In a high-stress salon environment, this will trigger extreme dissatisfaction and negative online reviews.";
    }

    setCustomSandboxFeedback({ score, feedback });
  };

  // ----------------------------------------------------------------------
  // CALCULATIONS
  // ----------------------------------------------------------------------

  // Booking calculations
  const defaultNoShows = Math.round((stylistCount * 12 * (noShowRate / 100)) * 10) / 10; // per week
  const protectedNoShows = isShieldActive ? Math.round((defaultNoShows * 0.05) * 10) / 10 : defaultNoShows;
  const weeklyLossDefault = Math.round(defaultNoShows * avgServicePrice);
  const weeklyLossProtected = Math.round(protectedNoShows * avgServicePrice);
  const annualSaved = isShieldActive ? (weeklyLossDefault - weeklyLossProtected) * 52 : 0;

  // Overhead & Inflation modeler
  const initialUtilities = 600;
  const initialStaffWages = stylistCount * 1400; // weekly total
  const adjustedRent = Math.round(rentPrice * (1 + inflationFactor / 100));
  const adjustedUtilities = Math.round(initialUtilities * (1 + (inflationFactor * 1.5) / 100));
  
  // Total baseline operational overhead
  const weeklyOperatingCost = Math.round((adjustedRent + adjustedUtilities) / 4.33) + initialStaffWages;
  const totalClientsCap = stylistCount * 30; // 30 per stylist
  const efficiencyMultiplier = staffRetentionBonus ? 1.18 : 0.95; // 18% boost due to experienced staff
  const typicalWeeklyRevenue = Math.round(totalClientsCap * 0.82 * avgServicePrice * efficiencyMultiplier);
  const weeklyNetProfit = typicalWeeklyRevenue - weeklyOperatingCost - (isShieldActive ? weeklyLossProtected : weeklyLossDefault);

  // --- Hardware Performance simulation ---
  // Calculates estimated FPS and GPU Load based on strand density and LOD
  const getPerformanceData = () => {
    let baseFps = 60;
    let baseGpuLoad = 25;

    // Device constraints
    let multiplier = 1.0;
    if (targetDevice === "low_end") multiplier = 2.4;
    if (targetDevice === "mid_range_phone") multiplier = 1.3;
    if (targetDevice === "next_gen") multiplier = 0.45;

    // Density impact
    const densityImpact = (strandDensity / 10000) * 4.5 * multiplier;
    baseGpuLoad += densityImpact;

    // LOD Mode influence
    if (lodMode === "smart_decimation") {
      // Cuts GPU strain significantly by only rendering critical silhouette hairs at distance
      baseGpuLoad = baseGpuLoad * 0.45;
    }

    // Cap values
    baseGpuLoad = Math.min(100, Math.max(8, Math.round(baseGpuLoad)));
    baseFps = Math.max(12, Math.round(75 - (baseGpuLoad * 0.55)));

    // Generate historic buffer for recharts display
    return [
      { name: "Unoptimized", FPS: Math.max(15, Math.round(75 - (densityImpact * 1.3))), "GPU Load": Math.min(100, Math.round(25 + densityImpact * 1.2)) },
      { name: "With LOD Decimation", FPS: Math.max(45, Math.round(75 - (densityImpact * 0.45))), "GPU Load": Math.min(100, Math.round(25 + densityImpact * 0.35)) },
      { name: "Kui Wu Optimized", FPS: baseFps, "GPU Load": baseGpuLoad }
    ];
  };

  const performanceData = getPerformanceData();
  const currentFPS = performanceData[2].FPS;
  const currentGpuLoad = performanceData[2]["GPU Load"];

  return (
    <div className="space-y-8 select-text" id="industry_solutions_hub">
      {/* HEADER HERO */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-900 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 h-32 w-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Maison Laboratory Suite</span>
            </div>
            <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider">
              Hairstyling Industry &amp; 3D Engine Labs
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Addressing crucial physical bottlenecks, scheduling leakages, and client management complexities alongside digital hair graphics simulations, Guide kinks, and mobile frame-rate optimization.
            </p>
          </div>

          {/* TAB CONTROLS */}
          <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-900 self-start md:self-center">
            <button
              onClick={() => setLabTab("physical")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                labTab === "physical"
                  ? "bg-teal-500/15 border border-teal-500/30 text-teal-300 shadow"
                  : "border border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <UserCheck size={14} />
              Physical &amp; Operations Lab
            </button>
            <button
              onClick={() => setLabTab("digital")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                labTab === "digital"
                  ? "bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 shadow"
                  : "border border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Cpu size={14} />
              Digital &amp; 3D Graphics Lab
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {labTab === "physical" ? (
          <motion.div
            key="physical_lab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* COLUMN 1: ERGONOMICS & DE-ESCALATION */}
            <div className="space-y-8">
              
              {/* WELLNESS TIMER & STRETCHING */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-5 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 font-mono text-[8.5px] text-slate-600 select-none">MODULE: WELL-401</div>
                
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center">
                    <Heart className="text-emerald-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Stylist Ergonomic Wellness Trainer
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Combatting chronic wrist tension, scapular strain, and standing wear &amp; tear.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {STRETCHES.map((st) => {
                    const IconComp = st.icon;
                    return (
                      <button
                        key={st.id}
                        onClick={() => selectStretch(st)}
                        className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                          activeStretch.id === st.id
                            ? "bg-emerald-500/10 border-emerald-500/30 text-slate-100"
                            : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-800"
                        }`}
                      >
                        <IconComp size={15} className="text-emerald-400 mb-2" />
                        <h4 className="text-[10.5px] font-black line-clamp-1">{st.name.split(" ")[1] || st.name.split(" ")[0]}</h4>
                        <p className="text-[8.5px] text-slate-500 line-clamp-1 mt-0.5 uppercase tracking-wide">Target: {st.id.replace("_", " ")}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="bg-slate-950 border border-slate-900/80 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 relative overflow-hidden">
                  <div className="space-y-2 flex-1">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wide">{activeStretch.name}</h4>
                    <p className="text-[9.5px] text-slate-400 leading-relaxed font-mono">
                      {activeStretch.description}
                    </p>
                    <div className="flex gap-2 text-[8.5px] text-rose-300 bg-rose-500/5 px-2 py-1 rounded-md border border-rose-500/10 w-fit font-bold uppercase tracking-wide mt-1">
                      <AlertTriangle size={11} className="self-center" />
                      Prevents: {activeStretch.target}
                    </div>
                  </div>

                  {/* VISUAL STRETCH GRAPHIC SIMULATOR */}
                  <div className="w-32 h-32 rounded-full border border-slate-800 bg-slate-900/40 relative flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-2 rounded-full border border-emerald-500/10 animate-ping opacity-35" />
                    
                    {/* SVG Stylist schematics doing simple joint stretches based on frames */}
                    <svg className="w-20 h-20 text-emerald-400" viewBox="0 0 100 100">
                      {/* Stand */}
                      <line x1="50" y1="85" x2="50" y2="45" stroke="currentColor" strokeWidth="2.5" />
                      {/* Legs */}
                      <line x1="50" y1="85" x2="35" y2="100" stroke="currentColor" strokeWidth="2" />
                      <line x1="50" y1="85" x2="65" y2="100" stroke="currentColor" strokeWidth="2" />
                      
                      {activeStretch.id === "wrist_flex" && (
                        <>
                          {/* Torso/Head */}
                          <circle cx="50" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          {/* Arm extended straight */}
                          <line x1="50" y1="45" x2="80" y2="45" stroke="currentColor" strokeWidth="2" />
                          {/* Pulling wrist hand */}
                          <line x1="80" y1="45" x2="80" y2={50 + Math.sin(stretchFrame * 0.4) * 4} stroke="currentColor" strokeWidth="2" />
                          <line x1="50" y1="48" x2="70" y2="60" stroke="currentColor" strokeWidth="1.5" />
                        </>
                      )}

                      {activeStretch.id === "shoulder_squeeze" && (
                        <>
                          <circle cx="50" cy="30" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          {/* Bent elbows pulling back */}
                          <path 
                            d={`M 50 45 L ${35 + Math.cos(stretchFrame * 0.4) * 3} 45 L ${32 + Math.cos(stretchFrame * 0.4) * 3} 58`} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                          />
                          <path 
                            d={`M 50 45 L ${65 - Math.cos(stretchFrame * 0.4) * 3} 45 L ${68 - Math.cos(stretchFrame * 0.4) * 3} 58`} 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                          />
                        </>
                      )}

                      {activeStretch.id === "neck_release" && (
                        <>
                          {/* Neck tilting head */}
                          <circle cx={50 + Math.sin(stretchFrame * 0.2) * 5} cy="28" r="9" stroke="currentColor" strokeWidth="2" fill="none" />
                          {/* Arms at side */}
                          <line x1="50" y1="45" x2="38" y2="65" stroke="currentColor" strokeWidth="2" />
                          <line x1="50" y1="45" x2="62" y2="65" stroke="currentColor" strokeWidth="2" />
                        </>
                      )}
                    </svg>

                    <div className="absolute bottom-2 bg-slate-950 px-2 py-0.5 rounded-full border border-slate-800 text-[9px] font-mono font-black text-emerald-300">
                      {stretchTimer}s
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsStretching(false);
                      setStretchTimer(activeStretch.duration);
                      setStretchFrame(0);
                    }}
                    className="px-3.5 py-2 bg-slate-950 border border-slate-900 rounded-xl text-[9px] font-black uppercase text-slate-400 hover:text-slate-200 transition-all"
                  >
                    Reset Timer
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsStretching(!isStretching)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase flex items-center gap-1.5 transition-all ${
                      isStretching 
                        ? "bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:bg-rose-500/30" 
                        : "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                    }`}
                  >
                    {isStretching ? (
                      <>
                        <Pause size={10} /> Pause Break
                      </>
                    ) : (
                      <>
                        <Play size={10} /> Start Break
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* DISSATISFIED CLIENT DE-ESCALATION SANDBOX */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-center">
                    <MessageSquare className="text-amber-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Emotional De-escalation &amp; Client Sandbox
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Combatting emotional fatigue with practice responses to dissatisfied clients.
                    </p>
                  </div>
                </div>

                {/* Scenario details */}
                <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900 space-y-3 relative">
                  <div className="absolute top-2 right-2 text-[7.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded uppercase font-black tracking-widest">
                    Live Roleplay
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">ANGRY CLIENT PRESET</span>
                    <p className="text-[10.5px] italic text-rose-300 leading-relaxed pl-3 border-l-2 border-rose-500/40">
                      &ldquo;{DE_ESCALATION_SCENARIOS[activeScenarioIdx].clientMessage}&rdquo;
                    </p>
                  </div>

                  {/* Scenarios preset toggle */}
                  <div className="flex gap-1.5 pt-1">
                    {DE_ESCALATION_SCENARIOS.map((sc, index) => (
                      <button
                        key={sc.id}
                        onClick={() => {
                          setActiveScenarioIdx(index);
                          setSelectedDeEscalationOption(null);
                          setCustomDeEscalationText("");
                          setCustomSandboxFeedback(null);
                        }}
                        className={`px-2 py-1 rounded text-[8px] font-black uppercase border transition-all ${
                          activeScenarioIdx === index 
                            ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                            : "bg-slate-900/30 border-slate-900 text-slate-500 hover:text-slate-400"
                        }`}
                      >
                        Scenario {index + 1}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Choose choices */}
                <div className="space-y-2.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Select De-escalation Path:</span>
                  <div className="space-y-2">
                    {DE_ESCALATION_SCENARIOS[activeScenarioIdx].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedDeEscalationOption(opt);
                          setCustomSandboxFeedback(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl border text-[10px] leading-relaxed transition-all relative group ${
                          selectedDeEscalationOption?.text === opt.text
                            ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-200"
                            : "bg-slate-950 border-slate-900/60 text-slate-300 hover:border-slate-800"
                        }`}
                      >
                        <div className="font-bold pr-12">{opt.text}</div>
                        {selectedDeEscalationOption?.text === opt.text && (
                          <div className="absolute right-3 top-3 text-[9px] font-black text-indigo-400 font-mono">
                            SCORE: {opt.score}/100
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom input path */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Or Draft Custom De-escalation Statement:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customDeEscalationText}
                      onChange={(e) => setCustomDeEscalationText(e.target.value)}
                      placeholder="e.g. I completely validate how you feel... Let's review our initial contract sheet and..."
                      className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-[10.5px] text-slate-300 placeholder-slate-600 outline-none hover:border-slate-800 focus:border-indigo-500/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={handleCustomDeEscalationSubmit}
                      className="px-4 py-2 bg-indigo-600 text-slate-950 text-[10px] font-black uppercase rounded-xl hover:bg-indigo-500 transition-all"
                    >
                      Audit
                    </button>
                  </div>
                </div>

                {/* Feedback presentation */}
                <AnimatePresence>
                  {(selectedDeEscalationOption || customSandboxFeedback) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-3.5 bg-slate-950 border border-slate-900 rounded-xl space-y-1 text-[9.5px]"
                    >
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-900">
                        <span className="font-black text-slate-400 uppercase tracking-widest">Maison De-Escalation Scorecard</span>
                        <span className={`font-mono font-black text-xs ${
                          (selectedDeEscalationOption?.score || customSandboxFeedback?.score) >= 80 
                            ? "text-emerald-400" 
                            : (selectedDeEscalationOption?.score || customSandboxFeedback?.score) >= 50 
                            ? "text-amber-400" 
                            : "text-rose-400"
                        }`}>
                          {selectedDeEscalationOption?.score || customSandboxFeedback?.score}/100
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed font-mono">
                        {selectedDeEscalationOption?.feedback || customSandboxFeedback?.feedback}
                      </p>
                      <div className="bg-slate-900/40 p-2 rounded border border-slate-900/60 font-medium text-[9px] text-slate-500 italic mt-1.5">
                        <strong className="text-slate-400 block uppercase tracking-wider text-[8px] not-italic mb-0.5">Recommended Response Phrasing:</strong>
                        &ldquo;{selectedDeEscalationOption?.response || "We always recommend apologizing first, validating the sensory feedback, establishing a quick remedy (like toner/shading), and checking agreements."}&rdquo;
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* COLUMN 2: BOOKING LEAKAGE & FINANCIAL OVERHEAD */}
            <div className="space-y-8">
              
              {/* SMART NO-SHOW SHIELD & RESERVATION PROTECTION */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-5 shadow-lg relative">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-center">
                    <Shield className="text-rose-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      AI-Powered No-Show Shield Modeler
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Estimating leakages from missed slots and applying intelligent digital mitigations.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950 p-4.5 rounded-2xl border border-slate-900/85">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">ACTIVE STYLISTS</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={stylistCount}
                      onChange={(e) => setStylistCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100 outline-none focus:border-rose-500/30"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">AVG SERVICE PRICE ($)</label>
                    <input
                      type="number"
                      min={20}
                      max={1000}
                      value={avgServicePrice}
                      onChange={(e) => setAvgServicePrice(Math.max(20, parseInt(e.target.value) || 20))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100 outline-none focus:border-rose-500/30"
                    />
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">NO-SHOW RATE (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={noShowRate}
                      onChange={(e) => setNoShowRate(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-100 outline-none focus:border-rose-500/30"
                    />
                  </div>
                </div>

                {/* Toggle protect shield */}
                <div 
                  onClick={() => setIsShieldActive(!isShieldActive)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    isShieldActive 
                      ? "bg-rose-500/10 border-rose-500/40 text-rose-200" 
                      : "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400"
                  }`}
                >
                  <div className="flex gap-3 items-center">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${isShieldActive ? "bg-rose-500/20 text-rose-300" : "bg-slate-900 text-slate-600"}`}>
                      <Shield size={14} className={isShieldActive ? "animate-pulse" : ""} />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-wide">ACTIVATE SMART NO-SHOW SHIELD</span>
                      <span className="text-[9px] text-slate-500 mt-0.5">Enforces 20% smart deposit prepayments &amp; automated waitlist matching.</span>
                    </div>
                  </div>
                  <div className={`h-5 w-9 rounded-full p-0.5 transition-colors ${isShieldActive ? "bg-rose-500" : "bg-slate-850"}`}>
                    <div className={`h-4 w-4 rounded-full bg-slate-950 transition-transform ${isShieldActive ? "translate-x-4" : ""}`} />
                  </div>
                </div>

                {/* Leakage Analysis */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-widest">
                    <span>Expected Weekly Slots Lost</span>
                    <span className="font-mono text-slate-300">{defaultNoShows} slots</span>
                  </div>
                  {isShieldActive && (
                    <div className="flex justify-between items-center text-[10px] text-emerald-400 uppercase tracking-widest">
                      <span>Mitigated Weekly Slots Lost</span>
                      <span className="font-mono">{protectedNoShows} slots</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3.5 pt-1">
                    <div className="bg-slate-950 border border-slate-900 p-3 rounded-2xl text-center space-y-1.5">
                      <p className="text-[8px] text-slate-500 font-black uppercase">Weekly Revenue Loss</p>
                      <div className="text-sm font-black font-mono">
                        {isShieldActive ? (
                          <>
                            <span className="line-through text-slate-600 font-medium mr-2">${weeklyLossDefault}</span>
                            <span className="text-emerald-400">${weeklyLossProtected}</span>
                          </>
                        ) : (
                          <span className="text-rose-400">${weeklyLossDefault}</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-900 p-3 rounded-2xl text-center space-y-1.5">
                      <p className="text-[8px] text-slate-500 font-black uppercase">Annual Revenue Recovered</p>
                      <div className="text-sm font-black font-mono text-emerald-400">
                        ${annualSaved}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SMS Auto reminder simulation */}
                <AnimatePresence>
                  {isShieldActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-indigo-950/20 border border-indigo-500/15 p-4 rounded-2xl space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] text-indigo-300 font-black uppercase tracking-widest flex items-center gap-1">
                          <CheckCircle size={10} className="text-indigo-400" />
                          Simulating No-Show Guard Notification Flow
                        </span>
                        <span className="text-[7.5px] bg-indigo-500/20 text-indigo-300 px-1.5 rounded uppercase font-black">SMS COURIER</span>
                      </div>
                      <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-900 font-mono text-[9px] text-slate-400 leading-normal">
                        <strong className="text-indigo-400">From: Maison Salon Protection Hub</strong>
                        <p className="mt-1">
                          Hi, Sarah! Your appointment with Chloe is tomorrow at 2:00 PM. Please click to confirm your 20% security ledger deposit ($24.00) to lock this slot: <span className="text-indigo-300 underline cursor-pointer">maison.salon/c-5f21</span>. Thanks!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* PRE-SERVICE DETAILED AGREEMENT & LOCK */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center">
                    <UserCheck className="text-teal-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Pre-Service Consultation Agreement (Anti-Dispute Contract)
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Binding digital agreement ledger to lock in precise stylistic guidelines.
                    </p>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-950 p-4.5 rounded-2xl border border-slate-900">
                  
                  {/* Slider length */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] font-bold">
                      <span className="text-slate-500 uppercase tracking-wide">MAX HAIR LENGTH TO CUT</span>
                      <span className="text-teal-300 font-mono">{contractLength} inches</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12}
                      step={0.5}
                      value={contractLength}
                      onChange={(e) => setContractLength(parseFloat(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer h-1 bg-slate-900 rounded-lg"
                    />
                  </div>

                  {/* Selectors color */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-black uppercase tracking-wide">COLOR FORMULA TARGET</label>
                      <select
                        value={contractColor}
                        onChange={(e) => setContractColor(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-[10.5px] text-slate-100 outline-none focus:border-teal-500/30"
                      >
                        <option value="Honey Butter Balayage">Honey Butter Balayage</option>
                        <option value="Ashen Silver Platinum">Ashen Silver Platinum</option>
                        <option value="Auburn Copper Glaze">Auburn Copper Glaze</option>
                        <option value="Chestnut Brunette Shadow Root">Chestnut Shadow Root</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] text-slate-500 font-black uppercase tracking-wide">FINISHING TEXTURE</label>
                      <select
                        value={contractTexture}
                        onChange={(e) => setContractTexture(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-[10.5px] text-slate-100 outline-none focus:border-teal-500/30"
                      >
                        <option value="Relaxed Waves">Relaxed Waves</option>
                        <option value="High-Gloss Silk Straight">High-Gloss Silk Straight</option>
                        <option value="Coiled Corkscrew Volume">Coiled Corkscrew Volume</option>
                        <option value="Blowout Bounce">Blowout Bounce</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Panel */}
                <div className="space-y-2.5">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Client Handshake Signature:</span>
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl overflow-hidden relative">
                    <canvas
                      ref={signatureCanvasRef}
                      width={380}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="w-full h-24 bg-slate-950 cursor-crosshair block"
                    />
                    
                    <div className="absolute bottom-1.5 left-3 text-[7.5px] font-mono text-slate-600 uppercase select-none tracking-widest">
                      Sign in this box to bind parameters
                    </div>

                    <button
                      type="button"
                      onClick={clearSignature}
                      className="absolute bottom-1.5 right-3 px-2 py-0.5 bg-slate-900 border border-slate-800 text-[8px] font-black uppercase text-slate-400 rounded hover:text-slate-200"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Digital handshake action */}
                <div className="flex gap-2.5 items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="contract_chk"
                      checked={contractTerms}
                      onChange={(e) => setContractTerms(e.target.checked)}
                      className="rounded accent-teal-500 h-3.5 w-3.5"
                    />
                    <label htmlFor="contract_chk" className="text-[9.5px] text-slate-400 font-bold leading-normal cursor-pointer select-none">
                      Both parties agree parameters match visual consultation blueprints
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setContractSigned(true);
                    }}
                    disabled={!contractTerms}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      contractSigned 
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                        : contractTerms 
                        ? "bg-teal-500 text-slate-950 hover:bg-teal-400 shadow shadow-teal-500/10" 
                        : "bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    {contractSigned ? (
                      <>
                        <CheckCircle size={11} /> Handshake Logged
                      </>
                    ) : (
                      <>
                        <Lock size={11} /> Lock Blueprint
                      </>
                    )}
                  </button>
                </div>

                {/* Signed accord visualization */}
                <AnimatePresence>
                  {contractSigned && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-emerald-950/15 border border-emerald-500/20 p-4 rounded-2xl relative"
                    >
                      <div className="absolute top-2 right-3 text-[7.5px] font-mono text-emerald-400 uppercase tracking-widest font-black select-none">
                        BLOCKCHAIN LOCKED • ACCORD-#721F
                      </div>
                      <div className="space-y-1 text-[9.5px] text-slate-300 leading-relaxed font-mono">
                        <p className="font-bold text-slate-100 uppercase tracking-wider">Un-alterable Client Handshake Contract Signed:</p>
                        <p>• Trim Target: <strong className="text-emerald-400">{contractLength} inches max</strong></p>
                        <p>• Coloring Target: <strong className="text-emerald-400">{contractColor}</strong></p>
                        <p>• Hair Texture Accent: <strong className="text-emerald-400">{contractTexture}</strong></p>
                        <p className="text-[8.5px] text-slate-500 italic mt-1 pb-1 border-t border-slate-900/60">
                          Pre-service contract eliminates emotional disputes &amp; client remorse chargebacks by providing solid, visual agreements prior to shearing.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* OVERHEAD & INFLATION PROFITABILITY MODELER */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-indigo-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Overhead &amp; Inflation Financial Modeler
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Balancing inflation, utility hikes, rent, tipping, and staff retention values.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-900">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">MONTHLY BASE RENT ($)</label>
                    <input
                      type="number"
                      step={100}
                      value={rentPrice}
                      onChange={(e) => setRentPrice(Math.max(500, parseInt(e.target.value) || 500))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-100 outline-none focus:border-indigo-500/30"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">INFLATION SPIKE ON UTILITIES (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={inflationFactor}
                      onChange={(e) => setInflationFactor(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-100 outline-none focus:border-indigo-500/30"
                    />
                  </div>
                </div>

                <div className="flex gap-4 p-3 bg-slate-950 border border-slate-900 rounded-2xl">
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="staff_ret"
                      checked={staffRetentionBonus}
                      onChange={(e) => setStaffRetentionBonus(e.target.checked)}
                      className="rounded accent-indigo-500 h-3.5 w-3.5 cursor-pointer"
                    />
                    <div>
                      <label htmlFor="staff_ret" className="text-[10px] text-slate-200 font-bold block cursor-pointer select-none">
                        Experienced Staff Retention Enabled (+18% efficiency)
                      </label>
                      <span className="text-[8.5px] text-slate-500 block">Experienced stylists retain loyalty list, saving $5k average onboarding.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-900/60 p-4.5 rounded-2xl space-y-3 font-mono text-[9.5px]">
                  <div className="flex justify-between border-b border-slate-900 pb-1 text-slate-500 uppercase tracking-widest text-[8.5px]">
                    <span>Weekly Overhead Metric</span>
                    <span>Value</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adjusted Rent Share (Utility Spike Incl.)</span>
                    <span className="text-rose-400 font-bold">${Math.round(adjustedRent / 4.33 + adjustedUtilities / 4.33)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stylist Core Base Payroll (Weekly)</span>
                    <span className="text-slate-400 font-bold">${initialStaffWages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mitigated Business Friction Profit Loss</span>
                    <span className="text-slate-400 font-bold">${isShieldActive ? weeklyLossProtected : weeklyLossDefault}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-900 pt-2 text-[10.5px]">
                    <span className="text-slate-300 font-bold">Estimated Weekly Net Salon Profit</span>
                    <span className={`font-black ${weeklyNetProfit >= 1000 ? "text-emerald-400" : "text-amber-400"}`}>
                      ${weeklyNetProfit}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="digital_lab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* COLUMN 1: GUIDE HAIR INTERPOLATION (KUI WU SIMULATOR) */}
            <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-5 shadow-lg relative">
              <div className="absolute top-2 right-4 text-[7.5px] font-mono text-slate-600 select-none uppercase tracking-widest">
                PHYSICS RE-ROUTE ENGINE
              </div>

              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                  <Layers className="text-indigo-400" size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                    Real-Time Guide Hair Interpolation Corrector
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Eliminating kink/zigzag artifacts in skeletal hair deformations via Kui Wu's Interpolation math.
                  </p>
                </div>
              </div>

              {/* Simulator canvas wrapper */}
              <div className="border border-slate-900 bg-slate-950 rounded-2xl overflow-hidden relative shadow-inner">
                <canvas
                  ref={hairCanvasRef}
                  width={420}
                  height={240}
                  className="w-full h-56 bg-slate-950 block"
                />

                <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[8px] font-mono text-slate-500 uppercase tracking-wider select-none pointer-events-none">
                  <span className="text-indigo-400 font-bold">● Solid Guide Strand</span>
                  <span className="text-teal-400 font-bold">● Interpolated Strand</span>
                </div>
              </div>

              {/* Toggle solver method */}
              <div className="grid grid-cols-2 gap-3.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-900/80">
                <button
                  onClick={() => setInterpolationMethod("standard")}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    interpolationMethod === "standard"
                      ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                      : "border-transparent text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Standard (Kink Artifacts)
                </button>
                <button
                  onClick={() => setInterpolationMethod("kui_wu")}
                  className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                    interpolationMethod === "kui_wu"
                      ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
                      : "border-transparent text-slate-500 hover:text-slate-400"
                  }`}
                >
                  Kui Wu's Corrective Model
                </button>
              </div>

              {/* Parameters Controls */}
              <div className="bg-slate-950 p-4.5 rounded-2xl border border-slate-900 space-y-4">
                <h4 className="text-[9px] text-slate-500 font-black uppercase tracking-wider pb-1 border-b border-slate-900">
                  Simulation Physics Variables
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[8.5px] font-black uppercase">
                      <span className="text-slate-400">GUIDE COUNT</span>
                      <span className="text-indigo-400 font-mono">{guideHairCount}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={120}
                      value={guideHairCount}
                      onChange={(e) => setGuideHairCount(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-900 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8.5px] font-black uppercase">
                      <span className="text-slate-400">WIND FORCE</span>
                      <span className="text-indigo-400 font-mono">{windStrength}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={windStrength}
                      onChange={(e) => setWindStrength(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-900 rounded-lg"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[8.5px] font-black uppercase">
                      <span className="text-slate-400">SPRING STIFFNESS</span>
                      <span className="text-indigo-400 font-mono">{springStiffness}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={springStiffness}
                      onChange={(e) => setSpringStiffness(parseInt(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer h-1 bg-slate-900 rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-900/20 border border-slate-900/60 rounded-xl text-[9.5px] text-slate-400 leading-relaxed font-mono">
                  {interpolationMethod === "kui_wu" ? (
                    <p className="text-emerald-400/95">
                      <strong>SOLUTION STATE: SUCCESS.</strong> Kui Wu's Real-Time Hair Interpolation interpolates intermediate strands using dynamic coordinate metrics to match guide curvature tangents, completely mitigating zigzag/kink deformation anomalies.
                    </p>
                  ) : (
                    <p className="text-rose-400/95">
                      <strong>STIFFNESS DEVIATION ERROR: ALERT.</strong> Linear coordinate matching triggers spatial twisting artifacts (the highlighted red circles). Hair strands lock into jagged, kinked shapes because they lack curvature matching.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: MOBILE GPU OPTIMIZATION & SEGMENTATION */}
            <div className="space-y-8">
              
              {/* MOBILE GPU HARDWARE OPTIMIZER */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-5 shadow-lg">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-teal-500/10 border border-teal-500/30 rounded-xl flex items-center justify-center">
                    <Cpu className="text-teal-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Mobile GPU Hardware &amp; LOD Optimizer
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Throttling vertex pipeline overhead to preserve framerates on resource-constrained chips.
                    </p>
                  </div>
                </div>

                {/* Optimization Controllers */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-950 p-4.5 rounded-2xl border border-slate-900">
                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">TARGET PROFILE</label>
                    <select
                      value={targetDevice}
                      onChange={(e) => setTargetDevice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2 text-[10.5px] text-slate-200 outline-none"
                    >
                      <option value="low_end">Low-End Smartphone</option>
                      <option value="mid_range_phone">Mid-Range Smartphone</option>
                      <option value="next_gen">Premium Desktop GPU</option>
                    </select>
                  </div>

                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <div className="flex justify-between text-[8px] font-black uppercase">
                      <span className="text-slate-500">STRAND DENSITY</span>
                      <span className="text-teal-400 font-mono">{(strandDensity/1000).toFixed(0)}k</span>
                    </div>
                    <input
                      type="range"
                      min={5000}
                      max={120000}
                      step={5000}
                      value={strandDensity}
                      onChange={(e) => setStrandDensity(parseInt(e.target.value))}
                      className="w-full accent-teal-500 cursor-pointer h-1 bg-slate-900 rounded-lg mt-2"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">LOD DECIMATOR</label>
                    <select
                      value={lodMode}
                      onChange={(e) => setLodMode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-850 rounded-xl p-2 text-[10.5px] text-slate-200 outline-none"
                    >
                      <option value="none">Disabled (Full Mesh)</option>
                      <option value="smart_decimation">Enabled (LOD Taper)</option>
                    </select>
                  </div>
                </div>

                {/* Live FPS Gauge & GPU usage metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[8.5px] text-slate-500 font-black uppercase">DYNAMIC FRAMERATE</span>
                    <div className={`text-2xl font-black font-mono tracking-wider ${
                      currentFPS >= 50 ? "text-emerald-400" : currentFPS >= 30 ? "text-amber-400" : "text-rose-500"
                    }`}>
                      {currentFPS} FPS
                    </div>
                    <span className="text-[7px] text-slate-600 block uppercase tracking-widest font-mono">
                      Target: 60 FPS
                    </span>
                  </div>

                  <div className="bg-slate-950 border border-slate-900 p-4 rounded-2xl text-center space-y-1">
                    <span className="text-[8.5px] text-slate-500 font-black uppercase">GPU Core Load</span>
                    <div className={`text-2xl font-black font-mono tracking-wider ${
                      currentGpuLoad <= 60 ? "text-emerald-400" : currentGpuLoad <= 85 ? "text-amber-400" : "text-rose-500"
                    }`}>
                      {currentGpuLoad}%
                    </div>
                    <span className="text-[7px] text-slate-600 block uppercase tracking-widest font-mono">
                      Thermal Ceiling: 95%
                    </span>
                  </div>
                </div>

                {/* Recharts Live Benchmark chart */}
                <div className="bg-slate-950/80 border border-slate-900 p-4 rounded-2xl space-y-2">
                  <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">
                    Rendering Bottleneck Benchmarks (Frame Times)
                  </span>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorFps" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorGpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#475569" fontSize={8} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={8} tickLine={false} />
                        <Tooltip contentStyle={{ background: "#020617", border: "1px solid #1e293b", fontSize: "9px", fontFamily: "monospace" }} />
                        <Area type="monotone" dataKey="FPS" stroke="#10b981" fillOpacity={1} fill="url(#colorFps)" strokeWidth={2} />
                        <Area type="monotone" dataKey="GPU Load" stroke="#f43f5e" fillOpacity={1} fill="url(#colorGpu)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* SCRIBD RECOMMENDER PLATFORM SEGMENTATION & OCCLUSION */}
              <div className="bg-slate-900/60 border border-slate-900 rounded-3xl p-6 space-y-4 shadow-lg relative">
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 bg-indigo-500/10 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                    <Video className="text-indigo-400" size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest">
                      Real-Time Facial Segmentation &amp; Occlusion Tuning
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Perfecting geometric face alignment and absent hair masking under the Scribd framework.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900/80 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* SVG Avatar segmentation diagram */}
                  <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-850 flex items-center justify-center relative">
                    <div className="absolute top-2 left-2 text-[7px] font-mono text-slate-500 font-bold uppercase tracking-widest">
                      Diagnostic Feed
                    </div>

                    <svg className="w-28 h-28 text-indigo-400" viewBox="0 0 100 100">
                      {/* Face contour oval */}
                      <path d="M 30 40 Q 30 15 50 15 Q 70 15 70 40 Q 70 75 50 85 Q 30 75 30 40 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" />
                      
                      {/* Landmarks */}
                      <circle cx="40" cy="42" r="2.5" fill="#10b981" />
                      <circle cx="60" cy="42" r="2.5" fill="#10b981" />
                      <path d="M 45 55 Q 50 58 55 55" fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                      <line x1="50" y1="35" x2="50" y2="52" stroke="#475569" strokeWidth="1" />
                      
                      {/* Absent Hair Segmentation boundary box */}
                      <rect x="25" y="10" width="50" height="40" fill="none" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="1" />
                      <text x="50" y="8" fill="rgba(245, 158, 11, 0.8)" fontSize="6" fontFamily="monospace" textAnchor="middle">OCCLUDED ABSENT MASK</text>
                    </svg>
                  </div>

                  <div className="space-y-3 text-[9.5px]">
                    <div className="p-2.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                      <strong className="text-slate-300 uppercase tracking-widest block text-[8px] mb-1">Segmentation Accuracy:</strong>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: "93%" }} />
                        </div>
                        <span className="font-mono text-indigo-300 font-bold">93.4%</span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-900/40 border border-slate-850 rounded-xl">
                      <strong className="text-slate-300 uppercase tracking-widest block text-[8px] mb-1">Occlusion Threshold:</strong>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-teal-500 h-full rounded-full" style={{ width: "86%" }} />
                        </div>
                        <span className="font-mono text-teal-300 font-bold">86.2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900/60 leading-relaxed text-[9.5px] font-mono text-slate-400">
                  <strong className="text-indigo-400 uppercase block text-[8px] tracking-wider mb-0.5">Scribd Recommendation Alignment:</strong>
                  The Scribd Digital Framework maps the absent hair segmentation boundary dynamically around the auricle (ears) and forehead contour. By establishing high-precision occlusion paths, it ensures simulated hairstyles deform behind real shoulders rather than clipping on top.
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
