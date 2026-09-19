import React from 'react';
import { Users, CheckCircle, MapPin, Heart, ShieldAlert, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const StatsBar: React.FC = () => {
  const { stats, donors } = useData();

  // Calculate cooldown donors currently spared from broad WhatsApp broadcast disturbances
  const cooldownCount = donors.filter(d => {
    if (!d.lastDonationDate) return false;
    const diffDays = Math.ceil(
      (new Date(d.lastDonationDate).getTime() + (d.gender === 'female' ? 120 : 90) * 86400000 - Date.now()) /
        86400000
    );
    return diffDays > 0;
  }).length;

  const statItems = [
    {
      label: 'Verified Donors',
      value: stats.totalDonors,
      subtext: 'Across 14 Kerala districts',
      icon: Users,
      color: 'text-red-400'
    },
    {
      label: 'Eligible Today',
      value: stats.activeDonors,
      subtext: 'Passed interval checks',
      icon: CheckCircle,
      color: 'text-emerald-400'
    },
    {
      label: 'Districts Active',
      value: `${stats.districtsCovered}/14`,
      subtext: '100% State coverage',
      icon: MapPin,
      color: 'text-amber-400'
    },
    {
      label: 'Spam Spared',
      value: cooldownCount,
      subtext: 'Ineligible in cooldown',
      icon: ShieldAlert,
      color: 'text-cyan-400'
    },
    {
      label: 'Lives Saved',
      value: stats.livesSaved,
      subtext: 'Successful matchings',
      icon: Heart,
      color: 'text-pink-400'
    }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-red-500/40 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  {item.label}
                </span>
                <div className={`p-2 rounded-xl bg-white/5 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {item.value}
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-red-500/60 inline" />
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
