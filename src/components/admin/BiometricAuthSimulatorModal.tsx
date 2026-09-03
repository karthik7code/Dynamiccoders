import React, { useState } from 'react';
import { ShieldCheck, Fingerprint, Lock, Key, Cpu, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface BiometricAuthSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BiometricAuthSimulatorModal: React.FC<BiometricAuthSimulatorModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'info' | 'prompt' | 'verifying' | 'success'>('info');
  const [biometricMethod, setBiometricMethod] = useState<'fingerprint' | 'faceid'>('fingerprint');

  if (!isOpen) return null;

  const handleStartDemo = () => {
    setStep('prompt');
  };

  const handleSimulateSensor = () => {
    setStep('verifying');
    setTimeout(() => {
      setStep('success');
    }, 1500);
  };

  const handleReset = () => {
    setStep('info');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Fingerprint className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">WebAuthn / FIDO2 Passkey Architecture</h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                  Future-Ready Demo
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Privacy-Preserving Hardware Enclave Biometric Authentication
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg">✕</button>
        </div>

        {/* STEP 1: ARCHITECTURE EXPLANATION */}
        {step === 'info' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5">
              <h4 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Zero-Raw-Biometric Storage Principle</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                JanAI adheres to international FIDO2 / W3C WebAuthn zero-trust security standards. Raw fingerprint scans and facial images are <strong>NEVER stored or transmitted</strong> to government servers or central databases.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 text-[11px] font-mono text-slate-400">
                <div className="p-2 bg-slate-900 rounded border border-slate-850">
                  <span className="text-emerald-400 font-bold block">1. Enclave Keypair</span>
                  Device TPM / Secure Enclave generates private key.
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-850">
                  <span className="text-purple-400 font-bold block">2. Local Matching</span>
                  Biometric sensor matches on-device only.
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-850">
                  <span className="text-cyan-400 font-bold block">3. Cryptographic Proof</span>
                  Server verifies signed challenge assertion.
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
              >
                Close
              </button>
              <button
                id="btn-start-passkey-demo"
                onClick={handleStartDemo}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Simulate Hardware Touch ID / Face ID</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATED PROMPT */}
        {step === 'prompt' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-950/60 border-2 border-emerald-500/50 flex items-center justify-center animate-pulse text-emerald-400 shadow-xl">
              <Fingerprint className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">Touch Biometric Sensor / Look at Camera</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Simulating device hardware prompt on Secure Enclave for user verification (RP ID: <code>janai.gov.in</code>).
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-4">
              <button
                id="btn-simulate-sensor-touch"
                onClick={handleSimulateSensor}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Simulate Sensor Match (Hardware Success)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CRYPTOGRAPHIC VERIFICATION */}
        {step === 'verifying' && (
          <div className="text-center py-8 space-y-3">
            <RefreshCw className="w-10 h-10 text-orange-400 mx-auto animate-spin" />
            <h4 className="text-sm font-bold text-white">Verifying Authenticator Assertion...</h4>
            <p className="text-xs text-slate-400 font-mono">
              Signing cryptographic challenge via ES256 hardware enclave key
            </p>
          </div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-base font-bold text-emerald-400">Cryptographic Assertion Validated!</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                The client device signed the nonce challenge using its hardware private key. Citizen session authenticated securely with zero biometric leakage.
              </p>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-left text-slate-400">
              <div className="text-emerald-400 font-bold mb-1">WebAuthn Signature Payload:</div>
              <div>credentialId: "passkey_7e9a047a_fido2_es256"</div>
              <div>authenticatorData: "flags: [UP, UV, BE] (User Present, User Verified)"</div>
              <div>signatureValid: true</div>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
              >
                Test Again
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Close Architecture Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
