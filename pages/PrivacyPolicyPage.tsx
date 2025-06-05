import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 border-b pb-4">
        Privacy Policy
      </h1>
      <div className="prose prose-slate max-w-none text-slate-700">
        <p className="lead">
          Your privacy is important to us. It is OneSub's policy to respect your privacy regarding any information we may collect from you across our website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
        <p>
          We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we’re collecting it and how it will be used.
        </p>
        <p>
          Information we may collect includes:
        </p>
        <ul>
          <li>Name and contact details (e.g., email address, phone number if provided).</li>
          <li>Account credentials (e.g., username, password - passwords are hashed).</li>
          <li>Subscription preferences and history.</li>
          <li>Billing information (processed securely by our payment partners, we do not store full card details).</li>
          <li>Usage data related to your interaction with our services.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
        <p>
          We use the information we collect in various ways, including to:
        </p>
        <ul>
          <li>Provide, operate, and maintain our website and services.</li>
          <li>Improve, personalize, and expand our website and services.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes (with your consent).</li>
          <li>Process your transactions and manage your subscriptions.</li>
          <li>Find and prevent fraud.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Log Files</h2>
        <p>
          OneSub follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Cookies and Web Beacons</h2>
        <p>
          Like any other website, OneSub uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Third-Party Privacy Policies</h2>
        <p>
          OneSub's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how to opt-out of certain options.
        </p>
        <p>
          When you subscribe to services through OneSub, your information may be shared with the respective service providers as necessary to fulfill your subscription. We encourage you to review their privacy policies.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Data Security</h2>
        <p>
          We take reasonable precautions to protect your information. When you submit sensitive information via the website, your information is protected both online and offline. Wherever we collect sensitive information (such as credit card data), that information is encrypted and transmitted to our payment processors in a secure way.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Your Rights</h2>
        <p>
          You have the right to access, update, or delete your personal information. You can manage your account information through your account settings or by contacting us.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
        </p>

        <p className="mt-8 text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;