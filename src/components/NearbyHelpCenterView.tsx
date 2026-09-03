import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCenter, HELP_CENTERS_DATABASE, calculateHaversineDistance } from '../data/helpCenters';
import { useToast } from '../context/ToastContext';
import { GoogleMapsHelpCenterMap } from './GoogleMapsHelpCenterMap';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  Building2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles, 
  Ticket, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  QrCode, 
  Download, 
  Star, 
  Info, 
  AlertCircle,
  RefreshCw,
  Compass,
  Map as MapIcon,
  LayoutGrid,
  Columns
} from 'lucide-react';

interface NearbyHelpCenterViewProps {
  onAskAi?: (prompt: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const NearbyHelpCenterView: React.FC<NearbyHelpCenterViewProps> = ({
  onAskAi,
  onNavigateToTab,
}) => {
  const { showToast } = useToast();

  const [userCoords, setUserCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map and View Mode State
  const [selectedMapCenter, setSelectedMapCenter] = useState<HelpCenter | null>(null);
  const [viewLayout, setViewLayout] = useState<'split' | 'map' | 'cards'>('split');

  // Token Modal State
  const [activeTokenCenter, setActiveTokenCenter] = useState<HelpCenter | null>(null);
  const [visitPurpose, setVisitPurpose] = useState<string>('Income Certificate / Domicile Proof');
  const [visitorName, setVisitorName] = useState<string>('Rahul Sharma');
  const [generatedToken, setGeneratedToken] = useState<{
    tokenNumber: string;
    centerName: string;
    visitPurpose: string;
    date: string;
    estimatedWait: string;
    qrCodeUrl: string;
  } | null>(null);

  // Auto-detect GPS on first load if available
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      showToast({
        title: 'GPS Unsupported',
        description: 'Please select your district manually from the dropdown.',
        type: 'warning',
      });
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ latitude, longitude });
        setIsLocating(false);
        showToast({
          title: 'Location Detected! 📍',
          description: `GPS coordinates retrieved (${latitude.toFixed(4)}, ${longitude.toFixed(4)}). Calculating distances...`,
          type: 'success',
        });
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error.message);
        setLocationError('Could not fetch precise GPS coordinates. Showing default district help centers.');
        showToast({
          title: 'Using District Search',
          description: 'Showing nearby help centers. You can select your district below.',
          type: 'info',
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  // Trigger GPS detection once on mount
  useEffect(() => {
    handleDetectLocation();
  }, []);

  // Compute help centers with updated distances
  const centersWithDistance = useMemo(() => {
    return HELP_CENTERS_DATABASE.map((center) => {
      let distanceKm = 0;
      if (userCoords) {
        distanceKm = calculateHaversineDistance(
          userCoords.latitude,
          userCoords.longitude,
          center.latitude,
          center.longitude
        );
      } else {
        // Mock distance relative to Pune center default for display
        distanceKm = calculateHaversineDistance(18.5204, 73.8567, center.latitude, center.longitude);
      }
      return { ...center, distanceKm };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userCoords]);

  // Unique Districts list
  const districtList = useMemo(() => {
    const list = Array.from(new Set(HELP_CENTERS_DATABASE.map((c) => c.district)));
    return ['All', ...list];
  }, []);

  // Unique Services list
  const servicesList = useMemo(() => {
    const set = new Set<string>();
    HELP_CENTERS_DATABASE.forEach((c) => c.servicesProvided.forEach((s) => set.add(s)));
    return ['All', ...Array.from(set)];
  }, []);

  // Filtered centers
  const filteredCenters = useMemo(() => {
    return centersWithDistance.filter((center) => {
      if (selectedDistrict !== 'All' && center.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
      if (selectedType !== 'All' && center.type !== selectedType) return false;
      if (selectedService !== 'All' && !center.servicesProvided.includes(selectedService)) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = center.name.toLowerCase().includes(q);
        const matchesAddress = center.address.toLowerCase().includes(q);
        const matchesPincode = center.pincode.includes(q);
        const matchesDistrict = center.district.toLowerCase().includes(q);
        const matchesServices = center.servicesProvided.some((s) => s.toLowerCase().includes(q));
        return matchesName || matchesAddress || matchesPincode || matchesDistrict || matchesServices;
      }

      return true;
    });
  }, [centersWithDistance, selectedDistrict, selectedType, selectedService, searchQuery]);

  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast({
      title: 'Address Copied! 📋',
      description: 'Address copied to clipboard for easy sharing.',
      type: 'success',
    });
  };

  const handleGenerateToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTokenCenter) return;

    const randomNum = Math.floor(100 + Math.random() * 900);
    const code = `${activeTokenCenter.district.substring(0, 3).toUpperCase()}-${randomNum}`;
    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    setGeneratedToken({
      tokenNumber: `TOK-${code}`,
      centerName: activeTokenCenter.name,
      visitPurpose,
      date: dateStr,
      estimatedWait: '12 - 15 minutes',
      qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=JANAI-TOKEN-${code}`,
    });

    showToast({
      title: 'Queue Token Issued! 🎟️',
      description: `Token ${code} issued for ${activeTokenCenter.name}`,
      type: 'success',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-900">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#00006e] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-full shadow-2xs">
              📍 Local Assistance Locator
            </span>
            <span className="px-3 py-1 bg-white/10 text-amber-300 font-bold text-xs rounded-full border border-white/20">
              CSC Seva Kendras & Revenue Offices
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Find Nearby Government Help Centers
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Get instant GPS-guided directions to official CSC Digital Seva Kendras, Tehsil Revenue Offices, Post Office Aadhaar Counters, and e-District Facilitation Centers for in-person document processing and scheme verification.
          </p>

          {/* GPS Detection Action Strip */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={handleDetectLocation}
              disabled={isLocating}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isLocating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Locating via GPS...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4 fill-slate-950" />
                  <span>Use Live GPS Location</span>
                </>
              )}
            </button>

            {userCoords && (
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live GPS Active ({userCoords.latitude.toFixed(3)}, {userCoords.longitude.toFixed(3)})
              </span>
            )}

            {locationError && (
              <span className="text-xs text-amber-300 bg-amber-900/40 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{locationError}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, landmark, pincode..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00003c]"
            />
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="All">All Districts ({districtList.length - 1})</option>
              {districtList.filter((d) => d !== 'All').map((dist) => (
                <option key={dist} value={dist}>
                  District: {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Center Type Dropdown */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="All">All Center Types</option>
              <option value="CSC Digital Seva Kendra">CSC Digital Seva Kendra</option>
              <option value="Tehsil / Revenue Office">Tehsil / Revenue Office</option>
              <option value="e-District Seva Kendra">e-District Seva Kendra</option>
              <option value="Post Office Seva Kendra">Post Office Seva Kendra</option>
            </select>
          </div>

          {/* Service Filter Dropdown */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none"
            >
              <option value="All">Filter by Service Needed</option>
              {servicesList.filter((s) => s !== 'All').map((srv) => (
                <option key={srv} value={srv}>
                  Service: {srv}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Service Tags Horizontal Scroll */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-extrabold text-[#00003c] text-[11px] shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Quick Service Filter:
          </span>
          {['All', 'Aadhaar eKYC & Mobile Update', 'Income & Domicile Certificate', 'PM-KISAN Farmer Registration & Land Seeding', 'Ayushman Bharat Golden Card Printing'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedService(tag)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 ${
                selectedService === tag
                  ? 'bg-[#00003c] text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

      </div>

      {/* View Switcher & Counter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <span>Found <strong className="text-[#00003c] font-black">{filteredCenters.length}</strong> help centers</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Sorted by live distance</span>
        </div>

        {/* View Mode Segmented Control */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center gap-1 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewLayout('split')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewLayout === 'split'
                ? 'bg-[#00003c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Map & List</span>
          </button>

          <button
            type="button"
            onClick={() => setViewLayout('map')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewLayout === 'map'
                ? 'bg-[#00003c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Full Map</span>
          </button>

          <button
            type="button"
            onClick={() => setViewLayout('cards')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              viewLayout === 'cards'
                ? 'bg-[#00003c] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Directory Cards</span>
          </button>
        </div>
      </div>

      {/* Main Content Layout based on View Mode */}
      {viewLayout === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Top: Google Maps */}
          <div className="lg:col-span-7 sticky top-4 space-y-3">
            <GoogleMapsHelpCenterMap
              centers={filteredCenters}
              selectedCenter={selectedMapCenter}
              onSelectCenter={(center) => setSelectedMapCenter(center)}
              userCoords={userCoords}
              onIssueToken={(center) => setActiveTokenCenter(center)}
            />
            {selectedMapCenter && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl flex items-center justify-between text-xs text-amber-950 font-medium">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Focused on: <strong>{selectedMapCenter.name}</strong></span>
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedMapCenter(null)}
                  className="text-amber-800 hover:underline font-bold text-[11px]"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Right: Scrollable Centers List */}
          <div className="lg:col-span-5 space-y-4 max-h-[620px] overflow-y-auto pr-1">
            {filteredCenters.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h3 className="font-extrabold text-sm text-[#00003c]">No Help Centers match filters</h3>
                <button
                  onClick={() => {
                    setSelectedDistrict('All');
                    setSelectedType('All');
                    setSelectedService('All');
                    setSearchQuery('');
                  }}
                  className="px-3.5 py-1.5 bg-[#00003c] text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredCenters.map((center) => {
                const isSelected = selectedMapCenter?.id === center.id;
                return (
                  <div
                    key={center.id}
                    onClick={() => setSelectedMapCenter(center)}
                    className={`bg-white rounded-3xl border p-4 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        {center.type}
                      </span>
                      <span className="px-2.5 py-0.5 bg-emerald-500 text-white font-black text-[10px] rounded-full flex items-center gap-1">
                        <Compass className="w-3 h-3" />
                        {center.distanceKm} km
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm leading-snug flex items-center justify-between">
                        <span>{center.name}</span>
                        {center.isVerifiedGovtSpot && (
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {center.address}, {center.district}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{center.rating}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveTokenCenter(center);
                          }}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg shadow-2xs"
                        >
                          Queue Token
                        </button>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="px-2.5 py-1 bg-[#00003c] text-white font-bold text-[11px] rounded-lg flex items-center gap-1"
                        >
                          <Navigation className="w-3 h-3 text-amber-400" />
                          <span>Route</span>
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {viewLayout === 'map' && (
        <div className="space-y-4">
          <GoogleMapsHelpCenterMap
            centers={filteredCenters}
            selectedCenter={selectedMapCenter}
            onSelectCenter={(center) => setSelectedMapCenter(center)}
            userCoords={userCoords}
            onIssueToken={(center) => setActiveTokenCenter(center)}
          />
        </div>
      )}

      {viewLayout === 'cards' && (
        <div className="space-y-4">
          {filteredCenters.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h3 className="font-extrabold text-base text-[#00003c]">No Help Centers match your filters</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting district or service filters to find nearby centers across surrounding areas.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict('All');
                  setSelectedType('All');
                  setSelectedService('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-[#00003c] text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCenters.map((center) => (
                <div
                  key={center.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                >
                  {/* Top Badge Strip */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          center.type === 'CSC Digital Seva Kendra'
                            ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                            : center.type === 'Tehsil / Revenue Office'
                            ? 'bg-amber-50 text-amber-900 border border-amber-200'
                            : center.type === 'Post Office Seva Kendra'
                            ? 'bg-rose-50 text-rose-900 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        }`}
                      >
                        {center.type}
                      </span>

                      <span className="px-2.5 py-1 bg-emerald-500 text-white font-black text-[11px] rounded-full shadow-2xs flex items-center gap-1 shrink-0">
                        <Compass className="w-3 h-3 text-white" />
                        {center.distanceKm} km away
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug flex items-start justify-between gap-1">
                      <span>{center.name}</span>
                      {center.isVerifiedGovtSpot && (
                        <span title="Verified Govt Center">
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        </span>
                      )}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {center.rating} ({center.reviewCount} reviews)
                      </span>
                      <span>•</span>
                      <span>{center.district}, {center.state}</span>
                    </div>
                  </div>

                  {/* Address & Working Hours Details */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-2 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-snug font-medium">
                        {center.address}, {center.landmark} - <strong>{center.pincode}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{center.workingHours}</span>
                    </div>

                    {center.vleCode && (
                      <div className="text-[10px] text-indigo-900 font-mono bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                        Operator: {center.operatorName} ({center.vleCode})
                      </div>
                    )}
                  </div>

                  {/* Services Provided Chips */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                      Supported Services ({center.servicesProvided.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {center.servicesProvided.slice(0, 3).map((srv, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md text-[10px] font-medium border border-slate-200"
                        >
                          • {srv}
                        </span>
                      ))}
                      {center.servicesProvided.length > 3 && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded-md text-[10px] font-extrabold">
                          +{center.servicesProvided.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.latitude},${center.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Navigation className="w-3.5 h-3.5 text-amber-400" />
                        <span>Directions</span>
                      </a>

                      <button
                        onClick={() => setActiveTokenCenter(center)}
                        className="px-3 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-2xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="w-3.5 h-3.5 text-slate-950" />
                        <span>Queue Token</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <button
                        onClick={() => handleCopyAddress(`${center.name}, ${center.address}, ${center.pincode}`)}
                        className="text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy Address
                      </button>

                      <a
                        href={`tel:${center.phone.replace(/\s/g, '')}`}
                        className="text-indigo-700 hover:underline font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {center.phone}
                      </a>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Digital Queue Token Modal */}
      <AnimatePresence>
        {activeTokenCenter && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-slate-900 my-auto"
            >
              {/* Header */}
              <div className="bg-[#00003c] text-white p-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-base text-white">Digital Queue Token Request</h3>
                </div>
                <button
                  onClick={() => {
                    setActiveTokenCenter(null);
                    setGeneratedToken(null);
                  }}
                  className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 text-xs">
                
                {!generatedToken ? (
                  <form onSubmit={handleGenerateToken} className="space-y-4">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-extrabold text-slate-400 block">Selected Center</span>
                      <p className="font-extrabold text-slate-900 text-sm">{activeTokenCenter.name}</p>
                      <p className="text-slate-500 text-[11px]">{activeTokenCenter.address}</p>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Your Full Name:</label>
                      <input
                        type="text"
                        required
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-800">Purpose of In-Person Visit:</label>
                      <select
                        value={visitPurpose}
                        onChange={(e) => setVisitPurpose(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 font-bold focus:outline-none"
                      >
                        <option value="Income Certificate / Domicile Proof">Income Certificate / Domicile Proof</option>
                        <option value="Aadhaar Biometric & Mobile Update">Aadhaar Biometric & Mobile Update</option>
                        <option value="PM-KISAN Land Mutation & eKYC">PM-KISAN Land Mutation & eKYC</option>
                        <option value="Ayushman Bharat Golden Card Print">Ayushman Bharat Golden Card Print</option>
                        <option value="Ration Card Seeding & eKYC">Ration Card Seeding & eKYC</option>
                        <option value="General Scheme Guidance & Form Submission">General Scheme Guidance & Form Submission</option>
                      </select>
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-amber-600" /> Token Priority Guarantee
                      </span>
                      <p>
                        Presenting a JanAI Digital Token at the CSC desk grants express counter processing and eliminates waiting in long public queues.
                      </p>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-2xl shadow-md transition-all text-xs"
                      >
                        Issue Priority Token Now
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 text-center">
                    
                    <div className="p-5 bg-gradient-to-b from-amber-50 to-white rounded-3xl border-2 border-dashed border-amber-300 space-y-3">
                      <div className="inline-block px-3 py-1 bg-amber-400 text-slate-950 font-black text-[10px] uppercase rounded-full tracking-wider">
                        Official JanAI Priority Pass
                      </div>

                      <div className="text-3xl font-black text-[#00003c] tracking-widest">
                        {generatedToken.tokenNumber}
                      </div>

                      <div className="text-xs font-bold text-slate-800">
                        Visitor: <span className="text-indigo-900">{visitorName}</span>
                      </div>

                      <div className="bg-white p-3 rounded-2xl border border-slate-200 max-w-xs mx-auto space-y-1 text-left">
                        <p className="font-bold text-slate-900">{generatedToken.centerName}</p>
                        <p className="text-[11px] text-slate-500">Purpose: {generatedToken.visitPurpose}</p>
                        <p className="text-[11px] text-emerald-700 font-extrabold">Est. Wait Time: {generatedToken.estimatedWait}</p>
                      </div>

                      <div className="pt-1 flex justify-center">
                        <img
                          src={generatedToken.qrCodeUrl}
                          alt="Token QR Code"
                          className="w-28 h-28 border border-slate-200 p-1 rounded-xl bg-white shadow-2xs"
                        />
                      </div>

                      <p className="text-[10px] text-slate-400 italic">
                        Scan QR at center entry desk for priority verification.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> Print Pass
                      </button>

                      <button
                        onClick={() => {
                          setActiveTokenCenter(null);
                          setGeneratedToken(null);
                        }}
                        className="flex-1 py-2.5 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold rounded-xl transition-all"
                      >
                        Done
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
