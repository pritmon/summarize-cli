# Business Requirements Document (BRD)

---

> **Document Title:** AI-Powered Document Summarization Tool — Business Requirements Document
> **Project Code:** DLT-LG-2025-AI-001
> **Prepared by:** Pritam Mondal, Senior Associate — Deloitte Consulting LLP
> **Client:** LG Electronics India Pvt. Ltd.
> **Engagement Lead:** [Engagement Manager Name]
> **Version:** 1.0 (Final — Approved)
> **Date:** April 2025
> **Classification:** Confidential

---

## Table of Contents

1. [Document Control](#1-document-control)
2. [Executive Summary](#2-executive-summary)
3. [Business Context & Problem Statement](#3-business-context--problem-statement)
4. [Project Objectives](#4-project-objectives)
5. [Scope](#5-scope)
6. [Stakeholders](#6-stakeholders)
7. [Business Requirements](#7-business-requirements)
8. [Functional Requirements](#8-functional-requirements)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Assumptions & Dependencies](#10-assumptions--dependencies)
11. [Constraints](#11-constraints)
12. [Risks](#12-risks)
13. [Sign-Off & Approval Process](#13-sign-off--approval-process)
14. [Appendix](#14-appendix)

---

## 1. Document Control

### Version History

| Version | Date | Author | Description |
|---------|------|--------|-------------|
| 0.1 | 01-Mar-2025 | Pritam Mondal | Initial draft — discovery phase output |
| 0.2 | 10-Mar-2025 | Pritam Mondal | Revised after Stakeholder Workshop #1 |
| 0.3 | 20-Mar-2025 | Ananya Sharma (LG IT Head) | Client review comments incorporated |
| 0.4 | 28-Mar-2025 | Rahul Mehta (Deloitte QA) | Peer review completed |
| 1.0 | 05-Apr-2025 | Pritam Mondal | Final version — submitted for sign-off |

### Distribution List

| Name | Role | Organisation | Access Level |
|------|------|--------------|--------------|
| Vikas Sethi | VP — Digital Transformation | LG Electronics India | Full |
| Ananya Sharma | Head of IT | LG Electronics India | Full |
| Sanjay Kumar | PMO Lead | LG Electronics India | Full |
| Rajesh Nair | Engagement Manager | Deloitte Consulting | Full |
| Pritam Mondal | Senior Associate / BA | Deloitte Consulting | Full |
| Deepa Rao | Legal & Compliance | LG Electronics India | Section 9, 11 only |

---

## 2. Executive Summary

LG Electronics India generates thousands of internal documents monthly — product compliance reports, supplier audit PDFs, market research articles, and regulatory filings. Analysts spend an estimated **3–4 hours per day** manually reading and summarising these documents before decision-making meetings.

Deloitte was engaged to design and deliver an **AI-powered document summarization tool** that enables LG employees to extract key insights from any URL, PDF, or text document in under 10 seconds — reducing manual effort, improving turnaround time, and enabling faster executive decision-making.

This BRD defines the business requirements, scope, and acceptance criteria for Phase 1 of the engagement.

---

## 3. Business Context & Problem Statement

### 3.1 Current State (As-Is)

```
Analyst receives document
        ↓
Opens document manually (PDF viewer / browser)
        ↓
Reads entire document (avg. 45–90 minutes per doc)
        ↓
Manually writes summary in Word/PPT
        ↓
Sends to manager for review
        ↓
Manager requests changes → loop repeats
```

**Pain Points identified during Discovery workshops (Feb 2025):**

| Pain Point | Frequency | Business Impact |
|------------|-----------|-----------------|
| Analysts spending >3 hrs/day on summarisation | Daily | High productivity loss |
| Inconsistent summary quality across teams | Weekly | Unreliable insights for decisions |
| Delay in sharing insights before leadership meetings | Pre-meeting | Decision delays |
| No structured output format for downstream tools | Always | Integration friction with BI tools |
| Compliance docs not being summarised — too long | Monthly | Regulatory risk |

### 3.2 Future State (To-Be)

Analyst submits URL or PDF → Tool returns structured 3–5 bullet summary in <10 seconds → Analyst reviews, exports, and shares. Total time: **under 2 minutes per document.**

---

## 4. Project Objectives

| # | Objective | Measurable Outcome |
|---|-----------|-------------------|
| O1 | Reduce document summarisation time | From avg. 45 min → under 2 min per document |
| O2 | Standardise summary output format | Consistent bullet-point or JSON format across all teams |
| O3 | Support PDF and web content | 100% of common document types handled without pre-processing |
| O4 | Enable integration with downstream tools | JSON output consumable by LG's internal BI/reporting systems |
| O5 | Deploy a secure, auditable tool | Zero PII leakage; all API keys stored in environment variables |

---

## 5. Scope

### 5.1 In Scope — Phase 1

- ✅ Web-based UI accessible via browser (no local installation required for business users)
- ✅ URL summarisation — any public HTTP/HTTPS web page
- ✅ PDF upload and summarisation (up to 10MB)
- ✅ Plain text / Markdown file summarisation
- ✅ Bullet-point output (default)
- ✅ JSON output mode for downstream system integration
- ✅ Temperature control — Precise / Balanced / Creative presets
- ✅ Streaming output — results appear in real time
- ✅ Deployment on cloud platform (Render)
- ✅ CI/CD pipeline with automated linting and build validation

### 5.2 Out of Scope — Phase 1

- ❌ User authentication / SSO integration (deferred to Phase 2)
- ❌ Document storage or history log
- ❌ Multi-language summarisation (English only in Phase 1)
- ❌ Summarisation of password-protected PDFs
- ❌ Mobile application
- ❌ Integration with LG's internal SharePoint or SAP systems (Phase 2)
- ❌ Custom fine-tuning of the AI model

---

## 6. Stakeholders

### 6.1 RACI Matrix

| Stakeholder | Role | R | A | C | I |
|------------|------|---|---|---|---|
| Vikas Sethi (LG VP) | Executive Sponsor | | ✅ | | ✅ |
| Ananya Sharma (LG IT Head) | Technical Decision Maker | | ✅ | ✅ | |
| Sanjay Kumar (LG PMO) | Project Governance | ✅ | | ✅ | |
| LG Analyst Team (10 users) | End Users | | | ✅ | ✅ |
| Rajesh Nair (Deloitte EM) | Engagement Oversight | | ✅ | | ✅ |
| Pritam Mondal (Deloitte BA) | Requirements & Delivery | ✅ | | | |
| Deepa Rao (LG Legal) | Compliance Sign-Off | | | ✅ | |

**R** = Responsible · **A** = Accountable · **C** = Consulted · **I** = Informed

---

## 7. Business Requirements

> Business requirements define *what the business needs* — not how the system works.

| ID | Requirement | Priority | Source |
|----|-------------|----------|--------|
| BR-01 | The tool shall enable LG employees to summarise any document or URL without technical knowledge | Must Have | Stakeholder Workshop #1 |
| BR-02 | Summaries shall be available in under 10 seconds for documents up to 10 pages | Must Have | VP Directive |
| BR-03 | The tool shall produce consistent, structured output suitable for sharing in leadership decks | Must Have | PMO Lead |
| BR-04 | The tool shall support PDF documents as LG's primary document format | Must Have | IT Head |
| BR-05 | Summary output shall be exportable in a machine-readable format for BI integration | Should Have | IT Head |
| BR-06 | The tool shall be accessible via any corporate browser without software installation | Must Have | IT Policy |
| BR-07 | The tool shall not store or log document content externally | Must Have | Legal & Compliance |
| BR-08 | Users shall be able to adjust output style between precise technical and creative summaries | Nice to Have | Analyst Team Feedback |

---

## 8. Functional Requirements

> Functional requirements define *what the system must do*.

### 8.1 URL Summarisation

| ID | Requirement |
|----|-------------|
| FR-01 | System shall accept any valid HTTP or HTTPS URL as input |
| FR-02 | System shall fetch the URL content with a 15-second timeout |
| FR-03 | System shall follow HTTP redirects up to a maximum of 10 hops |
| FR-04 | System shall return a clear error message for unreachable or invalid URLs |

### 8.2 PDF Summarisation

| ID | Requirement |
|----|-------------|
| FR-05 | System shall accept PDF file uploads up to 10MB |
| FR-06 | System shall validate that uploaded files are PDFs before processing |
| FR-07 | System shall process PDF content entirely in memory — no file storage on server |
| FR-08 | System shall return an error if the PDF contains no extractable text |

### 8.3 Summary Output

| ID | Requirement |
|----|-------------|
| FR-09 | System shall return 3–5 bullet points summarising the key content by default |
| FR-10 | System shall support a JSON output mode returning a structured `{ bullets, source }` object |
| FR-11 | System shall stream output tokens in real time — user sees results as they are generated |
| FR-12 | Content exceeding 100,000 characters shall be automatically truncated with a prompt note |

### 8.4 Temperature / Output Style

| ID | Requirement |
|----|-------------|
| FR-13 | System shall expose three presets: Precise (0.3), Balanced (0.6), Creative (1.0) |
| FR-14 | System shall clamp temperature values server-side between 0.0 and 1.0 |

### 8.5 Error Handling

| ID | Requirement |
|----|-------------|
| FR-15 | System shall return a user-readable error when the API key is invalid or missing |
| FR-16 | System shall return a user-readable error when the API rate limit is exceeded |
| FR-17 | System shall abort the AI API call immediately when the user closes the browser tab |

---

## 9. Non-Functional Requirements

| ID | Category | Requirement | Target |
|----|----------|-------------|--------|
| NFR-01 | Performance | Time-to-first-token for streaming | < 3 seconds |
| NFR-02 | Performance | Full summary delivery for a 5-page PDF | < 15 seconds |
| NFR-03 | Security | API key storage | Environment variable only — never in source code or logs |
| NFR-04 | Security | Request body size limit | Max 1MB for JSON requests |
| NFR-05 | Security | File upload validation | MIME type + extension check before processing |
| NFR-06 | Reliability | Graceful client disconnect | Active API stream aborted within 1 second of browser close |
| NFR-07 | Availability | Uptime target (Phase 1) | 99% (Render free tier SLA) |
| NFR-08 | Maintainability | Code quality gate | ESLint + TypeScript compile must pass on every commit |
| NFR-09 | Compatibility | Browser support | Chrome, Firefox, Edge (latest 2 versions) |
| NFR-10 | Compliance | Document content | No user document content persisted on server after request completes |

---

## 10. Assumptions & Dependencies

### Assumptions

| # | Assumption |
|---|------------|
| A1 | LG users have access to a modern corporate browser (Chrome/Edge) |
| A2 | Documents submitted are not password-protected |
| A3 | URLs submitted are publicly accessible (not behind VPN or authentication) |
| A4 | LG will provide and manage their own Anthropic API key for production use |
| A5 | Phase 1 does not require user-level access control or audit logging |

### Dependencies

| # | Dependency | Owner | Risk if unavailable |
|---|------------|-------|---------------------|
| D1 | Anthropic Claude API | Anthropic | Tool non-functional |
| D2 | Render cloud hosting platform | Deloitte | Service unavailable |
| D3 | LG IT approval for external API usage | LG IT Head | Deployment blocked |
| D4 | LG procurement approval for API costs | LG Finance | Budget not released |

---

## 11. Constraints

| # | Constraint |
|---|------------|
| C1 | Phase 1 delivery must be completed within 6-week engagement window |
| C2 | No PII or confidential LG data to be sent to third-party AI APIs without Legal sign-off |
| C3 | Tool must function within Render free tier resource limits for Phase 1 pilot |
| C4 | English language only for Phase 1 |
| C5 | No changes to LG's existing IT infrastructure in Phase 1 |

---

## 12. Risks

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|------------|--------|------------|
| R1 | Anthropic API rate limits hit during peak usage | Medium | High | Implement retry logic + user-facing error message; upgrade API tier in Phase 2 |
| R2 | Confidential LG documents submitted to external API | Low | Critical | Legal sign-off required; data handling policy document to be provided to users |
| R3 | Render free tier performance insufficient under concurrent users | Medium | Medium | Monitor during pilot; upgrade to paid tier in Phase 2 |
| R4 | PDF text extraction fails on scanned/image-based PDFs | High | Medium | Communicate limitation to users; OCR support in Phase 2 backlog |
| R5 | Scope creep — stakeholders request auth/SSO during Phase 1 | Medium | Medium | Firm scope boundary enforced via this BRD; deferred items documented |

---

## 13. Sign-Off & Approval Process

### 13.1 Approval Workflow

```
Step 1 — BRD Draft Submitted by Deloitte BA (Pritam Mondal)
        ↓
Step 2 — Internal Deloitte Peer Review (Rahul Mehta, QA Lead)
        ↓
Step 3 — BRD shared with LG Stakeholders for review (5 business days)
        ↓
Step 4 — Stakeholder Review Meeting (walkthrough + Q&A)
        ↓
Step 5 — Comments consolidated → BRD updated to v1.0
        ↓
Step 6 — Final BRD distributed to all stakeholders
        ↓
Step 7 — Sign-off obtained from all approvers (table below)
        ↓
Step 8 — Signed BRD stored in Deloitte project repository
        ↓
Step 9 — Development / delivery phase begins
```

### 13.2 Sign-Off Register

| Name | Role | Organisation | Signature | Date |
|------|------|--------------|-----------|------|
| Vikas Sethi | Executive Sponsor | LG Electronics India | ________________ | ________ |
| Ananya Sharma | Head of IT | LG Electronics India | ________________ | ________ |
| Sanjay Kumar | PMO Lead | LG Electronics India | ________________ | ________ |
| Deepa Rao | Legal & Compliance | LG Electronics India | ________________ | ________ |
| Rajesh Nair | Engagement Manager | Deloitte Consulting | ________________ | ________ |

> **Note:** By signing this document, each approver confirms that the requirements documented herein accurately represent the business needs of LG Electronics India for Phase 1 of the AI Summarization Tool engagement, and that they authorise Deloitte to proceed with solution design and development.

### 13.3 Change Control

Any changes to requirements after BRD sign-off must follow the **Deloitte Change Request (CR) Process**:

1. Requestor submits CR form to Deloitte BA
2. BA assesses impact on scope, timeline, and cost
3. Impact assessment shared with LG PMO within 2 business days
4. LG PMO approves or rejects CR
5. If approved → BRD updated, new version distributed, re-signed
6. If rejected → original scope maintained

---

## 14. Appendix

### 14.1 Glossary

| Term | Definition |
|------|------------|
| BRD | Business Requirements Document — defines what the business needs from a solution |
| SSE | Server-Sent Events — a protocol for one-way real-time data streaming from server to browser |
| API | Application Programming Interface — a connection point between two software systems |
| PDF | Portable Document Format — LG's primary format for compliance and audit documents |
| JSON | JavaScript Object Notation — structured, machine-readable data format |
| Temperature | A parameter controlling AI output randomness (0.0 = precise, 1.0 = creative) |
| CI/CD | Continuous Integration / Continuous Deployment — automated build and quality pipeline |
| PII | Personally Identifiable Information |

### 14.2 Related Documents

| Document | Location |
|----------|----------|
| Project Deep Dive (Technical Q&A) | `Artifacts/project-deep-dive.md` |
| Architecture Diagram | To be produced in Phase 1 HLD |
| Data Handling Policy | To be produced by LG Legal prior to go-live |
| Phase 2 Backlog | To be produced post Phase 1 pilot review |

### 14.3 Discovery Workshop Summary

**Workshop #1 — 14 Feb 2025**
- Attendees: Vikas Sethi, Ananya Sharma, 3 LG Analysts, Rajesh Nair, Pritam Mondal
- Output: Pain points identified, current-state process mapped, initial requirements collected

**Workshop #2 — 28 Feb 2025**
- Attendees: Ananya Sharma, Sanjay Kumar, Deepa Rao, Pritam Mondal
- Output: Scope boundary agreed, compliance constraints documented, RACI drafted

---

*This document is confidential and intended solely for the use of LG Electronics India Pvt. Ltd. and Deloitte Consulting LLP personnel involved in this engagement. Unauthorised distribution is prohibited.*

*© 2025 Deloitte Consulting LLP. All rights reserved.*
