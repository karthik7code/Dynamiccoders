import React, { useState } from 'react';
import { Scheme, MissedMoneyItem, UserProfile } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  FileX, 
  ArrowRight, 
  RotateCcw, 
  Sparkles, 
  Bot,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';

interface OpportunityScoreViewProps {
  schemes: Scheme[];
  userProfile?: UserProfile;
  onOpenChecker: () => void;
  onAskAi: (prompt: string) => void;
  onBackToDashboard?: () => void;
}

export const OpportunityScoreView: React.FC<OpportunityScoreViewProps> = ({
  schemes,
  userProfile,
  onOpenChecker,
  onAskAi,
  onBackToDashboard,
}) => {
  const [activeTab, setActiveTab] = useState<'score' | 'missed'>('score');

  // Calculation simulation based on profile
  const totalPotentialBenefit = 480000; // INR
  const utilizedBenefit = 105000; // INR
  const utilizationPercentage = Math.round((utilizedBenefit / totalPotentialBenefit) * 100);

  // Sample Missed Money Items
  const missedItems: MissedMoneyItem[] = [
    {
      id: 'm1',
      schemeTitle: 'PM Kisan Samman Nidhi (Retro-active Installments)',
      amountMissed: 36000,
      timeframe: '2023 - 2025 (3 Years)',
      reason: 'Missing Document',
      reasonDescription: 'Land record 7/12 mutation was not linked to Aadhaar e-KYC on the PM-Kisan portal.',
      isRecoverable: true,
      recoverySteps: ['Complete Aadhaar e-KYC on pmkisan.gov.in', 'Submit updated 7/12 extract to local Tehsildar', 'Backlog installments will be credited directly to bank account'],
    },
    {
      id: 'm2',
      schemeTitle: 'Post-Matric Scholarship for Higher Studies',
      amountMissed: 48000,
      timeframe: '2022 - 2024',
      reason: 'Didn\'t Know',
      reasonDescription: 'Unaware that annual family income below ₹2.5 Lakh eligible for 100% tuition waiver.',
      isRecoverable: false,
      recoverySteps: ['Previous academic year cycle closed', 'Apply immediately for 2026-27 active cycle on NSP portal'],
    },
    {
      id: 'm3',
      schemeTitle: 'Ayushman Bharat Healthcare Free Insurance Cover',
      amountMissed: 90000,
      timeframe: '2024 - 2026',
      reason: 'Didn\'t Apply',
      reasonDescription: 'E-KYC Ayushman Card not printed despite Ration Card inclusion.',
      isRecoverable: true,
      recoverySteps: ['Visit nearest CSC centre or Ayushman App', 'Generate e-card using Aadhaar OTP instantly', 'Claim ₹5 Lakh/yr free hospital coverage'],
    },
  ];

  const totalMissedAmount = missedItems.reduce((acc, curr) => acc + curr.amountMissed, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="mb-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        )}
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold tracking-wide uppercase">
              ⭐ Features 2 & 3
            </span>
            <span className="text-xs text-amber-200 font-bold">JanAI Analytics Engine</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Opportunity Score & Missed Money Detector
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            Discover how effectively you are leveraging India's government benefits. JanAI analyzes your eligibility gaps and pinpoints unclaimed funds over the past 5 years.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak={`Your Government Benefit Opportunity Score is ${utilizationPercentage} percent. You are utilizing 1 Lakh 5 Thousand Rupees out of 4 Lakh 80 Thousand Rupees in available benefits. You have approximately 1.74 Lakh Rupees in missed benefits.`}
              label="Audio Summary"
            />
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('score')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'score'
              ? 'bg-[#00003c] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Feature 2: Government Opportunity Score</span>
        </button>

        <button
          onClick={() => setActiveTab('missed')}
          className={`px-5 py-2.5 rounded-2xl font-extrabold text-xs transition-all flex items-center gap-2 ${
            activeTab === 'missed'
              ? 'bg-[#00003c] text-white shadow-md'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span>Feature 3: Missed Money Detector (₹{(totalMissedAmount/100000).toFixed(2)} Lakhs)</span>
        </button>
      </div>

      {activeTab === 'score' ? (
        /* TAB 1: OPPORTUNITY SCORE GAUGE */
        <div className="space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Visual Circular/Gauge Display */}
            <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* SVG Circle Gauge */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e2e8f0"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f59e0b"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * utilizationPercentage) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#00003c]">{utilizationPercentage}%</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Benefit Score</span>
                </div>
              </div>

              <div className="mt-4 space-y-1">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full">
                  ⚠️ Low Utilization Rate
                </span>
                <p className="text-xs text-slate-600 mt-2">
                  You are utilizing <strong className="text-slate-900">₹{utilizedBenefit.toLocaleString('en-IN')}</strong> out of <strong className="text-emerald-700">₹{totalPotentialBenefit.toLocaleString('en-IN')}</strong> in eligible annual benefits.
                </p>
              </div>
            </div>

            {/* Actionable Breakdown to Reach 100% */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="font-extrabold text-lg text-[#00003c]">
                How to Boost Your Benefit Score to 100%
              </h3>

              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-emerald-950">Claim Ayushman Bharat Health Cover (+25%)</h4>
                    <p className="text-[11px] text-emerald-800">Unlocks ₹5 Lakhs free hospital coverage annually for family.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-amber-950">Apply for PM Internship Scheme 2026 (+20%)</h4>
                    <p className="text-[11px] text-amber-800">₹5,000/month stipend + ₹6,000 one-time grant for youth under 24.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-200 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs text-indigo-950">Enroll in PM MUDRA Business Loan (+33%)</h4>
                    <p className="text-[11px] text-indigo-800">Up to ₹10 Lakh collateral-free working capital loan for artisans & shopkeepers.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenChecker}
                className="w-full py-3 bg-[#00003c] hover:bg-[#000080] text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Run Full AI Profile Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      ) : (
        /* TAB 2: MISSED MONEY DETECTOR */
        <div className="space-y-6">
          
          <div className="bg-rose-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-rose-800">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/30 text-rose-200 font-extrabold text-xs border border-rose-400/40">
                🔍 5-Year Historical Scan
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Estimated Unclaimed Benefits: <span className="text-amber-400">₹1,74,000</span>
              </h2>
              <p className="text-xs text-rose-200 max-w-2xl">
                JanAI scanned official gazette timelines and detected 3 major government schemes where you were eligible but benefits were not claimed.
              </p>
            </div>

            <button
              onClick={() => onAskAi("How can I claim retro-active backlogs for PM Kisan and Ayushman Bharat?")}
              className="px-5 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-2xl shadow-lg transition-all shrink-0 flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>Ask AI Recovery Plan</span>
            </button>
          </div>

          {/* Breakdown Cards of Missed Money */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missedItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 relative">
                <div className="space-y-3">
                  
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-900 font-extrabold text-[10px] uppercase">
                      Missed: ₹{item.amountMissed.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">{item.timeframe}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#00003c]">
                    {item.schemeTitle}
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Why it was missed ({item.reason}):
                    </span>
                    <p className="text-xs text-slate-700 leading-snug">
                      {item.reasonDescription}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                      Recovery Action Plan:
                    </span>
                    <ul className="space-y-1">
                      {item.recoverySteps.map((step, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                          <span className="text-emerald-600 font-bold">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="pt-3 border-t border-slate-100">
                  {item.isRecoverable ? (
                    <span className="px-3 py-1.5 bg-emerald-100 text-emerald-950 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 w-full">
                      <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                      Recoverable Scheme
                    </span>
                  ) : (
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-xs text-center block w-full">
                      Past Cycle Closed (Apply Next Year)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
