# FLORAL User Manual
## Dental Health Record Management System with Predictive Analytics

**Barangay Tanyag School Dental Clinics — Taguig City**

---

**JOSÉ RIZAL UNIVERSITY**  
College of Computer Studies and Engineering  
Bachelor of Science in Information Technology  
2nd Semester, SY 2025–2026

**Group 404**

| Name | Role |
|------|------|
| Alondres, Jerald T. | Developer |
| Arcaina, Annika July J. | Developer |
| Bartolome, Beatrice Matilda D. | Developer |
| Pagayunan, Maria Catlyn T. | Developer |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Requirements](#2-system-requirements)
3. [Getting Started — Login](#3-getting-started--login)
4. [User Roles and Access Rights](#4-user-roles-and-access-rights)
5. [Dashboard](#5-dashboard)
6. [Patient Records](#6-patient-records)
7. [Digital Dental Charts (IPTR)](#7-digital-dental-charts-iptr)
8. [Appointments](#8-appointments)
9. [RPC Tracking](#9-rpc-tracking)
10. [AI Analytics and Risk Classification](#10-ai-analytics-and-risk-classification)
11. [Follow-Up Alerts](#11-follow-up-alerts)
12. [Reports](#12-reports)
13. [Account Management (System Admin)](#13-account-management-system-admin)
14. [Audit Trail (System Admin)](#14-audit-trail-system-admin)
15. [Frequently Asked Questions](#15-frequently-asked-questions)
16. [Glossary of Terms](#16-glossary-of-terms)

---

## 1. Introduction

**FLORAL** (Dental Health Record Management System with Predictive Analytics) is a web-based application designed for the school dental clinics of Barangay Tanyag, Taguig City. It replaces manual, paper-based record keeping with a centralized digital platform that supports:

- Student dental record management
- Appointment scheduling and tracking
- Digital DOH-standard dental charting (IPTR)
- Routine Preventive Care (RPC) monitoring
- AI-assisted oral health risk classification
- DOH-compliant consolidated report generation
- Comprehensive audit trail for data privacy compliance

The system serves approximately **8,000 students** across three schools:

| School | Grades Covered |
|--------|---------------|
| Bagong Tanyag Integrated School | Kinder – Grade 10 (main clinic) |
| South Daang Hari Elementary School | Kinder – Grade 6 |
| Bagong Tanyag Elementary School Annex A | Kinder – Grade 6 |

---

## 2. System Requirements

### Supported Browsers

| Browser | Minimum Version |
|---------|----------------|
| Google Chrome | 100+ |
| Mozilla Firefox | 100+ |
| Microsoft Edge | 100+ |
| Apple Safari | 15+ |

### Device Compatibility

FLORAL is fully responsive and works on:
- **Desktop computers** (recommended for clinical workflows)
- **Tablets** (portrait and landscape)
- **Mobile phones** (limited view; recommended for quick lookups)

### Internet Connection

A stable internet connection is required. The system does not function offline.

---

## 3. Getting Started — Login

### 3.1 Accessing the System

Open your web browser and navigate to the FLORAL application URL provided by your System Administrator.

### 3.2 Logging In

1. On the **Login** page, enter your assigned **email address** in the Email field.
2. Enter your **password** in the Password field.
3. (Optional) Check **Remember me** to stay logged in on the same device.
4. Click the **Sign In** button.

Upon successful login, you will be automatically redirected to your role-specific **Dashboard**.

### 3.3 Demo Credentials (Prototype)

For testing and demonstration purposes, the following accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Dentist | dentist@floral.ph | dentist123 |
| Dental Aide | aide@floral.ph | aide123 |
| School Admin | school@floral.ph | school123 |
| Barangay Health Office | barangay@floral.ph | barangay123 |
| System Admin | admin@floral.ph | admin123 |

> **Note:** These credentials are for prototype demonstration only. In a production environment, unique secure passwords must be assigned by the System Administrator.

### 3.4 Logging Out

Click your **profile name or avatar** in the top-right corner of the navigation bar, then select **Logout** from the dropdown menu.

---

## 4. User Roles and Access Rights

FLORAL uses Role-Based Access Control (RBAC). Each user is assigned exactly one role, which determines the modules and actions available to them.

| Module | Dentist | Dental Aide | School Admin | Barangay Health | System Admin |
|--------|:-------:|:-----------:|:------------:|:---------------:|:------------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Patient Records | ✅ Full | ✅ View/Edit | ❌ | ❌ | ❌ |
| Dental Charts (IPTR) | ✅ Full | ✅ Full | ❌ | ❌ | ❌ |
| Appointments | ✅ Full | ✅ Full | ✅ View (own school) | ❌ | ❌ |
| RPC Tracking | ✅ Full | ✅ Full | ❌ | ❌ | ❌ |
| AI Analytics | ✅ Full | ❌ | ❌ | ❌ | ❌ |
| Follow-Up Alerts | ✅ Full | ✅ Full | ❌ | ❌ | ❌ |
| Reports | ✅ Full | ❌ | ✅ Own school | ✅ Aggregate | ❌ |
| Account Management | ❌ | ❌ | ❌ | ❌ | ✅ Full |
| Audit Trail | ❌ | ❌ | ❌ | ❌ | ✅ Full |

### 4.1 Role Descriptions

**Dentist**
The primary clinical user. Has full access to all clinical modules including patient records, dental charting, appointments, AI analytics, RPC tracking, follow-up alerts, and reports.

**Dental Aide**
Supports the dentist in managing patient records, dental charts, appointments, RPC tracking, and follow-up alerts. Cannot access AI Analytics.

**School Admin**
Administrative role limited to viewing appointments and reports for their own school. Cannot modify dental or clinical records.

**Barangay Health Office**
Views aggregate program coverage reports and statistics across all schools. Cannot access individual patient records (privacy protection).

**System Admin**
Manages user accounts and monitors the system audit trail. Has no access to any clinical data.

---

## 5. Dashboard

The Dashboard is the first screen shown after login. It is customized for each user role.

### 5.1 Dentist Dashboard

**KPI Cards (Top Row)**

| Card | Description |
|------|-------------|
| Total Patients | Total number of registered students with trend indicator |
| Today's Appointments | Count of appointments scheduled for today and next appointment time |
| High-Risk Patients | Number of students classified as high oral health risk |
| RPC Completion Rate | Percentage of students who have completed both RPC visits for the year |

**Charts (Middle Row)**

- **Risk Distribution Donut Chart** — Shows the proportion of High / Medium / Low risk students. Click legend items to toggle visibility.
- **Oral Health Trend Line Chart** — Tracks Decayed, Treated, and Orally Fit student counts over the past 6 months. Hover over data points to see exact values.

**Bottom Row**

- **Today's Appointments List** — Patient name, scheduled time, appointment type, and attendance status badges.
- **Quick Actions** — Shortcuts to Add Patient, New Appointment, View Analytics, and Generate Report.

### 5.2 Dental Aide Dashboard

Displays:
- Today's appointment count, pending charts, follow-ups due, and RPC pending count.
- Appointment status bar chart showing Scheduled / Completed / Missed counts.

### 5.3 School Admin Dashboard

Displays:
- School-specific statistics and screening coverage ring chart.
- Oral health status breakdown pie chart.
- Upcoming Bayanihan (mass screening) events.

### 5.4 Barangay Health Office Dashboard

Displays:
- Program coverage metrics across all three schools.
- Multi-school comparison bar chart.
- Orally Fit trend line chart.
- Age group breakdown statistics.

### 5.5 System Admin Dashboard

Displays:
- Active user count, system uptime, and security alert count.
- Login activity line chart over time.
- Recent audit activity feed.

### 5.6 Switching Schools

If you are assigned to multiple schools, a **School Banner** appears at the top of the Dashboard. Click the **Switch School** button to change the active school context. This filter applies to Patient List, Appointments, RPC Tracking, and AI Analytics.

---

## 6. Patient Records

*Accessible by: Dentist, Dental Aide*

Navigate to **Patients** in the sidebar to access the Patient Records module.

### 6.1 Patient List

The Patient List displays all registered students with the following information:
- Student name
- Grade and section
- School
- Oral health condition
- Risk level badge (High / Medium / Low)
- Last visit date

**Search and Filter**

| Control | Description |
|---------|-------------|
| Search bar | Type a student name or ID to filter results |
| School filter | Filter by school (Bagong Tanyag IS / South Daang Hari ES / Annex A) |
| Grade filter | Filter by grade level (Kinder to Grade 10) |
| Condition filter | Filter by oral health condition |
| Risk Level filter | Filter by risk classification (High / Medium / Low) |

### 6.2 Adding a New Patient

1. Click the **+ Add Patient** button (top-right of the Patient List).
2. Fill in the required fields:
   - **Personal Information:** Full name, date of birth, sex, grade, section, school
   - **Contact Details:** Guardian name, contact number, address
   - **PhilHealth Number** (if available) and **PhilHealth Status**
   - **4Ps Beneficiary** — Check if applicable and enter 4Ps ID
   - **Consent Status** — Indicate if parental consent has been obtained
3. Click **Save** to add the student.

### 6.3 Bulk CSV Upload

To add multiple students at once:

1. Click the **Bulk Upload** button.
2. **Step 1 — Upload:** Select a CSV file formatted with the required columns (name, grade, section, school, date of birth, sex).
3. **Step 2 — Preview:** Review the parsed data table. Correct any errors before proceeding.
4. **Step 3 — Done:** Confirm the upload. Successfully added students will appear in the Patient List.

### 6.4 Patient Profile

Click on any student row in the Patient List to open their **Patient Profile**. The profile has three tabs:

#### Tab 1 — Medical History

Displays 12 systemic health condition fields, organized by school year. Conditions tracked include allergies, asthma, heart conditions, diabetes, bleeding disorders, and others per the DOH IPTR form.

- Click **Edit** to update medical history for the current school year.
- Each field is recorded per school year for longitudinal tracking.

#### Tab 2 — Treatment History

A chronological table of all past clinical visits, showing:
- Date of visit
- Chief complaint
- Diagnosis
- Treatment rendered
- Attending dentist
- Remarks

On mobile, records are displayed as cards instead of a table.

#### Tab 3 — Dental Records

Displays DMFT (Decayed, Missing, Filled, Extracted, Total) scores per school year in a color-coded table:

| Column | Color Code |
|--------|-----------|
| D (Decayed) | Red |
| M (Missing) | Orange |
| F (Filled) | Blue |
| X (Extracted) | Gray |
| T (Total) | Purple |

- Each year row includes an **Oral Status Badge** (Orally Fit / Needs Treatment / etc.)
- KPI cards show the latest DMFT summary.
- Click **Open IPTR** to open the full digital dental chart for that year.

---

## 7. Digital Dental Charts (IPTR)

*Accessible by: Dentist, Dental Aide*

Navigate to **Dental Charts** in the sidebar, or click **Open IPTR** from a patient profile.

The IPTR (Individual Patient Treatment Record) is the DOH-standard digital dental chart. It has three tabs.

### 7.1 Tab 1 — Medical & Social History

Records the following information per school year:

**Medical History (12 fields)**
Systemic conditions such as allergies, cardiac conditions, diabetes, blood disorders, and others.

**Dietary and Social History (7 fields)**
| Field | Options |
|-------|---------|
| Sugar intake frequency | Never / Rarely / Sometimes / Often / Always |
| Tobacco use | Yes / No |
| Betel nut use | Yes / No |
| Thumbsucking habit | Yes / No |
| Bottle feeding at night | Yes / No |
| Fluoride toothpaste use | Yes / No |
| Frequency of tooth brushing | Once a day / Twice a day / After every meal / etc. |

**Oral Health Condition (10 fields)**
Gingivitis, calculus, oral debris, malocclusion, and other oral health indicators.

### 7.2 Tab 2 — Dental Charting

The dental chart is the core of the IPTR. It displays the full FDI odontogram for both permanent and primary dentition.

#### How to Record a Dental Condition

1. **Select the dental condition code** from the legend panel on the right or bottom:

   | Code | Condition | Description |
   |------|-----------|-------------|
   | ✓ | Sound / Sealed | Healthy tooth or sealed |
   | D / d | Decayed | Permanent / primary tooth with caries |
   | M / m | Missing | Permanent / primary tooth extracted due to caries |
   | F / f | Filled | Permanent / primary tooth with a restoration |
   | X / x | DX Extracted | Tooth extracted for other reasons |
   | Im | Impacted | Impacted tooth |
   | Sp | Supernumerary | Extra tooth |
   | Rf | Root Fragment | Root fragment remaining |

2. **Click on the tooth** in the odontogram diagram. The selected condition code will be applied. The tooth will display the code and be color-coded accordingly.
3. To change a condition, select a new code and click the tooth again.
4. The **DMFT Score** (d, m, f, x, t for primary; D, M, F, X, T for permanent) is automatically calculated and displayed in the 5-value DMFT box at the top.

#### Multi-Year Records

- Use the **year tabs** at the top of the chart to switch between school years.
- Click **+ Add Year** to start a new school year record.
- The **DMFT Progression Table** at the bottom shows year-by-year DMFT changes.

#### Navigation

- Use the **← Previous** and **Next →** buttons in the chart header to move to adjacent patients.
- The position indicator (e.g., "3 / 10") shows your current place in the patient list.

### 7.3 Tab 3 — Consent & Appointments

**Consent Form**
- Displays the Filipino-language parental consent text and RA 10173 Data Privacy Act notice.
- Check the consent checkboxes to record that consent has been obtained and read to the parent/guardian.

**Appointments**
- Lists all appointments scheduled for this student.
- Shows appointment date, type, and status.

---

## 8. Appointments

*Accessible by: Dentist (full), Dental Aide (full), School Admin (view only)*

Navigate to **Appointments** in the sidebar.

### 8.1 Appointment Tabs

| Tab | Description |
|-----|-------------|
| Today | Appointments scheduled for today |
| Upcoming | Future scheduled appointments |
| Past | Historical appointment records |
| Calendar | Visual calendar view of all appointments |
| Rotation | Dentist rotation schedule across schools |

### 8.2 Viewing Appointments

Each appointment card displays:
- Student name and grade
- Scheduled date and time
- Appointment type (e.g., Oral Screening, Tooth Extraction, Fluoride Treatment)
- Status badge: **Scheduled**, **Attended**, or **Missed**
- A **📄 View Chart** link to open the student's dental chart

### 8.3 Marking Attendance

In the **Today** or **Past** tabs:
- Click the **✓ (check mark)** button on an appointment card to mark it as **Attended**.
- Click the **✗ (X)** button to mark it as **Missed**.
- To undo either action, click the **Reset** button on the same card.

### 8.4 Calendar View

The **Calendar** tab displays a monthly calendar with appointment counts per day.
- Click on a date to see the list of appointments for that day.
- Use the **< >** arrows to navigate between months.

### 8.5 Dentist Rotation Schedule

The **Rotation** tab shows which school the dentist is scheduled to visit on each day.

- Click **Set Rotation** to open the rotation schedule modal.
- Configure the visiting schedule for each school.
- Each school's card in the Rotation tab shows the next scheduled visit date.

---

## 9. RPC Tracking

*Accessible by: Dentist, Dental Aide*

Navigate to **RPC** in the sidebar.

### 9.1 Overview

RPC Tracking monitors compliance with the DOH-mandated **Routine Preventive Care** program, which requires each student to receive **two preventive care visits per school year**.

### 9.2 Services Tracked

| Service | Description |
|---------|-------------|
| Oral Screening | Visual examination of the oral cavity |
| Caries Risk Assessment | Assessment of cavity risk factors |
| Dental Hygiene Instruction | Brushing and oral hygiene education |
| Oral Prophylaxis | Professional tooth cleaning |
| Fluoride Varnish | Application of fluoride varnish |
| Pit and Fissure Sealant | Sealant application on back teeth |
| Silver Diamine Fluoride (SDF) | SDF treatment for caries arrest |

### 9.3 Using RPC Tracking

1. Use the **School** and **Grade** filters to narrow the list.
2. Each row shows a student's name, grade, school, and completion status for Visit 1 and Visit 2.
3. Status indicators:
   - 🟢 **Complete** — Both visits completed
   - 🟡 **Partial** — One visit completed
   - 🔴 **Pending** — No visits completed

---

## 10. AI Analytics and Risk Classification

*Accessible by: Dentist only*

Navigate to **AI Analytics** in the sidebar.

### 10.1 Overview

The AI Analytics module uses a rule-based scoring algorithm to classify each student's oral health risk level. This is a **clinical decision-support tool** — it assists but does not replace the professional judgment of the dentist.

### 10.2 Risk Scoring Algorithm

The system evaluates 15+ factors to compute a risk score:

| Factor | Score Added |
|--------|:-----------:|
| DMFT score ≥ 4 | +3 |
| D (Decayed teeth) ≥ 3 | +3 |
| DMFT increased vs. prior year | +3 |
| DX (extracted) teeth present | +3 |
| No clinic visits / last visit > 12 months | +2 |
| Recurring gingivitis | +2 |
| Recurring debris/plaque | +2 |
| High sugar intake frequency | +2 |
| Tobacco use | +2 |
| Betel nut use | +2 |
| Diabetes present | +2 |
| No preventive treatment received | +2 |
| 4Ps beneficiary | +1 |
| Thumbsucking habit | +1 |

**Risk Classification Thresholds:**

| Risk Level | Score Range | Badge Color |
|------------|:-----------:|:-----------:|
| 🔴 High | ≥ 6 | Red |
| 🟡 Medium | 3 – 5 | Yellow |
| 🟢 Low | < 3 | Green |

### 10.3 Risk Assessment Sub-Tab

Displays a ranked list of all students, sorted by risk score (highest first).

- Each row shows: student name, grade, school, risk score, and risk badge.
- Click **Validate** on a row to review the student's risk factors and confirm or override the AI classification.
- Click **Update Risk Scores** to re-run the algorithm on all students using the latest data.

### 10.4 Treatment Pending Sub-Tab

Displays students requiring treatment, grouped by **Grade → Section**.

Each entry shows:
- Predicted oral health issue
- Recommended clinical action
- Risk factor badges (e.g., "High DMFT", "Tobacco Use", "No Preventive Tx")

> **Important:** Treatment recommendations are decision-support suggestions only. The attending dentist must review and confirm all treatment plans before action is taken.

---

## 11. Follow-Up Alerts

*Accessible by: Dentist, Dental Aide*

Navigate to **Follow-Up** in the sidebar.

### 11.1 Overview

The Follow-Up Alerts module identifies students who need follow-up attention in two categories:

- **Overdue Fluoride Treatments** — Students whose scheduled fluoride treatment is overdue.
- **Missed Appointments** — Students who did not attend a scheduled appointment.

### 11.2 Sending Notifications

> **Note:** SMS notification functionality is implemented in the user interface. Actual SMS delivery requires backend SMS service integration, which is pending in the current prototype.

**To notify individual students:**
1. Locate the student's card in the Follow-Up list.
2. Click the **📱 Send SMS** button to trigger a notification to the student's registered guardian contact number.

**To notify multiple students at once:**
1. Select students by checking the checkboxes on each card.
2. Click the **Bulk SMS** button at the top of the list.
3. Confirm the send action in the dialog box.

---

## 12. Reports

*Accessible by: Dentist (full), School Admin (own school), Barangay Health Office (aggregate)*

Navigate to **Reports** in the sidebar.

### 12.1 DOH Consolidated Report

This report follows the exact official DOH format with age brackets per grade level:

| Grade | Age Brackets |
|-------|-------------|
| Kinder | 4 and below / 5–9 |
| Grade 1 | 4 and below / 5–9 / 10–14 / 15–19 |
| Grades 2–6 | 5–9 / 10–14 / 15–19 / 20+ |
| Grades 7–10 | 10–14 / 15–19 / 20+ |

**How to Read the DOH Report:**
- Each row represents a grade level.
- Columns cover dental statistics per age bracket (e.g., screened, decayed, filled, extracted, orally fit).
- Summary columns at the end aggregate across all age brackets.
- Empty cells represent zero values (no "0" displayed, per DOH format).
- **Sticky grade labels** keep grade names visible while scrolling horizontally through the wide table.
- Hover over any row to highlight it in yellow for easier reading.

### 12.2 Internal Reports

**Monthly Procedure Volume Chart**
A bar chart (Recharts) showing the count of each procedure type performed per month.

**Consent Compliance**
Progress bars per school showing:
- Complete — Consent form signed and on file
- Pending — Consent form given but not yet returned
- Missing — No consent form issued

**Quick Statistics Grid**
At-a-glance numbers: total screened, total treated, total orally fit, referrals made.

**Referral Tracking Table**
List of students referred to other facilities, with referral date, reason, and status.

### 12.3 Exporting Reports

| Export Format | Button | Description |
|--------------|--------|-------------|
| PDF | **Export PDF** | Downloads the report as a printable PDF file |
| Excel | **Export Excel** | Downloads the report as an Excel spreadsheet |

---

## 13. Account Management (System Admin)

*Accessible by: System Admin only*

Navigate to **Accounts** in the sidebar.

### 13.1 Viewing User Accounts

The accounts table lists all registered users with:
- Full name
- Email address
- Assigned role
- Account status (Active / Inactive)
- Assigned school

### 13.2 Creating a New Account

1. Click the **+ New Account** button.
2. Fill in the required fields:
   - Full name
   - Email address
   - Role (Dentist / Dental Aide / School Admin / Barangay Health / System Admin)
   - Assigned school (if applicable)
   - Temporary password
3. Click **Create Account**. An account activation link will be sent to the provided email (requires email service integration).

### 13.3 Deactivating or Reactivating Accounts

- To **deactivate** a user: Locate the user row and click **Deactivate**. Deactivated users cannot log in.
- To **reactivate** a user: Locate the deactivated user row and click **Reactivate**.

> **Best Practice:** Deactivate accounts rather than deleting them to preserve audit history.

---

## 14. Audit Trail (System Admin)

*Accessible by: System Admin only*

Navigate to **Audit** in the sidebar.

### 14.1 Overview

The Audit Trail is a chronological log of all user actions in the system. It supports compliance with **RA 10173 (Data Privacy Act of 2012)** by providing full traceability of who accessed or modified patient data.

### 14.2 Reading the Audit Log

Each log entry contains:
- **Timestamp** — Date and time of the action (Philippine Standard Time)
- **User** — Name and role of the user who performed the action
- **Module** — System module where the action occurred (e.g., Patient Records, Appointments)
- **Action** — Type of action (Add, Edit, Delete, View, Login, Logout)
- **Details** — Brief description of what was changed or accessed

### 14.3 Filtering the Audit Log

| Filter | Description |
|--------|-------------|
| User | Filter by specific user account |
| Date Range | Filter entries between a start and end date |
| Module | Filter by system module |
| Action Type | Filter by action type (Add / Edit / Delete / View / Login) |

---

## 15. Frequently Asked Questions

**Q: I cannot log in. What should I do?**  
A: Verify that you are entering the correct email and password. Passwords are case-sensitive. If the problem persists, contact your System Administrator to check your account status.

**Q: Can I access the system on my phone?**  
A: Yes. FLORAL is mobile-responsive and can be accessed on smartphones and tablets. For full functionality, a desktop or laptop computer is recommended.

**Q: How do I add a dental record for a new school year?**  
A: Open the student's IPTR (dental chart), go to **Tab 2 — Dental Charting**, and click the **+ Add Year** button to create a new school year entry.

**Q: Why do some appointment buttons not send SMS messages?**  
A: SMS notification delivery requires a backend SMS service, which is not yet active in the current prototype. The buttons are functional in the user interface but will not send actual messages until the SMS service is connected.

**Q: Who can see individual patient dental records?**  
A: Only the **Dentist** and **Dental Aide** roles can access individual patient records. School Admins see only appointment summaries, and Barangay Health Officers see only aggregate statistics — never individual patient data.

**Q: How does the AI risk classification work?**  
A: The AI Analytics module evaluates 15+ clinical and behavioral risk factors (e.g., DMFT score, sugar intake, tobacco use) and assigns a total score. Scores of 6 or above = High Risk, 3–5 = Medium Risk, below 3 = Low Risk. Click **Update Risk Scores** to refresh classifications with the latest data.

**Q: Can the dentist override the AI risk classification?**  
A: Yes. In the **AI Analytics → Risk Assessment** tab, click **Validate** on any student row to review the AI's reasoning and confirm or modify the classification using clinical judgment.

**Q: How do I generate a DOH report?**  
A: Navigate to **Reports**, select the desired school and time period, and click **Export PDF** or **Export Excel** to download the DOH consolidated report.

**Q: Can patient records be permanently deleted?**  
A: No. Patient records cannot be permanently deleted through the user interface, in line with RA 10173 data retention requirements. To remove a user account, System Admins can deactivate it.

**Q: What is RPC and why is it tracked?**  
A: RPC stands for Routine Preventive Care — the DOH-mandated preventive dental program requiring each student to receive two preventive care visits per school year. FLORAL tracks completion of these visits to ensure program compliance.

---

## 16. Glossary of Terms

| Term | Definition |
|------|-----------|
| **IPTR** | Individual Patient Treatment Record — the standard DOH dental record form used to document a student's dental history, treatment, and charting |
| **DMFT** | Decayed, Missing, Filled, Extracted (Total) — a standard index for measuring dental caries experience |
| **d/m/f/x/t** | DMFT scores for primary (baby) teeth |
| **D/M/F/X/T** | DMFT scores for permanent teeth |
| **FDI** | Fédération Dentaire Internationale — the international two-digit tooth numbering system used in the IPTR odontogram |
| **Odontogram** | A schematic diagram of the teeth used to record the condition of each tooth |
| **RPC** | Routine Preventive Care — the DOH-mandated two-visit preventive dental program per student per year |
| **Orally Fit** | A student who has no caries (decayed teeth) and no urgent dental treatment needs |
| **4Ps** | Pantawid Pamilyang Pilipino Program — a government conditional cash transfer program. 4Ps beneficiary status is a risk factor in the AI classification |
| **DOH** | Department of Health (Philippines) |
| **RBAC** | Role-Based Access Control — a security model that restricts system access based on user roles |
| **RA 10173** | Republic Act 10173 — the Data Privacy Act of 2012; Philippine law governing the collection, storage, and processing of personal data |
| **AI Analytics** | The FLORAL module that uses a risk-scoring algorithm to classify students' oral health risk levels |
| **Bayanihan** | Mass dental screening events organized for community-wide student coverage |
| **SDF** | Silver Diamine Fluoride — a preventive dental treatment used to arrest caries |
| **Fluoride Varnish** | A preventive treatment applied to teeth to strengthen enamel and prevent cavities |
| **Pit and Fissure Sealant** | A dental material applied to the biting surfaces of back teeth to prevent caries |
| **Oral Prophylaxis** | Professional dental cleaning to remove plaque and calculus |
| **Caries** | Dental cavities (tooth decay) |
| **DMFT Index** | A numerical score reflecting the total extent of dental caries in a patient |
| **PhilHealth** | Philippine Health Insurance Corporation — the national health insurance program |

---

*User Manual prepared by Group 404 — BSIT, José Rizal University*  
*2nd Semester, SY 2025–2026*  
*FLORAL: Dental Health Record Management System with Predictive Analytics*  
*Barangay Tanyag School Dental Clinics, Taguig City*
