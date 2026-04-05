# Business Requirements Document (BRD)
### AI-Powered Document Summarization Tool — Phase 1 Pilot

---

```
DELOITTE CONSULTING LLP
Client:           LG Electronics India Pvt. Ltd.
Engagement No:    IN-CON-2025-04872
WBS Code:         4872.001.BA.001
Document Ref:     DLT-LG-AI-BRD-001
Version:          1.0  |  Status: APPROVED
Prepared by:      Pritam Mondal, Senior Associate — Technology & Transformation
Reviewed by:      Rajesh Nair, Manager — Deloitte Consulting
Classification:   CONFIDENTIAL — Client & Engagement Team Only
```

---

## Table of Contents

1. [Document Control](#1-document-control)
2. [Executive Summary](#2-executive-summary)
3. [Business Context & Problem Statement](#3-business-context--problem-statement)
4. [Business Case & ROI](#4-business-case--roi)
5. [Project Objectives & Success Criteria](#5-project-objectives--success-criteria)
6. [Scope](#6-scope)
7. [Stakeholders & RACI](#7-stakeholders--raci)
8. [Business Requirements](#8-business-requirements)
9. [Functional Requirements & Acceptance Criteria](#9-functional-requirements--acceptance-criteria)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Regulatory & Compliance Requirements](#11-regulatory--compliance-requirements)
12. [Assumptions & Dependencies](#12-assumptions--dependencies)
13. [Constraints](#13-constraints)
14. [Risks & Issues](#14-risks--issues)
15. [Project Timeline & Tollgates](#15-project-timeline--tollgates)
16. [UAT Plan](#16-uat-plan)
17. [Sign-Off & Approval Process](#17-sign-off--approval-process)
18. [Open Items Log](#18-open-items-log)
19. [Appendix](#19-appendix)

---

## 1. Document Control

### 1.1 Version History

| Version | Date | Author | Reviewed By | Change Description |
|---------|------|--------|-------------|-------------------|
| 0.1 | 03-Feb-2025 | Pritam Mondal | — | Initial shell — discovery kickoff |
| 0.2 | 17-Feb-2025 | Pritam Mondal | Rajesh Nair | As-Is process documented; pain points from Workshop #1 incorporated |
| 0.3 | 03-Mar-2025 | Pritam Mondal | Ananya Sharma | LG review round 1 — scope boundary revised; SAP integration deferred |
| 0.4 | 18-Mar-2025 | Pritam Mondal | Deepa Rao | Compliance section added — DPDP Act 2023 references; data handling clauses |
| 0.5 | 26-Mar-2025 | Pritam Mondal | Rahul Mehta | Deloitte internal QA review — NFRs tightened, acceptance criteria added |
| 1.0 | 05-Apr-2025 | Pritam Mondal | Rajesh Nair | Final approved version — all open items resolved |

### 1.2 Distribution List

| Name | Title | Organisation | Distribution | Access |
|------|-------|--------------|--------------|--------|
| Vikas Sethi | VP — Digital Transformation & IT | LG Electronics India, Noida | Email + Hard Copy | Full |
| Ananya Sharma | Head of IT Infrastructure & Applications | LG Electronics India, Noida | Email | Full |
| Sanjay Kumar | PMO Lead — Digital Initiatives | LG Electronics India, Noida | Email | Full |
| Priya Menon | Manager — Regulatory Compliance | LG Electronics India, Noida | Email | Sections 11, 14, 17 only |
| Kiran Bhat | Senior Manager — Supply Chain Analytics | LG Electronics India, Bengaluru | Email | Full |
| Rajesh Nair | Manager — Technology & Transformation | Deloitte Consulting LLP | Email | Full |
| Pritam Mondal | Senior Associate — Technology & Transformation | Deloitte Consulting LLP | Email | Full |
| Rahul Mehta | Senior Associate — QA & Assurance | Deloitte Consulting LLP | Email | Full |

### 1.3 Document Approvals Required

This document requires sign-off from all approvers listed in **Section 17** before development activities may commence. Distribution of this document does not constitute approval.

---

## 2. Executive Summary

### Engagement Context

Deloitte Consulting LLP has been engaged by LG Electronics India Pvt. Ltd. under **Master Services Agreement MSA-LG-DLT-2024-07** to deliver a Phase 1 pilot of an AI-powered document summarization capability as part of LG India's broader **Digital Workforce Productivity Programme (DWPP)**.

### The Problem

LG Electronics India's analyst workforce — spanning Supply Chain, Regulatory Affairs, Product Compliance, and Market Intelligence — collectively processes an estimated **1,800–2,200 documents per month**. These include Bureau of Indian Standards (BIS) compliance filings, supplier quality audit reports, competitive intelligence articles, and internal policy PDFs.

As of Q4 2024, a time-motion study conducted by Deloitte (ref: **DLT-LG-2024-TMS-003**) found that analysts spend an average of **3.2 hours per working day** on manual document reading and summarisation — accounting for approximately **38% of their productive working hours**.

### The Proposed Solution

An AI-powered summarization tool, deployed as a browser-accessible web application, that enables any LG analyst to submit a URL, PDF, or text document and receive a structured 3–5 bullet summary in under 10 seconds — with no software installation, no training required, and no document content stored after the request completes.

### Phase 1 Scope

Phase 1 is a **6-week internal pilot** targeting **23 analysts across 3 business units** (Supply Chain Analytics, Regulatory Affairs, Market Intelligence). Successful pilot completion, as defined in Section 5, will trigger a Phase 2 scoping conversation for enterprise-wide rollout.

---

## 3. Business Context & Problem Statement

### 3.1 About LG Electronics India

LG Electronics India Pvt. Ltd. (LGEIL) is a wholly owned subsidiary of LG Electronics Inc. (Korea), headquartered at **Plot No. 51, Udyog Vihar Phase IV, Gurugram, Haryana** with regional offices in Noida, Mumbai, Bengaluru, and Chennai. LGEIL operates across four business units: Home Appliances (HA), Home Entertainment (HE), Air Conditioning & Energy Solutions (AES), and Business-to-Business (B2B).

### 3.2 Current State (As-Is Process)

```
Document arrives (email / SharePoint / supplier portal)
              ↓
Analyst downloads to local machine
              ↓
Opens in PDF viewer or browser
              ↓
Reads full document (avg. 45–90 min for compliance docs)
              ↓
Manually types summary in MS Word / PowerPoint
              ↓
Sends draft to line manager for review
              ↓
Manager requests changes (avg. 1.4 revision cycles)
              ↓
Final summary shared at leadership meeting (often 2–3 days later)
```

**Key observation:** The tool being summarised — the PDF or article — does not change between steps. Only human reading time and manual typing introduce delay.

### 3.3 Quantified Pain Points (Source: Deloitte Time-Motion Study, Nov–Dec 2024)

| Pain Point | Data Point | Business Impact |
|------------|------------|-----------------|
| Average time to summarise one document | 52 minutes | 23 analysts × 52 min × ~4 docs/day = **~80 person-hours/day** lost |
| Summary quality inconsistency | 34% of summaries required rework by manager | Leadership decisions delayed by avg. 2.3 days |
| Compliance docs not being read in full | 61% of analysts admitted skimming docs >20 pages | Regulatory risk — missed obligations |
| No machine-readable output | 100% of summaries produced as unstructured Word/PPT | Cannot feed into LG's Power BI dashboards |
| BIS filing summaries delayed | Avg. 3.1 days from receipt to summary shared | Compliance action window compressed |

### 3.4 Root Cause Analysis

The root cause is not analyst capability — it is the absence of tooling. LG's current enterprise toolkit (SAP, SharePoint, MS Office) provides no AI-assisted reading or extraction capability. Analysts are performing a task that is highly repetitive, low-judgement, and therefore a strong candidate for AI augmentation.

### 3.5 Future State (To-Be Process)

```
Document arrives (email / SharePoint / supplier portal)
              ↓
Analyst pastes URL or uploads PDF into summarize tool (< 30 seconds)
              ↓
Tool returns structured 3–5 bullet summary (< 10 seconds)
              ↓
Analyst reviews, adjusts tone/precision using temperature preset
              ↓
Copies output to leadership deck or exports as JSON to BI tool
              ↓
Total elapsed time: under 2 minutes
```

---

## 4. Business Case & ROI

### 4.1 Cost of Current State (Annual)

| Item | Calculation | Annual Cost |
|------|-------------|-------------|
| Analyst time lost to manual summarisation | 80 person-hours/day × 250 working days | 20,000 person-hours |
| Average fully-loaded analyst cost | ₹18,00,000 per annum ÷ 2,080 hrs | ₹865/hr |
| **Total annual cost of manual summarisation** | 20,000 hrs × ₹865 | **₹1.73 Crore** |

### 4.2 Projected Savings

| Item | Projection |
|------|------------|
| Time reduction per document (Phase 1 pilot) | 52 min → 2 min = **96% reduction** |
| Analyst hours recovered (23 users, pilot period) | ~1,400 hours over 6-week pilot |
| Projected annual saving at full rollout (est. 150 analysts) | **₹1.4–1.6 Crore per year** |
| Deloitte Phase 1 engagement fee | ₹24.5 Lakhs (Fixed Fee — ref. SOW-LG-2025-04872) |
| **Estimated payback period** | **< 3 months post full rollout** |

### 4.3 Non-Financial Benefits

- Faster regulatory response: BIS filing summaries available same-day instead of 3 days
- Consistent summary quality: structured output reduces manager rework by estimated 70%
- Analyst satisfaction: reduces repetitive low-value work; frees capacity for analysis
- Audit-readiness: JSON output enables traceability of summaries in BI dashboards

---

## 5. Project Objectives & Success Criteria

| ID | Objective | KPI | Measurement Method | Target |
|----|-----------|-----|-------------------|--------|
| O1 | Reduce summarisation time | Time per document (min) | Pilot user survey + time log | ≤ 2 min avg. |
| O2 | Standardise output format | % summaries requiring rework | Manager feedback survey | < 10% rework rate |
| O3 | Support all primary document types | % documents successfully processed | UAT test coverage | 100% of in-scope types |
| O4 | Enable BI integration | JSON output parseable by Power BI | IT integration test | Pass |
| O5 | Zero data residency breach | Document content stored post-request | Security audit | 0 instances |
| O6 | Pilot user adoption | % of 23 pilot users using tool weekly | Usage analytics (GA4) | ≥ 80% weekly active |

### Phase 1 Pilot — Go / No-Go Criteria

At the end of the 6-week pilot, a **Go/No-Go review** will be held with Vikas Sethi (LG VP) and Rajesh Nair (Deloitte Manager). The criteria for a **Go** decision (proceeding to Phase 2) are:

- [ ] O1: Average summarisation time ≤ 2 minutes (measured across pilot users)
- [ ] O6: ≥ 80% of 23 pilot users used the tool at least once in each of the final 2 weeks
- [ ] O5: Zero data residency issues raised during pilot
- [ ] Net Promoter Score from pilot users ≥ 7/10

---

## 6. Scope

### 6.1 In Scope — Phase 1

| # | Capability | Notes |
|---|------------|-------|
| S1 | Web-based UI — browser accessible, no install | Chrome, Edge (latest 2 versions) |
| S2 | URL summarisation — HTTP/HTTPS web pages | Publicly accessible URLs only |
| S3 | PDF upload and summarisation | Up to 10MB; text-based PDFs only |
| S4 | Plain text and Markdown file summarisation | .txt, .md |
| S5 | Bullet-point summary output (3–5 bullets) | Default output mode |
| S6 | JSON output mode | `{ bullets: string[], source: string }` |
| S7 | Temperature presets — Precise / Balanced / Creative | Maps to 0.3 / 0.6 / 1.0 |
| S8 | Real-time streaming output | Server-Sent Events protocol |
| S9 | Cloud deployment (Render) | Pilot environment — not LG infrastructure |
| S10 | CI/CD pipeline — automated quality gates | ESLint + TypeScript on every commit |
| S11 | Usage analytics | Google Analytics GA4 (anonymised) |

### 6.2 Out of Scope — Phase 1

| # | Item | Reason Deferred | Target Phase |
|---|------|----------------|--------------|
| OS1 | User authentication / SSO (Azure AD) | Pilot is internal; IP-based access sufficient | Phase 2 |
| OS2 | Document history / audit log per user | Storage design not finalised | Phase 2 |
| OS3 | Hindi / regional language summarisation | Model evaluation required | Phase 2 |
| OS4 | Password-protected PDF support | Requires additional decryption library; legal review needed | Phase 2 |
| OS5 | Mobile application (iOS / Android) | Out of budget for Phase 1 | Phase 3 |
| OS6 | SAP / SharePoint integration | Significant IT change management required | Phase 2 |
| OS7 | Custom LLM fine-tuning on LG documents | Data governance approval not yet obtained | Phase 3 |
| OS8 | Scanned / image-based PDF (OCR) | OCR library evaluation in progress | Phase 2 |
| OS9 | On-premise / LG-hosted deployment | LG IT infrastructure provisioning lead time | Phase 2 |

> **Scope Freeze Note:** This scope was agreed and frozen at **Stakeholder Workshop #2 (28-Feb-2025)**. Any additions require a formal Change Request (CR) per Section 17.3.

---

## 7. Stakeholders & RACI

### 7.1 Stakeholder Register

| ID | Name | Title | Business Unit | Location | Engagement Level |
|----|------|-------|---------------|----------|-----------------|
| ST-01 | Vikas Sethi | VP — Digital Transformation & IT | Corporate IT | Noida | Executive Sponsor — monthly touchpoint |
| ST-02 | Ananya Sharma | Head of IT Infrastructure & Applications | Corporate IT | Noida | Key decision-maker — weekly sync |
| ST-03 | Sanjay Kumar | PMO Lead — Digital Initiatives | PMO | Noida | Governance — weekly status report |
| ST-04 | Kiran Bhat | Senior Manager — Supply Chain Analytics | Supply Chain | Bengaluru | Pilot user lead — bi-weekly |
| ST-05 | Priya Menon | Manager — Regulatory Compliance | Legal & Compliance | Noida | Compliance sign-off — as needed |
| ST-06 | Pilot Analysts (23 users) | Analysts / Senior Analysts | HA, Regulatory, Market Intelligence | Various | End users — UAT participants |
| ST-07 | Rajesh Nair | Manager | Deloitte T&T | Mumbai | Engagement Manager |
| ST-08 | Pritam Mondal | Senior Associate | Deloitte T&T | Bengaluru | BA & Delivery Lead |
| ST-09 | Rahul Mehta | Senior Associate | Deloitte QA | Pune | Quality Assurance |

### 7.2 RACI Matrix

| Activity | Vikas Sethi | Ananya Sharma | Sanjay Kumar | Kiran Bhat | Priya Menon | Rajesh Nair | Pritam Mondal |
|----------|-------------|---------------|--------------|------------|-------------|-------------|---------------|
| BRD approval | A | C | C | I | C | A | R |
| Requirements sign-off | A | C | I | C | C | A | R |
| Compliance review | I | I | I | I | A | C | R |
| UAT coordination | I | A | C | R | I | C | R |
| Go/No-Go decision | A | C | C | C | I | C | I |
| Change request approval | A | C | A | I | I | C | R |
| Phase 2 scoping | A | C | C | C | I | R | R |

**R** = Responsible · **A** = Accountable · **C** = Consulted · **I** = Informed

---

## 8. Business Requirements

> Business requirements capture *what the business needs to achieve* — independent of any technical solution.

| ID | Business Requirement | MoSCoW | Source | Traceability |
|----|---------------------|--------|--------|--------------|
| BR-01 | Any LG analyst shall be able to summarise a document without IT support or technical training | Must Have | Workshop #1 — all analyst attendees | FR-01 to FR-12 |
| BR-02 | Summaries shall be available in under 10 seconds for standard-length documents (up to 15 pages) | Must Have | VP Directive — Vikas Sethi, 03-Feb-2025 | NFR-01, NFR-02 |
| BR-03 | Summary output shall be structured and consistent enough to be pasted directly into a leadership deck | Must Have | PMO Lead — Sanjay Kumar | FR-09, FR-10 |
| BR-04 | The tool shall support PDF as the primary input format (BIS reports, supplier audit docs) | Must Have | Head of IT — Ananya Sharma | FR-05 to FR-08 |
| BR-05 | Summary output shall be available in a machine-readable format consumable by Power BI | Should Have | Supply Chain Analytics — Kiran Bhat | FR-10 |
| BR-06 | The tool shall be accessible via any LG corporate browser without software installation or IT helpdesk involvement | Must Have | IT Policy — ref. LGEIL-IT-POL-012 | S1, NFR-09 |
| BR-07 | Document content submitted to the tool shall not be stored, logged, or retained after the request completes | Must Have | Legal & Compliance — Priya Menon; DPDP Act 2023 | NFR-10, Section 11 |
| BR-08 | The tool shall provide a mechanism to control output precision — analytical summaries for compliance, broader summaries for strategy | Should Have | Workshop #1 — analyst feedback | FR-13, FR-14 |
| BR-09 | The tool shall handle documents in excess of standard email attachment limits (>5MB PDFs) | Should Have | Regulatory Affairs team — Workshop #2 | FR-05 |
| BR-10 | The tool shall provide meaningful error messages — analysts must not encounter unexplained failures | Must Have | Workshop #1 — analyst feedback | FR-15 to FR-17 |

---

## 9. Functional Requirements & Acceptance Criteria

> Each requirement includes acceptance criteria — the conditions under which the requirement is considered **Done** during UAT.

### 9.1 URL Summarisation

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FR-01 | System shall accept any valid HTTP or HTTPS URL as input | AC: Submitting a valid URL initiates a summarisation request. Submitting a malformed URL (no protocol, spaces) returns a user-readable validation error without crashing. |
| FR-02 | System shall fetch the URL content with a configurable timeout (default 15 seconds) | AC: If the target URL does not respond within 15 seconds, the user sees "Request timed out — please try again" message. No unhandled error in the UI. |
| FR-03 | System shall follow HTTP 3xx redirects up to a maximum of 10 hops | AC: A URL with ≤10 redirects resolves and is summarised. A URL with >10 redirects returns "Too many redirects" error message. |
| FR-04 | System shall return a clear, user-readable error for HTTP 4xx and 5xx responses | AC: A URL returning HTTP 404 shows "Page not found (HTTP 404)". A URL returning HTTP 500 shows "Server error (HTTP 500)". Neither causes a UI crash. |

### 9.2 PDF Summarisation

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FR-05 | System shall accept PDF file uploads up to 10MB | AC: A 9.8MB PDF uploads and is summarised. A file >10MB is rejected with a user-readable size error before upload is attempted. |
| FR-06 | System shall validate that uploaded files are PDF format before processing (MIME type + extension) | AC: Uploading a .jpg file renamed to .pdf is rejected with "Only PDF files are supported." Uploading a valid .pdf proceeds. |
| FR-07 | System shall process uploaded PDF content entirely in-memory — no write to server filesystem | AC: Verified by code review and penetration test. No temporary files created in server directory during or after PDF upload. |
| FR-08 | System shall return a meaningful error if the PDF yields no extractable text (e.g. scanned image) | AC: Uploading a scanned PDF (no embedded text) returns "Unable to extract text from this PDF — it may be image-based." No unhandled exception. |

### 9.3 Summary Output

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FR-09 | System shall return 3–5 bullet points by default, each beginning with the • character | AC: Five distinct, non-empty bullet points returned for a 5-page document. Bullets do not contain preamble or closing remarks. |
| FR-10 | System shall support a JSON output mode returning `{ "bullets": string[], "source": string }` | AC: Enabling JSON toggle returns parseable JSON. `bullets` is an array of 3–5 strings. `source` matches the submitted URL or filename. Validated with `jq`. |
| FR-11 | System shall stream output tokens in real time using Server-Sent Events | AC: First token visible in UI within 3 seconds of submit. Output appears progressively — not in a single block after delay. |
| FR-12 | Content exceeding 100,000 characters shall be automatically truncated; prompt shall note truncation | AC: Submitting a 120,000-character document returns a summary. The status line reads "Note: content was truncated to 100,000 characters." No timeout or crash. |

### 9.4 Temperature / Output Style

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FR-13 | System shall provide three presets: Precise (0.3), Balanced (0.6), Creative (1.0) | AC: Each preset is selectable. Selecting Precise and submitting the same document produces a more factual, terse output than Creative. Verified in UAT Round 2. |
| FR-14 | Temperature value shall be validated and clamped server-side between 0.0 and 1.0 | AC: Attempting to POST `temperature=5.0` via API results in the request being processed at temperature=1.0. Verified by direct API call in Postman. |

### 9.5 Error Handling

| ID | Requirement | Acceptance Criteria |
|----|-------------|-------------------|
| FR-15 | System shall return a user-readable error when the API key is missing or invalid | AC: Deploying with an invalid API key and submitting a request returns "Invalid API key — check your ANTHROPIC_API_KEY." No stack trace visible to user. |
| FR-16 | System shall return a user-readable error when the Anthropic API rate limit is exceeded | AC: Triggering an HTTP 429 from the Anthropic API returns "Rate limit exceeded. Wait a moment and try again." No unhandled exception. |
| FR-17 | System shall abort the active Anthropic API stream immediately when the user closes the browser tab | AC: Opening browser DevTools → Network tab, submitting a request, closing tab mid-stream — the SSE connection closes within 1 second. Verified in server logs. |

---

## 10. Non-Functional Requirements

| ID | Category | Requirement | Target | Measurement |
|----|----------|-------------|--------|-------------|
| NFR-01 | Performance | Time to first streamed token | < 3 seconds from submit | Measured in UAT — 10 test runs avg. |
| NFR-02 | Performance | Full summary delivery for a standard BIS report (10 pages) | < 20 seconds end-to-end | Measured in UAT |
| NFR-03 | Security | API key must never appear in source code, build output, or server logs | Zero instances | Code review + GitHub secret scan |
| NFR-04 | Security | JSON request body size limit | 1MB maximum | Verified by sending oversized payload — HTTP 413 returned |
| NFR-05 | Security | File upload validation | Reject non-PDF by MIME type and extension | UAT test case UAT-SEC-01 |
| NFR-06 | Security | Input character limit | 100,000 characters max to AI model | Verified by UAT test case UAT-SEC-02 |
| NFR-07 | Reliability | Graceful client disconnect | API stream aborted within 1 second | Server log verification |
| NFR-08 | Reliability | No unhandled server crashes on bad input | Server returns 4xx/5xx — does not crash | Chaos test: 20 malformed requests |
| NFR-09 | Availability | Uptime during pilot period | ≥ 99% | Render uptime dashboard |
| NFR-10 | Maintainability | CI quality gate | ESLint + TypeScript compile pass on every commit | GitHub Actions badge — green |
| NFR-11 | Compatibility | Browser support | Chrome 120+, Edge 120+, Firefox 121+ | Cross-browser UAT |
| NFR-12 | Compliance | Document content retention | Zero retention post-request | Code review confirms no DB write, no file write |

---

## 11. Regulatory & Compliance Requirements

### 11.1 India Digital Personal Data Protection (DPDP) Act, 2023

The DPDP Act, notified under the Ministry of Electronics and Information Technology (MeitY), imposes obligations on entities processing personal data of Indian residents. The following requirements apply to this engagement:

| ID | Obligation | How Addressed |
|----|------------|---------------|
| CR-01 | Data minimisation — collect only what is necessary | Tool does not store any submitted content. Request lifecycle: receive → process → return → discard. |
| CR-02 | Purpose limitation — data used only for stated purpose | API call to Anthropic is for summarisation only. No secondary use. |
| CR-03 | Data localisation (if applicable to sensitive personal data) | Phase 1 documents should not contain sensitive personal data. Priya Menon (Compliance) to confirm categorisation before pilot go-live. **[OPEN ITEM OI-03]** |
| CR-04 | Third-party data processor obligations | Anthropic is a data processor. LG Legal to review Anthropic's Data Processing Agreement (DPA) before go-live. **[OPEN ITEM OI-04]** |

### 11.2 LG Global AI Usage Policy

LG Electronics Inc. issued an internal AI Tool Usage Policy (ref: **LGE-AI-POL-2024-003**) in September 2024. Key requirements for tools using external AI APIs:

- External AI providers must be on the LG approved vendor list OR a waiver must be obtained from the Global CTO office
- No LG trade secrets, product roadmaps, or unannounced product data may be submitted to external AI tools
- Usage must be logged at the organisational level (not individual) for audit purposes

> **Action Required:** Ananya Sharma to confirm Anthropic's status on LG approved vendor list. **[OPEN ITEM OI-01]**

### 11.3 Bureau of Indian Standards (BIS) Document Handling

BIS compliance documents processed by this tool may contain pre-publication certification data. The following controls apply:

- Analysts are responsible for ensuring documents submitted are cleared for external processing
- A one-page "Acceptable Use" guide to be produced by Deloitte and approved by Priya Menon before pilot launch **[OPEN ITEM OI-05]**

---

## 12. Assumptions & Dependencies

### 12.1 Assumptions

| ID | Assumption | Owner | Consequence if Wrong |
|----|------------|-------|----------------------|
| A1 | Pilot users have access to Chrome or Edge (latest version) on corporate machines | LG IT | Compatibility testing scope increases |
| A2 | Documents submitted during pilot will be text-based PDFs (not scanned images) | LG Analysts | FR-08 error rate increases; OCR needed earlier |
| A3 | URLs submitted are publicly accessible — not behind LG intranet or authentication | LG Analysts | URL feature cannot be used for internal SharePoint links |
| A4 | LG will procure and manage their own Anthropic API key for production; Deloitte key used for pilot only | LG IT / Procurement | API cost accountability gap |
| A5 | Phase 1 does not require individual user-level usage tracking or attribution | LG PMO | Audit log requirements change scope |
| A6 | Pilot user count remains at 23; scaling beyond this requires Phase 2 infrastructure review | LG PMO | Render free tier may be insufficient |
| A7 | LG IT will not require the tool to be hosted on LG-owned infrastructure for the Phase 1 pilot | LG IT | Render deployment is blocked; on-prem setup required |

### 12.2 Dependencies

| ID | Dependency | Owner | Due Date | Risk if Not Met |
|----|------------|-------|----------|-----------------|
| D1 | Anthropic Claude API operational and accessible from Render cloud | Anthropic | Ongoing | Tool non-functional |
| D2 | LG IT whitelist of summarize-cli.onrender.com on corporate proxy/firewall | Ananya Sharma | 14-Apr-2025 | Pilot users cannot access tool |
| D3 | Anthropic vendor approval (or waiver) per LGE-AI-POL-2024-003 | Ananya Sharma | 18-Apr-2025 | Pilot cannot commence |
| D4 | Anthropic DPA review by LG Legal | Priya Menon | 18-Apr-2025 | Compliance blocker |
| D5 | 23 pilot users identified and onboarded by LG PMO | Sanjay Kumar | 21-Apr-2025 | UAT cannot begin |
| D6 | LG Procurement PO raised for Anthropic API usage costs (est. ₹40,000–60,000 for pilot period) | Sanjay Kumar | 14-Apr-2025 | API quota exhausted mid-pilot |

---

## 13. Constraints

| ID | Constraint | Category |
|----|------------|----------|
| C1 | Phase 1 must be delivered within the 6-week engagement window per SOW-LG-2025-04872 | Commercial |
| C2 | No confidential LG product, trade secret, or unannounced roadmap data may be submitted to the tool | Legal |
| C3 | Tool must operate within Render free tier for the pilot period — paid upgrade deferred to Phase 2 | Budget |
| C4 | English language summarisation only in Phase 1 | Scope |
| C5 | No modifications to LG's SAP, SharePoint, or Active Directory environments in Phase 1 | IT Policy |
| C6 | Deloitte team has read-only access to LG systems — no write access to LG infrastructure | Engagement T&Cs |
| C7 | Tool source code must be available for LG IT security review before go-live | Security Policy |

---

## 14. Risks & Issues

### 14.1 Risk Register

| ID | Risk Description | Likelihood | Impact | Severity | Mitigation | Owner |
|----|-----------------|------------|--------|----------|------------|-------|
| R1 | Anthropic API rate limits hit during concurrent pilot usage (HTTP 429) | Medium | High | **HIGH** | User-facing rate limit message implemented; advise staggered usage during pilot; upgrade API tier in Phase 2 | Pritam Mondal |
| R2 | LG analyst submits confidential product data to external AI API | Low | Critical | **HIGH** | Acceptable Use Policy (OI-05) required before launch; training session for pilot users | Priya Menon |
| R3 | Anthropic vendor approval delayed — pilot start date slips | Medium | High | **HIGH** | Escalation path: Rajesh Nair → Vikas Sethi if not resolved by 18-Apr-2025 | Ananya Sharma |
| R4 | Render free tier performance degrades under 10+ concurrent users | Medium | Medium | **MEDIUM** | Monitor via GA4 during pilot; pre-agreed upgrade trigger if P95 response > 30 seconds | Pritam Mondal |
| R5 | Scanned / image-based PDFs submitted — tool returns empty summary | High | Low | **MEDIUM** | Communicate limitation in Acceptable Use guide; OCR in Phase 2 backlog | Pritam Mondal |
| R6 | Pilot user adoption below 80% threshold — Go/No-Go at risk | Medium | High | **HIGH** | Kiran Bhat (pilot lead) to champion usage; 2-week mid-pilot check-in to course correct | Kiran Bhat |
| R7 | Scope creep — stakeholders request auth/SSO or SharePoint integration during pilot | Medium | Medium | **MEDIUM** | All scope additions require CR per Section 17.3; BRD is the binding scope document | Rajesh Nair |

### 14.2 Issue Log

| ID | Issue | Raised By | Date Raised | Status | Resolution |
|----|-------|-----------|-------------|--------|------------|
| I-01 | LG IT proxy blocks outbound requests to Render domain | Ananya Sharma | 28-Mar-2025 | **OPEN** | Firewall whitelist request submitted — due 14-Apr-2025 |
| I-02 | Pilot user list from Supply Chain only — Regulatory Affairs users not yet confirmed | Sanjay Kumar | 02-Apr-2025 | **OPEN** | Sanjay to confirm 8 Regulatory Affairs users by 10-Apr-2025 |

---

## 15. Project Timeline & Tollgates

```
WEEK 1 (07-Apr)    WEEK 2 (14-Apr)    WEEK 3 (21-Apr)    WEEK 4 (28-Apr)    WEEK 5 (05-May)    WEEK 6 (12-May)
      │                   │                   │                   │                   │                   │
  ┌───┴───┐           ┌───┴───┐           ┌───┴───┐           ┌───┴───┐           ┌───┴───┐           ┌───┴───┐
  │ BRD   │           │ Dev   │           │ UAT   │           │ UAT   │           │ Pilot │           │ Pilot │
  │ Sign- │           │ Build │           │ Prep  │           │ Round │           │ Week  │           │ Week  │
  │ Off   │           │ & QA  │           │ + Env │           │   1   │           │   1   │           │   2   │
  └───────┘           └───────┘           └───────┘           └───────┘           └───────┘           └───────┘
      │                   │                   │                   │                   │                   │
  TOLLGATE 0         TOLLGATE 1          TOLLGATE 2          TOLLGATE 3          TOLLGATE 4          TOLLGATE 5
  BRD Approved       Dev Complete        UAT Ready           UAT Sign-Off        Pilot Live         Go/No-Go
```

### Tollgate Criteria

| Tollgate | Exit Criteria | Owner |
|----------|---------------|-------|
| T0 — BRD Approved | All sign-offs obtained (Section 17.2) | Rajesh Nair |
| T1 — Dev Complete | All FRs implemented; CI green; code review passed | Pritam Mondal |
| T2 — UAT Ready | UAT environment deployed; test cases written; pilot users onboarded | Pritam Mondal + Sanjay Kumar |
| T3 — UAT Sign-Off | All P1 defects resolved; UAT sign-off from Ananya Sharma | Ananya Sharma |
| T4 — Pilot Live | Acceptable Use Policy distributed; LG IT firewall whitelist confirmed | Kiran Bhat |
| T5 — Go/No-Go | Go/No-Go criteria from Section 5 assessed; decision recorded | Vikas Sethi + Rajesh Nair |

---

## 16. UAT Plan

### 16.1 UAT Approach

User Acceptance Testing will be conducted in **two rounds**:

- **Round 1 (internal):** Deloitte team + 3 LG IT representatives test all functional and non-functional requirements against acceptance criteria defined in Section 9
- **Round 2 (pilot users):** 10 representative pilot analysts from the 23-user cohort test real-world scenarios using actual LG documents

### 16.2 UAT Test Scenarios

| ID | Scenario | Input | Expected Output | Priority |
|----|----------|-------|-----------------|----------|
| UAT-01 | Summarise a BIS compliance PDF | Upload a 12-page BIS certification report PDF | 3–5 bullet summary; < 20 seconds | P1 |
| UAT-02 | Summarise a competitor news article URL | Paste a public URL from Economic Times / Reuters | 3–5 bullet summary streamed in real time | P1 |
| UAT-03 | JSON output mode | Submit any URL with JSON toggle ON | Valid JSON `{ bullets, source }` parseable by Power BI | P1 |
| UAT-04 | Temperature — Precise vs Creative | Submit same document with Precise, then Creative | Noticeably different tone/style | P2 |
| UAT-05 | Oversized file rejection | Upload a 12MB PDF | User-readable error: file too large | P1 |
| UAT-06 | Non-PDF upload rejection | Upload a .docx file | User-readable error: PDF only | P1 |
| UAT-07 | Unreachable URL | Submit a URL that returns 404 | User-readable error; no crash | P1 |
| UAT-08 | Large document truncation | Submit a URL with >100,000 characters of content | Summary returned; truncation notice shown | P2 |
| UAT-09 | Close tab mid-stream | Submit request; close tab after 2 seconds | Server log shows stream.abort() called | P2 |
| UAT-SEC-01 | Non-PDF MIME bypass | Rename .jpg to .pdf and upload | Rejected with "Only PDF files are supported" | P1 |
| UAT-SEC-02 | Temperature manipulation via API | POST `temperature=99` directly to /api/summarize | Request processed with temperature clamped to 1.0 | P1 |

### 16.3 Defect Severity Classification

| Severity | Definition | Resolution SLA |
|----------|------------|----------------|
| P1 — Critical | Feature does not work; blocker for UAT sign-off | Fix within 1 business day |
| P2 — High | Feature partially works; significant UX degradation | Fix within 3 business days |
| P3 — Medium | Minor issue; workaround exists | Fix before pilot go-live |
| P4 — Low | Cosmetic / non-functional | Logged in Phase 2 backlog |

### 16.4 UAT Sign-Off

UAT is considered complete when:
- All P1 and P2 defects are resolved and re-tested
- Ananya Sharma (LG Head of IT) signs the UAT Completion Certificate
- No new P1 defects raised in 48 hours following final fix

---

## 17. Sign-Off & Approval Process

### 17.1 Approval Workflow

```
  [Pritam Mondal]           [Rahul Mehta]           [LG Stakeholders]
  Deloitte BA               Deloitte QA              (5 business days
  Submits BRD v1.0    →    Internal peer review  →   for review)
                                                            ↓
  [Pritam Mondal]           [All Approvers]         [Stakeholder Review
  Incorporates       ←     Sign-off meeting    ←    Meeting — walkthrough
  comments                 (30 min, virtual)         + open Q&A)
        ↓
  BRD v1.0 Final
  Stored in:
  - Deloitte SharePoint: Eng No. 04872 / Deliverables
  - LG PMO SharePoint: DWPP / BRDs
        ↓
  Development commences
```

### 17.2 Sign-Off Register

| # | Name | Title | Organisation | Signature | Date |
|---|------|-------|--------------|-----------|------|
| 1 | Vikas Sethi | VP — Digital Transformation & IT | LG Electronics India | _________________________ | _____________ |
| 2 | Ananya Sharma | Head of IT Infrastructure & Applications | LG Electronics India | _________________________ | _____________ |
| 3 | Sanjay Kumar | PMO Lead — Digital Initiatives | LG Electronics India | _________________________ | _____________ |
| 4 | Priya Menon | Manager — Regulatory Compliance | LG Electronics India | _________________________ | _____________ |
| 5 | Rajesh Nair | Manager, Technology & Transformation | Deloitte Consulting LLP | _________________________ | _____________ |

> **By signing this document, each signatory confirms:**
> (a) the requirements documented herein accurately reflect the business needs of LG Electronics India for Phase 1 of this engagement;
> (b) they have the authority to approve on behalf of their organisation;
> (c) they authorise Deloitte Consulting LLP to proceed to the development and testing phases as defined in Section 15.
>
> Signing does not constitute acceptance of the delivered solution — that is addressed through the UAT Sign-Off in Section 16.4.

### 17.3 Change Control Process

Any changes to agreed requirements after BRD sign-off must follow the **Deloitte Change Request (CR) Process** per MSA-LG-DLT-2024-07, Clause 8.2:

```
Requestor raises CR form → Deloitte BA assesses scope/cost/timeline impact (2 business days)
        ↓
Impact Assessment shared with LG PMO
        ↓
LG PMO Lead approves / rejects CR (3 business days)
        ↓
If APPROVED:   BRD updated → new version → re-signed by affected approvers → SOW amendment if cost impact
If REJECTED:   Original scope maintained → item logged for Phase 2 consideration
```

> **Note:** Verbal agreements, emails, and Teams messages do not constitute approved scope changes. Only CR forms processed through this workflow are binding.

---

## 18. Open Items Log

| ID | Item | Owner | Due Date | Status |
|----|------|-------|----------|--------|
| OI-01 | Confirm Anthropic is on LG approved AI vendor list (ref. LGE-AI-POL-2024-003) | Ananya Sharma | 18-Apr-2025 | OPEN |
| OI-02 | LG IT to whitelist summarize-cli.onrender.com on corporate proxy/firewall | Ananya Sharma | 14-Apr-2025 | OPEN |
| OI-03 | Legal to confirm whether pilot documents fall under DPDP "sensitive personal data" category | Priya Menon | 18-Apr-2025 | OPEN |
| OI-04 | LG Legal to review Anthropic's Data Processing Agreement (DPA) | Priya Menon | 18-Apr-2025 | OPEN |
| OI-05 | Deloitte to draft Acceptable Use Policy; LG Compliance to approve | Pritam Mondal / Priya Menon | 21-Apr-2025 | OPEN |
| OI-06 | Confirm 23 pilot users — 8 from Regulatory Affairs not yet named | Sanjay Kumar | 10-Apr-2025 | OPEN |
| OI-07 | LG Procurement to raise PO for Anthropic API costs (est. ₹40,000–60,000 for pilot) | Sanjay Kumar | 14-Apr-2025 | OPEN |

> All open items must be resolved before **Tollgate T2 (UAT Ready)** on 21-Apr-2025. Items OI-03 and OI-04 are blockers for pilot go-live.

---

## 19. Appendix

### 19.1 Glossary

| Term | Definition |
|------|------------|
| BRD | Business Requirements Document |
| CR | Change Request — formal mechanism to modify agreed scope post sign-off |
| DPDP Act | Digital Personal Data Protection Act, 2023 — India's data protection legislation |
| BIS | Bureau of Indian Standards — India's national standards body |
| DPA | Data Processing Agreement — contract governing how a third party processes data on your behalf |
| MeitY | Ministry of Electronics and Information Technology, Government of India |
| SSE | Server-Sent Events — HTTP protocol for one-way real-time data streaming from server to browser |
| Temperature | AI model parameter controlling output randomness (0.0 = deterministic, 1.0 = creative) |
| CI/CD | Continuous Integration / Continuous Deployment — automated build, lint, and deploy pipeline |
| UAT | User Acceptance Testing — structured testing by end users against agreed acceptance criteria |
| RACI | Responsible, Accountable, Consulted, Informed — stakeholder responsibility framework |
| WBS | Work Breakdown Structure — hierarchical project cost coding used by Deloitte for billing |
| SOW | Statement of Work — contractual document defining engagement deliverables and fees |
| MSA | Master Services Agreement — overarching contract between LG and Deloitte |
| T&M | Time & Materials — billing model where client pays for actual hours and costs incurred |
| PO | Purchase Order — LG Finance document authorising expenditure |
| DWPP | Digital Workforce Productivity Programme — LG India's internal initiative under which this engagement sits |

### 19.2 Discovery Workshop Notes

**Workshop #1 — 14-Feb-2025 | 10:00–13:00 IST | MS Teams**
Attendees: Vikas Sethi, Ananya Sharma, Sanjay Kumar, Kiran Bhat (LG); Rajesh Nair, Pritam Mondal (Deloitte)

Key outputs:
- As-Is process mapped (see Section 3.2)
- 23 analysts identified as pilot cohort across 3 BUs
- Time-motion study findings presented — 3.2 hrs/day confirmed by attendees
- Initial requirements BR-01 to BR-06 captured
- Decision: Phase 1 to be browser-based only — no CLI deployment for business users

Action items:
- [Pritam Mondal] Draft BRD v0.1 by 17-Feb → **DONE**
- [Sanjay Kumar] Confirm pilot user list → **PARTIALLY DONE — see OI-06**
- [Ananya Sharma] Check IT policy on external AI tools → **IN PROGRESS — see OI-01**

---

**Workshop #2 — 28-Feb-2025 | 14:00–16:00 IST | LG Noida Office (Room 3B)**
Attendees: Ananya Sharma, Sanjay Kumar, Priya Menon (LG); Pritam Mondal (Deloitte)

Key outputs:
- Scope boundary finalised — SAP/SharePoint integration explicitly deferred to Phase 2
- DPDP Act obligations reviewed — OI-03 and OI-04 raised
- Acceptable Use Policy requirement added (OI-05)
- UAT approach agreed — two-round model (Section 16)
- Change control process confirmed per MSA Clause 8.2

Action items:
- [Priya Menon] Review DPDP applicability and Anthropic DPA → **OPEN — OI-03, OI-04**
- [Pritam Mondal] Incorporate compliance section into BRD v0.4 → **DONE**
- [Sanjay Kumar] Raise PO for API costs → **OPEN — OI-07**

### 19.3 Related Documents

| Document | Reference | Location |
|----------|-----------|----------|
| Master Services Agreement | MSA-LG-DLT-2024-07 | Deloitte Legal / LG Procurement |
| Statement of Work — Phase 1 | SOW-LG-2025-04872 | Deloitte Eng. SharePoint / LG PMO |
| Time-Motion Study Report | DLT-LG-2024-TMS-003 | Deloitte Eng. SharePoint |
| LG AI Tool Usage Policy | LGE-AI-POL-2024-003 | LG IT Intranet |
| LG IT Policy — Browser Standards | LGEIL-IT-POL-012 | LG IT Intranet |
| Technical Deep Dive (Q&A) | — | `Artifacts/project-deep-dive.md` |
| Phase 2 Backlog | TBD | To be produced post Go/No-Go |
| Acceptable Use Policy (pilot) | TBD | To be produced — OI-05 |
| Anthropic Data Processing Agreement | — | To be obtained from Anthropic — OI-04 |

---

*This document is prepared by Deloitte Consulting LLP for the exclusive use of LG Electronics India Pvt. Ltd. in connection with Engagement No. IN-CON-2025-04872. It may not be relied upon by any other party or used for any other purpose. Unauthorised reproduction or distribution is strictly prohibited.*

*© 2025 Deloitte Consulting LLP. All rights reserved.*
