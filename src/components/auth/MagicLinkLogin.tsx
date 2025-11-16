import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../layout/Layout';

export default function MagicLinkLogin() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('idle');
    setErrorMessage('');

    const { error } = await signIn(email);

    if (error) {
      setStatus('error');
      setErrorMessage(error.message || 'Failed to send magic link. Please try again.');
    } else {
      setStatus('success');
      setEmail('');
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-24 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Member Club Login
            </h1>
            <p className="text-slate-600">
              Enter your email to receive a secure magic link
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Check your email
                </h2>
                <p className="text-slate-600 mb-6">
                  We've sent you a magic link. Click the link in the email to access your investor dashboard.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Send another link
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="investor@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-300 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        transition-all text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#0F4C81] to-[#1E2A4A] 
                    text-white rounded-lg font-medium
                    hover:from-[#0d3f6b] hover:to-[#151f37]
                    transition-all disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 group"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      Send Magic Link
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <p className="mt-6 text-center text-sm text-slate-600">
                  By logging in, you agree to access the Aprikos Venture Private Lounge for informational purposes only.
                </p>
              </form>
            )}
          </div>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Back to homepage
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

