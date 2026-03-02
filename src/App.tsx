import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Volume2, VolumeX, RefreshCcw, Music, Star, Sparkles, PenTool, Share2, Download } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// --- Configuration ---
const MEMORIES = [
  { text: "The day we first met", date: "Oct 12", emoji: "✨" },
  { text: "Our first coffee date", date: "Oct 15", emoji: "☕" },
  { text: "That sunset at the beach", date: "Nov 03", emoji: "🌅" },
  { text: "Laughing until we cried", date: "Dec 25", emoji: "😂" },
  { text: "Saying 'I love you'", date: "Jan 01", emoji: "❤️" },
  { text: "Every morning with you", date: "Always", emoji: "☀️" }
];

const FINAL_MESSAGE = "Happy Valentine's Day! You are the beat of my heart and the joy in my soul. I'm so lucky to have you in my life.";

// --- Components ---

interface MemoryCardProps {
  memory: { text: string; date: string; emoji: string };
  index: number;
  isActive: boolean;
}

const MemoryCard: React.FC<MemoryCardProps> = ({ memory, index, isActive }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
      animate={isActive ? { opacity: 1, rotateY: 0, scale: 1 } : { opacity: 0, rotateY: -90, scale: 0.8 }}
      transition={{ duration: 0.6, type: "spring" }}
      className="absolute w-64 h-80 glass rounded-2xl p-6 flex flex-col items-center justify-between border-2 border-white/40 shadow-xl backface-hidden"
      style={{ zIndex: isActive ? 10 : 0 }}
    >
      <div className="w-full flex justify-end">
        <span className="text-xs font-mono text-romantic-500 bg-white/50 px-2 py-1 rounded-full">{memory.date}</span>
      </div>
      <div className="text-6xl filter drop-shadow-lg animate-bounce">{memory.emoji}</div>
      <p className="text-center font-display text-xl text-romantic-900 leading-relaxed">{memory.text}</p>
      <div className="w-full flex justify-center">
        <Heart size={16} className="text-romantic-400 fill-romantic-400" />
      </div>
    </motion.div>
  );
};

