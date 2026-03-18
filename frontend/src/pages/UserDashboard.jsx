import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  BedDouble, Utensils, CheckCircle2, Sparkles,
  User, ChefHat, Crown, Leaf, Zap,
  ArrowRight, ArrowLeft, MapPin, Star,
  Calendar, CalendarDays, BadgePercent,
  Check, Phone, GraduationCap, Briefcase, Plane, Heart, HelpCircle, ReceiptText, DoorOpen,
  Smartphone, Wallet, CreditCard, ShieldCheck, Clock, Info
} from 'lucide-react';
import api from '../services/api';

/* ─── Data ─────────────────────────────── */
const YEARLY_DISCOUNT = 0.15;

const SHARING_TYPES = [
  { id: 1, label: 'Single',   sub: 'Private room',  icon: '🛏️', mult: 1.10, tag: 'Most Private', tagColor: 'bg-indigo-600' },
  { id: 2, label: 'Double',   sub: '2 persons',     icon: '🛏️', mult: 0.85, tag: 'Popular',      tagColor: 'bg-emerald-500' },
  { id: 3, label: 'Triple',   sub: '3 persons',     icon: '🏠', mult: 0.70, tag: 'Value',        tagColor: 'bg-sky-500' },
  { id: 4, label: '4-Person', sub: '4 persons',     icon: '🏠', mult: 0.58, tag: 'Budget',       tagColor: 'bg-amber-500' },
  { id: 5, label: '5-Person', sub: '5 persons',     icon: '🏠', mult: 0.48, tag: 'Economy',      tagColor: 'bg-slate-500' },
];

const FOOD_PLANS = [
  { id: 'basic',   label: 'Basic',    icon: Leaf,    price: 3800, color: 'emerald', tag: 'Essential',  meals: ['Breakfast, Lunch & Dinner', 'Mon–Sat', 'Veg only'],      perks: ['Filtered water'] },
  { id: 'medium',  label: 'Standard', icon: ChefHat, price: 5200, color: 'brand',   tag: 'Popular',    meals: ['3 Meals/day', 'All 7 days', 'Veg + Non-Veg'],       perks: ['Fresh salads', 'Juice daily'] },
  { id: 'premium', label: 'Premium',  icon: Crown,   price: 7500, color: 'amber',   tag: 'Lux Life',   meals: ['24×7 Meals', 'Multi-cuisine', 'Midnight snacks'],    perks: ['Dietary requests', 'Fresh juice & sweets'] },
];

