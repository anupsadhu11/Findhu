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
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="loan" data-testid="tab-loan">Loan Eligibility</TabsTrigger>
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
                    <Label htmlFor="loan-amount">Loan Amount ($)</Label>
                    <Input
                      id="loan-amount"
                      data-testid="loan-amount-input"
                      type="number"
                      placeholder="50000"
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
                    <Label htmlFor="annual-income">Annual Income ($)</Label>
                    <Input
                      id="annual-income"
                      data-testid="annual-income-input"
                      type="number"
                      placeholder="75000"
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
                    <Label htmlFor="existing-loans">Existing Loans ($)</Label>
                    <Input
                      id="existing-loans"
                      data-testid="existing-loans-input"
                      type="number"
                      placeholder="10000"
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

          {/* Investment Analysis */}
          <TabsContent value="investment">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Investment Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                    <Input
                      id="investment-amount"
                      data-testid="investment-amount-input"
                      type="number"
                      placeholder="25000"
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
                    <Label htmlFor="goal-amount">Goal Amount ($)</Label>
                    <Input
                      id="goal-amount"
                      data-testid="goal-amount-input"
                      type="number"
                      placeholder="20000"
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
                    <Label htmlFor="monthly-income-savings">Monthly Income ($)</Label>
                    <Input
                      id="monthly-income-savings"
                      data-testid="monthly-income-savings-input"
                      type="number"
                      placeholder="5000"
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
