

import React from 'react';
import { Bundle, Service, FullUserProfile, ActiveSubscription, Partner, Perk } from './types';

// SVG Icon Components (Existing - Unchanged)
export const TvIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75V16.5m0 0H12m-3.75 0H8.25m0 0H6M12 20.25h3.75m-3.75-3.75V16.5m0 0H14.25m0 0h1.5m-3.75 0H12m0 6.75h3.75M6 20.25v-3.75M6 16.5c0-.966.784-1.75 1.75-1.75h8.5A1.75 1.75 0 0 1 18 16.5v-3.75c0-.966-.784-1.75-1.75-1.75h-8.5A1.75 1.75 0 0 0 6 11.25v3.75M6 16.5v3.75m0-3.75c0 .966-.784-1.75-1.75 1.75S2.5 17.466 2.5 16.5v-3.75c0-.966.784-1.75 1.75-1.75S6 11.784 6 12.75v3.75z" />
  </svg>
);
export const MusicIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
  </svg>
);
export const NewsIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25h-13.5A2.25 2.25 0 013 18V7.875c0-.621.504-1.125 1.125-1.125H7.5m0-4.5h7.5m-7.5 0V5.25m0-2.25h7.5m0 0V5.25m0 0h-7.5m0 0H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V7.875c0-.621-.504-1.125-1.125-1.125h-3.375m0 0V3.75m0 0h-7.5" />
  </svg>
);
export const CoffeeIcon: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
  </svg>
);
export const SparklesIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 14.25l-1.25-2.25L13.5 11l2.25-1.25L17 7.5l1.25 2.25L20.5 11l-2.25 1.25z" />
  </svg>
);
export const GiftIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className ?? "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 006.375 8.25H17.625A3.375 3.375 0 0012 4.875c0 1.727.963 3.106 2.376 3.375H9.624A3.375 3.375 0 0112 4.875z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.875v16.5M4.5 15.75h15" />
 </svg>
);


const ALL_SERVICES: Service[] = [
  { id: 'x', name: 'StreamFlix Plus', icon: <TvIcon className="w-6 h-6 text-red-500"/>, originalPrice: 10, description: "Ad-free movies & original series." },
  { id: 'y', name: 'MusicVerse Pro', icon: <MusicIcon className="w-6 h-6 text-blue-500"/>, originalPrice: 9, description: "Unlimited ad-free music streaming." },
  { id: 'z', name: 'NewsNow Premium', icon: <NewsIcon className="w-6 h-6 text-slate-200"/>, originalPrice: 11, description: "In-depth global news coverage." },
  { id: 'coffee', name: 'Café Elevate Weekly', icon: <CoffeeIcon className="w-6 h-6 text-green-500"/>, originalPrice: 20, description: "Your weekly artisan coffee credit." },
];

export const BUNDLES_DATA: Bundle[] = [
  {
    id: 'bundle1',
    name: 'The Ultimate Harmony Pack',
    description: 'Experience everything! All your essential digital services plus your weekly premium coffee, bundled for maximum savings and enjoyment.',
    services: ALL_SERVICES,
    bundlePrice: 30,
    highlight: true,
    badge: 'Best Value',
    themeColor: 'border-blue-600',
    annualPriceMultiplier: 0.85, // 15% off annually
  },
  {
    id: 'bundle2',
    name: 'Digital Explorer Kit',
    description: 'Dive into a world of entertainment and information. Stream, listen, and read with our curated digital essentials bundle.',
    services: [ALL_SERVICES[0], ALL_SERVICES[1], ALL_SERVICES[2]],
    bundlePrice: 22,
    themeColor: 'border-red-600',
    annualPriceMultiplier: 0.9, // 10% off annually
  },
  {
    id: 'bundle3',
    name: 'Lifestyle Booster Pack',
    description: 'Energize your routine with unlimited music and your favorite coffee. The perfect pairing for a productive week.',
    services: [ALL_SERVICES[1], ALL_SERVICES[3]],
    bundlePrice: 21, 
    badge: 'Popular',
    themeColor: 'border-green-600',
    annualPriceMultiplier: 0.9, // 10% off annually
  },
  {
    id: 'bundle4',
    name: 'Entertainment Starter',
    description: 'Kickstart your entertainment with essential streaming and music services at a great price.',
    services: [ALL_SERVICES[0], ALL_SERVICES[1]],
    bundlePrice: 15,
    themeColor: 'border-slate-400',
    // No annual discount for this one, or could be annualPriceMultiplier: 1
  }
];

