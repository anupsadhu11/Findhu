import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const PersonalFinance = () => {
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [bills, setBills] = useState([]);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [budgetRes, transRes, billRes, goalRes] = await Promise.all([
        axios.get(`${API}/finance/budget`, { withCredentials: true }),
        axios.get(`${API}/finance/transactions?limit=50`, { withCredentials: true }),
        axios.get(`${API}/finance/bills`, { withCredentials: true }),
        axios.get(`${API}/finance/goals`, { withCredentials: true })
      ]);
      setBudgets(budgetRes.data);
      setTransactions(transRes.data);
      setBills(billRes.data);
      setGoals(goalRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${API}/finance/budget`, {
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        period: formData.get('period')
      }, { withCredentials: true });
      toast.success('Budget added successfully!');
      fetchAllData();
      e.target.reset();
    } catch (error) {
      toast.error('Failed to add budget');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${API}/finance/transaction`, {
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description'),
        date: new Date(formData.get('date')).toISOString(),
        type: formData.get('type')
      }, { withCredentials: true });
      toast.success('Transaction added successfully!');
      fetchAllData();
      e.target.reset();
    } catch (error) {
      toast.error('Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${API}/finance/bill`, {
        name: formData.get('name'),
        amount: parseFloat(formData.get('amount')),
        due_date: formData.get('due_date'),
        recurring: formData.get('recurring') === 'true',
        reminder_days: parseInt(formData.get('reminder_days'))
      }, { withCredentials: true });
      toast.success('Bill added successfully!');
      fetchAllData();
      e.target.reset();
    } catch (error) {
      toast.error('Failed to add bill');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      await axios.post(`${API}/finance/goal`, {
        name: formData.get('name'),
        target_amount: parseFloat(formData.get('target_amount')),
        current_amount: parseFloat(formData.get('current_amount')) || 0,
        deadline: formData.get('deadline'),
        priority: formData.get('priority')
      }, { withCredentials: true });
      toast.success('Goal added successfully!');
      fetchAllData();
      e.target.reset();
    } catch (error) {
      toast.error('Failed to add goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="p-6 lg:p-8" data-testid="personal-finance">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Personal Finance
          </h1>
          <p className="text-slate-600">Track budgets, expenses, bills, and goals</p>
        </div>

        <Tabs defaultValue="budget" className="space-y-6">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="budget" data-testid="tab-budget">Budget</TabsTrigger>
            <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
            <TabsTrigger value="bills" data-testid="tab-bills">Bills</TabsTrigger>
            <TabsTrigger value="goals" data-testid="tab-goals">Goals</TabsTrigger>
          </TabsList>

          {/* Budget */}
          <TabsContent value="budget">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Budget</h2>
                <form onSubmit={handleAddBudget} className="space-y-4">
                  <div>
                    <Label htmlFor="budget-category">Category</Label>
                    <Input id="budget-category" name="category" data-testid="budget-category-input" placeholder="Food" required />
                  </div>
                  <div>
                    <Label htmlFor="budget-amount">Amount ($)</Label>
                    <Input id="budget-amount" name="amount" data-testid="budget-amount-input" type="number" placeholder="500" required />
                  </div>
                  <div>
                    <Label htmlFor="budget-period">Period</Label>
                    <Select name="period" required>
                      <SelectTrigger id="budget-period" data-testid="budget-period-select">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" data-testid="add-budget-button" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    {loading ? 'Adding...' : 'Add Budget'}
                  </Button>
                </form>
              </Card>

              <Card className="p-6 rounded-2xl border-2 border-slate-100 lg:col-span-2">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Your Budgets</h2>
                {budgets.length > 0 ? (
                  <div className="space-y-3">
                    {budgets.map((budget, index) => {
                      const percentage = (budget.spent / budget.amount) * 100;
                      return (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-900">{budget.category}</span>
                            <span className="text-sm text-slate-600">{budget.period}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">${budget.spent} / ${budget.amount}</span>
                            <span className={`text-sm font-medium ${percentage > 90 ? 'text-rose-600' : percentage > 70 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${percentage > 90 ? 'bg-rose-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No budgets yet. Add your first budget!</p>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Transactions */}
          <TabsContent value="transactions">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Transaction</h2>
                <form onSubmit={handleAddTransaction} className="space-y-4">
                  <div>
                    <Label htmlFor="transaction-type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger id="transaction-type" data-testid="transaction-type-select">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="transaction-category">Category</Label>
                    <Input id="transaction-category" name="category" data-testid="transaction-category-input" placeholder="Salary" required />
                  </div>
                  <div>
                    <Label htmlFor="transaction-amount">Amount ($)</Label>
                    <Input id="transaction-amount" name="amount" data-testid="transaction-amount-input" type="number" placeholder="1000" required />
                  </div>
                  <div>
                    <Label htmlFor="transaction-description">Description</Label>
                    <Input id="transaction-description" name="description" data-testid="transaction-description-input" placeholder="Monthly salary" required />
                  </div>
                  <div>
                    <Label htmlFor="transaction-date">Date</Label>
                    <Input id="transaction-date" name="date" data-testid="transaction-date-input" type="date" required />
                  </div>
                  <Button type="submit" data-testid="add-transaction-button" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700">
                    {loading ? 'Adding...' : 'Add Transaction'}
                  </Button>
                </form>
              </Card>

              <Card className="p-6 rounded-2xl border-2 border-slate-100 lg:col-span-2">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Transactions</h2>
                {transactions.length > 0 ? (
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {transactions.map((transaction, index) => (
                      <div key={index} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
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
                            <p className="text-xs text-slate-500">{transaction.category} • {new Date(transaction.date).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <span className={`font-semibold ${
                          transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No transactions yet</p>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Bills */}
          <TabsContent value="bills">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Bill</h2>
                <form onSubmit={handleAddBill} className="space-y-4">
                  <div>
                    <Label htmlFor="bill-name">Bill Name</Label>
                    <Input id="bill-name" name="name" data-testid="bill-name-input" placeholder="Electric Bill" required />
                  </div>
                  <div>
                    <Label htmlFor="bill-amount">Amount ($)</Label>
                    <Input id="bill-amount" name="amount" data-testid="bill-amount-input" type="number" placeholder="150" required />
                  </div>
                  <div>
                    <Label htmlFor="bill-due-date">Due Date</Label>
                    <Input id="bill-due-date" name="due_date" data-testid="bill-due-date-input" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="bill-recurring">Recurring</Label>
                    <Select name="recurring" defaultValue="true">
                      <SelectTrigger id="bill-recurring" data-testid="bill-recurring-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="bill-reminder">Reminder (days before)</Label>
                    <Input id="bill-reminder" name="reminder_days" data-testid="bill-reminder-input" type="number" defaultValue="3" />
                  </div>
                  <Button type="submit" data-testid="add-bill-button" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700">
                    {loading ? 'Adding...' : 'Add Bill'}
                  </Button>
                </form>
              </Card>

              <Card className="p-6 rounded-2xl border-2 border-slate-100 lg:col-span-2">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Upcoming Bills</h2>
                {bills.length > 0 ? (
                  <div className="space-y-3">
                    {bills.map((bill, index) => (
                      <div key={index} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{bill.name}</p>
                            <p className="text-sm text-slate-600">
                              Due: {bill.due_date} • {bill.recurring ? 'Recurring' : 'One-time'}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              Reminder: {bill.reminder_days} days before
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-amber-600">${bill.amount}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              bill.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No bills added yet</p>
                )}
              </Card>
            </div>
          </TabsContent>

          {/* Goals */}
          <TabsContent value="goals">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="p-6 rounded-2xl border-2 border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add Goal</h2>
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input id="goal-name" name="name" data-testid="goal-name-input" placeholder="Emergency Fund" required />
                  </div>
                  <div>
                    <Label htmlFor="goal-target">Target Amount ($)</Label>
                    <Input id="goal-target" name="target_amount" data-testid="goal-target-input" type="number" placeholder="10000" required />
                  </div>
                  <div>
                    <Label htmlFor="goal-current">Current Amount ($)</Label>
                    <Input id="goal-current" name="current_amount" data-testid="goal-current-input" type="number" placeholder="2000" defaultValue="0" />
                  </div>
                  <div>
                    <Label htmlFor="goal-deadline">Deadline</Label>
                    <Input id="goal-deadline" name="deadline" data-testid="goal-deadline-input" type="date" required />
                  </div>
                  <div>
                    <Label htmlFor="goal-priority">Priority</Label>
                    <Select name="priority" required>
                      <SelectTrigger id="goal-priority" data-testid="goal-priority-select">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" data-testid="add-goal-button" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
                    {loading ? 'Adding...' : 'Add Goal'}
                  </Button>
                </form>
              </Card>

              <Card className="p-6 rounded-2xl border-2 border-slate-100 lg:col-span-2">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Financial Goals</h2>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.map((goal, index) => {
                      const percentage = (goal.current_amount / goal.target_amount) * 100;
                      return (
                        <div key={index} className="p-4 bg-slate-50 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-900">{goal.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              goal.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                              goal.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-slate-200 text-slate-700'
                            }`}>
                              {goal.priority} priority
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">
                              ${goal.current_amount?.toLocaleString()} / ${goal.target_amount?.toLocaleString()}
                            </span>
                            <span className="text-sm text-slate-600">
                              Deadline: {goal.deadline}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                            <div
                              className="bg-cyan-500 h-3 rounded-full transition-all"
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-slate-500">{percentage.toFixed(1)}% complete</p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No goals set yet</p>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PersonalFinance;
