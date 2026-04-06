import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { IndianRupee, ReceiptText, ShieldCheck, ArrowRight, ArrowLeft, Printer, Download, CheckCircle2, ChevronDown, Building, MapPin, Clock } from 'lucide-react';

const RefundRequest = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [pgName, setPgName] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [isPgDropdownOpen, setIsPgDropdownOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serverBookings, setServerBookings] = useState([]);

  // Load bookings from localStorage and Server
  useEffect(() => {
    const fetchAll = async () => {
      let local = [];
      let refunds = [];
      try {
        const allStr = localStorage.getItem('allBookings');
        local = allStr ? JSON.parse(allStr) : [];
        const refStr = localStorage.getItem('refund_requests');
        refunds = refStr ? JSON.parse(refStr) : [];
        const latestStr = localStorage.getItem('latestBooking');
        if (latestStr) {
          const latest = JSON.parse(latestStr);
          if (!local.some(b => b.bookingDate === latest.bookingDate)) {
            local.push(latest);
          }
        }
      } catch (e) {
        console.error("Local load error", e);
      }

      let server = [];
      try {
        const res = await api.get('/sync/bookings');
        if (res.data && Array.isArray(res.data)) {
          server = res.data.filter(b => 
            b.userDetails?.email === user?.email || 
            (b.userDetails?.email && user?.email && b.userDetails.email.toLowerCase() === user.email.toLowerCase())
          );
          setServerBookings(server);
        }
      } catch (e) {
        console.error("Server sync error", e);
      }

      // Combine and deduplicate by bookingDate
      const map = new Map();
      server.forEach(b => map.set(b.bookingDate, b));
      local.forEach(b => {
        if (b.bookingDate && !map.has(b.bookingDate)) map.set(b.bookingDate, b);
      });

      // Filter out ANY booking that already has a refund request
      const combined = Array.from(map.values());
      const filtered = combined.filter(b => {
        if (!b.bookingDate) return false;
        const bTime = new Date(b.bookingDate).getTime();
        return !refunds.some(r => {
          if (!r.bookingDate) return false;
          return new Date(r.bookingDate).getTime() === bTime;
        });
      });

      setBookings(filtered);
    };

    if (user?.email) {
      fetchAll();
    }
  }, [user?.email]);

  // Get individual bookings for the dropdown
  const individualBookings = useMemo(() => {
    return [...bookings].sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0));
  }, [bookings]);

  const handleSelectBooking = (booking) => {
    setPgName(booking.pg?.pgName || '');
    setIsPgDropdownOpen(false);
    setSelectedBooking(booking);

    if (booking) {
      // Calculate independent durations
      const rMultiplier = booking.roomPack === 'yearly' ? 12 : 1;
      const mMultiplier = booking.mealPack === 'yearly' ? 12 : 1;
      
      const roomCost = (booking.activeSharePrice || 0) * rMultiplier;
      const mealCost = (booking.activeFoodPrice || 0) * mMultiplier;
      const totalCombined = roomCost + mealCost;
      
      setTotalAmount(totalCombined.toString());
    } else {
      setTotalAmount('');
    }
  };

  const amountValue = parseFloat(totalAmount) || 0;
  const { refundAmount, deductionAmount, refundPercent, monthsElapsed } = useMemo(() => {
    const amountVal = amountValue;
    if (!selectedBooking || !selectedBooking.bookingDate) {
      return { refundAmount: amountVal * 0.7, deductionAmount: amountVal * 0.3, refundPercent: 70, monthsElapsed: 0 };
    }

    const bookingDate = new Date(selectedBooking.bookingDate);
    const now = new Date();
    
    // Calculate months elapsed
    let months = (now.getFullYear() - bookingDate.getFullYear()) * 12 + (now.getMonth() - bookingDate.getMonth());
    // If we haven't reached the same day of the month yet, subtract one month
    if (now.getDate() < bookingDate.getDate()) {
      months--;
    }
    // Ensure at least 1 (e.g., within the first month is 1)
    const elapsed = Math.max(1, months + 1);

    let percent = 0;
    if (elapsed <= 1) percent = 80;
    else if (elapsed <= 5) percent = 40;
    else if (elapsed <= 8) percent = 20;
    else percent = 0;

    const refund = amountVal * (percent / 100);
    const deduction = amountVal - refund;

    return { 
      refundAmount: refund, 
      deductionAmount: deduction, 
      refundPercent: percent,
      monthsElapsed: elapsed
    };
  }, [totalAmount, selectedBooking]);

  const handleApply = (e) => {
    e.preventDefault();
    const amountVal = parseFloat(totalAmount) || 0;
    if (amountVal > 0 && pgName) {
      const newRefund = {
        id: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
        pgName,
        userEmail: user?.email, // Tagging for privacy filtering
        packType: selectedBooking?.roomPack === 'yearly' ? 'Yearly' : 'Monthly',
        roomPack: selectedBooking?.roomPack,
        mealPack: selectedBooking?.mealPack,
        totalAmount: amountVal,
        refundAmount,
        deductionAmount,
        refundPercent,
        monthsElapsed,
        date: new Date().toISOString(),
        bookingDate: selectedBooking.bookingDate, // CRITICAL: Used for filtering out of the selection list
        userName: user?.name
      };

      // Persist to localStorage for BookingsPage
      const existing = JSON.parse(localStorage.getItem('refund_requests') || '[]');
      localStorage.setItem('refund_requests', JSON.stringify([...existing, newRefund]));

      // Remove from local allBookings to prevent double refund
      const updatedBookings = bookings.filter(b => b.bookingDate !== selectedBooking.bookingDate);
      localStorage.setItem('allBookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);

      // Also clear latestBooking if it was the one being refunded
      const latest = JSON.parse(localStorage.getItem('latestBooking') || '{}');
      if (latest.bookingDate === selectedBooking.bookingDate) {
        localStorage.removeItem('latestBooking');
      }

      // Proactively release the bed in backend memory
      if (selectedBooking?.room?.roomId) {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
        fetch(`${API_BASE_URL}/sync/release`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pgName: selectedBooking.pg?.pgName,
            roomId: selectedBooking.room.roomId,
            bookingDate: selectedBooking.bookingDate // Match unique booking!
          })
        }).catch(err => console.error("Failed to release bed on refund", err));
      }

      setSubmitted(true);
      setSelectedBooking(null);
      setPgName('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Premium Back Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group mb-8 flex items-center gap-3 px-5 py-3 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white hover:border-brand-200 transition-all active:scale-[0.98] outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Navigation</p>
            <p className="text-sm font-bold text-slate-700 leading-none">Go Back</p>
          </div>
        </button>

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-brand-100">
             <IndianRupee className="w-3 h-3" /> Refund Processing Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Refund Request</h1>
          <p className="text-slate-500 font-medium">Professional settlement of your accommodation plans.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Full Name</label>
                <input 
                  type="text" 
                  value={user?.name || ''} 
                  readOnly 
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Select Booked PG</label>
                <div className="relative">
                  {/* Custom Dropdown Trigger */}
                  <div 
                    onClick={() => !submitted && setIsPgDropdownOpen(!isPgDropdownOpen)}
                    className={`w-full px-5 py-4 bg-white border-2 rounded-3xl text-sm font-bold flex items-center justify-between cursor-pointer transition-all ${
                      isPgDropdownOpen 
                        ? 'border-emerald-500 ring-4 ring-emerald-500/10' 
                        : 'border-slate-100 hover:border-slate-200 shadow-sm'
                    } ${submitted ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                       <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${pgName ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                          <Building className="w-4 h-4" />
                       </div>
                       <span className={pgName ? 'text-slate-900' : 'text-slate-400'}>
                         {pgName ? `${pgName} (${new Date(selectedBooking?.bookingDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })})` : 'Choose your PG accommodation...'}
                       </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isPgDropdownOpen ? 'rotate-180 text-emerald-500' : ''}`} />
                  </div>

                  {/* Custom Dropdown Menu */}
                  {isPgDropdownOpen && !submitted && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsPgDropdownOpen(false)} />
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[2rem] shadow-2xl shadow-emerald-900/10 z-50 py-3 animate-in fade-in zoom-in-95 duration-200 max-h-80 overflow-y-auto">
                        <div className="px-5 py-2 mb-2 border-b border-slate-50">
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em]">Your Active Bookings</p>
                        </div>
                        {individualBookings.length > 0 ? (
                          individualBookings.map((b, idx) => (
                            <div 
                              key={idx}
                              onClick={() => handleSelectBooking(b)}
                              className="px-5 py-3.5 hover:bg-emerald-50 cursor-pointer transition-colors group"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-black text-slate-800 text-sm group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{b.pg?.pgName}</p>
                                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">
                                      {b.bookingMode === 'full' ? 'Stay + Food' : 'Food Only'}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                      <span className="text-[11px] font-black text-slate-700 uppercase">
                                        Resident: {b.userDetails?.fullName || user?.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-70">
                                      <Clock className="w-3 h-3 text-slate-400" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                                        Booked: {new Date(b.bookingDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-60">
                                      <MapPin className="w-3 h-3 text-slate-400" />
                                      <span className="text-[10px] font-bold text-slate-500 uppercase">{b.pg?.area}, {b.pg?.city}</span>
                                    </div>
                                    {b.userDetails?.phone && (
                                       <div className="flex items-center gap-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 border-t border-slate-50 pt-1">
                                         <span>Contact: {b.userDetails.phone}</span>
                                         {b.userDetails.city && (
                                           <>
                                             <div className="w-1 h-1 rounded-full bg-slate-300" />
                                             <span className="text-brand-600">Place: {b.userDetails.city}</span>
                                           </>
                                         )}
                                       </div>
                                    )}
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                   <ArrowRight className="w-4 h-4" />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-5 py-8 text-center">
                            <p className="text-xs font-bold text-slate-400">No active bookings found.</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Booking Breakdown Section */}
              {selectedBooking && !submitted && (
                <div className="bg-emerald-50/50 rounded-3xl p-6 border border-emerald-100 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Booking Summary Breakdown</p>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Room Breakdown */}
                    {selectedBooking.activeSharePrice > 0 && (
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Room: {selectedBooking.sharing?.label} Sharing</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                            ₹{selectedBooking.activeSharePrice.toLocaleString()} × {selectedBooking.roomPack === 'yearly' ? '12 Months (Yearly)' : '1 Month (Monthly)'}
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-900 italic">
                          ₹{(selectedBooking.activeSharePrice * (selectedBooking.roomPack === 'yearly' ? 12 : 1)).toLocaleString()}
                        </p>
                      </div>
                    )}

                    {/* Meal Breakdown */}
                    {selectedBooking.activeFoodPrice > 0 && (
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Meal: {selectedBooking.food?.label} Plan</p>
                          <p className="text-[9px] font-bold text-slate-500 uppercase mt-0.5">
                            ₹{selectedBooking.activeFoodPrice.toLocaleString()} × {selectedBooking.mealPack === 'yearly' ? '12 Months (Yearly)' : '1 Month (Monthly)'}
                          </p>
                        </div>
                        <p className="text-sm font-black text-slate-900 italic">
                          ₹{(selectedBooking.activeFoodPrice * (selectedBooking.mealPack === 'yearly' ? 12 : 1)).toLocaleString()}
                        </p>
                      </div>
                    )}

                    <div className="h-px bg-emerald-100 my-2" />
                    
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Total Verified Paid (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={totalAmount}
                  onChange={(e) => setTotalAmount(e.target.value)}
                  required
                  readOnly={!!selectedBooking}
                  className={`w-full px-4 py-3.5 border rounded-2xl text-sm font-bold text-slate-900 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none ${selectedBooking ? 'bg-slate-50 border-slate-200 cursor-not-allowed text-slate-500' : 'bg-white border-slate-200'}`}
                />
              </div>

              {!submitted && (
                <button 
                  type="submit"
                  className="w-full py-4 bg-brand-600 hover:bg-brand-700 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-lg shadow-brand-500/20 transition-all hover:shadow-brand-500/40 active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
                >
                  Generate Refund Receipt <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </form>

            <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
               <div className="flex gap-4">
                 <ShieldCheck className="w-6 h-6 text-slate-400 shrink-0" />
                 <div className="w-full">
                   <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-3 pb-2 border-b border-slate-200">Processing Rules (Yearly Pack)</p>
                   <div className="space-y-2.5">
                     <div className={`flex items-center justify-between text-[10px] font-bold uppercase transition-colors ${monthsElapsed === 1 ? 'text-emerald-600 font-black' : 'text-slate-400'}`}>
                        <span>• First Month Duration</span>
                        <span>80% Refund</span>
                     </div>
                     <div className={`flex items-center justify-between text-[10px] font-bold uppercase transition-colors ${monthsElapsed >= 2 && monthsElapsed <= 5 ? 'text-amber-600 font-black' : 'text-slate-400'}`}>
                        <span>• 2nd To 5th Month</span>
                        <span>40% Refund</span>
                     </div>
                     <div className={`flex items-center justify-between text-[10px] font-bold uppercase transition-colors ${monthsElapsed >= 6 && monthsElapsed <= 8 ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                        <span>• 6th To 8th Month</span>
                        <span>20% Refund</span>
                     </div>
                     <div className={`flex items-center justify-between text-[10px] font-bold uppercase transition-colors ${monthsElapsed > 8 ? 'text-red-600 font-black' : 'text-slate-400'}`}>
                        <span>• After 8th Month</span>
                        <span>No Return</span>
                     </div>
                   </div>
                   {monthsElapsed > 0 && (
                     <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase italic">Current Status: {monthsElapsed} Months Elapsed</span>
                       <span className="text-[9px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded uppercase">{refundPercent}% Back</span>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          </div>

          {/* Receipt Section */}
          <div className="relative">
            {/* Ticket/Receipt UI */}
            <div className={`transition-all duration-700 transform ${amountValue > 0 ? 'opacity-100 translate-y-0' : 'opacity-40 blur-[2px]'}`}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative isolate">
                {/* Decorative cutouts for ticket look */}
                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-50 border border-slate-200 rounded-full z-10 hidden lg:block" />
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-50 border border-slate-200 rounded-full z-10 hidden lg:block" />
                
                <div className="p-6 text-center border-b border-dashed border-slate-200 bg-slate-50/50">
                  <ReceiptText className="w-10 h-10 text-brand-600 mx-auto mb-3" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Refund Summary</h2>
                  <p className="text-[10px] font-bold text-slate-400 mt-1">Order #REF-{Math.floor(100000 + Math.random() * 900000)}</p>
                </div>

                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Accommodation</span>
                    <span className="text-slate-900">{pgName || 'Not Specified'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500">Accommodation Pack</span>
                    <span className="text-slate-900 capitalize">{selectedBooking?.roomPack || 'Standard'}</span>
                  </div>
                  {selectedBooking?.food && (
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500">Meal Plan Pack</span>
                      <span className="text-slate-900 capitalize">{selectedBooking.mealPack || 'Standard'}</span>
                    </div>
                  )}
                  
                  <div className="h-px bg-slate-100 w-full" />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-500 font-bold">Total Paid</span>
                      <span className="text-slate-900 font-black">₹{parseFloat(totalAmount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-red-500 font-bold">
                      <span className="flex items-center gap-1.5 capitalize">Service Deduction ({100 - refundPercent}%)</span>
                      <span>-₹{deductionAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-brand-50/50 rounded-2xl p-5 border border-brand-100 flex flex-col items-center">
                    <p className="text-[10px] font-black text-brand-600 uppercase tracking-[0.2em] mb-2">Refundable Amount ({refundPercent}%)</p>
                    <p className="text-4xl font-black text-brand-900 tracking-tighter">
                      <span className="text-2xl mr-1">₹</span>
                      {refundAmount.toLocaleString()}
                    </p>
                  </div>

                  {submitted && (
                    <div className="space-y-3 pt-4 animate-in fade-in zoom-in duration-500">
                      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-tight">Request Successfully Logged</span>
                      </div>
                      <button 
                        onClick={() => navigate('/bookings')}
                        className="w-full py-4 bg-slate-900 shadow-xl shadow-slate-900/20 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-95"
                      >
                         View in Digital Receipts <ArrowRight className="w-4 h-4 text-brand-400" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2 overflow-hidden">
                  <div className="flex-1 h-[2px] bg-slate-200" />
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em] whitespace-nowrap">StayNest Digital Guarantee</span>
                  <div className="flex-1 h-[2px] bg-slate-200" />
                </div>
              </div>

              {/* Security info */}
              <div className="mt-6 flex items-center justify-center gap-4 opacity-60">
                <div className="flex items-center gap-1.5">
                   <ShieldCheck className="w-4 h-4 text-emerald-600" />
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Encypted</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="flex items-center gap-1.5">
                   <CheckCircle2 className="w-4 h-4 text-blue-600" />
                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Verified Resident</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefundRequest;
