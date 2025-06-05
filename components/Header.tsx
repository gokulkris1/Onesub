
import React, { useState, useEffect, useRef } from 'react';
import { SparklesIcon, GiftIcon } from '../constants'; 
import { useAuth } from '../contexts/AuthContext';
import { Route } from '../types';

interface HeaderProps {
  onOpenAuthModal: (type: 'login' | 'signup') => void;
  navigateTo: (page: Route) => void;
  currentRoute: Route;
}

const Header: React.FC<HeaderProps> = ({ onOpenAuthModal, navigateTo, currentRoute }) => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // For desktop user dropdown
  const menuRef = useRef<HTMLDivElement>(null); // For mobile menu
  const userMenuRef = useRef<HTMLDivElement>(null); // For desktop user dropdown
  const buttonRef = useRef<HTMLButtonElement>(null); // For mobile menu button
  const userButtonRef = useRef<HTMLButtonElement>(null); // For desktop user avatar button


  const handleLogout = async () => {
    try {
      await logout();
      navigateTo('home'); 
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginClick = () => {
    onOpenAuthModal('login');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }

  const handleSignUpClick = () => {
    onOpenAuthModal('signup');
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }
  
  const handleNavigation = (page: Route) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigateTo(page);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && 
          menuRef.current && 
          !menuRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
          ) {
        setMobileMenuOpen(false);
      }
      if (userMenuOpen &&
          userMenuRef.current &&
          !userMenuRef.current.contains(event.target as Node) &&
          userButtonRef.current &&
          !userButtonRef.current.contains(event.target as Node)
        ) {
          setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, userMenuOpen]);


  let accountLinkText = "Account";
  let accountLinkRoute: Route = 'account';

  if (currentUser) {
    switch (currentUser.role) {
      case 'admin':
        accountLinkText = "Admin Panel";
        accountLinkRoute = 'admin-dashboard';
        break;
      case 'provider':
        accountLinkText = "Provider Dashboard";
        accountLinkRoute = 'provider-dashboard';
        break;
      case 'user':
      default:
        accountLinkText = "My Account";
        accountLinkRoute = 'account';
        break;
    }
  }

  const navLinkClasses = (page: Route) => 
    `block px-3 py-2 text-base font-medium rounded-md transition-colors ${
      currentRoute === page ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
    }`;

  const userDropdownLinkClasses = (page?: Route) => 
    `block w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
      page && currentRoute === page ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100 hover:text-blue-600'
    }`;
  
  const buttonClasses = (variant: 'primary' | 'secondary' | 'danger') => {
    if (variant === 'primary') return "block w-full text-center px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors";
    if (variant === 'secondary') return "block w-full text-center px-3 py-2 text-base font-medium text-blue-600 hover:bg-slate-100 rounded-md transition-colors";
    if (variant === 'danger') return "block w-full text-center px-3 py-2 text-base font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors";
    return "";
  };


  return (
    <header className="py-4 bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a 
            href="#"
            onClick={handleNavigation('home')}
            className="flex items-center group"
            aria-label="Go to homepage"
          >
            <SparklesIcon className="w-8 h-8 sm:w-10 sm:h-10 text-red-500 mr-2 sm:mr-3 group-hover:text-red-600 transition-colors" />
            <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-600 group-hover:text-blue-500 transition-colors">
              OneSub
            </h1>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-3 relative">
            {currentUser ? (
              <>
                <button
                  ref={userButtonRef}
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center p-1 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {currentUser.profilePictureUrl ? (
                    <img 
                        src={currentUser.profilePictureUrl} 
                        alt={currentUser.fullName || currentUser.email} 
                        className="w-9 h-9 rounded-full object-cover border-2 border-slate-300 hover:border-blue-500 transition-colors"
                    />
                    ) : (
                         <span className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-slate-200 text-slate-600 border-2 border-slate-300 hover:border-blue-500 transition-colors">
                            <span className="text-sm font-medium leading-none">{currentUser.fullName ? currentUser.fullName[0].toUpperCase() : currentUser.email[0].toUpperCase()}</span>
                        </span>
                    )}
                </button>
                {userMenuOpen && (
                     <div 
                        ref={userMenuRef}
                        className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50"
                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button"
                    >
                        <div className="px-4 py-3 border-b border-slate-200">
                            <p className="text-sm font-medium text-slate-800 truncate">{currentUser.fullName || currentUser.email}</p>
                            <p className="text-xs text-slate-500 capitalize">{currentUser.role} Account</p>
                        </div>
                        <div className="py-1">
                            <a href="#" onClick={handleNavigation(accountLinkRoute)} className={userDropdownLinkClasses(accountLinkRoute)} role="menuitem">
                                {accountLinkText}
                            </a>
                            {currentUser.role === 'user' && (
                                <a href="#" onClick={handleNavigation('perks-locker')} className={userDropdownLinkClasses('perks-locker')} role="menuitem">
                                    <GiftIcon className="w-4 h-4 inline-block mr-2 align-middle" />
                                    Perks Locker
                                </a>
                            )}
                            <button
                                onClick={handleLogout}
                                className={`${userDropdownLinkClasses()} text-red-600 hover:bg-red-50 hover:text-red-700`}
                                role="menuitem"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleLoginClick}
                  className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleSignUpClick}
                  className="px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              ref={buttonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="block h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="block h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {currentRoute === 'home' && (
            <p className="text-base sm:text-lg text-slate-700 max-w-3xl mx-auto mt-2 sm:mt-4 text-center md:text-left">
                Unlock incredible savings with our curated subscription bundles.
                More value, less cost – enjoy your favorite services, simplified.
            </p>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-30 border-t border-slate-200" id="mobile-menu" ref={menuRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {currentUser ? (
              <>
                {currentUser.profilePictureUrl && (
                    <div className="flex items-center px-3 py-2">
                        <img 
                            src={currentUser.profilePictureUrl} 
                            alt={currentUser.fullName || currentUser.email} 
                            className="w-10 h-10 rounded-full object-cover border-2 border-slate-300 mr-3"
                        />
                        <span className="text-slate-700 text-sm font-medium">
                            {currentUser.fullName || currentUser.email}
                        </span>
                    </div>
                )}
                 <a href="#" onClick={handleNavigation(accountLinkRoute)} className={navLinkClasses(accountLinkRoute)}>
                  {accountLinkText}
                </a>
                {currentUser.role === 'user' && (
                     <a href="#" onClick={handleNavigation('perks-locker')} className={navLinkClasses('perks-locker')}>
                        <GiftIcon className="w-4 h-4 inline-block mr-2 align-middle" /> Perks Locker
                    </a>
                )}
                <button onClick={handleLogout} className={buttonClasses('danger')}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={handleLoginClick} className={buttonClasses('secondary')}>
                  Login
                </button>
                <button onClick={handleSignUpClick} className={buttonClasses('primary')}>
                  Sign Up
                </button>
              </>
            )}
            <hr className="my-2 border-slate-200"/>
             <a href="#" onClick={handleNavigation('home')} className={navLinkClasses('home')}>
                Home
            </a>
             <a href="#" onClick={handleNavigation('terms')} className={navLinkClasses('terms')}>
                Terms
            </a>
             <a href="#" onClick={handleNavigation('privacy')} className={navLinkClasses('privacy')}>
                Privacy
            </a>
            <a href="#" onClick={handleNavigation('contact')} className={navLinkClasses('contact')}>
                Contact
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;