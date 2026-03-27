import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Microscope, Monitor, Printer, Server, Cpu, Database, Laptop, CloudRain, Wind, Zap,
  CloudSnow, Snowflake, LineChart, ArrowRight, Droplets, Droplet, BarChart, 
  CircleDot, Target, CloudLightning, TrendingDown, CloudFog, Sun, Activity,
  Thermometer, Settings, Radar, Camera
} from 'lucide-react';

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
};

const getArcLine = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y,
    "A", r, r, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
};

const getWigglyCircle = (cx: number, cy: number, baseR: number, waves1: number, amp1: number, waves2: number, amp2: number, phase: number = 0) => {
  const points = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r = baseR + Math.sin(angle * waves1 + phase) * amp1 + Math.cos(angle * waves2 + phase * 0.7) * amp2;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
  }
  points.push('Z');
  return points.join(' ');
};

const getArcPath = (cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number) => {
  const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
  const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
  const startInner = polarToCartesian(cx, cy, innerR, endAngle);
  const endInner = polarToCartesian(cx, cy, innerR, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", startOuter.x, startOuter.y,
    "A", outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
    "L", endInner.x, endInner.y,
    "A", innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
    "Z"
  ].join(" ");
};

const sectors = [
  { year: "01", date: "原理手段", products: ["原理与", "手段"], icon: CloudRain, r3Text: "", outerEvent: "核心理论突破" },
  { year: "02", date: "发展历程", products: ["发展历程"], icon: Wind, r3Text: "", outerEvent: "历史沿革" },
  { year: "03", date: "技术进展", products: ["技术进展"], icon: Zap, r3Text: "", outerEvent: "科研突破" },
  { year: "04", date: "作业装备", products: ["作业装备"], icon: Server, r3Text: "", outerEvent: "装备升级" },
  { year: "05", date: "工作体系", products: ["工作体系"], icon: Database, r3Text: "", outerEvent: "体系建设" },
  { year: "06", date: "业务需求", products: ["业务需求"], icon: Monitor, r3Text: "", outerEvent: "需求分析" },
  { year: "07", date: "业务现状", products: ["业务现状"], icon: Laptop, r3Text: "", outerEvent: "现状总结" },
];

const historyEvents = [
  { year: "01", date: "原理手段", event: "介绍人工影响天气的科学原理，包括催化剂播撒、热力影响等多种技术手段。" },
  { year: "02", date: "发展历程", event: "回顾我国人工影响天气事业从无到有、从小到大的辉煌发展历程。" },
  { year: "03", date: "技术进展", event: "展示近年来在数值模拟、探测技术及催化技术等方面的最新科研成果。" },
  { year: "04", date: "作业装备", event: "介绍现代化的人工影响天气作业飞机、火箭、高炮及地面烟炉等装备。" },
  { year: "05", date: "工作体系", event: "构建国家、省、市、县四级联动的人工影响天气指挥与作业体系。" },
  { year: "06", date: "业务需求", event: "分析农业抗旱、防雹、生态修复及重大活动保障等方面的实际业务需求。" },
  { year: "07", date: "业务现状", event: "总结当前业务运行规模、技术水平及在防灾减灾中发挥的重要作用。" },
];

const developmentHistory = [
  {
    year: "1958",
    items: [
      "中国气象局决定开展人工影响局部天气试验研究，开启事业篇章",
      "吉林开展第一次飞机人工增雨",
      "福建古田随机催化试验"
    ],
    imageAlt: "吉林第一次飞机增雨作业",
    imageSrc: "https://images.unsplash.com/photo-1559087867-ce4c9124cb9d?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "1980",
    items: [
      "全面加强科学试验，推动新型作业装备的引进与自主研发进程",
      "加强科学试验",
      "新型作业装备引进和研发"
    ],
    imageAlt: "气象科学试验",
    imageSrc: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "1987",
    items: [
      "社会需求大大提升，科学试验增强带动探测与作业装备技术飞跃",
      "需求大大提升",
      "科学试验增强，探测、作业装备技术提升",
      "云降水数值模式应用",
      "作业指挥体系优化改进"
    ],
    imageAlt: "人影火箭",
    imageSrc: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=600"
  },
  {
    year: "2026",
    items: [
      "立足新要求高标准，全面推动人工影响天气事业高质量转型发展",
      "新要求、高标准",
      "转型发展，人影高质量发展"
    ],
    imageAlt: "高性能人影飞机",
    imageSrc: "https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=600"
  }
];

