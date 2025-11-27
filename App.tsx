import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useParams, useNavigate, Link } from 'react-router-dom';
import {
  Dog, Cat, Bird, Rabbit, PawPrint, QrCode, Bell, MapPin, Phone, Mail,
  MessageCircle, Shield, Zap, Heart, ChevronRight, Menu, X, User as UserIcon,
  LogOut, Settings, Plus, Edit, Trash2, Clock, AlertTriangle, CheckCircle,
  Camera, Share2, ExternalLink, Globe, Home, History, Tag, FileText, Award,
  Building2, Star, Search, Filter, Syringe, Weight, Calendar, FileCheck,
  TrendingUp, Trophy, BadgeCheck, Stethoscope, ChevronDown, ChevronUp
} from 'lucide-react';
import { StorageService } from './services/storageService';
import { NotificationService } from './services/notificationService';
import { GeolocationService } from './services/geolocationService';
import { LanguageService, t } from './services/languageService';
import {
  User, Pet, Tag as TagType, ScanEvent, GeoLocation, Language,
  RegisterFormData, Toast, PetType, PetGender, PetSize, EmergencyContact,
  HealthPassport, VaccinationRecord, DewormingRecord, HealthCheckup, WeightRecord, HealthReminder,
  FinderProfile, FINDER_LEVELS, FINDER_BADGES,
  InsuranceProvider, InsurancePlan, PetInsurance,
  NGO, NGOService
} from './types';

// Initialize storage
StorageService.init();

