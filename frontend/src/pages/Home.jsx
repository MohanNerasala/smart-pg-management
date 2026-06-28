import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Phone, HelpCircle, Mail, MessageSquare, 
  Building2, Users, IndianRupee, MapPin, 
  Search, ArrowRight, ShieldCheck, Map, 
  CreditCard, ChevronRight, Activity, Clock,
  Sparkles, Zap, CheckCircle
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Premium Scroll Reveal Animation Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    const hiddenElements = document.querySelectorAll('.scroll-reveal');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  return (
    <div className="w-full bg-[#fafcff] font-sans overflow-hidden selection:bg-emerald-200">
      
      {/* ─── CUSTOM ANIMATIONS ─── */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-blob { animation: blob 10s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 7s ease-in-out infinite; animation-delay: 1.5s; }
        
        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        
        /* New Scroll Reveal Classes */
        .scroll-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .scroll-reveal.visible { opacity: 1; transform: translateY(0); }

        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        .delay-500 { transition-delay: 500ms; }
      `}</style>

      {/* ─── PREMIUM HERO SECTION ─── */}
      <div className="relative min-h-[90vh] flex items-center border-b border-slate-200/60 bg-white/50 backdrop-blur-3xl">
        
        {/* Animated Background Orbs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob pointer-events-none"></div>
        <div className="absolute top-40 right-40 w-[400px] h-[400px] bg-cyan-200/40 rounded-full mix-blend-multiply filter blur-[80px] animate-blob animation-delay-2000 pointer-events-none"></div>
        <div className="absolute -bottom-20 left-20 w-[600px] h-[600px] bg-blue-100/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-8">
            
            {/* ─── LEFT COLUMN: CONTENT ─── */}
            <div className="flex-1 w-full max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
              
              {/* Badge */}
              <div className={`fade-up ${mounted ? 'visible' : ''} inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-sm hover:shadow-md transition-shadow cursor-default`}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Next-Gen PG Management
              </div>
              
              {/* Headline */}
              <h1 className={`fade-up delay-100 ${mounted ? 'visible' : ''} text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-slate-900 leading-[1.1] tracking-tight mb-5`}>
                Discover &amp; Manage <br className="hidden sm:block"/>
                <span className="relative inline-block mt-1">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">
                    Premium PGs Faster
                  </span>
                </span>
              </h1>
              
              {/* Subheadline */}
              <p className={`fade-up delay-200 ${mounted ? 'visible' : ''} text-base sm:text-lg text-slate-500 mb-8 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0`}>
                The ultimate proptech platform for verified Boys, Girls, and Co-living accommodations. Live availability, secure payments, and zero brokerage.
              </p>
              
              {/* CTAs */}
              <div className={`fade-up delay-300 ${mounted ? 'visible' : ''} flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10`}>
                <Link to={user ? "/listings" : "/login"} className="group relative inline-flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all hover:-translate-y-0.5 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <Search className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Search Properties</span>
                </Link>
                <Link to="/listings" className="group inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300 px-7 py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all hover:-translate-y-0.5">
                  View Listings
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Feature Chips */}
              <div className={`fade-up delay-400 ${mounted ? 'visible' : ''} flex flex-wrap justify-center lg:justify-start gap-3`}>
                {[
                  { icon: ShieldCheck, text: '100% Verified' },
                  { icon: IndianRupee, text: 'Zero Brokerage' },
                  { icon: Zap, text: 'Instant Booking' },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/60 shadow-sm text-sm font-bold text-slate-700 hover:bg-white hover:scale-105 transition-all cursor-default">
                    <feature.icon className="w-4 h-4 text-emerald-500" />
                    {feature.text}
                  </div>
                ))}
              </div>

            </div>

            {/* ─── RIGHT COLUMN: DYNAMIC UI COLLAGE ─── */}
            <div className={`fade-up delay-500 ${mounted ? 'visible' : ''} flex-1 w-full max-w-[560px] relative perspective-1000 lg:ml-auto lg:pl-12 mt-12 lg:mt-0`}>
              
              {/* Main Centerpiece: Premium Property Card */}
              <div className="relative z-20 bg-white rounded-[2rem] p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 transform transition-transform duration-700 hover:scale-[1.02] hover:-rotate-1 group">
                {/* Image Area */}
                <div className="w-full h-56 sm:h-72 rounded-2xl bg-slate-100 mb-6 relative overflow-hidden">
                   {/* We use a high-quality Unsplash architecture/room placeholder */}
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"></div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                   
                   {/* Top Badge */}
                   <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full flex items-center gap-2 shadow-sm">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">2 Beds Left</span>
                   </div>
                   
                   {/* Bottom Price */}
                   <div className="absolute bottom-5 left-5 text-white">
                      <p className="text-3xl font-black tracking-tight drop-shadow-md">₹12,500<span className="text-sm font-bold text-white/80 tracking-normal"> / mo</span></p>
                   </div>
                </div>
                
                {/* Card Details */}
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Stanza Living Premium</h3>
                      <p className="text-xs font-bold text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3 text-slate-400"/> Koramangala, Bengaluru</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-emerald-100">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  </div>
                  
                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-100">Private Room</span>
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-100">AC & WiFi</span>
                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-100">Meals Included</span>
                  </div>
                </div>
              </div>

              {/* Floating Widget 1: Booking Success (Top Right) */}
              <div className="absolute -right-6 -top-6 z-30 bg-white/90 backdrop-blur-xl p-3 rounded-2xl shadow-[0_15px_35px_-10px_rgba(0,0,0,0.15)] border border-slate-100 flex items-center gap-3 animate-float">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-inner">
                  {/* Note: CheckCircle2 is imported in the next step or assumed available. Let's use ShieldCheck if we don't update imports, but we'll update imports */}
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <div className="pr-3">
                  <p className="text-xs font-black text-slate-900">Booking Confirmed</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-0.5">Deposit: ₹5,000 paid</p>
                </div>
              </div>

              {/* Floating Widget 2: Occupancy Graph (Bottom Left) */}
              <div className="absolute -left-10 bottom-8 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-slate-100 animate-float-delayed">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-3.5 h-3.5 text-blue-500" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Occupancy</p>
                </div>
                <div className="flex items-end gap-1.5 h-10">
                  <div className="w-2.5 bg-slate-100 rounded-t-sm h-[40%]"></div>
                  <div className="w-2.5 bg-slate-100 rounded-t-sm h-[60%]"></div>
                  <div className="w-2.5 bg-slate-100 rounded-t-sm h-[45%]"></div>
                  <div className="w-2.5 bg-slate-200 rounded-t-sm h-[80%]"></div>
                  <div className="w-2.5 bg-blue-500 rounded-t-sm h-[95%] relative">
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping"></div>
                  </div>
                </div>
                <p className="text-lg font-black text-slate-900 mt-2 tracking-tighter">94%</p>
              </div>

              {/* Soft decorative glow behind collage */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-slate-100/60 blur-[80px] -z-10 pointer-events-none"></div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── PREMIUM CATEGORIES SECTION ─── */}
      <div className="w-full bg-white py-24 border-b border-slate-100 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
            <span className="inline-block bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-md mb-4 uppercase tracking-[0.2em] border border-emerald-100">
              Explore Properties
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">Perfect Match</span>
            </h2>
            <p className="text-slate-500 font-medium">
              Browse our verified catalog of premium accommodations tailored exactly to your lifestyle and preferences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Boys PG', desc: 'Secure & comfortable stays exclusively for men.', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', hover: 'hover:border-blue-300 hover:shadow-blue-500/10', link: '/listings?type=boys' },
              { title: 'Girls PG', desc: 'Safe, gated accommodations exclusively for women.', icon: ShieldCheck, color: 'text-pink-600', bg: 'bg-pink-50', hover: 'hover:border-pink-300 hover:shadow-pink-500/10', link: '/listings?type=girls' },
              { title: 'Co-Living', desc: 'Modern shared spaces for young professionals.', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50', hover: 'hover:border-purple-300 hover:shadow-purple-500/10', link: '/listings?type=coliving' },
              { title: 'Map View', desc: 'Explore all properties visually on a live city map.', icon: Map, color: 'text-emerald-600', bg: 'bg-emerald-50', hover: 'hover:border-emerald-300 hover:shadow-emerald-500/10', link: '/listings' }
            ].map((cat, idx) => (
              <Link key={idx} to={cat.link} className={`scroll-reveal delay-${(idx + 1) * 100} group bg-white rounded-2xl p-6 border border-slate-200 transition-all duration-300 ${cat.hover} hover:-translate-y-1 hover:shadow-xl`}>
                <div className={`w-14 h-14 rounded-xl ${cat.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                  <cat.icon className={`w-7 h-7 ${cat.color}`} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 group-hover:text-slate-700 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                  {cat.desc}
                </p>
                <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ─── QUICK HELP & SUPPORT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-slate-50">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          
          {/* Right side (Grid) */}
          <div className="flex-1 w-full max-w-xl lg:max-w-none scroll-reveal delay-200">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Phone, label: 'Call Support', desc: '1234567890', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', href: 'tel:1234567890' },
                { icon: MessageSquare, label: 'WhatsApp', desc: 'Instant chat help', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', href: 'https://wa.me/1234567890' },
                { icon: Mail, label: 'Email Us', desc: 'support@staynest.com', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', href: 'mailto:support@staynest.com' },
                { icon: HelpCircle, label: 'Help Center', desc: 'FAQs and Guides', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', href: '#' },
              ].map((f, idx) => (
                <a key={idx} href={f.href} className={`scroll-reveal delay-${(idx + 1) * 100} rounded-2xl p-6 border ${f.bg} hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group block bg-white`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <p className="font-black text-slate-800 text-base tracking-tight">{f.label}</p>
                  <p className="text-xs text-slate-500 font-bold mt-1">{f.desc}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Left side (Text) */}
          <div className="flex-1 text-center lg:text-left scroll-reveal">
            <span className="inline-block bg-slate-200 text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-md mb-6 uppercase tracking-widest">
              Customer Support
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Need Help?<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">We're Here 24/7.</span>
            </h2>
            <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
              Whether you have a question about booking, refunds, or just want to say hi, our team is ready to assist you anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="tel:1234567890" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg transition-all hover:-translate-y-0.5">
                <Phone className="w-4 h-4 text-slate-300" /> Call Now
              </a>
              <button className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all">
                Visit Help Center
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
