from fastapi import FastAPI, APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import httpx
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============ MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserSession(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class SessionRequest(BaseModel):
    session_id: str

class FinancialProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    annual_income: Optional[float] = None
    credit_score: Optional[int] = None
    assets: Optional[float] = None
    liabilities: Optional[float] = None
    risk_tolerance: Optional[str] = None  # low, medium, high
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertySearch(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    property_address: str
    property_type: str
    search_type: str  # legal_verification, ownership, encumbrance
    status: str = "pending"
    results: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertySearchRequest(BaseModel):
    property_address: str
    property_type: str
    search_type: str
    state: str
    district: str

class PropertyValuation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    property_address: str
    property_type: str
    area_sqft: float
    location: str
    estimated_value: float
    valuation_details: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PropertyValuationRequest(BaseModel):
    property_address: str
    property_type: str
    area_sqft: float
    location: str
    state: str
    age_of_property: Optional[int] = 0
    amenities: Optional[str] = ""

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: str
    message: str

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    category: str
    amount: float
    description: str
    date: datetime
    type: str  # income, expense
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TransactionCreate(BaseModel):
    category: str
    amount: float
    description: str
    date: str
    type: str

class Bill(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    amount: float
    due_date: str
    recurring: bool = True
    status: str = "pending"  # pending, paid
    reminder_days: int = 3
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BillCreate(BaseModel):
    name: str
    amount: float
    due_date: str
    recurring: bool = True
    reminder_days: int = 3

class FinancialGoal(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: str
    priority: str  # low, medium, high
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class GoalCreate(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    deadline: str
    priority: str

class LoanApplication(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    loan_type: str
    amount: float
    purpose: str
    status: str = "pending"
    eligibility_score: Optional[float] = None
    recommendations: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class LoanRequest(BaseModel):
    loan_type: str
    amount: float
    purpose: str
    annual_income: float
    credit_score: int
    existing_loans: float

class InvestmentAnalysis(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    portfolio_name: str
    allocation: dict
    risk_level: str
    recommendations: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class InvestmentRequest(BaseModel):
    investment_amount: float
    risk_tolerance: str
    investment_horizon: str
    current_portfolio: Optional[dict] = None

class TaxCalculation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    tax_year: int
    income: float
    deductions: float
    tax_owed: float
    optimization_tips: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaxRequest(BaseModel):
    tax_year: int
    annual_income: float
    deductions: float
    dependents: int
    filing_status: str

class AIConsultation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    consultation_type: str
    query: str
    ai_response: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AIAdviceRequest(BaseModel):
    query: str
    context: Optional[dict] = None

# ============ AUTH HELPERS ============

async def get_current_user(request: Request) -> Optional[User]:
    # Check cookie first
    session_token = request.cookies.get("session_token")
    
    # Fallback to Authorization header
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split("Bearer ")[1]
    
    if not session_token:
        return None
    
    # Find session
    session = await db.user_sessions.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.now(timezone.utc).isoformat()}
    })
    
    if not session:
        return None
    
    # Find user
    user_doc = await db.users.find_one({"id": session["user_id"]})
    if not user_doc:
        return None
    
    user_doc.pop("_id", None)
    return User(**user_doc)

async def require_auth(request: Request) -> User:
    user = await get_current_user(request)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user

# ============ AUTH ENDPOINTS ============

@api_router.post("/auth/session")
async def create_session(session_req: SessionRequest, response: Response):
    """Process session_id from Emergent Auth and create session"""
    try:
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": session_req.session_id}
            )
            
            if auth_response.status_code != 200:
                raise HTTPException(status_code=400, detail="Invalid session")
            
            auth_data = auth_response.json()
            
            # Check if user exists
            existing_user = await db.users.find_one({"email": auth_data["email"]})
            
            if not existing_user:
                # Create new user
                user = User(
                    email=auth_data["email"],
                    name=auth_data["name"],
                    picture=auth_data.get("picture")
                )
                user_dict = user.model_dump()
                user_dict["created_at"] = user_dict["created_at"].isoformat()
                await db.users.insert_one(user_dict)
                user_id = user.id
            else:
                user_id = existing_user["id"]
            
            # Create session
            session_token = auth_data["session_token"]
            expires_at = datetime.now(timezone.utc) + timedelta(days=7)
            
            session = UserSession(
                user_id=user_id,
                session_token=session_token,
                expires_at=expires_at
            )
            
            session_dict = session.model_dump()
            session_dict["created_at"] = session_dict["created_at"].isoformat()
            session_dict["expires_at"] = session_dict["expires_at"].isoformat()
            
            await db.user_sessions.insert_one(session_dict)
            
            # Set httpOnly cookie
            response.set_cookie(
                key="session_token",
                value=session_token,
                httponly=True,
                secure=True,
                samesite="none",
                max_age=7*24*60*60,
                path="/"
            )
            
            return {
                "success": True,
                "user": {
                    "id": user_id,
                    "email": auth_data["email"],
                    "name": auth_data["name"],
                    "picture": auth_data.get("picture")
                }
            }
    
    except Exception as e:
        logger.error(f"Session creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/auth/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await require_auth(request)
    return user

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie("session_token", path="/")
    return {"success": True}

# ============ BANKING CONSULTANCY ENDPOINTS ============

@api_router.post("/banking/loan/check-eligibility")
async def check_loan_eligibility(loan_req: LoanRequest, request: Request):
    """Check loan eligibility using AI"""
    user = await require_auth(request)
    
    # Calculate basic eligibility score
    dti_ratio = loan_req.existing_loans / loan_req.annual_income if loan_req.annual_income > 0 else 1
    income_ratio = loan_req.amount / loan_req.annual_income if loan_req.annual_income > 0 else 10
    
    eligibility_score = 0
    if loan_req.credit_score >= 750:
        eligibility_score += 40
    elif loan_req.credit_score >= 650:
        eligibility_score += 25
    elif loan_req.credit_score >= 550:
        eligibility_score += 10
    
    if dti_ratio < 0.3:
        eligibility_score += 30
    elif dti_ratio < 0.5:
        eligibility_score += 15
    
    if income_ratio < 3:
        eligibility_score += 30
    elif income_ratio < 5:
        eligibility_score += 15
    
    # Get AI recommendations
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"loan_{user.id}_{uuid.uuid4()}",
        system_message="You are a financial advisor specializing in loans and credit."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Analyze this loan application:
- Loan Type: {loan_req.loan_type}
- Amount: ${loan_req.amount:,.2f}
- Purpose: {loan_req.purpose}
- Annual Income: ${loan_req.annual_income:,.2f}
- Credit Score: {loan_req.credit_score}
- Existing Loans: ${loan_req.existing_loans:,.2f}
- Eligibility Score: {eligibility_score}/100

Provide: 1) Approval recommendation, 2) Key factors, 3) Improvement tips (if needed)"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Save loan application
    loan_app = LoanApplication(
        user_id=user.id,
        loan_type=loan_req.loan_type,
        amount=loan_req.amount,
        purpose=loan_req.purpose,
        eligibility_score=eligibility_score,
        recommendations=ai_response
    )
    
    loan_dict = loan_app.model_dump()
    loan_dict["created_at"] = loan_dict["created_at"].isoformat()
    await db.loan_applications.insert_one(loan_dict)
    
    return {
        "eligibility_score": eligibility_score,
        "status": "approved" if eligibility_score >= 60 else "needs_review" if eligibility_score >= 40 else "declined",
        "recommendations": ai_response
    }

@api_router.post("/banking/investment/analyze")
async def analyze_investment(inv_req: InvestmentRequest, request: Request):
    """Provide investment recommendations using AI"""
    user = await require_auth(request)
    
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"invest_{user.id}_{uuid.uuid4()}",
        system_message="You are an investment advisor providing portfolio recommendations."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Create investment portfolio recommendation:
- Investment Amount: ${inv_req.investment_amount:,.2f}
- Risk Tolerance: {inv_req.risk_tolerance}
- Investment Horizon: {inv_req.investment_horizon}
- Current Portfolio: {inv_req.current_portfolio or 'None'}

Provide: 1) Asset allocation breakdown, 2) Specific investment suggestions, 3) Expected returns, 4) Risk considerations"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Save investment analysis
    analysis = InvestmentAnalysis(
        user_id=user.id,
        portfolio_name=f"{inv_req.risk_tolerance.capitalize()} Risk Portfolio",
        allocation={},
        risk_level=inv_req.risk_tolerance,
        recommendations=ai_response
    )
    
    analysis_dict = analysis.model_dump()
    analysis_dict["created_at"] = analysis_dict["created_at"].isoformat()
    await db.investment_analysis.insert_one(analysis_dict)
    
    return {
        "recommendations": ai_response,
        "risk_level": inv_req.risk_tolerance
    }

