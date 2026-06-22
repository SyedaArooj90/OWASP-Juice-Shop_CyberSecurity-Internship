#OWASP Juice Shop — DHC Cybersecurity Internship
**Intern:** Syeda Arooj Fatima | **ID:** DHC-1161 | **Duration:** 6 Weeks
 
A progressively hardened implementation of the OWASP Juice Shop web application, documenting a complete offensive-to-defensive security lifecycle across 6 weeks of structured internship work.
 
---
 
## Project Overview
 
| Detail | Value |
|--------|-------|
| Base Application | OWASP Juice Shop v20.0.0 |
| Environment | Kali Linux in VirtualBox |
| Runtime | Node.js 22 + TypeScript |
| Database | SQLite via Sequelize ORM |
| Repository | OWASP-Juice-Shop_CyberSecurity-Internship |
 
---
 
## Security Implementation Summary
 
| Category | Tool/Method | Status |
|----------|-------------|--------|
| Input Validation | validator.js | ✅ Implemented |
| Password Hashing | bcrypt (salt rounds=10) | ✅ Implemented |
| Authentication | JWT with verifyToken middleware | ✅ Implemented |
| CSRF Protection | Custom crypto.randomBytes(32) middleware | ✅ Implemented |
| Rate Limiting | express-rate-limit (5 attempts/15 min) | ✅ Implemented |
| Security Headers | Helmet.js (CSP, HSTS, noSniff) | ✅ Implemented |
| CORS Hardening | Restricted to FRONTEND_URL origin | ✅ Implemented |
| SQL Injection Fix | Sequelize ORM operators (Op.like, Op.or) | ✅ Implemented |
| Brute Force Detection | Custom IP lockout with Winston logging | ✅ Implemented |
| Dependency Scanning | npm audit + GitHub Actions CI | ✅ Implemented |
| Container Security | Docker with non-root user + Alpine base | ✅ Implemented |
| Auto-updates | Dependabot weekly npm scans | ✅ Implemented |
 
---
 
## Week-by-Week Progress
 
### Week 1 — Vulnerability Assessment
**Goal:** Identify vulnerabilities in the base Juice Shop application.
 
**Tools used:** OWASP ZAP, manual testing
 
**Vulnerabilities discovered:**
| Vulnerability | Endpoint | Severity |
|--------------|----------|----------|
| SQL Injection | `/rest/user/login` | High |
| Reflected XSS | Multiple input fields | High |
| Log Disclosure | `/support/logs` | Medium |
| Missing security headers | All routes | Medium |
 
---
 
### Week 2 — Security Hardening
**Goal:** Fix identified vulnerabilities and implement core security controls.
 
**Files modified:** `server.ts`, `routes/secureLogin.ts`, `utils/security.ts`
 
**Security controls implemented:**
| Control | Implementation |
|---------|----------------|
| Input validation | `validator.js` — email, username, password fields |
| Password hashing | `bcrypt` with salt rounds=10 |
| JWT authentication | `jsonwebtoken` with `verifyToken` middleware |
| Security headers | `Helmet.js` initial configuration |
| Rate limiting | `express-rate-limit` on auth routes |
| Environment variables | `dotenv` for secrets management |
 
---
 
### Week 3 — Penetration Testing Round 1
**Goal:** Verify hardening effectiveness and implement logging.
 
**Tools used:** Nmap (`-sV -O -A`), manual testing
 
**Results:**
| Test | Before | After |
|------|--------|-------|
| SQL Injection | Vulnerable | Blocked |
| XSS | Vulnerable | Blocked |
| Log disclosure | Exposed | Access controlled |
 
**Logging implemented:** Winston structured logging with separate error/combined log files and global error handler.
 
---
 
### Week 4 — Advanced Threat Detection & Web Security
**Goal:** Implement brute-force detection and advanced security hardening.
 
**Files modified:** `utils/security.ts`, `routes/secureLogin.ts`, `server.ts`
 
**Security functions added:**
```typescript
recordFailedAttempt(ip: string): void
checkBruteForce(ip: string): boolean   // blocks after 5 fails in 15 min
resetBruteForce(ip: string): void
```
 
