# OWASP Juice Shop - Cybersecurity Enhancement Project
**Internship Project | DHC Internship Program**  
**Intern:** Syeda Arooj Fatima  
**Intern ID:** DHC-1161  
 
---
 
## 📋 Project Overview
 
This project demonstrates a complete **Cybersecurity Internship** where I analyzed, tested, and secured the **OWASP Juice Shop** — a deliberately vulnerable web application.
 
The internship was divided into 5 weeks:
- **Week 1**: Vulnerability Assessment  
- **Week 2**: Implementing Security Measures  
- **Week 3**: Advanced Security & Final Reporting  
- **Week 4**: Advanced Threat Detection & Web Security  
- **Week 5**: Ethical Hacking & Exploiting Vulnerabilities  
---
 
## 🛠️ Technologies Used
 
- **Backend**: Node.js, Express, TypeScript
- **Database**: SQLite / Sequelize ORM
- **Security Tools**: OWASP ZAP, Nmap, Nikto, Gobuster, SQLMap, Burp Suite
- **Security Libraries**: bcrypt, jsonwebtoken, validator, Winston, Helmet, csurf
- **Others**: JWT Authentication, Input Sanitization, CORS, CSP, HSTS, CSRF Protection
---
 
## 📅 Internship Summary
 
### Week 1: Security Assessment
- Performed manual and automated vulnerability testing using **OWASP ZAP**
- Identified multiple critical vulnerabilities:
  - Cross-Site Scripting (XSS)
  - Broken Authentication (SQL Injection)
  - Access Log Disclosure
  - Information Disclosure
- Documented findings with screenshots and evidence
**Report:** [Vulnerability Assessment Report](reports/Juice%20shop%20Vulnerability%20Assessment.pdf)
 
---
 
### Week 2: Implementing Security Measures
- Implemented strong **Input Validation & Sanitization**
- Added **Password Hashing** using bcrypt
- Implemented **JWT Token-based Authentication**
- Added **Helmet.js** for secure HTTP headers
- Implemented **Rate Limiting** to prevent brute-force attacks
- Created custom security utilities (`utils/security.ts`)
**Report:** [Week 2 Report](reports/Week%202%20Implementing%20Security%20Measures.pdf)
 
---
 
### Week 3: Advanced Security and Final Reporting
- Performed **Basic Penetration Testing** using **Nmap**
- Implemented **Structured Logging** using **Winston**
- Added Global Error Handler
- Created Security Checklist and Final Report
- Documented all security improvements
**Key Files Added/Modified:**
- `utils/logger.ts`
- `SECURITY_CHECKLIST.md`
- `FINAL_REPORT.md`
- Enhanced `server.ts`
**Report:** [Week 3 Report](reports/Week%203%20Advance%20Security.pdf)
 
---
 
### Week 4: Advanced Threat Detection & Web Security
- Implemented **Brute Force Protection** — blocks IP after 5 failed logins within 15 minutes
- Hardened **CORS** from wildcard (`*`) to specific `FRONTEND_URL` origin
- Configured **Helmet.js** with explicit CSP directives and HSTS
- Verified security headers using Postman
**Key Security Implementations:**
- `utils/security.ts` — `recordFailedAttempt`, `checkBruteForce`, `resetBruteForce` functions
- `routes/secureLogin.ts` — Integrated brute force protection with 429 responses
- `server.ts` — CORS restricted, Helmet CSP & HSTS configured
**Security Headers Implemented:**
| Header | Value |
|--------|-------|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self'` |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains; preload` |
| X-Frame-Options | `SAMEORIGIN` |
| Access-Control-Allow-Origin | Restricted to `FRONTEND_URL` |
 
**Environment Issues Resolved:**
- `tsconfig.json` `ignoreDeprecations` incompatibility fixed
- Node 24 + Windows libuv crash resolved (removed `checkIfPortIsAvailable`)
- Duplicate `server.listen()` causing `ERR_SERVER_ALREADY_LISTEN` fixed
**Report:** [Week 4 Report](reports/Week4_Report_DHC1161.docx)
 
---
 
