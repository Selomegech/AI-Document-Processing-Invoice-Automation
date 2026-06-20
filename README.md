# AI Document Processing & Invoice Automation for CPA Firms

An end-to-end AI automation system built for **Apex Accounting**, a mid-size CPA firm serving 50+ small business clients. The system automates document intake, classification, data extraction, CRM management, and invoice generation — reducing manual data entry from **15+ hours/week to under 1 hour**.

## The Problem

Mid-size accounting firms handle hundreds of documents monthly — client invoices, receipts, financial statements, onboarding forms — and most of this data still gets entered manually. One office admin spends 15+ hours a week on:

- Reading and sorting incoming PDF documents
- Manually entering data into the CRM
- Creating and sending monthly invoices
- Logging financial data to spreadsheets
- Sending routine follow-up emails

This system replaces that entirely.

## What It Does

### Workflow 1: Inbound Document Processing

A client emails a PDF attachment → the system automatically:

1. **Extracts** text from the PDF
2. **Classifies** the document using AI (Gemini) into one of four categories
3. **Extracts** structured data (names, amounts, dates, line items)
4. **Routes** the data to the appropriate processing branch
5. **Logs** everything to Google Sheets as an audit trail
6. **Notifies** the team with formatted HTML emails

#### Document Types Handled

| Type | What Happens |
|------|-------------|
| **Vendor Invoice** | Line items extracted → logged to financial sheet → team notified for approval |
| **Expense Receipt** | Merchant, items, totals extracted → logged to financial sheet → confirmation sent |
| **New Client Onboarding Form** | Contact created/updated in HubSpot with deduplication → deal created in pipeline → service plan saved → welcome email sent |
| **Financial Statement** | Key figures extracted (revenue, expenses, net income) → note attached to client's CRM record → team notified |

#### Error Handling

- **Low confidence classification** (< 70%) → flagged for manual review
- **Missing critical fields** → flagged with specific missing field names
- **Non-PDF attachments** → notification sent, document skipped
- **Duplicate contacts** → detected via email search, existing record updated instead of duplicated

### Workflow 2: Outgoing Invoice Generation

Generates branded invoices automatically from client service plans:

1. Reads active service plans from Google Sheets (populated during onboarding)
2. Groups services by client
3. Generates professional HTML invoices with Apex Accounting branding
4. Logs each invoice to the financial sheet
5. Emails invoices to clients

Service plans support `Active` / `Paused` / `Inactive` status, so billing adjusts automatically when clients change their service mix.

## Architecture