**Helmet CSP configuration:**
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  noSniff: true
}))
```
 
**CORS hardened:** Restricted from `*` wildcard to specific `FRONTEND_URL` origin.
 
**Issues resolved:**
- `tsconfig.json` `ignoreDeprecations` incompatibility → fixed to `"5.0"`
- Node 24 + Windows libuv crash → removed broken `checkIfPortIsAvailable` precondition
- Duplicate `server.listen()` causing `ERR_SERVER_ALREADY_LISTEN`
---
 
### Week 5 — Ethical Hacking
**Goal:** Advanced penetration testing and CSRF implementation.
 
**Tools used:** Nmap, Nikto, Gobuster, SQLMap, Burp Suite Community v2025.10.6
 
**Reconnaissance results:**
- Gobuster: 429 rate-limited responses across all paths — Week 4 protection confirmed
- SQLMap: Boolean-based blind SQL injection found in `/rest/products/search?q=` — fixed with Sequelize ORM
- Burp Suite: CSRF tokens verified working on sensitive endpoints
**SQL injection fix** (`routes/search.ts`):
```typescript
// Before (vulnerable)
WHERE name LIKE '%${req.query.q}%'
 
// After (safe)
Product.findAll({
  where: {
    [Op.or]: [
      { name: { [Op.like]: `%${searchTerm}%` } },
      { description: { [Op.like]: `%${searchTerm}%` } }
    ]
  }
})
```
 
**CSRF middleware** (`utils/csrf.ts`):
```typescript
// Token generation
const token = crypto.randomBytes(32).toString('hex')
res.cookie('csrfSessionId', sessionId, { httpOnly: true, sameSite: 'strict' })
 
// Token validation — returns 403 without valid token
```
 
---
 
### Week 6 — Advanced Security Audits & Final Deployment
**Goal:** Comprehensive security audit, Docker deployment, and final penetration test.
 
#### Security Audit Results
 
**OWASP ZAP Active Scan:**
| Metric | Value |
|--------|-------|
| ZAP Version | 2.17.0 |
| Nodes crawled | 159 |
| Total alerts | 1,200 |
| Critical/High alerts | 0 |
| Scan duration | ~9 minutes |
 
**Nikto Web Server Scan:**
| Metric | Value |
|--------|-------|
| Nikto Version | 2.5.0 |
| Total requests | 8,073 |
| Items reported | 29 |
| Real findings | Rate limiting confirmed, X-Content-Type-Options |
 
**Lynis System Hardening:**
| Metric | Value |
|--------|-------|
| Lynis Version | 3.1.6 |
| Tests performed | 273 |
| Hardening index | 60/100 |
| Warnings | 4 |
| Suggestions | 58 |
 
#### npm Dependency Audit
| Severity | Count |
|----------|-------|
| Critical | 5 |
| High | 25 |
| Moderate | 20 |
| Low | 5 |
| **Total** | **55** |
 
Notable vulnerabilities: lodash Prototype Pollution (critical), crypto-js PBKDF2 weakness (critical), marsdb Command Injection (critical).
 
#### Docker Security
```dockerfile
FROM node:22-alpine
RUN addgroup -S juicegroup && adduser -S juiceuser -G juicegroup
WORKDIR /app
COPY . .
RUN npm install --omit=dev && npm cache clean --force
RUN chown -R juiceuser:juicegroup /app
USER juiceuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget -qO- http://localhost:3000 || exit 1
CMD ["node", "app.js"]
```
 
#### Final Penetration Test Results
| Test | Tool | Result |
|------|------|--------|
| SQL Injection on /rest/products/search | Burp Suite | BLOCKED — Sequelize ORM |
| CSRF without token | Burp Suite | BLOCKED — 403 response |
| Brute force on /rest/user/login | Burp Suite | BLOCKED — 429 after 5 attempts |
| Directory enumeration | Metasploit | BLOCKED — 429 rate limited |
| HTTP version fingerprinting | Metasploit | No version leakage |
| Security headers present | curl | PASS — CSP, HSTS, noSniff |
 
---
 
## Bonus Challenges Completed
 
### Zero Trust Security
- Short-lived JWT tokens (15-minute expiry)
- Per-request authorization via `verifyToken` middleware on every route
- Role-based access control (RBAC) — no implicit trust after login
- Refresh token pattern documented
### WAF (Web Application Firewall)
Custom `waf.ts` Express middleware blocking:
- SQL Injection patterns: `' OR`, `UNION SELECT`, `--`, `DROP TABLE`
- XSS patterns: `<script>`, `onerror=`, `javascript:`
- Path traversal: `../`, `/etc/passwd`
- All blocked requests logged via Winston with IP and matched pattern
### Social Engineering Simulation
Documented phishing simulation targeting Juice Shop users:
- Attack vector: Fake password-reset email spoofing `noreply@juice-sh.op`
- Red flags documented: domain mismatch, urgency language, URL mismatch
- Awareness training recommendations included in final report
---
 
