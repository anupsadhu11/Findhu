import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BankingConsultancy = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Loan State
  const [loanData, setLoanData] = useState({
    loan_type: '',
    amount: '',
    purpose: '',
    annual_income: '',
    credit_score: '',
    existing_loans: ''
  });

  // Investment State
  const [investmentData, setInvestmentData] = useState({
    investment_amount: '',
    risk_tolerance: '',
    investment_horizon: ''
  });

  // Savings State
  const [savingsData, setSavingsData] = useState({
    goal_amount: '',
    timeline_months: '',
    monthly_income: ''
  });

  // Credit Score State
  const [creditData, setCreditData] = useState({
    credit_score: '',
    payment_history: '',
    credit_utilization: ''
  });

  // EMI Calculator State
  const [emiData, setEmiData] = useState({
    principal: '',
    interest_rate: '',
    tenure: '',
    tenure_type: 'months'
  });
  const [emiResult, setEmiResult] = useState(null);

  const handleLoanCheck = async () => {
    if (!loanData.loan_type || !loanData.amount || !loanData.annual_income || !loanData.credit_score) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/banking/loan/check-eligibility`,
        loanData,
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Loan eligibility check complete!');
    } catch (error) {
      toast.error('Failed to check loan eligibility');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvestmentAnalysis = async () => {
    if (!investmentData.investment_amount || !investmentData.risk_tolerance || !investmentData.investment_horizon) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/banking/investment/analyze`,
        investmentData,
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Investment analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze investment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavingsPlan = async () => {
    if (!savingsData.goal_amount || !savingsData.timeline_months || !savingsData.monthly_income) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/banking/savings/plan?goal_amount=${savingsData.goal_amount}&timeline_months=${savingsData.timeline_months}&monthly_income=${savingsData.monthly_income}`,
        {},
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Savings plan created!');
    } catch (error) {
      toast.error('Failed to create savings plan');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreditAnalysis = async () => {
    if (!creditData.credit_score || !creditData.payment_history || !creditData.credit_utilization) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/banking/credit-score/analyze?credit_score=${creditData.credit_score}&payment_history=${creditData.payment_history}&credit_utilization=${creditData.credit_utilization}`,
        {},
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Credit score analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze credit score');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEMI = () => {
    if (!emiData.principal || !emiData.interest_rate || !emiData.tenure) {
      toast.error('Please fill in all required fields');
      return;
    }

    const principal = parseFloat(emiData.principal);
    const annualRate = parseFloat(emiData.interest_rate);
    const monthlyRate = annualRate / 12 / 100;
    const tenureMonths = emiData.tenure_type === 'years' 
      ? parseInt(emiData.tenure) * 12 
      : parseInt(emiData.tenure);

    // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    const totalPayment = emi * tenureMonths;
    const totalInterest = totalPayment - principal;

    setEmiResult({
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principal: principal,
      tenureMonths: tenureMonths
    });

    toast.success('EMI calculated successfully!');
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8" data-testid="banking-consultancy">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Banking Consultancy
          </h1>
          <p className="text-slate-600">Expert financial guidance powered by AI</p>
        </div>

        <Tabs defaultValue="loan" className="space-y-6">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full max-w-5xl">
            <TabsTrigger value="loan" data-testid="tab-loan">Loan Eligibility</TabsTrigger>
            <TabsTrigger value="digital-loan" data-testid="tab-digital-loan">Digital Loans</TabsTrigger>
            <TabsTrigger value="emi" data-testid="tab-emi">EMI Calculator</TabsTrigger>
            <TabsTrigger value="investment" data-testid="tab-investment">Investment</TabsTrigger>
            <TabsTrigger value="savings" data-testid="tab-savings">Savings Plan</TabsTrigger>
            <TabsTrigger value="credit" data-testid="tab-credit">Credit Score</TabsTrigger>
          </TabsList>

          {/* Loan Eligibility */}
          <TabsContent value="loan">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Check Loan Eligibility</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="loan-type">Loan Type</Label>
                    <Select onValueChange={(value) => setLoanData({...loanData, loan_type: value})}>
                      <SelectTrigger id="loan-type" data-testid="loan-type-select">
                        <SelectValue placeholder="Select loan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="home">Home Loan</SelectItem>
                        <SelectItem value="auto">Auto Loan</SelectItem>
                        <SelectItem value="business">Business Loan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
                    <Input
                      id="loan-amount"
                      data-testid="loan-amount-input"
                      type="number"
                      placeholder="500000"
                      value={loanData.amount}
                      onChange={(e) => setLoanData({...loanData, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="loan-purpose">Purpose</Label>
                    <Input
                      id="loan-purpose"
                      data-testid="loan-purpose-input"
                      placeholder="Home renovation"
                      value={loanData.purpose}
                      onChange={(e) => setLoanData({...loanData, purpose: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="annual-income">Annual Income (₹)</Label>
                    <Input
                      id="annual-income"
                      data-testid="annual-income-input"
                      type="number"
                      placeholder="750000"
                      value={loanData.annual_income}
                      onChange={(e) => setLoanData({...loanData, annual_income: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="credit-score">Credit Score</Label>
                    <Input
                      id="credit-score"
                      data-testid="credit-score-input"
                      type="number"
                      placeholder="720"
                      value={loanData.credit_score}
                      onChange={(e) => setLoanData({...loanData, credit_score: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="existing-loans">Existing Loans (₹)</Label>
                    <Input
                      id="existing-loans"
                      data-testid="existing-loans-input"
                      type="number"
                      placeholder="100000"
                      value={loanData.existing_loans}
                      onChange={(e) => setLoanData({...loanData, existing_loans: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={handleLoanCheck}
                    data-testid="check-eligibility-button"
                    disabled={loading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Analyzing...' : 'Check Eligibility'}
                  </Button>
                </div>
              </Card>

              {result && (
                <Card className="p-6 rounded-2xl border-2 border-emerald-100 bg-emerald-50/50" data-testid="loan-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Analysis Result</h3>
                  {result.eligibility_score !== undefined && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Eligibility Score</span>
                        <span className="text-2xl font-bold text-emerald-600">{result.eligibility_score}/100</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div
                          className="bg-emerald-600 h-3 rounded-full"
                          style={{ width: `${result.eligibility_score}%` }}
                        ></div>
                      </div>
                      <p className="mt-2 text-sm font-medium">
                        Status: <span className={`
                          ${result.status === 'approved' ? 'text-emerald-600' : 
                            result.status === 'needs_review' ? 'text-amber-600' : 'text-rose-600'}
                        `}>{result.status?.replace('_', ' ').toUpperCase()}</span>
                      </p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Recommendations</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{result.recommendations || result.plan || result.analysis || result.advice}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Digital Loans - PNB */}
          <TabsContent value="digital-loan">
            <div className="space-y-6">
              <Card className="p-6 rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <img src="https://www.pnbindia.in/images/logo.png" alt="PNB Logo" className="w-12 h-12 object-contain" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Punjab National Bank</h2>
                    <p className="text-slate-600">Digital Loan Products - Apply Online</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  Apply for instant digital loans from India's trusted public sector bank. Quick approval, minimal documentation, and competitive interest rates.
                </p>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB Personal Loan</h3>
                  <p className="text-sm text-slate-600 mb-4">Quick personal loan up to ₹20 lakh with flexible tenure and competitive rates.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                      Instant approval
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                      Minimal documentation
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                      Interest from 10.25%
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/Personal-Loan.aspx', '_blank')}
                    data-testid="apply-personal-loan"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>

                {/* Home Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB Home Loan</h3>
                  <p className="text-sm text-slate-600 mb-4">Finance your dream home with attractive interest rates and long tenure options.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      Up to ₹5 Crore
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      Tenure up to 30 years
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></span>
                      Interest from 8.25%
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/Housing-Loan.aspx', '_blank')}
                    data-testid="apply-home-loan"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>

                {/* Car Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB Car Loan</h3>
                  <p className="text-sm text-slate-600 mb-4">Drive your dream car with easy financing options and quick processing.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                      Up to 90% financing
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                      Tenure up to 7 years
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></span>
                      Competitive rates
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/Car-Loan.aspx', '_blank')}
                    data-testid="apply-car-loan"
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>

                {/* Education Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB Education Loan</h3>
                  <p className="text-sm text-slate-600 mb-4">Fund your higher education in India and abroad with subsidized interest rates.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                      India & abroad studies
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                      Up to ₹1.5 Crore
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mr-2"></span>
                      Moratorium period
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/Education-Loan.aspx', '_blank')}
                    data-testid="apply-education-loan"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>

                {/* MSME Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB MSME Loan</h3>
                  <p className="text-sm text-slate-600 mb-4">Grow your small business with working capital and term loan facilities.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Mudra scheme support
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Collateral-free options
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2"></span>
                      Government subsidies
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/MSME-Loans.aspx', '_blank')}
                    data-testid="apply-msme-loan"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>

                {/* Agriculture Loan */}
                <Card className="p-6 rounded-2xl border-2 border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all card-hover">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">PNB Kisan Credit Card</h3>
                  <p className="text-sm text-slate-600 mb-4">Special loan scheme for farmers with flexible repayment and low interest.</p>
                  <ul className="space-y-2 text-sm text-slate-600 mb-4">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Crop & allied activities
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Interest subvention
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      Flexible repayment
                    </li>
                  </ul>
                  <Button
                    onClick={() => window.open('https://www.pnbindia.in/en/ui/Kisan-Credit-Card.aspx', '_blank')}
                    data-testid="apply-kcc-loan"
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl"
                  >
                    Apply Now
                  </Button>
                </Card>
              </div>

              <Card className="p-6 rounded-2xl border-2 border-slate-100 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Need Help Choosing?</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Not sure which loan is right for you? Our AI advisor can help you understand eligibility criteria, 
                  compare interest rates, and guide you through the application process.
                </p>
                <Button
                  onClick={() => window.location.href = '/ai-advisor'}
                  variant="outline"
                  className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                >
                  Ask AI Advisor
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* EMI Calculator */}
          <TabsContent value="emi">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">EMI Calculator</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="principal">Loan Amount (₹) *</Label>
                    <Input
                      id="principal"
                      data-testid="principal-input"
                      type="number"
                      placeholder="500000"
                      value={emiData.principal}
                      onChange={(e) => setEmiData({...emiData, principal: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interest-rate">Interest Rate (% per annum) *</Label>
                    <Input
                      id="interest-rate"
                      data-testid="interest-rate-input"
                      type="number"
                      step="0.1"
                      placeholder="8.5"
                      value={emiData.interest_rate}
                      onChange={(e) => setEmiData({...emiData, interest_rate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenure">Loan Tenure *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tenure"
                        data-testid="tenure-input"
                        type="number"
                        placeholder="24"
                        value={emiData.tenure}
                        onChange={(e) => setEmiData({...emiData, tenure: e.target.value})}
                        className="flex-1"
                      />
                      <Select 
                        value={emiData.tenure_type} 
                        onValueChange={(value) => setEmiData({...emiData, tenure_type: value})}
                      >
                        <SelectTrigger className="w-32" data-testid="tenure-type-select">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="months">Months</SelectItem>
                          <SelectItem value="years">Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button
                    onClick={calculateEMI}
                    data-testid="calculate-emi-button"
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl font-semibold"
                  >
                    Calculate EMI
                  </Button>
                </div>
              </Card>

              {emiResult && (
                <Card className="p-6 rounded-2xl border-2 border-violet-100 bg-violet-50/50" data-testid="emi-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">EMI Calculation Result</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Monthly EMI</p>
                      <p className="text-3xl font-bold text-violet-600">₹{emiResult.emi.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl">
                        <p className="text-sm text-slate-600 mb-1">Principal Amount</p>
                        <p className="text-xl font-bold text-slate-900">₹{emiResult.principal.toLocaleString('en-IN')}</p>
                      </div>
                      <div className="p-4 bg-white rounded-xl">
                        <p className="text-sm text-slate-600 mb-1">Total Interest</p>
                        <p className="text-xl font-bold text-amber-600">₹{emiResult.totalInterest.toLocaleString('en-IN')}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Total Payment (Principal + Interest)</p>
                      <p className="text-2xl font-bold text-slate-900">₹{emiResult.totalPayment.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                      <p className="text-sm text-emerald-800 mb-2">
                        <span className="font-semibold">Tenure:</span> {emiResult.tenureMonths} months
                      </p>
                      <p className="text-xs text-emerald-700">
                        Pay ₹{emiResult.emi.toLocaleString('en-IN')} every month for {emiResult.tenureMonths} months
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Investment Analysis */}
          <TabsContent value="investment">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Investment Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
                    <Input
                      id="investment-amount"
                      data-testid="investment-amount-input"
                      type="number"
                      placeholder="250000"
                      value={investmentData.investment_amount}
                      onChange={(e) => setInvestmentData({...investmentData, investment_amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                    <Select onValueChange={(value) => setInvestmentData({...investmentData, risk_tolerance: value})}>
                      <SelectTrigger id="risk-tolerance" data-testid="risk-tolerance-select">
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Conservative)</SelectItem>
                        <SelectItem value="medium">Medium (Moderate)</SelectItem>
                        <SelectItem value="high">High (Aggressive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="investment-horizon">Investment Horizon</Label>
                    <Select onValueChange={(value) => setInvestmentData({...investmentData, investment_horizon: value})}>
                      <SelectTrigger id="investment-horizon" data-testid="investment-horizon-select">
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3 years">Short-term (1-3 years)</SelectItem>
                        <SelectItem value="3-7 years">Medium-term (3-7 years)</SelectItem>
                        <SelectItem value="7+ years">Long-term (7+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleInvestmentAnalysis}
                    data-testid="analyze-investment-button"
                    disabled={loading}
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Analyzing...' : 'Get Investment Advice'}
                  </Button>
                </div>
              </Card>

              {result && result.recommendations && (
                <Card className="p-6 rounded-2xl border-2 border-teal-100 bg-teal-50/50" data-testid="investment-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Investment Recommendations</h3>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-slate-700 whitespace-pre-wrap">{result.recommendations}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Savings Plan */}
          <TabsContent value="savings">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Create Savings Plan</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="goal-amount">Goal Amount (₹)</Label>
                    <Input
                      id="goal-amount"
                      data-testid="goal-amount-input"
                      type="number"
                      placeholder="200000"
                      value={savingsData.goal_amount}
                      onChange={(e) => setSavingsData({...savingsData, goal_amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timeline-months">Timeline (Months)</Label>
                    <Input
                      id="timeline-months"
                      data-testid="timeline-months-input"
                      type="number"
                      placeholder="24"
                      value={savingsData.timeline_months}
                      onChange={(e) => setSavingsData({...savingsData, timeline_months: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="monthly-income-savings">Monthly Income (₹)</Label>
                    <Input
                      id="monthly-income-savings"
                      data-testid="monthly-income-savings-input"
                      type="number"
                      placeholder="50000"
                      value={savingsData.monthly_income}
                      onChange={(e) => setSavingsData({...savingsData, monthly_income: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={handleSavingsPlan}
                    data-testid="create-savings-plan-button"
                    disabled={loading}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Creating...' : 'Create Savings Plan'}
                  </Button>
                </div>
              </Card>

              {result && result.plan && (
                <Card className="p-6 rounded-2xl border-2 border-cyan-100 bg-cyan-50/50" data-testid="savings-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Your Savings Plan</h3>
                  {result.monthly_target && (
                    <div className="mb-4 p-4 bg-white rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Monthly Savings Target</p>
                      <p className="text-3xl font-bold text-cyan-600">${result.monthly_target}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Plan Details</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{result.plan}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Credit Score Analysis */}
          <TabsContent value="credit">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Credit Score Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="credit-score-analysis">Current Credit Score</Label>
                    <Input
                      id="credit-score-analysis"
                      data-testid="credit-score-analysis-input"
                      type="number"
                      placeholder="680"
                      value={creditData.credit_score}
                      onChange={(e) => setCreditData({...creditData, credit_score: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-history">Payment History</Label>
                    <Select onValueChange={(value) => setCreditData({...creditData, payment_history: value})}>
                      <SelectTrigger id="payment-history" data-testid="payment-history-select">
                        <SelectValue placeholder="Select payment history" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent (Never missed)</SelectItem>
                        <SelectItem value="good">Good (1-2 late payments)</SelectItem>
                        <SelectItem value="fair">Fair (3-5 late payments)</SelectItem>
                        <SelectItem value="poor">Poor (6+ late payments)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="credit-utilization">Credit Utilization (%)</Label>
                    <Input
                      id="credit-utilization"
                      data-testid="credit-utilization-input"
                      type="number"
                      placeholder="30"
                      value={creditData.credit_utilization}
                      onChange={(e) => setCreditData({...creditData, credit_utilization: e.target.value})}
                    />
                  </div>
                  <Button
                    onClick={handleCreditAnalysis}
                    data-testid="analyze-credit-button"
                    disabled={loading}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white py-6 rounded-xl font-semibold"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Credit Score'}
                  </Button>
                </div>
              </Card>

              {result && result.analysis && (
                <Card className="p-6 rounded-2xl border-2 border-violet-100 bg-violet-50/50" data-testid="credit-result">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Credit Analysis</h3>
                  {result.score_category && (
                    <div className="mb-4 p-4 bg-white rounded-xl">
                      <p className="text-sm text-slate-600 mb-1">Score Category</p>
                      <p className="text-2xl font-bold text-violet-600">{result.score_category}</p>
                    </div>
                  )}
                  <div className="bg-white rounded-xl p-4">
                    <h4 className="font-semibold text-slate-900 mb-2">Analysis & Recommendations</h4>
                    <p className="text-slate-700 whitespace-pre-wrap">{result.analysis}</p>
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BankingConsultancy;
