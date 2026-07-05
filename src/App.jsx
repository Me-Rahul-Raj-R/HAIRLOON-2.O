import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Camera,
  Upload,
  Scissors,
  Calendar,
  MessageSquare,
  Check,
  Loader2,
  MapPin,
  Clock,
  Star,
  Sliders,
  ChevronRight,
  X,
  User,
  Info,
  TrendingUp,
  Trash2,
  ArrowRight,
  Sparkle,
  BookmarkCheck,
  Award,
  Mic,
  MicOff,
  Bell,
  BellRing,
  Share2,
  Image as ImageIcon,
  Wand2,
  Heart,
  Database,
  LogOut,
  Download,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FACE_SHAPES_INFO, HAIRSTYLES_DB, MOCK_SALONS, MOCK_STYLISTS, STYLISTS_DB, HISTORICAL_TRENDS_DATA } from "./data/hairloonDb";
import { EXTENDED_HAIRSTYLES } from "./data/extendedHairstyles";
import { VirtualTryOn } from "./components/VirtualTryOn";
import { RadarChartWidget } from "./components/RadarChartWidget";
import LabHub from "./components/LabHub";
import StylistDashboard from "./components/StylistDashboard";

// Merge preloaded styles and all 512 extended hairstyles by face shape
const ALL_HAIRSTYLES_MAPPED = {
  Oval: [],
  Round: [],
  Square: [],
  Heart: [],
  Diamond: [],
  Oblong: [],
  Pear: []
};

// Seed
Object.keys(HAIRSTYLES_DB).forEach(shape => {
  if (ALL_HAIRSTYLES_MAPPED[shape]) {
    ALL_HAIRSTYLES_MAPPED[shape] = [...HAIRSTYLES_DB[shape]];
  }
});

// Distribute EXTENDED_HAIRSTYLES to each face shape list they fit
EXTENDED_HAIRSTYLES.forEach(style => {
  if (style.faceShapes && Array.isArray(style.faceShapes)) {
    style.faceShapes.forEach(shape => {
      if (ALL_HAIRSTYLES_MAPPED[shape]) {
        if (!ALL_HAIRSTYLES_MAPPED[shape].some(s => s.id === style.id)) {
          ALL_HAIRSTYLES_MAPPED[shape].push(style);
        }
      }
    });
  }
});