const principles = [
  {
    title: "冷云催化",
    conditions: "如果云中过冷云滴多，而自然冰晶太少，贝吉龙过程不充分。",
    methods: "向云中播入冰核（如碘化银）或致冷剂（如干冰、液氮），产生大量的冰晶，加快冰水转化的贝吉龙过程，形成大量冰晶，加快降水过程，提高降水效率。",
    mechanism: "温度为0～-30°C的云中，往往存在过冷却水滴，若在这种云中播撒碘化银或固体二氧化碳（干冰）等成冰催化剂，可以生成大量的人工冰晶。这类催化剂的成冰效率很高，1克催化剂就可生成数量级为1万亿个的冰晶。在某些云中，人工冰晶通过伯杰龙过程可形成降水，从而达到人工降水的目的。在强对流云中，人工冰晶能长大成冰雹胚胎，同自然冰雹争夺水分，使各个冰雹都不能长成危害严重的大雹块，达到防雹目的。在过冷云（雾）中，人工冰晶使云（雾）滴蒸发而自身长大下落，又可达到消云（雾）的目的。在冷云催化过程中释放的巨大潜热会改变云的热力、动力过程，着力于这种动力效应的催化称为动力催化。",
    support: "依赖雷达监测云层结构、卫星云图分析天气系统，以及数值模式预测催化时机。",
    icons: [
      { icon: CloudSnow },
      { icon: Snowflake },
      { icon: LineChart }
    ],
    types: [
      { name: "静力催化", desc: "在因缺乏冰晶而不降水的过冷层状云中人工引入浓度为10~100/L的冰晶，可发动或加速贝吉龙过程", tag: "我国北方大多数层状云增雨作业" },
      { name: "动力催化", desc: "引入过量催化剂，使云全部冰晶化，潜热加热空气，浮力增加，导致云体增强，最终产生更多降水。从影响云的微观结构得到影响云的动力场的结果。", tag: "适用于水汽丰沛的积状云" }
    ]
  },
  {
    title: "暖云催化",
    conditions: "云滴大小均匀，碰并过程微弱，难以形成降水。",
    methods: "向云中播撒吸湿性核（如盐粉）或大水滴，改变云滴谱分布，促进碰并过程，使云滴迅速长大成雨滴落下。",
    mechanism: "向温度高于0℃的暖云中播撒吸湿性核（如盐粉），促进云滴碰并增长，形成大雨滴降落。",
    support: "需要高分辨率气象雷达实时监测云中含水量和上升气流分布。",
    icons: [
      { icon: Droplets },
      { icon: Droplet },
      { icon: BarChart }
    ],
    types: [
      { name: "吸湿性催化", desc: "利用盐粉等吸湿性物质在云中吸收水汽凝结增长，形成大云滴，启动碰并过程。", tag: "常见于南方暖云增雨" }
    ]
  },
  {
    title: "人工防雹",
    conditions: "强对流云中存在丰富的过冷水和强烈的上升气流，冰雹胚胎迅速生长。",
    methods: "向冰雹云中播撒大量人工冰核（如碘化银），产生大量冰晶，与自然雹胚竞争过冷水（“争水”机制），使雹胚不能长成大冰雹，而是以小冰雹或雨滴形式降落。",
    mechanism: "通过向冰雹云中播撒大量人工冰核，产生大量冰晶，这些冰晶与自然雹胚竞争过冷水，使得雹胚无法获得足够的水分长成大冰雹，从而以小冰雹或雨滴的形式降落，减轻冰雹灾害。",
    support: "利用双偏振雷达识别冰雹云，结合闪电定位系统和三维风场数据，精准锁定作业区域。",
    icons: [
      { icon: CloudLightning },
      { icon: CircleDot },
      { icon: Target }
    ],
    types: [
      { name: "竞争繁生", desc: "大量人工冰核形成众多小冰晶，消耗云中过冷水，抑制大冰雹生长。", tag: "主要防雹机制" }
    ]
  },
  {
    title: "人工消减雨/雪",
    conditions: "在重大活动或特定区域需要避免降水时。",
    methods: "在目标区上风方进行超量播撒，使云中产生过量冰晶，水汽竞争导致冰晶无法长到能降落的大小，或者提前在目标区外促使云层降水（“截留”）。",
    mechanism: "通过在目标区上风方进行超量播撒，使云中产生过量冰晶，导致水汽竞争，冰晶无法长到能降落的大小，从而在目标区内实现消减雨雪的效果。或者提前在目标区外促使云层降水，达到“截留”的目的。",
    support: "结合高精度数值天气预报模型，实时监控上游天气系统的移动路径和强度变化。",
    icons: [
      { icon: CloudRain },
      { icon: Wind },
      { icon: TrendingDown }
    ],
    types: [
      { name: "超量催化", desc: "播撒过量催化剂，使云滴/冰晶数量过多，体积过小无法降落。", tag: "云体悬浮" },
      { name: "提前降水", desc: "在目标区上风方提前催化，使降水落在目标区外。", tag: "上风方拦截" }
    ]
  },
  {
    title: "人工消雾",
    conditions: "机场、高速公路等区域出现严重影响交通的雾。",
    methods: "对于冷雾，播撒致冷剂（液氮、干冰）或人工冰核产生冰晶，通过冰水转化消耗水汽使雾滴蒸发；对于暖雾，播撒吸湿性物质吸收水汽，或使用加热法蒸发雾滴。",
    mechanism: "对于冷雾，播撒致冷剂或人工冰核产生冰晶，通过冰水转化消耗水汽使雾滴蒸发；对于暖雾，播撒吸湿性物质吸收水汽，或使用加热法蒸发雾滴，从而提高能见度。",
    support: "依赖地面能见度仪网络、低空风切变探测系统以及微波辐射计等设备进行实时监测。",
    icons: [
      { icon: CloudSnow },
      { icon: Droplets },
      { icon: Wind }
    ],
    types: [
      { name: "冷雾消除", desc: "播撒液氮或干冰，促使雾滴转化为冰晶降落。", tag: "成本较低，效果好" },
      { name: "暖雾消除", desc: "播撒盐粉等吸湿剂，或直接加热空气使雾滴蒸发。", tag: "成本较高" }
    ]
  }
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activePrincipleIndex, setActivePrincipleIndex] = useState(0);
  const [expandedPrincipleIndex, setExpandedPrincipleIndex] = useState<number | null>(0);
  const [scale, setScale] = useState(1);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 16:9 Scaling Logic
  useEffect(() => {
    const handleResize = () => {
      const targetWidth = 1920;
      const targetHeight = 1080;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      const scaleX = windowWidth / targetWidth;
      const scaleY = windowHeight / targetHeight;
      
      // Use the smaller scale to ensure the content fits within the screen
      const newScale = Math.min(scaleX, scaleY);
      setScale(newScale);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSectorClick = (index: number, year: string) => {
    const newIndex = index === activeIndex ? null : index;
    setActiveIndex(newIndex);
  };

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* 16:9 Scaled Container */}
      <div 
        style={{ 
          width: '1920px', 
          height: '1080px', 
          transform: `scale(${scale})`,
          transformOrigin: 'center center'
        }}
        className="flex flex-col shrink-0 bg-[#010409] font-sans text-[#e0f2fe] relative overflow-hidden"
      >
      
      {/* Global Header */}
      <div className="w-full h-20 border-b border-[#00c3ff20] flex items-center justify-between px-12 z-50 bg-[#010409]/80 backdrop-blur-md">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-[#60e3ff] tracking-widest drop-shadow-[0_0_15px_rgba(96,227,255,0.4)]">
            人工影响天气中心科普
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right flex flex-col">
            <span className="text-white font-mono text-sm tracking-widest">
              {new Date().toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg border border-[#00c3ff40] flex items-center justify-center bg-[#00c3ff10]">
            <Monitor size={20} className="text-[#00c3ff]" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Vertical Divider - Enhanced with design elements */}
        <div className="absolute left-[45%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#00c3ff40] to-transparent z-20">
          <div className="absolute inset-0 bg-[#00c3ff10] blur-xl -left-4 -right-4"></div>
          <div className="absolute top-1/4 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
          <div className="absolute top-1/2 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
          <div className="absolute top-3/4 -left-1 w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff]"></div>
        </div>

        {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      
      {/* Top Light Flare */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-b from-[#00c3ff15] to-transparent blur-3xl pointer-events-none"></div>
      
      {/* Starry Background Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg width="100%" height="100%">
          {[...Array(100)].map((_, i) => (
            <circle
              key={i}
              cx={`${Math.random() * 100}%`}
              cy={`${Math.random() * 100}%`}
              r={Math.random() * 1.5}
              fill="white"
              opacity={Math.random()}
            >
              <animate
                attributeName="opacity"
                values={`${Math.random()};${Math.random()};${Math.random()}`}
                dur={`${2 + Math.random() * 4}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}
        </svg>
      </div>
      
      {/* Left Side: Radial Diagram */}
      <div className="w-[45%] h-full relative flex items-center">
        
        <svg viewBox="30 0 1000 1000" className="w-full h-full overflow-visible" preserveAspectRatio="xMinYMid meet">
          <defs>
            <radialGradient id="globeGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#1a8bbf" />
              <stop offset="40%" stopColor="#0c375f" />
              <stop offset="100%" stopColor="#010409" />
            </radialGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="flare" x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.4  0 0 0 0 0.9  0 0 0 0 1  0 0 0 1 0" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
              <mask id="silkMask">
                <path d={getArcLine(200, 520, 550, -90, 90)} fill="none" stroke="white" strokeWidth="300" strokeLinecap="round" />
              </mask>
            </defs>

            {/* Adjusted Center: cx=200, cy=520 (Moved right and down) */}
            
            {/* Atmospheric Glow behind globe */}
            <circle cx="200" cy="520" r="180" fill="#00c3ff" opacity="0.15" filter="url(#strongGlow)" />
            <circle cx="200" cy="520" r="165" fill="none" stroke="#00c3ff" strokeWidth="2" opacity="0.4" filter="url(#glow)" />

            {/* Background faint arcs */}
            <circle cx="200" cy="520" r="550" fill="none" stroke="#0c375f" strokeWidth="1" opacity="0.2" />
            <circle cx="200" cy="520" r="650" fill="none" stroke="#0c375f" strokeWidth="1" opacity="0.1" />

            {/* Globe */}
            <circle cx="200" cy="520" r="160" fill="url(#globeGrad)" />
            
            {/* Globe Texture / Grid */}
            <g opacity="0.2">
              {[...Array(12)].map((_, i) => (
                <ellipse key={`lat-${i}`} cx="200" cy="520" rx={160} ry={160 * Math.sin((i / 12) * Math.PI)} fill="none" stroke="#73c7ed" strokeWidth="0.5" />
              ))}
              {[...Array(12)].map((_, i) => (
                <ellipse key={`lon-${i}`} cx="200" cy="520" rx={160 * Math.sin((i / 12) * Math.PI)} ry={160} fill="none" stroke="#73c7ed" strokeWidth="0.5" />
              ))}
            </g>
            
            {/* Rim Light */}
            <circle cx="200" cy="520" r="160" fill="none" stroke="#60e3ff" strokeWidth="1" opacity="0.5" />
            
            {/* Techy inner dashed rings */}
            <circle cx="200" cy="520" r="166" fill="none" stroke="#60e3ff" strokeWidth="1" strokeDasharray="1 10" opacity="0.4" />
            <circle cx="200" cy="520" r="154" fill="none" stroke="#73c7ed" strokeWidth="0.5" strokeDasharray="10 5" opacity="0.2" />

          {sectors.map((sector, i) => {
            const startAngle = -84 + i * 24 + 0.5;
            const endAngle = -84 + (i + 1) * 24 - 0.5;
            const midAngle = (startAngle + endAngle) / 2;
            
            // Ring 1: Years
            const r1Inner = 160;
            const r1Outer = 220;
            const r1Mid = (r1Inner + r1Outer) / 2;
            const r1Pos = polarToCartesian(200, 520, r1Mid, midAngle);
            
            // Ring 2: Products
            const r2Inner = 220;
            const r2Outer = 370;
            const r2Mid = (r2Inner + r2Outer) / 2;
            const r2Pos = polarToCartesian(200, 520, r2Mid, midAngle);

            // Ring 3: Outer
            const r3Inner = 370;
            const r3Outer = 520;
            const r3Mid = (r3Inner + r3Outer) / 2;
            
            // Merged Ring (R2 + R3)
            const mergedMid = (r2Inner + r3Outer) / 2;
            const mergedPos = polarToCartesian(200, 520, mergedMid, midAngle);
            
            const isActive = activeIndex === i;
            const isHovered = hoverIndex === i;
            
            const r1Fill = isActive ? "#73c7ed" : (isHovered ? "#1a528a" : "#0c375f");
            const r2Fill = isActive ? "rgba(115, 199, 237, 0.4)" : (isHovered ? "rgba(12, 55, 95, 0.8)" : "rgba(12, 55, 95, 0.4)");
            const r3Fill = isActive ? "rgba(115, 199, 237, 0.2)" : (isHovered ? "rgba(12, 55, 95, 0.4)" : "rgba(12, 55, 95, 0.1)");
            
            return (
              <motion.g 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activeIndex === null ? 1 : (isActive ? 1 : 0.4)
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: '200px 520px', cursor: 'pointer' }}
                onClick={() => handleSectorClick(i, sector.year)}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                <defs>
                  <radialGradient id={`mergedGrad-${i}`} cx="200" cy="520" r={r3Outer} gradientUnits="userSpaceOnUse">
                    <stop offset={`${(r2Inner / r3Outer) * 100}%`} stopColor={r2Fill} style={{ transition: 'stop-color 0.3s' }} />
                    <stop offset="100%" stopColor={r3Fill} style={{ transition: 'stop-color 0.3s' }} />
                  </radialGradient>
                </defs>
                {/* Merged R2 and R3 */}
                <path d={getArcPath(200, 520, r2Inner, r3Outer, startAngle, endAngle)} fill={`url(#mergedGrad-${i})`} stroke="#030b14" strokeWidth="3" className="transition-colors duration-300" />
                {/* R1 */}
                <path d={getArcPath(200, 520, r1Inner, r1Outer, startAngle, endAngle)} fill={r1Fill} stroke="#030b14" strokeWidth="3" className="transition-colors duration-300" />
                
                {/* R1 Content Group: Number */}
                <motion.g transform={`rotate(${midAngle}, ${r1Pos.x}, ${r1Pos.y})`}>
                  {/* Step Number */}
                  <text
                    x={r1Pos.x}
                    y={r1Pos.y}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fill={isActive ? "#030b14" : "#60e3ff"}
                    fontSize="28"
                    fontWeight="900"
                    className="font-mono tracking-widest transition-colors duration-300"
                    style={{ filter: isActive ? 'none' : 'url(#glow)' }}
                  >
                    {`0${i + 1}`}
                  </text>
                </motion.g>

                {/* Product Text (Merged R2 & R3) */}
                <foreignObject 
                  x={mergedPos.x - 90} 
                  y={mergedPos.y - 60} 
                  width="180" 
                  height="120"
                >
                  <div className="flex flex-col items-center justify-center w-full h-full" style={{ transform: `rotate(${midAngle}deg)` }}>
                    {sector.products.map((p, idx) => (
                      <span key={idx} className={`text-[18px] font-bold leading-snug text-center transition-colors duration-300 px-2 break-words w-full ${isActive ? 'text-[#ffffff] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-[#73c7ed]'}`}>{p}</span>
                    ))}
                  </div>
                </foreignObject>

              </motion.g>
            );
          })}

            {/* Global Flowing Arc Animation (Cinematic Data Arcs) */}
            <g mask="url(#silkMask)">
              {[
                { r: 540, start: -40, end: 40, dur: 4 },
                { r: 580, start: -70, end: 10, dur: 6 },
                { r: 500, start: -10, end: 80, dur: 5 },
                { r: 640, start: -85, end: -20, dur: 7 },
                { r: 560, start: 30, end: 85, dur: 5.5 },
              ].map((arc, i) => {
                const startPos = polarToCartesian(200, 520, arc.r, arc.start);
                const endPos = polarToCartesian(200, 520, arc.r, arc.end);
                return (
                  <g key={i}>
                    {/* Static Arc Path */}
                    <path
                      d={getArcLine(200, 520, arc.r, arc.start, arc.end)}
                      fill="none"
                      stroke="#00c3ff"
                      strokeWidth="0.5"
                      opacity="0.2"
                    />
                    {/* Pulsing Light on Arc */}
                    <motion.path
                      d={getArcLine(200, 520, arc.r, arc.start, arc.end)}
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeDasharray="20 400"
                      animate={{ strokeDashoffset: [420, 0] }}
                      transition={{ duration: arc.dur, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                      filter="url(#glow)"
                    />
                    {/* Nodes / Flares at ends */}
                    <circle cx={startPos.x} cy={startPos.y} r="2" fill="#ffffff" filter="url(#flare)" />
                    <circle cx={endPos.x} cy={endPos.y} r="2" fill="#ffffff" filter="url(#flare)" />
                  </g>
                );
              })}
            </g>

            {/* Animated Data Streams bridging the left and right */}
            <g opacity="0.8">
              {/* Top Stream */}
              <path d="M 350 300 L 950 300" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="300" r="2.5" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [350, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Middle Stream */}
              <path d="M 450 520 L 950 520" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="520" r="3" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [450, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.rect
                y="519" height="2" fill="#00c3ff" filter="url(#glow)"
                animate={{ x: [450, 950], width: [0, 80, 0], opacity: [0, 0.8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />

              {/* Bottom Stream */}
              <path d="M 350 740 L 950 740" stroke="#00c3ff" strokeWidth="1" strokeDasharray="4 8" opacity="0.2" />
              <motion.circle
                cy="740" r="2.5" fill="#ffffff" filter="url(#glow)"
                animate={{ cx: [350, 950], opacity: [0, 1, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              />
            </g>
        </svg>
      </div>
      
      {/* Right Side: Content Area */}
      <div className="w-[55%] h-full overflow-y-auto py-12 pr-16 pl-8 hide-scrollbar relative z-10">
        {/* Decorative Corner Elements */}
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#00c3ff40] pointer-events-none"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#00c3ff40] pointer-events-none"></div>
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#00c3ff40] pointer-events-none"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#00c3ff40] pointer-events-none"></div>

        {activeIndex === null ? (
          <div className="flex flex-col w-full h-full">
            {/* Guidance Header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
              <h2 className="text-3xl font-bold text-white tracking-wider">中心指导思想</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-4"></div>
            </div>
            
            {/* Main Content Card - Dark Theme */}
            <div className="bg-[#0a192f]/60 backdrop-blur-xl border border-[#00c3ff30] rounded-2xl p-10 flex shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden mb-8 min-h-[450px] group hover:border-[#00c3ff60] transition-all duration-500">
              {/* Decorative background element */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00c3ff10] blur-3xl rounded-full"></div>
              
              <div className="flex-1 pr-10 z-10">
                <h3 className="text-[#60e3ff] font-bold text-2xl mb-8 leading-relaxed flex items-center gap-3">
                  <Activity size={24} className="text-[#00c3ff]" />
                  习近平总书记关于气象工作的重要指示
                </h3>
                <div className="text-[#e0f2fe] text-xl leading-[2.2] font-medium text-justify opacity-90">
                  气象工作关系<span className="text-[#00c3ff] font-bold underline underline-offset-8 decoration-[#00c3ff40]">生命安全、生产发展、生活富裕、生态良好</span>，做好气象工作意义重大、责任重大。气象工作者要发扬优良传统，加快科技创新，做到<span className="text-[#00c3ff] font-bold underline underline-offset-8 decoration-[#00c3ff40]">监测精密、预报精准、服务精细</span>，推动气象事业高质量发展，提高气象服务保障能力，发挥气象防灾减灾第一道防线作用。
                </div>
              </div>
              <div className="w-[38%] shrink-0 relative z-10">
                <div className="absolute inset-0 bg-[#00c3ff20] rounded-xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
                <img 
                  src="https://picsum.photos/seed/guidance/800/1000" 
                  alt="Guidance" 
                  className="w-full h-full object-cover rounded-xl border border-[#00c3ff40] relative z-10"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Bottom Placeholders */}
            <div className="grid grid-cols-2 gap-8 flex-1">
              <div className="bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden group hover:bg-[#00c3ff05] transition-all duration-300">
                 <div className="w-16 h-16 rounded-full bg-[#00c3ff10] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Target size={32} className="text-[#00c3ff]" />
                 </div>
                 <div className="text-[#60e3ff] font-bold text-xl mb-2">“十四五”规划指导</div>
                 <div className="text-[#73c7ed] text-sm opacity-60 text-center">深化人工影响天气工作体系建设</div>
              </div>
              <div className="bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-xl flex flex-col items-center justify-center p-8 relative overflow-hidden group hover:bg-[#00c3ff05] transition-all duration-300">
                 <div className="w-16 h-16 rounded-full bg-[#00c3ff10] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                    <Zap size={32} className="text-[#00c3ff]" />
                 </div>
                 <div className="text-[#60e3ff] font-bold text-xl mb-2">“十五五”展望</div>
                 <div className="text-[#73c7ed] text-sm opacity-60 text-center">迈向更高水平的智慧人工影响天气</div>
              </div>
            </div>
          </div>
        ) : activeIndex === 0 ? (
          <div className="flex w-full h-full">
            {/* Left Menu */}
            <div className="w-44 shrink-0 flex flex-col gap-3 border-r border-[#00c3ff20] pr-6 py-4 relative">
              {/* Connector dot to the left line */}
              <div className="absolute -left-[5px] top-[300px] w-2 h-2 bg-[#00c3ff] rounded-full shadow-[0_0_8px_#00c3ff] z-30"></div>
              {principles.map((p, idx) => (
                <div key={idx} className="flex flex-col">
                  <button
                    onClick={() => {
                      setActivePrincipleIndex(idx);
                      setExpandedPrincipleIndex(expandedPrincipleIndex === idx ? null : idx);
                    }}
                    className={`py-4 px-4 text-right text-base font-bold transition-all duration-300 rounded-lg relative overflow-hidden group ${
                      activePrincipleIndex === idx 
                        ? 'text-white bg-[#00c3ff20] shadow-[inset_0_0_20px_rgba(0,195,255,0.1)]' 
                        : 'text-[#73c7ed] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {activePrincipleIndex === idx && (
                      <div className="absolute right-0 top-0 w-1 h-full bg-[#00c3ff] shadow-[0_0_10px_#00c3ff]"></div>
                    )}
                    {p.title}
                  </button>
                  
                  {/* Expanded Blueprint Icons - Dynamic Process Animation */}
                  <AnimatePresence>
                    {expandedPrincipleIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                        className="relative w-full mt-3 overflow-hidden rounded-2xl"
                      >
                        {/* Organic Glowing Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#00c3ff15] via-[#00c3ff05] to-transparent"></div>
                        <motion.div 
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-[#00c3ff20] rounded-full blur-2xl"
                          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.8, 0.5] }}
                          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />
                        
                        <div className="relative py-6 flex flex-col items-center gap-8">
                          {p.icons?.map((iconData, i) => {
                            const IconComponent = iconData.icon;
                            const isLast = i === (p.icons?.length || 0) - 1;
                            
                            return (
                              <div key={i} className="relative flex flex-col items-center w-full">
                                {/* Connection to next node */}
                                {!isLast && (
                                  <div className="absolute top-12 bottom-[-2rem] w-[2px] overflow-hidden flex justify-center">
                                    {/* Base faint line */}
                                    <div className="absolute inset-0 w-full bg-gradient-to-b from-[#00c3ff40] to-transparent"></div>
                                    {/* Animated flowing energy */}
                                    <motion.div 
                                      className="absolute top-0 w-[2px] h-1/2 bg-[#00ffff] rounded-full shadow-[0_0_10px_#00ffff]"
                                      animate={{ top: ['-50%', '150%'], opacity: [0, 1, 0] }}
                                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.4 }}
                                    />
                                  </div>
                                )}

                                {/* Icon Node */}
                                <motion.div 
                                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{ delay: i * 0.15, duration: 0.5, type: "spring" }}
                                  className="relative z-10 flex flex-col items-center group"
                                >
                                  {/* Floating animation for the icon container */}
                                  <motion.div 
                                    animate={{ y: [-3, 3, -3] }}
                                    transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: "easeInOut" }}
                                    className="relative w-14 h-14 rounded-full bg-[#03132b]/80 backdrop-blur-sm border border-[#00c3ff40] flex items-center justify-center shadow-[0_0_20px_rgba(0,195,255,0.15)] group-hover:shadow-[0_0_30px_rgba(0,195,255,0.4)] group-hover:border-[#00c3ff80] transition-all duration-500"
                                  >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00c3ff20] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <IconComponent size={22} className="text-[#00ffff] drop-shadow-[0_0_8px_rgba(0,255,255,0.8)] group-hover:scale-110 transition-transform duration-500" />
                                  </motion.div>
                                </motion.div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            
            {/* Right Content */}
            <div className="flex-1 pl-10 flex flex-col">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-3xl font-bold text-white tracking-wider">{principles[activePrincipleIndex].title}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-4"></div>
              </div>
              
              <div className="bg-[#0a192f]/30 backdrop-blur-2xl border border-[#00c3ff15] rounded-3xl p-8 flex flex-col gap-8 shadow-[0_0_50px_rgba(0,195,255,0.05)] relative overflow-hidden flex-1 mb-4 overflow-y-auto hide-scrollbar">
                {/* Organic Background Glows */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#00c3ff10] rounded-full blur-[80px] pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#00c3ff10] rounded-full blur-[80px] pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col gap-6">
                  
                  {/* 1. 作业机理 (Full width) */}
                  <div className="group bg-gradient-to-br from-[#00c3ff08] to-transparent border border-[#00c3ff10] hover:border-[#00c3ff30] rounded-2xl p-6 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-[#00c3ff10] text-[#00ffff] group-hover:bg-[#00c3ff20] group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,195,255,0.1)]">
                        <Activity size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">作业机理</h3>
                    </div>
                    <p className="text-[#a8b2d0] text-[15px] leading-relaxed">{principles[activePrincipleIndex].mechanism}</p>
                  </div>

                  {/* Grid for 条件 and 方法 */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* 2. 作业条件 */}
                    <div className="group bg-gradient-to-br from-[#00c3ff08] to-transparent border border-[#00c3ff10] hover:border-[#00c3ff30] rounded-2xl p-6 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#00c3ff10] text-[#00ffff] group-hover:bg-[#00c3ff20] group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,195,255,0.1)]">
                          <Thermometer size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">作业条件</h3>
                      </div>
                      <p className="text-[#a8b2d0] text-[15px] leading-relaxed">{principles[activePrincipleIndex].conditions}</p>
                    </div>

                    {/* 3. 作业方法 */}
                    <div className="group bg-gradient-to-br from-[#00c3ff08] to-transparent border border-[#00c3ff10] hover:border-[#00c3ff30] rounded-2xl p-6 transition-all duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-[#00c3ff10] text-[#00ffff] group-hover:bg-[#00c3ff20] group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,195,255,0.1)]">
                          <Settings size={20} />
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">作业方法</h3>
                      </div>
                      <p className="text-[#a8b2d0] text-[15px] leading-relaxed">{principles[activePrincipleIndex].methods}</p>
                    </div>
                  </div>

                  {/* 4. 气象保障 */}
                  <div className="group bg-gradient-to-br from-[#00c3ff08] to-transparent border border-[#00c3ff10] hover:border-[#00c3ff30] rounded-2xl p-6 transition-all duration-500">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-[#00c3ff10] text-[#00ffff] group-hover:bg-[#00c3ff20] group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,195,255,0.1)]">
                        <Radar size={20} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">气象保障</h3>
                    </div>
                    <div className="flex flex-col gap-5">
                      <p className="text-[#a8b2d0] text-[15px] leading-relaxed">{principles[activePrincipleIndex].support}</p>
                      
                      {/* Image Placeholders - More organic, less boxy */}
                      <div className="grid grid-cols-2 gap-6 mt-2">
                        <div className="h-36 rounded-2xl bg-gradient-to-br from-[#00c3ff10] to-[#00c3ff05] border border-[#00c3ff20] relative overflow-hidden flex flex-col items-center justify-center group-img hover:border-[#00c3ff50] transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,195,255,0.05)]">
                          <div className="absolute inset-0 bg-[#00c3ff] opacity-0 group-hover-img:opacity-5 transition-opacity duration-500"></div>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute -right-8 -top-8 w-24 h-24 border border-[#00c3ff20] rounded-full border-dashed opacity-50"></motion.div>
                          <Camera size={28} className="text-[#00ffff] mb-3 opacity-60 group-hover-img:opacity-100 group-hover-img:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
                        </div>
                        <div className="h-36 rounded-2xl bg-gradient-to-br from-[#00c3ff10] to-[#00c3ff05] border border-[#00c3ff20] relative overflow-hidden flex flex-col items-center justify-center group-img hover:border-[#00c3ff50] transition-all duration-500 shadow-[inset_0_0_20px_rgba(0,195,255,0.05)]">
                          <div className="absolute inset-0 bg-[#00c3ff] opacity-0 group-hover-img:opacity-5 transition-opacity duration-500"></div>
                          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 25, ease: "linear" }} className="absolute -left-8 -bottom-8 w-32 h-32 border border-[#00c3ff20] rounded-full border-dashed opacity-50"></motion.div>
                          <Camera size={28} className="text-[#00ffff] mb-3 opacity-60 group-hover-img:opacity-100 group-hover-img:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeIndex === 1 ? (
          <div className="grid grid-rows-[auto_1fr_auto] w-full h-full overflow-hidden relative rounded-3xl bg-[#02040a] text-white font-sans">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(0,195,255,0.08)_0%,rgba(0,0,0,1)_100%)] z-0"></div>
            
            {/* Header */}
            <div className="px-10 py-6 relative z-10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-1 h-6 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-xl lg:text-2xl font-light tracking-[0.2em] text-white/90">我国人影发展历程</h2>
              </div>
            </div>

            {/* Single Screen Timeline View - Central Spine Alternating Layout */}
            <div className="flex-1 relative z-10 w-full h-full overflow-hidden">
              {/* Curved Flowing Spine - Improved Aesthetic */}
              <svg className="absolute left-0 top-0 w-full h-full pointer-events-none hidden md:block" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="spineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00c3ff" stopOpacity="0" />
                    <stop offset="10%" stopColor="#00c3ff" stopOpacity="0.2" />
                    <stop offset="50%" stopColor="#00c3ff" stopOpacity="0.6" />
                    <stop offset="90%" stopColor="#00c3ff" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00c3ff" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Main smooth flowing line */}
                <motion.path
                  d="M 50,0 C 42,25 58,75 50,100"
                  stroke="url(#spineGradient)"
                  strokeWidth="0.15"
                  fill="none"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                
                {/* Subtle ethereal secondary line */}
                <motion.path
                  d="M 50,0 C 58,25 42,75 50,100"
                  stroke="#00c3ff"
                  strokeWidth="0.05"
                  fill="none"
                  opacity="0.1"
                  animate={{ 
                    d: [
                      "M 50,0 C 58,25 42,75 50,100",
                      "M 50,0 C 42,25 58,75 50,100",
                      "M 50,0 C 58,25 42,75 50,100"
                    ]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                />
                
                {/* Flowing particles/dots along the path */}
                {[0, 1, 2].map((i) => (
                  <motion.circle
                    key={i}
                    r="0.2"
                    fill="#00c3ff"
                    initial={{ offsetDistance: "0%", opacity: 0 }}
                    animate={{ 
                      offsetDistance: "100%", 
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      delay: i * 1.5,
                      ease: "linear"
                    }}
                    style={{ offsetPath: "path('M 50,0 C 42,25 58,75 50,100')" }}
                  />
                ))}
              </svg>

              <div className="grid grid-rows-4 w-full h-full">
                {developmentHistory.map((item, idx) => {
                  const isEven = idx % 2 === 0;
                  const delays = [0.2, 0.3, 0.4, 0.5];
                  
                  return (
                    <div key={idx} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center w-full h-full group">
                      
                      {/* Left Side */}
                      <div className={`px-6 lg:px-12 flex flex-col ${isEven ? 'items-end' : 'items-start md:items-end'} order-2 md:order-1`}>
                        {isEven ? (
                          /* Year Capsule for 1958/1987 */
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: delays[idx] }}
                            className="px-6 py-2 rounded-full border border-[#00c3ff]/30 bg-[#00c3ff]/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,195,255,0.1)]"
                          >
                            <span className="text-xl lg:text-3xl font-bold text-[#00c3ff] font-mono italic tracking-tighter">{item.year}</span>
                          </motion.div>
                        ) : (
                          /* Content for 1980/2026 */
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: delays[idx] }}
                            className="flex flex-col items-start md:items-end text-left md:text-right max-w-2xl"
                          >
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                              {item.imageSrc && (
                                <div className="w-24 h-16 lg:w-32 lg:h-20 rounded border border-white/10 overflow-hidden shrink-0 bg-white/5">
                                  <img src={item.imageSrc} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                                </div>
                              )}
                              <h3 className="text-sm lg:text-base font-medium text-white/90 leading-snug max-w-[10em]">{item.items[0]}</h3>
                            </div>
                            <div className="flex flex-wrap justify-start md:justify-end gap-x-4 gap-y-1 w-full max-w-sm">
                              {item.items.slice(1).map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-1.5 text-white/40 text-[10px] lg:text-xs">
                                  <div className="w-1 h-1 rounded-full bg-[#00c3ff]/40"></div>
                                  <span className="whitespace-nowrap">{sub}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Center Node */}
                      <div className="relative flex justify-center items-center h-full order-1 md:order-2">
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 200, delay: delays[idx] }}
                          className="w-3 h-3 lg:w-4 lg:h-4 bg-[#00c3ff] rounded-full shadow-[0_0_15px_#00c3ff] z-20"
                        />
                        <div className="absolute inset-0 w-8 h-8 lg:w-12 lg:h-12 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 border border-[#00c3ff]/20 rounded-full animate-ping opacity-20"></div>
                      </div>

                      {/* Right Side */}
                      <div className={`px-6 lg:px-12 flex flex-col ${isEven ? 'items-start' : 'items-start'} order-3`}>
                        {!isEven ? (
                          /* Year Capsule for 1980/2026 */
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: delays[idx] }}
                            className="px-6 py-2 rounded-full border border-[#00c3ff]/30 bg-[#00c3ff]/5 backdrop-blur-md shadow-[0_0_15px_rgba(0,195,255,0.1)]"
                          >
                            <span className="text-xl lg:text-3xl font-bold text-[#00c3ff] font-mono italic tracking-tighter">{item.year}</span>
                          </motion.div>
                        ) : (
                          /* Content for 1958/1987 */
                          <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: delays[idx] }}
                            className="flex flex-col items-start text-left max-w-2xl"
                          >
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                              <h3 className="text-sm lg:text-base font-medium text-white/90 leading-snug max-w-[10em]">{item.items[0]}</h3>
                              {item.imageSrc && (
                                <div className="w-24 h-16 lg:w-32 lg:h-20 rounded border border-white/10 overflow-hidden shrink-0 bg-white/5">
                                  <img src={item.imageSrc} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 w-full max-w-sm">
                              {item.items.slice(1).map((sub, sIdx) => (
                                <div key={sIdx} className="flex items-center gap-1.5 text-white/40 text-[10px] lg:text-xs">
                                  <div className="w-1 h-1 rounded-full bg-[#00c3ff]/40"></div>
                                  <span className="whitespace-nowrap">{sub}</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="px-10 py-4 border-t border-white/5 flex justify-between items-center relative z-10 bg-black/20">
            </div>
          </div>
        ) : activeIndex === 2 ? (
          <div className="flex flex-col w-full h-full overflow-hidden relative rounded-3xl bg-[#02040a] text-white font-sans p-8">
            {/* Deep Space Atmosphere */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,195,255,0.05)_0%,rgba(0,0,0,1)_100%)] z-0"></div>
            
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                <h2 className="text-3xl font-bold text-white tracking-wider">我国人工影响天气技术进展</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-4"></div>
              </div>

              {/* Summary Text */}
              <div className="mb-8 bg-[#0a192f]/30 backdrop-blur-sm border border-[#00c3ff15] rounded-xl p-5 text-[#a8b2d0] text-sm leading-relaxed text-justify">
                我国人工影响天气作业以人工增雨和人工防雹为主，还包括人工消云减雨、人工消雾、人工防霜冻等。一次成功的人工影响天气作业，作业前要精准把握云层状态、天气条件，科学计算时机、选用合适的装备。作业期间要实时精准指挥，作业后进行效果效益评估验证，并保证全程作业的安全。为达成这些目标，科技工作者在聚焦空中云水资源测算评估、数值天气预报模型优化、空地实时跟踪指挥、效果效益评估验证、新型装备创新研发等方面不断探索，成效显著。
              </div>

              {/* Bento Grid Dashboard */}
              <div className="grid grid-cols-12 grid-rows-6 gap-4 flex-1">
                {/* Main Pillar: Numerical Prediction (Soft Power) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="col-span-7 row-span-3 bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00c3ff50] transition-all"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Monitor size={100} />
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#00c3ff10] text-[#00ffff]">
                      <Monitor size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-wide">数值预报能力</h3>
                      <p className="text-[#00c3ff] text-[10px] tracking-widest opacity-60">核心竞争力 / 软实力</p>
                    </div>
                  </div>
                  <p className="text-[#a8b2d0] text-sm leading-relaxed mb-6">
                    自主研发云降水显式预报系统，精细预报分辨率由10公里提升至1公里，甚至百米级。该系统能提供57种作业条件预报和催化模拟产品，是精准预报作业区域、作业时机、作业强度的重要依据。
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 rounded-lg bg-[#00c3ff10] border border-[#00c3ff20]">
                      <span className="text-[#00ffff] font-mono text-base font-bold">100m级</span>
                      <p className="text-[9px] text-white/40">精细分辨率</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg bg-[#00c3ff10] border border-[#00c3ff20]">
                      <span className="text-[#00ffff] font-mono text-base font-bold">57种</span>
                      <p className="text-[9px] text-white/40">预报产品</p>
                    </div>
                  </div>
                </motion.div>

                {/* Cloud Water Resources */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="col-span-5 row-span-3 bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00c3ff50] transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#00c3ff10] text-[#00c3ff]">
                      <CloudRain size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">空中云水资源</h3>
                      <p className="text-[#00c3ff] text-[10px] tracking-widest opacity-60">掌握基础</p>
                    </div>
                  </div>
                  <p className="text-[#a8b2d0] text-xs leading-relaxed mb-4">
                    提出了云水资源评估理论，建立了定量评估方法，得出我国空中云水资源开发潜力每年约2500亿—3800亿吨。构建了空基、地基、天基相结合的立体探测系统。
                  </p>
                  <div className="mt-auto">
                    <div className="text-xl font-bold text-[#00ffff] font-mono tracking-tighter">2500-3800亿吨/年</div>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "85%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-[#00c3ff] to-[#00ffff]"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Equipment (Hard Power) */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="col-span-4 row-span-3 bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00c3ff50] transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#00c3ff10] text-[#60e3ff]">
                      <Server size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">安全高效装备</h3>
                      <p className="text-[#00c3ff] text-[10px] tracking-widest opacity-60">硬实力保障</p>
                    </div>
                  </div>
                  <p className="text-[#a8b2d0] text-xs leading-relaxed">
                    “新舟”60增雨飞机续航6小时，覆盖9000km²。自主研发云粒子成像仪达国际先进水平。无人机作业方案提供新选择。
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="text-[9px] py-1 px-2 rounded bg-white/5 border border-white/10 text-white/60">自动化高炮火箭</div>
                    <div className="text-[9px] py-1 px-2 rounded bg-white/5 border border-white/10 text-white/60">精准过程控制</div>
                  </div>
                </motion.div>

                {/* Command Center */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="col-span-4 row-span-3 bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00c3ff50] transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#00c3ff10] text-[#73c7ed]">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">实时精准指挥</h3>
                      <p className="text-[#00c3ff] text-[10px] tracking-widest opacity-60">智能中枢</p>
                    </div>
                  </div>
                  <p className="text-[#a8b2d0] text-xs leading-relaxed">
                    “天工”平台实现五级实时指挥。风云卫星实现分钟级云图动态监测，精准定位作业点。
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] text-green-500 font-mono">五级联动实时指挥</span>
                  </div>
                </motion.div>

                {/* Evaluation Methods */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="col-span-4 row-span-3 bg-[#0a192f]/40 backdrop-blur-md border border-[#00c3ff20] rounded-2xl p-6 relative overflow-hidden group hover:border-[#00c3ff50] transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-[#00c3ff10] text-[#00c3ff]">
                      <Activity size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">效果效益评估</h3>
                      <p className="text-[#00c3ff] text-[10px] tracking-widest opacity-60">效果利器</p>
                    </div>
                  </div>
                  <p className="text-[#a8b2d0] text-xs leading-relaxed">
                    构建基于物理检验、数值模拟、AI技术的多元集合评估方法，科学评估经济、社会、生态效益。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[8px] px-2 py-0.5 rounded-full border border-[#00c3ff40] text-[#00c3ff]">物理检验</span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full border border-[#00c3ff40] text-[#00c3ff]">数值模拟</span>
                    <span className="text-[8px] px-2 py-0.5 rounded-full border border-[#00c3ff40] text-[#00c3ff]">人工智能</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full px-4">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
              <h2 className="text-3xl font-bold text-white tracking-wider">历史沿革与业务体系</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-[#00c3ff40] to-transparent ml-4"></div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {historyEvents.map((item, index) => {
                const isEventActive = activeIndex !== null && 
                  item.year >= sectors[activeIndex].year && 
                  (activeIndex === sectors.length - 1 || item.year < sectors[activeIndex + 1].year);

                return (
                  <motion.div 
                    key={index}
                    ref={(el) => { itemRefs.current[index] = el; }}
                    animate={{ 
                      opacity: activeIndex === null || isEventActive ? 1 : 0.3,
                      backgroundColor: isEventActive ? 'rgba(0, 195, 255, 0.15)' : 'rgba(255, 255, 255, 0.03)'
                    }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center py-6 px-10 rounded-2xl transition-all duration-500 border backdrop-blur-md ${
                      isEventActive 
                        ? 'border-[#00c3ff60] shadow-[0_0_30px_rgba(0,195,255,0.15)]' 
                        : 'border-white/5 hover:bg-white/10 hover:border-white/10'
                    }`}
                  >
                    <div className="flex flex-col w-28 shrink-0 relative">
                      {isEventActive && (
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-[#00c3ff] rounded-full shadow-[0_0_10px_#00c3ff]"></div>
                      )}
                      <span className={`font-bold text-3xl leading-none tracking-tighter transition-colors duration-300 ${isEventActive ? 'text-[#60e3ff]' : 'text-[#73c7ed] opacity-60'}`}>{item.year}</span>
                      <span className="text-[#73c7ed] text-xs mt-2 uppercase tracking-widest opacity-50 font-bold">{item.date}</span>
                    </div>
                    <div className={`flex-1 text-lg font-medium pl-10 border-l border-white/10 leading-relaxed transition-colors duration-300 ${isEventActive ? 'text-white' : 'text-[#e0f2fe] opacity-70'}`}>
                      {item.event}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</div>
);
}
