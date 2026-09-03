import React, { useState, useEffect, useCallback, useMemo, useRef, Component, type ReactNode } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  ControlPosition,
  MapControl
} from '@vis.gl/react-google-maps';
import { HelpCenter } from '../data/helpCenters';
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  ShieldCheck,
  Star,
  Layers,
  Compass,
  Maximize2,
  Minimize2,
  ExternalLink,
  Ticket,
  AlertCircle,
  Key,
  Info,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  RefreshCw
} from 'lucide-react';

interface GoogleMapsHelpCenterMapProps {
  centers: HelpCenter[];
  selectedCenter: HelpCenter | null;
  onSelectCenter: (center: HelpCenter | null) => void;
  userCoords: { latitude: number; longitude: number } | null;
  onIssueToken?: (center: HelpCenter) => void;
}

// React Error Boundary for Google Maps SDK crashes
interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
  onCatch?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: any, errorInfo: any) {
    console.warn('[JanAI Maps] Caught Google Maps runtime error, falling back gracefully:', error, errorInfo);
    if (this.props.onCatch) {
      this.props.onCatch();
    }
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Helper to validate Google Maps Key format
function isValidGoogleMapsKey(key: string): boolean {
  if (!key) return false;
  const trimmed = key.trim();
  // Reject keys from other services (e.g. Tavily, OpenAI, Stripe)
  if (trimmed.startsWith('tvly-') || trimmed.startsWith('sk-') || trimmed.startsWith('pk_') || trimmed.startsWith('ghp_')) {
    return false;
  }
  // Standard Google Maps API keys usually start with 'AIza' and are 39 characters long
  return trimmed.length >= 20;
}

// Inner controller component to handle camera movements using useMap hook for Google Maps
const MapCameraController: React.FC<{
  selectedCenter: HelpCenter | null;
}> = ({ selectedCenter }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !selectedCenter) return;
    map.panTo({ lat: selectedCenter.latitude, lng: selectedCenter.longitude });
    map.setZoom(15);
  }, [map, selectedCenter]);

  return null;
};

