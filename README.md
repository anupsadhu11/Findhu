# Findhu
AI Powered Banking consultancy app
Findhu helps people in rural and semi-urban India access simple, trustworthy guidance for everyday banking and basic tax questions. The app focuses on clear language, low-bandwidth operation, and minimal friction for users who may not be comfortable with complex banking workflows.
Vision
Make financial services understandable and accessible to everyone by providing a simple, privacy-respecting assistant that guides users through common banking and tax tasks (opening accounts, understanding subsidies, filing basic tax forms, checking government benefits, and safe document submission).
Rural and semi-urban residents in India
Conversational help (FAQ-style flows) for common banking & tax queries
Uploading KYC documents
Checking eligibility for government schemes
Preparing documents for basic tax filing
Secure document upload (placeholder for DigiLocker / secure storage)
Multilingual support (Hindi + one or more regional languages)
Android app: Kotlin + Jetpack Compose
Backend: FastAPI (Python) — lightweight APIs, documented with OpenAPI
Authentication: OAuth2 / JWT for user sessions (or anonymous session tokens)
Storage: S3-compatible object storage (or GitHub Actions artifact for CI testing)
CI: GitHub Actions — build Android APK/AAB and run backend tests
Optional integrations: DigiLocker, Government APIs (use placeholders until approved)