const colorMap = {
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-300', pill: 'bg-emerald-600' },
  brand:   { bg: 'bg-brand-50',   text: 'text-brand-600',   border: 'border-brand-300',   pill: 'bg-brand-600' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-300',   pill: 'bg-amber-600' },
};

/* ─── Step Badge ────────────────────────── */
const StepBadge = ({ num, label, active, done }) => (
  <div className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 ${active || done ? '' : 'opacity-40'}`}>
    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-sm font-black
      ${done ? 'bg-emerald-500 text-white' : active ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
      {done ? <CheckCircle2 className="w-4 h-4" /> : num}
    </div>
    <span className={`font-black text-[9px] sm:text-sm uppercase tracking-tighter sm:tracking-normal ${active ? 'text-slate-900' : 'text-slate-400'}`}>{label}</span>
  </div>
);
const Divider = () => <div className="flex-1 h-0.5 bg-slate-100 min-w-[10px] sm:mx-2" />;

/* ─── Custom Brand SVGs ─────────────────── */
const PhonePeIcon = ({ className }) => (
  <svg viewBox="0 0 100 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 0C5.59644 0 0 5.59644 0 12.5V19.5C0 26.4036 5.59644 32 12.5 32H19.5C26.4036 32 32 26.4036 32 19.5V12.5C32 5.59644 26.4036 0 19.5 0H12.5Z" fill="#6739B7"/>
    <path d="M18.8 19.8C18.8 21.8 17.5 23.1 14.8 23.1H13.6V26.2H11.2V10.2H15.1C18 10.2 19.1 11.5 19.1 13.6C19.1 15 18.2 16.1 16.8 16.5C18.1 16.9 18.8 18.1 18.8 19.8ZM13.6 15.5H14.5C15.9 15.5 16.6 14.9 16.6 13.7C16.6 12.5 15.9 11.9 14.5 11.9H13.6V15.5ZM14.9 21.4C16.2 21.4 17.1 20.8 17.1 19.6C17.1 18.4 16.2 17.8 14.9 17.8H13.6V21.4H14.9Z" fill="white"/>
    <text x="38" y="21" fill="#6739B7" fontSize="16" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-0.5">PhonePe</text>
  </svg>
);

const GPayIcon = ({ className }) => (
  <svg viewBox="0 0 100 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M13.6 14.1V17.5H21.5C21.2 19.3 18.8 22.8 13.6 22.8C9.1 22.8 5.6 19.1 5.6 14.6C5.6 10.1 9.1 6.4 13.6 6.4C16.2 6.4 17.9 7.5 18.9 8.4L21.6 5.8C19.9 4.2 17 3.2 13.6 3.2C7.2 3.2 2 8.3 2 14.6C2 20.9 7.2 26 13.6 26C20.3 26 24.7 21.3 24.7 14.7C24.7 13.8 24.6 13.1 24.5 12.4H13.6V14.1Z" fill="#3c4043"/>
    <path d="M34.5 9.8V25H31V9.8H34.5ZM45.6 15.4C45.6 19.5 42.6 22.5 38.5 22.5C34.4 22.5 31.4 19.5 31.4 15.4C31.4 11.3 34.4 8.3 38.5 8.3C42.6 8.3 45.6 11.3 45.6 15.4ZM42.1 15.4C42.1 12.8 40.5 11 38.5 11C36.5 11 34.9 12.8 34.9 15.4C34.9 18 36.5 19.8 38.5 19.8C40.5 19.8 42.1 18 42.1 15.4Z" fill="#5f6368"/>
    <text x="48" y="21" fill="#5f6368" fontSize="18" fontWeight="600" fontFamily="Product Sans, sans-serif">Pay</text>
  </svg>
);

const PaytmIcon = ({ className }) => (
  <svg viewBox="0 0 100 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M0 8C0 3.58172 3.58172 0 8 0H92C96.4183 0 100 3.58172 100 8V24C100 28.4183 96.4183 32 92 32H8C3.58172 32 0 28.4183 0 24V8Z" fill="#00B9F5" fillOpacity="0.05"/>
    <path d="M12.5 8H19.5C22.5 8 23.5 9.5 23.5 11.5C23.5 13.5 22.5 15 19.5 15H15.5V24H12.5V8ZM15.5 12.5H19.5C20.5 12.5 20.8 12 20.8 11.5C20.8 11 20.5 10.5 19.5 10.5H15.5V12.5Z" fill="#002E6E"/>
    <path d="M32.5 15H25.5V12.5L29 8H32.5L28.5 12.5V15ZM32.5 15V24H29.5V15H32.5Z" fill="#002E6E"/>
    <text x="35" y="21" fill="#00BAF2" fontSize="20" fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-1">Paytm</text>
  </svg>
);

const CardIcon = ({ className }) => (
  <svg viewBox="0 0 100 32" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="32" rx="6" fill="#1A1F71" fillOpacity="0.05"/>
    <path d="M15 10H19.5L16.5 22H12L15 10Z" fill="#1A1F71"/>
    <path d="M28.5 10.2C27.5 9.8 26.5 9.6 25.5 9.6C22.5 9.6 20.5 11.1 20.5 13.5C20.5 15.2 22 16.1 23.1 16.7C24.3 17.3 24.7 17.7 24.7 18.4C24.7 19.4 23.5 19.9 22.4 19.9C21.4 19.9 20.5 19.6 19.5 19.2L18.8 22.2C19.8 22.7 21 23 22.3 23C25.5 23 27.6 21.4 27.6 18.9C27.6 16.1 23.5 15.9 23.5 14.6C23.5 14.1 24 13.6 24.9 13.5C25.4 13.4 26.5 13.4 27.6 13.8L28.5 10.2Z" fill="#1A1F71"/>
    <circle cx="75" cy="16" r="9" fill="#EB001B"/>
    <circle cx="84" cy="16" r="9" fill="#F79E1B" fillOpacity="0.8"/>
  </svg>
);



/* ─── Main ──────────────────────────────── */
const UserDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // 0. Use local state for PG to avoid mutating location.state
  const [pg, setPg] = useState(location.state?.pg || null);
  const basePrice = pg?.price || 8000;

  // Add a guard to prevent logic running if pg is missing
  // This will show a placeholder if we haven't loaded the PG from state or localStorage yet
  if (!pg && !localStorage.getItem('dashboardFormState')) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center">
         <div className="text-center">
           <h2 className="text-xl font-bold text-slate-400">Loading PG Data...</h2>
           <p className="text-slate-400 mt-2">Please wait while we set up your dashboard.</p>
         </div>
       </div>
     );
  }

  const [selectedSharing, setSelectedSharing] = useState(null);
  const [roomPack,        setRoomPack]        = useState(null);
  const [selectedFood,    setSelectedFood]    = useState(null);
  const [mealPack,        setMealPack]        = useState(null);
  const [selectedRoom,    setSelectedRoom]    = useState(null); 
  const [availableRooms,  setAvailableRooms]  = useState([]);   
  const [step,            setStep]            = useState(1);       
  const [bookingMode,     setBookingMode]     = useState('full');  
  const [booked,          setBooked]          = useState(false);
  const [bookingLoading,  setBookingLoading]  = useState(false);
  const [agreedToTerms,   setAgreedToTerms]   = useState(false);
  const [paymentMethod,   setPaymentMethod]   = useState(null);
  const [agreedToRefund,  setAgreedToRefund]  = useState(false);
  const [rating,          setRating]          = useState(0);
  const [feedbackSentiment, setFeedbackSentiment] = useState(null);
  const [globalBookings,  setGlobalBookings]  = useState([]);      // Global memory from server
  const [dbRooms,         setDbRooms]         = useState([]);      // Actual rooms from database

  // User Details State
  const [userDetails, setUserDetails] = useState({
    name: '',
    city: '',
    phone: '',
    purpose: ''
  });

  // --- Auto-Save and Restore Logic ---
  // 1. Load from localStorage on mount
  useEffect(() => {
    const savedStateStr = localStorage.getItem('dashboardFormState');
    if (savedStateStr) {
      try {
        const saved = JSON.parse(savedStateStr);
        if (saved.step) setStep(saved.step);
        if (saved.userDetails) setUserDetails(saved.userDetails);
        
        // Restore PG from saved state if missing from navigation
        if (!pg && saved.pg) {
           setPg(saved.pg);
        }
      } catch (e) {
        console.error("Failed to parse saved dashboard state", e);
      }
    }
  }, []);

  // --- UX: Bulletproof Smooth Scroll (Stutter-Free) ---
  useEffect(() => {
    // We use a micro-delay to ensure React has fully swapped the step UI
    // before the browser starts the smooth scroll calculation.
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
    return () => clearTimeout(timer);
  }, [step]);

  // Fetch global memory bookings from our simplified backend un-authenticated endpoint
  useEffect(() => {
    if (pg) {
      api.get('/sync/bookings')
        .then(res => setGlobalBookings(res.data || []))
        .catch(err => console.error("Could not fetch global bookings", err));

      // Fetch actual room status from DB
      const cleanPgId = typeof pg.pgId === 'string' ? parseInt(pg.pgId.replace(/[^\d]/g, '')) : pg.pgId;
      api.get(`/rooms/byPG/${cleanPgId || 1}`)
        .then(res => setDbRooms(res.data || []))
        .catch(err => console.error("Could not fetch rooms from DB", err));
    }
  }, [pg]);

  // Generate a mock 50 room building (5 floors, 10 rooms per floor) and sync with globally booked rooms
  const roomGrid = React.useMemo(() => {
    // 1. We now use the globalBookings fetched from the backend memory
    let currentBookings = globalBookings;

    // 2. Tally how many beds are claimed per room for the CURRENT PG
    const activePgIdRaw = pg?.pgId || location.state?.pg?.pgId;
    const activePgId = typeof activePgIdRaw === 'string' ? parseInt(activePgIdRaw.replace(/[^\d]/g, '')) : activePgIdRaw;
    const roomClaims = {};
    const now = new Date();

    if (activePgId) {
       currentBookings.forEach(booking => {
          const bookingPgId = typeof booking.pg?.pgId === 'string' ? parseInt(booking.pg.pgId.replace(/[^\d]/g, '')) : booking.pg?.pgId;
          if (bookingPgId === activePgId && booking.room?.roomId) {
             // Calculate expiry: bookingDate + (1 or 12 months)
             const bDate = new Date(booking.bookingDate || now);
             const durationMonths = booking.roomPack === 'yearly' ? 12 : 1;
             const expiryDate = new Date(bDate);
             expiryDate.setMonth(expiryDate.getMonth() + durationMonths);
             
             // Check if expiring within 2 days (i.e., now is >= expiryDate - 2 days)
             const availabilityBufferMs = 2 * 24 * 60 * 60 * 1000;
             const isExpiringSoon = (expiryDate.getTime() - now.getTime()) <= availabilityBufferMs;

             // Strictly only claim if NOT expiring within 2 days
             if (!isExpiringSoon) {
               const stringId = String(booking.room.roomId);
               roomClaims[stringId] = (roomClaims[stringId] || 0) + 1;
             }
          }
       });
    }

    const floors = [];
    // Floor 5 down to 1
    for (let f = 5; f >= 1; f--) {
      // Floor index mapping: 5=1-sharing, 4=2-sharing, 3=3-sharing, 2=4-sharing, 1=5-sharing
      const sharingReq = 6 - f; 
      const rooms = [];
      for (let r = 1; r <= 10; r++) {
          // Bulletproof Sync: Match room IDs with backend (pgId * 1000 + f * 100 + r)
          const cleanPgId = activePgId || 1; 
          const dbRoomId = (cleanPgId * 1000) + (f * 100) + r;
          
          // Try to find actual room data from DB
          const matchedRoom = dbRooms.find(dr => dr.roomId === dbRoomId);
          
          // Merge Data: Use MAX of DB value and Global Memory Claims to avoid double-counting
          const dbOccupancy = matchedRoom ? matchedRoom.occupiedSlots : 0;
          const memoryClaims = roomClaims[String(dbRoomId)] || 0;
          const occupancy = Math.max(dbOccupancy, memoryClaims);
          
          if (dbRoomId % 1000 === 301) {
            console.log(`SYNC_DEBUG: Room ${dbRoomId} | DB: ${dbOccupancy} | Memory: ${memoryClaims} | Mixed: ${occupancy}`);
          }
          
          const capacity  = matchedRoom ? matchedRoom.sharingType : sharingReq;
          const available = Math.max(0, capacity - occupancy);
          
          rooms.push({
             roomId: dbRoomId, // Use the real ID for booking!
             roomName: `${f * 100 + r}`, // Keep the display name simple
            floorId: f,
            sharingType: capacity,
            maxCapacity: capacity,
            currentCapacity: available // Now correctly represents "Available Slots"
         });
      }
      floors.push({ floorNumber: f, sharingType: sharingReq, rooms });
    }
    return floors;
  }, [pg, globalBookings, dbRooms]);

  // 2. Save to localStorage on any state change
  useEffect(() => {
    if (pg) {
      const stateToSave = {
        pg,
        step,
        userDetails
      };
      localStorage.setItem('dashboardFormState', JSON.stringify(stateToSave));
    }
  }, [pg, step, userDetails]);
  // -----------------------------------

  const PURPOSES = [
    { id: 'study', label: 'Education / Study', icon: GraduationCap },
    { id: 'job',   label: 'Job / Business',  icon: Briefcase },
    { id: 'travel', label: 'Travel / Enjoy',  icon: Plane },
    { id: 'visit',  label: 'Personal Visit',  icon: Heart },
    { id: 'other',  label: 'Other',           icon: HelpCircle }
  ];

  const sharing = SHARING_TYPES.find(s => s.id === selectedSharing);
  const food    = FOOD_PLANS.find(f => f.id === selectedFood);

  const rawSharingPrice    = sharing ? Math.round(basePrice * sharing.mult) : 0;
  const monthlySharePrice  = rawSharingPrice;
  const yearlySharePrice   = Math.round(rawSharingPrice * (1 - YEARLY_DISCOUNT));
  
  // Suppress room costs if in food-only mode or no pack selected
  const activeSharePrice   = (bookingMode === 'food' || !roomPack) ? 0 : (roomPack === 'yearly' ? yearlySharePrice : monthlySharePrice);
  const activeFoodPrice    = !mealPack ? 0 : (mealPack === 'yearly' ? Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)) : (food?.price || 0));
  const totalMonthly       = activeSharePrice + activeFoodPrice;
  
  const roomSavings = (bookingMode === 'food' || roomPack !== 'yearly') ? 0 : (monthlySharePrice - yearlySharePrice) * 12;
  const mealSavings = mealPack === 'yearly' ? ((food?.price || 0) * 12) - (Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)) * 12) : 0;
  const savings = roomSavings + mealSavings;

  const handleConfirm = async () => {
    setBookingLoading(true);
    console.log("UserDashboard: handleConfirm starting. User ID:", user?.id);
    try { 
      // Requirement 5: Refresh latest room data before booking
      const cleanPgId = typeof pg?.pgId === 'string' ? parseInt(pg.pgId.replace(/[^\d]/g, '')) : pg?.pgId;
      try {
        const roomUpdate = await api.get(`/rooms/byPG/${cleanPgId || 1}`);
        setDbRooms(roomUpdate.data || []);
        
        // Final check if the room is still available in the refreshed data
        if (bookingMode !== 'food' && selectedRoom) {
            const latestRoom = roomUpdate.data.find(r => r.roomId === selectedRoom.roomId);
            if (latestRoom && latestRoom.occupiedSlots >= latestRoom.sharingType) {
                throw new Error("This room was just booked by someone else! Please pick another.");
            }
        }
      } catch (e) {
        console.warn("Pre-booking refresh failed, proceeding with current state", e);
      }

      console.log("UserDashboard: Sending /booking/create request... Room ID:", (bookingMode !== 'food' && selectedRoom) ? selectedRoom.roomId : 'NONE');
      await api.post('/booking/create', { 
        user: { userId: user?.id },
        pg: { pgId: cleanPgId || 1 }, // Fallback to 1 if no pgId or conversion fails
        room: (bookingMode !== 'food' && selectedRoom) ? { roomId: selectedRoom.roomId } : null,
        mealPlan: food?.label || null,
        roomType: sharing?.label || null,
        checkinDate: new Date().toISOString().split('T')[0],
        duration: roomPack === 'yearly' || mealPack === 'yearly' ? 12 : 1 
      }); 
      
      console.log("UserDashboard: /booking/create successful.");
      await new Promise(r => setTimeout(r, 1200));
      
      // Clear the saved form state upon successful booking
      localStorage.removeItem('dashboardFormState');
      
      setBookingLoading(false);
      setBooked(true);
    } catch (error) {
       setBookingLoading(false);
       console.error("UserDashboard: Booking creation failed", error);
       if (error.response) {
         console.error("UserDashboard: Error status:", error.response.status);
         console.error("UserDashboard: Error data:", error.response.data);
       }
       
       // 401s are handled silently by api.js interceptor (refresh token & retry).
       // If we still get 401 here, the refresh token itself expired or retry failed.
       if (error.response?.status === 401) {
          console.warn("UserDashboard: Received final 401. NOT REDIRECTING yet for debug.");
          // logout();
          // navigate('/login');
       } else {
          alert("Booking failed: " + (error.response?.data?.message || error.message));
       }
    }
  };

  /* ── Confirmation screen (Popup) ── */
  if (booked) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] p-8 md:p-12 max-w-sm w-full text-center shadow-2xl shadow-emerald-900/20 border border-emerald-100 animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Animated Icon Block */}
        <div className="relative w-28 h-28 mx-auto mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-70"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          {/* Confetti specs */}
          <div className="absolute -top-4 -right-2 w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
          <div className="absolute top-8 -left-6 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
          <div className="absolute -bottom-2 right-4 w-2.5 h-2.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Booking Successful!</h2>
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          Your slot at <span className="font-black text-slate-700">{pg?.pgName}</span> is reserved and active.
        </p>

        <button 
          onClick={() => {
            const bookingData = {
              pg: pg,
              pgId: pg?.pgId,
              userEmail: user?.email, // Tagging for privacy filtering
              bookingMode: bookingMode,
              sharing: bookingMode === 'full' && sharing ? { id: sharing.id, label: sharing.label } : null,
              roomPack: bookingMode === 'full' ? roomPack : null,
              room: bookingMode === 'full' && selectedRoom ? { roomId: selectedRoom.roomId, roomType: selectedRoom.roomType } : null,
              food: food ? { id: food.id, label: food.label, price: food.price, meals: food.meals } : null,
              mealPack: mealPack,
              activeSharePrice: bookingMode === 'full' ? activeSharePrice : 0,
              activeFoodPrice: activeFoodPrice,
              totalMonthly: bookingMode === 'full' ? totalMonthly : activeFoodPrice,
              userDetails: { ...userDetails, email: user?.email } // Ensure email is in userDetails too
            };
            const existingBookingsStr = localStorage.getItem('allBookings');
            let allBookings = existingBookingsStr ? JSON.parse(existingBookingsStr) : [];
            
            // Migrate old latestBooking if this is the first time we're using allBookings
            if (allBookings.length === 0) {
              const oldLatestStr = localStorage.getItem('latestBooking');
              if (oldLatestStr) {
                try {
                  const oldLatest = JSON.parse(oldLatestStr);
                  // Ensure we don't duplicate if it somehow matches
                  if (oldLatest.pg?.pgName !== bookingData.pg?.pgName) {
                     allBookings.push(oldLatest);
                  }
                } catch(e) {}
              }
            }

            const bookingWithDate = { ...bookingData, bookingDate: new Date().toISOString() };
            allBookings.push(bookingWithDate);
            localStorage.setItem('allBookings', JSON.stringify(allBookings));
            localStorage.setItem('latestBooking', JSON.stringify(bookingWithDate));
            
            // Sync with backend memory to claim the room globally!
            api.post('/sync/book', bookingWithDate)
              .finally(() => {
                navigate('/bookings', { state: { booking: bookingWithDate } });
              });
          }} 
          className="w-full h-16 bg-brand-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-brand-700 shadow-xl shadow-brand-500/20 hover:-translate-y-1 transition-all active:scale-95"
        >
          <ReceiptText className="w-5 h-5" /> View My Receipt
        </button>

        {/* Feedback Section */}
        <div className="mt-10 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-700 delay-300">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Rate Your Experience</p>
          
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-all duration-300 transform hover:scale-125 active:scale-95
                  ${rating >= star ? 'text-amber-400 scale-110' : 'text-slate-200 hover:text-amber-200'}`}
              >
                <Star className={`w-8 h-8 ${rating >= star ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>

          {/* Sentiment Chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { id: 'fast', label: '⚡ Super Fast' },
              { id: 'easy', label: '👌 Very Easy' },
              { id: 'love', label: '❤️ Loved It' },
              { id: 'premium', label: '💎 Premium' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFeedbackSentiment(chip.id)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300
                  ${feedbackSentiment === chip.id 
                    ? 'bg-brand-600 border-brand-600 text-white shadow-lg shadow-brand-500/30 -translate-y-1' 
                    : 'bg-white border-slate-200 text-slate-500 hover:border-brand-300 hover:text-brand-600'}`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {rating > 0 && (
            <p className="mt-6 text-emerald-600 text-xs font-black animate-in zoom-in duration-300 uppercase tracking-widest">
              ❤️ Thank you for the feedback!
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Premium Back Navigation */}
        <button 
          onClick={() => navigate('/listings')} 
          className="group mb-8 flex items-center gap-3 px-5 py-3 bg-white/50 backdrop-blur-md border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:bg-white hover:border-brand-200 transition-all active:scale-[0.98] outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Navigation</p>
            <p className="text-sm font-bold text-slate-700 leading-none">Back to Listings</p>
          </div>
        </button>

        {/* PG Hero */}
        {pg ? (
          <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-brand-900 to-brand-700 rounded-3xl p-7 mb-8 text-white shadow-2xl">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
            <div className="flex items-start justify-between gap-4 relative">
              <div>
                <p className="text-brand-200 text-xs font-black uppercase tracking-widest mb-2">Booking Slot For</p>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">{pg.pgName}</h1>
                <div className="flex items-center gap-2 text-brand-200 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> {pg.area}, {pg.city}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1 bg-white/10 px-3 py-1.5 rounded-xl mb-2">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="font-black">{pg.rating || '4.2'}</span>
                </div>
                <p className="text-brand-200 text-xs font-bold">Starting from</p>
                <p className="text-2xl font-black">₹{Math.round(basePrice * 0.55).toLocaleString()}<span className="text-sm text-brand-200 font-medium">/mo</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-900 to-brand-700 rounded-3xl p-7 mb-8 text-white shadow-2xl">
            <h1 className="text-2xl font-black">Slot Booking</h1>
          </div>
        )}

        {/* Global Mode Switcher - Compact & Perfect */}
        {!booked && (
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 shadow-sm">
              <button 
                onClick={() => {
                  setBookingMode('full');
                  if (step >= 3) setStep(1); 
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300
                  ${bookingMode === 'full' 
                    ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 border border-slate-100 scale-105' 
                    : 'text-slate-500 hover:text-brand-600 hover:bg-white/60'}`}
              >
                <BedDouble className={`w-3.5 h-3.5 ${bookingMode === 'full' ? 'text-brand-600' : 'text-slate-400'}`} />
                Full Pack
              </button>
              <button 
                onClick={() => {
                  setBookingMode('food');
                  setStep(3); 
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300
                  ${bookingMode === 'food' 
                    ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 border border-slate-100 scale-105' 
                    : 'text-slate-500 hover:text-emerald-600 hover:bg-white/60'}`}
              >
                <Utensils className={`w-3.5 h-3.5 ${bookingMode === 'food' ? 'text-emerald-600' : 'text-slate-400'}`} />
                Food Only
              </button>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="flex items-center justify-between bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-slate-200 mb-8 gap-0 sm:gap-2">
          {bookingMode === 'full' && (
            <>
              <StepBadge num={1} label="Sharing" active={step===1} done={step>1} />
              <Divider />
              <StepBadge num={2} label="Rooms"   active={step===2} done={step>2} />
              <Divider />
            </>
          )}
          <StepBadge num={3} label="Meals"   active={step===3} done={step>3} />
          <Divider />
          <StepBadge num={4} label="Details" active={step===4} done={step>4} />
          <Divider />
          <StepBadge num={5} label="Confirm" active={step===5} done={booked} />
        </div>

        {/* ── STEP 1: SHARING + INLINE PACK ── */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-center sm:text-left">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Choose Sharing Type</h2>
            <p className="text-slate-500 font-medium mb-10">
              PG base rate: <span className="font-black text-slate-800">₹{basePrice.toLocaleString()}/mo</span>
            </p>

            {/* ── Number tiles ── */}
            <div className="flex gap-3 mb-4">
              {SHARING_TYPES.map(s => {
                const sel = selectedSharing === s.id;
                return (
                  <button key={s.id}
                    onClick={() => { setSelectedSharing(s.id); setRoomPack(null); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border-2 font-black text-xl transition-all duration-200
                      ${sel
                        ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-500/25 scale-[1.04]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:shadow-sm'}`}>
                    {s.id}
                    <span className={`text-[9px] font-black uppercase tracking-widest leading-none
                      ${sel ? 'text-brand-100' : 'text-slate-400'}`}>
                      {s.id === 1 ? 'bed' : 'beds'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Detail card for selected sharing */}
            {selectedSharing && sharing && (() => {
              const s = sharing;
              const price = Math.round(basePrice * s.mult);
              const roomInfo = {
                1: { 
                  name: 'Private Sanctuary', 
                  type: 'Single Occupancy',
                  desc: 'A premium, fully private room designed for maximum focus and comfort. No shared space within the room.',
                  amenities: {
                    comfort: ['Premium Single Bed', 'Study Desk & Ergo Chair', 'Large Wardrobe', 'Balcony Access'],
                    tech: ['AC + Fan', 'WiFi 6 Enabled', 'Power Backup', 'Smart Switch'],
                    privacy: ['Personal Bathroom', 'Electronic Lock', 'Private Entrance']
                  }
                },
                2: { 
                  name: 'Executive Shared', 
                  type: 'Double Sharing',
                  desc: 'A spacious shared room for two, balancing social interaction with personal workspace.',
                  amenities: {
                    comfort: ['2 Twin Beds', '2 Study Desks', 'Splice Wardrobe', 'Large Window'],
                    tech: ['AC + Fan', 'WiFi 6 Enabled', 'Power Backup'],
                    privacy: ['Shared Bathroom (1:2)', 'Keyed Drawer', 'Partition Option']
                  }
                },
                3: { 
                  name: 'Standard Triple', 
                  type: 'Triple Sharing',
                  desc: 'Value-driven sharing for three roommates with optimized furniture placement.',
                  amenities: {
                    comfort: ['3 Compact Beds', 'Shared Study Zone', '3-Way Closet'],
                    tech: ['High-Power Fan', 'Broadband WiFi', 'Power Backup'],
                    privacy: ['Shared Bathroom (1:3)', 'Secure Locker']
                  }
                },
                4: { 
                  name: 'Classic Quad', 
                  type: '4-Person Sharing',
                  desc: 'Social and budget-friendly living with ample floor space for four.',
                  amenities: {
                    comfort: ['4 Sturdy Beds', 'Common Storage', 'Side Tables'],
                    tech: ['Dual High-Power Fans', 'Broadband WiFi'],
                    privacy: ['Shared Bathroom (1:4)', 'Digital Locker Access']
                  }
                },
                5: { 
                  name: 'Economy Suite', 
                  type: '5-Person Sharing',
                  desc: 'The most economical stay without compromising on essential comfort.',
                  amenities: {
                    comfort: ['Bunk/Single Mix', 'Compact Storage', 'Common Area'],
                    tech: ['Dual Fans', 'Basic WiFi'],
                    privacy: ['Large Shared Bathroom', 'Safety Lockers']
                  }
                },
              }[selectedSharing];

              if (!roomInfo) return null;

              return (
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-brand-50 text-brand-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-brand-100">
                            {roomInfo.type}
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-100">
                            {s.tag}
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">{roomInfo.name}</h3>
                        <p className="text-slate-500 text-sm font-medium max-w-md leading-relaxed">
                          {roomInfo.desc}
                        </p>
                      </div>
                      <div className="w-full md:w-auto bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center md:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price per person</p>
                        <div className="flex items-baseline justify-center md:justify-end gap-1">
                          <span className="text-3xl font-black text-brand-600">₹{price.toLocaleString()}</span>
                          <span className="text-slate-400 font-bold text-sm">/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Comfort & Space</p>
                        <ul className="space-y-2">
                          {roomInfo.amenities.comfort.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Tech & Connectivity</p>
                        <ul className="space-y-2">
                          {roomInfo.amenities.tech.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <Zap className="w-3.5 h-3.5 text-amber-500" /> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Privacy & Safety</p>
                        <ul className="space-y-2">
                          {roomInfo.amenities.privacy.map((a, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                              <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" /> {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Inline Monthly/Yearly pack — shows only after a sharing is selected */}
            {selectedSharing && (
              <div className="bg-white border-2 border-brand-200 rounded-3xl p-6 mb-6 shadow-xl shadow-brand-500/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-base font-black text-slate-900 mb-1">
                  {sharing?.label} Sharing — Choose Your Pack
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-5">Yearly saves you <span className="text-emerald-600 font-black">15%</span></p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly */}
                  <div onClick={() => setRoomPack('monthly')}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200
                      ${roomPack === 'monthly' ? 'border-brand-600 bg-brand-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-brand-300'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${roomPack === 'monthly' ? 'bg-brand-600' : 'bg-slate-200'}`}>
                          <Calendar className={`w-5 h-5 ${roomPack === 'monthly' ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Monthly</p>
                          <p className="text-slate-400 text-xs">Cancel anytime</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${roomPack === 'monthly' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                        {roomPack === 'monthly' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    {/* Price breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{sharing?.label} Sharing</span>
                        <span className="font-black text-slate-800">₹{monthlySharePrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                        <span className="font-black text-slate-700">Room / month</span>
                        <span className="font-black text-brand-700 text-base">₹{monthlySharePrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Yearly */}
                  <div onClick={() => setRoomPack('yearly')}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200
                      ${roomPack === 'yearly' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'}`}>
                    <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <BadgePercent className="w-3 h-3" /> Best Deal — 15% Off
                    </div>
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${roomPack === 'yearly' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <CalendarDays className={`w-5 h-5 ${roomPack === 'yearly' ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Yearly</p>
                          <p className="text-slate-400 text-xs">Pay for 12 months</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${roomPack === 'yearly' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                        {roomPack === 'yearly' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    {/* 12-month breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Per month rate</span>
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-slate-400 text-xs">₹{monthlySharePrice.toLocaleString()}</span>
                          <span className="font-black text-emerald-700 text-base">₹{yearlySharePrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">× 12 months</span>
                        <span className="font-black text-slate-900">₹{(yearlySharePrice * 12).toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-2 flex justify-between items-center mt-1">
                        <span className="text-emerald-700 font-black text-xs">🎉 You save per year</span>
                        <span className="font-black text-emerald-700 text-sm">₹{((monthlySharePrice - yearlySharePrice) * 12).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                        <span className="font-black text-slate-700">Annual total</span>
                        <span className="font-black text-emerald-700 text-base">₹{(yearlySharePrice * 12).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button onClick={() => setStep(2)} disabled={!pg || !selectedSharing || !roomPack}
              className={`px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all
                ${pg && selectedSharing && roomPack ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/20 hover:-translate-y-0.5 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'}`}>
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── STEP 3: MEAL ── */}
        {step === 3 && (
          <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Choose Meal Plan</h2>
                <p className="text-slate-500 font-medium">Served fresh every day by in-house chef</p>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl flex items-center gap-2">
                <BadgePercent className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">
                  Room: {roomPack} | Meals: {mealPack}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {FOOD_PLANS.map(f => {
                const c = colorMap[f.color];
                const displayPrice = mealPack === 'yearly' ? Math.round(f.price * (1 - YEARLY_DISCOUNT)) : f.price;
                const sel = selectedFood === f.id;
                const Icon = f.icon;
                return (
                  <div key={f.id} onClick={() => { setSelectedFood(f.id); setMealPack(null); }}
                    className={`relative rounded-3xl border-2 p-6 cursor-pointer transition-all duration-300 group
                      ${sel ? `${c.border} ${c.bg} shadow-xl scale-[1.01]` : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'}`}>
                    <span className={`absolute -top-3 left-5 ${c.pill} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow`}>{f.tag}</span>
                    <div className="flex items-start justify-between mt-1 mb-4">
                      <div className={`w-12 h-12 rounded-2xl ${sel ? c.bg : 'bg-slate-50'} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${sel ? c.text : 'text-slate-400'}`} />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sel ? c.border : 'border-slate-300'}`}>
                        {sel && <CheckCircle2 className={`w-4 h-4 ${c.text}`} />}
                      </div>
                    </div>
                    <h3 className="font-black text-xl text-slate-900 mb-3">{f.label} Plan</h3>
                    <ul className="space-y-1.5 mb-4">
                      {f.meals.map((m, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm font-medium ${sel ? c.text : 'text-slate-600'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />{m}
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-1 border-t border-slate-200 pt-3 mb-4">
                      {f.perks.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-500">
                          <Zap className="w-3 h-3 text-amber-400" />{p}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Plan/mo</span>
                        <div className={`text-2xl font-black mt-0.5 ${sel ? c.text : 'text-slate-900'}`}>₹{displayPrice.toLocaleString()}</div>
                        {mealPack === 'yearly' && <span className="text-[10px] line-through text-slate-400">₹{f.price.toLocaleString()}</span>}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl ${sel ? `${c.bg} ${c.text} border ${c.border}` : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                        {sel ? 'Selected ✓' : 'Pick'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Inline Monthly/Yearly pack for Meals */}
            {selectedFood && (
              <div className="bg-white border-2 border-brand-200 rounded-3xl p-6 mb-8 shadow-xl shadow-brand-500/5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h3 className="text-base font-black text-slate-900 mb-1">
                  {food?.label} Plan — Choose Your Pack
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-5">Yearly saves you <span className="text-emerald-600 font-black">15%</span> on every meal</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Monthly */}
                  <div onClick={() => setMealPack('monthly')}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200
                      ${mealPack === 'monthly' ? 'border-brand-600 bg-brand-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-brand-300'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mealPack === 'monthly' ? 'bg-brand-600' : 'bg-slate-200'}`}>
                          <Calendar className={`w-5 h-5 ${mealPack === 'monthly' ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Monthly</p>
                          <p className="text-slate-400 text-xs">Standard rate</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${mealPack === 'monthly' ? 'border-brand-600 bg-brand-600' : 'border-slate-300'}`}>
                        {mealPack === 'monthly' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                    {/* Price breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">{food?.label} Plan</span>
                        <span className="font-black text-slate-800">₹{(food?.price || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                        <span className="font-black text-slate-700">Total / month</span>
                        <span className="font-black text-brand-700 text-base">₹{(food?.price || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Yearly */}
                  <div onClick={() => setMealPack('yearly')}
                    className={`relative rounded-2xl border-2 p-5 cursor-pointer transition-all duration-200
                      ${mealPack === 'yearly' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-200 bg-slate-50 hover:border-emerald-300'}`}>
                    <div className="absolute -top-3 right-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <BadgePercent className="w-3 h-3" /> Best Deal — 15% Off
                    </div>
                    <div className="flex items-center justify-between mb-4 mt-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${mealPack === 'yearly' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <CalendarDays className={`w-5 h-5 ${mealPack === 'yearly' ? 'text-white' : 'text-slate-500'}`} />
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">Yearly</p>
                          <p className="text-slate-400 text-xs">15% Discounted</p>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                        ${mealPack === 'yearly' ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                        {mealPack === 'yearly' && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>

                    {/* 12-month breakdown */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">Per month rate</span>
                        <div className="flex items-center gap-1.5">
                          <span className="line-through text-slate-400 text-xs">₹{(food?.price || 0).toLocaleString()}</span>
                          <span className="font-black text-emerald-700 text-base">₹{Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">× 12 months</span>
                        <span className="font-black text-slate-900">₹{(Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)) * 12).toLocaleString()}</span>
                      </div>
                      <div className="rounded-xl bg-emerald-100 border border-emerald-200 px-3 py-2 flex justify-between items-center mt-1">
                        <span className="text-emerald-700 font-black text-xs">🎉 You save per year</span>
                        <span className="font-black text-emerald-700 text-sm">₹{(((food?.price || 0) * 12) - (Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)) * 12)).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 mt-1">
                        <span className="font-black text-slate-700">Annual total</span>
                        <span className="font-black text-emerald-700 text-base">₹{(Math.round((food?.price || 0) * (1 - YEARLY_DISCOUNT)) * 12).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => {
                if (bookingMode === 'food') {
                  setStep(1); 
                  setBookingMode('full'); // Reset mode if they go back to the selection screen
                } else {
                  setStep(2);
                }
              }} className="px-8 py-4 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">← Back</button>
              <button onClick={() => setStep(4)} disabled={!selectedFood || !mealPack}
                className={`flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${selectedFood && mealPack ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/20 hover:-translate-y-0.5 active:scale-95' : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-60'}`}>
                Enter Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: ROOMS (GRID VIEW) ── */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-black text-slate-900 mb-1">Select Your Room</h2>
              <p className="text-slate-500 font-medium">Click on an available room below to lock it in.</p>
            </div>

            {/* Building Grid */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 mb-8 shadow-xl shadow-slate-200/50 overflow-x-auto border-2 border-slate-100 relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 blur-[100px] pointer-events-none rounded-full" />
               <div className="min-w-[700px] flex flex-col gap-6 relative">
                  {roomGrid.map((floor) => {
                     const isFloorActive = floor.sharingType === selectedSharing;
                     return (
                        <div key={floor.floorNumber} className={`flex items-stretch gap-4 transition-opacity duration-300 ${isFloorActive ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
                           
                           {/* Floor Label */}
                           <div className="w-24 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-200 flex-shrink-0">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Floor</p>
                              <p className="text-2xl font-black text-slate-800">{floor.floorNumber}</p>
                              <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">
                                 {floor.sharingType} Sharing
                              </p>
                           </div>

                           {/* Rooms List */}
                           <div className="flex-1 flex gap-3">
                              {floor.rooms.map(r => {
                                 const isSelected = selectedRoom?.roomId === r.roomId;
                                 const displayCapacity = isSelected ? r.currentCapacity - 1 : r.currentCapacity;
                                 const isFull = displayCapacity === 0 && !isSelected;

                                 return (
                                    <button
                                       key={r.roomId}
                                       onClick={() => setSelectedRoom(r)}
                                       disabled={!isFloorActive || isFull}
                                       className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group
                                          ${isSelected 
                                             ? 'border-brand-500 bg-brand-50 shadow-md shadow-brand-500/20 scale-[1.02]' 
                                             : isFull 
                                               ? 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
                                               : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'}`}
                                    >
                                       {isSelected && (
                                          <div className="absolute inset-0 bg-brand-500/5 animate-pulse pointer-events-none" />
                                       )}

                                       <DoorOpen className={`w-5 h-5 mb-1 ${isSelected ? 'text-brand-600' : isFull ? 'text-slate-300' : 'text-slate-400 group-hover:text-slate-500'}`} />
                                       <span className={`text-base font-black ${isSelected ? 'text-brand-900' : isFull ? 'text-slate-400' : 'text-slate-700'}`}>{r.roomName}</span>

                                       <div className={`mt-2 px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest border transition-colors flex flex-col items-center gap-0.5
                                           ${isSelected
                                              ? 'bg-brand-100 text-brand-700 border-brand-200'
                                              : isFull
                                                ? 'bg-slate-100 text-slate-400 border-slate-200'
                                                : 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:border-emerald-200'}`}>
                                           <span className="leading-none">{displayCapacity}/{r.maxCapacity}</span>
                                           <span className="text-[7px] uppercase tracking-tighter opacity-70">{isFull ? 'Full' : 'Available'}</span>
                                        </div>
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                     );
                  })}

                  {/* Ground Level Decor */}
                  <div className="h-4 border-b-4 border-slate-200 mx-4 mt-2 border-dashed" />
               </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)} 
                className="h-16 px-8 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                ← Back
              </button>
              <button 
                onClick={() => setStep(3)} 
                disabled={!selectedRoom}
                className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${selectedRoom ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Choose Meals <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: USER DETAILS ── */}
        {step === 4 && (
          <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Personal Details</h2>
              <p className="text-slate-500 font-medium">Please provide your details for the booking records.</p>
            </div>

            <div className="space-y-6 bg-white p-8 rounded-[2rem] border-2 border-slate-100 shadow-xl shadow-slate-200/50 mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Full Name</label>
                   <input 
                     type="text" 
                     placeholder="John Doe"
                     className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                     value={userDetails.name}
                     onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                   />
                </div>
                <div>
                   <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">City / Hometown</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Bangalore"
                     className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                     value={userDetails.city}
                     onChange={(e) => setUserDetails({...userDetails, city: e.target.value})}
                   />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000"
                    className="w-full h-14 pl-14 pr-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:bg-white transition-all outline-none font-bold text-slate-900"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Purpose of Stay</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {PURPOSES.map(p => {
                    const PIcon = p.icon;
                    const isSel = userDetails.purpose === p.id;
                    return (
                      <button 
                        key={p.id}
                        type="button"
                        onClick={() => setUserDetails({...userDetails, purpose: p.id})}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-200 gap-2
                          ${isSel ? 'border-brand-600 bg-brand-50 text-brand-600 scale-105 shadow-md' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
                      >
                        <PIcon className={`w-5 h-5 ${isSel ? 'text-brand-600' : 'text-slate-400'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none text-center">{p.label.split(' / ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="flex gap-4">
              <button onClick={() => setStep(3)} className="h-16 px-8 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">← Back</button>
              <button 
                onClick={() => setStep(5)} 
                disabled={!userDetails.name || !userDetails.phone || !userDetails.purpose}
                className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${userDetails.name && userDetails.phone && userDetails.purpose ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/30' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
              >
                Review Booking <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: CONFIRM ── */}
        {step === 5 && (
          <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Final Confirmation</h2>
            <p className="text-slate-500 font-medium mb-8 text-lg">Double check your details before processing.</p>
            
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mb-8">
              <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                <div className="relative flex justify-between items-start">
                  <div>
                    <p className="text-brand-300 text-xs font-black uppercase tracking-[0.2em] mb-2">Selected PG Property</p>
                    <h3 className="text-3xl font-black mb-3">{pg?.pgName || 'PG Sanctuary'}</h3>
                    <div className="flex items-center gap-4 text-brand-100/80 text-sm font-bold">
                      <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-brand-400" /> {pg?.area}, {pg?.city}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                      <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-amber-400 fill-current" /> {pg?.rating || '4.2'}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {bookingMode === 'full' && (
                      <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${roomPack === 'yearly' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                        Room Pack: {roomPack}
                      </div>
                    )}
                    <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${mealPack === 'yearly' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                      Meals: {mealPack}
                    </div>
                    {bookingMode === 'full' && selectedRoom && (
                      <div className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border bg-brand-500 text-white border-brand-400">
                        Room: {selectedRoom.roomType || selectedRoom.roomId}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Personal Section */}
                <div>
                   <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-6 bg-brand-600 rounded-full" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Primary Resident</h4>
                   </div>
                   <div className="grid grid-cols-2 gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Full Name</p>
                         <p className="font-black text-slate-900">{userDetails.name}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Purpose of Stay</p>
                         <p className="font-black text-slate-900 capitalize">{userDetails.purpose}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Contact No.</p>
                         <p className="font-black text-slate-900">{userDetails.phone}</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Hometown</p>
                         <p className="font-black text-slate-900">{userDetails.city || 'N/A'}</p>
                      </div>
                   </div>
                </div>

                {/* Configuration Section */}
                <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-6 bg-amber-500 rounded-full" />
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Pricing Breakdown</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {bookingMode === 'full' && (
                         <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Room Configuration</p>
                            <div className="space-y-1">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="font-black text-slate-900">{sharing?.label} Sharing</span>
                                  <span className="text-lg font-black text-slate-900">₹{activeSharePrice.toLocaleString()}<span className="text-xs text-slate-400 font-medium ml-1">/mo</span></span>
                               </div>
                               {roomPack === 'yearly' && (
                                  <div className="bg-white/50 rounded-xl px-3 py-2 border border-slate-100 flex justify-between items-center">
                                     <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Annual Total</span>
                                     <span className="font-black text-brand-700">₹{(activeSharePrice * 12).toLocaleString()}</span>
                                  </div>
                               )}
                            </div>
                            <div className={`mt-3 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border w-fit mx-auto ${roomPack === 'yearly' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                               {roomPack} Pack Selected
                            </div>
                         </div>
                       )}

                       <div className={`bg-slate-50 rounded-2xl p-5 border border-slate-100 ${bookingMode === 'food' ? 'md:col-span-2' : ''}`}>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Meal Subscription</p>
                          <div className="space-y-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-black text-slate-900">{food?.label} Plan</span>
                                <span className="text-lg font-black text-slate-900">₹{activeFoodPrice.toLocaleString()}<span className="text-xs text-slate-400 font-medium ml-1">/mo</span></span>
                             </div>
                             {mealPack === 'yearly' && (
                                <div className="bg-white/50 rounded-xl px-3 py-2 border border-slate-100 flex justify-between items-center">
                                   <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Annual Total</span>
                                   <span className="font-black text-brand-700">₹{(activeFoodPrice * 12).toLocaleString()}</span>
                                </div>
                             )}
                          </div>
                          <div className={`mt-3 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border w-fit mx-auto ${mealPack === 'yearly' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                             {mealPack} Pack Selected
                          </div>
                       </div>
                    </div>
                </div>

                {(roomPack === 'yearly' || mealPack === 'yearly') && (
                  <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <BadgePercent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-emerald-700 font-black text-sm">Long-term Loyalty Applied</p>
                        <p className="text-emerald-600/70 text-[10px] font-bold uppercase tracking-widest">
                          {roomPack === 'yearly' && '15% Off Room '} 
                          {roomPack === 'yearly' && mealPack === 'yearly' && '& '}
                          {mealPack === 'yearly' && '15% Off Meals '}
                          Active
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-emerald-600 uppercase">Year Savings</p>
                       <p className="text-xl font-black text-emerald-700">₹{savings.toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Unified Booking Terms & Refund Policy Container - Shown only for Full Pack */}
                {bookingMode === 'full' && (
                  <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] overflow-hidden mb-8 shadow-sm">
                  {/* Header */}
                  <div className="bg-slate-900 p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                      <ShieldCheck className="w-6 h-6 text-brand-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-base uppercase tracking-tight leading-none mb-1">StayNest Terms & Refund</h3>
                      <p className="text-brand-400/60 text-[10px] font-bold uppercase tracking-[0.2em]">Official Structural Policy</p>
                    </div>
                  </div>

                  {/* Booking Guidelines Section */}
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-6 bg-brand-500 rounded-full" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Booking Guidelines</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          Renew your slot <span className="text-brand-600">at least 2 days</span> before expiry to ensure availability.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">
                          Empty slots are quickly opened for new residents if not confirmed.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tiered Refund Policy Section */}
                  <div className="p-6 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Refund Policy ({roomPack === 'yearly' ? 'Yearly' : 'Monthly'} Pack)</p>
                    </div>

                    <div className="space-y-3">
                      {roomPack === 'yearly' ? (
                        <>
                          <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-black text-emerald-900 uppercase">First Month</span>
                            </div>
                            <span className="text-sm font-black text-emerald-600">80% Refund</span>
                          </div>
                          <div className="flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-100">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="w-4 h-4 text-amber-600" />
                              <span className="text-xs font-black text-amber-900 uppercase">2nd to 5th Month</span>
                            </div>
                            <span className="text-sm font-black text-amber-600">40% Refund</span>
                          </div>
                          <div className="flex items-center justify-between p-3.5 bg-blue-50 rounded-2xl border border-blue-100">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="w-4 h-4 text-blue-600" />
                              <span className="text-xs font-black text-blue-900 uppercase">6th to 8th Month</span>
                            </div>
                            <span className="text-sm font-black text-blue-600">20% Refund</span>
                          </div>
                          <div className="flex items-center justify-between p-3.5 bg-slate-100 rounded-2xl border border-slate-200">
                            <div className="flex items-center gap-3">
                              <CalendarDays className="w-4 h-4 text-slate-400" />
                              <span className="text-xs font-black text-slate-400 uppercase whitespace-nowrap overflow-hidden text-ellipsis max-w-[120px]">After 8th Month</span>
                            </div>
                            <span className="text-xs font-black text-slate-400">No Return</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                          <div className="flex items-center gap-3">
                            <BadgePercent className="w-5 h-5 text-emerald-600" />
                            <span className="text-xs font-black text-emerald-900 uppercase">Anytime Refund</span>
                          </div>
                          <span className="text-lg font-black text-emerald-600">60%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Acceptance Checkbox */}
                  <div className="p-6 bg-slate-50 border-t border-slate-100">
                    <div 
                      className="flex items-center gap-4 cursor-pointer group p-1" 
                      onClick={() => {
                        const next = !agreedToRefund;
                        setAgreedToRefund(next);
                        setAgreedToTerms(next);
                      }}
                    >
                      <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                        ${agreedToRefund ? 'bg-brand-600 border-brand-600 shadow-lg shadow-brand-500/20' : 'border-slate-300 bg-white group-hover:border-brand-400'}`}>
                        {agreedToRefund && <Check className="w-5 h-5 text-white" strokeWidth={4} />}
                      </div>
                      <div className="flex-1 select-none">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">I Agree to Policy & Guidelines</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Strict settlement adherence</p>
                      </div>
                    </div>
                  </div>
                </div>
                )}

                {/* Agreement Checkbox (Full Pack Only) - REMOVED OLD VERSION BELOW */}

                {/* Agreement Checkbox (Full Pack Only) */}
                {bookingMode === 'full' && (
                  <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 group cursor-pointer hover:bg-white transition-all hidden"
                    onClick={() => setAgreedToTerms(!agreedToTerms)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${agreedToTerms ? 'bg-brand-600 border-brand-600' : 'border-slate-300 bg-white group-hover:border-brand-400'}`}>
                        {agreedToTerms && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <p className="text-sm font-bold text-slate-700">
                        I agree to the terms and conditions and I have read the booking guidelines.
                      </p>
                    </div>
                  </div>
                )}

                {/* Focused Official Brand Payment Options */}
                <div className="mb-10">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-1 text-center">
                    Select Your Payment Method
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                    {[
                      { id: 'phonepe', label: 'PhonePe', color: '#6739B7', icon: PhonePeIcon },
                      { id: 'gpay',    label: 'GPay',    color: '#4285F4', icon: GPayIcon },
                      { id: 'paytm',   label: 'Paytm',   color: '#00B9F5', icon: PaytmIcon },
                      { id: 'card',    label: 'Card',    color: '#1A1F71', icon: CardIcon },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`flex-shrink-0 h-20 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-2 group relative
                            ${isSelected 
                              ? 'border-brand-600 bg-white shadow-md ring-2 ring-brand-500/10' 
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white'}`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-4 h-4 rounded-full bg-brand-600 flex items-center justify-center shadow-sm">
                                <Check className="w-2.5 h-2.5 text-white" strokeWidth={5} />
                              </div>
                            </div>
                          )}
                          
                          <div className={`w-14 h-6 flex items-center justify-center opacity-90 transition-opacity ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                             <Icon className="w-full h-full" />
                          </div>
                          
                          <div className="text-center">
                            <span className={`text-[8px] font-black uppercase tracking-wider block
                              ${isSelected ? 'text-brand-900' : 'text-slate-400'}`}>
                              {method.label}
                            </span>
                            <div 
                              className={`h-0.5 rounded-full mx-auto mt-1 transition-all
                                ${isSelected ? 'w-4' : 'w-0'}`}
                              style={{ backgroundColor: method.color }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Refund Policy Disclosure - REMOVED OLD VERSION */}

                {/* Final Total */}
                <div className="pt-8 border-t-2 border-dashed border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Subscription</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-black text-slate-400">INR</span>
                          <span className="text-4xl font-black text-slate-900">₹{totalMonthly.toLocaleString()}</span>
                          <span className="text-slate-400 font-bold">/mo</span>
                        </div>
                      </div>
                      
                      {(roomPack === 'yearly' || mealPack === 'yearly') && (
                        <div className="bg-brand-50 border border-brand-100 rounded-2xl p-4 animate-in fade-in slide-in-from-left-4">
                          <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Total Booking Commitment</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xs font-bold text-brand-600">INR</span>
                            <span className="text-2xl font-black text-brand-700">
                              ₹{((roomPack === 'yearly' ? activeSharePrice * 12 : activeSharePrice) + 
                                (mealPack === 'yearly' ? activeFoodPrice * 12 : activeFoodPrice)).toLocaleString()}
                            </span>
                            <span className="text-brand-500/70 font-bold text-xs uppercase ml-1">Total</span>
                          </div>
                          <p className="text-[9px] text-brand-600/60 font-medium mt-1 uppercase tracking-tighter italic">
                            * Sum of {bookingMode === 'full' ? (roomPack === 'yearly' ? 'Yearly Room' : '1 Month Room') : 'N/A Room'} 
                            {bookingMode === 'full' && mealPack === 'yearly' ? ' & Yearly Meals' : 
                             mealPack === 'yearly' ? ' & Yearly Meals' : ' & Monthly Meal'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="sm:text-right">
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1 italic">Inclusive of all taxes & amenities</p>
                       <p className="text-slate-400 text-[9px] font-medium leading-tight">By clicking below, you authorize the reservation<br/>of this slot for the selected duration.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => setStep(4)} className="h-16 px-8 border-2 border-slate-200 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                ← Back
              </button>
              <button 
                onClick={handleConfirm} 
                disabled={bookingLoading || (bookingMode === 'full' ? (!agreedToTerms || !paymentMethod || !agreedToRefund) : !paymentMethod)}
                className={`flex-1 h-16 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all
                  ${(bookingMode === 'full' ? (agreedToTerms && paymentMethod && agreedToRefund) : paymentMethod) 
                    ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-xl shadow-brand-500/30 hover:-translate-y-1 active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-70'}`}>
                {bookingLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-300" />
                    Complete Booking & Reserve Slot
                  </>
                )}
              </button>
            </div>
            <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-6">
              By reserving now, you secure your spot at the current promotional rates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
