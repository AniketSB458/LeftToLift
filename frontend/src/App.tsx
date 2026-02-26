import React, { createContext, useContext, useState } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Pages
import Home from './pages/Home';
import DonateFood from './pages/DonateFood';
import NgoDashboard from './pages/NgoDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import ImpactDashboard from './pages/ImpactDashboard';
import AdminAnalytics from './pages/AdminAnalytics';
import LoginLanding from './pages/LoginLanding';
import HotelLogin from './pages/HotelLogin';
import NgoLogin from './pages/NgoLogin';
import VolunteerLogin from './pages/VolunteerLogin';
import AdminLogin from './pages/AdminLogin';
import HotelDashboard from './pages/HotelDashboard';

// Components
import RoleGuard from './components/RoleGuard';
import { useRoleBasedAccess } from './hooks/useRoleBasedAccess';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Building2, Heart, Users, ShieldCheck, Home as HomeIcon, BarChart2, Menu, X, LogOut, AlertTriangle } from 'lucide-react';
import { useGetCallerUserProfile } from './hooks/useQueries';

// ─── Language Context ────────────────────────────────────────────────────────
type Language = 'en' | 'mr' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.home': 'Home',
    'nav.donate': 'Donate Food',
    'nav.ngo': 'NGO Dashboard',
    'nav.volunteer': 'Volunteer',
    'nav.impact': 'Impact',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.brand': 'Left2Lift',
    donate: 'Donate Food',
    volunteer: 'Volunteer',
    ngo: 'NGO Dashboard',
    impact: 'Impact',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    home: 'Home',
    'ngo.title': 'NGO Dashboard',
    'ngo.pending': 'Pending Donations',
    'ngo.all': 'All Donations',
    'volunteer.title': 'Volunteer Dashboard',
    'volunteer.available': 'Available Pickups',
    'volunteer.claim': 'Claim Pickup',
    'donate.title': 'Donate Food',
    'donate.subtitle': 'Help reduce food waste in Maharashtra',
    'donate.foodType': 'Food Type',
    'donate.quantity': 'Quantity',
    'donate.unit': 'Unit',
    'donate.cookTime': 'Cook Time',
    'donate.storage': 'Storage Condition',
    'donate.city': 'City',
    'donate.neighborhood': 'Neighborhood',
    'donate.submit': 'Submit Donation',
    'donate.voice': 'Voice Input',
    'emergency.activate': 'Activate Emergency Mode',
    'emergency.deactivate': 'Deactivate Emergency Mode',
    'emergency.banner': '🚨 HUNGER EMERGENCY MODE ACTIVE — All volunteers notified. Priority override enabled.',
  },
  mr: {
    'nav.home': 'मुख्यपृष्ठ',
    'nav.donate': 'अन्न दान करा',
    'nav.ngo': 'NGO डॅशबोर्ड',
    'nav.volunteer': 'स्वयंसेवक',
    'nav.impact': 'प्रभाव',
    'nav.admin': 'प्रशासक',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.brand': 'Left2Lift',
    donate: 'अन्न दान करा',
    volunteer: 'स्वयंसेवक',
    ngo: 'NGO डॅशबोर्ड',
    impact: 'प्रभाव',
    admin: 'प्रशासक',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    home: 'मुख्यपृष्ठ',
    'ngo.title': 'NGO डॅशबोर्ड',
    'ngo.pending': 'प्रलंबित दान',
    'ngo.all': 'सर्व दान',
    'volunteer.title': 'स्वयंसेवक डॅशबोर्ड',
    'volunteer.available': 'उपलब्ध पिकअप',
    'volunteer.claim': 'पिकअप क्लेम करा',
    'donate.title': 'अन्न दान करा',
    'donate.subtitle': 'महाराष्ट्रात अन्न बर्बादी कमी करण्यास मदत करा',
    'donate.foodType': 'अन्नाचा प्रकार',
    'donate.quantity': 'प्रमाण',
    'donate.unit': 'एकक',
    'donate.cookTime': 'शिजवण्याची वेळ',
    'donate.storage': 'साठवण स्थिती',
    'donate.city': 'शहर',
    'donate.neighborhood': 'परिसर',
    'donate.submit': 'दान सादर करा',
    'donate.voice': 'आवाज इनपुट',
    'emergency.activate': 'आपत्कालीन मोड सक्रिय करा',
    'emergency.deactivate': 'आपत्कालीन मोड निष्क्रिय करा',
    'emergency.banner': '🚨 भूक आपत्कालीन मोड सक्रिय — सर्व स्वयंसेवकांना सूचित केले.',
  },
  hi: {
    'nav.home': 'होम',
    'nav.donate': 'भोजन दान करें',
    'nav.ngo': 'NGO डैशबोर्ड',
    'nav.volunteer': 'स्वयंसेवक',
    'nav.impact': 'प्रभाव',
    'nav.admin': 'एडमिन',
    'nav.login': 'लॉगिन',
    'nav.logout': 'लॉगआउट',
    'nav.brand': 'Left2Lift',
    donate: 'भोजन दान करें',
    volunteer: 'स्वयंसेवक',
    ngo: 'NGO डैशबोर्ड',
    impact: 'प्रभाव',
    admin: 'व्यवस्थापक',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    home: 'होम',
    'ngo.title': 'NGO डैशबोर्ड',
    'ngo.pending': 'लंबित दान',
    'ngo.all': 'सभी दान',
    'volunteer.title': 'स्वयंसेवक डैशबोर्ड',
    'volunteer.available': 'उपलब्ध पिकअप',
    'volunteer.claim': 'पिकअप क्लेम करें',
    'donate.title': 'भोजन दान करें',
    'donate.subtitle': 'महाराष्ट्र में खाद्य बर्बादी कम करने में मदद करें',
    'donate.foodType': 'भोजन का प्रकार',
    'donate.quantity': 'मात्रा',
    'donate.unit': 'इकाई',
    'donate.cookTime': 'पकाने का समय',
    'donate.storage': 'भंडारण स्थिति',
    'donate.city': 'शहर',
    'donate.neighborhood': 'पड़ोस',
    'donate.submit': 'दान जमा करें',
    'donate.voice': 'आवाज़ इनपुट',
    'emergency.activate': 'आपातकाल मोड सक्रिय करें',
    'emergency.deactivate': 'आपातकाल मोड निष्क्रिय करें',
    'emergency.banner': '🚨 भूख आपातकाल मोड सक्रिय — सभी स्वयंसेवकों को सूचित किया गया।',
  },
};

