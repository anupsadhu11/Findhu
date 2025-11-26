import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Landing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = () => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
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
            AI-Powered Financial Solutions
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 mb-6 leading-tight">
            Your Complete
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
              Financial Partner
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Banking consultancy, tax filing, and personal finance advice—all powered by advanced AI. 
            Make smarter financial decisions with expert guidance at your fingertips.
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
              variant="outline"
              className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-6 rounded-full text-lg font-semibold"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Comprehensive financial solutions designed to help you succeed
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
              <p className="text-slate-600 mb-4 leading-relaxed">Loan eligibility checks, investment advice, savings plans, and credit score analysis—all in one place.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  Instant loan eligibility
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  Portfolio recommendations
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                  Credit score insights
                </li>
              </ul>
            </Card>

            {/* Tax Filing */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Tax Filing Service</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Smart tax calculations, document management, and AI-powered optimization to maximize your returns.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  Automated calculations
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  Document organization
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                  Tax optimization tips
                </li>
              </ul>
            </Card>

            {/* Personal Finance */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Personal Finance</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Track budgets, manage expenses, set financial goals, and get AI recommendations tailored to you.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Budget tracking
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Bill reminders
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                  Goal planning
                </li>
              </ul>
            </Card>

            {/* AI Advisor */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Financial Advisor</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Chat with GPT-5.1 for personalized financial advice, insights, and strategies based on your unique situation.</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                  24/7 AI assistance
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                  Personalized advice
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                  Context-aware responses
                </li>
              </ul>
            </Card>

            {/* Investment Advisory */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Investment Advisory</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Get personalized portfolio recommendations based on your risk tolerance and financial goals.</p>
            </Card>

            {/* Savings Plans */}
            <Card className="p-8 border-2 border-slate-100 hover:border-emerald-200 hover:shadow-xl transition-all duration-300 rounded-2xl card-hover">
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Savings Plans</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">Create customized savings strategies to reach your financial milestones faster.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join thousands of users making smarter financial decisions every day.
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
            © 2025 FinWise. All rights reserved. | Powered by AI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