function StarConstellation({ show }: { show: boolean }) {
  // Heart shape coordinates (normalized 0-100)
  const stars = [
    { x: 50, y: 80 }, { x: 35, y: 65 }, { x: 65, y: 65 },
    { x: 20, y: 45 }, { x: 80, y: 45 }, { x: 15, y: 30 },
    { x: 85, y: 30 }, { x: 30, y: 20 }, { x: 70, y: 20 },
    { x: 50, y: 35 }
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <svg className="w-full h-full opacity-30">
            <motion.path
              d="M 50 80 L 35 65 L 20 45 L 15 30 L 30 20 L 50 35 L 70 20 L 85 30 L 80 45 L 65 65 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </svg>
          {stars.map((star, i) => (
            <motion.div
              key={i}
              className="absolute text-yellow-200"
              initial={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, scale: 0 }}
              animate={{ left: `${star.x}%`, top: `${star.y}%`, scale: 1 }}
              transition={{ duration: 2, delay: i * 0.1 }}
            >
              <Star size={12} fill="currentColor" className="animate-pulse" />
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function HeartDrawing({ onComplete }: { onComplete: (image: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const pathsRef = useRef<{x: number, y: number}[][]>([]);
  const currentPathRef = useRef<{x: number, y: number}[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    renderCanvas(ctx);
  }, []);

  const renderCanvas = (ctx: CanvasRenderingContext2D) => {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    
    ctx.clearRect(0, 0, w, h);
    
    // Draw Guide
    ctx.save();
    ctx.beginPath();
    const scale = Math.min(w, h) / 300;
    ctx.translate(w/2, h/2 - 20 * scale);
    ctx.scale(scale, scale);
    
    // Heart path
    ctx.moveTo(0, -60);
    ctx.bezierCurveTo(0, -70, -100, -100, -100, -20);
    ctx.bezierCurveTo(-100, 60, 0, 100, 0, 140);
    ctx.bezierCurveTo(0, 100, 100, 60, 100, -20);
    ctx.bezierCurveTo(100, -100, 0, -70, 0, -60);
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 10]);
    ctx.stroke();
    ctx.restore();

    // Draw User Paths - Multi-layered Glow
    const allPaths = [...pathsRef.current, currentPathRef.current];
    
    // Define glow layers for dynamic effect
    const layers = [
      { color: 'rgba(244, 63, 94, 0.3)', width: 20, blur: 30 }, // Outer glow
      { color: '#f43f5e', width: 8, blur: 15 },                 // Core glow
      { color: '#ffffff', width: 3, blur: 5 }                   // Center highlight
    ];

    layers.forEach(layer => {
      ctx.save();
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = layer.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = layer.blur;
      ctx.shadowColor = '#f43f5e';
      
      allPaths.forEach(path => {
          if (path.length < 2) return;
          
          ctx.beginPath();
          ctx.moveTo(path[0].x, path[0].y);
          
          for (let i = 1; i < path.length - 2; i++) {
              const xc = (path[i].x + path[i + 1].x) / 2;
              const yc = (path[i].y + path[i + 1].y) / 2;
              ctx.quadraticCurveTo(path[i].x, path[i].y, xc, yc);
          }
          
          if (path.length > 2) {
              ctx.quadraticCurveTo(
                  path[path.length - 2].x,
                  path[path.length - 2].y,
                  path[path.length - 1].x,
                  path[path.length - 1].y
              );
          } else {
               ctx.lineTo(path[1].x, path[1].y);
          }
          ctx.stroke();
      });
      ctx.restore();
    });
  };

  const getPoint = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    currentPathRef.current = [getPoint(e)];
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) renderCanvas(ctx);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    // Prevent scrolling on touch devices
    if ('touches' in e) {
       // e.preventDefault(); // Note: React synthetic events might be passive, handled by touch-action: none
    }

    const point = getPoint(e);
    const path = currentPathRef.current;
    
    // Smoothing: Only add point if it's far enough from the last one to reduce jitter
    if (path.length > 0) {
        const lastPoint = path[path.length - 1];
        const dx = point.x - lastPoint.x;
        const dy = point.y - lastPoint.y;
        // Reduced threshold to 9 (3px) for more fluid feel while still reducing jitter
        if (dx * dx + dy * dy < 9) return; 
    }
    
    currentPathRef.current.push(point);
    
    const canvas = canvasRef.current;
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) renderCanvas(ctx);
    }
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    if (isDrawing) {
        setIsDrawing(false);
        if (currentPathRef.current.length > 0) {
            pathsRef.current.push(currentPathRef.current);
            currentPathRef.current = [];
        }
    }
  };

  const resetDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    pathsRef.current = [];
    currentPathRef.current = [];
    setHasDrawn(false);
    renderCanvas(ctx);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="relative w-full h-64 bg-white/30 rounded-xl overflow-hidden border-2 border-dashed border-romantic-300">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 touch-none cursor-crosshair w-full h-full"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
             <p className="text-romantic-700 font-display text-lg">Trace the heart ❤️</p>
          </div>
        )}
      </div>
      
      {hasDrawn && (
        <div className="flex gap-3">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={resetDrawing}
            className="p-3 rounded-full bg-white/50 text-romantic-600 hover:bg-white/80 transition-colors shadow-sm"
            title="Reset Drawing"
          >
            <RefreshCcw size={20} />
          </motion.button>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              const canvas = canvasRef.current;
              if (canvas) {
                onComplete(canvas.toDataURL('image/png'));
              }
            }}
            className="px-6 py-2 rounded-full bg-romantic-500 text-white font-semibold hover:bg-romantic-600 transition-colors shadow-lg flex items-center gap-2"
          >
            <Heart size={16} fill="currentColor" />
            Seal with Love
          </motion.button>
        </div>
      )}
    </div>
  );
}