### Week 5: Ethical Hacking & Exploiting Vulnerabilities
- Conducted full **Reconnaissance** using Nmap, Nikto, and Gobuster on Kali Linux
- Exploited **SQL Injection** vulnerability using SQLMap
- Fixed SQLi by replacing raw SQL with **Sequelize ORM** parameterized queries
- Implemented **CSRF Protection** using custom crypto-based token middleware
- Tested CSRF protection using **Burp Suite** and curl
**Key Findings:**
- Boolean-based blind SQL injection found in `/rest/products/search?q=` endpoint
- Rate limiter successfully blocked Gobuster (429 on all 4,613 attempts)
- All Week 4 security headers verified and active via Nmap scan
**Security Fixes Applied:**
- `routes/search.ts` — Raw SQL replaced with Sequelize ORM (`Op.like`, `Op.or`, `Op.and`)
- `server.ts` — Custom CSRF middleware with `crypto.randomBytes(32)`, `/csrf-token` endpoint, one-time token validation
**Tools Used:**
| Tool | Purpose | Version |
|------|---------|---------|
| Nmap | Port scanning & service detection | 7.95 |
| Nikto | Web vulnerability scanning | 2.5.0 |
| Gobuster | Directory brute-forcing | 3.8 |
| SQLMap | SQL injection testing & exploitation | Latest |
| Burp Suite | HTTP proxy & CSRF testing | Community v2025.10.6 |
 
**Report:** [Week 5 Report](reports/Week5_Report_DHC1161.docx)
 
---
 
## 🔒 Security Improvements Summary
 
| Security Feature              | Implemented | Tool/Library          | Week |
|------------------------------|-------------|-----------------------|------|
| Input Validation             | ✅ Yes      | validator             | 2    |
| Password Hashing             | ✅ Yes      | bcrypt                | 2    |
| JWT Authentication           | ✅ Yes      | jsonwebtoken          | 2    |
| Security Headers             | ✅ Yes      | Helmet.js             | 2    |
| Rate Limiting                | ✅ Yes      | express-rate-limit    | 2    |
| Structured Logging           | ✅ Yes      | Winston               | 3    |
| Penetration Testing          | ✅ Yes      | Nmap + Manual         | 3    |
| Brute Force Protection       | ✅ Yes      | Custom (security.ts)  | 4    |
| CORS Hardening               | ✅ Yes      | cors + FRONTEND_URL   | 4    |
| CSP + HSTS                   | ✅ Yes      | Helmet.js             | 4    |
| SQL Injection Prevention     | ✅ Yes      | Sequelize ORM         | 5    |
| CSRF Protection              | ✅ Yes      | Custom crypto tokens  | 5    |
 
---
 
## 📁 Project Structure
 
```
OWASP-Juice-Shop_CyberSecurity-Internship/
├── routes/
│   ├── search.ts          # SQLi fix - Sequelize ORM
│   └── secureLogin.ts     # Brute force protection
├── utils/
│   ├── security.ts        # Auth & brute force utilities
│   └── logger.ts          # Winston structured logging
├── server.ts              # CORS, Helmet, CSRF, rate limiting
├── reports/
│   ├── Week4_Report_DHC1161.docx
│   └── Week5_Report_DHC1161.docx
├── SECURITY_CHECKLIST.md
└── README.md
```
 
---
 
## 🧪 Vulnerability Testing Results
 
| Vulnerability | Status Before | Status After | Fix Applied |
|--------------|---------------|--------------|-------------|
| XSS | Vulnerable | Mitigated | Input validation + CSP |
| SQL Injection (login) | Vulnerable | Fixed | Prepared statements |
| SQL Injection (search) | Vulnerable | Fixed | Sequelize ORM |
| Brute Force | Vulnerable | Fixed | IP-based lockout |
| CSRF | Vulnerable | Fixed | Custom token middleware |
| Missing Security Headers | Vulnerable | Fixed | Helmet.js + CSP + HSTS |
| CORS Wildcard | Vulnerable | Fixed | Restricted to FRONTEND_URL |
| Directory Enumeration | Vulnerable | Mitigated | Rate limiting (429) |
 
---
 
## 👩‍💻 Author
 
**Syeda Arooj Fatima**  
Cybersecurity & Networking Enthusiast  
DHC Internship Program | Intern ID: DHC-1161  
 
