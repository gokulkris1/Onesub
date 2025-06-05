

import React, { useState, useEffect, Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthForm from './components/AuthForm';
import CookieBanner from './components/CookieBanner';
import ToastContainer from './components/ToastContainer'; // Import ToastContainer
import { useAuth } from './contexts/AuthContext';
import { Bundle, Route } from './types';
import { useNotification } from './contexts/NotificationContext'; // Import useNotification

const COOKIE_CONSENT_KEY = 'onesub_cookie_consent';

// Lazy load page components, explicitly requesting .js files using absolute paths
const HomePage = lazy(() => import('/pages/HomePage.js'));
const CheckoutPage = lazy(() => import('/pages/CheckoutPage.js'));
const AccountPage = lazy(() => import('/pages/AccountPage.js'));
const AdminDashboardPage = lazy(() => import('/pages/AdminDashboardPage.js'));
const ProviderDashboardPage = lazy(() => import('/pages/ProviderDashboardPage.js'));
const TermsPage = lazy(() => import('/pages/TermsPage.js'));
const PrivacyPolicyPage = lazy(() => import('/pages/PrivacyPolicyPage.js'));
const ContactPage = lazy(() => import('/pages/ContactPage.js'));
const NotFoundPage = lazy(() => import('/pages/NotFoundPage.js'));
const EditProfilePage = lazy(() => import('/pages/EditProfilePage.js'));
const ForgotPasswordPage = lazy(() => import('/pages/ForgotPasswordPage.js'));
const ResetPasswordPage = lazy(() => import('/pages/ResetPasswordPage.js'));
const PaymentSuccessPage = lazy(() => import('/pages/PaymentSuccessPage.js'));
const PaymentFailurePage = lazy(() => import('/pages/PaymentFailurePage.js'));
const PerksLockerPage = lazy(() => import('/pages/PerksLockerPage.js')); // Added PerksLockerPage


const PageLoadingSpinner: React.FC = () => (
    <div className="flex-grow flex items-center justify-center py-20">
        <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const App = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState<Route>('home');
  const [selectedBundleForCheckout, setSelectedBundleForCheckout] = useState<Bundle | null>(null);
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true);
  const [showCookieBanner, setShowCookieBanner] = useState<boolean>(false);
  const [lastPaymentError, setLastPaymentError] = useState<string | null>(null);
  
  const { currentUser, isLoading: authContextIsLoading, error: authError, login, signup, subscribeToBundle, completeMockVerification, checkAndRefreshPerks } = useAuth();
  const { addToast } = useNotification(); // Destructure addToast here

  useEffect(() => {
    const consentGiven = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (consentGiven !== 'true') {
      setShowCookieBanner(true);
    }
  }, []);

  const handleAcceptCookies = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setShowCookieBanner(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppIsLoading(authContextIsLoading);
    }, 300); 
    return () => clearTimeout(timer);
  }, [authContextIsLoading]);

  const clearLastPaymentError = () => {
    setLastPaymentError(null);
  };


  // Dynamic SEO Updates
  useEffect(() => {
    let title = "OneSub - Smart Subscription Bundles";
    let description = "Discover curated subscription bundles designed to save you money with OneSub. Save more, enjoy more.";

    const pageSpecifics: Partial<Record<Route, {title: string, description: string}>> = {
        'home': { title: "OneSub | Home - Your Subscription Hub", description: "Explore amazing subscription bundles on OneSub and save money today!" },
        'checkout': { title: "Checkout | OneSub", description: `Complete your subscription to ${selectedBundleForCheckout?.name || 'your selected bundle'} on OneSub.` },
        'account': { title: "My Account | OneSub", description: "Manage your OneSub subscriptions, profile, and billing details." },
        'admin-dashboard': { title: "Admin Dashboard | OneSub", description: "Manage users, providers, and platform settings on OneSub." },
        'provider-dashboard': { title: "Provider Dashboard | OneSub", description: "View your service performance and manage offerings on OneSub." },
        'terms': { title: "Terms & Conditions | OneSub", description: "Read the terms and conditions for using the OneSub platform." },
        'privacy': { title: "Privacy Policy | OneSub", description: "Learn about how OneSub handles your personal data and privacy." },
        'contact': { title: "Contact Us | OneSub", description: "Get in touch with the OneSub support team for assistance." },
        'edit-profile': { title: "Edit Profile | OneSub", description: "Update your personal information and password on OneSub." },
        'forgot-password': { title: "Forgot Password | OneSub", description: "Reset your OneSub account password." },
        'reset-password': { title: "Reset Password | OneSub", description: "Complete your OneSub password reset process." },
        'payment-success': { title: "Payment Successful | OneSub", description: "Your payment was successful. Thank you for subscribing with OneSub!" },
        'payment-failure': { title: "Payment Failed | OneSub", description: "There was an issue with your payment. Please try again or contact support." },
        'perks-locker': { title: "Perks Locker | OneSub", description: "Discover and claim exclusive perks from our partners on OneSub." },
    };

    if (pageSpecifics[currentPage]) {
        title = pageSpecifics[currentPage]!.title;
        description = pageSpecifics[currentPage]!.description;
    }
    if (currentPage === 'checkout' && selectedBundleForCheckout) {
        description = `Finalize your subscription to the ${selectedBundleForCheckout.name} bundle on OneSub.`;
    }


    document.title = title;
    const metaDescriptionTag = document.querySelector('meta[name="description"]');
    if (metaDescriptionTag) metaDescriptionTag.setAttribute('content', description);
    
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) ogTitleTag.setAttribute('content', title);
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    if (ogDescriptionTag) ogDescriptionTag.setAttribute('content', description);

    const twitterTitleTag = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitleTag) twitterTitleTag.setAttribute('content', title);
    const twitterDescriptionTag = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescriptionTag) twitterDescriptionTag.setAttribute('content', description);

  }, [currentPage, selectedBundleForCheckout, currentUser]);


  useEffect(() => {
    const protectedRoutes: Route[] = ['checkout', 'account', 'admin-dashboard', 'provider-dashboard', 'edit-profile', 'perks-locker'];
    if (!authContextIsLoading && !currentUser && protectedRoutes.includes(currentPage)) {
      setCurrentPage('home');
      setSelectedBundleForCheckout(null);
    } else if (currentUser) {
      if (currentPage === 'admin-dashboard' && currentUser.role !== 'admin') {
        navigateToDefaultPage(currentUser.role);
      } else if (currentPage === 'provider-dashboard' && currentUser.role !== 'provider') {
        navigateToDefaultPage(currentUser.role);
      } else if ((currentPage === 'account' || currentPage === 'edit-profile' || currentPage === 'perks-locker') && currentUser.role !== 'user') {
         navigateToDefaultPage(currentUser.role);
      }
    }
  }, [currentUser, currentPage, authContextIsLoading]);
  
  const navigateToDefaultPage = (role: 'user' | 'admin' | 'provider' | 'guest') => {
    switch (role) {
        case 'admin': setCurrentPage('admin-dashboard'); break;
        case 'provider': setCurrentPage('provider-dashboard'); break;
        case 'user': setCurrentPage('account'); break;
        default: setCurrentPage('home'); break;
    }
  }

  const navigateTo = (page: Route) => {
    const authRequiredRoutes: Route[] = ['checkout', 'account', 'admin-dashboard', 'provider-dashboard', 'edit-profile', 'perks-locker'];
    // const publicRoutes: Route[] = ['home', 'terms', 'privacy', 'contact', 'forgot-password', 'reset-password', 'payment-success', 'payment-failure'];


    if (!currentUser && authRequiredRoutes.includes(page)) {
        handleOpenAuthModal('login');
        return;
    }
    
    if (currentUser) {
        if (page === 'admin-dashboard' && currentUser.role !== 'admin') {
            navigateToDefaultPage(currentUser.role);
            return;
        }
        if (page === 'provider-dashboard' && currentUser.role !== 'provider') {
            navigateToDefaultPage(currentUser.role);
            return;
        }
        if ((page === 'account' || page === 'edit-profile' || page === 'perks-locker') && currentUser.role !== 'user' ) {
             navigateToDefaultPage(currentUser.role);
             return;
        }
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleOpenAuthModal = (type: 'login' | 'signup', targetRoute?: Route) => {
    setAuthModalType(type);
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleSubmitAuthForm = async (authDetails: { email: string; password: string; isProviderLogin?: boolean }) => {
    try {
      if (authModalType === 'login') {
        await login(authDetails.email, authDetails.password);
         // Login in AuthContext now handles perk refresh
        if (selectedBundleForCheckout && currentPage === 'home' && !authError) { 
          handleCloseAuthModal(); 
          setCurrentPage('checkout');
          return; 
        }
      } else { 
        await signup(authDetails.email, authDetails.password);
      }
      if (!authError && authModalType === 'login') { 
          handleCloseAuthModal();
      }
    } catch (err) {
      console.error(`Auth failed for ${authModalType}`, err);
    }
  };
  
  const handleMockVerification = async (email: string) => {
    try {
        await completeMockVerification(email);
        handleCloseAuthModal(); 
    } catch(err){
         console.error("Mock verification error:", err);
    }
  }


  const handleChooseBundleForCheckout = (bundle: Bundle) => {
    if (!currentUser) {
      setSelectedBundleForCheckout(bundle);
      handleOpenAuthModal('login', 'checkout'); 
    } else {
      if (currentUser.isVerified === false) {
        addToast('Please verify your email before choosing a bundle.', 'warning');
        return;
      }
      setSelectedBundleForCheckout(bundle);
      navigateTo('checkout');
    }
  };

  const handleConfirmSubscription = async (cycle: 'monthly' | 'annually', pricePaid: number) => {
    if (selectedBundleForCheckout && currentUser) {
      if (currentUser.isVerified === false) {
        addToast('Please verify your email before subscribing.', 'warning');
        return;
      }
      try {
        await subscribeToBundle(selectedBundleForCheckout.id, cycle, pricePaid);
        // AuthContext's subscribeToBundle now handles credit and perk refresh.
        setSelectedBundleForCheckout(null);
      } catch (err) {
        console.error("Subscription failed:", err);
      }
    }
  };

  const renderPage = () => {
    if (currentPage === 'terms') return <TermsPage />;
    if (currentPage === 'privacy') return <PrivacyPolicyPage />;
    if (currentPage === 'contact') return <ContactPage />;
    if (currentPage === 'forgot-password') return <ForgotPasswordPage navigateTo={navigateTo} />;
    if (currentPage === 'reset-password') return <ResetPasswordPage navigateTo={navigateTo} />;
    if (currentPage === 'payment-success') return <PaymentSuccessPage navigateTo={navigateTo} clearLastPaymentError={clearLastPaymentError} />;
    if (currentPage === 'payment-failure') return <PaymentFailurePage navigateTo={navigateTo} lastPaymentError={lastPaymentError} clearLastPaymentError={clearLastPaymentError} />;


    if (currentUser) { 
        switch (currentPage) {
            case 'checkout':
                if (!selectedBundleForCheckout) {
                    navigateTo('home'); 
                    return <HomePage onChooseBundle={handleChooseBundleForCheckout} onOpenAuthModal={(type) => handleOpenAuthModal(type)} />;
                }
                return <CheckoutPage bundle={selectedBundleForCheckout} onConfirmSubscription={handleConfirmSubscription} navigateTo={navigateTo} setLastPaymentError={setLastPaymentError}/>;
            case 'account':
                if (currentUser.role !== 'user') { navigateToDefaultPage(currentUser.role); return null; }
                return <AccountPage navigateTo={navigateTo} />;
            case 'edit-profile':
                 if (currentUser.role !== 'user') { navigateToDefaultPage(currentUser.role); return null; }
                return <EditProfilePage navigateTo={navigateTo} />;
            case 'perks-locker': // Added PerksLockerPage route
                if (currentUser.role !== 'user') { navigateToDefaultPage(currentUser.role); return null; }
                return <PerksLockerPage navigateTo={navigateTo} />;
            case 'admin-dashboard':
                if (currentUser.role !== 'admin') { navigateToDefaultPage(currentUser.role); return null; }
                return <AdminDashboardPage />;
            case 'provider-dashboard':
                if (currentUser.role !== 'provider') { navigateToDefaultPage(currentUser.role); return null; }
                return <ProviderDashboardPage />;
            case 'home':
                 return <HomePage onChooseBundle={handleChooseBundleForCheckout} onOpenAuthModal={(type) => handleOpenAuthModal(type)} />;
            default:
                return <NotFoundPage navigateTo={navigateTo} />; 
        }
    } else { 
        // All protected routes redirect to home or show login modal if accessed directly
        const protectedRoutes: Route[] = ['checkout', 'account', 'edit-profile', 'admin-dashboard', 'provider-dashboard', 'perks-locker'];
        if (protectedRoutes.includes(currentPage)) {
            navigateTo('home'); 
            return <HomePage onChooseBundle={handleChooseBundleForCheckout} onOpenAuthModal={(type) => handleOpenAuthModal(type)} />;
        }
        switch (currentPage) {
             case 'home':
                return <HomePage onChooseBundle={handleChooseBundleForCheckout} onOpenAuthModal={(type) => handleOpenAuthModal(type)} />;
             default: // For other public pages like terms, privacy, etc.
                return <NotFoundPage navigateTo={navigateTo} />; 
        }
    }
  };

  if (appIsLoading && !currentUser) { 
    return (
        <div className="min-h-screen flex flex-col bg-white items-center justify-center text-slate-900">
            <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-xl">Loading OneSub...</p>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header 
        onOpenAuthModal={(type) => handleOpenAuthModal(type)} 
        navigateTo={navigateTo}
        currentRoute={currentPage}
      />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Suspense fallback={<PageLoadingSpinner />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer navigateTo={navigateTo} />

      {authModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md relative">
            <button 
              onClick={handleCloseAuthModal}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700 transition-colors"
              aria-label="Close authentication form"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <AuthForm
              formType={authModalType}
              onSubmit={handleSubmitAuthForm}
              isLoading={authContextIsLoading} 
              error={authError} 
              onSuccessSignup={(email) => handleMockVerification(email)} 
              navigateTo={navigateTo} 
            />
          </div>
        </div>
      )}
      {showCookieBanner && <CookieBanner onAccept={handleAcceptCookies} navigateTo={navigateTo} />}
      <ToastContainer />
    </div>
  );
};

export default App;