// --- PERKS SYSTEM CONSTANTS ---
export const MOCK_PARTNERS: Partner[] = [
    { id: 'partner1', name: 'EduSpark Online', logoUrl: 'https://picsum.photos/seed/partner1logo/100/50?grayscale', website: 'https://eduspark.example.com' },
    { id: 'partner2', name: 'GamerHaven Plus', logoUrl: 'https://picsum.photos/seed/partner2logo/100/50?grayscale', website: 'https://gamerhaven.example.com' },
    { id: 'partner3', name: 'ZenMind Apps', logoUrl: 'https://picsum.photos/seed/partner3logo/100/50?grayscale', website: 'https://zenmind.example.com' },
    { id: 'partner4', name: 'FitFlow Fitness', logoUrl: 'https://picsum.photos/seed/partner4logo/100/50?grayscale', website: 'https://fitflow.example.com' },
];

export let MOCK_PERKS_CATALOG: Perk[] = [
    {
        id: 'perk001',
        title: '1 Month Free EduSpark Premium',
        partnerId: 'partner1',
        description: 'Unlock a full month of access to all EduSpark Premium courses and learning materials.',
        longDescription: 'Dive deep into new skills with EduSpark Premium. This perk gives you unlimited access to expert-led courses, interactive workshops, and certification programs for 30 days, completely free.',
        imageUrl: `https://picsum.photos/seed/perk001img/300/200`,
        unlockCriteria: [
            { type: 'MIN_SUBSCRIPTIONS_LINKED', value: 2, description: 'Link at least 2 active subscriptions on OneSub.' },
            { type: 'ACCOUNT_AGE_DAYS', value: 30, description: 'Be a OneSub member for at least 30 days.'}
        ],
        delivery: { method: 'CODE', value: 'ONESUBEDU30', instructions: 'Redeem this code on EduSpark.example.com/redeem after signing up.' },
        expiryDate: '2024-12-31',
        activeStatus: true,
        category: 'Education',
    },
    {
        id: 'perk002',
        title: '25% Off GamerHaven Annual Pass',
        partnerId: 'partner2',
        description: 'Get a 25% discount on your first year of GamerHaven Plus annual subscription.',
        longDescription: 'Level up your gaming with GamerHaven Plus! Enjoy exclusive in-game items, ad-free gaming, and early access to new releases. This perk gives you 25% off the annual pass.',
        imageUrl: `https://picsum.photos/seed/perk002img/300/200`,
        unlockCriteria: [
            { type: 'SPECIFIC_BUNDLE_SUBSCRIBED', value: 'bundle1', description: 'Subscribe to "The Ultimate Harmony Pack".' }
        ],
        delivery: { method: 'LINK', value: 'https://gamerhaven.example.com/onesuboffer?discount=25', instructions: 'Click the link to apply the discount automatically.' },
        activeStatus: true,
        category: 'Gaming',
    },
    {
        id: 'perk003',
        title: '3 Months Free ZenMind Meditation App',
        partnerId: 'partner3',
        description: 'Enjoy 3 months of guided meditations and mindfulness exercises with ZenMind.',
        longDescription: 'Find your calm with ZenMind. This perk provides 3 months of free access to their premium library of meditations, sleep stories, and stress-relief programs.',
        imageUrl: `https://picsum.photos/seed/perk003img/300/200`,
        unlockCriteria: [
            { type: 'MIN_MONTHLY_SPEND', value: 25, description: 'Have a total monthly OneSub spend of €25 or more.' }
        ],
        delivery: { method: 'CODE', value: 'ZENONESUB90', instructions: 'Enter this code in the ZenMind app settings.' },
        expiryDate: '2025-03-31',
        activeStatus: true,
        category: 'Wellness',
    },
     {
        id: 'perk004',
        title: 'Exclusive FitFlow Workout Plan',
        partnerId: 'partner4',
        description: 'Get a personalized 4-week workout plan from FitFlow Fitness experts.',
        imageUrl: `https://picsum.photos/seed/perk004img/300/200`,
        unlockCriteria: [
            { type: 'MIN_SUBSCRIPTIONS_LINKED', value: 1, description: 'Link at least 1 active subscription.' }
        ],
        delivery: { method: 'LINK', value: 'https://fitflow.example.com/onesub-plan', instructions: 'Access your plan via this exclusive link.' },
        activeStatus: true,
        category: 'Fitness',
    },
];
// --- END PERKS SYSTEM CONSTANTS ---


