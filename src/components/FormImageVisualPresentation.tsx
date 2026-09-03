import React, { useState, useEffect, useRef } from 'react';
import { ALL_INDIAN_LANGUAGES } from '../data/languages';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { useToast } from '../context/ToastContext';
import { 
  Upload, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Eye, 
  EyeOff, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  FileText, 
  ShieldCheck, 
  Award, 
  HelpCircle, 
  Info, 
  Layers, 
  Maximize2,
  CheckSquare,
  Square,
  Building2,
  Globe,
  Loader2
} from 'lucide-react';

export interface AnalyzedFormField {
  id: string;
  fieldNumber: number;
  fieldName: string;
  detectedSection: string;
  boxCoordinates: {
    xPercent: number;
    yPercent: number;
    widthPercent: number;
    heightPercent: number;
  };
  purpose: string;
  howToFill: string;
  exampleValue: string;
  requiredProofDocument: string;
  commonMistakes: string[];
  approvalTip: string;
}

export interface VisualPresentationSlide {
  slideNumber: number;
  title: string;
  subtitle: string;
  targetFieldIds: string[];
  audioNarrationText: string;
  detailedInstructions: string[];
  keyWarning: string;
  sampleWatermarkOverlay?: Array<{
    fieldId: string;
    textToDraw: string;
    position: { x: number; y: number };
  }>;
}

export interface FormImageAnalysisResult {
  formDetectedTitle: string;
  detectedIssuingAuthority: string;
  confidenceScore: number;
  languageDetected: string;
  prerequisiteDocs: string[];
  fields: AnalyzedFormField[];
  presentationSlides: VisualPresentationSlide[];
}

interface FormImageVisualPresentationProps {
  selectedLang?: string;
  userProfileName?: string;
  onClose?: () => void;
}

const SAMPLE_FORMS = [
  {
    id: 'pm-kisan',
    name: 'PM-Kisan Samman Nidhi Physical Form',
    description: 'Central Agriculture Ministry - ₹6,000/yr Direct Income Support Form',
    bgTheme: 'from-amber-500/10 to-emerald-500/10'
  },
  {
    id: 'income-cert',
    name: 'State Revenue Income Certificate Application',
    description: 'Tehsildar / E-District Official Application Form',
    bgTheme: 'from-blue-500/10 to-indigo-500/10'
  },
  {
    id: 'caste-cert',
    name: 'Social Welfare Caste & Tribe Certificate Form',
    description: 'SC / ST / OBC Affirmative Welfare Certificate Application',
    bgTheme: 'from-purple-500/10 to-pink-500/10'
  }
];

