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
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API}/finance/dashboard`, { withCredentials: true });
      setDashboard(response.data);
    } catch (error) {
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </Layout>
    );
  }

  const summary = dashboard?.summary || {};

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

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-100 text-sm font-medium">Total Income</span>
              <svg className="w-8 h-8 text-emerald-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">₹{summary.total_income?.toLocaleString('en-IN') || '0'}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-rose-500 to-pink-600 text-white rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-rose-100 text-sm font-medium">Total Expense</span>
              <svg className="w-8 h-8 text-rose-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">₹{summary.total_expense?.toLocaleString('en-IN') || '0'}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-teal-100 text-sm font-medium">Savings</span>
              <svg className="w-8 h-8 text-teal-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">₹{summary.savings?.toLocaleString('en-IN') || '0'}</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-amber-100 text-sm font-medium">Upcoming Bills</span>
              <svg className="w-8 h-8 text-amber-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold">₹{summary.upcoming_bills_amount?.toLocaleString('en-IN') || '0'}</p>
          </Card>
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
            onClick={() => navigate('/tax')}
            data-testid="quick-action-tax"
            className="h-auto p-6 bg-white hover:bg-teal-50 border-2 border-slate-200 hover:border-teal-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">Tax Filing</span>
            <span className="text-slate-600 text-sm mt-1">Calculate & Optimize</span>
          </Button>

          <Button 
            onClick={() => navigate('/finance')}
            data-testid="quick-action-finance"
            className="h-auto p-6 bg-white hover:bg-cyan-50 border-2 border-slate-200 hover:border-cyan-300 text-left flex flex-col items-start rounded-2xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <span className="text-slate-900 font-semibold text-base">Personal Finance</span>
            <span className="text-slate-600 text-sm mt-1">Budget & Goals</span>
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

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card className="p-6 rounded-2xl border-2 border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Transactions</h2>
            {dashboard?.recent_transactions?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.recent_transactions.slice(0, 5).map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'income' ? 'bg-emerald-100' : 'bg-rose-100'
                      }`}>
                        <span className={transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}>
                          {transaction.type === 'income' ? '+' : '-'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{transaction.description}</p>
                        <p className="text-sm text-slate-500">{transaction.category}</p>
                      </div>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No transactions yet</p>
            )}
          </Card>

          {/* Upcoming Bills */}
          <Card className="p-6 rounded-2xl border-2 border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Bills</h2>
            {dashboard?.upcoming_bills?.length > 0 ? (
              <div className="space-y-3">
                {dashboard.upcoming_bills.map((bill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div>
                      <p className="font-medium text-slate-900">{bill.name}</p>
                      <p className="text-sm text-slate-500">Due: {bill.due_date}</p>
                    </div>
                    <span className="font-semibold text-amber-600">${bill.amount}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No upcoming bills</p>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