## OWASP Top 10 Compliance
 
| Category | Status | Fix Applied |
|----------|--------|-------------|
| A01 - Broken Access Control | PASS | RBAC middleware, JWT route protection |
| A02 - Cryptographic Failures | PASS | bcrypt + JWT HS256 |
| A03 - Injection | PASS | Sequelize ORM, validator.js |
| A04 - Insecure Design | PASS | CSRF middleware, rate limiting |
| A05 - Security Misconfiguration | PASS | Helmet, CORS, CSP, HSTS |
| A06 - Vulnerable Components | WARN | 55 npm vulns documented, CI scanning active |
| A07 - Auth & Session Failures | PASS | JWT, bcrypt, session hardening |
| A08 - Software & Data Integrity | PASS | Dependabot + GitHub Actions |
| A09 - Logging & Monitoring | PASS | Winston structured logging |
 
---
 
## Repository Structure
 
```
OWASP-Juice-Shop_CyberSecurity-Internship/
├── .github/
│   ├── dependabot.yml          # Weekly npm dependency updates
│   └── workflows/
│       └── ci-audit.yml        # Security audit on every push
├── routes/
│   ├── secureLogin.ts          # Brute-force protected login
│   └── search.ts               # Sequelize ORM (SQLi fixed)
├── utils/
│   ├── security.ts             # recordFailedAttempt, checkBruteForce
│   └── csrf.ts                 # Custom CSRF middleware
├── Dockerfile                  # Hardened Docker image
├── server.ts                   # Helmet, CORS, WAF middleware
└── README.md
```
 
---
 
## How to Run
 
### Local (Kali Linux)
```bash
git clone https://github.com/<your-username>/OWASP-Juice-Shop_CyberSecurity-Internship
cd OWASP-Juice-Shop_CyberSecurity-Internship
npm install
npx tsx app.ts
# Visit http://localhost:3000
```
 
### Docker
```bash
docker build -t juice-shop-secured:latest .
docker run -p 3000:3000 juice-shop-secured:latest
# Visit http://localhost:3000
```
 
---
 
## Audit Reports
 
| Report | Tool | Key Finding |
|--------|------|-------------|
| `week6-zap-report.html` | OWASP ZAP 2.17.0 | 1,200 alerts, 0 critical/high |
| `nikto-report.txt` | Nikto 2.5.0 | 29 items, rate limiting confirmed |
| `lynis-report.txt` | Lynis 3.1.6 | Hardening score: 60/100 |
| `audit-report.json` | npm audit | 55 vulnerabilities documented |
 
---
 
## Weekly Deliverables
 
| Week | Report | Focus |
|------|--------|-------|
| Week 1 | Week1_Report_DHC1161.docx | Vulnerability Assessment |
| Week 2 | Week2_Report_DHC1161.docx | Security Hardening |
| Week 3 | Week3_Report_DHC1161.docx | Penetration Testing Round 1 |
| Week 4 | Week4_Report_DHC1161.docx | Advanced Threat Detection |
| Week 5 | Week5_Report_DHC1161.docx | Ethical Hacking |
| Week 6 | Week6_Report_DHC1161.docx | Final Audit & Deployment |
 
---
 
*DHC Cybersecurity Internship — Syeda Arooj Fatima (DHC-1161)*
