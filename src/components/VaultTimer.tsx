"use client";

import { useState, useEffect } from "react";

export default function VaultTimer({ targetDate, compact = false }: { targetDate: string, compact?: boolean }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0, isUnlocked: false
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        setTimeLeft(prev => ({ ...prev, isUnlocked: true }));
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isUnlocked: false
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isUnlocked) {
    return (
      <div className={`text-[#64FFDA] font-bold animate-pulse tracking-widest text-center ${compact ? 'text-xs' : 'text-base'}`}>
        🔓 ACCESS GRANTED
      </div>
    );
  }

  // Dynamically size the numbers based on whether we are in "compact" mode
  const TimeUnit = ({ label, value }: { label: string, value: number }) => (
    <div className="flex flex-col items-center">
      <span className={`font-black text-white tabular-nums ${compact ? 'text-xl md:text-2xl' : 'text-3xl md:text-5xl'}`}>
        {value.toString().padStart(2, '0')}
      </span>
      <span className={`uppercase text-[#D4AF37] tracking-[0.2em] mt-1 ${compact ? 'text-[8px]' : 'text-[10px]'}`}>
        {label}
      </span>
    </div>
  );

  return (
    <div className={compact ? "w-full" : "bg-[#0A192F] border border-[#D4AF37]/20 rounded-2xl p-8 shadow-[0_0_50px_rgba(212,175,55,0.05)]"}>
      <div className={`flex justify-center items-center ${compact ? 'gap-2' : 'gap-4 md:gap-8'}`}>
        <TimeUnit label="Days" value={timeLeft.days} />
        <span className={`text-white/20 pb-4 ${compact ? 'text-lg' : 'text-2xl'}`}>:</span>
        <TimeUnit label="Hrs" value={timeLeft.hours} />
        <span className={`text-white/20 pb-4 ${compact ? 'text-lg' : 'text-2xl'}`}>:</span>
        <TimeUnit label="Min" value={timeLeft.minutes} />
        <span className={`text-white/20 pb-4 ${compact ? 'text-lg' : 'text-2xl'}`}>:</span>
        <TimeUnit label="Sec" value={timeLeft.seconds} />
      </div>
      
      {/* Only show the extra warning text if we are NOT in compact mode */}
      {!compact && (
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            {/* <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div> */}
            <span className="text-[10px] text-[#8892B0] uppercase tracking-[0.3em]">Temporal Lock Active</span>
          </div>
          <p className="text-[#8892B0] text-[10px] text-center max-w-[250px] leading-relaxed italic">
            This digital legacy is encrypted and will remain sealed until the date specified by the Steward.
          </p>
        </div>
      )}
    </div>
  );
}