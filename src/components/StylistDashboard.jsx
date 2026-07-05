import React from "react";
import { Users, DollarSign, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";

export default function StylistDashboard({ bookings }) {
  const todayDate = new Date().toISOString().split("T")[0];
  
  const todayBookings = bookings.filter(b => b.date === todayDate);
  const totalAppointments = bookings.length;
  
  const todayRevenue = todayBookings.reduce((sum, b) => sum + Number(b.price || 0), 0);
  const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.price || 0), 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 select-text">
      <div className="space-y-2">
        <h2 className="text-xl font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="text-emerald-400" /> Stylist Dashboard
        </h2>
        <p className="text-xs text-slate-400">View your daily schedule, total appointments, and financial tracking metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Revenue</span>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <DollarSign size={14} className="text-emerald-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">${todayRevenue}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
              <TrendingUp size={14} className="text-indigo-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">${totalRevenue}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Today's Clients</span>
            <div className="w-8 h-8 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
              <Users size={14} className="text-fuchsia-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{todayBookings.length}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Appointments</span>
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Calendar size={14} className="text-amber-400" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{totalAppointments}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-slate-400" />
            Today's Schedule
          </h3>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-1 rounded font-mono">{todayDate}</span>
        </div>
        <div className="p-6">
          {todayBookings.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">No appointments scheduled for today.</div>
          ) : (
            <div className="space-y-3">
              {todayBookings.sort((a,b) => a.time.localeCompare(b.time)).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 text-center border-r border-slate-800 pr-4">
                      <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Time</span>
                      <span className="text-sm font-black text-slate-200">{booking.time}</span>
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-100">{booking.customerName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{booking.serviceName} &bull; {booking.salonName}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20 flex items-center gap-1">
                      <CheckCircle size={10} /> Confirmed
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-300">${booking.price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