export const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

// ─── Emergency Mode Context ──────────────────────────────────────────────────
interface EmergencyModeContextType {
  emergencyMode: boolean;
  toggleEmergencyMode: () => void;
}

export const EmergencyModeContext = createContext<EmergencyModeContextType>({
  emergencyMode: false,
  toggleEmergencyMode: () => {},
});

export function useEmergencyMode() {
  return useContext(EmergencyModeContext);
}

// ─── Navigation Component ────────────────────────────────────────────────────
function Navigation() {
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { role } = useRoleBasedAccess();
  const { data: userProfile } = useGetCallerUserProfile();
  const { language, setLanguage, t } = useLanguage();
  const { emergencyMode, toggleEmergencyMode } = useEmergencyMode();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setMobileOpen(false);
  };

  // Build nav links based on role
  const navLinks: { label: string; to: string; icon: React.ElementType }[] = [];

  if (!isAuthenticated || role === 'guest') {
    navLinks.push({ label: t('home'), to: '/', icon: HomeIcon });
    navLinks.push({ label: t('impact'), to: '/impact', icon: BarChart2 });
  } else if (role === 'hotel') {
    navLinks.push({ label: 'Dashboard', to: '/hotel-dashboard', icon: Building2 });
    navLinks.push({ label: t('donate'), to: '/donate-food', icon: Heart });
    navLinks.push({ label: t('impact'), to: '/impact', icon: BarChart2 });
  } else if (role === 'ngo') {
    navLinks.push({ label: 'NGO Dashboard', to: '/ngo-dashboard', icon: Heart });
    navLinks.push({ label: t('impact'), to: '/impact', icon: BarChart2 });
  } else if (role === 'volunteer') {
    navLinks.push({ label: 'Volunteer Dashboard', to: '/volunteer-dashboard', icon: Users });
    navLinks.push({ label: t('impact'), to: '/impact', icon: BarChart2 });
  } else if (role === 'admin') {
    navLinks.push({ label: t('admin'), to: '/admin', icon: ShieldCheck });
    navLinks.push({ label: t('donate'), to: '/donate-food', icon: Heart });
    navLinks.push({ label: 'NGO', to: '/ngo-dashboard', icon: Heart });
    navLinks.push({ label: 'Volunteers', to: '/volunteer-dashboard', icon: Users });
    navLinks.push({ label: t('impact'), to: '/impact', icon: BarChart2 });
  }

  return (
    <nav className={`border-b border-border backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 ${emergencyMode ? 'bg-red-900/95' : 'bg-card/90'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand */}
        <a href="/" className="flex items-center gap-2.5 group">
          <img src="/assets/generated/logo-icon.dim_128x128.png" alt="Left2Lift" className="h-9 w-9 rounded-xl" />
          <span className="text-xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
            Left2Lift
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <a
              key={to}
              href={to}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="text-xs bg-transparent border border-border rounded-lg px-2 py-1.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="en">EN</option>
            <option value="mr">मर</option>
            <option value="hi">हि</option>
          </select>

          {/* Emergency Mode */}
          <button
            onClick={() => {
              toggleEmergencyMode();
              if (!emergencyMode) {
                toast.warning('🚨 Emergency mode activated – all volunteers notified!', { duration: 5000 });
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${emergencyMode ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
          >
            <AlertTriangle className="w-3 h-3 inline mr-1" />
            {emergencyMode ? 'Emergency ON' : 'Emergency'}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {userProfile && (
                <span className="text-sm text-muted-foreground font-medium">{userProfile.name}</span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t('login')}
            </a>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Emergency Banner */}
      {emergencyMode && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold animate-pulse">
          🚨 HUNGER EMERGENCY MODE ACTIVE — All volunteers notified. Priority override enabled.
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
          {navLinks.map(({ label, to, icon: Icon }) => (
            <a
              key={to}
              href={to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
          <div className="pt-2 border-t border-border">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <LogOut className="h-4 w-4" />
                {t('logout')}
              </button>
            ) : (
              <a
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {t('login')}
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Layout ──────────────────────────────────────────────────────────────────
function AppLayout() {
  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
const rootRoute = createRootRoute({ component: AppLayout });

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const donateFoodRoute = createRoute({ getParentRoute: () => rootRoute, path: '/donate-food', component: DonateFood });
// Keep legacy /donate route pointing to DonateFood as well
const donateLegacyRoute = createRoute({ getParentRoute: () => rootRoute, path: '/donate', component: DonateFood });

const ngoDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ngo-dashboard',
  component: () => (
    <RoleGuard allowedRoles={['ngo', 'admin']} redirectTo="/login/ngo">
      <NgoDashboard />
    </RoleGuard>
  ),
});
// Legacy /ngo route
const ngoLegacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ngo',
  component: () => (
    <RoleGuard allowedRoles={['ngo', 'admin']} redirectTo="/login/ngo">
      <NgoDashboard />
    </RoleGuard>
  ),
});

const volunteerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/volunteer-dashboard',
  component: () => (
    <RoleGuard allowedRoles={['volunteer', 'admin']} redirectTo="/login/volunteer">
      <VolunteerDashboard />
    </RoleGuard>
  ),
});
// Legacy /volunteer route
const volunteerLegacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/volunteer',
  component: () => (
    <RoleGuard allowedRoles={['volunteer', 'admin']} redirectTo="/login/volunteer">
      <VolunteerDashboard />
    </RoleGuard>
  ),
});

const impactRoute = createRoute({ getParentRoute: () => rootRoute, path: '/impact', component: ImpactDashboard });

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RoleGuard allowedRoles={['admin']} redirectTo="/login/admin">
      <AdminAnalytics />
    </RoleGuard>
  ),
});

const hotelDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hotel-dashboard',
  component: () => (
    <RoleGuard allowedRoles={['hotel', 'admin']} redirectTo="/login/hotel">
      <HotelDashboard />
    </RoleGuard>
  ),
});

// Login routes
const loginLandingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login', component: LoginLanding });
const loginHotelRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login/hotel', component: HotelLogin });
const loginNgoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login/ngo', component: NgoLogin });
const loginVolunteerRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login/volunteer', component: VolunteerLogin });
const loginAdminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/login/admin', component: AdminLogin });

const routeTree = rootRoute.addChildren([
  homeRoute,
  donateFoodRoute,
  donateLegacyRoute,
  ngoDashboardRoute,
  ngoLegacyRoute,
  volunteerDashboardRoute,
  volunteerLegacyRoute,
  impactRoute,
  adminRoute,
  hotelDashboardRoute,
  loginLandingRoute,
  loginHotelRoute,
  loginNgoRoute,
  loginVolunteerRoute,
  loginAdminRoute,
]);

const router = createRouter({ routeTree });

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1 },
  },
});

// ─── Providers ────────────────────────────────────────────────────────────────
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const t = (key: string) => translations[language][key] ?? key;
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

function EmergencyModeProvider({ children }: { children: React.ReactNode }) {
  const [emergencyMode, setEmergencyMode] = useState(false);
  const toggleEmergencyMode = () => setEmergencyMode(prev => !prev);
  return (
    <EmergencyModeContext.Provider value={{ emergencyMode, toggleEmergencyMode }}>
      {children}
    </EmergencyModeContext.Provider>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <EmergencyModeProvider>
            <RouterProvider router={router} />
            <Toaster />
          </EmergencyModeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