// ==================== CONTEXTS ====================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  register: (data: RegisterFormData) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toasts: Toast[];
  addToast: (message: string, type: Toast['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// ==================== TOAST COMPONENT ====================

const ToastContainer: React.FC<{ toasts: Toast[]; onRemove: (id: string) => void }> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up cursor-pointer ${
            toast.type === 'success' ? 'bg-green-500 text-white' :
            toast.type === 'error' ? 'bg-red-500 text-white' :
            toast.type === 'warning' ? 'bg-yellow-500 text-white' :
            'bg-blue-500 text-white'
          }`}
          onClick={() => onRemove(toast.id)}
        >
          {toast.type === 'success' && <CheckCircle size={20} />}
          {toast.type === 'error' && <X size={20} />}
          {toast.type === 'warning' && <AlertTriangle size={20} />}
          {toast.type === 'info' && <Bell size={20} />}
          <span className="font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

// ==================== LANDING PAGE ====================

const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-paw-cream">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-secondary">PawTag</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">India</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-secondary hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-secondary hover:text-primary transition-colors">How It Works</a>
              <a href="#pricing" className="text-secondary hover:text-primary transition-colors">Pricing</a>
              <Link to="/login" className="text-secondary hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary-hover transition-colors">
                Get Started
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-secondary hover:text-primary">Features</a>
              <a href="#how-it-works" className="text-secondary hover:text-primary">How It Works</a>
              <a href="#pricing" className="text-secondary hover:text-primary">Pricing</a>
              <Link to="/login" className="text-secondary hover:text-primary">Login</Link>
              <Link to="/register" className="bg-primary text-white px-6 py-2 rounded-full text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <span className="animate-pulse">●</span>
                Now with WhatsApp Notifications!
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-secondary leading-tight">
                India's Smartest
                <span className="text-primary block">QR Pet Tag</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                Never lose your furry friend again. Get instant SMS, WhatsApp & email alerts
                when someone finds your pet. Know exactly where they are with GPS location.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-hover transition-all transform hover:scale-105 flex items-center gap-2"
                >
                  Get Your PawTag <ChevronRight size={20} />
                </Link>
                <a
                  href="#how-it-works"
                  className="border-2 border-secondary text-secondary px-8 py-4 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="flex -space-x-3">
                  {['A', 'B', 'C', 'D'].map((letter, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-primary font-bold text-sm">
                      {letter}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-bold text-secondary">10,000+</span> happy pet parents
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"
                  alt="Happy dog with PawTag"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle className="text-green-500" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary">Bruno found!</p>
                    <p className="text-xs text-gray-500">2 min ago • Bandra, Mumbai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Everything You Need to Keep Your Pet Safe
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              PawTag combines QR technology with instant notifications to reunite lost pets with their families faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: QrCode, title: 'QR Code Technology', desc: 'Scan with any smartphone - no app needed', color: 'bg-blue-100 text-blue-600' },
              { icon: MessageCircle, title: 'WhatsApp Alerts', desc: 'India\'s favorite messaging app integration', color: 'bg-green-100 text-green-600' },
              { icon: MapPin, title: 'GPS Location', desc: 'Know exactly where your pet was found', color: 'bg-red-100 text-red-600' },
              { icon: Zap, title: 'Instant Notifications', desc: 'SMS, Email & WhatsApp in seconds', color: 'bg-yellow-100 text-yellow-600' },
              { icon: Shield, title: 'Secure & Private', desc: 'You control what information is shown', color: 'bg-purple-100 text-purple-600' },
              { icon: Globe, title: 'Hindi & English', desc: 'Multilingual support for India', color: 'bg-pink-100 text-pink-600' },
              { icon: Heart, title: 'Medical Info', desc: 'Share allergies & vet details', color: 'bg-red-100 text-red-600' },
              { icon: Phone, title: 'One-Tap Contact', desc: 'Call or WhatsApp finder instantly', color: 'bg-indigo-100 text-indigo-600' }
            ].map((feature, i) => (
              <div key={i} className="bg-paw-cream/50 rounded-2xl p-6 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-paw-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              How PawTag Works
            </h2>
            <p className="text-gray-600">Simple as 1-2-3</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Register Your Pet', desc: 'Create a profile with photos, medical info, and your contact details', icon: PawPrint },
              { step: '2', title: 'Attach the Tag', desc: 'Hook the durable QR tag to your pet\'s collar - waterproof & scratch-resistant', icon: Tag },
              { step: '3', title: 'Get Instant Alerts', desc: 'When someone scans, you get SMS, WhatsApp & email with location', icon: Bell }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                    {item.step}
                  </div>
                  <div className="mt-4 mb-6">
                    <item.icon size={48} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight size={32} className="text-primary/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Simple, Affordable Pricing
            </h2>
            <p className="text-gray-600">One-time purchase, lifetime protection</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Basic', price: '₹499', features: ['QR Code Tag', 'SMS Alerts', 'Email Alerts', 'Pet Profile', 'Unlimited Scans'], popular: false },
              { name: 'Premium', price: '₹799', features: ['QR Code Tag', 'SMS + WhatsApp Alerts', 'Email Alerts', 'Pet Profile + Medical Info', 'GPS Location', 'Priority Support'], popular: true },
              { name: 'NFC Pro', price: '₹1,299', features: ['QR + NFC Tag', 'All Premium Features', 'Tap to Scan (NFC)', 'Premium Metal Design', 'Lifetime Warranty'], popular: false }
            ].map((plan, i) => (
              <div key={i} className={`rounded-2xl p-8 ${plan.popular ? 'bg-primary text-white scale-105 shadow-2xl' : 'bg-paw-gray'}`}>
                {plan.popular && (
                  <div className="text-xs bg-white/20 text-white px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className={`text-2xl font-bold ${plan.popular ? 'text-white' : 'text-secondary'}`}>{plan.name}</h3>
                <div className="my-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-secondary'}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}> one-time</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle size={16} className={plan.popular ? 'text-white' : 'text-green-500'} />
                      <span className={plan.popular ? 'text-white/90' : 'text-gray-600'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/register"
                  className={`block text-center py-3 rounded-full font-semibold transition-all ${
                    plan.popular
                      ? 'bg-white text-primary hover:bg-gray-100'
                      : 'bg-primary text-white hover:bg-primary-hover'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Give Your Pet the Best Protection
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Join thousands of pet parents across India who trust PawTag to keep their furry friends safe.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Get Your PawTag Today <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <PawPrint className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">PawTag India</span>
              </div>
              <p className="text-gray-400 text-sm">
                India's smartest QR pet tag with instant WhatsApp, SMS & email notifications.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2"><Mail size={16} /> hello@pawtag.in</li>
                <li className="flex items-center gap-2"><Phone size={16} /> +91 98765 43210</li>
                <li className="flex items-center gap-2"><MessageCircle size={16} /> WhatsApp Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>© 2024 PawTag India. Made with ❤️ for pet parents.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// ==================== AUTH PAGES ====================

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('demo@pawtag.in');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      if (success) {
        addToast('Welcome back!', 'success');
        navigate('/dashboard');
      } else {
        addToast('Invalid email or password', 'error');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-paw-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <PawPrint className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-secondary">PawTag</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to manage your pets</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Demo Account:</strong><br />
              Email: demo@pawtag.in<br />
              Password: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'en'
  });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const success = register(formData);
      if (success) {
        addToast('Account created successfully!', 'success');
        navigate('/dashboard');
      } else {
        addToast('Email already exists', 'error');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-paw-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <PawPrint className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-secondary">PawTag</span>
          </Link>
          <h1 className="text-3xl font-bold text-secondary mb-2">Create Account</h1>
          <p className="text-gray-600">Join PawTag to protect your pets</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="Rahul Sharma"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="your@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Phone (WhatsApp)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="+91 98765 43210"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Preferred Language</label>
              <select
                value={formData.preferredLanguage}
                onChange={(e) => setFormData({...formData, preferredLanguage: e.target.value as Language})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== DASHBOARD LAYOUT ====================

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: PawPrint, label: 'My Pets', path: '/dashboard/pets' },
    { icon: History, label: 'Scan History', path: '/dashboard/scans' },
    { icon: FileText, label: 'Health Passport', path: '/dashboard/health' },
    { icon: Shield, label: 'Insurance', path: '/dashboard/insurance' },
    { icon: Building2, label: 'NGO Directory', path: '/dashboard/ngos' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' }
  ];

  return (
    <div className="min-h-screen bg-paw-cream">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="font-bold text-secondary">PawTag</span>
          </div>
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <UserIcon size={18} className="text-primary" />
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-secondary">PawTag</span>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.hash.includes(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <UserIcon size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-secondary truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 text-red-500 hover:text-red-600 w-full px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// ==================== DASHBOARD HOME ====================

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalPets: 0, activeTags: 0, totalScans: 0, scansThisMonth: 0, lostPets: 0, foundPets: 0 });
  const [recentScans, setRecentScans] = useState<ScanEvent[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (user) {
      setStats(StorageService.getDashboardStats(user.id));
      const userPets = StorageService.getPetsByOwnerId(user.id);
      setPets(userPets);
      const petIds = userPets.map(p => p.id);
      const scans = StorageService.getScans()
        .filter(s => petIds.includes(s.petId))
        .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
        .slice(0, 5);
      setRecentScans(scans);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary">
          Welcome back, {user?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600 mt-1">Here's what's happening with your pets</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Pets', value: stats.totalPets, icon: PawPrint, color: 'bg-blue-500' },
          { label: 'Active Tags', value: stats.activeTags, icon: QrCode, color: 'bg-green-500' },
          { label: 'Total Scans', value: stats.totalScans, icon: History, color: 'bg-purple-500' },
          { label: 'This Month', value: stats.scansThisMonth, icon: Clock, color: 'bg-primary' }
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
              <stat.icon size={20} className="text-white" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-secondary">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Pets */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-secondary">My Pets</h2>
            <Link to="/dashboard/pets" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <PawPrint size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No pets registered yet</p>
                <Link to="/dashboard/pets" className="text-primary font-medium mt-2 inline-block">
                  Add your first pet
                </Link>
              </div>
            ) : (
              pets.slice(0, 3).map(pet => (
                <Link
                  key={pet.id}
                  to={`/dashboard/pets/${pet.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={pet.photoUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${pet.name}`}
                    alt={pet.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-secondary">{pet.name}</span>
                      {pet.isLost && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">LOST</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{pet.breed} • {pet.type}</p>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Scans */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold text-secondary">Recent Scans</h2>
            <Link to="/dashboard/scans" className="text-primary text-sm font-medium hover:underline">
              View All
            </Link>
          </div>
          <div className="p-4 space-y-3">
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <QrCode size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No scans yet</p>
                <p className="text-sm text-gray-400 mt-1">Scans will appear here when someone finds your pet</p>
              </div>
            ) : (
              recentScans.map(scan => {
                const pet = pets.find(p => p.id === scan.petId);
                return (
                  <div key={scan.id} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-secondary">
                        {pet?.name}'s tag was scanned
                      </p>
                      <p className="text-sm text-gray-500">
                        {scan.location?.address || scan.location?.city || 'Location unknown'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(scan.scannedAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MY PETS PAGE ====================

const MyPetsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [pets, setPets] = useState<Pet[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (user) {
      setPets(StorageService.getPetsByOwnerId(user.id));
    }
  }, [user]);

  const PetIcon = ({ type }: { type: PetType }) => {
    switch (type) {
      case 'dog': return <Dog size={24} />;
      case 'cat': return <Cat size={24} />;
      case 'bird': return <Bird size={24} />;
      case 'rabbit': return <Rabbit size={24} />;
      default: return <PawPrint size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary">My Pets</h1>
          <p className="text-gray-600 mt-1">Manage your pet profiles</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-primary-hover transition-colors"
        >
          <Plus size={20} />
          Add Pet
        </button>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <PawPrint size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">No pets yet</h3>
          <p className="text-gray-500 mb-6">Add your first pet to get started with PawTag</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-primary-hover transition-colors"
          >
            <Plus size={20} />
            Add Your First Pet
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map(pet => (
            <Link
              key={pet.id}
              to={`/dashboard/pets/${pet.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video relative">
                <img
                  src={pet.photoUrl || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400`}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
                {pet.isLost && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                    LOST
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1">
                  <PetIcon type={pet.type} />
                  <span className="text-sm font-medium capitalize">{pet.type}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-secondary">{pet.name}</h3>
                <p className="text-gray-500 text-sm">{pet.breed}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pet.color.toLowerCase() === 'golden' ? '#D4AF37' : pet.color.toLowerCase() }} />
                    {pet.color}
                  </span>
                  <span>{pet.gender === 'male' ? '♂' : '♀'} {pet.gender}</span>
                  {pet.age && <span>{pet.age}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Pet Modal */}
      {showAddModal && (
        <AddPetModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setPets(StorageService.getPetsByOwnerId(user!.id));
            setShowAddModal(false);
            addToast('Pet added successfully!', 'success');
          }}
        />
      )}
    </div>
  );
};

// ==================== ADD PET MODAL ====================

const AddPetModal: React.FC<{ onClose: () => void; onSuccess: () => void }> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    type: 'dog' as PetType,
    breed: '',
    gender: 'male' as PetGender,
    size: 'medium' as PetSize,
    color: '',
    dateOfBirth: '',
    photoUrl: '',
    personality: '',
    specialNeeds: ''
  });

  const handleSubmit = () => {
    if (!user) return;

    // Create a new tag for this pet
    const newTag = StorageService.createTag('basic');

    const newPet: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'> = {
      ...formData,
      ownerId: user.id,
      tagId: newTag.id,
      emergencyContacts: [{
        id: `ec-${Date.now()}`,
        name: user.name,
        phone: user.phone,
        relationship: 'Owner',
        isPrimary: true
      }],
      status: 'active',
      isLost: false
    };

    const createdPet = StorageService.createPet(newPet);
    StorageService.activateTag(newTag.id, createdPet.id, user.id);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-secondary">Add New Pet</h2>
            <p className="text-sm text-gray-500">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Pet Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Bruno"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Pet Type *</label>
                <div className="grid grid-cols-5 gap-2">
                  {(['dog', 'cat', 'bird', 'rabbit', 'other'] as PetType[]).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({...formData, type})}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all ${
                        formData.type === type
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {type === 'dog' && <Dog size={24} />}
                      {type === 'cat' && <Cat size={24} />}
                      {type === 'bird' && <Bird size={24} />}
                      {type === 'rabbit' && <Rabbit size={24} />}
                      {type === 'other' && <PawPrint size={24} />}
                      <span className="text-xs capitalize">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Breed *</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Golden Retriever"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as PetGender})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary mb-2">Size</label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({...formData, size: e.target.value as PetSize})}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="Golden, Black, White, etc."
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Photo URL</label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Paste a URL to your pet's photo</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Personality / Behavior</label>
                <textarea
                  value={formData.personality}
                  onChange={(e) => setFormData({...formData, personality: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  placeholder="Friendly, loves to play fetch, shy with strangers..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary mb-2">Special Needs / Notes</label>
                <textarea
                  value={formData.specialNeeds}
                  onChange={(e) => setFormData({...formData, specialNeeds: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  rows={3}
                  placeholder="Allergies, medications, dietary needs..."
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          )}

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!formData.name || !formData.breed}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
            >
              Add Pet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== PET DETAIL PAGE ====================

const PetDetailPage: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const { user } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [tag, setTag] = useState<TagType | null>(null);
  const [scans, setScans] = useState<ScanEvent[]>([]);

  useEffect(() => {
    if (petId) {
      const petData = StorageService.getPetById(petId);
      if (petData && petData.ownerId === user?.id) {
        setPet(petData);
        const tagData = StorageService.getTagById(petData.tagId);
        setTag(tagData || null);
        setScans(StorageService.getScansByPetId(petId));
      }
    }
  }, [petId, user]);

  const handleMarkLost = () => {
    if (pet) {
      StorageService.markPetAsLost(pet.id);
      setPet({ ...pet, isLost: true, status: 'lost' });
      addToast(`${pet.name} has been marked as lost`, 'warning');
    }
  };

  const handleMarkFound = () => {
    if (pet) {
      StorageService.markPetAsFound(pet.id);
      setPet({ ...pet, isLost: false, status: 'active' });
      addToast(`Great news! ${pet.name} has been marked as found!`, 'success');
    }
  };

  if (!pet) {
    return (
      <div className="text-center py-12">
        <PawPrint size={64} className="mx-auto text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-secondary">Pet not found</h3>
        <Link to="/dashboard/pets" className="text-primary mt-2 inline-block">
          Back to My Pets
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/dashboard/pets')}
        className="flex items-center gap-2 text-gray-600 hover:text-primary"
      >
        <ChevronRight size={20} className="rotate-180" />
        Back to My Pets
      </button>

      {/* Pet Header */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <div className="aspect-square relative">
              <img
                src={pet.photoUrl || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600`}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              {pet.isLost && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                  LOST
                </div>
              )}
            </div>
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-secondary">{pet.name}</h1>
                <p className="text-gray-600">{pet.breed} • {pet.type}</p>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/pet/${tag?.code}`}
                  target="_blank"
                  className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                  title="View public profile"
                >
                  <ExternalLink size={20} />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="font-medium capitalize">{pet.gender}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium capitalize">{pet.size}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium">{pet.color}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Age</p>
                <p className="font-medium">{pet.age || 'Unknown'}</p>
              </div>
            </div>

            {/* Tag Info */}
            {tag && (
              <div className="bg-primary/10 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary font-medium">Tag Code</p>
                    <p className="text-2xl font-bold text-secondary font-mono">{tag.code}</p>
                  </div>
                  <QrCode size={48} className="text-primary" />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Scan URL: {window.location.origin}/#/pet/{tag.code}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {pet.isLost ? (
                <button
                  onClick={handleMarkFound}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Mark as Found
                </button>
              ) : (
                <button
                  onClick={handleMarkLost}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 flex items-center gap-2"
                >
                  <AlertTriangle size={18} />
                  Mark as Lost
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personality & Special Needs */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-secondary mb-4">About {pet.name}</h3>
          {pet.personality && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Personality</p>
              <p className="text-secondary">{pet.personality}</p>
            </div>
          )}
          {pet.specialNeeds && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Special Needs</p>
              <p className="text-secondary">{pet.specialNeeds}</p>
            </div>
          )}
          {!pet.personality && !pet.specialNeeds && (
            <p className="text-gray-400">No additional information added</p>
          )}
        </div>

        {/* Emergency Contacts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-secondary mb-4">Emergency Contacts</h3>
          <div className="space-y-3">
            {pet.emergencyContacts.map(contact => (
              <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-secondary">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.relationship}</p>
                </div>
                <a
                  href={`tel:${contact.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Phone size={16} />
                  {contact.phone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-secondary mb-4">Scan History</h3>
        {scans.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No scans recorded yet</p>
        ) : (
          <div className="space-y-3">
            {scans.map(scan => (
              <div key={scan.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-secondary">Tag Scanned</p>
                  <p className="text-sm text-gray-600">
                    {scan.location?.address || scan.location?.city || 'Location unknown'}
                  </p>
                  {scan.finderName && (
                    <p className="text-sm text-gray-500 mt-1">
                      By: {scan.finderName} {scan.finderPhone && `(${scan.finderPhone})`}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(scan.scannedAt).toLocaleString('en-IN')}
                  </p>
                </div>
                {scan.location && (
                  <a
                    href={`https://maps.google.com/maps?q=${scan.location.latitude},${scan.location.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    View Map
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ==================== SCAN HISTORY PAGE ====================

const ScanHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanEvent[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);

  useEffect(() => {
    if (user) {
      const userPets = StorageService.getPetsByOwnerId(user.id);
      setPets(userPets);
      const petIds = userPets.map(p => p.id);
      const allScans = StorageService.getScans()
        .filter(s => petIds.includes(s.petId))
        .sort((a, b) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime());
      setScans(allScans);
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary">Scan History</h1>
        <p className="text-gray-600 mt-1">View all scans of your pet tags</p>
      </div>

      {scans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <QrCode size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-secondary mb-2">No scans yet</h3>
          <p className="text-gray-500">When someone scans your pet's tag, it will appear here</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y">
            {scans.map(scan => {
              const pet = pets.find(p => p.id === scan.petId);
              return (
                <div key={scan.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-4">
                    <img
                      src={pet?.photoUrl || `https://api.dicebear.com/7.x/thumbs/svg?seed=${pet?.name}`}
                      alt={pet?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-secondary">{pet?.name}'s tag was scanned</h4>
                        <span className="text-xs text-gray-400">
                          {new Date(scan.scannedAt).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {scan.location?.address || scan.location?.city || 'Location unknown'}
                      </div>
                      {scan.finderName && (
                        <div className="mt-2 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Finder Info:</p>
                          <p className="text-sm text-green-700">
                            {scan.finderName} {scan.finderPhone && `• ${scan.finderPhone}`}
                          </p>
                          {scan.finderMessage && (
                            <p className="text-sm text-green-600 mt-1">"{scan.finderMessage}"</p>
                          )}
                        </div>
                      )}
                    </div>
                    {scan.location && (
                      <a
                        href={`https://maps.google.com/maps?q=${scan.location.latitude},${scan.location.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary/10 rounded-lg text-primary hover:bg-primary/20"
                      >
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== SETTINGS PAGE ====================

const SettingsPage: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    preferredLanguage: user?.preferredLanguage || 'en',
    notificationPreferences: user?.notificationPreferences || {
      sms: true,
      email: true,
      whatsapp: true,
      push: true
    }
  });

  const handleSave = () => {
    updateUser(formData);
    addToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-secondary mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Phone (WhatsApp)</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary mb-2">Pincode</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-secondary mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'sms', label: 'SMS Notifications', icon: Phone },
            { key: 'email', label: 'Email Notifications', icon: Mail },
            { key: 'whatsapp', label: 'WhatsApp Notifications', icon: MessageCircle },
            { key: 'push', label: 'Push Notifications', icon: Bell }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-gray-500" />
                <span className="font-medium">{label}</span>
              </div>
              <button
                onClick={() => setFormData({
                  ...formData,
                  notificationPreferences: {
                    ...formData.notificationPreferences,
                    [key]: !formData.notificationPreferences[key as keyof typeof formData.notificationPreferences]
                  }
                })}
                className={`w-12 h-6 rounded-full transition-colors ${
                  formData.notificationPreferences[key as keyof typeof formData.notificationPreferences]
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  formData.notificationPreferences[key as keyof typeof formData.notificationPreferences]
                    ? 'translate-x-6'
                    : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-secondary mb-4">Language / भाषा</h3>
        <select
          value={formData.preferredLanguage}
          onChange={(e) => setFormData({...formData, preferredLanguage: e.target.value as Language})}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          <option value="en">English</option>
          <option value="hi">हिंदी (Hindi)</option>
        </select>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"
        >
          Save Changes
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-4">Danger Zone</h3>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-100"
        >
          Logout from all devices
        </button>
      </div>
    </div>
  );
};

// ==================== HEALTH PASSPORT PAGE ====================

const HealthPassportPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('');
  const [passport, setPassport] = useState<HealthPassport | null>(null);
  const [activeTab, setActiveTab] = useState<'vaccinations' | 'deworming' | 'checkups' | 'weight' | 'reminders'>('vaccinations');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('vaccinations');

  useEffect(() => {
    if (user) {
      const userPets = StorageService.getPetsByOwnerId(user.id);
      setPets(userPets);
      if (userPets.length > 0 && !selectedPetId) {
        setSelectedPetId(userPets[0].id);
      }
    }
  }, [user]);

  useEffect(() => {
    if (selectedPetId) {
      const hp = StorageService.getHealthPassportByPetId(selectedPetId);
      setPassport(hp || null);
    }
  }, [selectedPetId]);

  const selectedPet = pets.find(p => p.id === selectedPetId);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const isDueSoon = (dateStr: string, days: number = 7) => {
    const dueDate = new Date(dateStr);
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-3">
            <FileText className="text-primary" />
            Pet Health Passport
          </h1>
          <p className="text-gray-600 mt-1">Track vaccinations, checkups, and health records</p>
        </div>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center">
          <PawPrint size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-secondary mb-2">No Pets Yet</h3>
          <p className="text-gray-500 mb-4">Add your first pet to start tracking health records</p>
          <Link to="/dashboard/pets" className="text-primary font-medium hover:underline">
            Go to My Pets
          </Link>
        </div>
      ) : (
        <>
          {/* Pet Selector */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Pet</label>
            <div className="flex flex-wrap gap-3">
              {pets.map(pet => (
                <button
                  key={pet.id}
                  onClick={() => setSelectedPetId(pet.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 transition-all ${
                    selectedPetId === pet.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <img
                    src={pet.photoUrl || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100'}
                    alt={pet.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="text-left">
                    <p className="font-medium text-secondary">{pet.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{pet.type}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Health Records */}
          {selectedPet && (
            <div className="space-y-4">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Syringe size={20} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{passport?.vaccinations.length || 0}</p>
                      <p className="text-xs text-gray-500">Vaccinations</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Stethoscope size={20} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{passport?.checkups.length || 0}</p>
                      <p className="text-xs text-gray-500">Checkups</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Weight size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">
                        {passport?.weightHistory.length ? `${passport.weightHistory[passport.weightHistory.length - 1].weight} kg` : '-'}
                      </p>
                      <p className="text-xs text-gray-500">Current Weight</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Bell size={20} className="text-orange-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">
                        {passport?.reminders.filter(r => !r.isCompleted).length || 0}
                      </p>
                      <p className="text-xs text-gray-500">Pending Reminders</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vaccinations Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'vaccinations' ? null : 'vaccinations')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Syringe className="text-green-600" size={24} />
                    <span className="font-semibold text-secondary">Vaccinations</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {passport?.vaccinations.length || 0} records
                    </span>
                  </div>
                  {expandedSection === 'vaccinations' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === 'vaccinations' && (
                  <div className="border-t p-4">
                    {passport?.vaccinations.length ? (
                      <div className="space-y-3">
                        {passport.vaccinations.map(vac => (
                          <div key={vac.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-secondary">{vac.name}</p>
                              <p className="text-sm text-gray-500">
                                Given: {formatDate(vac.date)}
                                {vac.administeredBy && ` by ${vac.administeredBy}`}
                              </p>
                            </div>
                            {vac.nextDueDate && (
                              <div className={`text-right ${
                                isOverdue(vac.nextDueDate) ? 'text-red-600' :
                                isDueSoon(vac.nextDueDate) ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                <p className="text-xs">Next Due</p>
                                <p className="font-medium">{formatDate(vac.nextDueDate)}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No vaccination records yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Deworming Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'deworming' ? null : 'deworming')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="text-blue-600" size={24} />
                    <span className="font-semibold text-secondary">Deworming</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {passport?.dewormingRecords.length || 0} records
                    </span>
                  </div>
                  {expandedSection === 'deworming' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === 'deworming' && (
                  <div className="border-t p-4">
                    {passport?.dewormingRecords.length ? (
                      <div className="space-y-3">
                        {passport.dewormingRecords.map(rec => (
                          <div key={rec.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-secondary">{rec.medicineName}</p>
                              <p className="text-sm text-gray-500">
                                {formatDate(rec.date)} {rec.dosage && `• ${rec.dosage}`}
                              </p>
                            </div>
                            {rec.nextDueDate && (
                              <div className={`text-right ${
                                isOverdue(rec.nextDueDate) ? 'text-red-600' :
                                isDueSoon(rec.nextDueDate) ? 'text-orange-600' : 'text-green-600'
                              }`}>
                                <p className="text-xs">Next Due</p>
                                <p className="font-medium">{formatDate(rec.nextDueDate)}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No deworming records yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Checkups Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'checkups' ? null : 'checkups')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Stethoscope className="text-purple-600" size={24} />
                    <span className="font-semibold text-secondary">Health Checkups</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      {passport?.checkups.length || 0} visits
                    </span>
                  </div>
                  {expandedSection === 'checkups' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === 'checkups' && (
                  <div className="border-t p-4">
                    {passport?.checkups.length ? (
                      <div className="space-y-3">
                        {passport.checkups.map(chk => (
                          <div key={chk.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <p className="font-medium text-secondary">{formatDate(chk.date)}</p>
                              <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                                chk.reason === 'routine' ? 'bg-green-100 text-green-700' :
                                chk.reason === 'illness' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {chk.reason}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{chk.clinicName} - {chk.vetName}</p>
                            {chk.diagnosis && <p className="text-sm text-gray-500 mt-1">Diagnosis: {chk.diagnosis}</p>}
                            {chk.cost && <p className="text-sm text-primary font-medium mt-1">₹{chk.cost}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No checkup records yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Weight History Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'weight' ? null : 'weight')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="text-orange-600" size={24} />
                    <span className="font-semibold text-secondary">Weight History</span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                      {passport?.weightHistory.length || 0} entries
                    </span>
                  </div>
                  {expandedSection === 'weight' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === 'weight' && (
                  <div className="border-t p-4">
                    {passport?.weightHistory.length ? (
                      <div className="space-y-2">
                        {[...passport.weightHistory].reverse().map((wt, idx) => (
                          <div key={wt.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">{formatDate(wt.date)}</span>
                            <span className="font-bold text-secondary">{wt.weight} {wt.unit}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No weight records yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Reminders Section */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setExpandedSection(expandedSection === 'reminders' ? null : 'reminders')}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <Bell className="text-red-600" size={24} />
                    <span className="font-semibold text-secondary">Reminders</span>
                    {passport?.reminders.filter(r => !r.isCompleted).length ? (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
                        {passport.reminders.filter(r => !r.isCompleted).length} pending
                      </span>
                    ) : null}
                  </div>
                  {expandedSection === 'reminders' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {expandedSection === 'reminders' && (
                  <div className="border-t p-4">
                    {passport?.reminders.length ? (
                      <div className="space-y-3">
                        {passport.reminders.filter(r => !r.isCompleted).map(rem => (
                          <div key={rem.id} className={`flex items-center justify-between p-3 rounded-lg ${
                            isOverdue(rem.dueDate) ? 'bg-red-50 border border-red-200' :
                            isDueSoon(rem.dueDate) ? 'bg-orange-50 border border-orange-200' :
                            'bg-gray-50'
                          }`}>
                            <div>
                              <p className="font-medium text-secondary">{rem.title}</p>
                              <p className="text-sm text-gray-500 capitalize">{rem.type}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${
                                isOverdue(rem.dueDate) ? 'text-red-600' :
                                isDueSoon(rem.dueDate) ? 'text-orange-600' : 'text-gray-600'
                              }`}>
                                {formatDate(rem.dueDate)}
                              </p>
                              <button
                                onClick={() => {
                                  StorageService.completeReminder(selectedPetId, rem.id);
                                  setPassport(StorageService.getHealthPassportByPetId(selectedPetId) || null);
                                  addToast('Reminder marked as complete!', 'success');
                                }}
                                className="text-xs text-primary hover:underline"
                              >
                                Mark Complete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No pending reminders</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ==================== INSURANCE PAGE ====================

const InsurancePage: React.FC = () => {
  const { user } = useAuth();
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider | null>(null);
  const [userInsurances, setUserInsurances] = useState<PetInsurance[]>([]);

  useEffect(() => {
    setProviders(StorageService.getInsuranceProviders());
    if (user) {
      setUserInsurances(StorageService.getInsurancesByOwnerId(user.id));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-3">
          <Shield className="text-primary" />
          Pet Insurance
        </h1>
        <p className="text-gray-600 mt-1">Protect your furry friends with comprehensive coverage</p>
      </div>

      {/* Active Policies */}
      {userInsurances.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-secondary mb-4">Your Active Policies</h2>
          <div className="space-y-3">
            {userInsurances.filter(i => i.isActive).map(ins => (
              <div key={ins.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div>
                  <p className="font-medium text-secondary">{ins.providerName}</p>
                  <p className="text-sm text-gray-500">Policy: {ins.policyNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Coverage</p>
                  <p className="font-bold text-green-600">₹{ins.coverageAmount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insurance Providers */}
      <div className="space-y-4">
        <h2 className="font-semibold text-secondary">Available Insurance Plans</h2>
        {providers.map(provider => (
          <div key={provider.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Shield size={32} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-secondary">{provider.name}</h3>
                    <p className="text-sm text-gray-500">{provider.description}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium">{provider.rating}</span>
                      <span className="text-sm text-gray-400">({provider.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Plans */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {provider.plans.map(plan => (
                  <div key={plan.id} className={`border-2 rounded-xl p-4 ${
                    plan.type === 'premium' ? 'border-primary bg-primary/5' :
                    plan.type === 'comprehensive' ? 'border-yellow-400 bg-yellow-50' :
                    'border-gray-200'
                  }`}>
                    {plan.type === 'premium' && (
                      <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">Popular</span>
                    )}
                    {plan.type === 'comprehensive' && (
                      <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">Best Value</span>
                    )}
                    <h4 className="font-bold text-secondary mt-2">{plan.name}</h4>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-primary">₹{plan.monthlyPremium}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      or ₹{plan.annualPremium}/year (save ₹{plan.monthlyPremium * 12 - plan.annualPremium})
                    </p>
                    <div className="my-4 py-3 border-t border-b">
                      <p className="text-sm text-gray-600">Coverage up to</p>
                      <p className="text-xl font-bold text-secondary">₹{plan.coverageAmount.toLocaleString()}</p>
                      {plan.deductible > 0 && (
                        <p className="text-xs text-gray-500">Deductible: ₹{plan.deductible}</p>
                      )}
                    </div>
                    <ul className="space-y-2 text-sm">
                      {plan.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-500" />
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="w-full mt-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors">
                      Get Quote
                    </button>
                  </div>
                ))}
              </div>

              {/* Contact */}
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t">
                <a href={`tel:${provider.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <Phone size={16} />
                  {provider.phone}
                </a>
                <a href={`mailto:${provider.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <Mail size={16} />
                  {provider.email}
                </a>
                <a href={provider.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
                  <ExternalLink size={16} />
                  Visit Website
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why Insurance */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6">
        <h2 className="font-bold text-secondary mb-4">Why Pet Insurance?</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: 'Financial Protection', desc: 'Cover unexpected vet bills up to ₹5 lakhs' },
            { icon: Heart, title: 'Peace of Mind', desc: 'Focus on your pet\'s health, not the cost' },
            { icon: Zap, title: 'Quick Claims', desc: 'Get reimbursements within 7 working days' }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <item.icon className="text-primary mb-2" size={24} />
              <h3 className="font-semibold text-secondary">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==================== NGO DIRECTORY PAGE ====================

const NGODirectoryPage: React.FC = () => {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [filteredNgos, setFilteredNgos] = useState<NGO[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);

  useEffect(() => {
    const allNgos = StorageService.getNGOs();
    setNgos(allNgos);
    setFilteredNgos(allNgos);
  }, []);

  useEffect(() => {
    let filtered = ngos;

    if (searchQuery) {
      filtered = filtered.filter(n =>
        n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCity) {
      filtered = filtered.filter(n => n.city === selectedCity);
    }

    if (selectedType) {
      filtered = filtered.filter(n => n.type === selectedType);
    }

    setFilteredNgos(filtered);
  }, [searchQuery, selectedCity, selectedType, ngos]);

  const cities = [...new Set(ngos.map(n => n.city))].sort();
  const types = [...new Set(ngos.map(n => n.type))].sort();

  const serviceLabels: Record<NGOService, string> = {
    rescue: 'Rescue',
    shelter: 'Shelter',
    adoption: 'Adoption',
    medical: 'Medical Care',
    vaccination: 'Vaccination',
    sterilization: 'Sterilization',
    foster: 'Foster Care',
    burial: 'Burial',
    ambulance: 'Ambulance',
    'lost-found': 'Lost & Found',
    training: 'Training',
    grooming: 'Grooming'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-secondary flex items-center gap-3">
          <Building2 className="text-primary" />
          NGO & Shelter Directory
        </h1>
        <p className="text-gray-600 mt-1">Find verified animal welfare organizations near you</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type} value={type} className="capitalize">{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredNgos.map(ngo => (
          <div key={ngo.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {ngo.logo ? (
                    <img src={ngo.logo} alt={ngo.name} className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <Building2 size={28} className="text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-secondary">{ngo.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{ngo.type}</p>
                    </div>
                    {ngo.isVerified && (
                      <BadgeCheck className="text-blue-500 flex-shrink-0" size={20} />
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{ngo.rating}</span>
                    <span className="text-xs text-gray-400">({ngo.reviewCount})</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{ngo.description}</p>

              <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                <MapPin size={14} />
                <span>{ngo.address}, {ngo.city}</span>
              </div>

              {/* Services */}
              <div className="flex flex-wrap gap-1 mt-3">
                {ngo.services.slice(0, 4).map(service => (
                  <span key={service} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {serviceLabels[service]}
                  </span>
                ))}
                {ngo.services.length > 4 && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    +{ngo.services.length - 4} more
                  </span>
                )}
              </div>

              {/* Stats */}
              {(ngo.petsRescued || ngo.petsAdopted) && (
                <div className="flex gap-4 mt-4 pt-4 border-t">
                  {ngo.petsRescued && (
                    <div>
                      <p className="text-lg font-bold text-primary">{ngo.petsRescued.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Pets Rescued</p>
                    </div>
                  )}
                  {ngo.petsAdopted && (
                    <div>
                      <p className="text-lg font-bold text-green-600">{ngo.petsAdopted.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Pets Adopted</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-4">
                <a
                  href={`tel:${ngo.phone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                >
                  <Phone size={16} />
                  Call
                </a>
                {ngo.whatsapp && (
                  <a
                    href={`https://wa.me/${ngo.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </a>
                )}
                {ngo.website && (
                  <a
                    href={ngo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNgos.length === 0 && (
        <div className="bg-white rounded-xl p-8 text-center">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="font-semibold text-secondary mb-2">No Organizations Found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Emergency Contact */}
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <h2 className="font-bold text-red-800 mb-2">Emergency Animal Rescue</h2>
        <p className="text-sm text-red-600 mb-4">
          If you find an injured or distressed animal, contact these 24/7 helplines:
        </p>
        <div className="flex flex-wrap gap-4">
          <a href="tel:+919820011110" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-red-600 font-medium">
            <Phone size={16} />
            PETA India: 9820011110
          </a>
          <a href="tel:+9811994499" className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg text-red-600 font-medium">
            <Phone size={16} />
            People For Animals: 9811994499
          </a>
        </div>
      </div>
    </div>
  );
};

// ==================== PUBLIC PET PROFILE (FINDER VIEW) ====================

const PublicPetProfile: React.FC = () => {
  const { tagCode } = useParams<{ tagCode: string }>();
  const { addToast } = useApp();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [tag, setTag] = useState<TagType | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);
  const [finderInfo, setFinderInfo] = useState({ name: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (tagCode) {
      const tagData = StorageService.getTagByCode(tagCode);
      if (tagData && tagData.petId) {
        setTag(tagData);
        const petData = StorageService.getPetById(tagData.petId);
        if (petData) {
          setPet(petData);
          const ownerData = StorageService.getUserById(petData.ownerId);
          setOwner(ownerData || null);

          // Try to get location
          GeolocationService.getLocationWithAddress()
            .then(loc => {
              setLocation(loc);
              setLocationLoading(false);

              // Create scan event
              const scan = StorageService.createScan({
                tagId: tagData.id,
                petId: petData.id,
                location: loc,
                locationPermissionGranted: true,
                userAgent: navigator.userAgent,
                notificationsSent: []
              });

              // Send notifications
              if (ownerData) {
                NotificationService.notifyOwnerOfScan(petData, ownerData, scan);
              }
            })
            .catch(() => {
              setLocationLoading(false);

              // Create scan without location
              const scan = StorageService.createScan({
                tagId: tagData.id,
                petId: petData.id,
                locationPermissionGranted: false,
                userAgent: navigator.userAgent,
                notificationsSent: []
              });

              if (ownerData) {
                NotificationService.notifyOwnerOfScan(petData, ownerData, scan);
              }
            });
        }
      }
    }
  }, [tagCode]);

  const handleSubmitFinderInfo = () => {
    if (!pet || !owner || !tag) return;

    const scan = StorageService.createScan({
      tagId: tag.id,
      petId: pet.id,
      finderName: finderInfo.name,
      finderPhone: finderInfo.phone,
      finderMessage: finderInfo.message,
      location: location || undefined,
      locationPermissionGranted: !!location,
      userAgent: navigator.userAgent,
      notificationsSent: []
    });

    NotificationService.notifyOwnerOfScan(pet, owner, scan);
    setSubmitted(true);
    addToast('Owner has been notified!', 'success');
  };

  if (!pet || !owner) {
    return (
      <div className="min-h-screen bg-paw-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <AlertTriangle size={64} className="mx-auto text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-secondary mb-2">Tag Not Found</h1>
          <p className="text-gray-600">
            This tag hasn't been registered yet or the code is invalid.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 text-primary font-medium hover:underline"
          >
            Learn more about PawTag
          </Link>
        </div>
      </div>
    );
  }

  const primaryContact = pet.emergencyContacts.find(c => c.isPrimary) || pet.emergencyContacts[0];

  return (
    <div className="min-h-screen bg-paw-cream">
      {/* Header */}
      <div className={`${pet.isLost ? 'bg-red-500' : 'gradient-bg'} text-white py-6 px-4`}>
        <div className="max-w-lg mx-auto text-center">
          <PawPrint size={40} className="mx-auto mb-2" />
          <h1 className="text-xl font-bold">
            {pet.isLost ? 'LOST PET - PLEASE HELP!' : "You found someone's pet!"}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {pet.isLost
              ? 'The owner is looking for this pet. Please contact immediately!'
              : 'Thank you for scanning this tag'
            }
          </p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-6">
        {/* Pet Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="relative">
            <img
              src={pet.photoUrl || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600`}
              alt={pet.name}
              className="w-full aspect-square object-cover"
            />
            {pet.isLost && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold animate-pulse">
                LOST
              </div>
            )}
          </div>

          <div className="p-6">
            <h2 className="text-3xl font-bold text-secondary mb-1">{pet.name}</h2>
            <p className="text-gray-600">{pet.breed} • {pet.type}</p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Gender</p>
                <p className="font-medium capitalize">{pet.gender}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Size</p>
                <p className="font-medium capitalize">{pet.size}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500">Color</p>
                <p className="font-medium">{pet.color}</p>
              </div>
            </div>

            {pet.personality && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>About {pet.name}:</strong> {pet.personality}
                </p>
              </div>
            )}

            {pet.specialNeeds && (
              <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Special Needs:</strong> {pet.specialNeeds}
                </p>
              </div>
            )}

            {pet.isLost && pet.rewardAmount && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 rounded-lg text-center">
                <p className="text-green-800 font-bold text-lg">
                  REWARD: ₹{pet.rewardAmount.toLocaleString('en-IN')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="mt-6 space-y-3">
          {primaryContact && (
            <>
              <a
                href={`tel:${primaryContact.phone}`}
                className="flex items-center justify-center gap-3 w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary-hover transition-colors"
              >
                <Phone size={24} />
                Call {primaryContact.name}
              </a>

              <a
                href={NotificationService.getWhatsAppLink(
                  primaryContact.phone,
                  `Hi! I found your pet ${pet.name}. ${location ? `Location: ${location.address || `${location.latitude}, ${location.longitude}`}` : ''}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-green-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={24} />
                WhatsApp {primaryContact.name}
              </a>
            </>
          )}

          {!submitted ? (
            <button
              onClick={() => setShowContactForm(!showContactForm)}
              className="flex items-center justify-center gap-3 w-full bg-secondary text-white py-4 rounded-xl font-semibold text-lg hover:bg-secondary-light transition-colors"
            >
              <Mail size={24} />
              Leave Your Info
            </button>
          ) : (
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
              <p className="text-green-800 font-medium">Owner has been notified!</p>
              <p className="text-green-600 text-sm">They will contact you soon.</p>
            </div>
          )}
        </div>

        {/* Contact Form */}
        {showContactForm && !submitted && (
          <div className="mt-4 bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-secondary mb-4">Your Contact Info</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={finderInfo.name}
                onChange={(e) => setFinderInfo({...finderInfo, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <input
                type="tel"
                placeholder="Your Phone Number"
                value={finderInfo.phone}
                onChange={(e) => setFinderInfo({...finderInfo, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
              />
              <textarea
                placeholder="Message for the owner (optional)"
                value={finderInfo.message}
                onChange={(e) => setFinderInfo({...finderInfo, message: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                rows={3}
              />
              <button
                onClick={handleSubmitFinderInfo}
                disabled={!finderInfo.name || !finderInfo.phone}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send to Owner
              </button>
            </div>
          </div>
        )}

        {/* Location Info */}
        {location && (
          <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Your Location</p>
                <p className="font-medium text-secondary">{location.address || location.city || 'Location captured'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pb-8 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <PawPrint size={20} />
            <span className="text-sm">Powered by PawTag India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [language, setLanguage] = useState<Language>(LanguageService.getCurrentLanguage());

  useEffect(() => {
    const currentUser = StorageService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = StorageService.getUserByEmail(email);
    if (foundUser && foundUser.password === password) {
      StorageService.setCurrentUser(foundUser.id);
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (data: RegisterFormData): boolean => {
    const existingUser = StorageService.getUserByEmail(data.email);
    if (existingUser) return false;

    const newUser = StorageService.createUser({
      email: data.email,
      phone: data.phone,
      password: data.password,
      name: data.name,
      preferredLanguage: data.preferredLanguage,
      notificationPreferences: {
        sms: true,
        email: true,
        whatsapp: true,
        push: true
      }
    });

    StorageService.setCurrentUser(newUser.id);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    StorageService.clearCurrentUser();
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      StorageService.saveUser(updatedUser);
      setUser(updatedUser);
    }
  };

  const addToast = (message: string, type: Toast['type']) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleSetLanguage = (lang: Language) => {
    LanguageService.setLanguage(lang);
    setLanguage(lang);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, updateUser }}>
      <AppContext.Provider value={{ language, setLanguage: handleSetLanguage, toasts, addToast, removeToast }}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pet/:tagCode" element={<PublicPetProfile />} />

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <DashboardLayout>
                <DashboardHome />
              </DashboardLayout>
            } />
            <Route path="/dashboard/pets" element={
              <DashboardLayout>
                <MyPetsPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/pets/:petId" element={
              <DashboardLayout>
                <PetDetailPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/scans" element={
              <DashboardLayout>
                <ScanHistoryPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/settings" element={
              <DashboardLayout>
                <SettingsPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/health" element={
              <DashboardLayout>
                <HealthPassportPage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/insurance" element={
              <DashboardLayout>
                <InsurancePage />
              </DashboardLayout>
            } />
            <Route path="/dashboard/ngos" element={
              <DashboardLayout>
                <NGODirectoryPage />
              </DashboardLayout>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </AppContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