```
                        ┌─────────────────────────────────────────┐
                        │         WORKFLOW 1: INBOUND             │
                        │         Document Processing             │
                        └─────────────────────────────────────────┘

Email with PDF  ──→  Gmail Trigger  ──→  IF (PDF?)  ──→  Extract Text
                                             │
                                        [Non-PDF]
                                             │
                                    Notify: Unsupported
                                         File Type

Extract Text  ──→  Build Prompt  ──→  Gemini AI  ──→  Parse & Validate
                                                            │
                                                   [Missing Fields?]
                                                       │        │
                                                     Yes        No
                                                      │         │
                                              Notify: Needs   Switch
                                               Review     ┌────┼────┬────┐
                                                          │    │    │    │
                                                       Invoice Receipt Form Statement
                                                          │    │    │    │
                                                          ▼    ▼    ▼    ▼
                                                       Sheets Sheets HubSpot HubSpot
                                                          +    +   Contact   Note
                                                       Gmail Gmail  Deal    Gmail
                                                                  Service
                                                                   Plan
                                                                  Gmail


                        ┌─────────────────────────────────────────┐
                        │         WORKFLOW 2: OUTBOUND            │
                        │         Invoice Generation              │
                        └─────────────────────────────────────────┘

Manual/Schedule  ──→  Read Service  ──→  Group by  ──→  Generate  ──→  Log to  ──→  Email
   Trigger             Plans (Sheets)     Client        Invoice       Sheets      Client
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| **n8n** (self-hosted on Railway) | Workflow orchestration |
| **Google Gemini API** | Document classification and data extraction |
| **HubSpot CRM** (free tier) | Contact management, deals, pipelines |
| **Google Sheets** | Financial logging, audit trail, service plans |
| **Gmail** | Document intake trigger, team notifications, client emails |
| **PDF Extract** | Text extraction from PDF attachments |

## Repository Structure

```
├── workflows/
│   ├── document-intake-workflow.json       # Main inbound processing workflow
│   └── invoice-generation-workflow.json    # Outbound invoice generation workflow
├── sample-documents/
│   ├── sample_vendor_invoice.pdf           # TechSupply Co. - IT equipment
│   ├── sample_vendor_invoice_2.pdf         # CloudStack Software - annual licenses
│   ├── sample_receipt.pdf                  # Capital Grille - client lunch
│   ├── sample_receipt_2.pdf               # Office Depot - office supplies
│   ├── sample_onboarding_form.pdf         # Meridian Holdings LLC
│   ├── sample_onboarding_form_2.pdf       # Lone Star Dental Group
│   ├── sample_financial_statement.pdf      # P&L Statement
│   ├── sample_balance_sheet.pdf           # Balance Sheet
│   ├── sample_minimal_invoice.pdf         # Edge case: minimal formatting
│   ├── apex_outgoing_invoice_sample.pdf   # Generated invoice example
│   └── financial_log_template.csv         # Google Sheets template
├── email-templates/
│   ├── vendor-invoice-approval.html       # Invoice needs approval notification
│   ├── receipt-logged.html                # Receipt logged confirmation
│   ├── welcome-onboarding.html            # New client welcome email
│   ├── financial-statement-notification.html
│   ├── outgoing-invoice.html              # Branded outgoing invoice
│   └── manual-review-needed.html          # Low confidence / error notification
├── screenshots/
│   └── (workflow screenshots)
└── README.md
```

## Setup Guide

### Prerequisites

- n8n instance (self-hosted or cloud)
- Google account (Gmail + Sheets)
- HubSpot account (free tier works)
- Gemini API key

### Step 1: Import Workflows

1. Open n8n → click "Import from File"
2. Import `workflows/document-intake-workflow.json`
3. Import `workflows/invoice-generation-workflow.json`

### Step 2: Configure Credentials

Set up these credentials in n8n:

- **Gmail OAuth2** — for email trigger and sending
- **Google Sheets OAuth2** — for logging data
- **HubSpot Private App** — with scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`, `crm.objects.deals.read`, `crm.objects.deals.write`, `crm.schemas.deals.read`
- **Gemini API** — paste key directly in the HTTP Request URL

### Step 3: Create Google Sheets

1. **Apex Accounting - Financial Log** — columns: Date Received, Client Name, Company, Document Type, Description, Amount, Tax, Total, Due Date, Status, HubSpot Contact ID, Processed By, Notes
2. **Apex Accounting - Service Plans** — columns: Client Email, Client Name, Company, Service Description, Quantity, Rate, Amount, Status

### Step 4: Configure HubSpot

1. Create a pipeline called "Client Onboarding" with stages: Document Received, Under Review, Onboarded, Closed Won, Closed Lost
2. Create a Private App with the required scopes

### Step 5: Test

Send emails with the sample PDFs attached to the Gmail account connected to n8n. Each document type should classify, extract, and route correctly.

## AI Classification Prompt

The system uses a single Gemini API call to both classify and extract data. Key design decisions:

- **Temperature 0.1** for consistent classification
- **Confidence scoring** with 0.7 threshold — below this, documents are flagged for human review
- **Null for missing fields** — the AI never guesses, it returns null and the system flags it
- **Document text truncated to 6,000 chars** for token efficiency

## Business Impact

| Metric | Before | After |
|--------|--------|-------|
| Document processing time | 15+ hrs/week | < 1 hr/week |
| Data entry errors | Frequent | Near-zero (AI + validation) |
| New client onboarding | 1-2 days | Instant |
| Monthly invoice generation | 3-5 hrs (manual) | 1 click (automated) |
| Document classification | Manual sorting | AI-powered (< 30 seconds) |

## Applicable Industries

This system is a template adaptable to any document-heavy business:

- **CPA / Accounting firms** — invoices, receipts, tax documents, client onboarding
- **Law firms** — case documents, client intake, billing
- **Insurance agencies** — claims processing, policy documents
- **Property management** — lease agreements, vendor invoices, tenant onboarding
- **Medical practices** — patient intake, insurance documents, billing

## Built With

Built by [Azyab Tech](https://azyab.com) — Web Development, Mobile Apps, and AI Automation.

## License

MIT
