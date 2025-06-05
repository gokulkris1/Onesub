import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 border-b pb-4">
        Terms & Conditions
      </h1>
      <div className="prose prose-slate max-w-none text-slate-700">
        <p className="lead">
          Welcome to OneSub! These terms and conditions outline the rules and regulations for the use of OneSub's Website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Introduction</h2>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use OneSub if you do not agree to take all of the terms and conditions stated on this page.
        </p>
        <p>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Cookies</h2>
        <p>
          We employ the use of cookies. By accessing OneSub, you agreed to use cookies in agreement with the OneSub's Privacy Policy. Most interactive websites use cookies to let us retrieve the user’s details for each visit.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. License</h2>
        <p>
          Unless otherwise stated, OneSub and/or its licensors own the intellectual property rights for all material on OneSub. All intellectual property rights are reserved. You may access this from OneSub for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from OneSub</li>
          <li>Sell, rent or sub-license material from OneSub</li>
          <li>Reproduce, duplicate or copy material from OneSub</li>
          <li>Redistribute content from OneSub</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. User Comments</h2>
        <p>This Agreement shall begin on the date hereof.</p>
        <p>
          Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website. OneSub does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of OneSub,its agents and/or affiliates. Comments reflect the views and opinions of the person who post their views and opinions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Subscription Services</h2>
        <p>
          OneSub provides a platform for users to subscribe to bundled services offered by third-party providers. All subscriptions are subject to the terms specified by the individual service providers, in addition to these terms.
        </p>
        <p>
          Subscription fees, billing cycles, and cancellation policies will be clearly displayed at the point of purchase. OneSub acts as an intermediary and is not responsible for the content or delivery of services provided by third parties.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Limitation of Liability</h2>
        <p>
          In no event shall OneSub, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website whether such liability is under contract. OneSub, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this Website.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Changes to Terms</h2>
        <p>
          OneSub reserves the right to revise these terms at any time as it sees fit, and by using this Website you are expected to review these terms on a regular basis.
        </p>

        <p className="mt-8 text-sm text-slate-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default TermsPage;