function TypewriterText({ text, start, speed = 40 }: { text: string; start: boolean; speed?: number }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: speed / 1000 },
    },
  };

  const child = {
    hidden: { 
      opacity: 0, 
      y: 5, 
      filter: "blur(4px)",
      scale: 1.1 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      scale: 1,
      transition: { 
        type: "spring", 
        damping: 12, 
        stiffness: 200 
      } 
    },
  };

  return (
    <motion.div
      className="inline-flex flex-wrap gap-x-1.5 gap-y-1 justify-center"
      variants={container}
      initial="hidden"
      animate={start ? "visible" : "hidden"}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block whitespace-nowrap">
          {word.split("").map((char, j) => (
            <motion.span
              key={j}
              variants={child}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}

function ScratchReveal({ children, onReveal }: { children: React.ReactNode; onReveal: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Fill with "fog"
    ctx.fillStyle = '#fecdd3'; // romantic-200
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add text hint
    ctx.font = '20px Inter';
    ctx.fillStyle = '#be123c';
    ctx.textAlign = 'center';
    ctx.fillText("Scratch to reveal secret...", canvas.width / 2, canvas.height / 2);

    ctx.globalCompositeOperation = 'destination-out';
  }, []);

  const handleScratch = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();

    // Check if enough is revealed
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparentPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparentPixels++;
    }
    
    if (transparentPixels / (canvas.width * canvas.height) > 0.4) {
      setIsRevealed(true);
      onReveal();
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden rounded-xl">
      <div className={`absolute inset-0 transition-opacity duration-700 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 touch-none cursor-crosshair transition-opacity duration-700 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onMouseMove={handleScratch}
        onTouchMove={handleScratch}
      />
    </div>
  );
}

function HeartbeatRipple({ trigger }: { trigger: number }) {
  const [ripples, setRipples] = useState<{id: number}[]>([]);

  useEffect(() => {
    if (trigger > 0) {
      const id = Date.now();
      setRipples(prev => [...prev, { id }]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== id));
      }, 2000);
    }
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-0">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ width: '0vmin', height: '0vmin', opacity: 0.8, borderWidth: '50px' }}
            animate={{ width: '150vmin', height: '150vmin', opacity: 0, borderWidth: '0px' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute rounded-full border-romantic-500/40"
            style={{ borderStyle: 'solid' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; mins: number; secs: number } | null>(null);

  useEffect(() => {
    const target = new Date('2027-02-14T00:00:00');
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / 1000 / 60) % 60),
        secs: Math.floor((diff / 1000) % 60)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="flex gap-4 justify-center text-romantic-800 font-mono text-xs">
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.days}</span>
        <span className="opacity-60 uppercase text-[10px]">Days</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.hours}</span>
        <span className="opacity-60 uppercase text-[10px]">Hrs</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.mins}</span>
        <span className="opacity-60 uppercase text-[10px]">Min</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold">{timeLeft.secs}</span>
        <span className="opacity-60 uppercase text-[10px]">Sec</span>
      </div>
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState<'landing' | 'memory-lane' | 'reveal'>('landing');
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [isMuted, setIsMuted] = useState(true);
  const [hearts, setHearts] = useState<{ id: number; left: string; size: number; duration: number; delay: number }[]>([]);
  const [showConstellation, setShowConstellation] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [sealedImage, setSealedImage] = useState<string | null>(null);
  const [beatTrigger, setBeatTrigger] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Initialize floating hearts
  useEffect(() => {
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
    setHearts(newHearts);
  }, []);

  // Heartbeat sound synthesizer
  const playHeartbeatSound = useCallback(() => {
    if (isMuted) return;
    
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    
    const playThump = (time: number, freq: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      gain.gain.setValueAtTime(volume, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.1);
    };

    const now = ctx.currentTime;
    // Double beat: Lub-dub
    playThump(now, 60, 0.5);
    playThump(now + 0.15, 45, 0.4);
  }, [isMuted]);

  // Handle memory lane sequence
  useEffect(() => {
    if (phase === 'memory-lane') {
      let index = -1;
      const interval = setInterval(() => {
        playHeartbeatSound();
        setBeatTrigger(prev => prev + 1);
        
        // Vibration feedback for mobile
        if ('vibrate' in navigator) {
          navigator.vibrate([50, 30, 50]);
        }
        
        if (index < MEMORIES.length) {
          index++;
          setCurrentMemoryIndex(index);
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setPhase('reveal');
            setShowConstellation(true);
          }, 2000);
        }
      }, 2000); // Slower pace for reading memories

      return () => clearInterval(interval);
    }
  }, [phase, playHeartbeatSound]);

  const startExperience = () => {
    // Resume audio context on user interaction
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setPhase('memory-lane');
  };

  const resetExperience = () => {
    setPhase('landing');
    setCurrentMemoryIndex(-1);
    setShowConstellation(false);
    setIsRevealed(false);
    setIsSealed(false);
    setSealedImage(null);
  };

  const handleShare = async () => {
    if (!sealedImage) return;
    
    try {
      const res = await fetch(sealedImage);
      const blob = await res.blob();
      const file = new File([blob], "our-heart.png", { type: "image/png" });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'Our Sealed Love',
          text: 'I drew this heart for you! ❤️',
          files: [file],
        });
      } else {
        const link = document.createElement('a');
        link.href = sealedImage;
        link.download = 'our-heart.png';
        link.click();
      }
    } catch (err) {
      console.error("Error sharing:", err);
      const link = document.createElement('a');
      link.href = sealedImage;
      link.download = 'our-heart.png';
      link.click();
    }
  };

  return (
    <>
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-romantic-100 via-romantic-200 to-purple-200">
      {/* Heartbeat Visual Effects */}
      <HeartbeatRipple trigger={beatTrigger} />
      
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 bg-romantic-500/10 mix-blend-overlay"
        animate={beatTrigger > 0 ? { opacity: [0, 0.4, 0] } : { opacity: 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Main Content Wrapper with Scale Effect */}
      <motion.div 
        className="relative z-10 w-full h-full flex items-center justify-center"
        animate={phase === 'memory-lane' && beatTrigger > 0 ? { scale: [1, 1.05, 1] } : { scale: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Floating Hearts Background */}
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart text-romantic-400/30"
            style={{
              left: heart.left,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            <Heart fill="currentColor" />
          </div>
        ))}
  
        <StarConstellation show={showConstellation} />
  
        {/* Controls */}
        <div className="absolute top-6 right-6 z-50 flex gap-4 pointer-events-auto">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full glass hover:bg-white/20 transition-colors text-romantic-600"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
  
        <main className="relative z-10 w-full max-w-md px-6 pointer-events-auto">
        <AnimatePresence mode="wait">
          {phase === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="glass p-10 rounded-3xl text-center space-y-8"
            >
              <h1 className="font-display text-3xl text-romantic-800 font-semibold leading-tight">
                Tap to see what my heart says...
              </h1>
              
              <div className="flex justify-center">
                <button
                  onClick={startExperience}
                  className="group relative p-8 rounded-full bg-romantic-500 text-white shadow-lg animate-pulse-glow hover:scale-110 transition-transform duration-300"
                >
                  <Heart size={48} fill="currentColor" className="group-hover:animate-heartbeat" />
                </button>
              </div>
              <p className="text-romantic-600/80 text-sm italic">
                Make sure your sound is on for the best experience
              </p>
              
              <div className="pt-4 border-t border-romantic-200/50">
                <p className="text-[10px] uppercase tracking-widest text-romantic-400 mb-3">Countdown to Valentine's Day 2027</p>
                <Countdown />
              </div>
            </motion.div>
          )}

          {phase === 'memory-lane' && (
            <motion.div
              key="memory-lane"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[400px] w-full flex items-center justify-center perspective-1000"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                 <Heart
                  size={100}
                  fill="#f43f5e"
                  className="text-romantic-500 animate-heartbeat opacity-20"
                />
              </div>
              
              <AnimatePresence>
                {currentMemoryIndex >= 0 && currentMemoryIndex < MEMORIES.length && (
                  <MemoryCard
                    key={currentMemoryIndex}
                    memory={MEMORIES[currentMemoryIndex]}
                    index={currentMemoryIndex}
                    isActive={true}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'reveal' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass p-8 rounded-3xl text-center space-y-6 shadow-2xl border-white/30"
            >
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-romantic-100 text-romantic-500 animate-pulse">
                  <Sparkles size={32} />
                </div>
              </div>
              
              <h2 className="font-display text-3xl text-romantic-900 font-bold">
                My Dearest Love,
              </h2>
              
              <div className="space-y-4">
                {!isSealed ? (
                  <>
                    <div className="h-40 w-full rounded-xl overflow-hidden shadow-inner bg-white/40">
                      <ScratchReveal onReveal={() => setIsRevealed(true)}>
                        <motion.div 
                          className="w-full h-full flex items-center justify-center p-4 bg-romantic-100"
                          animate={isRevealed ? { backgroundColor: ["#ffe4e6", "#fecdd3", "#ffe4e6"] } : {}}
                          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="text-romantic-800 font-display text-lg leading-relaxed text-center w-full">
                            <TypewriterText text={FINAL_MESSAGE} start={isRevealed} speed={30} />
                          </div>
                        </motion.div>
                      </ScratchReveal>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={isRevealed ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                       <HeartDrawing onComplete={(img) => {
                         setSealedImage(img);
                         setIsSealed(true);
                       }} />
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center gap-6 py-8"
                  >
                    <div className="relative">
                      <div className="p-6 rounded-full bg-romantic-100 text-romantic-500 animate-pulse shadow-[0_0_40px_rgba(244,63,94,0.4)]">
                        {sealedImage ? (
                          <img src={sealedImage} alt="Sealed Heart" className="w-32 h-32 object-contain" />
                        ) : (
                          <Heart size={64} fill="currentColor" />
                        )}
                      </div>
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -bottom-2 -right-2 bg-white text-romantic-500 p-2 rounded-full shadow-lg"
                      >
                        <Heart size={20} fill="currentColor" />
                      </motion.div>
                    </div>

                    <h3 className="font-display text-2xl text-romantic-800 font-bold">
                      Our Love is Sealed Forever
                    </h3>
                    <p className="text-romantic-600 italic">
                      "I love you more than words can say."
                    </p>
                    
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-romantic-500 text-white font-semibold hover:bg-romantic-600 transition-colors shadow-lg"
                      >
                        <Share2 size={18} />
                        Share Love
                      </button>
                      <button
                        onClick={resetExperience}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/50 text-romantic-700 font-semibold hover:bg-white/80 transition-colors shadow-sm"
                      >
                        <RefreshCcw size={18} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </motion.div>

      {/* Background Overlay for Memory Phase */}
      <AnimatePresence>
        {phase === 'memory-lane' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-0 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
    </div>
    <Analytics />
  </>
  );
}
