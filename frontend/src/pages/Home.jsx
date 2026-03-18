import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Phone, HelpCircle, Mail, MessageSquare } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:py-16 flex flex-col lg:flex-row items-center gap-12">

        {/* Left: Headline + CTA */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-brand-50 text-brand-700 text-sm font-bold px-4 py-1.5 rounded-full mb-6 border border-brand-100">
            🏠 Smart PG Finder across India
          </span>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 leading-tight mb-5">
            Find Your<br />
            <span className="text-brand-600">Perfect PG</span><br />
            in Minutes
          </h1>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Search verified PGs for Boys, Girls &amp; Both. Filter by State, City &amp; Area. No brokerage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {user ? (
              <Link to="/listings" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-xl font-extrabold text-lg shadow-lg transition-all hover:-translate-y-0.5">
                Search PGs Now →
              </Link>
            ) : (
              <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-10 py-4 rounded-xl font-extrabold text-lg shadow-lg transition-all hover:-translate-y-0.5">
                Login to Search PGs →
              </Link>
            )}
            <Link to="/listings" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brand-600 text-brand-600 hover:bg-brand-50 px-8 py-4 rounded-xl font-bold text-lg transition-all">
              Browse Listings
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-10 pt-8 border-t border-slate-200">
            {[['4,200+', 'Verified PGs'], ['50+', 'Cities'], ['4.6 ⭐', 'Avg Rating'], ['₹0', 'Brokerage']].map(([v, l]) => (
              <div key={l} className="text-center lg:text-left">
                <p className="text-2xl font-black text-slate-900">{v}</p>
                <p className="text-sm text-slate-500 font-medium">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Feature cards + trust row */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🧑', label: 'Boys PG', desc: 'Safe stays for boys', color: 'bg-blue-50 border-blue-100', link: '/listings?type=boys' },
              { icon: '👩', label: 'Girls PG', desc: 'Secure accommodations for girls', color: 'bg-pink-50 border-pink-100', link: '/listings?type=girls' },
              { icon: '🏠', label: 'Boys & Girls', desc: 'Mixed PGs for professionals', color: 'bg-purple-50 border-purple-100', link: '/listings?type=coliving' },
              { icon: '📍', label: 'Live Map View', desc: 'Map preview for every PG', color: 'bg-green-50 border-green-100', link: '/listings' },
            ].map(f => (
              <Link key={f.label} to={f.link} className={`${f.color} border rounded-2xl p-5 hover:shadow-md transition-all hover:-translate-y-1 block group`}>
                <span className="text-3xl transition-transform group-hover:scale-110 inline-block">{f.icon}</span>
                <p className="font-bold text-slate-900 text-sm mt-2">{f.label}</p>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">{f.desc}</p>
              </Link>
            ))}
          </div>
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap gap-4 justify-center text-sm text-slate-500">
            {['✅ Verified', '💰 No Brokerage', '🔐 Secure', '⚡ Instant Booking'].map(f => (
              <span key={f} className="font-medium">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Quick Help & Support */}
      <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-100 flex flex-col lg:flex-row-reverse items-center gap-12">
        
        {/* Right side (Grid) */}
        <div className="flex-1 w-full max-w-md lg:max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Phone className="w-8 h-8 text-amber-600" />, label: 'Call Support', desc: '1234567890', color: 'bg-amber-50 border-amber-100', href: 'tel:1234567890' },
              { icon: <MessageSquare className="w-8 h-8 text-indigo-600" />, label: 'WhatsApp', desc: 'Instant chat help', color: 'bg-indigo-50 border-indigo-100', href: 'https://wa.me/1234567890' },
              { icon: <Mail className="w-8 h-8 text-emerald-600" />, label: 'Email Us', desc: 'support@staynest.com', color: 'bg-emerald-50 border-emerald-100', href: 'mailto:support@staynest.com' },
              { icon: <HelpCircle className="w-8 h-8 text-blue-600" />, label: 'Help Center', desc: 'FAQs and Guides', color: 'bg-blue-50 border-blue-100', href: '#' },
            ].map(f => (
              <a key={f.label} href={f.href} className={`${f.color} border rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group block`}>
                <div className="transition-transform group-hover:scale-110">
                  {f.icon}
                </div>
                <p className="font-black text-slate-800 text-sm mt-3">{f.label}</p>
                <p className="text-xs text-slate-500 font-bold leading-relaxed mt-1">{f.desc}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Left side (Text) */}
        <div className="flex-1 text-center lg:text-left">
          <span className="inline-block bg-slate-100 text-slate-600 text-xs font-black px-4 py-1.5 rounded-full mb-6 border border-slate-200 uppercase tracking-widest">
            Customer Support
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-5">
            Need Help?<br />
            <span className="text-brand-600">We're Here</span><br />
            24/7 for You.
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium">
            Whether you have a question about booking, refunds, or just want to say hi, our team is ready to assist you anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="tel:1234567890" className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-lg transition-all hover:-translate-y-0.5">
              <Phone className="w-4 h-4 text-brand-500" /> Call Now
            </a>
            <button className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all">
              Visit Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