export const FormImageVisualPresentation: React.FC<FormImageVisualPresentationProps> = ({
  selectedLang = 'hi',
  userProfileName = 'Rahul Sharma',
  onClose
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [currentLang, setCurrentLang] = useState<string>(selectedLang);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FormImageAnalysisResult | null>(null);

  // Presentation Player States
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState<number>(6); // seconds per slide
  const [showSimulatedWatermark, setShowSimulatedWatermark] = useState<boolean>(true);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<AnalyzedFormField | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Document checklist ticks
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selectedLang) setCurrentLang(selectedLang);
  }, [selectedLang]);

  // Load default sample analysis on mount
  useEffect(() => {
    handleAnalyzeSample('pm-kisan');
  }, []);

  // Auto-play timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && analysisResult?.presentationSlides?.length) {
      timer = setInterval(() => {
        setCurrentSlideIndex((prev) => {
          if (prev >= (analysisResult.presentationSlides.length - 1)) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlaySpeed * 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, autoPlaySpeed, analysisResult]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Invalid File',
        description: 'Please upload an image file (JPG, PNG, WEBP) of the paper form.',
        type: 'error'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setUploadedImagePreview(base64);
      analyzeFormImage(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyzeSample = (sampleId: string) => {
    setUploadedImagePreview(null);
    analyzeFormImage(null, sampleId);
  };

  const analyzeFormImage = async (base64Img: string | null, sampleId?: string) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/parse-form-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Img,
          sampleFormId: sampleId || 'pm-kisan',
          lang: currentLang,
        })
      });

      if (response.ok) {
        const data: FormImageAnalysisResult = await response.json();
        setAnalysisResult(data);
        setCurrentSlideIndex(0);
        
        // Initialize doc checklist
        const initDocs: Record<string, boolean> = {};
        (data.prerequisiteDocs || []).forEach(doc => {
          initDocs[doc] = true;
        });
        setCheckedDocs(initDocs);

        showToast({
          title: 'Form Image Analyzed! 🎯',
          description: `AI detected ${(data.fields || []).length} form fields & created a step-by-step visual presentation.`,
          type: 'success'
        });
      } else {
        throw new Error('Form parse API error');
      }
    } catch (err) {
      console.error('Form parse error:', err);
      showToast({
        title: 'Analysis Error',
        description: 'Could not parse form image. Loaded standard visual template.',
        type: 'info'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentSlide = analysisResult?.presentationSlides?.[currentSlideIndex] || null;
  const activeFieldIds = currentSlide?.targetFieldIds || [];

  return (
    <div className="bg-slate-900 text-white min-h-screen rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6">
      
      {/* Top Banner & Control Header */}
      <div className="bg-gradient-to-r from-[#00003c] via-indigo-950 to-slate-950 p-6 rounded-3xl border border-amber-400/30 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>AI Computer Vision Form Guide</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            Visual Form Filling Presentation Guide
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            Facing difficulty filling out a physical paper application form? Upload a picture of your form below. Our AI analyzes the document and generates an interactive, field-by-field visual presentation guide!
          </p>
        </div>

        {/* Upload & Language Action Bar */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto justify-start lg:justify-end">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-2 rounded-xl border border-white/15 text-xs">
            <Globe className="w-4 h-4 text-amber-400" />
            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-transparent text-white font-extrabold text-xs focus:outline-none cursor-pointer"
            >
              {ALL_INDIAN_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-bold">
                  {lang.nativeName} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>{isAnalyzing ? 'Analyzing Image...' : '📷 Upload Form Photo'}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold text-xs"
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Sample Form Quick Selector */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Or try with Sample Application Forms:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_FORMS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleAnalyzeSample(sample.id)}
              disabled={isAnalyzing}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-xs font-bold text-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* MAIN DUAL PANEL INTERACTIVE WORKSPACE */}
      {isAnalyzing ? (
        <div className="p-16 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
          <Loader2 className="w-12 h-12 text-amber-400 animate-spin mx-auto" />
          <h3 className="text-xl font-black text-white">AI Computer Vision Scanning Form Image...</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Detecting field layouts, Indian government seal, language script, bounding box coordinates, and generating step-by-step visual presentation guide...
          </p>
        </div>
      ) : analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT PANEL: Form Picture Canvas with Interactive Field Overlays (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Canvas Toolbar Controls */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-slate-200">
                  {analysisResult.formDetectedTitle}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Watermark Toggle */}
                <button
                  onClick={() => setShowSimulatedWatermark(!showSimulatedWatermark)}
                  className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors flex items-center gap-1.5 cursor-pointer ${
                    showSimulatedWatermark
                      ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle simulated filled red-ink text watermark overlay"
                >
                  {showSimulatedWatermark ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{showSimulatedWatermark ? 'Filled Overlay On' : 'Overlay Off'}</span>
                </button>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                    className="p-1 hover:text-amber-400"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[10px] font-mono font-bold text-slate-400">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(1.6, z + 0.2))}
                    className="p-1 hover:text-amber-400"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Form Picture / Simulated Paper Container */}
            <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 shadow-2xl overflow-auto max-h-[680px] relative">
              <div 
                className="relative mx-auto transition-transform origin-top"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {uploadedImagePreview ? (
                  /* User Uploaded Photo */
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                    <img 
                      src={uploadedImagePreview} 
                      alt="Uploaded Application Form" 
                      className="w-full h-auto object-contain block"
                    />

                    {/* SVG Interactive Bounding Boxes Overlay */}
                    <div className="absolute inset-0 pointer-events-auto">
                      {(analysisResult.fields || []).map((field) => {
                        const isActiveInSlide = activeFieldIds.includes(field.id);
                        const isHovered = hoveredFieldId === field.id;
                        const coords = field.boxCoordinates;

                        return (
                          <div
                            key={field.id}
                            onClick={() => setSelectedField(field)}
                            onMouseEnter={() => setHoveredFieldId(field.id)}
                            onMouseLeave={() => setHoveredFieldId(null)}
                            style={{
                              left: `${coords.xPercent}%`,
                              top: `${coords.yPercent}%`,
                              width: `${coords.widthPercent}%`,
                              height: `${coords.heightPercent}%`,
                            }}
                            className={`absolute rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between p-1.5 ${
                              isActiveInSlide
                                ? 'border-amber-400 bg-amber-400/25 shadow-lg shadow-amber-400/30 animate-pulse ring-2 ring-amber-300'
                                : isHovered
                                ? 'border-indigo-400 bg-indigo-500/20'
                                : 'border-dashed border-sky-400/50 bg-sky-500/10 hover:border-amber-400'
                            }`}
                          >
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black shadow-xs ${
                              isActiveInSlide ? 'bg-amber-400 text-slate-950' : 'bg-slate-950 text-sky-300 border border-sky-400/40'
                            }`}>
                              #{field.fieldNumber} {field.fieldName.split('(')[0]}
                            </span>

                            {/* Red-Ink Simulated Watermark Entry */}
                            {showSimulatedWatermark && (
                              <span className="text-rose-600 font-extrabold text-[11px] font-mono tracking-wider bg-white/90 px-1.5 py-0.5 rounded shadow-sm border border-rose-300">
                                ✍️ {field.exampleValue}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  /* High-Fidelity Paper Application Form Canvas */
                  <div className="bg-amber-50 text-slate-900 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-amber-200/80 font-serif relative min-h-[640px] space-y-6">
                    
                    {/* Simulated Form Watermark Header */}
                    <div className="text-center border-b-2 border-slate-900/20 pb-4 space-y-1">
                      <div className="w-12 h-12 mx-auto rounded-full bg-amber-200 border-2 border-amber-800/40 flex items-center justify-center font-bold text-amber-900 text-xs">
                        🇮🇳 GOVT
                      </div>
                      <h2 className="text-lg font-black tracking-wide uppercase text-slate-900 font-sans">
                        {analysisResult.formDetectedTitle}
                      </h2>
                      <p className="text-[11px] text-slate-600 font-semibold font-sans">
                        {analysisResult.detectedIssuingAuthority}
                      </p>
                      <div className="text-[10px] font-bold text-slate-500 font-mono tracking-widest uppercase">
                        Form Code: GOVT-WB-2026-REG-01 | Free Distribution
                      </div>
                    </div>

                    {/* Form Field Sections */}
                    <div className="space-y-4 font-sans text-xs">
                      {(analysisResult.fields || []).map((field) => {
                        const isActiveInSlide = activeFieldIds.includes(field.id);
                        const isHovered = hoveredFieldId === field.id;

                        return (
                          <div
                            key={field.id}
                            onClick={() => setSelectedField(field)}
                            onMouseEnter={() => setHoveredFieldId(field.id)}
                            onMouseLeave={() => setHoveredFieldId(null)}
                            className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                              isActiveInSlide
                                ? 'bg-amber-200/80 border-amber-600 ring-2 ring-amber-500 shadow-md scale-[1.01]'
                                : isHovered
                                ? 'bg-indigo-100/80 border-indigo-500'
                                : 'bg-white/90 border-slate-300 hover:border-amber-500'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
                                  {field.fieldNumber}
                                </span>
                                <span>{field.fieldName}</span>
                              </span>
                              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                {field.detectedSection}
                              </span>
                            </div>

                            {/* Grid / Blank Fill Box on Paper */}
                            <div className="mt-2 bg-slate-50 border-2 border-dashed border-slate-400 p-2 rounded-lg flex items-center justify-between font-mono">
                              <span className="text-slate-400 text-[11px] italic">
                                [ Write in BLOCK CAPITAL letters ]
                              </span>

                              {/* Simulated Handwritten Red Ink Overlay */}
                              {showSimulatedWatermark && (
                                <span className="text-rose-700 font-black text-xs bg-amber-100/90 px-2.5 py-0.5 rounded border border-rose-300 shadow-xs tracking-wider">
                                  ✍️ {field.exampleValue}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Paper Footer Disclaimer */}
                    <div className="pt-4 border-t border-slate-300 text-[10px] text-slate-500 text-center font-sans">
                      * This is an interactive visual exemplar generated by JanAI for educational guide purposes.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prerequisite Document Checklist */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Required Proof Certificates for this Form</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  Keep these beside you before writing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(analysisResult.prerequisiteDocs || []).map((doc) => {
                  const isChecked = !!checkedDocs[doc];
                  return (
                    <button
                      key={doc}
                      onClick={() => setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }))}
                      className={`p-2 rounded-xl text-xs font-bold text-left transition-all flex items-center gap-2 border cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                      <span className="truncate">{doc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT PANEL: Step-by-Step AI Visual Presentation Player (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Presentation Player Header & Auto-Advance Bar */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 p-5 rounded-3xl border border-indigo-800/50 shadow-xl space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase">
                    Slide {currentSlideIndex + 1} / {(analysisResult.presentationSlides || []).length}
                  </span>
                  <span className="text-xs text-indigo-300 font-extrabold">
                    AI Visual Guide
                  </span>
                </div>

                {/* Voice Narration Button */}
                {currentSlide?.audioNarrationText && (
                  <AiVoiceSpeaker
                    text={currentSlide.audioNarrationText}
                    lang={currentLang}
                    label="Read Slide Aloud"
                  />
                )}
              </div>

              {/* Slide Title */}
              {currentSlide && (
                <div className="space-y-1">
                  <h2 className="text-lg font-black text-white leading-snug">
                    {currentSlide.title}
                  </h2>
                  <p className="text-xs text-amber-300 font-bold">
                    {currentSlide.subtitle}
                  </p>
                </div>
              )}

              {/* Player Progress & Control Buttons */}
              <div className="bg-slate-900/80 p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                  disabled={currentSlideIndex === 0}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Previous Slide"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-md ${
                    isPlaying
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isPlaying ? 'Pause Guide' : 'Auto-Play Presentation'}</span>
                </button>

                <button
                  onClick={() => setCurrentSlideIndex(prev => Math.min((analysisResult.presentationSlides || []).length - 1, prev + 1))}
                  disabled={currentSlideIndex === (analysisResult.presentationSlides || []).length - 1}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title="Next Slide"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Slide Bullet Instructions */}
              {currentSlide && (
                <div className="space-y-2 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
                  <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>How to Fill This Section:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 font-medium leading-relaxed">
                    {(currentSlide?.detailedInstructions || []).map((inst, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>

                  {currentSlide.keyWarning && (
                    <div className="mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{currentSlide.keyWarning}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Active Fields Detail Inspector Panel */}
            <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-4 h-4 text-indigo-400" />
                <span>Field-by-Field Breakdown for Active Step</span>
              </h3>

              {activeFieldIds.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-400 text-xs italic text-center">
                  Overview slide - Click any field on the form image to view instant guidance.
                </div>
              ) : (
                <div className="space-y-3">
                  {(analysisResult.fields || [])
                    .filter(f => activeFieldIds.includes(f.id) || selectedField?.id === f.id)
                    .map((f) => (
                      <div
                        key={f.id}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-amber-400/50 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-amber-300 text-xs">
                            #{f.fieldNumber} {f.fieldName}
                          </span>
                          <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                            {f.requiredProofDocument}
                          </span>
                        </div>

                        <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                          ✍️ <span className="text-slate-300">Instructions:</span> {f.howToFill}
                        </p>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] space-y-1">
                          <div className="flex items-center justify-between text-slate-400 font-bold">
                            <span>Exemplar Value:</span>
                            <span className="text-rose-400 font-mono font-black">
                              {f.exampleValue}
                            </span>
                          </div>
                          <p className="text-[10px] text-amber-400 font-medium">
                            💡 <span className="font-bold">Approval Tip:</span> {f.approvalTip}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Quick AI Pro-Tip Box */}
            <div className="bg-gradient-to-r from-amber-500/10 to-indigo-500/10 p-4 rounded-2xl border border-amber-400/20 text-xs text-amber-200 flex items-start gap-3">
              <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-black block text-amber-300 mb-0.5">
                  AI Guarantee for Zero Form Rejection
                </span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  Always use clean block letters without overwriting or crossing out text. If you make a mistake on paper, obtain a fresh form instead of using whitening fluid.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