@api_router.post("/banking/savings/plan")
async def create_savings_plan(request: Request, goal_amount: float, timeline_months: int, monthly_income: float):
    """Create personalized savings plan"""
    user = await require_auth(request)
    
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"savings_{user.id}_{uuid.uuid4()}",
        system_message="You are a financial planner specializing in savings strategies."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Create a savings plan:
- Goal Amount: ${goal_amount:,.2f}
- Timeline: {timeline_months} months
- Monthly Income: ${monthly_income:,.2f}

Provide: 1) Monthly savings target, 2) Budget recommendations, 3) Tips to reach goal faster, 4) Alternative strategies"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    return {
        "plan": ai_response,
        "monthly_target": round(goal_amount / timeline_months, 2)
    }

@api_router.post("/banking/credit-score/analyze")
async def analyze_credit_score(request: Request, credit_score: int, payment_history: str, credit_utilization: float):
    """Analyze credit score and provide improvement tips"""
    user = await require_auth(request)
    
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"credit_{user.id}_{uuid.uuid4()}",
        system_message="You are a credit counselor helping people improve their credit scores."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Analyze credit profile:
- Current Score: {credit_score}
- Payment History: {payment_history}
- Credit Utilization: {credit_utilization}%

Provide: 1) Score assessment, 2) Key factors affecting score, 3) Actionable improvement steps, 4) Timeline for improvement"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    return {
        "analysis": ai_response,
        "score_category": "Excellent" if credit_score >= 750 else "Good" if credit_score >= 650 else "Fair" if credit_score >= 550 else "Poor"
    }

