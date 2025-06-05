import React, { useState, FormEvent } from 'react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!email.trim()) {
      setSubmitStatus({ type: 'error', message: 'Email cannot be empty.' });
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call for newsletter subscription
    console.log('Newsletter Subscription:', email);
    await new Promise(resolve => setTimeout(resolve, 700));

    setIsSubmitting(false);
    setSubmitStatus({ type: 'success', message: 'Thanks for subscribing! Check your inbox for a confirmation.' });
    setEmail(''); // Reset email field
    
    // Optionally, clear the success message after a few seconds
    setTimeout(() => setSubmitStatus(null), 5000);
  };

  return (
    <div className="max-w-lg mx-auto text-center">
      <h3 className="text-xl font-semibold text-slate-800 mb-3">
        Stay Updated with OneSub!
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        Get the latest news, exclusive bundle offers, and tips directly to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-start">
        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-slate-400"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-blue-500 disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {submitStatus && (
        <p className={`mt-3 text-sm ${submitStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {submitStatus.message}
        </p>
      )}
    </div>
  );
};

export default NewsletterSignup;