const USER_BASE_PROFILES = [
  { fullName: "Aoife Murphy", emailDomain: "example.ie", city: "Dublin", county: "Co. Dublin", eircodePrefix: "D02", phonePrefix: "087", cardType: "Visa", cardSuffix: "0001"},
  { fullName: "Cian O'Kelly", emailDomain: "example.ie", city: "Cork", county: "Co. Cork", eircodePrefix: "T12", phonePrefix: "085", cardType: "Mastercard", cardSuffix: "5100"},
  { fullName: "Saoirse Byrne", emailDomain: "example.ie", city: "Galway", county: "Co. Galway", eircodePrefix: "H91", phonePrefix: "086", cardType: "Visa", cardSuffix: "0002"},
  { fullName: "Liam Walsh", emailDomain: "example.ie", city: "Limerick", county: "Co. Limerick", eircodePrefix: "V94", phonePrefix: "083", cardType: "Mastercard", cardSuffix: "5101"},
  { fullName: "Niamh McCarthy", emailDomain: "example.ie", city: "Waterford", county: "Co. Waterford", eircodePrefix: "X91", phonePrefix: "089", cardType: "Visa", cardSuffix: "0003"},
  { fullName: "Eoin Doyle", emailDomain: "example.ie", city: "Kilkenny", county: "Co. Kilkenny", eircodePrefix: "R95", phonePrefix: "087", cardType: "Mastercard", cardSuffix: "5102"},
  { fullName: "Fionnuala Ryan", emailDomain: "example.ie", city: "Dundalk", county: "Co. Louth", eircodePrefix: "A91", phonePrefix: "085", cardType: "Visa", cardSuffix: "0004"},
  { fullName: "Padraig Connolly", emailDomain: "example.ie", city: "Sligo", county: "Co. Sligo", eircodePrefix: "F91", phonePrefix: "086", cardType: "Mastercard", cardSuffix: "5103"},
  { fullName: "Grainne FitzGerald", emailDomain: "example.ie", city: "Athlone", county: "Co. Westmeath", eircodePrefix: "N37", phonePrefix: "083", cardType: "Visa", cardSuffix: "0005"},
  { fullName: "Diarmuid O'Sullivan", emailDomain: "example.ie", city: "Tralee", county: "Co. Kerry", eircodePrefix: "V92", phonePrefix: "089", cardType: "Mastercard", cardSuffix: "5104"},
];

const PROVIDER_BASE_PROFILES = [
    { businessName: "Streamtastic Services Ltd.", contactPerson: "Sarah Lee", serviceType: "Video Streaming" },
    { businessName: "Global MusicWave Inc.", contactPerson: "John Doe", serviceType: "Music Streaming" },
    { businessName: "NewsFrontiers Co.", contactPerson: "Jane Smith", serviceType: "News Aggregation" },
    { businessName: "The Coffee Collective", contactPerson: "Mark Brown", serviceType: "Subscription Box" },
    { businessName: "EduLearn Platforms", contactPerson: "Emily White", serviceType: "E-Learning" },
    { businessName: "FitLife Digital", contactPerson: "David Green", serviceType: "Fitness Apps" },
    { businessName: "GameVerse Studios", contactPerson: "Laura Black", serviceType: "Online Gaming" },
    { businessName: "SecureCloud Storage", contactPerson: "Michael Grey", serviceType: "Cloud Storage" },
    { businessName: "CreativeSuite Tools", contactPerson: "Olivia Blue", serviceType: "Software Tools" },
    { businessName: "WellnessDaily Apps", contactPerson: "Peter Purple", serviceType: "Wellness Apps" },
];

const ADMIN_BASE_PROFILES = [
    { fullName: "Admin OneSub", department: "Platform Operations" },
    { fullName: "Lead Admin", department: "User & Provider Management" },
    { fullName: "Finance Admin", department: "Billing & Payments" },
    { fullName: "Support Admin", department: "Customer & Provider Support" },
    { fullName: "Technical Admin", department: "Platform Maintenance" },
    { fullName: "Compliance Admin", department: "Legal & Compliance" },
    { fullName: "Marketing Admin", department: "Promotions & Outreach" },
    { fullName: "Data Analyst Admin", department: "Analytics & Reporting" },
    { fullName: "Security Admin", department: "Platform Security" },
    { fullName: "SysOp Admin", department: "Infrastructure" },
];