# ============ TAX FILING ENDPOINTS ============

@api_router.post("/tax/calculate")
async def calculate_tax(tax_req: TaxRequest, request: Request):
    """Calculate tax and provide optimization tips"""
    user = await require_auth(request)
    
    # Simple tax calculation (US progressive tax brackets 2024)
    taxable_income = tax_req.annual_income - tax_req.deductions
    tax_owed = 0
    
    if tax_req.filing_status == "single":
        if taxable_income > 578125:
            tax_owed = 174238.25 + 0.37 * (taxable_income - 578125)
        elif taxable_income > 231250:
            tax_owed = 52832.75 + 0.35 * (taxable_income - 231250)
        elif taxable_income > 182100:
            tax_owed = 37104 + 0.32 * (taxable_income - 182100)
        elif taxable_income > 95375:
            tax_owed = 16290 + 0.24 * (taxable_income - 95375)
        elif taxable_income > 44725:
            tax_owed = 5147 + 0.22 * (taxable_income - 44725)
        elif taxable_income > 11000:
            tax_owed = 1100 + 0.12 * (taxable_income - 11000)
        else:
            tax_owed = 0.10 * taxable_income
    
    # Get AI optimization tips
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"tax_{user.id}_{uuid.uuid4()}",
        system_message="You are a tax advisor providing optimization strategies."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Analyze tax situation:
- Tax Year: {tax_req.tax_year}
- Annual Income: ${tax_req.annual_income:,.2f}
- Deductions: ${tax_req.deductions:,.2f}
- Dependents: {tax_req.dependents}
- Filing Status: {tax_req.filing_status}
- Estimated Tax: ${tax_owed:,.2f}

Provide: 1) Additional deductions to consider, 2) Tax-saving strategies, 3) Credits that may apply, 4) Next year planning tips"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Save calculation
    calc = TaxCalculation(
        user_id=user.id,
        tax_year=tax_req.tax_year,
        income=tax_req.annual_income,
        deductions=tax_req.deductions,
        tax_owed=tax_owed,
        optimization_tips=ai_response
    )
    
    calc_dict = calc.model_dump()
    calc_dict["created_at"] = calc_dict["created_at"].isoformat()
    await db.tax_calculations.insert_one(calc_dict)
    
    return {
        "taxable_income": taxable_income,
        "tax_owed": round(tax_owed, 2),
        "effective_rate": round((tax_owed / tax_req.annual_income * 100), 2),
        "optimization_tips": ai_response
    }

@api_router.get("/tax/history")
async def get_tax_history(request: Request):
    """Get user's tax calculation history"""
    user = await require_auth(request)
    
    calculations = await db.tax_calculations.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return calculations

# ============ PROPERTY ENDPOINTS ============

@api_router.post("/property/legal-search")
async def property_legal_search(search_req: PropertySearchRequest, request: Request):
    """Search property legal documents and verification"""
    user = await require_auth(request)
    
    # Get AI analysis for property legal search
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"property_search_{user.id}_{uuid.uuid4()}",
        system_message="You are a property legal expert in India specializing in property verification and legal documentation."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Provide comprehensive property legal search guidance for:
- Property Address: {search_req.property_address}
- Property Type: {search_req.property_type}
- State: {search_req.state}
- District: {search_req.district}
- Search Type: {search_req.search_type}

For Indian rural property context, provide:
1) Documents required for {search_req.search_type}
2) Step-by-step verification process
3) Government offices/portals to check (Sub-Registrar Office, Revenue Department)
4) Common red flags to watch for
5) Timeline and costs involved
6) Online verification options available in {search_req.state}"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Save search request
    search = PropertySearch(
        user_id=user.id,
        property_address=search_req.property_address,
        property_type=search_req.property_type,
        search_type=search_req.search_type,
        status="completed",
        results=ai_response
    )
    
    search_dict = search.model_dump()
    search_dict["created_at"] = search_dict["created_at"].isoformat()
    await db.property_searches.insert_one(search_dict)
    
    return {
        "search_id": search.id,
        "status": "completed",
        "results": ai_response
    }

@api_router.post("/property/valuation")
async def property_valuation(val_req: PropertyValuationRequest, request: Request):
    """Get AI-powered property valuation"""
    user = await require_auth(request)
    
    # Get AI valuation estimate
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"valuation_{user.id}_{uuid.uuid4()}",
        system_message="You are a certified property valuer in India with expertise in rural and urban property valuation."
    ).with_model("openai", "gpt-5.1")
    
    query = f"""Provide detailed property valuation for:
- Property Address: {val_req.property_address}
- Property Type: {val_req.property_type}
- Area: {val_req.area_sqft} sq ft
- Location: {val_req.location}, {val_req.state}
- Age: {val_req.age_of_property} years
- Amenities: {val_req.amenities}

For Indian market context (rural/semi-urban), provide:
1) Estimated market value range in INR (₹)
2) Valuation methodology used
3) Key factors affecting the valuation
4) Comparison with similar properties in the area
5) Future appreciation potential
6) Documentation needed for official valuation
7) Registered valuer recommendations"""
    
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Extract estimated value (simplified - in real scenario would parse AI response)
    # For now, using a basic calculation as placeholder
    base_rate = 3000  # ₹ per sq ft (average for semi-urban)
    estimated_value = val_req.area_sqft * base_rate
    
    # Adjust based on age
    if val_req.age_of_property > 0:
        depreciation = min(val_req.age_of_property * 0.02, 0.3)  # Max 30% depreciation
        estimated_value = estimated_value * (1 - depreciation)
    
    # Save valuation
    valuation = PropertyValuation(
        user_id=user.id,
        property_address=val_req.property_address,
        property_type=val_req.property_type,
        area_sqft=val_req.area_sqft,
        location=val_req.location,
        estimated_value=estimated_value,
        valuation_details=ai_response
    )
    
    valuation_dict = valuation.model_dump()
    valuation_dict["created_at"] = valuation_dict["created_at"].isoformat()
    await db.property_valuations.insert_one(valuation_dict)
    
    return {
        "estimated_value": round(estimated_value, 2),
        "valuation_details": ai_response
    }

@api_router.get("/property/searches")
async def get_property_searches(request: Request):
    """Get user's property search history"""
    user = await require_auth(request)
    
    searches = await db.property_searches.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return searches

@api_router.get("/property/valuations")
async def get_property_valuations(request: Request):
    """Get user's property valuation history"""
    user = await require_auth(request)
    
    valuations = await db.property_valuations.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return valuations

# ============ CONTACT ENDPOINT ============

