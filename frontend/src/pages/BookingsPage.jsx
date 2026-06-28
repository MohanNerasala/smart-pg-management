import React, { useState, useRef, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BedDouble, Utensils, Download, Share2, CheckCircle2,
  MapPin, User, Phone, Calendar, CalendarDays, ArrowLeft,
  Sparkles, Copy, Check, FileText, X, ChevronDown, Building, ChevronRight,
  QrCode, ShieldCheck, Scissors, Receipt, IndianRupee, ReceiptText, Printer
} from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useContext, useEffect } from 'react';

/* ─── Helpers ───────────────────────────── */
const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const addYear = (date) => {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);
  return d;
};

const fmtDate = (date) =>
  date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

/* ─── Thumbnail Card (Horizontal Ticket Style) ─── */
const ThumbnailCard = ({ title, type, dateString, color, icon: Icon, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all group overflow-hidden relative w-full"
  >
    {/* Left Icon & Info */}
    <div className="flex items-center gap-4 z-10 w-full">
      <div className={`w-12 h-12 bg-${color}-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black text-${color}-600 uppercase tracking-wider bg-${color}-50 px-2 py-0.5 rounded-md`}>
            {type}
          </span>
          <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> {dateString}
          </span>
        </div>
        <h3 className="font-black text-slate-800 text-base sm:text-lg truncate tracking-tight">{title}</h3>
      </div>
    </div>
    
    {/* Right Action - Simple Navigation Arrow */}
    <div className="shrink-0 ml-4 z-10 pl-4 border-l border-dashed border-slate-200 h-full flex items-center">
      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
         <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-colors" />
      </div>
    </div>
  </div>
);

/* ─── Modal Shell ───────────────────────── */
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 print:p-0 print:relative print:z-auto">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl animate-in zoom-in-95 duration-200 hide-scrollbar print:max-h-none print:shadow-none print:overflow-visible">
        {/* Modern Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all print:hidden shadow-lg border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
};

/* ─── Main ──────────────────────────────── */
const BookingsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [serverBookings, setServerBookings] = useState([]);
  
  const stateBooking = location.state?.booking;
  const allBookingsStr = localStorage.getItem('allBookings');
  let allBookings = [];
  try {
    allBookings = allBookingsStr ? JSON.parse(allBookingsStr) : [];
  } catch (e) {
    console.error("Failed to parse allBookings", e);
  }
  
  if (allBookings.length === 0) {
    if (stateBooking) {
      allBookings = [stateBooking];
    } else {
      const latestBookingStr = localStorage.getItem('latestBooking');
      if (latestBookingStr) {
        try {
          allBookings = [JSON.parse(latestBookingStr)];
        } catch (e) {
          console.error("Failed to parse latestBooking", e);
        }
      }
    }
  }

  // Filter local bookings by user email for privacy
  allBookings = allBookings.filter(b => 
    b.userEmail === user?.email || 
    b.userDetails?.email === user?.email
  );

  const allRefundsStr = localStorage.getItem('refund_requests');
  let allRefunds = [];
  try {
    allRefunds = allRefundsStr ? JSON.parse(allRefundsStr) : [];
  } catch (e) {
    console.error("Failed to parse refund_requests", e);
  }

  // Filter local refunds by user email for privacy
  allRefunds = allRefunds.filter(r => r.userEmail === user?.email);

  // Effect to fetch all bookings from server
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const response = await api.get('/sync/bookings');
        if (response.data && Array.isArray(response.data)) {
          // Filter by current user email to ensure privacy
          const filtered = response.data.filter(b => 
            b.userDetails?.email === user?.email || 
            (b.userDetails?.email && user?.email && b.userDetails.email.toLowerCase() === user.email.toLowerCase())
          );
          setServerBookings(filtered);
        }
      } catch (err) {
        console.error("Failed to fetch server bookings:", err);
      }
    };
    if (user?.email) {
      fetchAllBookings();
    }
  }, [user?.email]);

  // Combine Local + State + Server (using Set/ID for uniqueness)
  const combinedBookings = useMemo(() => {
    const map = new Map();
    
    // 1. Add server bookings first (source of truth)
    serverBookings.forEach(b => {
      const key = `${b.pg?.pgName}-${b.bookingDate}`;
      map.set(key, b);
    });

    // 2. Add local storage bookings (fallback/offline)
    allBookings.forEach(b => {
      const key = `${b.pg?.pgName}-${b.bookingDate}`;
      if (!map.has(key)) map.set(key, b);
    });

    // 3. Add current navigation state booking (immediate feedback)
    if (stateBooking) {
      const key = `${stateBooking.pg?.pgName}-${stateBooking.bookingDate}`;
      if (!map.has(key)) map.set(key, stateBooking);
    }

    return Array.from(map.values());
  }, [serverBookings, allBookings, stateBooking]);

  const displayBookings = [...combinedBookings].reverse();
  const displayRefunds = [...allRefunds].reverse();

  const [roomCopied, setRoomCopied] = useState(false);
  const [mealCopied, setMealCopied] = useState(false);
  const [refundCopied, setRefundCopied] = useState(false);
  const [activeReceipt, setActiveReceipt] = useState(null); // { type: 'room' | 'meal', booking: Object } | null
  const [expandedPgs, setExpandedPgs] = useState({});

  // Group bookings and refunds by PG name
  const groupedData = useMemo(() => {
    const acc = {};
    
    // Add regular bookings
    displayBookings.forEach(b => {
      const pgName = b.pg?.pgName || 'Unknown PG';
      if (!acc[pgName]) acc[pgName] = { bookings: [], refunds: [], area: b.pg?.area, city: b.pg?.city };
      acc[pgName].bookings.push(b);
    });

    // Add refund requests
    displayRefunds.forEach(r => {
      const pgName = r.pgName || 'Unknown PG';
      if (!acc[pgName]) acc[pgName] = { bookings: [], refunds: [], area: 'Pending Settlement', city: '' };
      acc[pgName].refunds.push(r);
    });

    return acc;
  }, [displayBookings, displayRefunds]);

  const togglePg = (pgName) => {
    setExpandedPgs(prev => ({ ...prev, [pgName]: !prev[pgName] }));
  };

  // If no booking data AND no refunds, redirect
  if (displayBookings.length === 0 && displayRefunds.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-white border border-slate-200 shadow-sm rounded-full flex items-center justify-center mx-auto mb-4">
            <BedDouble className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">No Booking Found</h2>
          <p className="text-slate-500 mb-6">You haven't made a booking yet. Go to listings and book a PG!</p>
          <button
            onClick={() => navigate('/listings')}
            className="px-8 py-3 bg-brand-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-600/20"
          >
            Browse Listings
          </button>
        </div>
      </div>
    );
  }

  const activeBooking = activeReceipt?.booking;
  const startDate = activeBooking?.bookingDate ? new Date(activeBooking.bookingDate) : new Date();
  const roomEndDate = activeBooking?.roomPack === 'yearly' ? addYear(startDate) : addMonths(startDate, 1);
  const mealEndDate = activeBooking?.mealPack === 'yearly' ? addYear(startDate) : addMonths(startDate, 1);

  const handleRoomDownload = () => {
    document.getElementById('room-receipt')?.scrollIntoView();
    window.print();
  };

  const handleMealDownload = () => {
    document.getElementById('meal-receipt')?.scrollIntoView();
    window.print();
  };

  const handleRefundDownload = () => {
    document.getElementById('refund-receipt')?.scrollIntoView();
    window.print();
  };

  const handleRoomShare = async () => {
    if (!activeBooking) return;
    const text = `🏠 StayNest Room Booking Receipt\n\nPG: ${activeBooking.pg?.pgName}\nLocation: ${activeBooking.pg?.area}, ${activeBooking.pg?.city}\nSharing: ${activeBooking.sharing?.label} Sharing\nPack: ${activeBooking.roomPack}\nAmount: ₹${activeBooking.activeSharePrice?.toLocaleString()}/mo\nDates: ${fmtDate(startDate)} → ${fmtDate(roomEndDate)}\nResident: ${activeBooking.userDetails?.name} | ${activeBooking.userDetails?.phone}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Room Booking Receipt', text });
      } else {
        await navigator.clipboard.writeText(text);
        setRoomCopied(true);
        setTimeout(() => setRoomCopied(false), 2500);
      }
    } catch (_) {
      await navigator.clipboard.writeText(text);
      setRoomCopied(true);
      setTimeout(() => setRoomCopied(false), 2500);
    }
  };

  const handleMealShare = async () => {
    if (!activeBooking) return;
    const text = `🍽️ StayNest Meal Booking Receipt\n\nPlan: ${activeBooking.food?.label} Plan\nPack: ${activeBooking.mealPack}\nAmount: ₹${activeBooking.activeFoodPrice?.toLocaleString()}/mo\nDates: ${fmtDate(startDate)} → ${fmtDate(mealEndDate)}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Meal Booking Receipt', text });
      } else {
        await navigator.clipboard.writeText(text);
        setMealCopied(true);
        setTimeout(() => setMealCopied(false), 2500);
      }
    } catch (_) {
      await navigator.clipboard.writeText(text);
      setMealCopied(true);
      setTimeout(() => setMealCopied(false), 2500);
    }
  };

  const handleRefundShare = async () => {
    if (!activeReceipt?.refund) return;
    const r = activeReceipt.refund;
    const text = `💸 StayNest Refund Receipt\n\nID: ${r.id}\nPG: ${r.pgName}\nTotal Paid: ₹${r.totalAmount?.toLocaleString()}\nRefund (70%): ₹${r.refundAmount?.toLocaleString()}\nDate: ${fmtDate(new Date(r.date))}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Refund Receipt', text });
      } else {
        await navigator.clipboard.writeText(text);
        setRefundCopied(true);
        setTimeout(() => setRefundCopied(false), 2500);
      }
    } catch (_) {
      await navigator.clipboard.writeText(text);
      setRefundCopied(true);
      setTimeout(() => setRefundCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 print:bg-white selection:bg-brand-500/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 print:py-4">

        {/* Header Actions */}
        <div className="mb-8 print:hidden">
           <button
             onClick={() => navigate('/listings')}
             className="w-10 h-10 bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center transition-all group shadow-lg shadow-black/10 shrink-0"
           >
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           </button>
        </div>

        {/* Page Header */}
        <div className="mb-12 print:mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">Your<br/><span className="text-brand-600">Digital Receipts</span></h1>
          <p className="text-slate-500 font-medium mt-3 text-base sm:text-lg">Access and manage all your confirmed PG reservations securely.</p>
        </div>

        <div className="flex flex-col space-y-4 print:hidden">
          {Object.entries(groupedData).map(([pgName, data]) => {
            const isExpanded = expandedPgs[pgName];
            
            const locationStr = data.area && data.city 
                ? `${data.area}, ${data.city}` 
                : data.area;

            return (
              <div key={pgName} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
                {/* Accordion Header */}
                <div className="w-full flex items-center justify-between p-5 sm:p-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer group/pg" onClick={() => togglePg(pgName)}>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-200 text-brand-600 rounded-2xl flex items-center justify-center shrink-0">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">{pgName}</h2>
                      <div className="flex items-center gap-2 text-slate-500 font-medium mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs sm:text-sm truncate max-w-[150px] sm:max-w-[300px]">{locationStr}</span>
                        <span className="mx-1 text-slate-300">•</span>
                        <span className="text-[10px] sm:text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-100 whitespace-nowrap">
                          {data.bookings.length + data.refunds.length} Item{ (data.bookings.length + data.refunds.length) > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Toggle Chevron */}
                    <div className={`w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-transform duration-300 shrink-0 ${isExpanded ? 'rotate-180 text-brand-600 bg-brand-50 border-brand-200' : 'text-slate-400'}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Accordion Body */}
                <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[5000px] opacity-100 border-t border-slate-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3">
                      {/* Render Refunds First */}
                      {data.refunds.map((r, idx) => (
                        <div key={`ref-${idx}`} className="relative group/booking">
                          <ThumbnailCard 
                            title="Refund Settlement"
                            type="Refund"
                            dateString={fmtDate(new Date(r.date))}
                            color="red"
                            icon={IndianRupee}
                            onClick={() => setActiveReceipt({ type: 'refund', refund: r })}
                          />
                        </div>
                      ))}

                      {/* Render Bookings */}
                      {data.bookings.map((b, idx) => {
                        const bDate = b.bookingDate ? new Date(b.bookingDate) : new Date();
                        const dateString = `${fmtDate(bDate).split(' ')[1]} ${fmtDate(bDate).split(' ')[2]}`;
                        return (
                          <React.Fragment key={`book-${idx}`}>
                            <div className="relative group/booking">
                                {/* ── Room Thumbnail ── */}
                                {b.bookingMode !== 'food' && (
                                  <ThumbnailCard 
                                    title="Room Reservation"
                                    type="Room"
                                    dateString={dateString}
                                    color="brand"
                                    icon={BedDouble}
                                    onClick={() => setActiveReceipt({ type: 'room', booking: b })}
                                  />
                                )}

                                {/* ── Meal Thumbnail ── */}
                                {b.food && (
                                  <div className="mt-3">
                                    <ThumbnailCard 
                                      title={`${b.food?.label} Plan`}
                                      type="Meal"
                                      dateString={dateString}
                                      color="emerald"
                                      icon={Utensils}
                                      onClick={() => setActiveReceipt({ type: 'meal', booking: b })}
                                    />
                                  </div>
                                )}
                            </div>
                          </React.Fragment>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Modals / Full Receipts ── */}
        <Modal isOpen={!!activeReceipt} onClose={() => setActiveReceipt(null)}>
          {activeReceipt && (
            <div className="flex flex-col items-center">
              {activeReceipt?.type === 'room' ? (
                /* ─── ROOM RECEIPT (Standardized 100mm) ─── */
                <div id="room-receipt" className="bg-[#fcfbf7] text-slate-900 shadow-2xl w-full max-w-sm mx-auto flex flex-col relative font-sans overflow-visible my-8">
                  <div className="receipt-zig-zag top" />
                  <div className="receipt-zig-zag bottom" />

                  <div className="p-8 pb-4 text-center">
                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 italic">STAYNEST</h2>
                    <div className="bg-slate-900 text-white p-3 rounded-xl mb-3">
                       <p className="text-xs font-black uppercase tracking-widest">{activeBooking.pg?.pgName}</p>
                       <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{activeBooking.pg?.area}, {activeBooking.pg?.city}</p>
                    </div>
                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Official Occupancy Receipt</p>
                  </div>

                  <div className="px-8 space-y-1 text-[9px] font-mono font-bold text-slate-500 uppercase pb-4 border-b border-slate-200">
                    <div className="flex justify-between"><span>Resident ID:</span><span>#ST-{activeBooking.bookingDate?.slice(-4).toUpperCase() || 'U72'}</span></div>
                    <div className="flex justify-between"><span>Inv Number:</span><span>#RM-{activeBooking.bookingDate?.slice(-6).toUpperCase() || 'X721'}</span></div>
                    <div className="flex justify-between"><span>Print Date:</span><span>{new Date().toLocaleDateString('en-GB')}</span></div>
                    <div className="flex justify-between text-emerald-600"><span>System Status:</span><span>Authorized / Paid</span></div>
                  </div>

                  <div className="p-8 py-6">
                    <table className="w-full text-left border-collapse mb-8">
                      <thead>
                        <tr className="border-b-2 border-slate-900">
                          <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Description</th>
                          <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-right text-slate-400">
                            {activeBooking.roomPack === 'yearly' ? 'Annual Total' : 'Monthly Rate'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-bold">
                        <tr>
                          <td className="py-5">
                            <p className="font-black uppercase leading-tight text-lg">{activeBooking.sharing?.label} SHARING</p>
                            <p className="text-[10px] text-slate-500 uppercase mt-1">Room {activeBooking.room?.roomId || 'TBA'} • Floor {activeBooking.room?.floorId || '0'}</p>
                          </td>
                          <td className="py-5 text-right align-top text-lg font-black italic">₹{(activeBooking.roomPack === 'yearly' ? (activeBooking.activeSharePrice * 12) : activeBooking.activeSharePrice)?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-900 bg-slate-50/50">
                          <td className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{activeBooking.roomPack === 'yearly' ? 'Annual Commitment' : 'Authorized Total'}</td>
                          <td className="py-4 px-2 text-right text-2xl font-black italic">₹{(activeBooking.roomPack === 'yearly' ? (activeBooking.activeSharePrice * 12) : activeBooking.activeSharePrice)?.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="grid grid-cols-2 gap-8 pt-2">
                      <div className="border-l-2 border-slate-200 pl-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Stay Period (Starts)</p>
                        <p className="text-xs font-black uppercase">{fmtDate(startDate)}</p>
                      </div>
                      <div className="border-r-2 border-slate-900 pr-4 text-right">
                        <p className="text-[9px] font-black text-brand-600 uppercase tracking-widest mb-1">Subscription Ends</p>
                        <p className="text-sm font-black uppercase text-brand-600 underline decoration-2 underline-offset-4">{fmtDate(roomEndDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-8 mb-4">
                    <div className="h-[1px] bg-slate-200 mb-2 border-dashed border-t" />
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Authorized Resident Signatory</p>
                  </div>

                  <div className="p-8 pt-0 flex gap-2 print:hidden z-10">
                    <button onClick={handleRoomDownload} className="flex-1 h-12 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors">Download Receipt</button>
                    <button onClick={handleRoomShare} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-black transition-colors">
                      {roomCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : activeReceipt?.type === 'meal' ? (
                /* ─── MEAL RECEIPT (Standardized 100mm) ─── */
                <div id="meal-receipt" className="bg-[#fcfbf7] text-slate-900 shadow-2xl w-full max-w-sm mx-auto flex flex-col relative font-sans overflow-visible my-8">
                  <div className="receipt-zig-zag top" />
                  <div className="receipt-zig-zag bottom" />

                  <div className="p-8 pb-4 text-center">
                    <h2 className="text-2xl font-black tracking-tighter uppercase mb-2 italic">STAYNEST</h2>
                    <div className="bg-emerald-900 text-white p-3 rounded-xl mb-3">
                       <p className="text-xs font-black uppercase tracking-widest">{activeBooking.pg?.pgName}</p>
                       <p className="text-[9px] font-bold text-emerald-300 uppercase mt-0.5">{activeBooking.pg?.area}, {activeBooking.pg?.city}</p>
                    </div>
                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.3em] leading-none">Official Meal Voucher</p>
                  </div>

                  <div className="px-8 space-y-1 text-[9px] font-mono font-bold text-slate-500 uppercase pb-4 border-b border-slate-200">
                    <div className="flex justify-between"><span>Resident ID:</span><span>#ST-{activeBooking.bookingDate?.slice(-4).toUpperCase() || 'U72'}</span></div>
                    <div className="flex justify-between"><span>Pass ID:</span><span>#FD-{activeBooking.bookingDate?.slice(-6).toUpperCase() || 'M921'}</span></div>
                    <div className="flex justify-between"><span>Active Since:</span><span>{fmtDate(startDate)}</span></div>
                    <div className="flex justify-between text-emerald-600"><span>System Status:</span><span>Auth / Provisioned</span></div>
                  </div>

                  <div className="p-8 py-6">
                    <table className="w-full text-left border-collapse mb-8">
                      <thead>
                        <tr className="border-b-2 border-slate-900">
                          <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Plan Category</th>
                          <th className="pb-2 text-[10px] font-black uppercase tracking-widest text-right text-slate-400">
                            {activeBooking.mealPack === 'yearly' ? 'Annual Total' : 'Monthly Price'}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-bold">
                        <tr>
                          <td className="py-6">
                            <p className="font-black uppercase leading-tight text-lg">{activeBooking.food?.label} PLAN</p>
                            <p className="text-[10px] text-emerald-700 font-black uppercase tracking-tighter mt-1">{activeBooking.food?.meals?.join(' • ').toUpperCase()}</p>
                          </td>
                          <td className="py-6 text-right align-top text-lg font-black italic">₹{(activeBooking.mealPack === 'yearly' ? (activeBooking.activeFoodPrice * 12) : activeBooking.activeFoodPrice)?.toLocaleString()}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="border-t-2 border-slate-900 bg-emerald-50/30">
                          <td className="py-4 px-2 text-[10px] font-black uppercase tracking-widest text-slate-500">{activeBooking.mealPack === 'yearly' ? 'Annual Total' : 'Subscription Total'}</td>
                          <td className="py-4 px-2 text-right text-2xl font-black italic">₹{(activeBooking.mealPack === 'yearly' ? (activeBooking.activeFoodPrice * 12) : activeBooking.activeFoodPrice)?.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>

                    <div className="grid grid-cols-1 gap-4 pt-2">
                      <div className="border-l-4 border-brand-600 pl-4 py-2 bg-slate-50 overflow-hidden">
                        <p className="text-[9px] font-black text-brand-600 uppercase tracking-[0.3em] mb-1">Access Valid Until (Auto-Renewal Enabled)</p>
                        <p className="text-xl font-black uppercase tracking-tight">{fmtDate(mealEndDate)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 pt-0 mt-8 mb-4 text-center">
                    <p className="text-sm font-black uppercase tracking-tight italic border-b border-slate-200 inline-block px-10 pb-1 mb-1">{activeBooking.userDetails?.name}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authorized Member Signature</p>
                  </div>

                  <div className="p-8 pt-0 flex gap-2 print:hidden z-10">
                    <button onClick={handleMealDownload} className="flex-1 h-12 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors">Download Receipt</button>
                    <button onClick={handleMealShare} className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-200 transition-colors">
                      {mealCopied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              ) : (
                /* ─── REFUND RECEIPT ─── */
                <div id="refund-receipt" className="bg-white text-slate-900 shadow-2xl w-full max-w-sm mx-auto flex flex-col relative font-sans overflow-visible my-8 rounded-3xl border border-slate-100">
                  <div className="p-8 pb-4 text-center border-b border-dashed border-slate-200 bg-slate-50/50 rounded-t-3xl">
                    <ReceiptText className="w-12 h-12 text-red-600 mx-auto mb-3" />
                    <h2 className="text-xl font-black tracking-tighter uppercase mb-1">Refund Receipt</h2>
                    <p className="text-[10px] font-bold text-slate-400">REF ID: {activeReceipt.refund.id}</p>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span>Resident Name</span>
                        <span className="text-slate-900">{activeReceipt.refund.userName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span>PG Accommodation</span>
                        <span className="text-slate-900">{activeReceipt.refund.pgName}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <span>Package Type</span>
                        <span className="text-slate-900">{activeReceipt.refund.packType}</span>
                      </div>
                    </div>

                    <div className="h-px bg-slate-100 w-full" />

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                      <div className="flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-500">Total Paid</span>
                        <span className="text-slate-900">₹{activeReceipt.refund.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-bold text-red-600">
                        <span className="flex items-center gap-1">Deduction ({100 - (activeReceipt.refund.refundPercent || 70)}%)</span>
                        <span>-₹{activeReceipt.refund.deductionAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex flex-col items-center">
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Final Refund ({activeReceipt.refund.refundPercent || 70}%)</p>
                      <p className="text-4xl font-black text-emerald-900 tracking-tighter">
                        <span className="text-2xl mr-1">₹</span>
                        {activeReceipt.refund.refundAmount.toLocaleString()}
                      </p>
                    </div>

                    <div className="pt-4 flex gap-2 print:hidden z-10">
                       <button onClick={handleRefundDownload} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                         <Download className="w-3.5 h-3.5" /> Download
                       </button>
                       <button onClick={() => window.print()} className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                         <Printer className="w-4 h-4" />
                       </button>
                       <button onClick={handleRefundShare} className="w-12 h-12 bg-white border border-slate-200 text-slate-600 rounded-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                         {refundCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                       </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center rounded-b-3xl">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">StayNest Settlement Voucher</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Print styles note */}
        <p className="text-center text-slate-400 text-xs font-medium mt-8 print:hidden">
          Tap a receipt to view details, download, or share.
        </p>

        {/* Subtle Reset Button */}
        <div className="mt-20 pt-8 border-t border-slate-200 text-center print:hidden">
          <button 
            onClick={() => {
              if (window.confirm("This will clear all your bookings. Proceed?")) {
                 // Clear local storage
                 localStorage.removeItem('allBookings');
                 localStorage.removeItem('latestBooking');
                 localStorage.removeItem('dashboardFormState');
                 localStorage.removeItem('refund_requests');
                 
                 // Clear React state and Navigation state immediately for snappy UI
                 setServerBookings([]);
                 navigate(location.pathname, { replace: true, state: {} });
                 
                 // Perform backend sync in background without reloading the page
                 fetch('http://localhost:8081/sync/clear', { method: 'DELETE' })
                   .catch(e => console.error("Failed to clear backend", e));
              }
            }}
            className="text-slate-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors"
          >
            Start Fresh / Clear All Data
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-slate-200 { border-color: #e2e8f0 !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:py-4 { padding-top: 1rem; padding-bottom: 1rem; }
          .print\\:mb-6 { margin-bottom: 1.5rem; }
        }

        .receipt-zig-zag {
          position: absolute;
          left: 0;
          width: 100%;
          height: 8px;
          z-index: 50;
          background-size: 16px 8px;
          background-repeat: repeat-x;
        }

        .receipt-zig-zag.top {
          top: -8px;
          background-image: linear-gradient(135deg, #fcfbf7 25%, transparent 25%), 
                            linear-gradient(225deg, #fcfbf7 25%, transparent 25%);
        }

        .receipt-zig-zag.bottom {
          bottom: -8px;
          background-image: linear-gradient(45deg, #fcfbf7 25%, transparent 25%), 
                            linear-gradient(315deg, #fcfbf7 25%, transparent 25%);
        }
      `}</style>
    </div>
  );
};

export default BookingsPage;
