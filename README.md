# OneSub - Smart Subscription Bundles

OneSub is a web application designed to offer curated subscription bundles, allowing users to save money by combining various services from different creators and providers into single, discounted packages.

## Key Features

*   **Bundle Discovery:** Browse and explore various subscription bundles.
*   **User Authentication:** Secure login and signup for users, providers, and admins.
*   **Role-Based Dashboards:**
    *   **User Dashboard:** Manage personal subscriptions, billing, and profile.
    *   **Provider Dashboard:** View service performance, subscriber insights, and manage offerings (mock).
    *   **Admin Dashboard:** Oversee platform users, provider applications, and utilize AI tools for bundle strategy (mock, AI feature currently disabled pending backend proxy).
*   **Checkout Process:** Select bundles and simulate a subscription checkout.
*   **AI-Powered Suggestions:** (Feature currently disabled) Intended for Admin & Provider to utilize Gemini API via a backend proxy to get suggestions.
*   **Static Pages:** Terms & Conditions, Privacy Policy, Contact Us.
*   **Newsletter Signup:** Mock functionality for users to subscribe to updates.
*   **Cookie Consent Banner:** GDPR compliance for cookie usage.
*   **Social Media Previews:** Meta tags for better link sharing.
*   **SEO Metadata:** Dynamically updated page titles and meta descriptions.
*   **Sitemap & Robots.txt:** Basic `sitemap.xml` and `robots.txt` for search engines.
*   **Analytics Placeholders:** Ready for Google Analytics & Meta Pixel integration.
*   **Responsive Design:** Adapts to various screen sizes, including mobile navigation.
*   **Lazy Loading:** Page components are loaded on demand for better performance.
*   **Error Handling:** Global Error Boundary for graceful error display.
*   **Toast Notifications:** User-friendly feedback for actions.

## Tech Stack

*   **Frontend:** React, TypeScript, Tailwind CSS
*   **API Client:** `@google/genai` (Intended for use in a backend proxy for Gemini API).
*   **Routing:** Custom client-side routing.
*   **State Management:** React Context API.
*   **Styling:** Tailwind CSS.
*   **Testing:** Jest, React Testing Library.
*   **Backend (Planned):** Firebase (Authentication, Firestore, Functions). This is where the Gemini API proxy and all core logic should reside.

## Project Structure

```
.
├── components/           # Reusable React components
├── contexts/             # React Context for global state (e.g., AuthContext)
├── pages/                # Page-level components
├── services/             # Mock service modules (auth, subscription, AI, etc.)
├── utils/                # Utility functions and test files
├── firebase-backend/     # Firebase Functions, Firestore rules, etc.
│   ├── functions/
│   ├── firestore.rules
│   └── firestore.indexes.json
├── .env.example          # Example environment variables (for backend API keys)
├── .firebaserc           # Firebase project configuration
├── firebase.json         # Firebase deployment configuration
├── index.html            # Main HTML file
├── index.tsx             # Main React entry point (transpiled to index.js)
├── metadata.json         # Application metadata
├── package.json          # Project dependencies and scripts
├── README.md             # This file
├── README-Firebase.md    # Firebase setup instructions
├── sitemap.xml           # Sitemap for SEO
├── robots.txt            # Robots exclusion protocol file
├── tsconfig.json         # TypeScript configuration
├── jest.config.js        # Jest test runner configuration
└── __mocks__/            # Mocks for Jest (e.g., fileMock.js)
```

## Getting Started

### Prerequisites

