import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [contactLoading, setContactLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactLoading(true);
    const formData = new FormData(e.target);
    
    try {
      await axios.post(`${API}/contact`, {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message')
      });
      toast.success('Thank you! We will contact you soon.');
      e.target.reset();
    } catch (error) {
      toast.error('Failed to submit. Please try again.');
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">FinWise</span>
          </div>
          <Button 
            onClick={handleLogin}
            data-testid="login-button"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium"
          >
            Sign In with Google
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
            AI-Powered Financial Solutions for Rural India
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            आपका विश्वसनीय
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Financial Partner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Banking consultancy, tax filing, property verification, and personal finance advice—all in one place. 
            Designed for rural and semi-urban India with simple Hindi & English support.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleLogin}
              data-testid="hero-get-started-button"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={() => document.getElementById('contact-section').scrollIntoView({ behavior: 'smooth' })}
              variant="outline"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 rounded-full text-lg font-semibold"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              सभी सेवाएं एक जगह
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Complete financial solutions designed for Indian rural customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Banking Consultancy */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Banking Consultancy</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Loan eligibility, investment advice, savings plans, and credit score analysis for rural customers.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  Kisan Credit Card guidance
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  PMJDY account benefits
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  Mudra loan eligibility
                </li>
              </ul>
            </Card>

            {/* Property Services */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Property Services</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Legal verification, encumbrance check, and AI-powered property valuation for rural land & houses.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  7/12 document verification
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  Property ownership check
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  Market valuation in ₹
                </li>
              </ul>
            </Card>

            {/* Tax Filing */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Tax Filing</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Simple tax calculator for farmers and rural income with optimization tips in Hindi.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Agriculture income tax
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Section 80 deductions
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Simple ITR filing
                </li>
              </ul>
            </Card>

            {/* AI Advisor */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Financial Advisor</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">24/7 AI advisor understanding rural India context with answers in simple language.</p>
            </Card>

            {/* Government Schemes */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Government Schemes</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Information on PM-KISAN, PMAY, and other rural development schemes.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 px-6 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Contact Us / संपर्क करें
            </h2>
            <p className="text-lg text-slate-600">
              Have questions? We're here to help. Reach out to us!
            </p>
          </div>

          <Card className="p-8 lg:p-12 rounded-2xl border-2 border-slate-100">
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="contact-name">Name / नाम *</Label>
                  <Input 
                    id="contact-name" 
                    name="name" 
                    data-testid="contact-name-input"
                    placeholder="Your name"
                    required 
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone / फ़ोन *</Label>
                  <Input 
                    id="contact-phone" 
                    name="phone" 
                    data-testid="contact-phone-input"
                    placeholder="+91 98765 43210"
                    required 
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="contact-email">Email *</Label>
                <Input 
                  id="contact-email" 
                  name="email" 
                  data-testid="contact-email-input"
                  type="email" 
                  placeholder="your.email@example.com"
                  required 
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="contact-message">Message / संदेश *</Label>
                <Textarea 
                  id="contact-message" 
                  name="message" 
                  data-testid="contact-message-input"
                  placeholder="How can we help you?"
                  rows={5}
                  required 
                  className="mt-2"
                />
              </div>
              <Button 
                type="submit" 
                data-testid="contact-submit-button"
                disabled={contactLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl text-lg font-semibold"
              >
                {contactLoading ? 'Submitting...' : 'Submit / जमा करें'}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join thousands of rural customers making smarter financial decisions.
          </p>
          <Button 
            onClick={handleLogin}
            data-testid="cta-get-started-button"
            className="bg-white text-emerald-600 hover:bg-emerald-50 px-10 py-6 rounded-full text-lg font-semibold shadow-xl hover:shadow-2xl"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <span className="text-xl font-bold text-white">FinWise</span>
          </div>
          <p className="text-sm">
            © 2025 FinWise. All rights reserved. | Serving Rural India with Pride
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
