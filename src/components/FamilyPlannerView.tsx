import React, { useState } from 'react';
import { FamilyMemberProfile, Scheme } from '../types';
import { AiVoiceSpeaker } from './AiVoiceSpeaker';
import { 
  Users, 
  UserPlus, 
  Heart, 
  Sparkles, 
  DollarSign, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  ChevronRight, 
  Award,
  Bot,
  ArrowLeft
} from 'lucide-react';

interface FamilyPlannerViewProps {
  schemes: Scheme[];
  onAskAi: (prompt: string) => void;
  onSelectSchemeTitle: (title: string) => void;
  onBackToDashboard?: () => void;
}

export const FamilyPlannerView: React.FC<FamilyPlannerViewProps> = ({
  schemes,
  onAskAi,
  onSelectSchemeTitle,
  onBackToDashboard,
}) => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberProfile[]>([
    {
      id: 'f1',
      relation: 'Grandfather',
      name: 'Ramesh Sharma',
      age: 68,
      gender: 'Male',
      occupation: 'Government Employee',
      annualIncome: 120000,
      eligibleSchemeIds: ['ayushman-bharat', 'atal-pension-yojana'],
      utilizedBenefitValue: 500000,
      potentialBenefitValue: 500000,
      activeStatus: 'Active Benefits',
    },
    {
      id: 'f2',
      relation: 'Father',
      name: 'Suresh Sharma',
      age: 48,
      gender: 'Male',
      occupation: 'Farmer',
      annualIncome: 180000,
      eligibleSchemeIds: ['pm-kisan', 'kisan-credit-card', 'pm-fasal-bima'],
      utilizedBenefitValue: 6000,
      potentialBenefitValue: 56000,
      activeStatus: 'Action Needed',
    },
    {
      id: 'f3',
      relation: 'Mother',
      name: 'Sunita Sharma',
      age: 44,
      gender: 'Female',
      occupation: 'Homemaker',
      annualIncome: 0,
      eligibleSchemeIds: ['pm-matru-vandana', 'ayushman-bharat'],
      utilizedBenefitValue: 6000,
      potentialBenefitValue: 12000,
      activeStatus: '100% Utilized',
    },
    {
      id: 'f4',
      relation: 'Son / Daughter',
      name: 'Rahul Sharma (Self)',
      age: 21,
      gender: 'Male',
      occupation: 'Student',
      annualIncome: 0,
      eligibleSchemeIds: ['pm-internship-2026', 'post-matric-scholarship'],
      utilizedBenefitValue: 0,
      potentialBenefitValue: 66000,
      activeStatus: 'Action Needed',
    },
  ]);

  const [selectedMemberId, setSelectedMemberId] = useState<string>('f4');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New member form state
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState<FamilyMemberProfile['relation']>('Mother');
  const [newAge, setNewAge] = useState(30);

  const activeMember = (familyMembers || []).find((m) => m.id === selectedMemberId) || (familyMembers && familyMembers[0]);

  const totalHouseholdPotential = familyMembers.reduce((acc, m) => acc + m.potentialBenefitValue, 0);
  const totalHouseholdUtilized = familyMembers.reduce((acc, m) => acc + m.utilizedBenefitValue, 0);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newMem: FamilyMemberProfile = {
      id: `f-${Date.now()}`,
      relation: newRelation,
      name: newName,
      age: Number(newAge),
      gender: newRelation === 'Mother' || newRelation === 'Grandmother' ? 'Female' : 'Male',
      occupation: newAge > 60 ? 'Unemployed / Job Seeker' : newAge < 25 ? 'Student' : 'Self-Employed / Artisan',
      annualIncome: 100000,
      eligibleSchemeIds: ['ayushman-bharat', 'pm-mudra-yojana'],
      utilizedBenefitValue: 0,
      potentialBenefitValue: 50000,
      activeStatus: 'Action Needed',
    };

    setFamilyMembers([...familyMembers, newMem]);
    setSelectedMemberId(newMem.id);
    setShowAddModal(false);
    setNewName('');
  };

  const handleRemoveMember = (id: string) => {
    if (familyMembers.length <= 1) return;
    setFamilyMembers(familyMembers.filter((m) => m.id !== id));
    if (selectedMemberId === id) {
      setSelectedMemberId(familyMembers[0].id);
    }
  };

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
              ⭐ Exclusive Feature 4
            </span>
            <span className="text-xs text-amber-200 font-bold">JanAI Family Hub</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            AI Family Benefit Planner
          </h1>

          <p className="text-sm text-slate-200 leading-relaxed">
            Manage government benefits for your entire household in one place. JanAI maps pension for grandparents, women schemes for mothers, farmer subsidies for fathers, and scholarships for students.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <AiVoiceSpeaker
              textToSpeak={`AI Family Benefit Planner. Total combined annual household potential benefits for your family is ${totalHouseholdPotential.toLocaleString('en-IN')} Rupees.`}
              label="Listen to Family Summary"
            />
          </div>
        </div>
      </div>

      {/* Family Household Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-[#000080] flex items-center justify-center font-extrabold shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Family Members</span>
            <p className="text-2xl font-black text-[#00003c]">{familyMembers.length} Members</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-extrabold shrink-0">
            <Award className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Potential Benefits</span>
            <p className="text-2xl font-black text-amber-700">₹{totalHouseholdPotential.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-extrabold shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Annual Utilization</span>
            <p className="text-2xl font-black text-emerald-700">₹{totalHouseholdUtilized.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Member Selection Tabs & Add Button */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#00003c] uppercase tracking-wider">
            Select Family Member:
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Family Member
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {familyMembers.map((m) => {
            const isSelected = m.id === selectedMemberId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`p-4 rounded-2xl text-left transition-all border flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? 'bg-[#00003c] text-white border-[#00003c] shadow-md ring-2 ring-amber-400'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    isSelected ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {m.relation}
                  </span>
                  {familyMembers.length > 1 && (
                    <span
                      onClick={(e) => { e.stopPropagation(); handleRemoveMember(m.id); }}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm">{m.name}</h3>
                  <p className={`text-[11px] ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    {m.occupation} • {m.age} yrs
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/40 flex items-center justify-between text-[11px]">
                  <span className="font-bold">Potential:</span>
                  <span className={`font-black ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                    ₹{m.potentialBenefitValue.toLocaleString('en-IN')}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Member Detailed Schemes Breakdown */}
      <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-extrabold text-[#00003c]">{activeMember?.name}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-[#000080] font-extrabold text-xs">
                {activeMember?.relation}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Occupation: {activeMember?.occupation} | Age: {activeMember?.age} yrs | Gender: {activeMember?.gender}
            </p>
          </div>

          <button
            onClick={() => onAskAi(`What schemes can I apply for my ${activeMember?.relation} (${activeMember?.name}, age ${activeMember?.age}, ${activeMember?.occupation})?`)}
            className="px-4 py-2 bg-[#00003c] hover:bg-[#000080] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>Ask AI Family Advisor</span>
          </button>
        </div>

        {/* Schemes list for this family member */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {activeMember?.eligibleSchemeIds?.map((schemeId) => {
            const scheme = (schemes || []).find((s) => s.id === schemeId);
            if (!scheme) return null;

            return (
              <div key={scheme.id} className="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                    {scheme.category}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Verified Match
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-[#00003c]">{scheme.title}</h4>
                <p className="text-xs text-amber-950 font-bold bg-amber-50/70 p-2 rounded-lg border border-amber-200">
                  Benefit: {scheme.benefitValue}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectSchemeTitle(scheme.title)}
                    className="text-xs font-bold text-[#000080] hover:underline flex items-center gap-1"
                  >
                    View Scheme <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-[#00003c]">Add Family Member</h3>
            
            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Ramesh Sharma"
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Relationship</label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Grandfather">Grandfather</option>
                  <option value="Grandmother">Grandmother</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Son / Daughter">Son / Daughter</option>
                  <option value="Sibling">Sibling</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="120"
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-xl bg-slate-50 font-medium"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#00003c] text-white font-extrabold rounded-xl hover:bg-[#000080]"
                >
                  Add Member & Calculate Benefits
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl"
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
