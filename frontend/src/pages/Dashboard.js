import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '../components/Layout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="p-6 lg:p-8" data-testid="dashboard">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-600">Here's your financial overview</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => navigate('/banking')}
            data-testid="quick-action-banking"
            className="h-auto p-6 bg-white hover:bg-emerald-50 border-2 border-slate-200 hover:border-emerald-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">Banking Consultancy</span>
            <span className="text-slate-600 text-sm mt-1">Loans & Investments</span>
          </Button>

          <Button 
            onClick={() => navigate('/property')}
            data-testid="quick-action-property"
            className="h-auto p-6 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">Property Services</span>
            <span className="text-slate-600 text-sm mt-1">Legal & Valuation</span>
          </Button>

          <Button 
            onClick={() => navigate('/tax')}
            data-testid="quick-action-tax"
            className="h-auto p-6 bg-white hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">Tax Filing</span>
            <span className="text-slate-600 text-sm mt-1">Calculate & Optimize</span>
          </Button>

          <Button 
            onClick={() => navigate('/ai-advisor')}
            data-testid="quick-action-ai"
            className="h-auto p-6 bg-white hover:bg-violet-50 border-2 border-slate-200 hover:border-violet-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">AI Advisor</span>
            <span className="text-slate-600 text-sm mt-1">Get Advice</span>
          </Button>
        </div>

        {/* Welcome Message */}
        <Card className="p-8 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Welcome to FinWise - Your Financial Consultancy Partner
            </h2>
            <p className="text-slate-600 mb-6">
              Get expert guidance on banking, property, tax, and financial planning. Select a service below to get started.
            </p>
            <div className="flex items-center justify-center space-x-2 text-emerald-700">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">All services powered by AI</span>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
