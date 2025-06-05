import React, { useState, FormEvent } from 'react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setSubmitStatus({ type: 'error', message: 'All fields are required.' });
      setIsSubmitting(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setSubmitStatus({ type: 'error', message: 'Please enter a valid email address.' });
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    console.log('Contact Form Submission:', formData);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitStatus({ type: 'success', message: 'Thank you for your message! We\'ll get back to you soon.' });
    setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-8 text-center">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form Section */}
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              ></textarea>
            </div>

            {submitStatus && (
              <div className={`p-3 rounded-md text-sm ${submitStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitStatus.message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        {/* Contact Info & Support Section */}
        <div className="bg-slate-50 p-6 sm:p-8 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Support & Information</h2>
          <div className="space-y-4 text-slate-700">
            <p>
              Have questions or need help? We're here for you!
            </p>
            <div>
              <h3 className="font-semibold text-slate-800">Email Us:</h3>
              <p><a href="mailto:support@onesub.com" className="text-blue-500 hover:text-blue-400">support@onesub.com</a> (Placeholder)</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Call Us:</h3>
              <p>+1 (555) 123-4567 (Placeholder)</p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Business Hours:</h3>
              <p>Monday - Friday, 9 AM - 5 PM (Your Timezone)</p>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-2">Frequently Asked Questions:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><a href="#" className="text-blue-500 hover:text-blue-400">How do I change my subscription? (Placeholder)</a></li>
                <li><a href="#" className="text-blue-500 hover:text-blue-400">What payment methods are accepted? (Placeholder)</a></li>
                <li><a href="#" className="text-blue-500 hover:text-blue-400">How does billing work? (Placeholder)</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;