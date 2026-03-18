import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  User as UserIcon, Mail, Shield, Bell, MessageSquare, Phone, MapPin, ChevronRight, 
  Heart, HelpCircle, Lock, Globe, CreditCard, Star, Send, Camera,
  Facebook, Twitter, Instagram, Linkedin, ExternalLink, ArrowLeft 
} from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState('profile');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Please login to view your profile.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: <UserIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Camera className="w-4 h-4" /> },
    { id: 'feedback', label: 'Feedback', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'help', label: 'Help & Contact', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackText('');
      setFeedbackRating(0);
      alert('Thank you for your feedback! It helps us improve StayNest.');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Actions */}
        <div className="mb-6">
           <button
             onClick={() => navigate(-1)}
             className="w-10 h-10 bg-black hover:bg-slate-900 border border-slate-800 text-white rounded-full flex items-center justify-center transition-all group shadow-lg shadow-black/10 shrink-0"
           >
             <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
           </button>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage your profile details and get support.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="w-full lg:w-64 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
                  ${activeTab === tab.id 
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-200 uppercase tracking-wider translate-x-1' 
                    : 'text-slate-500 hover:bg-white hover:text-slate-900 border border-transparent hover:border-slate-200'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-[32px] shadow-sm border border-slate-200 overflow-hidden transition-all duration-500">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                    <div className="relative group">
                      <div className="w-32 h-32 bg-brand-100 rounded-full flex items-center justify-center border-4 border-white shadow-xl group-hover:bg-brand-200 transition-colors">
                        <UserIcon className="w-16 h-16 text-brand-600" />
                      </div>
                      <button className="absolute bottom-1 right-1 p-2 bg-white rounded-full shadow-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                        <Camera className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-black text-slate-900">{user.name}</h2>
                      <p className="text-slate-500 font-medium">{user.email || 'Resident'}</p>
                      <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                        <span className="inline-flex items-center px-3 py-1 bg-brand-50 text-brand-700 text-[10px] font-black rounded-full border border-brand-100 uppercase tracking-widest">
                          {user.role?.replace('ROLE_', '') || 'Member'}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black rounded-full border border-green-100 uppercase tracking-widest">
                          Verified Resident
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Public Profile</h3>
                      <div className="space-y-4">
                        <ProfileField label="Full Name" value={user.name} icon={<UserIcon className="w-4 h-4" />} />
                        <ProfileField label="Email" value={user.email} icon={<Mail className="w-4 h-4" />} />
                        <ProfileField label="Phone" value="1234567890" icon={<Phone className="w-4 h-4" />} />
                        <ProfileField label="Location" value="Bengaluru, KA" icon={<MapPin className="w-4 h-4" />} />
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">Account Status</h3>
                      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-bold text-slate-600">Plan</span>
                          <span className="text-sm font-black text-brand-600">PREMIUM</span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-bold text-slate-600">Joined</span>
                          <span className="text-sm font-medium text-slate-500">March 2024</span>
                        </div>
                        <button className="w-full py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest">
                          Upgrade Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-black text-slate-900 mb-8">Account Settings</h2>
                  
                  <div className="space-y-8">
                    <section>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" /> Privacy & Security
                      </h3>
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
                        <ToggleSetting label="Public Profile" description="Make your profile visible to other residents" defaultChecked={true} />
                        <ToggleSetting label="Two-Factor Auth" description="Add extra security to your account" defaultChecked={false} />
                        <ActionSetting label="Change Password" icon={<Lock className="w-4 h-4" />} />
                      </div>
                    </section>

                    <section>
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5" /> Notifications
                      </h3>
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 divide-y divide-slate-200/60 overflow-hidden">
                        <ToggleSetting label="Email Alerts" description="Daily digest and booking updates" defaultChecked={true} />
                        <ToggleSetting label="Push Notifications" description="Real-time alerts on your device" defaultChecked={true} />
                      </div>
                    </section>
                  </div>
                </div>
              )}


              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto">
                  <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-brand-600 fill-brand-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Share Your Experience</h2>
                    <p className="text-slate-500 font-medium">Your feedback helps us make StayNest better for everyone.</p>
                  </div>

                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">How would you rate us?</label>
                      <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className={`p-2 transition-all hover:scale-110 ${feedbackRating >= star ? 'text-brand-500 shadow-brand-100' : 'text-slate-200'}`}
                          >
                            <Star className={`w-8 h-8 ${feedbackRating >= star ? 'fill-brand-500' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Detailed Feedback</label>
                      <textarea
                        required
                        className="w-full h-32 px-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all font-medium text-slate-900 resize-none"
                        placeholder="What can we do better? What do you love about StayNest?"
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || feedbackRating === 0}
                      className="w-full py-4 bg-brand-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-brand-200 hover:bg-brand-700 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Feedback
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {/* Help & Contact Tab */}
              {activeTab === 'help' && (
                <div className="p-8 animate-in fade-in slide-in-from-right-4 duration-500">
                  <h2 className="text-2xl font-black text-slate-900 mb-8">Support Center</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     <ContactCard 
                        icon={<Mail className="w-5 h-5" />} 
                        label="Email Support" 
                        value="support@staynest.in" 
                        color="bg-blue-50 text-blue-600 border-blue-100"
                        href="mailto:support@staynest.in"
                      />
                      <ContactCard 
                        icon={<Phone className="w-5 h-5" />} 
                        label="Call Us" 
                        value="1234567890" 
                        color="bg-green-50 text-green-600 border-green-100"
                        href="tel:1234567890"
                      />
                      <ContactCard 
                        icon={<MapPin className="w-5 h-5" />} 
                        label="Main Office" 
                        value="Indiranagar, BLR" 
                        color="bg-purple-50 text-purple-600 border-purple-100"
                        href="#"
                      />
                  </div>

                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    <FAQItem 
                      question="How do I schedule a physical visit?" 
                      answer="You can schedule a visit directly from the PG details page by clicking the 'Visit' button and selecting a time slot." 
                    />
                    <FAQItem 
                      question="What is the refund policy for bookings?" 
                      answer="Full refund is available if cancelled within 24 hours of booking. Post that, 50% refund is available up to 48 hours before move-in." 
                    />
                    <FAQItem 
                      question="How can I list my own property?" 
                      answer="Click on the 'Listings' page and use the 'List Property' button to start your registration as a PG Owner." 
                    />
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <p className="text-sm font-bold text-slate-900">Follow us for updates</p>
                      <div className="flex gap-4 mt-3">
                        <button className="text-slate-400 hover:text-brand-600 transition-colors"><Facebook className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-brand-600 transition-colors"><Twitter className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-brand-600 transition-colors"><Instagram className="w-5 h-5" /></button>
                        <button className="text-slate-400 hover:text-brand-600 transition-colors"><Linkedin className="w-5 h-5" /></button>
                      </div>
                    </div>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2">
                       Knowledge Base <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-brand-500 fill-brand-500" />
            <span className="text-slate-400 text-sm font-medium uppercase tracking-widest text-[10px]">Made with love for Residents</span>
          </div>
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Version 2.0.4 • © 2026 StayNest India Pvt Ltd</p>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const ProfileField = ({ label, value, icon }) => (
  <div className="flex items-center gap-4 transition-transform hover:translate-x-1 duration-300">
    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-slate-900 font-bold">{value || 'Not set'}</p>
    </div>
  </div>
);

const ToggleSetting = ({ label, description, defaultChecked }) => (
  <div className="flex items-center justify-between p-4 hover:bg-white transition-colors">
    <div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
      <p className="text-xs text-slate-500 font-medium">{description}</p>
    </div>
    <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${defaultChecked ? 'bg-brand-600' : 'bg-slate-300'}`}>
      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${defaultChecked ? 'translate-x-5' : ''}`} />
    </div>
  </div>
);

const ActionSetting = ({ label, value, icon }) => (
  <button className="w-full flex items-center justify-between p-4 hover:bg-white transition-colors text-left">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
        {icon}
      </div>
      <p className="text-sm font-bold text-slate-900">{label}</p>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs font-black text-brand-600 uppercase tracking-widest">{value}</span>}
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </div>
  </button>
);


const ContactCard = ({ icon, label, value, color, href }) => (
  <a href={href} className={`${color} border rounded-2xl p-5 transition-all hover:-translate-y-1 hover:shadow-md block group`}>
    <div className="mb-3 transition-transform group-hover:scale-110">{icon}</div>
    <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
    <p className="text-sm font-black">{value}</p>
  </a>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
      >
        <span className="text-sm font-black text-slate-900">{question}</span>
        <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-600' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-6 pb-4 animate-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-slate-500 font-medium leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