@api_router.post("/contact")
async def submit_contact(contact: ContactRequest):
    """Submit contact form"""
    # Save to database
    contact_dict = {
        "id": str(uuid.uuid4()),
        "name": contact.name,
        "email": contact.email,
        "phone": contact.phone,
        "message": contact.message,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.contact_submissions.insert_one(contact_dict)
    
    return {"success": True, "message": "Thank you! We will contact you soon."}

# ============ PERSONAL FINANCE ENDPOINTS ============

@api_router.post("/finance/transaction")
async def create_transaction(transaction: TransactionCreate, request: Request):
    """Add transaction"""
    user = await require_auth(request)
    
    trans_data = transaction.model_dump()
    trans_data["date"] = datetime.fromisoformat(trans_data["date"].replace('Z', '+00:00'))
    
    new_transaction = Transaction(
        user_id=user.id,
        **trans_data
    )
    
    trans_dict = new_transaction.model_dump()
    trans_dict["date"] = trans_dict["date"].isoformat()
    trans_dict["created_at"] = trans_dict["created_at"].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    # Update budget spent if category matches
    if transaction.type == "expense":
        await db.budgets.update_one(
            {"user_id": user.id, "category": transaction.category},
            {"$inc": {"spent": transaction.amount}}
        )
    
    return new_transaction

@api_router.get("/finance/transactions")
async def get_transactions(request: Request, limit: int = 100):
    """Get all transactions for user"""
    user = await require_auth(request)
    
    transactions = await db.transactions.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("date", -1).limit(limit).to_list(limit)
    
    return transactions

@api_router.post("/finance/bill")
async def create_bill(bill: BillCreate, request: Request):
    """Add bill reminder"""
    user = await require_auth(request)
    
    new_bill = Bill(
        user_id=user.id,
        **bill.model_dump()
    )
    
    bill_dict = new_bill.model_dump()
    bill_dict["created_at"] = bill_dict["created_at"].isoformat()
    await db.bills.insert_one(bill_dict)
    
    return new_bill

@api_router.get("/finance/bills")
async def get_bills(request: Request):
    """Get all bills for user"""
    user = await require_auth(request)
    
    bills = await db.bills.find(
        {"user_id": user.id},
        {"_id": 0}
    ).sort("due_date", 1).to_list(100)
    
    return bills

@api_router.post("/finance/goal")
async def create_goal(goal: GoalCreate, request: Request):
    """Create financial goal"""
    user = await require_auth(request)
    
    new_goal = FinancialGoal(
        user_id=user.id,
        **goal.model_dump()
    )
    
    goal_dict = new_goal.model_dump()
    goal_dict["created_at"] = goal_dict["created_at"].isoformat()
    await db.financial_goals.insert_one(goal_dict)
    
    return new_goal

@api_router.get("/finance/goals")
async def get_goals(request: Request):
    """Get all financial goals"""
    user = await require_auth(request)
    
    goals = await db.financial_goals.find(
        {"user_id": user.id},
        {"_id": 0}
    ).to_list(100)
    
    return goals

@api_router.post("/finance/ai-advice")
async def get_ai_advice(advice_req: AIAdviceRequest, request: Request):
    """Get AI-powered financial advice"""
    user = await require_auth(request)
    
    # Get user's financial context
    context_str = ""
    if advice_req.context:
        context_str = f"\nUser Context: {advice_req.context}"
    
    chat = LlmChat(
        api_key=os.environ["EMERGENT_LLM_KEY"],
        session_id=f"advice_{user.id}",
        system_message="You are a personal finance advisor providing helpful, actionable advice."
    ).with_model("openai", "gpt-5.1")
    
    query = f"{advice_req.query}{context_str}"
    ai_response = await chat.send_message(UserMessage(text=query))
    
    # Save consultation
    consultation = AIConsultation(
        user_id=user.id,
        consultation_type="general_advice",
        query=advice_req.query,
        ai_response=ai_response
    )
    
    consult_dict = consultation.model_dump()
    consult_dict["created_at"] = consult_dict["created_at"].isoformat()
    await db.ai_consultations.insert_one(consult_dict)
    
    return {"advice": ai_response}

@api_router.get("/finance/dashboard")
async def get_dashboard(request: Request):
    """Get dashboard summary"""
    user = await require_auth(request)
    
    # Get aggregated data
    budgets = await db.budgets.find({"user_id": user.id}, {"_id": 0}).to_list(100)
    transactions = await db.transactions.find({"user_id": user.id}, {"_id": 0}).sort("date", -1).limit(10).to_list(10)
    bills = await db.bills.find({"user_id": user.id, "status": "pending"}, {"_id": 0}).to_list(100)
    goals = await db.financial_goals.find({"user_id": user.id}, {"_id": 0}).to_list(100)
    
    # Calculate totals
    total_budget = sum(b["amount"] for b in budgets)
    total_spent = sum(b["spent"] for b in budgets)
    upcoming_bills = sum(b["amount"] for b in bills)
    
    return {
        "budgets": budgets,
        "recent_transactions": transactions,
        "upcoming_bills": bills[:5],
        "goals": goals,
        "summary": {
            "total_budget": total_budget,
            "total_spent": total_spent,
            "remaining": total_budget - total_spent,
            "upcoming_bills_amount": upcoming_bills
        }
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()