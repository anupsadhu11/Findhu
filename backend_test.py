#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import time

class FinancialAppTester:
    def __init__(self, base_url="https://finwise-76.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.passed_tests = []

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            self.passed_tests.append(name)
            print(f"✅ {name}")
        else:
            self.failed_tests.append({"test": name, "details": details})
            print(f"❌ {name} - {details}")

    def create_test_session(self):
        """Create a test session using MongoDB directly"""
        print("\n🔧 Setting up test session...")
        
        # Create test user and session in MongoDB
        import subprocess
        
        user_id = f"test-user-{int(time.time())}"
        session_token = f"test_session_{int(time.time())}"
        
        mongo_script = f"""
        use('test_database');
        var userId = '{user_id}';
        var sessionToken = '{session_token}';
        
        // Insert test user
        db.users.insertOne({{
          id: userId,
          email: 'test.user.' + Date.now() + '@example.com',
          name: 'Test User',
          picture: 'https://via.placeholder.com/150',
          created_at: new Date().toISOString()
        }});
        
        // Insert test session
        db.user_sessions.insertOne({{
          user_id: userId,
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
          created_at: new Date().toISOString()
        }});
        
        print('Test session created successfully');
        """
        
        try:
            result = subprocess.run(
                ['mongosh', '--eval', mongo_script],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                self.session_token = session_token
                self.user_id = user_id
                print(f"✅ Test session created: {session_token}")
                return True
            else:
                print(f"❌ Failed to create test session: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ Error creating test session: {str(e)}")
            return False

    def make_request(self, method, endpoint, data=None, params=None):
        """Make authenticated API request"""
        url = f"{self.api_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, params=params, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=30)
            
            return response
        except requests.exceptions.Timeout:
            return None
        except Exception as e:
            print(f"Request error: {str(e)}")
            return None

    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        print("\n🔐 Testing Authentication Endpoints...")
        
        # Test /auth/me
        response = self.make_request('GET', 'auth/me')
        if response and response.status_code == 200:
            user_data = response.json()
            if 'id' in user_data and 'email' in user_data:
                self.log_test("GET /auth/me", True)
            else:
                self.log_test("GET /auth/me", False, "Missing user data fields")
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /auth/me", False, f"Status: {status}")

    def test_banking_endpoints(self):
        """Test banking consultancy endpoints"""
        print("\n🏦 Testing Banking Consultancy Endpoints...")
        
        # Test loan eligibility check
        loan_data = {
            "loan_type": "personal",
            "amount": 50000,
            "purpose": "Home renovation",
            "annual_income": 75000,
            "credit_score": 720,
            "existing_loans": 10000
        }
        
        response = self.make_request('POST', 'banking/loan/check-eligibility', loan_data)
        if response and response.status_code == 200:
            result = response.json()
            if 'eligibility_score' in result and 'recommendations' in result:
                self.log_test("POST /banking/loan/check-eligibility", True)
            else:
                self.log_test("POST /banking/loan/check-eligibility", False, "Missing response fields")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /banking/loan/check-eligibility", False, f"Status: {status}")
        
        # Test investment analysis
        investment_data = {
            "investment_amount": 25000,
            "risk_tolerance": "medium",
            "investment_horizon": "3-7 years"
        }
        
        response = self.make_request('POST', 'banking/investment/analyze', investment_data)
        if response and response.status_code == 200:
            result = response.json()
            if 'recommendations' in result:
                self.log_test("POST /banking/investment/analyze", True)
            else:
                self.log_test("POST /banking/investment/analyze", False, "Missing recommendations")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /banking/investment/analyze", False, f"Status: {status}")
        
        # Test savings plan
        params = {
            "goal_amount": 20000,
            "timeline_months": 24,
            "monthly_income": 5000
        }
        
        response = self.make_request('POST', 'banking/savings/plan', {}, params)
        if response and response.status_code == 200:
            result = response.json()
            if 'plan' in result and 'monthly_target' in result:
                self.log_test("POST /banking/savings/plan", True)
            else:
                self.log_test("POST /banking/savings/plan", False, "Missing plan data")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /banking/savings/plan", False, f"Status: {status}")
        
        # Test credit score analysis
        params = {
            "credit_score": 680,
            "payment_history": "good",
            "credit_utilization": 30
        }
        
        response = self.make_request('POST', 'banking/credit-score/analyze', {}, params)
        if response and response.status_code == 200:
            result = response.json()
            if 'analysis' in result and 'score_category' in result:
                self.log_test("POST /banking/credit-score/analyze", True)
            else:
                self.log_test("POST /banking/credit-score/analyze", False, "Missing analysis data")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /banking/credit-score/analyze", False, f"Status: {status}")

    def test_tax_endpoints(self):
        """Test tax filing endpoints"""
        print("\n📊 Testing Tax Filing Endpoints...")
        
        # Test tax calculation
        tax_data = {
            "tax_year": 2024,
            "annual_income": 75000,
            "deductions": 12000,
            "dependents": 1,
            "filing_status": "single"
        }
        
        response = self.make_request('POST', 'tax/calculate', tax_data)
        if response and response.status_code == 200:
            result = response.json()
            if 'tax_owed' in result and 'optimization_tips' in result:
                self.log_test("POST /tax/calculate", True)
            else:
                self.log_test("POST /tax/calculate", False, "Missing calculation data")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /tax/calculate", False, f"Status: {status}")
        
        # Test tax history
        response = self.make_request('GET', 'tax/history')
        if response and response.status_code == 200:
            self.log_test("GET /tax/history", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /tax/history", False, f"Status: {status}")

    def test_finance_endpoints(self):
        """Test personal finance endpoints"""
        print("\n💰 Testing Personal Finance Endpoints...")
        
        # Test budget creation
        budget_data = {
            "category": "Food",
            "amount": 500,
            "period": "monthly"
        }
        
        response = self.make_request('POST', 'finance/budget', budget_data)
        if response and response.status_code == 200:
            self.log_test("POST /finance/budget", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /finance/budget", False, f"Status: {status}")
        
        # Test get budgets
        response = self.make_request('GET', 'finance/budget')
        if response and response.status_code == 200:
            self.log_test("GET /finance/budget", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /finance/budget", False, f"Status: {status}")
        
        # Test transaction creation
        transaction_data = {
            "category": "Salary",
            "amount": 3000,
            "description": "Monthly salary",
            "date": datetime.now().isoformat(),
            "type": "income"
        }
        
        response = self.make_request('POST', 'finance/transaction', transaction_data)
        if response and response.status_code == 200:
            self.log_test("POST /finance/transaction", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /finance/transaction", False, f"Status: {status}")
        
        # Test get transactions
        response = self.make_request('GET', 'finance/transactions')
        if response and response.status_code == 200:
            self.log_test("GET /finance/transactions", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /finance/transactions", False, f"Status: {status}")
        
        # Test bill creation
        bill_data = {
            "name": "Electric Bill",
            "amount": 150,
            "due_date": "2025-02-15",
            "recurring": True,
            "reminder_days": 3
        }
        
        response = self.make_request('POST', 'finance/bill', bill_data)
        if response and response.status_code == 200:
            self.log_test("POST /finance/bill", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /finance/bill", False, f"Status: {status}")
        
        # Test get bills
        response = self.make_request('GET', 'finance/bills')
        if response and response.status_code == 200:
            self.log_test("GET /finance/bills", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /finance/bills", False, f"Status: {status}")
        
        # Test goal creation
        goal_data = {
            "name": "Emergency Fund",
            "target_amount": 10000,
            "current_amount": 2000,
            "deadline": "2025-12-31",
            "priority": "high"
        }
        
        response = self.make_request('POST', 'finance/goal', goal_data)
        if response and response.status_code == 200:
            self.log_test("POST /finance/goal", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /finance/goal", False, f"Status: {status}")
        
        # Test get goals
        response = self.make_request('GET', 'finance/goals')
        if response and response.status_code == 200:
            self.log_test("GET /finance/goals", True)
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /finance/goals", False, f"Status: {status}")
        
        # Test dashboard
        response = self.make_request('GET', 'finance/dashboard')
        if response and response.status_code == 200:
            result = response.json()
            if 'summary' in result:
                self.log_test("GET /finance/dashboard", True)
            else:
                self.log_test("GET /finance/dashboard", False, "Missing summary data")
        else:
            status = response.status_code if response else "No response"
            self.log_test("GET /finance/dashboard", False, f"Status: {status}")

    def test_ai_advisor(self):
        """Test AI advisor endpoint"""
        print("\n🤖 Testing AI Advisor Endpoint...")
        
        advice_data = {
            "query": "How should I allocate my savings between emergency fund and investments?"
        }
        
        response = self.make_request('POST', 'finance/ai-advice', advice_data)
        if response and response.status_code == 200:
            result = response.json()
            if 'advice' in result and result['advice']:
                self.log_test("POST /finance/ai-advice", True)
            else:
                self.log_test("POST /finance/ai-advice", False, "Empty or missing advice")
        else:
            status = response.status_code if response else "No response"
            self.log_test("POST /finance/ai-advice", False, f"Status: {status}")

    def cleanup_test_data(self):
        """Clean up test data from MongoDB"""
        print("\n🧹 Cleaning up test data...")
        
        if not self.user_id:
            return
        
        import subprocess
        
        cleanup_script = f"""
        use('test_database');
        
        // Remove test user and session
        db.users.deleteOne({{id: '{self.user_id}'}});
        db.user_sessions.deleteOne({{user_id: '{self.user_id}'}});
        
        // Remove test data created during testing
        db.budgets.deleteMany({{user_id: '{self.user_id}'}});
        db.transactions.deleteMany({{user_id: '{self.user_id}'}});
        db.bills.deleteMany({{user_id: '{self.user_id}'}});
        db.financial_goals.deleteMany({{user_id: '{self.user_id}'}});
        db.loan_applications.deleteMany({{user_id: '{self.user_id}'}});
        db.investment_analysis.deleteMany({{user_id: '{self.user_id}'}});
        db.tax_calculations.deleteMany({{user_id: '{self.user_id}'}});
        db.ai_consultations.deleteMany({{user_id: '{self.user_id}'}});
        
        print('Test data cleaned up');
        """
        
        try:
            subprocess.run(['mongosh', '--eval', cleanup_script], timeout=30)
            print("✅ Test data cleaned up")
        except Exception as e:
            print(f"⚠️  Cleanup warning: {str(e)}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Financial App Backend Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Setup test session
        if not self.create_test_session():
            print("❌ Failed to create test session. Exiting.")
            return False
        
        try:
            # Run all test suites
            self.test_auth_endpoints()
            self.test_banking_endpoints()
            self.test_tax_endpoints()
            self.test_finance_endpoints()
            self.test_ai_advisor()
            
        finally:
            # Always cleanup
            self.cleanup_test_data()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Tests Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ Failed Tests:")
            for test in self.failed_tests:
                print(f"  - {test['test']}: {test['details']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = FinancialAppTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())