// Custom Google Map controls toolbar
const MapCustomControls: React.FC<{
  userCoords: { latitude: number; longitude: number } | null;
  onRecenter: () => void;
  onFitAll: () => void;
  mapType: string;
  onChangeMapType: (type: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => void;
}> = ({ userCoords, onRecenter, onFitAll, mapType, onChangeMapType }) => {
  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="m-3 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 flex flex-col gap-1 text-xs">
        {userCoords && (
          <button
            type="button"
            onClick={onRecenter}
            title="Recenter to Live GPS Location"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 font-bold"
          >
            <Navigation className="w-4 h-4 fill-indigo-600 text-indigo-600" />
            <span className="hidden sm:inline">My GPS</span>
          </button>
        )}

        <button
          type="button"
          onClick={onFitAll}
          title="Fit all Help Centers on Screen"
          className="p-2 hover:bg-slate-100 rounded-xl text-slate-700 hover:text-indigo-600 transition-all flex items-center gap-1.5 font-bold"
        >
          <Compass className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Fit All</span>
        </button>

        <div className="border-t border-slate-200 pt-1 mt-1 flex flex-col gap-0.5">
          <button
            type="button"
            onClick={() => onChangeMapType(mapType === 'roadmap' ? 'hybrid' : 'roadmap')}
            className={`px-2 py-1.5 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1 ${
              mapType === 'hybrid' || mapType === 'satellite'
                ? 'bg-[#00003c] text-white'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mapType === 'hybrid' ? 'Hybrid' : 'Satellite'}</span>
          </button>
        </div>
      </div>
    </MapControl>
  );
};

// Fallback Interactive Vector Map Component (Used when API key is unconfigured or encounters auth issues)
const InteractiveFallbackMap: React.FC<{
  centers: HelpCenter[];
  selectedCenter: HelpCenter | null;
  onSelectCenter: (center: HelpCenter | null) => void;
  userCoords: { latitude: number; longitude: number } | null;
  onIssueToken?: (center: HelpCenter) => void;
  mapTheme: 'light' | 'dark' | 'satellite';
  onOpenKeyModal: () => void;
}> = ({
  centers,
  selectedCenter,
  onSelectCenter,
  userCoords,
  onIssueToken,
  mapTheme,
  onOpenKeyModal
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute bounding box for projection
  const bounds = useMemo(() => {
    const lats = centers.map((c) => c.latitude);
    const lngs = centers.map((c) => c.longitude);
    if (userCoords) {
      lats.push(userCoords.latitude);
      lngs.push(userCoords.longitude);
    }
    const minLat = Math.min(...lats, 8.0);
    const maxLat = Math.max(...lats, 35.0);
    const minLng = Math.min(...lngs, 68.0);
    const maxLng = Math.max(...lngs, 92.0);

    return {
      minLat: minLat - 0.5,
      maxLat: maxLat + 0.5,
      minLng: minLng - 0.5,
      maxLng: maxLng + 0.5,
    };
  }, [centers, userCoords]);

  // Project lat/lng to percentage coordinates
  const projectCoords = useCallback(
    (lat: number, lng: number) => {
      const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;
      // Invert Y because latitude goes South -> North but screens go Top -> Bottom
      const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100;
      return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
    },
    [bounds]
  );

  // Handle Mouse Drag for Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Recenter to user or center
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Center Type Pin styling
  const getTypeStyles = (type: HelpCenter['type']) => {
    switch (type) {
      case 'CSC Digital Seva Kendra':
        return { bg: 'bg-indigo-600', ring: 'ring-indigo-300', text: 'CSC' };
      case 'Tehsil / Revenue Office':
        return { bg: 'bg-amber-600', ring: 'ring-amber-300', text: 'Tehsil' };
      case 'Post Office Seva Kendra':
        return { bg: 'bg-rose-600', ring: 'ring-rose-300', text: 'Post' };
      case 'e-District Seva Kendra':
      default:
        return { bg: 'bg-emerald-600', ring: 'ring-emerald-300', text: 'e-Seva' };
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`relative w-full h-full overflow-hidden select-none cursor-grab ${
        isDragging ? 'cursor-grabbing' : ''
      } ${
        mapTheme === 'satellite'
          ? 'bg-[#0f172a]'
          : mapTheme === 'dark'
          ? 'bg-[#080d1a]'
          : 'bg-[#f1f5f9]'
      }`}
    >
      {/* Background Geo Grid pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="geo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geo-grid)" className="text-slate-600" />
      </svg>

      {/* Topographic contours visual embellishment */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full border border-dashed border-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        <div className="w-[400px] h-[400px] rounded-full border border-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        <div className="w-[200px] h-[200px] rounded-full border border-dashed border-amber-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Transformed Layer for Pan & Zoom */}
      <div
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        className="w-full h-full relative"
      >
        {/* User GPS Location Marker */}
        {userCoords && (() => {
          const { x, y } = projectCoords(userCoords.latitude, userCoords.longitude);
          return (
            <div
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            >
              <div className="relative flex items-center justify-center group">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 animate-ping absolute" />
                <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white z-10 ring-4 ring-blue-400/40">
                  <Navigation className="w-3.5 h-3.5 fill-white text-white" />
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-blue-900/90 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap">
                  You are here
                </div>
              </div>
            </div>
          );
        })()}

        {/* Render Help Center Markers */}
        {centers.map((center) => {
          const { x, y } = projectCoords(center.latitude, center.longitude);
          const isSelected = selectedCenter?.id === center.id;
          const style = getTypeStyles(center.type);

          return (
            <div
              key={center.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={`absolute -translate-x-1/2 -translate-y-full z-10 transition-transform ${
                isSelected ? 'scale-125 z-30' : 'hover:scale-115'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCenter(isSelected ? null : center);
                }}
                className={`no-drag group relative flex flex-col items-center focus:outline-none`}
              >
                {/* Pin Head */}
                <div
                  className={`w-7 h-7 rounded-full ${style.bg} border-2 border-white shadow-lg flex items-center justify-center text-white ring-2 ${
                    isSelected ? 'ring-yellow-400 ring-4 scale-110' : style.ring
                  } transition-all`}
                >
                  <MapPin className="w-3.5 h-3.5 fill-white" />
                </div>
                {/* Pin Tip */}
                <div
                  className={`w-1.5 h-2 ${style.bg} -mt-0.5 rounded-b-sm`}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
                />

                {/* Name Label Badge */}
                <div
                  className={`mt-0.5 px-2 py-0.5 rounded-md text-[9px] font-black shadow-md border whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#00003c] text-white border-amber-400'
                      : 'bg-white/90 text-slate-800 border-slate-200 group-hover:bg-white'
                  }`}
                >
                  {center.name.split('-')[0].trim()}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Floating InfoCard when Center is selected */}
      {selectedCenter && (
        <div className="no-drag absolute top-14 left-4 sm:left-6 z-40 max-w-[320px] w-full bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-slate-200 text-slate-900 space-y-3 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-900 border border-indigo-200 text-[10px] font-extrabold rounded-full">
              {selectedCenter.type}
            </span>
            <button
              onClick={() => onSelectCenter(null)}
              className="text-slate-400 hover:text-slate-600 font-bold text-xs p-1"
            >
              ✕
            </button>
          </div>

          <div>
            <h4 className="font-extrabold text-sm text-[#00003c] leading-snug flex items-start justify-between">
              <span>{selectedCenter.name}</span>
              {selectedCenter.isVerifiedGovtSpot && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              )}
            </h4>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{selectedCenter.rating}</span>
              <span className="text-slate-400">({selectedCenter.reviewCount} reviews)</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-black">{selectedCenter.distanceKm} km</span>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 space-y-1 text-xs text-slate-700">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-snug">
                {selectedCenter.address}, {selectedCenter.district} - {selectedCenter.pincode}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
              <Clock className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{selectedCenter.workingHours}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.latitude},${selectedCenter.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="py-2 bg-[#00003c] hover:bg-[#000080] text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1 shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
              <span>Navigate</span>
            </a>

            {onIssueToken && (
              <button
                type="button"
                onClick={() => onIssueToken(selectedCenter)}
                className="py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-1 shadow-xs"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Queue Token</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Zoom & Map Controls */}
      <div className="no-drag absolute top-3 right-3 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-slate-200 text-slate-700">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.3))}
          title="Zoom In"
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-bold"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.3))}
          title="Zoom Out"
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-bold"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          title="Reset Map View"
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-700 font-bold"
        >
          <Compass className="w-4 h-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
};

