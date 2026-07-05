import { useRef, useEffect, useState } from "react";
import { Sliders, RotateCw, Eye, EyeOff, Check, X } from "lucide-react";
export const VirtualTryOn = ({
  capturedImage,
  selectedTryOnStyle,
  faceShape,
  onClose
}) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(-20);
  const [rotation, setRotation] = useState(0);
  const [opacity, setOpacity] = useState(0.85);
  const [showGuides, setShowGuides] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bgImg, setBgImg] = useState(null);
  const [hairImg, setHairImg] = useState(null);
  useEffect(() => {
    setLoading(true);
    let bgLoaded = false;
    let hairLoaded = false;
    const bg = new Image();
    bg.crossOrigin = "anonymous";
    bg.src = capturedImage;
    bg.onload = () => {
      setBgImg(bg);
      bgLoaded = true;
      if (hairLoaded) setLoading(false);
    };
    bg.onerror = () => {
      setBgImg(null);
      bgLoaded = true;
      if (hairLoaded) setLoading(false);
    };
    const hair = new Image();
    hair.crossOrigin = "anonymous";
    hair.src = selectedTryOnStyle.image;
    hair.onload = () => {
      setHairImg(hair);
      hairLoaded = true;
      if (bgLoaded) setLoading(false);
    };
    hair.onerror = () => {
      setHairImg(null);
      hairLoaded = true;
      if (bgLoaded) setLoading(false);
    };
  }, [capturedImage, selectedTryOnStyle]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    if (bgImg) {
      ctx.drawImage(bgImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#334155";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("User Portrait Loading...", width / 2, height / 2);
    }
    const landmarks = getLandmarks(faceShape || "Oval", width, height);
    if (showGuides) {
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#10b981";
      ctx.strokeStyle = "rgba(16, 185, 129, 0.45)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(landmarks.foreheadApex.x, landmarks.foreheadApex.y);
      ctx.lineTo(landmarks.leftBrow.x, landmarks.leftBrow.y);
      ctx.lineTo(landmarks.leftCheek.x, landmarks.leftCheek.y);
      ctx.lineTo(landmarks.leftJaw.x, landmarks.leftJaw.y);
      ctx.lineTo(landmarks.chinTip.x, landmarks.chinTip.y);
      ctx.lineTo(landmarks.rightJaw.x, landmarks.rightJaw.y);
      ctx.lineTo(landmarks.rightCheek.x, landmarks.rightCheek.y);
      ctx.lineTo(landmarks.rightBrow.x, landmarks.rightBrow.y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(landmarks.leftBrow.x, landmarks.leftBrow.y);
      ctx.lineTo(landmarks.rightBrow.x, landmarks.rightBrow.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(landmarks.leftCheek.x, landmarks.leftCheek.y);
      ctx.lineTo(landmarks.rightCheek.x, landmarks.rightCheek.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(landmarks.foreheadApex.x, landmarks.foreheadApex.y);
      ctx.lineTo(landmarks.noseTip.x, landmarks.noseTip.y);
      ctx.lineTo(landmarks.chinTip.x, landmarks.chinTip.y);
      ctx.stroke();
      ctx.setLineDash([]);
      Object.entries(landmarks).forEach(([key, pt]) => {
        ctx.fillStyle = "#34d399";
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
      ctx.fillRect(10, 10, 150, 24);
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.strokeRect(10, 10, 150, 24);
      ctx.fillStyle = "#34d399";
      ctx.font = "bold 9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`BIOMETRIC: ${faceShape || "OVAL"}`, 18, 25);
    }
    if (hairImg) {
      ctx.save();
      const anchor = landmarks.foreheadApex;
      const targetX = anchor.x + offsetX;
      const targetY = anchor.y + offsetY;
      ctx.translate(targetX, targetY);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.globalAlpha = opacity;
      const hairWidth = width * 0.7 * scale;
      const hairHeight = height * 0.7 * scale;
      ctx.drawImage(
        hairImg,
        -hairWidth / 2,
        -hairHeight / 2,
        hairWidth,
        hairHeight
      );
      ctx.restore();
    }
  }, [bgImg, hairImg, scale, offsetX, offsetY, rotation, opacity, showGuides, faceShape]);
  const getLandmarks = (shape, w, h) => {
    const base = {
      foreheadApex: { x: w * 0.5, y: h * 0.22 },
      leftBrow: { x: w * 0.38, y: h * 0.38 },
      rightBrow: { x: w * 0.62, y: h * 0.38 },
      noseTip: { x: w * 0.5, y: h * 0.5 },
      leftCheek: { x: w * 0.26, y: h * 0.48 },
      rightCheek: { x: w * 0.74, y: h * 0.48 },
      leftJaw: { x: w * 0.32, y: h * 0.68 },
      rightJaw: { x: w * 0.68, y: h * 0.68 },
      chinTip: { x: w * 0.5, y: h * 0.78 }
    };
    if (shape === "Round") {
      base.leftCheek = { x: w * 0.22, y: h * 0.49 };
      base.rightCheek = { x: w * 0.78, y: h * 0.49 };
      base.leftJaw = { x: w * 0.34, y: h * 0.67 };
      base.rightJaw = { x: w * 0.66, y: h * 0.67 };
      base.chinTip = { x: w * 0.5, y: h * 0.75 };
    } else if (shape === "Square") {
      base.leftBrow = { x: w * 0.34, y: h * 0.37 };
      base.rightBrow = { x: w * 0.66, y: h * 0.37 };
      base.leftJaw = { x: w * 0.28, y: h * 0.69 };
      base.rightJaw = { x: w * 0.72, y: h * 0.69 };
      base.chinTip = { x: w * 0.5, y: h * 0.77 };
    } else if (shape === "Heart") {
      base.leftBrow = { x: w * 0.32, y: h * 0.36 };
      base.rightBrow = { x: w * 0.68, y: h * 0.36 };
      base.leftJaw = { x: w * 0.36, y: h * 0.66 };
      base.rightJaw = { x: w * 0.64, y: h * 0.66 };
      base.chinTip = { x: w * 0.5, y: h * 0.81 };
    } else if (shape === "Diamond") {
      base.leftBrow = { x: w * 0.4, y: h * 0.38 };
      base.rightBrow = { x: w * 0.6, y: h * 0.38 };
      base.leftCheek = { x: w * 0.2, y: h * 0.47 };
      base.rightCheek = { x: w * 0.8, y: h * 0.47 };
      base.chinTip = { x: w * 0.5, y: h * 0.8 };
    } else if (shape === "Oblong") {
      base.foreheadApex = { x: w * 0.5, y: h * 0.17 };
      base.leftCheek = { x: w * 0.29, y: h * 0.48 };
      base.rightCheek = { x: w * 0.71, y: h * 0.48 };
      base.chinTip = { x: w * 0.5, y: h * 0.84 };
    } else if (shape === "Pear") {
      base.leftBrow = { x: w * 0.41, y: h * 0.39 };
      base.rightBrow = { x: w * 0.59, y: h * 0.39 };
      base.leftJaw = { x: w * 0.25, y: h * 0.7 };
      base.rightJaw = { x: w * 0.75, y: h * 0.7 };
      base.chinTip = { x: w * 0.5, y: h * 0.79 };
    }
    return base;
  };
  const resetControls = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(-20);
    setRotation(0);
    setOpacity(0.85);
  };
  return <div className="border border-slate-900 bg-slate-900/10 rounded-3xl overflow-hidden relative shadow-2xl p-6 space-y-6">
      
      {
    /* Visual Canvas stage */
  }
      <div className="relative aspect-square w-full bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex items-center justify-center">
        <canvas
    ref={canvasRef}
    width={400}
    height={400}
    className="w-full h-full object-cover"
  />

        {loading && <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center gap-3">
            <span className="h-7 w-7 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-xs text-slate-400 font-mono">Calibrating Biometric Simulator...</span>
          </div>}

        <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 text-[9px] text-slate-400 font-black tracking-widest uppercase">
          Live Studio Blend
        </div>
      </div>

      {
    /* Manual Try-On Control Sliders */
  }
      <div className="space-y-4 bg-slate-950/40 border border-slate-900 p-5 rounded-2xl">
        <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
          <div className="flex items-center gap-2">
            <Sliders size={14} className="text-amber-400 animate-pulse" />
            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">Calibration Sliders</span>
          </div>
          <div className="flex gap-2">
            <button
    onClick={() => setShowGuides((prev) => !prev)}
    className={`p-1.5 rounded-lg border text-xs transition-all ${showGuides ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300"}`}
    title={showGuides ? "Hide Guides" : "Show Guides"}
  >
              {showGuides ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>
            <button
    onClick={resetControls}
    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
    title="Reset Calibration"
  >
              <RotateCw size={13} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-xs font-medium">
          {
    /* Scale slider */
  }
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Hairstyle Scale</span>
              <span className="font-mono text-amber-400">{scale.toFixed(2)}x</span>
            </div>
            <input
    type="range"
    min="0.5"
    max="1.6"
    step="0.01"
    value={scale}
    onChange={(e) => setScale(parseFloat(e.target.value))}
    className="w-full accent-amber-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
  />
          </div>

          {
    /* Opacity slider */
  }
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Blend Opacity</span>
              <span className="font-mono text-amber-400">{Math.round(opacity * 100)}%</span>
            </div>
            <input
    type="range"
    min="0.2"
    max="1.0"
    step="0.05"
    value={opacity}
    onChange={(e) => setOpacity(parseFloat(e.target.value))}
    className="w-full accent-amber-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
  />
          </div>

          {
    /* X offset slider */
  }
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Horizontal Shift (X)</span>
              <span className="font-mono text-amber-400">{offsetX}px</span>
            </div>
            <input
    type="range"
    min="-120"
    max="120"
    step="1"
    value={offsetX}
    onChange={(e) => setOffsetX(parseInt(e.target.value))}
    className="w-full accent-amber-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
  />
          </div>

          {
    /* Y offset slider */
  }
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Vertical Shift (Y)</span>
              <span className="font-mono text-amber-400">{offsetY}px</span>
            </div>
            <input
    type="range"
    min="-150"
    max="100"
    step="1"
    value={offsetY}
    onChange={(e) => setOffsetY(parseInt(e.target.value))}
    className="w-full accent-amber-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
  />
          </div>

          {
    /* Rotation slider */
  }
          <div className="col-span-1 sm:col-span-2 space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <span>Hairstyle Rotation</span>
              <span className="font-mono text-amber-400">{rotation}°</span>
            </div>
            <input
    type="range"
    min="-60"
    max="60"
    step="1"
    value={rotation}
    onChange={(e) => setRotation(parseInt(e.target.value))}
    className="w-full accent-amber-500 cursor-ew-resize bg-slate-900 h-1.5 rounded-lg appearance-none"
  />
          </div>
        </div>

        <div className="pt-2 text-[9.5px] text-slate-500 leading-relaxed font-mono">
          🚀 <strong className="text-slate-400">Pro-Tip:</strong> Align the green guide points with your hairline, cheek contours, and eyebrows, then use the sliders to stretch or rotate the hairstyle overlay into natural position!
        </div>
      </div>

      <div className="flex gap-2.5">
        <button
    onClick={onClose}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold transition-all"
  >
          <X size={13} /> Close Studio
        </button>
        <button
    onClick={onClose}
    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-md"
  >
          <Check size={13} /> Lock Portrait
        </button>
      </div>

    </div>;
};