const generateMockUsers = (): FullUserProfile[] => {
    const users: FullUserProfile[] = [];
    let userIdCounter = 1;
    const CREDIT_RATE = 0.01; // 1%

    const getNextBillingDate = (subscribedDate: Date, cycle: 'monthly' | 'annually'): string => {
        const nextDate = new Date(subscribedDate);
        if (cycle === 'monthly') {
            nextDate.setMonth(nextDate.getMonth() + 1);
        } else {
            nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        return nextDate.toISOString().split('T')[0];
    };

    // Generate 10 'user' role users
    for (let i = 0; i < 10; i++) {
        const base = USER_BASE_PROFILES[i % USER_BASE_PROFILES.length];
        const firstNameInitial = base.fullName.split(' ')[0][0].toLowerCase();
        const lastName = base.fullName.split(' ')[1] ? base.fullName.split(' ')[1].toLowerCase() : 'user';
        const email = `${firstNameInitial}${lastName}${i + 1}@${base.emailDomain}`;
        
        const activeSubscriptions: ActiveSubscription[] = [];
        let subscriptionStatus: 'active' | 'canceled' | 'none' = 'none';
        let initialTotalCreditsEarned = 0;
        let initialCreditsAvailable = 0;
        const registrationDate = new Date(2023, 10, 15 + i).toISOString().split('T')[0]; // For account age perk


        if (i % 3 === 0) { // Active subscription
            subscriptionStatus = 'active';
            const bundle = BUNDLES_DATA[i % BUNDLES_DATA.length];
            const cycle = i % 2 === 0 ? 'monthly' : 'annually';
            const subscribedDate = new Date(2024, 0, 15 + i).toISOString().split('T')[0]; 
            let pricePaid = bundle.bundlePrice;
            let monthlyAmountForCredits = bundle.bundlePrice;

            if (cycle === 'annually' && bundle.annualPriceMultiplier) {
                pricePaid = bundle.bundlePrice * 12 * bundle.annualPriceMultiplier;
                monthlyAmountForCredits = (bundle.bundlePrice * 12 * bundle.annualPriceMultiplier) / 12;
            } else if (cycle === 'annually') {
                pricePaid = bundle.bundlePrice * 12;
                monthlyAmountForCredits = bundle.bundlePrice;
            }
            
            const creditsForThisSub = parseFloat((monthlyAmountForCredits * CREDIT_RATE * (i+1)).toFixed(2)); 
            initialTotalCreditsEarned += creditsForThisSub;
            initialCreditsAvailable += creditsForThisSub;


            activeSubscriptions.push({
                bundleId: bundle.id,
                cycle: cycle,
                subscribedDate: subscribedDate,
                pricePaid: parseFloat(pricePaid.toFixed(2)),
                nextBillingDate: getNextBillingDate(new Date(subscribedDate), cycle),
                status: 'active',
                linkedDate: subscribedDate, 
                creditRate: CREDIT_RATE,
                monthlyAmountForCredits: parseFloat(monthlyAmountForCredits.toFixed(2)),
            });

            if (i % 4 === 0 && BUNDLES_DATA.length > 1) { 
                 const secondBundle = BUNDLES_DATA[(i + 1) % BUNDLES_DATA.length];
                 const secondCycle = 'monthly';
                 const secondSubscribedDate = new Date(2024, 1, 10 + i).toISOString().split('T')[0];
                 const secondMonthlyAmount = secondBundle.bundlePrice;
                 const creditsForSecondSub = parseFloat((secondMonthlyAmount * CREDIT_RATE * (i+1)).toFixed(2));
                 initialTotalCreditsEarned += creditsForSecondSub;
                 initialCreditsAvailable += creditsForSecondSub;

                 activeSubscriptions.push({
                    bundleId: secondBundle.id,
                    cycle: secondCycle,
                    subscribedDate: secondSubscribedDate,
                    pricePaid: secondBundle.bundlePrice,
                    nextBillingDate: getNextBillingDate(new Date(secondSubscribedDate), secondCycle),
                    status: 'active',
                    linkedDate: secondSubscribedDate,
                    creditRate: CREDIT_RATE,
                    monthlyAmountForCredits: parseFloat(secondMonthlyAmount.toFixed(2)),
                 });
            }
        } else if (i % 3 === 2) { 
            subscriptionStatus = 'canceled';
        }

        // Sample unlocked perks for some users
        const unlockedPerks = [];
        if (i === 0 && MOCK_PERKS_CATALOG.length > 0) { // User 0 gets perk001 unlocked
            unlockedPerks.push({ perkId: MOCK_PERKS_CATALOG[0].id, status: 'unlocked' as 'unlocked', dateUnlocked: new Date().toISOString() });
        }
        if (i === 1 && MOCK_PERKS_CATALOG.length > 1) { // User 1 gets perk002 redeemed
            unlockedPerks.push({ 
                perkId: MOCK_PERKS_CATALOG[1].id, 
                status: 'redeemed' as 'redeemed', 
                dateUnlocked: new Date(Date.now() - 86400000 * 2).toISOString(), // Unlocked 2 days ago
                dateRedeemed: new Date().toISOString(),
                redemptionInfo: MOCK_PERKS_CATALOG[1].delivery 
            });
        }
         if (i === 2 && MOCK_PERKS_CATALOG.length > 3 && activeSubscriptions.length > 0) { // User 2 has 1 sub, might qualify for perk004
             // Let perkService logic determine if perk004 is unlocked
         }


        users.push({
            id: `user_${String(userIdCounter++).padStart(3, '0')}`,
            fullName: base.fullName,
            email: email,
            password: `UserPass${String(i + 1).padStart(2, '0')}!`,
            role: 'user',
            isVerified: true,
            status: 'active', 
            registrationDate: registrationDate,
            phone: `${base.phonePrefix}${String(1234500 + i + 1).slice(-7)}`,
            dateOfBirth: `${1980 + i}-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
            billingAddress: {
                street: `${i + 1} Main Street`,
                city: base.city,
                county: base.county,
                eircode: `${base.eircodePrefix} X${i}Y${(i % 9) + 1}`,
                country: "Ireland"
            },
            paymentDetails: {
                cardholderName: base.fullName,
                cardNumber: `xxxx-xxxx-xxxx-${base.cardSuffix.slice(0,3)}${i+1}`,
                expiryDate: `0${(i % 9) + 1}/${25 + (i % 5)}`,
                cardType: base.cardType
            },
            profilePictureUrl: `https://picsum.photos/seed/user${i + 1}/200/200`,
            subscriptionStatus: subscriptionStatus,
            activeSubscriptions: activeSubscriptions.length > 0 ? activeSubscriptions : null,
            totalCreditsEarned: parseFloat(initialTotalCreditsEarned.toFixed(2)),
            creditsAvailable: parseFloat(initialCreditsAvailable.toFixed(2)),
            creditsRedeemed: 0,
            lastCreditUpdateTimestamp: activeSubscriptions.length > 0 ? new Date().toISOString() : undefined,
            unlockedPerks: unlockedPerks,
        });
    }

    // Generate 10 'provider' role users
    for (let i = 0; i < 10; i++) {
        const base = PROVIDER_BASE_PROFILES[i % PROVIDER_BASE_PROFILES.length];
        const email = `${base.businessName.toLowerCase().replace(/[\s\.]+/g, '').slice(0, 10)}${i + 1}@provider.example.com`;
        users.push({
            id: `provider_${String(userIdCounter++).padStart(3, '0')}`,
            fullName: base.contactPerson,
            email: email,
            password: `ProviderPass${String(i + 1).padStart(2, '0')}!`,
            role: 'provider',
            isVerified: true,
            status: 'active', 
            registrationDate: new Date(2023, 5, 10 + i).toISOString().split('T')[0],
            businessName: base.businessName,
            phone: `01999000${i + 1}`,
            profilePictureUrl: `https://picsum.photos/seed/provider${i + 1}/200/200`,
            subscriptionStatus: "none",
            activeSubscriptions: null,
            billingAddress: {
                street: `${i + 1} Business Park Road`,
                city: "Industrial Estate",
                county: "Co. Business",
                eircode: `P${i+1} B1Z`,
                country: "Ireland"
            },
            totalCreditsEarned: 0, creditsAvailable: 0, creditsRedeemed: 0,
            unlockedPerks: [],
        });
    }

    // Generate 10 'admin' role users
    for (let i = 0; i < 10; i++) {
        const base = ADMIN_BASE_PROFILES[i % ADMIN_BASE_PROFILES.length];
        const email = `${base.fullName.toLowerCase().replace(/\s+/g, '')}${i + 1}@admin.onesub.com`;
        users.push({
            id: `admin_${String(userIdCounter++).padStart(3, '0')}`,
            fullName: base.fullName,
            email: email,
            password: `AdminPass${String(i + 1).padStart(2, '0')}!`,
            role: 'admin',
            isVerified: true,
            status: 'active',
            registrationDate: new Date(2023, 0, 1 + i).toISOString().split('T')[0],
            profilePictureUrl: `https://picsum.photos/seed/admin${i + 1}/200/200`,
            subscriptionStatus: "none",
            activeSubscriptions: null,
            totalCreditsEarned: 0, creditsAvailable: 0, creditsRedeemed: 0,
            unlockedPerks: [],
        });
    }
    return users;
};

export const MOCK_USERS: FullUserProfile[] = generateMockUsers();