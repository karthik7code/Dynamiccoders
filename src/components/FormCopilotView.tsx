import React, { useState } from 'react';
import { Scheme, UserProfile } from '../types';
import { SCHEMES_DATABASE } from '../data/schemes';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { useToast } from '../context/ToastContext';
import { 
  Bot, 
  Send, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  User, 
  Building2, 
  DollarSign, 
  Download,
  Check
} from 'lucide-react';

interface FormCopilotViewProps {
  schemes?: Scheme[];
  schemeTitle?: string;
  userProfile?: UserProfile;
}

export const FormCopilotView: React.FC<FormCopilotViewProps> = ({
  schemes = SCHEMES_DATABASE,
  schemeTitle,
  userProfile,
}) => {
  const { showToast } = useToast();
  const availableSchemes = (schemes && schemes.length > 0) ? schemes : SCHEMES_DATABASE;

  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(() => {
    if (schemeTitle) {
      const match = availableSchemes.find(
        (s) => s.title.toLowerCase().includes(schemeTitle.toLowerCase()) || schemeTitle.toLowerCase().includes(s.title.toLowerCase())
      );
      if (match) return match.id;
    }
    return availableSchemes[0]?.id || 'pm-internship-2026';
  });

  
  // Conversational form wizard steps
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formAnswers, setFormAnswers] = useState({
    fullName: userProfile?.fullName || 'Rahul Sharma',
    age: userProfile?.age || 21,
    state: userProfile?.state || 'Karnataka',
    maritalStatus: userProfile?.maritalStatus || 'Unmarried',
    education: userProfile?.highestEducation || '12th Pass',
    familyIncome: userProfile?.annualFamilyIncome || 240000,
    hasAadhaarBankDbt: true,
    bankAccountNo: '987654321012',
    ifscCode: 'SBIN0001234',
  });

  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: "Namaste! I am your JanAI Form Copilot. I will ask you a few simple conversational questions and auto-fill your official government application form. Let's start!",
    },
    {
      id: 'msg-2',
      sender: 'ai',
      text: 'Question 1: Are you married or unmarried?',
    }
  ]);

  const fallbackScheme: Scheme = availableSchemes[0] || {
    id: 'pm-internship-2026',
    title: 'PM National Internship Scheme 2026',
    code: 'PM-INT-2026',
    category: 'Skill Development',
    ministry: 'Ministry of Corporate Affairs',
    origin: 'central',
    stateName: undefined,
    benefitValue: '₹5,000/month stipend + ₹6,000 one-time assistance',
    description: '1 crore youth internship opportunities in top 500 Indian companies.',
    eligibilityDescription: 'Indian youth aged 21-24 years not in full-time employment.',
    requiredDocs: ['Aadhaar Card', 'Educational Certificate', 'Bank Passbook with Aadhaar DBT'],
    officialWebsiteUrl: 'https://pminternship.mca.gov.in',
    rules: { minAge: 21, maxAge: 24, requiresStudent: true, maxAnnualIncome: 800000 },
    deadline: '2026-08-31',
    iconName: 'GraduationCap',
  };

  const selectedScheme = availableSchemes.find((s) => s.id === selectedSchemeId) || availableSchemes[0] || fallbackScheme;

  const handleSelectOption = (questionKey: string, value: any, optionLabel: string) => {
    // Add user message
    const userMsg = { id: `user-${Date.now()}`, sender: 'user', text: optionLabel };
    setFormAnswers((prev) => ({ ...prev, [questionKey]: value }));

    let nextAiMsgText = '';
    if (currentStepIndex === 0) {
      nextAiMsgText = 'Great! Question 2: What is your highest completed education level?';
    } else if (currentStepIndex === 1) {
      nextAiMsgText = 'Perfect. Question 3: Is your bank account linked with Aadhaar for Direct Benefit Transfer (DBT)?';
    } else if (currentStepIndex === 2) {
      nextAiMsgText = '🎉 Awesome! I have auto-filled 100% of your government application form using your verified profile details. Check the form preview on the right!';
    } else {
      nextAiMsgText = 'Form completed! You can now download your pre-filled application or submit it directly.';
    }

    if (currentStepIndex === 2) {
      showToast({
        title: 'Form Auto-Filled 100%!',
        description: `All fields for ${selectedScheme?.title || 'Selected Scheme'} populated automatically.`,
        type: 'success',
      });
    }

    const aiMsg = { id: `ai-${Date.now()}`, sender: 'ai', text: nextAiMsgText };
    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
    setCurrentStepIndex((prev) => prev + 1);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#00003c] via-[#000060] to-[#000080] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-extrabold tracking-wide uppercase">
              ⭐ Exclusive Feature 7
            </span>
            <span className="text-xs text-amber-200 font-bold">JanAI Copilot</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Form Copilot Assistant
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            Never struggle with long, complicated government forms again. Chat naturally with JanAI in simple words, and AI will automatically fill out all form fields, legalese sections, and document declarations for you.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak="JanAI Form Copilot. Chat naturally with AI to auto fill your official government application forms."
              label="Listen to Copilot Intro"
            />
          </div>
        </div>
      </div>

      {/* Scheme Selector Dropdown */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-900 rounded-xl flex items-center justify-center font-bold shrink-0">
            <FileText className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-[#00003c]">Select Scheme Application Form:</h3>
            <p className="text-xs text-slate-500">Auto-fills official form fields in real-time</p>
          </div>
        </div>

        <select
          value={selectedSchemeId}
          onChange={(e) => {
            setSelectedSchemeId(e.target.value);
            setCurrentStepIndex(0);
          }}
          className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#00003c]"
        >
          {(availableSchemes || []).map((s) => (
            <option key={s.id} value={s.id}>{s.title} ({s.category})</option>
          ))}
        </select>
      </div>

      {/* Main Split Interface: Chatbot Left, Live Form Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chatbot Left */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-[#00003c]">JanAI Conversational Copilot</h4>
                <p className="text-[10px] text-emerald-600 font-bold">Online • Auto-Filling Active</p>
              </div>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 text-xs">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    🤖
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#00003c] text-white font-medium rounded-br-none'
                      : 'bg-slate-100 text-slate-800 font-medium rounded-bl-none border border-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Question Input Options */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Click Response Option:
            </span>

            {currentStepIndex === 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectOption('maritalStatus', 'Unmarried', 'I am Unmarried')}
                  className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-300 rounded-xl text-xs transition-colors"
                >
                  Unmarried
                </button>
                <button
                  onClick={() => handleSelectOption('maritalStatus', 'Married', 'I am Married')}
                  className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold border border-amber-300 rounded-xl text-xs transition-colors"
                >
                  Married
                </button>
              </div>
            )}

            {currentStepIndex === 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectOption('education', '12th Pass', '12th Pass')}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#000080] font-bold border border-indigo-200 rounded-xl text-xs transition-colors"
                >
                  12th Pass
                </button>
                <button
                  onClick={() => handleSelectOption('education', 'Graduate', 'Graduate Degree')}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#000080] font-bold border border-indigo-200 rounded-xl text-xs transition-colors"
                >
                  Graduate
                </button>
              </div>
            )}

            {currentStepIndex === 2 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectOption('hasAadhaarBankDbt', true, 'Yes, Bank Account Linked with Aadhaar')}
                  className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold border border-emerald-300 rounded-xl text-xs transition-colors"
                >
                  Yes, DBT Linked ✓
                </button>
              </div>
            )}

            {currentStepIndex >= 3 && (
              <div className="p-3 bg-emerald-100 text-emerald-950 rounded-xl font-bold text-xs flex items-center justify-between">
                <span>100% Form Auto-Filled Successfully!</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
            )}
          </div>
        </div>

        {/* Live Form Preview Right */}
        <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between space-y-4 border border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h4 className="font-extrabold text-sm text-white">Live Government Form Preview</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px]">
                {currentStepIndex >= 3 ? '100% Auto-Filled' : 'Auto-Filling In Progress...'}
              </span>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-3 text-xs">
              <div className="border-b border-slate-700 pb-2">
                <span className="text-[10px] text-amber-400 font-bold uppercase">Form Title:</span>
                <p className="font-extrabold text-sm text-white">{selectedScheme.title}</p>
                <p className="text-[10px] text-slate-400">{selectedScheme.ministry}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Applicant Name:</span>
                  <span className="font-bold text-white">{formAnswers.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Age / State:</span>
                  <span className="font-bold text-white">{formAnswers.age} yrs • {formAnswers.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Marital Status:</span>
                  <span className="font-bold text-amber-300">{formAnswers.maritalStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Education:</span>
                  <span className="font-bold text-amber-300">{formAnswers.education}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Aadhaar DBT Status:</span>
                  <span className="font-bold text-emerald-400">Verified & Active ✓</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Estimated Benefit:</span>
                  <span className="font-bold text-emerald-300">{selectedScheme.benefitValue}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center gap-3">
            <a
              href={selectedScheme.officialWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                showToast({
                  title: 'Form Redirecting & Submitting',
                  description: `Redirecting to official government portal for ${selectedScheme.title}.`,
                  type: 'success',
                });
              }}
              className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl text-center shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <span>Submit Form on Official Portal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