*   Node.js (version specified in `package.json` `engines` field, e.g., >=18.0.0)
*   Firebase CLI (for managing Firebase backend components, see `README-Firebase.md`)
*   A simple HTTP server for local development (e.g., `npm install -g serve` or use Python's built-in server).

### Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables (Primarily for Backend):**
    *   The Gemini API key (and any other secret keys for payment gateways, email services) should be configured in your **Firebase Functions environment configuration** when you build out the backend.
    *   The `.env.example` file lists `API_KEY` for reference if you were to build a local Node.js proxy, but the primary backend target is Firebase Functions. The frontend itself does not directly use this `.env` file.

4.  **Set up Firebase Backend:**
    *   Follow the detailed instructions in `README-Firebase.md` to create your Firebase project, set up Authentication, Firestore, and initialize Firebase Functions.
    *   Remember to replace placeholder project IDs in `.firebaserc`.

### Running Locally (Frontend Only - No Backend Logic)

1.  **Transpile TypeScript to JavaScript (CRITICAL STEP):**
    The application's `index.html` points to `/index.js`, and dynamic imports in `App.tsx` expect `.js` files. You **must** transpile your TypeScript/TSX files into JavaScript for the browser to understand them.
    *   Ensure your `tsconfig.json` has `"noEmit": false` (or the line is removed).
    *   Run the TypeScript compiler from your project root:
        ```bash
        npm run build 
        # This script executes: npx tsc
        ```
        This will generate `.js` files alongside your `.ts`/`.tsx` source files (e.g., `index.tsx` becomes `index.js`, `pages/HomePage.tsx` becomes `pages/HomePage.js`).

2.  **Serve the Application:**
    Serve your project **root directory** (which contains `index.html` and the transpiled `.js` files) using a simple HTTP server.
    *   Example using `serve` (install with `npm install -g serve` if you haven't already):
        ```bash
        serve . 
        # Or specify a port: serve -l 3000 .
        ```
    *   Example using Python's built-in HTTP server (if Python is installed):
        ```bash
        # For Python 3
        python -m http.server 8000
        # For Python 2 (less common)
        # python -m SimpleHTTPServer 8000
        ```
    *   Open your browser to the local address provided by the server (e.g., `http://localhost:3000` or `http://localhost:8000`).
    *   **Important:** Clear your browser cache and site data if you encounter issues, especially after re-running `npm run build`.

3.  **Firebase Emulators (for backend development):**
    To test Firebase Functions and Firestore rules locally once you start building them:
    ```bash
    # From inside firebase-backend/functions/ directory
    npm run serve 
    # or from project root (if configured in firebase.json)
    # firebase emulators:start
    ```
    Refer to `README-Firebase.md` and Firebase documentation for emulator setup.

## Available Scripts

*   `npm run dev`: Provides instructions; it does not run a dev server. Follow "Running Locally" steps.
*   `npm run build`: Transpiles TypeScript/TSX files to JavaScript using `npx tsc`. **This is essential before serving locally.**
*   `npm run start`: Provides instructions; it does not run a production server. Follow "Running Locally" steps.
*   `npm run test`: Runs unit tests using Jest.
*   (Inside `firebase-backend/functions/`)
    *   `npm run lint`: Lints Firebase Functions code.
    *   `npm run build`: Compiles TypeScript Firebase Functions to JavaScript.
    *   `npm run serve`: Runs Firebase emulators.
    *   `npm run deploy`: Deploys Firebase Functions.

## API Proxy & Backend Logic

*   **AI Features (Gemini API):** The AI suggestion features (e.g., in the Admin and Provider dashboards) require a backend proxy to securely call the Google Gemini API. The local example `api/geminiProxy.ts` has been removed because it's server-side Node.js code and won't run with a simple static file server. This proxy logic **must be implemented as a Firebase Function**. Until then, the AI features on the frontend are disabled/commented out.
*   **Core Backend Logic (Firebase):**
    The main backend (authentication, database operations, subscriptions, payments) is designed to be implemented using Firebase Functions and Firestore, as detailed in `README-Firebase.md`. The current frontend uses mock services.

## Testing

*   **Configuration:** `jest.config.js` and `tsconfig.json` (for `ts-jest`).
*   **Running Tests:** `npm test`
*   **Example Test:** See `utils/formatCurrency.test.ts`.

## Performance

*   **Lazy Loading:** Page components are lazy-loaded using `React.lazy` and `React.Suspense`.
*   **Code Splitting:** Implicitly handled by lazy loading.

## SEO & Static Files

*   **Dynamic Metadata:** `App.tsx` updates `document.title` and key meta tags based on the current page.
*   **`sitemap.xml`:** Provides a list of main routes for search engines.
*   **`robots.txt`:** Instructs web crawlers.
*   **Analytics:** Placeholders for Google Analytics and Meta Pixel are in `index.html`. Update with your actual IDs.

## Accessibility (A11y)

*   ARIA roles and attributes are used in components like the Header, Admin Dashboard tabs, and modals to improve accessibility.
*   Focus on semantic HTML and keyboard navigability.

## Deployment

*   **Frontend:**
    1.  Run `npm run build` to transpile TypeScript/TSX to JavaScript.
    2.  Deploy the contents of your project (including `index.html`, generated `.js` files, and any static assets) to a static web hosting provider (e.g., Firebase Hosting, Netlify, GitHub Pages, AWS S3/CloudFront).
*   **Backend (Firebase):**
    1.  Follow `README-Firebase.md` for setup.
    2.  Implement functions in `firebase-backend/functions/src/`.
    3.  Deploy using Firebase CLI: `firebase deploy --only functions` (and `firebase deploy --only firestore` for rules/indexes).

## To Go Live Checklist

This checklist outlines the critical steps to move "OneSub" from its current development state to a live, production-ready system.

**I. Backend & Core Logic (Firebase Focus):**

1.  **Firebase Project Setup (Critical):**
    *   [ ] **Complete Setup:** Fully set up your Firebase project (Authentication, Firestore, Functions) by following `README-Firebase.md`.
    *   [ ] **Replace Placeholders:** Ensure your Firebase Project ID is correctly set in `.firebaserc`.

2.  **Implement Firebase Functions (Critical):**
    *   [ ] **Authentication:**
        *   [ ] User Signup (with email verification flow via your chosen email service).
        *   [ ] User Login.
        *   [ ] Password Reset flow.
        *   [ ] Manage user roles & custom claims (e.g., for admin, provider).
    *   [ ] **User Profiles:** CRUD operations for user profiles in Firestore (sync with Firebase Auth user data).
    *   [ ] **Subscription Management:**
        *   [ ] Create, update, cancel, pause, resume subscriptions in Firestore.
        *   [ ] Integrate with payment provider status (see below).
    *   [ ] **Payment Gateway Integration (e.g., Stripe - Critical):**
        *   [ ] Set up your Stripe (or other) payment provider account.
        *   [ ] Integrate their SDK into Firebase Functions for secure payment processing (e.g., creating PaymentIntents, managing Customer and Subscription objects).
        *   [ ] Implement webhook handlers in Firebase Functions to listen for payment success, failures, subscription updates from Stripe.
    *   [ ] **Admin Logic:** Implement backend for `adminService.ts` (fetching data, user/provider management) in Functions using Firestore.
    *   [ ] **Provider Logic:** Implement backend for `providerService.ts` in Functions.
    *   [ ] **Gemini API Proxy:** Implement the AI suggestion proxy as a Firebase Function. Securely store and use your Gemini API key in the Firebase Functions environment configuration.

3.  **Secure Firestore (Critical):**
    *   [ ] **Define Comprehensive Rules:** Write and test robust Firestore Security Rules (`firebase-backend/firestore.rules`) based on user roles, data ownership, and access patterns. Test thoroughly.

4.  **Email Service Integration (Critical):**
    *   [ ] **Choose Provider:** Select an email service (e.g., SendGrid, Mailgun, AWS SES).
    *   [ ] **Integrate:** Connect this service with your Firebase Functions to send all transactional emails (welcome, verification, password reset, payment receipts, notifications). The frontend `notificationService.ts` should trigger these backend email functions.

5.  **Environment Variables (Critical):**
    *   [ ] **Firebase Functions:** Securely configure all necessary API keys (Payment Gateway keys, Email Service keys, Gemini API key) in Firebase Functions environment configuration.

**II. Frontend & Deployment:**

6.  **Replace Mock Services & Data (Critical):**
    *   [ ] **Update Frontend Calls:** Modify all frontend services (`services/*.ts`) and contexts (`contexts/*.tsx`) to make API calls to your new Firebase Functions instead of using mock data and local mock logic.

7.  **Build Process (Verify):**
    *   [ ] Ensure your `npm run build` (which runs `npx tsc`) correctly transpiles all `.tsx` to `.js`. If deploying the frontend to Firebase Hosting, their deployment process will typically handle this if your `firebase.json` is set up for a web framework (though a simple static deploy after `npm run build` is also common).

8.  **Configuration:**
    *   [ ] Review any frontend-specific configuration for production readiness.

9.  **Domain & DNS:**
    *   [ ] Configure your custom domain for your chosen frontend hosting platform (e.g., Firebase Hosting).
    *   [ ] (If needed) Configure custom domains for any HTTP-triggered Firebase Functions.

10. **Analytics & Tracking:**
    *   [ ] **Implement:** Replace placeholder Google Analytics and Meta Pixel IDs in `index.html` with your actual tracking IDs.

11. **SEO & Static Files:**
    *   [ ] **Verify:** Ensure `sitemap.xml` and `robots.txt` are correct and accessible.
    *   [ ] **Update URLs:** Update all placeholder URLs in `index.html` meta tags (og:url, twitter:url, og:image) to your production URLs.

**III. Testing & Quality Assurance:**

12. **Comprehensive Testing (Critical):**
    *   [ ] **Unit Tests:** Increase coverage for utilities, components, and service logic.
    *   [ ] **Integration Tests:** Test interactions between components, contexts, and (mocked or real) Firebase function calls.
    *   [ ] **End-to-End (E2E) Tests:** Implement E2E tests (e.g., Playwright, Cypress) for all critical user flows.
    *   [ ] **Manual Testing:** Thoroughly test all features, user roles, and edge cases across multiple browsers and devices.

13. **Mobile Responsiveness & Cross-Browser Compatibility:**
    *   [ ] **Full Audit:** Ensure all pages and components are fully responsive and render correctly.

14. **Accessibility (A11y) Audit:**
    *   [ ] **Perform Audit:** Use tools (Axe, WAVE) and manual checks.
    *   [ ] **Address Issues:** Fix any identified accessibility problems.

15. **Performance Optimization:**
    *   [ ] **Analyze:** Check bundle sizes.
    *   [ ] **Optimize Images:** Ensure images are appropriately sized and compressed.
    *   [ ] **Monitor Web Vitals:** Check LCP, FID, CLS on the live site and optimize.

**IV. Legal & Documentation:**

16. **Terms & Conditions and Privacy Policy (Critical):**
    *   [ ] **Finalize Content:** Update the placeholder content in `TermsPage.tsx` and `PrivacyPolicyPage.tsx` with legally sound policies. **Consult with a legal professional.**

17. **API Endpoint Documentation (Firebase Functions):**
    *   [ ] **Document:** Create documentation for your Firebase Functions for internal use.

18. **Final README Review:**
    *   [ ] **Update:** Ensure `README.md` and `README-Firebase.md` are complete and accurate with all final setup, deployment, and operational instructions.

This checklist provides a roadmap. Good luck with your launch!