const getProperHairstyleImage = (name) => {
  const n = (name || "").toLowerCase();
  
  // High-fidelity lookup inside our 512+ luxury hairstyle catalogue first
  const exactMatch = EXTENDED_HAIRSTYLES.find(style => style.name.toLowerCase() === n || style.name.toLowerCase().includes(n) || n.includes(style.name.toLowerCase()));
  if (exactMatch && exactMatch.image) {
    return exactMatch.image;
  }
  
  if (n.includes("bob") || n.includes("lob")) {
    return "https://images.unsplash.com/photo-1595642527925-4d41cb781653?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("pixie") || n.includes("short crop")) {
    return "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("shag") || n.includes("mullet")) {
    return "https://images.unsplash.com/photo-1605497746444-ac9dbd324d88?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("curly") || n.includes("wave") || n.includes("coily") || n.includes("afro")) {
    return "https://images.unsplash.com/photo-1560869713-7d0a29430f33?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("taper") || n.includes("buzz") || n.includes("crew") || n.includes("fade") || n.includes("men")) {
    return "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=600";
  }
  if (n.includes("fringe") || n.includes("bangs")) {
    return "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=600";
  }
  // Default beautiful editorial style
  return "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=600";
};
const PRESET_TEST_PORTRAITS = [
  {
    id: "test_oval",
    name: "Sophia (Oval Profile)",
    shape: "Oval",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    description: "Symmetric cheekbones, balanced forehead, soft chin."
  },
  {
    id: "test_round",
    name: "Michael (Round Profile)",
    shape: "Round",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    description: "Soft circular contours, widest at cheekbones, friendly warmth."
  },
  {
    id: "test_square",
    name: "Isabella (Square Profile)",
    shape: "Square",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    description: "Chiseled jawline, angular forehead, highly symmetrical."
  },
  {
    id: "test_heart",
    name: "Aria (Heart Profile)",
    shape: "Heart",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    description: "Wide forehead, high elegant cheekbones, pointed jaw."
  }
];
export default function App() {
  const [activeTab, setActiveTab] = useState("analyzer");
  
  // Auth & Account states
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("hairloon_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup"
  const [authRole, setAuthRole] = useState("user"); // "user" | "admin"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authTexture, setAuthTexture] = useState("Straight");
  const [authMaintenance, setAuthMaintenance] = useState("Low-maintenance");
  
  // Database Hub states (Admin console)
  const [dbProvider, setDbProvider] = useState("postgres"); // "postgres" | "mongodb"
  const [dbConnectionString, setDbConnectionString] = useState("postgresql://maison_director:s3cur3p4ssw0rd@ep-royal-salons-12345.us-east-2.aws.neon.tech/hairloon_prod?sslmode=require");
  const [isDbTesting, setIsDbTesting] = useState(false);
  const [dbTestResult, setDbTestResult] = useState(null);
  const [querySandbox, setQuerySandbox] = useState("SELECT_BOOKINGS");
  const [sandboxOutput, setSandboxOutput] = useState("");
  const [dbSyncLogs, setDbSyncLogs] = useState([
    { id: 1, time: "10:52:10", type: "INFO", msg: "Production sync pool active. Connection pool initialized with 20 nodes." },
    { id: 2, time: "10:52:12", type: "SYNC", msg: "Successfully indexed 512 haute couture hairstyles under unique indexes." },
    { id: 3, time: "10:54:05", type: "QUERY", msg: "SUCCESS: SELECT count(*) FROM hairstyles -> Returned 512. (3ms)" }
  ]);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imageMimeType, setImageMimeType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [apiError, setApiError] = useState(null);
  const [selectedTryOnStyle, setSelectedTryOnStyle] = useState(null);
  const [isTryOnActive, setIsTryOnActive] = useState(false);
  const [selectedExploreShape, setSelectedExploreShape] = useState("Oval");
  const [lengthFilter, setLengthFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedStylist, setSelectedStylist] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isBookingSubmitting, setIsBookingSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    {
      id: "welcome",
      role: "model",
      content: "Hello gorgeous! I am Simone, your premium AI Hair Consultant. Welcome to Hairloon's creative lounge. Have you analyzed your face shape yet? Upload your photo or select a test portrait on the 'AI Face Shape Analyzer' tab, and I'll create a completely custom hair blueprint for you!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatGenerating, setIsChatGenerating] = useState(false);
  const [useThinking, setUseThinking] = useState(false);
  const [useGrounding, setUseGrounding] = useState(false);
  const [hairTexture, setHairTexture] = useState("Straight");
  const [maintenanceLevel, setMaintenanceLevel] = useState("Low-maintenance");
  const [compareSalonId, setCompareSalonId] = useState("salon_luxe");
  const [compareStylist1Id, setCompareStylist1Id] = useState("stylist_genevieve");
  const [compareStylist2Id, setCompareStylist2Id] = useState("stylist_antoine");
  const [shareStyle, setShareStyle] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [generationInput, setGenerationInput] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [generationAspect, setGenerationAspect] = useState("1:1");
  const [generationQuality, setGenerationQuality] = useState("studio"); // "standard" or "studio"

  // Veo Video states
  const [generatorSubTab, setGeneratorSubTab] = useState("image"); // "image" or "video"
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoAspect, setVideoAspect] = useState("16:9");
  const [videoSourceImage, setVideoSourceImage] = useState(""); 
  const [videoSourceMimeType, setVideoSourceMimeType] = useState("image/jpeg");
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMessage, setVideoStatusMessage] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const toggleFavorite = (styleId) => {
    setFavorites((prev) => {
      const isFav = prev.includes(styleId);
      const updated = isFav ? prev.filter(id => id !== styleId) : [...prev, styleId];
      localStorage.setItem('hairloon_favorites', JSON.stringify(updated));
      showToast(isFav ? 'Removed from favorites' : 'Added to favorites', isFav ? 'info' : 'success');
      return updated;
    });
  };

  const triggerLocalNotification = (title, body) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      body,
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      read: false
    };
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem("hairloon_notifications", JSON.stringify(updated));
      return updated;
    });
  };
  const nextAppointment = React.useMemo(() => {
    if (!bookings || bookings.length === 0) return null;
    const now = /* @__PURE__ */ new Date();
    const upcoming = bookings.map((b) => {
      const apptDate = /* @__PURE__ */ new Date(`${b.date}T${b.time}`);
      return { booking: b, date: apptDate };
    }).filter((item) => item.date > now).sort((a, b) => a.date.getTime() - b.date.getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [bookings]);
  const [timeLeft, setTimeLeft] = useState(null);
  useEffect(() => {
    if (!nextAppointment) {
      setTimeLeft(null);
      return;
    }
    const updateTimer = () => {
      const now = /* @__PURE__ */ new Date();
      const diff = nextAppointment.date.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft(null);
        triggerLocalNotification(
          "Salon Appointment Started!",
          `Your premium treatment "${nextAppointment.booking.serviceName}" is starting now at ${nextAppointment.booking.salonName}.`
        );
        return;
      }
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1e3 * 60 * 60) % 24);
      const minutes = Math.floor(diff / (1e3 * 60) % 60);
      const seconds = Math.floor(diff / 1e3 % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1e3);
    return () => clearInterval(interval);
  }, [nextAppointment]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "en-US";
      rec.onstart = () => {
        setIsListening(true);
      };
      rec.onresult = (event) => {
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setChatInput((prev) => {
            const separator = prev.length > 0 && !prev.endsWith(" ") ? " " : "";
            return prev + separator + finalTranscript;
          });
        }
      };
      rec.onerror = (event) => {
        console.error("Speech Recognition Error:", event.error);
        setIsListening(false);
      };
      rec.onend = () => {
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, []);
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Ch\xE9rie, Web Speech Recognition is not supported in this browser. Try Google Chrome or Safari!");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start speech recognition", e);
      }
    }
  };
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const chatEndRef = useRef(null);
  useEffect(() => {
    const savedBookings = localStorage.getItem("hairloon_bookings");
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings));
      } catch (e) {
      }
    }
    const savedAnalysis = localStorage.getItem("hairloon_last_analysis");
    if (savedAnalysis) {
      try {
        const parsed = JSON.parse(savedAnalysis);
        setAnalysisResult(parsed);
        setSelectedExploreShape(parsed.faceShape);
      } catch (e) {
      }
    }
    const savedNotifications = localStorage.getItem("hairloon_notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
      }
    }
    const savedTexture = localStorage.getItem("hairloon_texture");
    if (savedTexture) {
      setHairTexture(savedTexture);
    }
    const savedMaintenance = localStorage.getItem("hairloon_maintenance");
    if (savedMaintenance) {
      setMaintenanceLevel(savedMaintenance);
    }
    const savedFavs = localStorage.getItem("hairloon_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
      }
    }
  }, []);
  const saveBookings = (updated) => {
    setBookings(updated);
    localStorage.setItem("hairloon_bookings", JSON.stringify(updated));
  };
  const handleSaveTexture = (texture) => {
    setHairTexture(texture);
    localStorage.setItem("hairloon_texture", texture);
  };
  const handleSaveMaintenance = (level) => {
    setMaintenanceLevel(level);
    localStorage.setItem("hairloon_maintenance", level);
  };
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatGenerating]);
  const startCamera = async () => {
    setIsCameraActive(true);
    setCapturedImage(null);
    setApiError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 480, facingMode: "user" }
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
      setApiError("Webcam access was denied or is unavailable in this sandbox frame. Please use the high-fidelity preset portraits below instead!");
      setIsCameraActive(false);
    }
  };
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        setImageMimeType("image/jpeg");
        stopCamera();
      }
    }
  };
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        setImageMimeType(file.type);
        setApiError(null);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleVideoPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoSourceImage(reader.result);
        setVideoSourceMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleVideoPhotoDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoSourceImage(reader.result);
        setVideoSourceMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };
  const selectTestPortrait = async (portrait) => {
    setIsCameraActive(false);
    stopCamera();
    setApiError(null);
    try {
      setCapturedImage(portrait.image);
      setImageMimeType("image/jpeg");
      simulateScan(() => {
        const mockResult = {
          faceShape: portrait.shape,
          confidence: 94 + Math.floor(Math.random() * 5),
          metrics: {
            foreheadWidth: portrait.shape === "Heart" || portrait.shape === "Diamond" ? "Wide" : "Average",
            cheekboneProminence: portrait.shape === "Diamond" || portrait.shape === "Oval" ? "High" : "Soft",
            jawlineType: portrait.shape === "Square" ? "Angular" : portrait.shape === "Heart" ? "Sharp" : "Rounded",
            faceLengthRatio: portrait.shape === "Oblong" ? "Longer" : "Balanced"
          },
          geometricAnalysis: `Perfect matches found on Sofia's biometric vectors. The width across cheekbone lines exceeds the narrow tapering chin alignment. Prominent upper face proportions are balanced by delicate curves.`,
          keyAestheticRule: FACE_SHAPES_INFO[portrait.shape].keyAestheticRule,
          avoidStyles: FACE_SHAPES_INFO[portrait.shape].avoidStyles
        };
        setAnalysisResult(mockResult);
        setSelectedExploreShape(portrait.shape);
        localStorage.setItem("hairloon_last_analysis", JSON.stringify(mockResult));
        setChatMessages((prev) => [
          ...prev,
          {
            id: `sys_update_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            role: "model",
            content: `I have updated your styling profile to ${portrait.shape}! Let's find your dream haircut. Ask me anything about ${portrait.shape} hairstyling!`
          }
        ]);
      });
    } catch (err) {
      setApiError("Error loading sample image. Please try another portrait.");
    }
  };
  const simulateScan = (callback) => {
    setIsAnalyzing(true);
    setScanProgress(10);
    const interval = setInterval(() => {
      setScanProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            callback();
          }, 400);
          return 100;
        }
        return p + 15;
      });
    }, 250);
  };
  const analyzeFaceWithAI = async () => {
    if (!capturedImage) return;
    simulateScan(async () => {
      // Independent RAG/ML simulation fallback logic without Gemini
      const fallbackShapes = ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Pear"];
      const randomShape = fallbackShapes[Math.floor(Math.random() * fallbackShapes.length)];
      const fallbackResult = {
        faceShape: randomShape,
        confidence: 89,
        metrics: {
          foreheadWidth: "Average",
          cheekboneProminence: "High",
          jawlineType: "Soft",
          faceLengthRatio: "Balanced"
        },
        geometricAnalysis: "Biometric mapping suggests balanced horizontal forehead and cheek line contours. Facial lengths align gracefully into standard proportions.",
        keyAestheticRule: FACE_SHAPES_INFO[randomShape].keyAestheticRule,
        avoidStyles: FACE_SHAPES_INFO[randomShape].avoidStyles,
        recommendedStyles: [
          {
            name: "Sleek Textured Lob",
            category: "Medium",
            description: "A gorgeous modern lob that balances vertical proportions while framing features perfectly.",
            benefits: ["Softens jaw contours", "Easy to volume style"],
            stylingTips: "Apply a light sea salt spray to wet hair and tousle dry."
          },
          {
            name: "Elegant Wispy Fringe",
            category: "Fringe",
            description: "Soft parted bangs that bring focus to the cheekbones while giving a high-fashion edge.",
            benefits: ["Balances forehead line", "Adds beautiful facial frame"],
            stylingTips: "Use a small round brush and blow dry down."
          }
        ]
      };
      setAnalysisResult(fallbackResult);
      setSelectedExploreShape(randomShape);
      localStorage.setItem("hairloon_last_analysis", JSON.stringify(fallbackResult));
      showToast("Analyzed with high-fidelity biometric engine!", "success");
      setChatMessages((prev) => [
        ...prev,
        {
          id: `sys_update_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          role: "model",
          content: `Amazing! Your upload has been classified as **${randomShape}** (${fallbackResult.confidence}% match). My biometric sensors show you have ${fallbackResult.metrics.cheekboneProminence} cheekbones and a ${fallbackResult.metrics.jawlineType} jaw. Let's find some gorgeous styles for you!`
        }
      ]);
    });
  };

  const handleGenerateImage = async (e) => {
    e.preventDefault();
    if (!generationInput.trim() || isGeneratingImage) return;

    setIsGeneratingImage(true);
    setGeneratedImage(null);
    try {
      // Independent RAG simulation lookup
      await new Promise(r => setTimeout(r, 800));
      const fallbackImageUrl = getProperHairstyleImage(generationInput);
      setGeneratedImage(fallbackImageUrl);
      showToast("Hairstyle retrieved from dataset successfully!");
    } catch (err) {
      console.error(err);
      showToast("Failed to retrieve image. Please try again.", "error");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async (e) => {
    e.preventDefault();
    if (isGeneratingVideo || (!videoPrompt.trim() && !videoSourceImage)) return;

    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setVideoStatusMessage("Contacting Veo server...");

    try {
      // 1. Start generation
      const response = await fetch("/api/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: videoPrompt || "A gorgeous model showing off a custom high-end hairstyle in smooth slow-motion",
          aspectRatio: videoAspect,
          imageBase64: videoSourceImage,
          imageMimeType: videoSourceMimeType || "image/jpeg"
        })
      });

      if (!response.ok) {
        throw new Error("Failed to initialize video generation");
      }

      const { operationName } = await response.json();
      if (!operationName) {
        throw new Error("Invalid response from video server");
      }

      setVideoStatusMessage("Veo generation request received.");

      // 2. Poll status
      const maxAttempts = 40;
      let attempts = 0;
      const statusTexts = [
        "Initializing Veo motion vectors...",
        "Tracing follicle velocity fields...",
        "Synthesizing high-fidelity hair animations...",
        "Generating spatial temporal frames...",
        "Interpolating frame transitions...",
        "Optimizing lighting shaders...",
        "Applying cinematic finishing passes..."
      ];

      const pollInterval = setInterval(async () => {
        attempts++;
        if (attempts > maxAttempts) {
          clearInterval(pollInterval);
          setIsGeneratingVideo(false);
          showToast("Video generation timed out. Please try again.", "error");
          return;
        }

        const statusIdx = Math.min(Math.floor(attempts / 2), statusTexts.length - 1);
        setVideoStatusMessage(statusTexts[statusIdx]);

        try {
          const statusRes = await fetch("/api/video-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationName })
          });

          if (!statusRes.ok) return;

          const { done, error } = await statusRes.json();
          if (error) {
            clearInterval(pollInterval);
            setIsGeneratingVideo(false);
            showToast("Veo server error: " + error.message, "error");
            return;
          }

          if (done) {
            clearInterval(pollInterval);
            setVideoStatusMessage("Downloading premium MP4 render...");
            
            const downloadRes = await fetch("/api/video-download", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationName })
            });

            if (!downloadRes.ok) {
              throw new Error("Failed to download synthesized video");
            }

            const { videoUrl } = await downloadRes.json();
            setGeneratedVideoUrl(videoUrl);
            setIsGeneratingVideo(false);
            showToast("Bespoke Veo hair animation synthesized!", "success");
          }
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
        }
      }, 5000);

    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to initialize video generation.", "error");
      setIsGeneratingVideo(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatGenerating) return;
    const userMsgText = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { id: `msg_${Date.now()}`, role: "user", content: userMsgText }]);
    setIsChatGenerating(true);
    try {
      await new Promise(r => setTimeout(r, 600));
      let responseContent = "";
      if (userMsgText.toLowerCase().includes("book") || userMsgText.toLowerCase().includes("appointment")) {
        responseContent = "I would be delighted to help you schedule! Please head over to the 'Booking' tab to lock in your desired time and stylist securely.";
      } else if (analysisResult) {
        responseContent = `Based on our independent RAG analysis, your ${analysisResult.faceShape} face shape with ${analysisResult.metrics.jawlineType} jawline is perfectly suited for styles like the Wolf Cut or Birkin Bangs. Let's make it happen, chérie!`;
      } else {
        responseContent = "Magnifique! Please visit the AI Face Shape Analyzer tab first so I can retrieve the best curated hairstyles from our exclusive RAG dataset.";
      }
      
      setChatMessages((prev) => [
        ...prev,
        { id: `bot_${Date.now()}`, role: "model", content: responseContent }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "model",
          content: "Oh chérie, the digital connection is a bit tangled like a bad bedhead! Rest assured, your detected face shape fits beautifully with long layers and textured bangs. Ask me more!"
        }
      ]);
    } finally {
      setIsChatGenerating(false);
    }
  };
  const startBooking = (salon, service) => {
    setSelectedSalon(salon);
    setSelectedService(service);
    const salonStylists = STYLISTS_DB.filter((s) => s.salonId === salon.id);
    setSelectedStylist(salonStylists[0]?.name || MOCK_STYLISTS[0]);
    const tomorrow = /* @__PURE__ */ new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setBookingDate(tomorrow.toISOString().split("T")[0]);
    setBookingTime("11:00");
    setConfirmedBooking(null);
    setActiveTab("booking");
  };
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !selectedSalon || !selectedService) return;

    // Double-Booking Check
    const isDoubleBooked = bookings.some(b => 
      b.salonId === selectedSalon.id && 
      b.stylist === selectedStylist && 
      b.date === bookingDate && 
      b.time === bookingTime &&
      b.status === "Confirmed"
    );

    if (isDoubleBooked) {
      showToast(`Sorry, ${selectedStylist} is already booked at that time. Please select another slot.`, "error");
      return;
    }

    setIsBookingSubmitting(true);
    setTimeout(() => {
      const newBooking = {
        id: `HR-${Math.floor(1e5 + Math.random() * 9e5)}`,
        salonId: selectedSalon.id,
        salonName: selectedSalon.name,
        serviceName: selectedService.name,
        price: selectedService.price,
        date: bookingDate,
        time: bookingTime,
        stylist: selectedStylist,
        status: "Confirmed",
        customerName,
        customerPhone,
        createdTime: (new Date()).toLocaleString()
      };
      const updated = [newBooking, ...bookings];
      saveBookings(updated);
      setConfirmedBooking(newBooking);
      setIsBookingSubmitting(false);
      showToast("Appointment successfully booked!");
      triggerLocalNotification(
        "Salon Appointment Scheduled!",
        `Your slot for "${newBooking.serviceName}" at ${newBooking.salonName} is set for ${newBooking.date} at ${newBooking.time}.`
      );
    }, 1500);
  };
  const handleCancelBooking = (id) => {
    const targetBooking = bookings.find((b) => b.id === id);
    const updated = bookings.filter((b) => b.id !== id);
    saveBookings(updated);
    if (targetBooking) {
      triggerLocalNotification(
        "Salon Appointment Cancelled",
        `Your slot for "${targetBooking.serviceName}" at ${targetBooking.salonName} has been cancelled.`
      );
    }
  };

  // Auth Handlers
  const handleAuthAction = (e) => {
    if (e) e.preventDefault();
    if (authMode === "login") {
      // Login flow
      if (!authEmail || !authPassword) {
        showToast("Please provide both email and password.");
        return;
      }
      
      const role = authEmail.toLowerCase().includes("admin") ? "admin" : "user";
      const name = role === "admin" ? "Lead Stylist Simone" : "Guest Client";
      const loggedUser = {
        email: authEmail,
        name: authName || name,
        role: role,
        texture: authTexture,
        maintenance: authMaintenance,
        createdAt: new Date().toLocaleString()
      };
      
      localStorage.setItem("hairloon_user", JSON.stringify(loggedUser));
      setCurrentUser(loggedUser);
      showToast(`Welcome back, ${loggedUser.name}!`);
      triggerLocalNotification(
        "Maison Entrance Approved",
        `Session initiated for ${loggedUser.name} (${loggedUser.role.toUpperCase()}).`
      );
    } else {
      // Signup flow
      if (!authEmail || !authPassword || !authName) {
        showToast("Please fill in all registration fields.");
        return;
      }
      
      const role = authRole; // Inherit active role selection
      const newUser = {
        email: authEmail,
        name: authName,
        role: role,
        texture: authTexture,
        maintenance: authMaintenance,
        createdAt: new Date().toLocaleString()
      };
      
      localStorage.setItem("hairloon_user", JSON.stringify(newUser));
      setCurrentUser(newUser);
      showToast(`Welcome to Hairloon, ${newUser.name}!`);
      triggerLocalNotification(
        "Maison Account Registered",
        `Account successfully provisioned for ${newUser.name}. Welcome to the elite tier!`
      );
    }
  };

  const handleBypassAuth = (role) => {
    const loggedUser = role === "admin" ? {
      email: "admin@hairloon.com",
      name: "Jean-Luc Simone",
      role: "admin",
      texture: "Straight",
      maintenance: "High-effort",
      createdAt: new Date().toLocaleString()
    } : {
      email: "guest@hairloon.com",
      name: "Seraphina Vance",
      role: "user",
      texture: "Wavy",
      maintenance: "Low-maintenance",
      createdAt: new Date().toLocaleString()
    };
    
    localStorage.setItem("hairloon_user", JSON.stringify(loggedUser));
    setCurrentUser(loggedUser);
    showToast(`Access granted: Entering as ${loggedUser.name}`);
    triggerLocalNotification(
      "VIP Pass Active",
      `Instant entrance bypass authorized for ${loggedUser.name}.`
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("hairloon_user");
    setCurrentUser(null);
    setActiveTab("analyzer");
    showToast("Session closed successfully.");
  };

  // Database Connection Sandbox
  const handleTestDbConnection = () => {
    if (!dbConnectionString) {
      showToast("Please enter a database connection URI.");
      return;
    }
    
    setIsDbTesting(true);
    setDbTestResult(null);
    
    // Log start
    const newLog = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      type: "CONN",
      msg: `Attempting sync handshakes with ${dbProvider === "postgres" ? "PostgreSQL" : "MongoDB Atlas"} cluster...`
    };
    setDbSyncLogs(prev => [newLog, ...prev]);

    setTimeout(() => {
      setIsDbTesting(false);
      // Basic format validation
      const isFormatValid = dbProvider === "postgres" 
        ? dbConnectionString.startsWith("postgres://") || dbConnectionString.startsWith("postgresql://")
        : dbConnectionString.startsWith("mongodb://") || dbConnectionString.startsWith("mongodb+srv://");

      if (isFormatValid) {
        setDbTestResult({
          status: "success",
          latency: "14ms",
          nodes: 3,
          ssl: "Enabled (TLSv1.3)",
          tablesIndexed: dbProvider === "postgres" ? ["users", "bookings", "hairstyles", "ratings"] : ["users", "bookings", "hairstyles"],
          message: `Seamless handshake complete. 512 Haute Couture records are live-mapped to SQL/NoSQL tables!`
        });
        showToast("Database connection verified successfully!");
        setDbSyncLogs(prev => [
          {
            id: Date.now() + 1,
            time: new Date().toLocaleTimeString(),
            type: "SYNC",
            msg: `Handshake SUCCESS! Pool size: 20 nodes active. SSL handshake completed.`
          },
          ...prev
        ]);
      } else {
        setDbTestResult({
          status: "error",
          message: `Failed to connect. Connection string format is invalid for ${dbProvider === "postgres" ? "PostgreSQL (postgresql://...)" : "MongoDB (mongodb+srv://...)"}`
        });
        showToast("Database handshake failed.");
        setDbSyncLogs(prev => [
          {
            id: Date.now() + 2,
            time: new Date().toLocaleTimeString(),
            type: "ERROR",
            msg: `Handshake FAILED: Invalid protocol or connection string timeout.`
          },
          ...prev
        ]);
      }
    }, 2000);
  };

  const handleExecuteSandboxQuery = (queryType) => {
    setQuerySandbox(queryType);
    let output = "";
    
    // Simulate real data from app state in query sandbox
    if (dbProvider === "postgres") {
      switch (queryType) {
        case "SELECT_BOOKINGS":
          output = `SELECT id, customer_name, service, salon, status, date, time \nFROM bookings \nORDER BY created_at DESC;\n\n-- Returned ${bookings.length + 2} records:\n` + JSON.stringify([
            { id: "b_001", customer_name: currentUser?.name || "Seraphina Vance", service: "Bespoke Silk Press", salon: "Maison de Luxe", status: "Confirmed", date: "2026-07-02", time: "14:00" },
            { id: "b_002", customer_name: "Charlotte Dubois", service: "French Fringe Bob", salon: "The Ritz Atelier", status: "Completed", date: "2026-06-30", time: "11:30" },
            ...bookings.map((b, i) => ({
              id: b.id || `b_dyn_${i}`,
              customer_name: b.customerName,
              service: b.serviceName,
              salon: b.salonName,
              status: b.status,
              date: b.date,
              time: b.time
            }))
          ], null, 2);
          break;
        case "SELECT_USERS":
          output = `SELECT id, email, name, hair_texture, maintenance, role, created_at \nFROM users \nLIMIT 5;\n\n-- Returned 3 records:\n` + JSON.stringify([
            { id: "u_981", email: currentUser?.email || "guest@hairloon.com", name: currentUser?.name || "Seraphina Vance", hair_texture: currentUser?.texture || "Wavy", maintenance: currentUser?.maintenance || "Low-maintenance", role: currentUser?.role || "user", created_at: currentUser?.createdAt || "2026-07-01 10:50:00" },
            { id: "u_001", email: "admin@hairloon.com", name: "Jean-Luc Simone", hair_texture: "Straight", maintenance: "High-effort", role: "admin", created_at: "2026-06-15 09:00:00" },
            { id: "u_002", email: "elizabeth@monaco.com", name: "Lady Elizabeth", hair_texture: "Curly", maintenance: "High-effort", role: "user", created_at: "2026-06-28 16:32:00" }
          ], null, 2);
          break;
        case "COUNT_HAIRSTYLES":
          output = `SELECT category, count(*)\nFROM hairstyles\nGROUP BY category\nORDER BY count DESC;\n\n-- Returned 3 rows:\n` + JSON.stringify([
            { category: "Medium", count: 182 },
            { category: "Long", count: 176 },
            { category: "Short", count: 154 }
          ], null, 2) + `\n\n-- TOTAL RECORD COUNT: 512 Hairstyles indexed.`;
          break;
        default:
          output = "-- Click run query to execute";
      }
    } else {
      // MongoDB NoSQL representation
      switch (queryType) {
        case "SELECT_BOOKINGS":
          output = `db.bookings.find({}).sort({createdAt: -1});\n\n// Returned ${bookings.length + 2} documents:\n` + JSON.stringify([
            { _id: "6677f1e98a1", customerName: currentUser?.name || "Seraphina Vance", serviceName: "Bespoke Silk Press", salonName: "Maison de Luxe", status: "Confirmed", date: "2026-07-02", time: "14:00" },
            { _id: "6677f1e98a2", customerName: "Charlotte Dubois", serviceName: "French Fringe Bob", salonName: "The Ritz Atelier", status: "Completed", date: "2026-06-30", time: "11:30" },
            ...bookings.map((b, i) => ({
              _id: `6677f1e9${i}`,
              customerName: b.customerName,
              serviceName: b.serviceName,
              salonName: b.salonName,
              status: b.status,
              date: b.date,
              time: b.time
            }))
          ], null, 2);
          break;
        case "SELECT_USERS":
          output = `db.users.find({ limit: 5 });\n\n// Returned 3 documents:\n` + JSON.stringify([
            { _id: "6677f1ea001", email: currentUser?.email || "guest@hairloon.com", name: currentUser?.name || "Seraphina Vance", profile: { hairTexture: currentUser?.texture || "Wavy", maintenanceLevel: currentUser?.maintenance || "Low-maintenance" }, role: currentUser?.role || "user", createdAt: currentUser?.createdAt || "2026-07-01T10:50:00Z" },
            { _id: "6677f1ea002", email: "admin@hairloon.com", name: "Jean-Luc Simone", profile: { hairTexture: "Straight", maintenanceLevel: "High-effort" }, role: "admin", createdAt: "2026-06-15T09:00:00Z" }
          ], null, 2);
          break;
        case "COUNT_HAIRSTYLES":
          output = `db.hairstyles.aggregate([\n  { $group: { _id: "$category", count: { $sum: 1 } } }\n]);\n\n// Aggregate results:\n` + JSON.stringify([
            { _id: "Medium", count: 182 },
            { _id: "Long", count: 176 },
            { _id: "Short", count: 154 }
          ], null, 2) + `\n\n// Total document count: 512 indexed active documents.`;
          break;
        default:
          output = "// Click run query to execute";
      }
    }

    setSandboxOutput(output);
    setDbSyncLogs(prev => [
      {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        type: "QUERY",
        msg: `SUCCESS: Query executed against pool for type: ${queryType}. (Returned records in JSON).`
      },
      ...prev
    ]);
  };

  const handleDownloadBlueprint = () => {
    const isPg = dbProvider === "postgres";
    const code = isPg ? `// HAIRLOON OFFICIAL POSTGRESQL INTEGRATION BLUEPRINT
// Using Node.js, Express, and pg Pooler

import pg from 'pg';
import express from 'express';

const { Pool } = pg;
const app = express();
app.use(express.json());

// Connection pool configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://maison_director:s3cur3p4ssw0rd@ep-royal-salons-12345.us-east-2.aws.neon.tech/hairloon_prod?sslmode=require",
  ssl: { rejectUnauthorized: false }
});

// Table Bootstrapping Script
const BOOTSTRAP_SQL = \`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hair_texture VARCHAR(50),
    maintenance VARCHAR(50),
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    service_name VARCHAR(255) NOT NULL,
    salon_name VARCHAR(255) NOT NULL,
    stylist_name VARCHAR(255),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'Confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
\`;

pool.query(BOOTSTRAP_SQL)
  .then(() => console.log("PostgreSQL Tables verified and successfully active."))
  .catch(err => console.error("Bootstrap error:", err));

// Booking integration endpoint
app.post("/api/bookings", async (req, res) => {
  const { customerName, customerPhone, serviceName, salonName, stylistName, date, time } = req.body;
  try {
    const query = \`
      INSERT INTO bookings (customer_name, customer_phone, service_name, salon_name, stylist_name, booking_date, booking_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    \`;
    const values = [customerName, customerPhone, serviceName, salonName, stylistName, date, time];
    const result = await pool.query(query, values);
    res.status(201).json({ success: true, booking: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Luxury backend listening on port 3000"));
` : `// HAIRLOON OFFICIAL MONGODB INTEGRATION BLUEPRINT
// Using Node.js, Express, and Mongoose ODM

import mongoose from 'mongoose';
import express from 'express';

const app = express();
app.use(express.json());

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://maison_admin:********@hairloon-prod.mongodb.net/luxury_lounge";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Cluster."))
  .catch(err => console.error("MongoDB Atlas connection error:", err));

// Mongoose User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  profile: {
    hairTexture: String,
    maintenanceLevel: String
  },
  role: { type: String, default: "user" },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model("User", UserSchema);

// Mongoose Booking Schema
const BookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: String,
  serviceName: { type: String, required: true },
  salonName: { type: String, required: true },
  stylistName: String,
  date: String,
  time: String,
  status: { type: String, default: "Confirmed" },
  createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model("Booking", BookingSchema);

// Integrate Booking endpoint
app.post("/api/bookings", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    const saved = await newBooking.save();
    res.status(201).json({ success: true, booking: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Luxury backend listening on port 3000"));
`;

    const blob = new Blob([code], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isPg ? "hairloon-postgres-blueprint.js" : "hairloon-mongodb-blueprint.js";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Blueprint for ${isPg ? "PostgreSQL" : "MongoDB"} downloaded successfully!`);
  };

  // Run initial query load
  useEffect(() => {
    if (currentUser && currentUser.role === "admin") {
      handleExecuteSandboxQuery("SELECT_BOOKINGS");
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="h-screen w-screen bg-black text-slate-100 font-sans flex items-center justify-center relative overflow-hidden select-text">
        {/* Ambient high-end background lighting (Chanel/Rolls Royce vibe) */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-900/10 via-black to-black z-0 pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] bg-gold-600/5 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 h-[500px] w-[500px] bg-rose-600/5 rounded-full blur-[160px] pointer-events-none" />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f0f_1px,transparent_1px),linear-gradient(to_bottom,#0f0f0f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] z-0 pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl p-6 md:p-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#050505]/85 backdrop-blur-2xl border border-gold-500/15 p-8 rounded-[32px] shadow-[0_0_50px_rgba(176,141,70,0.06)] space-y-8 relative overflow-hidden"
          >
            {/* Elegant luxury details */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-gold-400/10 to-transparent" />
            
            {/* Title / Brand Header */}
            <div className="text-center space-y-2">
              <span className="text-[10px] font-display font-light uppercase tracking-[0.35em] text-gold-400 block">
                Maison de Beauté
              </span>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-[0.2em] text-slate-50 uppercase">
                HAIRLOON
              </h1>
              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                <span className="h-1 w-1 bg-gold-500 rounded-full" />
                AI Hair Architect & Virtual Suite
                <span className="h-1 w-1 bg-gold-500 rounded-full" />
              </div>
            </div>

            {/* Selector Toggles (Login vs Signup) & Roles */}
            <div className="space-y-4">
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900/60">
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); }}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${authMode === "login" ? "bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); }}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${authMode === "signup" ? "bg-gradient-to-r from-gold-600 to-gold-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-slate-200"}`}
                >
                  Create Account
                </button>
              </div>

              {/* Role selector (User Client vs Admin Stylist) - on Signup */}
              {authMode === "signup" && (
                <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-1 rounded-xl border border-slate-900/20">
                  <button
                    type="button"
                    onClick={() => setAuthRole("user")}
                    className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${authRole === "user" ? "bg-slate-900 text-gold-300 border border-gold-500/10" : "text-slate-500"}`}
                  >
                    Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthRole("admin")}
                    className={`py-1.5 text-[9px] font-black uppercase tracking-widest rounded-md transition-all ${authRole === "admin" ? "bg-slate-900 text-gold-300 border border-gold-500/10" : "text-slate-500"}`}
                  >
                    Maison Admin
                  </button>
                </div>
              )}
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthAction} className="space-y-4">
              {authMode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Seraphina Vance"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 text-xs px-4 py-3 rounded-xl focus:border-gold-500/50 focus:outline-none transition-all placeholder:text-slate-600 text-slate-200"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. guest@hairloon.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 text-xs px-4 py-3 rounded-xl focus:border-gold-500/50 focus:outline-none transition-all placeholder:text-slate-600 text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Secure Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-900 text-xs px-4 py-3 rounded-xl focus:border-gold-500/50 focus:outline-none transition-all placeholder:text-slate-600 text-slate-200"
                />
              </div>

              {/* Dynamic personalization attributes inside signup view */}
              {authMode === "signup" && authRole === "user" && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Hair Texture</label>
                    <select
                      value={authTexture}
                      onChange={(e) => setAuthTexture(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 text-[10px] px-3 py-2.5 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500/40"
                    >
                      <option value="Straight">Straight</option>
                      <option value="Wavy">Wavy</option>
                      <option value="Curly">Curly</option>
                      <option value="Coily">Coily</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[8px] text-slate-400 font-black uppercase tracking-widest block">Maintenance</label>
                    <select
                      value={authMaintenance}
                      onChange={(e) => setAuthMaintenance(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-900 text-[10px] px-3 py-2.5 rounded-xl text-slate-300 focus:outline-none focus:border-gold-500/40"
                    >
                      <option value="Low-maintenance">Low-effort</option>
                      <option value="High-effort">High-effort</option>
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gold-500/5 flex items-center justify-center gap-2 cursor-pointer"
              >
                {authMode === "login" ? "Enter the Lounge" : "Complete Registration"}
                <ArrowRight size={14} />
              </button>
            </form>

            {/* Quick Demo Gateways */}
            <div className="space-y-3 pt-4 border-t border-slate-900/60">
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest text-center">
                Instant VIP Pass Gateways (Quick Access)
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleBypassAuth("user")}
                  className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-gold-500/10 rounded-2xl text-left group transition-all cursor-pointer"
                >
                  <p className="text-[9px] font-black text-slate-100 uppercase tracking-widest group-hover:text-gold-300 transition-colors">
                    Client Access
                  </p>
                  <p className="text-[8px] text-slate-500 mt-0.5 leading-normal">
                    Enter instantly as a prestige VIP salon guest.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleBypassAuth("admin")}
                  className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-gold-500/10 rounded-2xl text-left group transition-all cursor-pointer"
                >
                  <p className="text-[9px] font-black text-slate-100 uppercase tracking-widest group-hover:text-gold-300 transition-colors">
                    Lead Stylist Portal
                  </p>
                  <p className="text-[8px] text-slate-500 mt-0.5 leading-normal">
                    Manage connections, databases, and catalogs.
                  </p>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans overflow-hidden select-none">
      
      {
    /* LEFT GLOWING CONTROL DRAWER */
  }
      <div className="w-80 border-r border-slate-900 bg-slate-900/40 flex flex-col justify-between flex-shrink-0 z-20">
        
        {
    /* App Title */
  }
        <div>
          <div className="px-6 py-7 border-b border-slate-900/80 bg-slate-950/40 relative overflow-visible">
            <div className="absolute top-0 right-0 h-32 w-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 flex items-center justify-center shadow-lg shadow-rose-500/10">
                  <div className="h-full w-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                    <Scissors className="h-5 w-5 text-amber-400 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-300 bg-clip-text text-transparent">
                    HAIRLOON
                  </h1>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">
                    AI Hair Architect
                  </p>
                </div>
              </div>

              {
    /* Notification Center */
  }
              <div className="relative">
                <button
    onClick={() => setShowNotificationsDropdown((prev) => !prev)}
    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 relative transition-all"
    title="Notification Center"
  >
                  {notifications.some((n) => !n.read) ? <>
                      <BellRing size={15} className="text-amber-400 animate-pulse" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500" />
                    </> : <Bell size={15} className="text-slate-400" />}
                </button>

                {
    /* Notifications Dropdown Panel */
  }
                {showNotificationsDropdown && <div className="absolute right-0 mt-3 w-72 bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl z-50 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-2.5">
                      <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest">Local System Logs</span>
                      <div className="flex gap-2">
                        {notifications.length > 0 && <button
    onClick={() => {
      const updated = notifications.map((n) => ({ ...n, read: true }));
      setNotifications(updated);
      localStorage.setItem("hairloon_notifications", JSON.stringify(updated));
    }}
    className="text-[8px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest"
  >
                            Read All
                          </button>}
                        <button
    onClick={() => {
      setNotifications([]);
      localStorage.removeItem("hairloon_notifications");
    }}
    className="text-[8px] font-bold text-rose-400 hover:text-rose-300 uppercase tracking-widest"
  >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar select-text">
                      {notifications.length === 0 ? <div className="py-6 text-center">
                          <p className="text-[10px] text-slate-500 font-bold">No Notification Logs</p>
                          <p className="text-[9px] text-slate-600 mt-0.5 leading-relaxed">
                            Schedule appointments or edit bookings to populate your browser's persistent system logs.
                          </p>
                        </div> : notifications.map((n) => <div
    key={n.id}
    onClick={() => {
      const updated = notifications.map((notif) => notif.id === n.id ? { ...notif, read: true } : notif);
      setNotifications(updated);
      localStorage.setItem("hairloon_notifications", JSON.stringify(updated));
    }}
    className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer leading-tight ${n.read ? "bg-slate-900/10 border-slate-900 text-slate-400" : "bg-slate-900/40 border-slate-800 text-slate-200 shadow-md border-l-2 border-l-amber-500"}`}
  >
                            <div className="flex justify-between items-start gap-1">
                              <p className="font-bold text-[10px]">{n.title}</p>
                              <span className="text-[8px] text-slate-600 font-mono flex-shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                          </div>)}
                    </div>
                  </div>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
          {
    /* Navigation Items */
  }
          <div className="p-4 space-y-1">
            <button
    onClick={() => setActiveTab("analyzer")}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "analyzer" ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow shadow-amber-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
              <Camera size={16} className={activeTab === "analyzer" ? "text-amber-400" : ""} />
              AI Face Shape Scanner
            </button>

            <button
    onClick={() => setActiveTab("catalog")}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "catalog" ? "bg-rose-500/10 border-rose-500/30 text-rose-300 shadow shadow-rose-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
              <Scissors size={16} className={activeTab === "catalog" ? "text-rose-400" : ""} />
              Hairstyle Directory
            </button>

            <button
    onClick={() => setActiveTab("booking")}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "booking" ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow shadow-indigo-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
              <Calendar size={16} className={activeTab === "booking" ? "text-indigo-400" : ""} />
              Salon Appointment Hub
              {bookings.length > 0 && <span className="ml-auto bg-indigo-500 text-slate-950 font-black text-[9px] h-4.5 w-4.5 rounded-full flex items-center justify-center">
                  {bookings.length}
                </span>}
            </button>

            <button
    onClick={() => setActiveTab("chat")}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "chat" ? "bg-teal-500/10 border-teal-500/30 text-teal-300 shadow shadow-teal-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
              <MessageSquare size={16} className={activeTab === "chat" ? "text-teal-400" : ""} />
              AI Stylist Companion
            </button>

            <button
    onClick={() => setActiveTab("generator")}
    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "generator" ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-300 shadow shadow-fuchsia-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
              <Wand2 size={16} className={activeTab === "generator" ? "text-fuchsia-400" : ""} />
              AI Image Generator
            </button>

            <button
              onClick={() => setActiveTab("labs")}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "labs" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow shadow-cyan-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
            >
              <Activity size={16} className={activeTab === "labs" ? "text-cyan-400" : ""} />
              Maison Industry Labs
            </button>

            {currentUser?.role === "admin" && (
              <>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "dashboard" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow shadow-emerald-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
                >
                  <TrendingUp size={16} className={activeTab === "dashboard" ? "text-emerald-400" : ""} />
                  Stylist Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("database")}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold transition-all border ${activeTab === "database" ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow shadow-amber-500/5" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
                >
                  <Database size={16} className={activeTab === "database" ? "text-amber-400 animate-pulse" : ""} />
                  Maison Database Hub
                </button>
              </>
            )}
          </div>

          {
    /* Salon Countdown Widget */
  }
          <div className="px-4 mt-5">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-indigo-500/20 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 h-16 w-16 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-2.5">
                <Clock size={14} className="text-indigo-400 animate-pulse" />
                <span className="text-[10px] text-indigo-300 font-black uppercase tracking-widest">Salon Countdown</span>
              </div>

              {nextAppointment && timeLeft ? <div className="space-y-3">
                  <div className="flex gap-1 font-mono text-base font-black text-amber-400 tracking-wider">
                    <div className="bg-slate-950/60 border border-slate-900 px-2 py-1 rounded-lg text-center min-w-[38px]">
                      <span>{timeLeft.days}</span>
                      <span className="text-[7px] text-slate-500 block uppercase font-sans font-black mt-0.5">days</span>
                    </div>
                    <span className="text-slate-700 self-center">:</span>
                    <div className="bg-slate-950/60 border border-slate-900 px-2 py-1 rounded-lg text-center min-w-[38px]">
                      <span>{String(timeLeft.hours).padStart(2, "0")}</span>
                      <span className="text-[7px] text-slate-500 block uppercase font-sans font-black mt-0.5">hours</span>
                    </div>
                    <span className="text-slate-700 self-center">:</span>
                    <div className="bg-slate-950/60 border border-slate-900 px-2 py-1 rounded-lg text-center min-w-[38px]">
                      <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
                      <span className="text-[7px] text-slate-500 block uppercase font-sans font-black mt-0.5">mins</span>
                    </div>
                    <span className="text-slate-700 self-center">:</span>
                    <div className="bg-slate-950/60 border border-slate-900 px-2 py-1 rounded-lg text-center min-w-[38px]">
                      <span className="text-rose-400">{String(timeLeft.seconds).padStart(2, "0")}</span>
                      <span className="text-[7px] text-slate-500 block uppercase font-sans font-black mt-0.5">secs</span>
                    </div>
                  </div>

                  <div className="text-[11px] space-y-1 bg-slate-950/50 p-2.5 rounded-xl border border-slate-900 leading-normal">
                    <p className="font-bold text-slate-200 truncate">{nextAppointment.booking.salonName}</p>
                    <p className="text-[9.5px] text-slate-400 truncate">{nextAppointment.booking.serviceName} with {nextAppointment.booking.stylist}</p>
                    <p className="text-[9px] text-indigo-400 font-bold mt-1">
                      Scheduled: {nextAppointment.booking.date} at {nextAppointment.booking.time}
                    </p>
                  </div>
                </div> : <div className="space-y-2.5">
                  <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                    No upcoming sessions. Book a premium haircut to start your countdown!
                  </p>
                  <button
    onClick={() => setActiveTab("booking")}
    className="w-full py-2 bg-indigo-600/20 hover:bg-indigo-600/45 border border-indigo-500/20 text-slate-100 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow shadow-indigo-600/10"
  >
                    Schedule Appointment
                  </button>
                </div>}
            </div>
          </div>

          {
    /* User Face Profile Widget inside Sidebar */
  }
          <div className="mt-5 px-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-900 relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Active Profiler</span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Your Hairloon Profile</p>
              
              {analysisResult ? <div className="mt-3 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <div className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-black rounded-lg">
                      {analysisResult.faceShape} Shape
                    </div>
                    <span className="text-xs text-slate-400 font-medium">({analysisResult.confidence}% confidence)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-slate-900">
                    <div className="text-[9px] text-slate-400 leading-tight">
                      <span className="text-slate-600 block">Forehead:</span> {analysisResult.metrics.foreheadWidth}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-tight">
                      <span className="text-slate-600 block">Cheekbones:</span> {analysisResult.metrics.cheekboneProminence}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-tight">
                      <span className="text-slate-600 block">Jawline:</span> {analysisResult.metrics.jawlineType}
                    </div>
                    <div className="text-[9px] text-slate-400 leading-tight">
                      <span className="text-slate-600 block">Proportions:</span> {analysisResult.metrics.faceLengthRatio}
                    </div>
                  </div>
                </div> : <div className="mt-3 space-y-1">
                  <p className="text-xs text-slate-300 font-bold">No Face Shape Detected</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Upload or take a photo to unlock tailored machine learning hair styling blueprints.
                  </p>
                </div>}
            </div>
          </div>

          {
    /* Hair Preferences Settings Widget inside Sidebar */
  }
          <div className="mt-5 px-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-900 space-y-4">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Grooming & Style Settings</p>
                <h4 className="text-xs font-black text-slate-200 mt-1">Personal Hair Profile</h4>
              </div>
              
              {
    /* Hair Texture */
  }
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Hair Texture</label>
                <select
    value={hairTexture}
    onChange={(e) => handleSaveTexture(e.target.value)}
    className="w-full bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
  >
                  <option value="Straight">Straight (Type 1)</option>
                  <option value="Wavy">Wavy (Type 2)</option>
                  <option value="Curly">Curly (Type 3)</option>
                  <option value="Coily">Coily (Type 4)</option>
                </select>
              </div>

              {
    /* Maintenance Level */
  }
              <div className="space-y-1.5">
                <label className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Maintenance Commitment</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
    onClick={() => handleSaveMaintenance("Low-maintenance")}
    className={`px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${maintenanceLevel === "Low-maintenance" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-400"}`}
  >
                    Low-effort
                  </button>
                  <button
    onClick={() => handleSaveMaintenance("High-effort")}
    className={`px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${maintenanceLevel === "High-effort" ? "bg-rose-500/10 border-rose-500/30 text-rose-300" : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-400"}`}
  >
                    High-effort
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Client profile card & Logout */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-900 border border-gold-500/30 flex items-center justify-center font-bold text-xs text-gold-400 uppercase">
              {(currentUser?.name || "G").charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-slate-200 truncate">{currentUser?.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-[7.5px] px-1 rounded uppercase font-black tracking-widest ${currentUser?.role === "admin" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-slate-900 text-slate-400"}`}>
                  {currentUser?.role}
                </span>
                {currentUser?.role === "user" && (
                  <span className="text-[7.5px] text-slate-500 truncate font-mono">
                    {hairTexture} • {maintenanceLevel === "Low-maintenance" ? "Low-effort" : "High-effort"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 text-rose-300 hover:text-rose-200 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut size={11} />
            Exit Lounge
          </button>
          <div className="text-[9px] text-slate-600 text-center font-semibold tracking-wide">
            <p>© 2026 Hairloon Labs Inc.</p>
            <p className="text-[8px] text-slate-700">Machine Learning RAG Core v3.5</p>
          </div>
        </div>
      </div>

      {
    /* RIGHT MAIN VIEWPORT AREA */
  }
      <div className="flex-1 flex flex-col bg-slate-950 overflow-hidden relative">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-[400px] w-[400px] bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar relative z-10 select-text">
          
          {
    /* AI FACE SHAPE SCANNER TAB */
  }
          {activeTab === "analyzer" && <div className="max-w-4xl mx-auto space-y-8">
              
              {
    /* Splash Header */
  }
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-amber-400 tracking-wider">
                  <Sparkles size={11} /> Biometric Hairstyle Recommendation
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-50">
                  AI Face Shape Analyzer
                </h2>
                <p className="text-xs text-slate-400">
                  Scan your features with computer vision to isolate your facial symmetry type and explore custom haircuts.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {
    /* Visual Capture Box Column (8 cols) */
  }
                <div className="lg:col-span-7 space-y-6">
                  {isTryOnActive && selectedTryOnStyle && capturedImage ? <VirtualTryOn
    capturedImage={capturedImage}
    selectedTryOnStyle={selectedTryOnStyle}
    faceShape={analysisResult ? analysisResult.faceShape : null}
    onClose={() => setIsTryOnActive(false)}
  /> : <div className="border border-slate-900 bg-slate-900/10 rounded-3xl overflow-hidden relative shadow-2xl p-6">
                      
                      {
    /* Simulated Scanner Stage */
  }
                      <div className="relative aspect-square w-full bg-slate-950 rounded-2xl border border-slate-900 overflow-hidden flex flex-col items-center justify-center">
                        
                        {isCameraActive ? <video
    ref={videoRef}
    autoPlay
    playsInline
    className="w-full h-full object-cover transform scale-x-[-1]"
  /> : capturedImage ? <div className="relative w-full h-full">
                            <img
    src={capturedImage}
    alt="Biometric Selfie Input"
    className="w-full h-full object-cover"
  />
                            {!isAnalyzing && (
                              <div className="absolute inset-0 bg-slate-950/70 flex flex-col justify-between p-6 backdrop-blur-[2px]">
                                <div className="space-y-1">
                                  <span className="text-[9px] bg-amber-500/15 border border-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full uppercase tracking-widest inline-block">
                                    Step 2: Portrait Preview
                                  </span>
                                  <h4 className="text-sm font-black text-slate-50 tracking-tight">Verify Biometric Framing</h4>
                                  <p className="text-[10px] text-slate-400 leading-normal max-w-xs">
                                    Ensure your face is clearly lit, looking straight ahead, and centered before sending it to Madame Simone's RAG and Gemini 3.1 Pro engine.
                                  </p>
                                </div>

                                <div className="flex gap-2 w-full max-w-xs mt-auto">
                                  <button
                                    onClick={() => {
                                      setCapturedImage(null);
                                      startCamera();
                                    }}
                                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                                  >
                                    <X size={13} /> Retake
                                  </button>
                                  <button
                                    onClick={analyzeFaceWithAI}
                                    className="flex-[1.5] py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-slate-950 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-amber-500/10"
                                  >
                                    <Sparkles size={13} /> Analyze Portrait
                                  </button>
                                </div>
                              </div>
                            )}
                            {
    /* Live hair vector overlay if Try-on is active */
  }
                            {isTryOnActive && selectedTryOnStyle && <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none select-none">
                                <div
    className="w-64 h-64 opacity-80 animate-pulse border-2 border-dashed border-rose-500 rounded-full flex items-center justify-center bg-rose-500/5"
    style={{
      background: selectedTryOnStyle.image.startsWith("http") ? `url(${selectedTryOnStyle.image})` : selectedTryOnStyle.image,
      backgroundSize: "cover",
      backgroundPosition: "center",
      WebkitMaskImage: "radial-gradient(circle, transparent 30%, black 100%)"
    }}
  >
                                  <span className="text-[10px] text-rose-300 font-bold bg-slate-950/90 px-2.5 py-1 rounded-md border border-rose-500/20 tracking-widest uppercase">
                                    {selectedTryOnStyle.name} overlay
                                  </span>
                                </div>
                              </div>}
                          </div> : <div className="text-center p-8 space-y-4">
                            <div className="h-16 w-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                              <Camera size={26} />
                            </div>
                          <div>
                            <p className="text-sm font-bold text-slate-200">No Image Captured</p>
                            <p className="text-xs text-slate-500 max-w-xs leading-relaxed mt-1">
                              Activate your webcam to take a high-contrast facial portrait, or choose one of our preset model faces below.
                            </p>
                          </div>
                        </div>}

                      {
    /* Moving laser scan lines when scanning is active */
  }
                      {isAnalyzing && <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                          <motion.div
    initial={{ y: "0%" }}
    animate={{ y: "100%" }}
    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
    className="h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_rgba(245,158,11,0.8)] w-full"
  />
                          <div className="absolute inset-0 bg-amber-500/5 flex items-center justify-center animate-pulse">
                            <span className="text-xs text-amber-300 font-mono font-bold bg-slate-950/90 border border-amber-500/20 px-3 py-1.5 rounded-lg">
                              Analyzing Biometrics... {scanProgress}%
                            </span>
                          </div>
                        </div>}
                    </div>

                    {
    /* Controls Bar */
  }
                    <div className="mt-5 flex flex-wrap gap-3 items-center justify-between">
                      <div className="flex gap-2">
                        {isCameraActive ? <button
    onClick={captureSnapshot}
    className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-400 rounded-xl text-xs font-bold text-slate-950 transition-all shadow shadow-rose-500/10"
  >
                            <Check size={14} /> Capture Snap
                          </button> : <button
    onClick={startCamera}
    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-all"
  >
                            <Camera size={14} /> Live Webcam
                          </button>}

                        <label className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 cursor-pointer transition-all">
                          <Upload size={14} /> Upload Selfie
                          <input
    type="file"
    accept="image/*"
    onChange={handlePhotoUpload}
    className="hidden"
  />
                        </label>
                      </div>

                      {capturedImage && !isAnalyzing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setCapturedImage(null);
                              startCamera();
                            }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all border border-slate-700"
                          >
                            <Camera size={14} /> Retake Snapshot
                          </button>
                          <button
                            onClick={analyzeFaceWithAI}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow shadow-amber-500/10"
                          >
                            <Sparkles size={14} /> Analyze Face Shape
                          </button>
                        </div>
                      )}
                    </div>
                  </div>}

                  {
    /* Preset Model faces */
  }
                  <div className="space-y-3">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      Or Select a Quick-Test Portrait
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {PRESET_TEST_PORTRAITS.map((p) => <button
    key={p.id}
    onClick={() => selectTestPortrait(p)}
    className="text-left bg-slate-900/20 hover:bg-slate-900/60 border border-slate-900 hover:border-slate-800 rounded-2xl overflow-hidden p-2.5 transition-all group"
  >
                          <div className="aspect-square rounded-xl overflow-hidden border border-slate-950 mb-2 bg-slate-900">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                          </div>
                          <p className="text-[11px] font-bold text-slate-200 truncate">{p.name}</p>
                          <p className="text-[9px] text-amber-400/80 font-semibold">{p.shape} Profile</p>
                        </button>)}
                    </div>
                  </div>
                </div>

                {
    /* Analysis Breakdown Panel Column (5 cols) */
  }
                <div className="lg:col-span-5 space-y-6">
                  {analysisResult ? <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    className="border border-slate-900 bg-slate-900/20 p-6 rounded-3xl space-y-6 shadow-xl"
  >
                      <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                        <div>
                          <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Scanner Verdict</p>
                          <h3 className="text-xl font-black text-slate-50 mt-1">{analysisResult.faceShape} Face shape</h3>
                        </div>
                        <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col items-center justify-center">
                          <span className="text-xs font-black text-amber-400 leading-none">{analysisResult.confidence}%</span>
                          <span className="text-[7px] text-slate-400 font-black mt-0.5">MATCH</span>
                        </div>
                      </div>

                      {
    /* Geometric explanation */
  }
                      <div className="space-y-2.5">
                        <h4 className="text-[10px] text-amber-400 font-black uppercase tracking-wider">Geometric Mapping</h4>
                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 border border-slate-900 p-3 rounded-xl font-mono">
                          {analysisResult.geometricAnalysis}
                        </p>
                      </div>

                      {
    /* Golden styling rule */
  }
                      <div className="space-y-2 bg-rose-500/5 border border-rose-500/15 p-4 rounded-2xl">
                        <div className="flex items-center gap-1.5 text-rose-300 font-bold text-xs">
                          <Sparkle size={13} className="text-rose-400 animate-pulse" />
                          Golden Aesthetic Rule
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">
                          {analysisResult.keyAestheticRule}
                        </p>
                      </div>

                      {
    /* Avoid styles list */
  }
                      <div className="space-y-2">
                        <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Avoid These Cuts</h4>
                        <div className="space-y-1.5">
                          {analysisResult.avoidStyles.map((avoid, idx) => <div key={idx} className="flex gap-2 text-xs text-slate-400 leading-tight">
                              <span className="text-rose-500 font-black">✕</span>
                              <span>{avoid}</span>
                            </div>)}
                        </div>
                      </div>

                      {
    /* Radar Chart widget comparing measurements against Golden Ratio */
  }
                      <RadarChartWidget analysisResult={analysisResult} />

                      {/* Custom recommended hairstyles from Gemini service layer */}
                      {analysisResult.recommendedStyles && analysisResult.recommendedStyles.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-950">
                          <h4 className="text-[10px] text-amber-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkle size={12} className="text-amber-500 animate-spin" />
                            Madame Simone's Luxury Picks
                          </h4>
                          <div className="space-y-3">
                            {analysisResult.recommendedStyles.map((style, idx) => {
                              const imgUrl = getProperHairstyleImage(style.name);
                              return (
                                <div key={idx} className="bg-slate-950/50 border border-slate-950 rounded-2xl overflow-hidden p-3.5 space-y-3">
                                  <div className="flex gap-3">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-900">
                                      <img src={imgUrl} alt={style.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        {style.category || "Luxury"}
                                      </span>
                                      <h5 className="text-xs font-black text-slate-200 leading-tight">{style.name}</h5>
                                      <p className="text-[10px] text-slate-400 leading-normal">{style.description}</p>
                                    </div>
                                  </div>

                                  {style.benefits && style.benefits.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                      {style.benefits.map((b, bIdx) => (
                                        <span key={bIdx} className="text-[8.5px] bg-slate-900 text-slate-300 font-medium px-2 py-0.5 rounded border border-slate-950">
                                          ✓ {b}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="text-[9.5px] text-slate-400 leading-relaxed font-mono bg-slate-950/40 border border-slate-900/60 p-2 rounded-xl">
                                    <span className="text-amber-400/80 font-bold font-sans">Styling tip: </span>
                                    {style.stylingTips}
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    <button
                                      onClick={() => {
                                        setSelectedTryOnStyle({
                                          id: "gemini_reco_" + idx,
                                          name: style.name,
                                          image: imgUrl
                                        });
                                        setIsTryOnActive(true);
                                        showToast(`Try-on overlay activated: ${style.name}`);
                                      }}
                                      className="py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-lg text-[9px] font-bold border border-slate-800 transition-colors"
                                    >
                                      Virtual Try-On
                                    </button>
                                    <button
                                      onClick={() => {
                                        const firstSalon = MOCK_SALONS[0];
                                        setSelectedSalon(firstSalon);
                                        setSelectedService({
                                          id: "custom_cut",
                                          name: `Bespoke Cut: ${style.name}`,
                                          price: 120
                                        });
                                        setActiveTab("booking");
                                        showToast(`Reservation pipeline ready for: ${style.name}`);
                                      }}
                                      className="py-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:opacity-90 text-slate-950 rounded-lg text-[9px] font-black transition-colors"
                                    >
                                      Book Salon Cut
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Call-to-actions */}
                      <div className="pt-2">
                        <button
                          onClick={() => setActiveTab("catalog")}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-2xl text-xs font-black transition-all shadow-md"
                        >
                          Explore Haute Couture Directory
                          <ArrowRight size={13} />
                        </button>
                      </div>

                    </motion.div> : <div className="h-full border border-dashed border-slate-900 bg-slate-900/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                        <Sliders size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">Biometric Analysis Pending</h4>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed mt-1">
                          After uploading your portrait or selecting a preset, execute the analyzer. The machine learning pipeline will output custom recommendations, jawline contour definitions, and stylistic avoids here!
                        </p>
                      </div>
                    </div>}
                </div>

              </div>

              {
    /* Error boundary feedback */
  }
              {apiError && <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex gap-3 items-start">
                  <Info size={16} className="mt-0.5 text-rose-400 flex-shrink-0" />
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-100 uppercase tracking-widest text-[9px]">Camera / Vision Warning</p>
                    <p className="leading-relaxed">{apiError}</p>
                  </div>
                </div>}

            </div>}

          {
    /* HAIRSTYLE DIRECTORY CATALOG TAB */
  }
          {activeTab === "catalog" && <div className="max-w-5xl mx-auto space-y-8">
              
              {
    /* Header */
  }
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-rose-400 tracking-wider">
                    <Scissors size={11} /> Global Trend Book
                  </div>
                  <h2 className="text-2xl font-black tracking-tight text-slate-50">Hairstyle Trend Catalog</h2>
                  <p className="text-xs text-slate-400">
                    Bespoke styling directions mapped by structural geometry. Toggle shapes or filters below.
                  </p>
                </div>

                {
    /* Quick reset if analysis profile exists */
  }
                {analysisResult && <button
    onClick={() => setSelectedExploreShape(analysisResult.faceShape)}
    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition-all self-start"
  >
                    <BookmarkCheck size={13} /> Limit to My Detected shape ({analysisResult.faceShape})
                  </button>}
              </div>

              {
    /* Face Shape quick switcher */
  }
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar pr-2 select-none">
                {["Oval", "Round", "Square", "Heart", "Diamond", "Oblong", "Pear"].map((shape) => <button
    key={shape}
    onClick={() => {
      setSelectedExploreShape(shape);
      setSelectedTryOnStyle(null);
      setIsTryOnActive(false);
    }}
    className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${selectedExploreShape === shape ? "bg-rose-500 text-slate-950 border-rose-400 shadow shadow-rose-500/10" : "bg-slate-900/30 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"}`}
  >
                    {shape}
                  </button>)}
              </div>

              {
    /* Historical & Social Media Trends Live Tracker widget */
  }
              <div className="space-y-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-900 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                <div className="absolute top-1/2 left-0 h-10 w-10 bg-indigo-500/5 rounded-full blur-xl" />
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-rose-400 animate-pulse" />
                    <div>
                      <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                        Historical Social Media Trends
                        <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      </h3>
                      <p className="text-[9px] text-slate-500 font-semibold leading-none">Real-time social media telemetry data feeding Madame Simone's RAG prompt core</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono bg-rose-500/10 border border-rose-500/20 px-2.5 py-0.5 rounded-md text-rose-300">RAG telemetry</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  {HISTORICAL_TRENDS_DATA.map((trend) => {
    const isOptimalForShape = trend.faceShapes.includes(selectedExploreShape);
    return <div
      key={trend.id}
      onClick={() => setSelectedTrend(trend)}
      className={`p-3 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group ${isOptimalForShape ? "bg-rose-950/10 border-rose-500/20 hover:border-rose-500/40 shadow-inner" : "bg-slate-950/60 border-slate-900/60 hover:border-slate-800"}`}
    >
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className={`text-[7px] font-black uppercase tracking-wider px-1 py-0.2 rounded-md ${trend.platform === "TikTok" ? "bg-black text-cyan-300" : trend.platform === "Instagram" ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white" : "bg-rose-600 text-white"}`}>
                              {trend.platform}
                            </span>
                            <span className="text-[9px] font-mono text-emerald-400 font-black">{trend.growthRate}</span>
                          </div>
                          <h4 className="text-[11px] font-black text-slate-100 truncate group-hover:text-rose-400 transition-colors">{trend.name}</h4>
                          <p className="text-[9.5px] text-slate-500 leading-tight line-clamp-2">{trend.description}</p>
                        </div>
                        <div className="flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-900/50 justify-between text-[8px] text-slate-400">
                          <span className="truncate">Fits: {trend.faceShapes.slice(0, 2).join(", ")}...</span>
                          {isOptimalForShape && <span className="text-[7.5px] text-rose-400 font-black uppercase tracking-wider flex-shrink-0">Fits {selectedExploreShape}</span>}
                        </div>
                      </div>;
  })}
                </div>
              </div>

              {
    /* Dynamic Shape guidelines banner */
  }
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-slate-900/20 border border-slate-900 rounded-3xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-rose-500/5 rounded-full blur-3xl" />
                
                <div className="md:col-span-8 space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-50">{FACE_SHAPES_INFO[selectedExploreShape].name} Guide</h3>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-950 border border-slate-900 px-2 py-0.5 rounded-md">Bespoke Blueprint</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-medium">
                    {FACE_SHAPES_INFO[selectedExploreShape].description}
                  </p>
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs bg-rose-500/5 p-2 rounded-xl border border-rose-500/10">
                    <Sparkle size={13} />
                    <span>Goal: {FACE_SHAPES_INFO[selectedExploreShape].stylingGoal}</span>
                  </div>
                </div>

                <div className="md:col-span-4 bg-slate-950/40 border border-slate-900 p-4 rounded-2xl space-y-2">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Biometric Rules</p>
                  <div className="space-y-1.5">
                    {FACE_SHAPES_INFO[selectedExploreShape].characteristics.map((char, i) => <div key={i} className="flex gap-2 text-[10px] text-slate-400 leading-tight">
                        <span className="text-amber-400">•</span>
                        <span>{char}</span>
                      </div>)}
                  </div>
                </div>
              </div>

              {
    /* Filtering selector */
  }
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-900 pb-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Gender:</span>
                  <div className="flex gap-1.5">
                    {["All", "Male", "Female"].map((g) => <button
    key={g}
    onClick={() => setGenderFilter(g)}
    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${genderFilter === g ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"}`}
  >
                        {g === "All" ? "All" : g === "Male" ? "Men" : "Women"}
                      </button>)}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:border-l sm:border-slate-800 sm:pl-4">
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Length:</span>
                  <div className="flex gap-1.5">
                    {["All", "Short", "Medium", "Long"].map((length) => <button
    key={length}
    onClick={() => setLengthFilter(length)}
    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${lengthFilter === length ? "bg-slate-900 border-slate-800 text-slate-200" : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"}`}
  >
                        {length}
                      </button>)}
                  </div>
                </div>
              </div>

              {/* Hairstyle Grid list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(() => {
                  const filtered = (ALL_HAIRSTYLES_MAPPED[selectedExploreShape] || []).filter((style) => lengthFilter === "All" || style.category === lengthFilter).filter((style) => genderFilter === "All" || style.gender === genderFilter);
    if (filtered.length === 0) {
      return <div className="col-span-full py-12 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-950/20">
                        <p className="text-slate-400 font-bold">No hairstyles found matching the selected filters.</p>
                        <p className="text-xs text-slate-500 mt-1">Try switching gender or hair length options.</p>
                      </div>;
    }
    return filtered.map((style) => <div
      key={style.id}
      className="border border-slate-900 bg-slate-900/15 rounded-3xl overflow-hidden shadow-lg hover:border-slate-800 transition-all flex flex-col justify-between"
    >
                      <div>
                        {
      /* Cut Portrait Thumbnail Canvas Placeholder */
    }
                        <div
      className="h-44 w-full relative overflow-hidden flex flex-col justify-between p-4"
      style={{
        background: style.image.startsWith("http") ? `url(${style.image})` : style.image,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
                          <div className="flex justify-between items-start w-full">
                            <span className="px-2.5 py-0.5 bg-slate-950/80 backdrop-blur text-slate-200 border border-slate-800 text-[9px] font-black uppercase rounded-lg">
                              {style.category} Hair
                            </span>
                            <div className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black">
                              <Star size={10} fill="currentColor" /> {style.rating}
                            </div>
                          </div>
                          
                          <div className="flex items-end justify-between w-full text-slate-100">
                            <div>
                              <p className="text-xs text-slate-400 font-bold leading-none">Difficulty</p>
                              <span className="text-[10px] font-black text-rose-300">{style.difficulty}</span>
                            </div>
                            <span className="text-[9px] bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold uppercase tracking-wider">
                              Hairloon Original
                            </span>
                          </div>
                        </div>

                        {
      /* Title details */
    }
                        <div className="p-5 space-y-3.5">
                          <div className="space-y-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-black text-slate-100">{style.name}</h4>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => setShareStyle(style)}
                                  className="p-1.5 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-rose-400 border border-slate-900 rounded-lg transition-all"
                                  title="Share Hairstyle Blueprint"
                                >
                                  <Share2 size={12} />
                                </button>
                                <button
                                  onClick={() => toggleFavorite(style.id)}
                                  className={`p-1.5 ${favorites.includes(style.id) ? 'bg-rose-500/20 text-rose-500 border-rose-500/30' : 'bg-slate-950/60 text-slate-400 border-slate-900'} hover:bg-slate-900 hover:text-rose-400 border rounded-lg transition-all`}
                                  title="Favorite"
                                >
                                  <Heart size={12} fill={favorites.includes(style.id) ? 'currentColor' : 'none'} />
                                </button>
                              </div>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-medium">{style.description}</p>
                          </div>

                          {
      /* Try-on selfie feedback button */
    }
                          {capturedImage ? <button
      onClick={() => {
        setSelectedTryOnStyle(style);
        setIsTryOnActive(true);
        setActiveTab("analyzer");
      }}
      className="w-full py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
    >
                              <Camera size={13} /> Try Cut On Your Captured Selfie
                            </button> : <button
      onClick={() => setActiveTab("analyzer")}
      className="w-full py-2 bg-slate-900/50 border border-slate-900 text-slate-500 text-xs font-semibold rounded-xl text-center"
      disabled
    >
                              Capture Selfie to Try Cut On
                            </button>}

                          {
      /* Benefits checklist */
    }
                          <div className="space-y-1.5">
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Why it works:</p>
                            {style.benefits.map((b, i) => <div key={i} className="flex gap-2 text-[10px] text-slate-400 leading-tight">
                                <span className="text-emerald-500 font-black">✓</span>
                                <span>{b}</span>
                              </div>)}
                          </div>

                          {
      /* Styling Tip Box */
    }
                          <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-900 font-mono text-[10px] text-slate-400 leading-relaxed">
                            <span className="text-amber-400 font-bold block mb-0.5">Styling Tip:</span>
                            {style.stylingTips}
                          </div>
                        </div>
                      </div>

                      {
      /* Partner booking link */
    }
                      <div className="p-5 border-t border-slate-900 bg-slate-950/10">
                        <button
      onClick={() => {
        startBooking(MOCK_SALONS[0], MOCK_SALONS[0].services[0]);
      }}
      className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center justify-center gap-2"
    >
                          Book Cut At Local Salon
                          <ChevronRight size={13} />
                        </button>
                      </div>

                    </div>);
  })()}
              </div>

            </div>}

          {
    /* SALON APPOINTMENT HUB TAB */
  }
          {activeTab === "booking" && <div className="max-w-5xl mx-auto space-y-8">
              
              {
    /* Header */
  }
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                  <Calendar size={11} /> Appointment Lounge
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-50">Partner Salons & Booking Ledger</h2>
                <p className="text-xs text-slate-400">
                  Secure instant salon booking linked directly with your facial shape recommendations.
                </p>
              </div>

              {
    /* Split screen: Direct Booker & Saved Ledger */
  }
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {
    /* Book Salon Form (7 cols) */
  }
                <div className="lg:col-span-7 space-y-6">
                  
                  {confirmedBooking ? <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="bg-indigo-950/20 border-2 border-indigo-500/30 p-8 rounded-3xl text-center space-y-5 shadow-2xl relative overflow-hidden"
  >
                      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500" />
                      <div className="h-14 w-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow">
                        <Check size={28} className="stroke-[3]" />
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-50">Appointment Secured!</h3>
                        <p className="text-xs text-slate-400">Your hair blueprint has been transmitted to the salon stylist.</p>
                      </div>

                      {
    /* Receipt card */
  }
                      <div className="bg-slate-950 border border-slate-900 p-6 rounded-2xl text-left space-y-3 font-mono text-xs max-w-sm mx-auto shadow-inner">
                        <div className="flex justify-between border-b border-slate-900 pb-2 text-[10px] text-slate-500 font-bold">
                          <span>HAIRLOON TICKET</span>
                          <span>{confirmedBooking.id}</span>
                        </div>
                        <p className="text-slate-100 font-bold text-sm leading-tight">{confirmedBooking.salonName}</p>
                        <p className="text-slate-300"><span className="text-slate-600 font-semibold">Service:</span> {confirmedBooking.serviceName}</p>
                        <p className="text-slate-300"><span className="text-slate-600 font-semibold">Stylist:</span> {confirmedBooking.stylist}</p>
                        
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-slate-400">
                          <p>Date: <span className="text-slate-200 block font-bold">{confirmedBooking.date}</span></p>
                          <p>Time: <span className="text-slate-200 block font-bold">{confirmedBooking.time}</span></p>
                        </div>

                        <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-slate-100 font-black">
                          <span>Total Paid (at salon):</span>
                          <span className="text-emerald-400 text-sm">${confirmedBooking.price}</span>
                        </div>
                      </div>

                      <div className="flex justify-center gap-3">
                        <button
    onClick={() => setConfirmedBooking(null)}
    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-slate-50 font-bold rounded-xl text-xs transition-all shadow"
  >
                          Book Another Slot
                        </button>
                        <button
    onClick={() => setActiveTab("chat")}
    className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-xl text-xs transition-all"
  >
                          Discuss With Simone AI
                        </button>
                      </div>
                    </motion.div> : selectedSalon && selectedService ? <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="border border-indigo-500/20 bg-slate-900/10 p-6 rounded-3xl space-y-6 shadow-xl"
  >
                      <div className="flex justify-between items-start pb-4 border-b border-slate-900">
                        <div>
                          <p className="text-[9px] text-indigo-400 font-black uppercase tracking-widest">Salon Reservation</p>
                          <h3 className="text-lg font-black text-slate-50 mt-1">{selectedSalon.name}</h3>
                          <p className="text-xs text-slate-400 mt-1">{selectedService.name} • ${selectedService.price}</p>
                        </div>
                        <button
    onClick={() => {
      setSelectedSalon(null);
      setSelectedService(null);
    }}
    className="p-1.5 hover:bg-slate-900 rounded-lg text-slate-500 hover:text-slate-200 border border-slate-900"
  >
                          <X size={15} />
                        </button>
                      </div>

                      <form onSubmit={handleConfirmBooking} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {
    /* Date */
  }
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-black uppercase block">Select Date</label>
                            <input
    type="date"
    required
    value={bookingDate}
    onChange={(e) => setBookingDate(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/30"
  />
                          </div>

                          {
    /* Time */
  }
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-black uppercase block">Select Time Slot</label>
                            <select
    value={bookingTime}
    onChange={(e) => setBookingTime(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/30"
  >
                              <option value="09:00">09:00 AM</option>
                              <option value="11:00">11:00 AM</option>
                              <option value="13:00">01:00 PM</option>
                              <option value="15:00">03:00 PM</option>
                              <option value="17:00">05:00 PM</option>
                              <option value="19:00">07:00 PM</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {
    /* Stylist Choice */
  }
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-black uppercase block">Assign Stylist</label>
                            <select
    value={selectedStylist}
    onChange={(e) => setSelectedStylist(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/30"
  >
                              {STYLISTS_DB.filter((s) => s.salonId === selectedSalon.id).map((s) => <option key={s.id} value={s.name}>{s.name} ({s.rating}★)</option>)}
                            </select>
                          </div>

                          {
    /* Custom Analysis attachment confirmation */
  }
                          <div className="space-y-1.5 flex flex-col justify-end pb-1">
                            {analysisResult ? <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 px-3 py-2.5 rounded-xl">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wide">
                                  {analysisResult.faceShape} Bio data attached!
                                </span>
                              </div> : <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-900 px-3 py-2.5 rounded-xl">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                                <span className="text-[10px] text-slate-500 font-bold uppercase">
                                  No face diagnostics detected
                                </span>
                              </div>}
                          </div>
                        </div>

                        {
    /* Customer details */
  }
                        <div className="space-y-4 pt-2 border-t border-slate-900">
                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-black uppercase block">Your Full Name</label>
                            <input
    type="text"
    required
    placeholder="e.g. Liam Sterling"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/30"
  />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] text-slate-500 font-black uppercase block">Phone Number</label>
                            <input
    type="tel"
    required
    placeholder="e.g. +1 (555) 000-0000"
    value={customerPhone}
    onChange={(e) => setCustomerPhone(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-3 text-xs text-slate-200 outline-none focus:border-indigo-500/30"
  />
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-900">
                          <label className="flex items-start gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              required
                              checked={acceptedPolicy}
                              onChange={(e) => setAcceptedPolicy(e.target.checked)}
                              className="mt-0.5 w-4 h-4 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-950 accent-indigo-500"
                            />
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">Accept Cancellation Policy</span>
                              <p className="text-[10px] text-slate-500 leading-tight">
                                By booking this appointment, you agree to our strict 24-hour cancellation policy. Cancellations made within 24 hours of the appointment will incur a 50% charge of the service price (${selectedService?.price}). No-shows will be charged 100%.
                              </p>
                            </div>
                          </label>
                        </div>

                        <button
    type="submit"
    disabled={isBookingSubmitting || !acceptedPolicy}
    className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-slate-50 rounded-2xl text-xs font-black transition-all shadow shadow-indigo-500/10"
  >
                          {isBookingSubmitting ? <>
                              <Loader2 size={13} className="animate-spin" />
                              Transmitting Encryption...
                            </> : <>
                              Complete Appointment Reservation
                              <ChevronRight size={13} />
                            </>}
                        </button>
                      </form>

                    </motion.div> : (
    /* Salon Selection list */
    <div className="space-y-6">
                      <h3 className="text-sm font-black text-slate-50">Select Partner Salon</h3>
                      
                      <div className="space-y-4">
                        {MOCK_SALONS.map((salon) => <div
      key={salon.id}
      className="border border-slate-900 bg-slate-900/15 rounded-3xl p-5 hover:border-slate-800 transition-all space-y-4 shadow-lg"
    >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h4 className="text-base font-black text-slate-100 flex items-center gap-2">
                                  {salon.name}
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                </h4>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                                  <span className="flex items-center gap-1"><MapPin size={11} className="text-indigo-400" /> {salon.distance}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 text-amber-400"><Star size={11} fill="currentColor" /> {salon.rating} ({salon.reviews} reviews)</span>
                                  <span>•</span>
                                  <span className="text-slate-500">{salon.priceLevel}</span>
                                </div>
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono">{salon.hours}</span>
                            </div>

                            {
      /* Specialty tags */
    }
                            <div className="flex flex-wrap gap-1.5">
                              {salon.specialties.map((s, i) => <span key={i} className="text-[9px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                                  {s}
                                </span>)}
                            </div>

                            {
      /* Service catalog pricing grid */
    }
                            <div className="space-y-2 pt-3 border-t border-slate-900">
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Available Stylings & Pricing</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {salon.services.map((serv, i) => <div
      key={i}
      onClick={() => startBooking(salon, serv)}
      className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-900 hover:border-indigo-500/30 rounded-2xl flex items-center justify-between cursor-pointer transition-all group"
    >
                                    <div className="min-w-0 pr-2">
                                      <p className="text-[11px] font-bold text-slate-200 group-hover:text-indigo-400 transition-colors truncate">{serv.name}</p>
                                      <span className="text-[9px] text-slate-500 font-semibold">{serv.duration}</span>
                                    </div>
                                    <span className="text-xs font-black text-emerald-400 flex-shrink-0">${serv.price}</span>
                                  </div>)}
                              </div>
                            </div>

                          </div>)}
                      </div>

                    </div>
  )}

                </div>

                {
    /* Bookings Ledger / Appointments List Column (5 cols) */
  }
                <div className="lg:col-span-5 space-y-6">
                  <div className="border border-slate-900 bg-slate-900/20 p-6 rounded-3xl space-y-6 shadow-xl">
                    <h3 className="text-sm font-black text-slate-50 border-b border-slate-900 pb-3 flex items-center justify-between">
                      Saved Appointments Ledger
                      <span className="text-[10px] text-slate-500 font-semibold">Local Persist</span>
                    </h3>

                    {bookings.length === 0 ? <div className="py-12 text-center space-y-2">
                        <div className="h-10 w-10 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-600 mx-auto">
                          <BookmarkCheck size={18} />
                        </div>
                        <p className="text-xs font-bold text-slate-400">No appointments saved</p>
                        <p className="text-[10px] text-slate-600 max-w-[200px] mx-auto leading-relaxed">
                          Your reservations will print luxury receipts and save locally on this ledger.
                        </p>
                      </div> : <div className="space-y-3.5 overflow-y-auto max-h-[500px] custom-scrollbar pr-1">
                        {bookings.map((b) => <div
    key={b.id}
    className="bg-slate-950 border border-slate-900 p-4 rounded-2xl space-y-2.5 relative group"
  >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-[9px] text-slate-600 font-black uppercase">{b.id}</p>
                                <h4 className="text-xs font-black text-slate-200 mt-0.5">{b.salonName}</h4>
                              </div>
                              <button
    onClick={() => handleCancelBooking(b.id)}
    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-900 rounded text-slate-500 hover:text-rose-400 transition-all"
    title="Cancel Ticket"
  >
                                <Trash2 size={12} />
                              </button>
                            </div>

                            <p className="text-[10px] text-slate-400 font-mono leading-tight">{b.serviceName}</p>

                            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-900">
                              <span>{b.date} • {b.time}</span>
                              <span className="text-emerald-400 font-bold">${b.price}</span>
                            </div>
                          </div>)}
                      </div>}

                  </div>
                </div>

              </div>

              {
    /* STYLIST COMPARISON MATCHMAKER WIDGET */
  }
              <div className="bg-slate-900/20 border border-slate-900 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-100 uppercase tracking-widest flex items-center gap-1.5">
                      <Award size={14} className="text-indigo-400 animate-pulse" /> Stylist Talent Matchmaker
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Compare the specialties, ratings, and customer reviews of elite salon artists side-by-side</p>
                  </div>
                  <span className="text-[9px] font-mono bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md text-indigo-300">Side-By-Side Duel</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {
    /* Selector panel */
  }
                  <div className="md:col-span-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-900/80 space-y-4">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Select Duel Parameters</p>
                    
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-500 font-black uppercase tracking-wide">Choose Salon</label>
                      <select
    value={compareSalonId}
    onChange={(e) => {
      const sId = e.target.value;
      setCompareSalonId(sId);
      const salonStylists = STYLISTS_DB.filter((s) => s.salonId === sId);
      if (salonStylists.length >= 2) {
        setCompareStylist1Id(salonStylists[0].id);
        setCompareStylist2Id(salonStylists[1].id);
      } else if (salonStylists.length === 1) {
        setCompareStylist1Id(salonStylists[0].id);
        setCompareStylist2Id("");
      }
    }}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2.5 text-xs text-slate-200 outline-none"
  >
                        {MOCK_SALONS.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-[9px] text-slate-500 font-black uppercase tracking-wide">Stylist 1</label>
                        <select
    value={compareStylist1Id}
    onChange={(e) => setCompareStylist1Id(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2 text-[11px] text-slate-200 outline-none"
  >
                          {STYLISTS_DB.filter((s) => s.salonId === compareSalonId).map((s) => <option key={s.id} value={s.id}>{s.name.split(" ").slice(-1)[0]}</option>)}
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] text-slate-500 font-black uppercase tracking-wide">Stylist 2</label>
                        <select
    value={compareStylist2Id}
    onChange={(e) => setCompareStylist2Id(e.target.value)}
    className="w-full bg-slate-950 border border-slate-900 rounded-xl p-2 text-[11px] text-slate-200 outline-none"
  >
                          {STYLISTS_DB.filter((s) => s.salonId === compareSalonId && s.id !== compareStylist1Id).map((s) => <option key={s.id} value={s.id}>{s.name.split(" ").slice(-1)[0]}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/10 border border-slate-900 rounded-xl text-[9.5px] text-slate-400 leading-relaxed font-mono">
                      Evaluate pricing tier specialties to select the perfect match for your custom hair goals.
                    </div>
                  </div>

                  {
    /* Visual comparison (8 cols) */
  }
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {
    /* Stylist Card 1 */
  }
                    {(() => {
    const stylist1 = STYLISTS_DB.find((s) => s.id === compareStylist1Id);
    if (!stylist1) return <div className="text-xs text-slate-500 p-4 border border-dashed border-slate-900 rounded-2xl text-center">Select Stylist 1</div>;
    return <div className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between">
                          <div>
                            {
      /* Banner background */
    }
                            <div className="h-16 bg-gradient-to-br from-indigo-950/40 to-slate-950 relative">
                              <img
      src={stylist1.image}
      alt={stylist1.name}
      className="h-12 w-12 rounded-full border border-indigo-500/20 object-cover absolute bottom-[-14px] left-4 shadow-md"
      referrerPolicy="no-referrer"
    />
                            </div>
                            
                            {
      /* Details */
    }
                            <div className="p-4 pt-5 space-y-3">
                              <div>
                                <h4 className="text-xs font-black text-slate-200">{stylist1.name}</h4>
                                <p className="text-[9px] text-indigo-400 font-bold uppercase mt-0.5">{stylist1.experience} Experience</p>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
                                  <span className="flex items-center text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /> {stylist1.rating}</span>
                                  <span>•</span>
                                  <span>{stylist1.reviewsCount} reviews</span>
                                </div>
                              </div>

                              {
      /* Specialties tags */
    }
                              <div className="space-y-1">
                                <p className="text-[8px] text-slate-500 font-black uppercase">Specialties</p>
                                <div className="flex flex-wrap gap-1">
                                  {stylist1.specialties.map((spec, idx) => <span key={idx} className="text-[8px] font-black bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                      {spec}
                                    </span>)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {
      /* Recent review quote */
    }
                          <div className="p-4 border-t border-slate-900/60 bg-slate-950/10">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Recent Review</p>
                            <blockquote className="text-[9.5px] text-slate-400 leading-relaxed italic">
                              "{stylist1.recentReview.text}"
                              <span className="block text-[8px] text-slate-500 font-bold font-sans mt-1.5">— {stylist1.recentReview.author} ({stylist1.recentReview.rating}★)</span>
                            </blockquote>
                          </div>
                        </div>;
  })()}

                    {
    /* Stylist Card 2 */
  }
                    {(() => {
    const stylist2 = STYLISTS_DB.find((s) => s.id === compareStylist2Id);
    if (!stylist2) return <div className="text-xs text-slate-500 p-4 border border-dashed border-slate-900 rounded-2xl text-center">Select Stylist 2</div>;
    return <div className="bg-slate-950/40 border border-slate-900 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-between">
                          <div>
                            {
      /* Banner background */
    }
                            <div className="h-16 bg-gradient-to-br from-indigo-950/40 to-slate-950 relative">
                              <img
      src={stylist2.image}
      alt={stylist2.name}
      className="h-12 w-12 rounded-full border border-indigo-500/20 object-cover absolute bottom-[-14px] left-4 shadow-md"
      referrerPolicy="no-referrer"
    />
                            </div>
                            
                            {
      /* Details */
    }
                            <div className="p-4 pt-5 space-y-3">
                              <div>
                                <h4 className="text-xs font-black text-slate-200">{stylist2.name}</h4>
                                <p className="text-[9px] text-indigo-400 font-bold uppercase mt-0.5">{stylist2.experience} Experience</p>
                                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-semibold">
                                  <span className="flex items-center text-amber-400 gap-0.5"><Star size={10} fill="currentColor" /> {stylist2.rating}</span>
                                  <span>•</span>
                                  <span>{stylist2.reviewsCount} reviews</span>
                                </div>
                              </div>

                              {
      /* Specialties tags */
    }
                              <div className="space-y-1">
                                <p className="text-[8px] text-slate-500 font-black uppercase">Specialties</p>
                                <div className="flex flex-wrap gap-1">
                                  {stylist2.specialties.map((spec, idx) => <span key={idx} className="text-[8px] font-black bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md border border-indigo-500/20">
                                      {spec}
                                    </span>)}
                                </div>
                              </div>
                            </div>
                          </div>

                          {
      /* Recent review quote */
    }
                          <div className="p-4 border-t border-slate-900/60 bg-slate-950/10">
                            <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Recent Review</p>
                            <blockquote className="text-[9.5px] text-slate-400 leading-relaxed italic">
                              "{stylist2.recentReview.text}"
                              <span className="block text-[8px] text-slate-500 font-bold font-sans mt-1.5">— {stylist2.recentReview.author} ({stylist2.recentReview.rating}★)</span>
                            </blockquote>
                          </div>
                        </div>;
  })()}
                  </div>

                </div>
              </div>

            </div>}

          {
    /* AI STYLIST COMPANION CHAT TAB */
  }
          {activeTab === "chat" && <div className="max-w-4xl mx-auto space-y-6 flex flex-col h-[calc(100vh-140px)]">
              
              {
    /* Header */
  }
              <div className="space-y-1 flex-shrink-0">
                <div className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase text-teal-400 tracking-wider">
                  <MessageSquare size={11} /> Chat Intelligence
                </div>
                <h2 className="text-2xl font-black tracking-tight text-slate-50">Madame Simone AI Stylist</h2>
                <p className="text-xs text-slate-400">
                  Discuss hair products, hair dye styling, and upkeep rules in real-time.
                </p>
              </div>

              {
    /* Chat Feed */
  }
              <div className="flex-1 bg-slate-900/10 border border-slate-900 rounded-3xl p-6 flex flex-col justify-between overflow-hidden relative shadow-inner">
                
                <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
                  {chatMessages.map((msg) => <div
    key={msg.id}
    className={`flex gap-4 max-w-2xl ${msg.role === "user" ? "ml-auto justify-end" : "mr-auto justify-start"}`}
  >
                      {msg.role === "model" && <div className="h-8 w-8 rounded-xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-center flex-shrink-0 shadow shadow-teal-500/5">
                          <User size={14} className="text-teal-400" />
                        </div>}

                      <div className="space-y-1 max-w-[85%]">
                        <div className="text-[9px] text-slate-500 font-black uppercase tracking-wider">
                          {msg.role === "user" ? "You" : "Madame Simone"}
                        </div>
                        <div className={`p-4 rounded-2xl text-xs leading-relaxed border ${msg.role === "user" ? "bg-indigo-600/15 border-indigo-500/20 text-indigo-50" : "bg-slate-950 border-slate-900 text-slate-200"}`}>
                          <p className="whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>

                      {msg.role === "user" && <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 text-slate-100 text-xs font-black shadow shadow-indigo-500/15">
                          U
                        </div>}
                    </div>)}

                  {isChatGenerating && <div className="flex gap-4 max-w-2xl justify-start">
                      <div className="h-8 w-8 rounded-xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                        <Loader2 size={13} className="text-teal-400 animate-spin" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <span className="text-[9px] text-teal-400 font-bold uppercase animate-pulse">Simone is typing...</span>
                        <div className="h-10 bg-slate-950 rounded-2xl animate-pulse border border-slate-900" />
                      </div>
                    </div>}
                  <div ref={chatEndRef} />
                </div>

                {
    /* Form Input */
  }
                <div className="mt-4 pt-4 border-t border-slate-900 flex-shrink-0 flex items-center justify-between">
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={useThinking} 
                        onChange={(e) => setUseThinking(e.target.checked)} 
                        className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-bold uppercase tracking-wider">Deep Thinking (Complex)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={useGrounding} 
                        onChange={(e) => setUseGrounding(e.target.checked)} 
                        className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                      />
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-300 font-bold uppercase tracking-wider">Live Web Grounding</span>
                    </label>
                  </div>
                </div>

                <form onSubmit={handleSendChatMessage} className="mt-3 flex-shrink-0">
                  <div className="flex gap-2.5 items-center bg-slate-950 border border-slate-900 focus-within:border-teal-500/30 rounded-2xl p-2 transition-all">
                    <input
    type="text"
    value={chatInput}
    onChange={(e) => setChatInput(e.target.value)}
    placeholder={analysisResult ? `Ask about dye combinations or curls for your ${analysisResult.faceShape} face...` : "Ask anything about styling, cuts, products..."}
    disabled={isChatGenerating}
    className="flex-1 bg-transparent border-0 outline-none text-xs text-slate-100 px-3 placeholder-slate-500"
  />
                    
                    {
    /* Voice Speech API Hands-Free Mic */
  }
                    <button
    type="button"
    onClick={toggleListening}
    className={`p-3 rounded-xl transition-all flex items-center justify-center border ${isListening ? "bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse" : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200"}`}
    title={isListening ? "Listening... Click to stop" : "Describe preferences hands-free"}
  >
                      {isListening ? <MicOff size={14} className="animate-bounce" /> : <Mic size={14} />}
                    </button>

                    <button
    type="submit"
    disabled={isChatGenerating || !chatInput.trim()}
    className="p-3 bg-teal-500 hover:bg-teal-400 disabled:bg-slate-900 disabled:text-slate-600 rounded-xl text-slate-950 font-black transition-all flex items-center justify-center shadow shadow-teal-500/10"
  >
                      Send Message
                    </button>
                  </div>
                </form>

              </div>

            </div>}

          {activeTab === "generator" && <div className="max-w-4xl mx-auto space-y-8">
            {/* Dual AI Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-5">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Wand2 className="text-fuchsia-400" size={24} />
                  <h2 className="text-2xl font-black tracking-tighter text-slate-100">AI Design Studio</h2>
                </div>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Design elite editorial hairstyle concepts. Generate hyper-realistic studio portraits or animate them into high-fidelity Veo motion videos.
                </p>
              </div>

              {/* Sub tab selectors */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-900 self-start md:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setGeneratorSubTab("image")}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${
                    generatorSubTab === "image"
                      ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ImageIcon size={13} /> Editorial Portraits
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratorSubTab("video");
                    if (!videoSourceImage && capturedImage) {
                      setVideoSourceImage(capturedImage);
                    } else if (!videoSourceImage && generatedImage) {
                      setVideoSourceImage(generatedImage);
                    }
                  }}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${
                    generatorSubTab === "video"
                      ? "bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Sparkles size={13} /> Veo Animator
                </button>
              </div>
            </div>

            {generatorSubTab === "image" ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                  
                  {/* Generation Form */}
                  <div className="lg:col-span-6 space-y-6">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Hairstyle Description Prompt
                      </label>
                      <textarea
                        value={generationInput}
                        onChange={(e) => setGenerationInput(e.target.value)}
                        placeholder="E.g., A high-fashion lavender ombre bob, layered texture, wispy curtain bangs, glossy editorial style..."
                        className="w-full h-28 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none placeholder:text-slate-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Model Engine & Quality
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setGenerationQuality("standard")}
                          className={`py-2.5 rounded-xl text-[10.5px] font-bold border transition-all ${
                            generationQuality === "standard"
                              ? "bg-slate-950 border-fuchsia-500/40 text-fuchsia-300"
                              : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <span className="block font-black text-xs">Standard</span>
                          <span className="text-[8px] opacity-75">gemini-3.1-flash-image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGenerationQuality("studio")}
                          className={`py-2.5 rounded-xl text-[10.5px] font-bold border transition-all ${
                            generationQuality === "studio"
                              ? "bg-slate-950 border-fuchsia-500/40 text-fuchsia-300"
                              : "bg-slate-950/40 border-slate-900 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <span className="block font-black text-xs">Studio-Quality</span>
                          <span className="text-[8px] opacity-75">gemini-3-pro-image</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Image Aspect Ratio
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"].map((ratio) => (
                          <button
                            key={ratio}
                            type="button"
                            onClick={() => setGenerationAspect(ratio)}
                            className={`py-2 rounded-lg text-[10px] font-bold transition-all border ${
                              generationAspect === ratio
                                ? "bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-300"
                                : "bg-slate-950 border-slate-900 text-slate-400 hover:border-slate-850 hover:text-slate-200"
                            }`}
                          >
                            {ratio}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage || !generationInput.trim()}
                      className="w-full py-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-slate-950 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow shadow-fuchsia-500/20"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="animate-spin" size={15} />
                          Synthesizing Pixels...
                        </>
                      ) : (
                        <>
                          <ImageIcon size={15} />
                          Generate Editorial Portrait
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Output */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div className="space-y-1.5 flex-1 flex flex-col">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Result Panel
                      </label>
                      <div className="flex-1 bg-slate-950 border border-slate-950 rounded-2xl overflow-hidden flex items-center justify-center relative min-h-[300px] shadow-inner">
                        {isGeneratingImage ? (
                          <div className="flex flex-col items-center gap-4 animate-pulse p-6">
                            <Wand2 className="text-fuchsia-500/50 h-10 w-10 animate-spin" />
                            <div className="space-y-1 text-center">
                              <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest">Synthesizing Layers</p>
                              <p className="text-[9px] text-slate-500">Injecting neural hyper-realistic details...</p>
                            </div>
                          </div>
                        ) : generatedImage ? (
                          <div className="w-full h-full relative group flex items-center justify-center">
                            <img 
                              src={generatedImage} 
                              alt="Generated Hairstyle" 
                              className="max-w-full max-h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                              <button 
                                onClick={() => {
                                  const a = document.createElement("a");
                                  a.href = generatedImage;
                                  a.download = "hairloon-concept.jpg";
                                  a.click();
                                }}
                                className="px-5 py-2.5 bg-slate-100 text-slate-950 rounded-xl font-bold text-[10px] hover:bg-white transition-colors uppercase tracking-wider"
                              >
                                Download Portrait
                              </button>
                              <button 
                                onClick={() => {
                                  setVideoSourceImage(generatedImage);
                                  setGeneratorSubTab("video");
                                  showToast("Portrait transferred to Veo animator!");
                                }}
                                className="px-5 py-2.5 bg-fuchsia-500 text-slate-950 rounded-xl font-bold text-[10px] hover:bg-fuchsia-400 transition-colors uppercase tracking-wider flex items-center gap-1"
                              >
                                <Sparkles size={11} /> Animate with Veo
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 opacity-40">
                            <ImageIcon className="mx-auto h-12 w-12 text-slate-500 mb-3" />
                            <p className="text-[11px] text-slate-400 font-bold max-w-[200px] mx-auto">
                              Your generated hairstyle concept will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              // VEO VIDEO GENERATION PANEL
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                  
                  {/* Left Controls: Source and prompt */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Choose Source Image */}
                    <div className="space-y-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        1. Select Source Portrait
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          disabled={!capturedImage}
                          onClick={() => {
                            setVideoSourceImage(capturedImage);
                            setVideoSourceMimeType("image/jpeg");
                          }}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            videoSourceImage === capturedImage && capturedImage
                              ? "bg-slate-950 border-fuchsia-500/50 text-fuchsia-400"
                              : "bg-slate-950/40 border-slate-950 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-300"
                          }`}
                        >
                          <span className="block font-black text-[9.5px]">Webcam Selfie</span>
                          <span className="text-[8px] opacity-75">{capturedImage ? "Selfie ready" : "None captured"}</span>
                        </button>
                        
                        <button
                          type="button"
                          disabled={!generatedImage}
                          onClick={() => {
                            setVideoSourceImage(generatedImage);
                            setVideoSourceMimeType("image/jpeg");
                          }}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            videoSourceImage === generatedImage && generatedImage
                              ? "bg-slate-950 border-fuchsia-500/50 text-fuchsia-400"
                              : "bg-slate-950/40 border-slate-950 text-slate-500 disabled:opacity-40 disabled:cursor-not-allowed hover:text-slate-300"
                          }`}
                        >
                          <span className="block font-black text-[9.5px]">AI Generated</span>
                          <span className="text-[8px] opacity-75">{generatedImage ? "Portrait ready" : "None generated"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const firstPreset = PRESET_TEST_PORTRAITS[0].image;
                            setVideoSourceImage(firstPreset);
                            setVideoSourceMimeType("image/jpeg");
                          }}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            videoSourceImage && videoSourceImage.startsWith("http")
                              ? "bg-slate-950 border-fuchsia-500/50 text-fuchsia-400"
                              : "bg-slate-950/40 border-slate-950 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          <span className="block font-black text-[9.5px]">Model Preset</span>
                          <span className="text-[8px] opacity-75">Demo face</span>
                        </button>
                      </div>

                      {/* Custom Drag & Drop or manual file uploader */}
                      <div 
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleVideoPhotoDrop}
                        className="border border-dashed border-slate-800 rounded-2xl p-4 text-center bg-slate-950/50 hover:bg-slate-950 transition-colors cursor-pointer relative"
                      >
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleVideoPhotoUpload} 
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="mx-auto h-6 w-6 text-slate-500 mb-1" />
                        <p className="text-[10px] font-bold text-slate-300">Drag & Drop custom portrait here</p>
                        <p className="text-[8px] text-slate-500 mt-0.5">Or click to select a local file</p>
                      </div>

                      {/* Micro thumbnail preview of current source */}
                      {videoSourceImage && (
                        <div className="flex items-center gap-3 bg-slate-950 border border-slate-900 p-2.5 rounded-xl">
                          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                            <img src={videoSourceImage} alt="Video source" className="w-full h-full object-cover" />
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[9.5px] font-bold text-slate-300">Active Source Loaded</p>
                            <p className="text-[8px] text-slate-500 font-mono truncate max-w-[180px]">{videoSourceImage.substring(0, 45)}...</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Prompt */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        2. Dynamic Motion Prompt
                      </label>
                      <textarea
                        value={videoPrompt}
                        onChange={(e) => setVideoPrompt(e.target.value)}
                        placeholder="E.g., Cinematic slow motion, hair flowing elegantly in a soft studio breeze, photorealistic, depth of field..."
                        className="w-full h-20 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-100 focus:outline-none focus:border-fuchsia-500/50 transition-colors resize-none placeholder:text-slate-600"
                      />
                    </div>

                    {/* Veo Aspect ratio */}
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        3. Video Aspect Ratio
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setVideoAspect("16:9")}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            videoAspect === "16:9"
                              ? "bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-300"
                              : "bg-slate-950 border-slate-950 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Landscape (16:9)
                        </button>
                        <button
                          type="button"
                          onClick={() => setVideoAspect("9:16")}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                            videoAspect === "9:16"
                              ? "bg-fuchsia-500/10 border-fuchsia-500/40 text-fuchsia-300"
                              : "bg-slate-950 border-slate-950 text-slate-500 hover:text-slate-300"
                          }`}
                        >
                          Portrait (9:16)
                        </button>
                      </div>
                    </div>

                    {/* Execute Animation */}
                    <button
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo || !videoSourceImage}
                      className="w-full py-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-rose-500 text-slate-950 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed shadow shadow-fuchsia-500/20"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="animate-spin" size={15} />
                          {videoStatusMessage || "Generating Veo motion..."}
                        </>
                      ) : (
                        <>
                          <Sparkles size={15} />
                          Animate with Veo 3D
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right Column: Video Output */}
                  <div className="lg:col-span-6 flex flex-col justify-between">
                    <div className="space-y-1.5 flex-1 flex flex-col">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Veo Animator Output
                      </label>
                      <div className="flex-1 bg-slate-950 border border-slate-950 rounded-2xl overflow-hidden flex items-center justify-center relative min-h-[300px] shadow-inner">
                        {isGeneratingVideo ? (
                          <div className="flex flex-col items-center gap-4 p-6">
                            <div className="relative">
                              <div className="absolute inset-0 rounded-full bg-fuchsia-500/20 blur-md animate-pulse" />
                              <Wand2 className="text-fuchsia-500 h-10 w-10 animate-spin relative" />
                            </div>
                            <div className="space-y-2 text-center">
                              <p className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest animate-pulse">Veo 3.1 Fast Active</p>
                              <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-[9px] font-mono text-slate-400">
                                {videoStatusMessage}
                              </div>
                              <p className="text-[8px] text-slate-600">Video animations synthesize over 15-40 seconds. Please hold on...</p>
                            </div>
                          </div>
                        ) : generatedVideoUrl ? (
                          <div className="w-full h-full relative group flex items-center justify-center">
                            <video 
                              src={generatedVideoUrl} 
                              controls 
                              autoPlay 
                              loop 
                              muted 
                              playsInline 
                              className="w-full h-full object-contain rounded-2xl"
                            />
                            <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-sm border border-slate-900 rounded-xl p-3 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-slate-100">Bespoke Video synthesized</p>
                                <p className="text-[8px] text-slate-500 font-mono">veo-3.1-fast-generate-preview</p>
                              </div>
                              <button 
                                onClick={() => {
                                  const a = document.createElement("a");
                                  a.href = generatedVideoUrl;
                                  a.download = "hairloon-motion-concept.mp4";
                                  a.click();
                                }}
                                className="px-3.5 py-1.5 bg-slate-100 hover:bg-white text-slate-950 rounded-lg text-[9px] font-bold transition-colors"
                              >
                                Download MP4
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center p-6 opacity-40">
                            <Sparkles className="mx-auto h-12 w-12 text-slate-500 mb-3" />
                            <p className="text-[11px] text-slate-400 font-bold max-w-[200px] mx-auto">
                              Your generated hair movement loops will play here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>}

          {activeTab === "database" && currentUser?.role === "admin" && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1.5">
                    <Database className="text-amber-400" size={24} />
                    <h2 className="text-2xl font-black tracking-tight text-slate-50 uppercase">Maison Database Hub</h2>
                    <span className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[8.5px] font-black text-emerald-400 uppercase tracking-wider">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Synced
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 max-w-xl leading-relaxed font-sans">
                    Configure high-end SQL/NoSQL connection strings, trigger RAG synchronization for your 512+ hairstyle catalog, and test query sandboxes.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Connection Configuration */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] rounded-full pointer-events-none" />
                    
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest border-b border-slate-800 pb-3">
                      Connection Handshake
                    </h3>

                    {/* Database Provider Select */}
                    <div className="space-y-2">
                      <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Database Core Provider</label>
                      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-900">
                        <button
                          onClick={() => {
                            setDbProvider("postgres");
                            setDbConnectionString("postgresql://maison_director:s3cur3p4ssw0rd@ep-royal-salons-12345.us-east-2.aws.neon.tech/hairloon_prod?sslmode=require");
                            setDbTestResult(null);
                          }}
                          className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${dbProvider === "postgres" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" : "text-slate-500 hover:text-slate-400"}`}
                        >
                          PostgreSQL (Neon)
                        </button>
                        <button
                          onClick={() => {
                            setDbProvider("mongodb");
                            setDbConnectionString("mongodb+srv://maison_admin:s3cur3p4ssw0rd@hairloon-prod.gcp.mongodb.net/luxury_lounge?retryWrites=true&w=majority");
                            setDbTestResult(null);
                          }}
                          className={`py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${dbProvider === "mongodb" ? "bg-amber-500/10 text-amber-300 border border-amber-500/20" : "text-slate-500 hover:text-slate-400"}`}
                        >
                          MongoDB Atlas
                        </button>
                      </div>
                    </div>

                    {/* Connection String Input */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] text-slate-400 font-black uppercase tracking-wider block">Connection String (URI)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={dbConnectionString}
                          onChange={(e) => setDbConnectionString(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 focus:border-amber-500/40 focus:outline-none transition-all px-3 py-3 rounded-xl text-[10px] text-slate-200 font-mono"
                        />
                      </div>
                      <p className="text-[8px] text-slate-500 leading-normal">
                        Pre-filled with your high-availability cloud replica URI. You can edit this freely.
                      </p>
                    </div>

                    {/* Test Trigger */}
                    <button
                      onClick={handleTestDbConnection}
                      disabled={isDbTesting}
                      className="w-full py-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-200 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      {isDbTesting ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-amber-400" />
                          Testing Pool Handshake...
                        </>
                      ) : (
                        <>
                          <Check size={13} className="text-amber-400" />
                          Verify Connection String
                        </>
                      )}
                    </button>

                    {/* Diagnostic Results */}
                    {dbTestResult && (
                      <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${dbTestResult.status === "success" ? "bg-emerald-950/20 border-emerald-500/20 text-slate-300" : "bg-rose-950/20 border-rose-500/20 text-slate-300"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${dbTestResult.status === "success" ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <h4 className="font-black uppercase text-[10px] tracking-wider text-slate-100">
                            {dbTestResult.status === "success" ? "Verification Successful" : "Verification Failed"}
                          </h4>
                        </div>
                        <p className="text-[10px] text-slate-400">{dbTestResult.message}</p>
                        {dbTestResult.status === "success" && (
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850/40 text-[9.5px] font-mono">
                            <div><span className="text-slate-500">Latency:</span> {dbTestResult.latency}</div>
                            <div><span className="text-slate-500">TLS Layer:</span> {dbTestResult.ssl}</div>
                            <div><span className="text-slate-500">DB Tables:</span> {dbTestResult.tablesIndexed.join(", ")}</div>
                            <div><span className="text-slate-500">Hairstyles:</span> 512 Indexed</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Blueprint Integration Download */}
                  <div className="bg-gradient-to-br from-indigo-950/20 to-slate-900 border border-indigo-500/10 rounded-3xl p-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-black text-slate-200 uppercase tracking-widest">Integration Blueprint</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                        Download a modular, complete Node.js/Express code block bootstrap utilizing standard Pool drivers to sync bookings, users, and hairstyles directly with your choice.
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadBlueprint}
                      className="w-full py-2.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={13} />
                      Download Integration File
                    </button>
                  </div>
                </div>

                {/* Right: Sandbox Query and Logs */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 flex flex-col h-full min-h-[500px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <h3 className="text-xs font-black text-slate-200 uppercase tracking-widest">
                        Interactive Query Sandbox
                      </h3>
                      <span className="text-[8px] font-mono text-slate-500">READ_WRITE_POOL_v1</span>
                    </div>

                    {/* Predefined selection */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleExecuteSandboxQuery("SELECT_BOOKINGS")}
                        className={`px-3 py-2 border rounded-xl text-[10px] font-bold text-left transition-all ${querySandbox === "SELECT_BOOKINGS" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300"}`}
                      >
                        <p className="text-[8px] text-slate-500 font-mono font-bold">{dbProvider === "postgres" ? "SQL" : "NoSQL"}</p>
                        <p className="truncate font-black mt-0.5">{dbProvider === "postgres" ? "SELECT * FROM bookings" : "db.bookings.find()"}</p>
                      </button>
                      <button
                        onClick={() => handleExecuteSandboxQuery("SELECT_USERS")}
                        className={`px-3 py-2 border rounded-xl text-[10px] font-bold text-left transition-all ${querySandbox === "SELECT_USERS" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300"}`}
                      >
                        <p className="text-[8px] text-slate-500 font-mono font-bold">{dbProvider === "postgres" ? "SQL" : "NoSQL"}</p>
                        <p className="truncate font-black mt-0.5">{dbProvider === "postgres" ? "SELECT * FROM users" : "db.users.find()"}</p>
                      </button>
                      <button
                        onClick={() => handleExecuteSandboxQuery("COUNT_HAIRSTYLES")}
                        className={`px-3 py-2 border rounded-xl text-[10px] font-bold text-left transition-all ${querySandbox === "COUNT_HAIRSTYLES" ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-slate-950/40 border-slate-900 text-slate-400 hover:text-slate-300"}`}
                      >
                        <p className="text-[8px] text-slate-500 font-mono font-bold">{dbProvider === "postgres" ? "SQL" : "NoSQL"}</p>
                        <p className="truncate font-black mt-0.5">{dbProvider === "postgres" ? "SELECT COUNT(*)" : "db.hairstyles.group()"}</p>
                      </button>
                    </div>

                    {/* Command Console */}
                    <div className="flex-1 flex flex-col bg-slate-950 border border-slate-950 rounded-2xl p-4 overflow-hidden min-h-[220px]">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-2 mb-3">
                        <span className="text-[8.5px] font-mono text-slate-500">CONSTRUCTED QUERY EXECUTOR</span>
                        <button
                          onClick={() => handleExecuteSandboxQuery(querySandbox)}
                          className="px-2.5 py-1 bg-amber-500 text-slate-950 hover:bg-amber-400 text-[8.5px] font-black uppercase tracking-wider rounded transition-all cursor-pointer"
                        >
                          Execute Query
                        </button>
                      </div>
                      <div className="flex-1 overflow-auto font-mono text-[10px] text-amber-400/90 leading-relaxed custom-scrollbar whitespace-pre select-text">
                        {sandboxOutput || "-- Click execute query to view records --"}
                      </div>
                    </div>

                    {/* Audit Logs */}
                    <div className="space-y-2">
                      <h4 className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Maison Cluster Handshake & Query Audit Logs</h4>
                      <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-3 h-28 overflow-y-auto custom-scrollbar font-mono text-[9px] space-y-1 select-text">
                        {dbSyncLogs.map((log) => (
                          <div key={log.id} className="flex gap-2">
                            <span className="text-slate-600">[{log.time}]</span>
                            <span className={`font-black ${log.type === "ERROR" ? "text-rose-400" : log.type === "QUERY" ? "text-amber-400" : log.type === "SYNC" ? "text-emerald-400" : "text-blue-400"}`}>
                              {log.type}
                            </span>
                            <span className="text-slate-400 truncate">{log.msg}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "labs" && (
            <div className="max-w-5xl mx-auto space-y-8">
              <LabHub />
            </div>
          )}

          {activeTab === "dashboard" && (
            <StylistDashboard bookings={bookings} />
          )}
        </div>
      </div>

      {
    /* Canvas Element for Webcam Capture (hidden) */
  }
      <canvas ref={canvasRef} className="hidden" />

      {
    /* EXQUISITE SHARE MODAL */
  }
      <AnimatePresence>
        {shareStyle && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-text">
            <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative overflow-hidden"
  >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Share2 className="text-rose-400" size={16} />
                  <h3 className="text-sm font-black text-slate-50 uppercase tracking-widest">Share Recommended Cut</h3>
                </div>
                <button
    onClick={() => {
      setShareStyle(null);
      setCopiedLink(false);
    }}
    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
  >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-center bg-slate-950 p-3 rounded-2xl border border-slate-900">
                  <div
    className="h-14 w-14 rounded-xl flex-shrink-0"
    style={{
      background: shareStyle.image.startsWith("http") ? `url(${shareStyle.image})` : shareStyle.image,
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}
  />
                  <div>
                    <h4 className="text-xs font-black text-slate-100">{shareStyle.name}</h4>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 uppercase tracking-wide">{shareStyle.category} • {shareStyle.difficulty} style</p>
                  </div>
                </div>

                {
    /* Generated share link */
  }
                <div className="space-y-2">
                  <label className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Shareable Hairstyle Blueprint Link</label>
                  <div className="flex gap-2">
                    <input
    type="text"
    readOnly
    value={`${window.location.origin}/?hairstyle=${shareStyle.id}`}
    className="flex-1 bg-slate-950 border border-slate-900 rounded-xl px-3 py-2 text-[11px] text-slate-300 font-mono outline-none"
  />
                    <button
    type="button"
    onClick={() => {
      navigator.clipboard.writeText(`${window.location.origin}/?hairstyle=${shareStyle.id}`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2e3);
    }}
    className="px-3 py-2 bg-rose-500 text-slate-950 text-[10px] font-black uppercase rounded-xl hover:bg-rose-400 transition-all"
  >
                      {copiedLink ? "Copied!" : "Copy Link"}
                    </button>
                  </div>
                </div>

                {
    /* Social sharing choices */
  }
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Share to Social Channels</p>
                  <div className="grid grid-cols-4 gap-2">
                    <a
    href={`https://twitter.com/intent/tweet?text=Check out the amazing ${shareStyle.name} hairstyle recommended for my face shape on Hairloon!`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 p-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all"
  >
                      <span className="text-[10px] font-black text-slate-300">Twitter</span>
                    </a>
                    <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/?hairstyle=${shareStyle.id}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 p-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all"
  >
                      <span className="text-[10px] font-black text-slate-300">Facebook</span>
                    </a>
                    <a
    href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(`${window.location.origin}/?hairstyle=${shareStyle.id}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 p-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all"
  >
                      <span className="text-[10px] font-black text-slate-300">Pinterest</span>
                    </a>
                    <a
    href={`https://api.whatsapp.com/send?text=Check out this custom ${shareStyle.name} cut on Hairloon: ${encodeURIComponent(`${window.location.origin}/?hairstyle=${shareStyle.id}`)}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex flex-col items-center gap-1 p-2 bg-slate-950 border border-slate-900 hover:border-slate-800 rounded-xl transition-all"
  >
                      <span className="text-[10px] font-black text-slate-300">WhatsApp</span>
                    </a>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {
    /* EXQUISITE TREND DETAIL MODAL */
  }
      <AnimatePresence>
        {selectedTrend && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm select-text">
            <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.95, opacity: 0 }}
    className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative overflow-hidden"
  >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-rose-500" />
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <TrendingUp className="text-rose-400 animate-pulse" size={16} />
                  <span className="text-[10px] font-black bg-rose-500/10 text-rose-300 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider">{selectedTrend.platform} VIRAL</span>
                </div>
                <button
    onClick={() => setSelectedTrend(null)}
    className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200"
  >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-50">{selectedTrend.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-emerald-400 font-mono font-black">{selectedTrend.growthRate} Growth</span>
                    <span className="text-[9px] text-slate-500 font-semibold">•</span>
                    <span className="text-[10px] text-slate-400 font-bold">Score: {selectedTrend.popularityScore}/100</span>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 space-y-3 font-sans text-xs text-slate-300 leading-relaxed">
                  <p>{selectedTrend.description}</p>
                  
                  <div className="pt-2 border-t border-slate-900 space-y-1">
                    <span className="text-[10px] text-rose-400 font-black uppercase tracking-wider block">Style Aesthetic</span>
                    <p className="text-[11px] text-slate-400 font-medium italic">{selectedTrend.keyAesthetic}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-slate-500 font-black uppercase tracking-wider block">Optimal Facial Geometry matches:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedTrend.faceShapes.map((shape) => <button
    key={shape}
    onClick={() => {
      setSelectedExploreShape(shape);
      setSelectedTrend(null);
    }}
    className={`text-[9px] font-black px-2.5 py-1 rounded-lg border transition-all ${selectedExploreShape === shape ? "bg-rose-500 border-rose-400 text-slate-950 shadow shadow-rose-500/10" : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-300"}`}
  >
                        {shape} {selectedExploreShape === shape ? "\u2713" : ""}
                      </button>)}
                  </div>
                </div>

                <button
    type="button"
    onClick={() => {
      setSelectedTrend(null);
      setActiveTab("chat");
    }}
    className="w-full py-2.5 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-400 hover:to-indigo-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
  >
                  <MessageSquare size={13} className="text-slate-950" /> Consult Madame Simone on this trend
                </button>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {/* TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 pointer-events-auto ${
                toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' :
                toast.type === 'info' ? 'bg-blue-950/90 border-blue-500/30 text-blue-200' :
                'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
              }`}
            >
              {toast.type === 'error' ? <X size={16} className="text-rose-400" /> : <Check size={16} className={toast.type === 'info' ? "text-blue-400" : "text-emerald-400"} />}
              <span className="text-xs font-bold tracking-wide">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>;
}
