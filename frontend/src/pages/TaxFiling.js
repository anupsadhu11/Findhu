import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const TaxFiling = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const [taxData, setTaxData] = useState({
    tax_year: new Date().getFullYear(),
    annual_income: '',
    deductions: '',
    dependents: '',
    filing_status: ''
  });

  useEffect(() => {
    fetchTaxHistory();
  }, []);

  const fetchTaxHistory = async () => {
    try {
      const response = await axios.get(`${API}/tax/history`, { withCredentials: true });
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to fetch tax history:', error);
    }
  };

  const handleCalculateTax = async () => {
    if (!taxData.annual_income || !taxData.deductions || !taxData.filing_status) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API}/tax/calculate`,
        {
          ...taxData,
          dependents: parseInt(taxData.dependents) || 0
        },
        { withCredentials: true }
      );
      setResult(response.data);
      toast.success('Tax calculation complete!');
      fetchTaxHistory();
    } catch (error) {
      toast.error('Failed to calculate tax');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileITR = () => {
    // Redirect to Income Tax e-Filing portal
    window.open('https://www.incometax.gov.in/iec/folitr/', '_blank');
    toast.success('Opening Income Tax e-Filing portal...');
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8" data-testid="tax-filing">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Tax Filing Service
            </h1>
            <p className="text-slate-600">Calculate taxes and get optimization tips</p>
          </div>
          <Button 
            onClick={handleFileITR}
            data-testid="file-itr-button"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-6 rounded-xl font-semibold flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>File ITR Online</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Tax Calculator */}
          <Card className="p-6 rounded-2xl border-2 border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Tax Calculator</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tax-year">Tax Year</Label>
                <Input
                  id="tax-year"
                  data-testid="tax-year-input"
                  type="number"
                  value={taxData.tax_year}
                  onChange={(e) => setTaxData({...taxData, tax_year: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="annual-income-tax">Annual Income (₹)</Label>
                <Input
                  id="annual-income-tax"
                  data-testid="annual-income-tax-input"
                  type="number"
                  placeholder="750000"
                  value={taxData.annual_income}
                  onChange={(e) => setTaxData({...taxData, annual_income: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="deductions">Deductions (₹)</Label>
                <Input
                  id="deductions"
                  data-testid="deductions-input"
                  type="number"
                  placeholder="50000"
                  value={taxData.deductions}
                  onChange={(e) => setTaxData({...taxData, deductions: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="dependents">Number of Dependents</Label>
                <Input
                  id="dependents"
                  data-testid="dependents-input"
                  type="number"
                  placeholder="0"
                  value={taxData.dependents}
                  onChange={(e) => setTaxData({...taxData, dependents: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="filing-status">Filing Status</Label>
                <Select onValueChange={(value) => setTaxData({...taxData, filing_status: value})}>
                  <SelectTrigger id="filing-status" data-testid="filing-status-select">
                    <SelectValue placeholder="Select filing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_joint">Married Filing Jointly</SelectItem>
                    <SelectItem value="married_separate">Married Filing Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleCalculateTax}
                data-testid="calculate-tax-button"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-xl font-semibold"
              >
                {loading ? 'Calculating...' : 'Calculate Tax'}
              </Button>
            </div>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {result && (
              <Card className="p-6 rounded-2xl border-2 border-teal-100 bg-teal-50/50" data-testid="tax-result">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Tax Calculation Result</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Taxable Income</p>
                    <p className="text-2xl font-bold text-slate-900">${result.taxable_income?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-slate-600 mb-1">Tax Owed</p>
                    <p className="text-2xl font-bold text-rose-600">${result.tax_owed?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 col-span-2">
                    <p className="text-sm text-slate-600 mb-1">Effective Tax Rate</p>
                    <p className="text-2xl font-bold text-teal-600">{result.effective_rate}%</p>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4">
                  <h4 className="font-semibold text-slate-900 mb-2">Optimization Tips</h4>
                  <p className="text-slate-700 whitespace-pre-wrap text-sm">{result.optimization_tips}</p>
                </div>
              </Card>
            )}

            {/* Tax History */}
            {history.length > 0 && (
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Tax History</h3>
                <div className="space-y-3">
                  {history.slice(0, 5).map((item, index) => (
                    <div key={index} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{item.tax_year}</span>
                        <span className="text-rose-600 font-semibold">${item.tax_owed?.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-slate-600">
                        <p>Income: ${item.income?.toLocaleString()}</p>
                        <p>Deductions: ${item.deductions?.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaxFiling;
