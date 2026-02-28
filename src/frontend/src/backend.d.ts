import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SymptomCheckerResult {
    relatedConditions: Array<string>;
    recommendedAction: string;
    disclaimer: string;
    severityHint: string;
}
export interface SystemStats {
    totalPatients: bigint;
    totalPrescriptions: bigint;
    totalDoctors: bigint;
    totalUsers: bigint;
    totalAppointments: bigint;
}
export interface SymptomQuery {
    result: SymptomCheckerResult;
    patientId: Principal;
    timestamp: bigint;
    input: SymptomCheckerInput;
}
export interface MedicalHistory {
    id: string;
    title: string;
    patientId: Principal;
    date: string;
    description: string;
    blobId?: string;
    category: string;
}
export interface Notification {
    id: string;
    title: string;
    notifType: string;
    body: string;
    userId: Principal;
    isRead: boolean;
    timestamp: bigint;
}
export interface Hospital {
    id: string;
    city: string;
    name: string;
    address: string;
    hospitalType: string;
    phone: string;
}
export interface Message {
    id: string;
    to: Principal;
    content: string;
    from: Principal;
    isRead: boolean;
    timestamp: bigint;
}
export interface MedicineReminder {
    id: string;
    active: boolean;
    endDate: string;
    dosage: string;
    patientId: Principal;
    frequency: string;
    startDate: string;
    medicineName: string;
}
export interface Medicine {
    dosage: string;
    frequency: string;
    medicineName: string;
}
export interface SymptomCheckerInput {
    age?: bigint;
    gender?: string;
    symptoms: Array<string>;
}
export interface Prescription {
    id: string;
    doctorId: Principal;
    dateIssued: string;
    patientId: Principal;
    notes: string;
    blobId: string;
    medicineList: Array<Medicine>;
}
export interface Appointment {
    id: string;
    doctorNotes: string;
    status: AppointmentStatus;
    doctorId: Principal;
    patientId: Principal;
    date: string;
    timeSlot: string;
    reason: string;
}
export interface UserProfile {
    id: Principal;
    bio: string;
    languagePreference: string;
    name: string;
    role: UserRole;
    largeTextMode: boolean;
    specialty?: string;
    consentDataSharing: boolean;
    rating: number;
    reviewCount: bigint;
    verificationStatus: VerificationStatus;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum UserRole {
    patient = "patient",
    admin = "admin",
    doctor = "doctor"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VerificationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export interface backendInterface {
    addMedicalHistoryEntry(title: string, description: string, date: string, category: string, blobId: string | null): Promise<string>;
    addMedicineReminder(medicineName: string, dosage: string, frequency: string, startDate: string, endDate: string): Promise<string>;
    approveDoctor(doctorId: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    cancelAppointment(appointmentId: string): Promise<void>;
    checkSymptoms(input: SymptomCheckerInput): Promise<SymptomCheckerResult>;
    completeAppointment(appointmentId: string, doctorNotes: string): Promise<void>;
    confirmAppointment(appointmentId: string): Promise<void>;
    createAppointment(doctorId: Principal, date: string, timeSlot: string, reason: string): Promise<string>;
    createNotification(userId: Principal, title: string, body: string, notifType: string): Promise<string>;
    createPrescription(patientId: Principal, blobId: string, notes: string, dateIssued: string, medicineList: Array<Medicine>): Promise<string>;
    getAppointmentsForUser(userId: Principal): Promise<Array<Appointment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getConversation(otherUser: Principal): Promise<Array<Message>>;
    getHospitalsByCity(city: string): Promise<Array<Hospital>>;
    getMedicalHistoryForPatient(patientId: Principal): Promise<Array<MedicalHistory>>;
    getNotificationsForUser(userId: Principal): Promise<Array<Notification>>;
    getPrescriptionsForPatient(patientId: Principal): Promise<Array<Prescription>>;
    getRemindersForPatient(patientId: Principal): Promise<Array<MedicineReminder>>;
    getSymptomQueryLog(patientId: Principal): Promise<Array<SymptomQuery>>;
    getSystemStats(): Promise<SystemStats>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    markMessageRead(messageId: string): Promise<void>;
    markNotificationRead(notificationId: string): Promise<void>;
    rejectDoctor(doctorId: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    sendMessage(to: Principal, content: string): Promise<string>;
    updateReminderActiveStatus(reminderId: string, active: boolean): Promise<void>;
}
