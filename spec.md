# Medi-Nibunar Telemedicine Platform

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full telemedicine web application with three role-based portals: Patient, Doctor, Admin
- Secure authentication via Internet Identity with role assignment on registration
- AI-powered symptom checker with clear medical disclaimers and explainable guidance (no diagnosis)
- Doctor discovery with search, filter by specialty, and profile viewing
- Smart appointment booking system with date/time slot selection
- Doctor-patient secure chat messaging
- Digital prescription management (upload, view, download)
- Medicine reminders with dosage tracking
- Medical history storage (encrypted, consent-based)
- Emergency quick-access panel with static nearby hospital info
- Notification center for appointments, reminders, follow-ups
- Accessibility toggle: large text mode, voice input hint
- Multilingual UI structure (English default, labels ready for i18n)
- Admin dashboard: doctor verification, user management, system stats monitoring

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
1. User profile management: store role (patient/doctor/admin), name, language preference, accessibility settings
2. Doctor profiles: specialty, verification status, available time slots, ratings
3. Appointment management: create, cancel, update appointments; status tracking
4. Chat messaging: per-conversation message store between doctor and patient
5. Prescription records: metadata + blob reference for uploaded prescriptions
6. Medical history entries: encrypted text records per patient
7. Medicine reminders: name, dosage, frequency, next-reminder timestamp
8. Symptom checker log: store symptom inputs and AI-generated guidance responses
9. Notifications store: per-user notification queue
10. Admin operations: verify/reject doctor, list all users, system stats counters
11. Emergency contacts: static list of hospitals queryable by region

### Frontend (React + TypeScript)
1. Landing page with app intro, login/register CTA, multilingual tagline
2. Auth flow: register with role selection (patient/doctor/admin), Internet Identity login
3. Patient portal:
   - Dashboard with upcoming appointments, reminders, quick actions
   - Symptom checker with step-by-step questions, disclaimer modal, result with guidance
   - Doctor discovery: search, filter, profile cards
   - Appointment booking: pick doctor, date, time slot, confirm
   - Chat interface with doctor
   - Prescriptions: view list, upload new, download
   - Medical history: view and add entries
   - Medicine reminders: add/edit/delete reminders with dosage
   - Emergency panel: SOS button, hospital list
   - Notifications panel
   - Settings: language selector, large text toggle, profile edit
4. Doctor portal:
   - Dashboard with today's appointments, pending consultations
   - Patient list with medical history access (consent-gated)
   - Chat with patients
   - Prescription writing and upload
   - Availability management (set time slots)
   - Notifications
5. Admin portal:
   - System overview stats (users, appointments, consultations)
   - Doctor verification queue: approve/reject with notes
   - User management list
   - Notification broadcasts
6. Shared components: navbar, role guard, notification bell, accessibility toolbar, medical disclaimer banner