export const GoogleMapsHelpCenterMap: React.FC<GoogleMapsHelpCenterMapProps> = ({
  centers,
  selectedCenter,
  onSelectCenter,
  userCoords,
  onIssueToken,
}) => {
  // API Key handling: Check env, localStorage, or fallback
  const envApiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  
  const [customKey, setCustomKey] = useState<string>(() => {
    try {
      const stored = localStorage.getItem('janai_google_maps_api_key');
      if (stored) {
        if (!isValidGoogleMapsKey(stored)) {
          // Clear invalid legacy stored key (e.g. non-Google keys)
          localStorage.removeItem('janai_google_maps_api_key');
          return envApiKey && isValidGoogleMapsKey(envApiKey) ? envApiKey : '';
        }
        return stored;
      }
    } catch {
      // Ignore storage errors
    }
    return envApiKey && isValidGoogleMapsKey(envApiKey) ? envApiKey : '';
  });

  const [keyInput, setKeyInput] = useState<string>('');
  const [keyErrorMsg, setKeyErrorMsg] = useState<string | null>(null);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [mapTheme, setMapTheme] = useState<'light' | 'dark' | 'satellite'>('light');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [authError, setAuthError] = useState<boolean>(false);

  // Active key used by APIProvider
  const rawKey = (customKey || envApiKey || '').trim();
  const effectiveApiKey = isValidGoogleMapsKey(rawKey) ? rawKey : '';

  // Listen for Google Maps Authentication failure (e.g. invalid key or unconfigured project)
  useEffect(() => {
    const originalAuthFailure = (window as unknown as { gm_authFailure?: () => void }).gm_authFailure;

    (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
      console.warn('[JanAI Maps] Google Maps Platform Authentication error encountered.');
      setAuthError(true);
      if (originalAuthFailure) {
        originalAuthFailure();
      }
    };

    return () => {
      (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = originalAuthFailure;
    };
  }, []);

  // Save custom API key
  const handleSaveApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setKeyErrorMsg('Please enter a Google Maps API Key or Demo Key.');
      return;
    }
    if (!isValidGoogleMapsKey(trimmed)) {
      setKeyErrorMsg('Invalid Google Maps API Key format. Google Maps keys typically begin with AIzaSy... (Keys from Tavily, OpenAI, or other providers cannot be used for Google Maps).');
      return;
    }
    setKeyErrorMsg(null);
    try {
      localStorage.setItem('janai_google_maps_api_key', trimmed);
    } catch {
      // Ignore storage errors
    }
    setCustomKey(trimmed);
    setAuthError(false);
    setShowKeyModal(false);
  };

  const handleClearApiKey = () => {
    try {
      localStorage.removeItem('janai_google_maps_api_key');
    } catch {
      // Ignore storage errors
    }
    setCustomKey('');
    setAuthError(false);
    setKeyErrorMsg(null);
  };

  // Center calculation for Google Maps
  const defaultCenter = useMemo(() => {
    if (userCoords) {
      return { lat: userCoords.latitude, lng: userCoords.longitude };
    }
    if (centers.length > 0) {
      return { lat: centers[0].latitude, lng: centers[0].longitude };
    }
    return { lat: 18.5204, lng: 73.8567 }; // Pune default
  }, [userCoords, centers]);

  // Marker Pin Colors by Center Type for Google Maps SDK
  const getMarkerColors = (type: HelpCenter['type']) => {
    switch (type) {
      case 'CSC Digital Seva Kendra':
        return { background: '#4f46e5', glyphColor: '#ffffff', borderColor: '#312e81' };
      case 'Tehsil / Revenue Office':
        return { background: '#d97706', glyphColor: '#ffffff', borderColor: '#78350f' };
      case 'Post Office Seva Kendra':
        return { background: '#e11d48', glyphColor: '#ffffff', borderColor: '#881337' };
      case 'e-District Seva Kendra':
      default:
        return { background: '#059669', glyphColor: '#ffffff', borderColor: '#064e3b' };
    }
  };

  // Determine whether to use Live Google Maps SDK or Interactive Fallback
  const shouldUseGoogleMaps = Boolean(effectiveApiKey && !authError);

  return (
    <div
      className={`relative bg-slate-900 rounded-3xl border border-slate-200 overflow-hidden shadow-lg transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen' : 'w-full h-[520px] sm:h-[560px]'
      }`}
    >
      {/* Top Banner Toolbar */}
      <div className="absolute top-3 left-3 z-30 bg-white/95 backdrop-blur-md py-2 px-3.5 rounded-2xl shadow-md border border-slate-200 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-[#00003c] tracking-tight">
            {shouldUseGoogleMaps ? 'Google Maps Live Navigator' : 'Interactive Help Center Map'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold border-l border-slate-200 pl-2.5">
          <span>{centers.length} Centers Plotted</span>
        </div>

        {/* Fullscreen toggle button */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* API Key configuration button */}
        <button
          type="button"
          onClick={() => setShowKeyModal(true)}
          className={`p-1.5 rounded-xl transition-all flex items-center gap-1 text-[11px] font-black ${
            effectiveApiKey && !authError
              ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
          }`}
          title="Google Maps API Key Settings & Demo Key"
        >
          <Key className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">
            {effectiveApiKey && !authError ? 'Key Connected' : 'Google Maps Key'}
          </span>
        </button>
      </div>

      {/* Legend Overlay at Bottom Left */}
      <div className="absolute bottom-3 left-3 z-30 bg-white/95 backdrop-blur-md p-2.5 rounded-2xl shadow-md border border-slate-200 text-[10px] font-bold text-slate-700 flex flex-wrap items-center gap-2.5 max-w-xl">
        <span className="text-slate-400 uppercase tracking-wider font-black">Legend:</span>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
          <span>CSC Kendra</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Tehsil Office</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>e-District</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
          <span>Post Office</span>
        </div>
        {userCoords && (
          <div className="flex items-center gap-1 text-blue-700 font-extrabold">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-300 animate-ping" />
            <span>Live GPS</span>
          </div>
        )}
      </div>

      {/* Map Rendering Container */}
      <div className="w-full h-full">
        {shouldUseGoogleMaps ? (
          <MapErrorBoundary
            onCatch={() => setAuthError(true)}
            fallback={
              <InteractiveFallbackMap
                centers={centers}
                selectedCenter={selectedCenter}
                onSelectCenter={onSelectCenter}
                userCoords={userCoords}
                onIssueToken={onIssueToken}
                mapTheme={mapTheme}
                onOpenKeyModal={() => setShowKeyModal(true)}
              />
            }
          >
            <APIProvider
              apiKey={effectiveApiKey}
              onError={(err) => {
                console.warn('[JanAI Maps] Google Maps APIProvider failed to load SDK:', err);
                setAuthError(true);
              }}
            >
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={defaultCenter}
                defaultZoom={userCoords ? 13 : 11}
                mapId="DEMO_MAP_ID"
                mapTypeId={mapType}
                internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                <MapCameraController selectedCenter={selectedCenter} />

                <MapCustomControls
                  userCoords={userCoords}
                  mapType={mapType}
                  onChangeMapType={setMapType}
                  onRecenter={() => {
                    if (userCoords) onSelectCenter(null);
                  }}
                  onFitAll={() => onSelectCenter(null)}
                />

                {userCoords && (
                  <AdvancedMarker
                    position={{ lat: userCoords.latitude, lng: userCoords.longitude }}
                    title="Your Current Location (Live GPS)"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-500/25 animate-ping absolute" />
                      <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white z-10">
                        <Navigation className="w-3.5 h-3.5 fill-white" />
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {centers.map((center) => {
                  const colors = getMarkerColors(center.type);
                  const isSelected = selectedCenter?.id === center.id;

                  return (
                    <AdvancedMarker
                      key={center.id}
                      position={{ lat: center.latitude, lng: center.longitude }}
                      title={center.name}
                      onClick={() => onSelectCenter(center)}
                      zIndex={isSelected ? 100 : 1}
                    >
                      <Pin
                        background={colors.background}
                        glyphColor={colors.glyphColor}
                        borderColor={isSelected ? '#facc15' : colors.borderColor}
                        scale={isSelected ? 1.3 : 1.0}
                      />
                    </AdvancedMarker>
                  );
                })}

                {selectedCenter && (
                  <InfoWindow
                    position={{
                      lat: selectedCenter.latitude,
                      lng: selectedCenter.longitude,
                    }}
                    onCloseClick={() => onSelectCenter(null)}
                    pixelOffset={[0, -35]}
                  >
                    <div className="p-1 max-w-[270px] sm:max-w-xs text-slate-900 space-y-2.5 font-sans">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 text-[10px] font-extrabold rounded-full border border-indigo-200">
                          {selectedCenter.type}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                          📍 {selectedCenter.district}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#00003c] leading-tight flex items-start justify-between gap-1">
                          <span>{selectedCenter.name}</span>
                          {selectedCenter.isVerifiedGovtSpot && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          )}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{selectedCenter.rating}</span>
                          <span className="text-slate-400">({selectedCenter.reviewCount} reviews)</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                          <span>{selectedCenter.address} - {selectedCenter.pincode}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                          <Clock className="w-3 h-3 text-amber-500 shrink-0" />
                          <span>{selectedCenter.workingHours}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center gap-1.5">
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.latitude},${selectedCenter.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 bg-[#00003c] hover:bg-[#000080] text-white text-[11px] font-extrabold rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <Navigation className="w-3 h-3 text-amber-400" />
                          <span>Navigate</span>
                        </a>

                        {onIssueToken && (
                          <button
                            type="button"
                            onClick={() => onIssueToken(selectedCenter)}
                            className="flex-1 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-[11px] font-black rounded-lg flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <Ticket className="w-3 h-3" />
                            <span>Queue Token</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </MapErrorBoundary>
        ) : (
          <InteractiveFallbackMap
            centers={centers}
            selectedCenter={selectedCenter}
            onSelectCenter={onSelectCenter}
            userCoords={userCoords}
            onIssueToken={onIssueToken}
            mapTheme={mapTheme}
            onOpenKeyModal={() => setShowKeyModal(true)}
          />
        )}
      </div>

      {/* API Key Modal Configuration */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-[#00003c]">Google Maps Platform Key</h3>
              </div>
              <button
                onClick={() => {
                  setShowKeyModal(false);
                  setKeyErrorMsg(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              JanAI features full interactive vector GPS navigation out-of-the-box. Connecting your Google Maps API Key enables satellite photography layers and street-level Google Maps controls.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 space-y-2 text-xs text-amber-900">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-extrabold block">Prototyping with Maps Demo Key:</span>
                  <span>
                    You can test Google Maps Platform without billing setup using a free Google Maps Demo Key:
                  </span>
                </div>
              </div>
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-black text-indigo-900 hover:underline pt-1"
              >
                <span>Get Free Google Maps Demo Key</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <form onSubmit={handleSaveApiKey} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter Custom Google Maps API Key:
                </label>
                <input
                  type="text"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (keyErrorMsg) setKeyErrorMsg(null);
                  }}
                  placeholder={effectiveApiKey ? '••••••••••••••••' : 'AIzaSy...'}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00003c]"
                />
                {keyErrorMsg && (
                  <p className="text-xs font-bold text-rose-600 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{keyErrorMsg}</span>
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-xl text-xs shadow-xs"
                >
                  Save & Apply Key
                </button>
                {customKey && (
                  <button
                    type="button"
                    onClick={handleClearApiKey}
                    className="px-3 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold rounded-xl text-xs"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
