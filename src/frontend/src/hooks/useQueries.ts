import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Appointment,
  Hospital,
  MedicalHistory,
  Medicine,
  MedicineReminder,
  Message,
  Notification,
  Prescription,
  SymptomCheckerInput,
  SymptomCheckerResult,
  SymptomQuery,
  SystemStats,
  UserProfile,
  UserRole__1,
} from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ---- User Profile ----
export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Not connected");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useGetUserProfile(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// ---- Appointments ----
export function useAppointments(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Appointment[]>({
    queryKey: ["appointments", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getAppointmentsForUser(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

export function useCreateAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      doctorId,
      date,
      timeSlot,
      reason,
    }: {
      doctorId: Principal;
      date: string;
      timeSlot: string;
      reason: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createAppointment(doctorId, date, timeSlot, reason);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useConfirmAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.confirmAppointment(appointmentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCancelAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (appointmentId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelAppointment(appointmentId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

export function useCompleteAppointment() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      appointmentId,
      doctorNotes,
    }: {
      appointmentId: string;
      doctorNotes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.completeAppointment(appointmentId, doctorNotes);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
}

// ---- Messages ----
export function useConversation(otherUser: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Message[]>({
    queryKey: ["conversation", otherUser?.toString()],
    queryFn: async () => {
      if (!actor || !otherUser) return [];
      return actor.getConversation(otherUser);
    },
    enabled: !!actor && !isFetching && !!otherUser,
    refetchInterval: 5000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ to, content }: { to: Principal; content: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.sendMessage(to, content);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["conversation", variables.to.toString()],
      });
    },
  });
}

// ---- Prescriptions ----
export function usePrescriptions(patientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Prescription[]>({
    queryKey: ["prescriptions", patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getPrescriptionsForPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useCreatePrescription() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      patientId,
      blobId,
      notes,
      dateIssued,
      medicineList,
    }: {
      patientId: Principal;
      blobId: string;
      notes: string;
      dateIssued: string;
      medicineList: Medicine[];
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createPrescription(
        patientId,
        blobId,
        notes,
        dateIssued,
        medicineList,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prescriptions"] }),
  });
}

// ---- Medical History ----
export function useMedicalHistory(patientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MedicalHistory[]>({
    queryKey: ["medicalHistory", patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getMedicalHistoryForPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddMedicalHistory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      date,
      category,
      blobId,
    }: {
      title: string;
      description: string;
      date: string;
      category: string;
      blobId: string | null;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMedicalHistoryEntry(
        title,
        description,
        date,
        category,
        blobId,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["medicalHistory"] }),
  });
}

// ---- Medicine Reminders ----
export function useReminders(patientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<MedicineReminder[]>({
    queryKey: ["reminders", patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getRemindersForPatient(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

export function useAddReminder() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      medicineName,
      dosage,
      frequency,
      startDate,
      endDate,
    }: {
      medicineName: string;
      dosage: string;
      frequency: string;
      startDate: string;
      endDate: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.addMedicineReminder(
        medicineName,
        dosage,
        frequency,
        startDate,
        endDate,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

export function useUpdateReminderStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      reminderId,
      active,
    }: {
      reminderId: string;
      active: boolean;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateReminderActiveStatus(reminderId, active);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["reminders"] }),
  });
}

// ---- Symptom Checker ----
export function useCheckSymptoms() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (
      input: SymptomCheckerInput,
    ): Promise<SymptomCheckerResult> => {
      if (!actor) throw new Error("Not connected");
      return actor.checkSymptoms(input);
    },
  });
}

export function useSymptomQueryLog(patientId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<SymptomQuery[]>({
    queryKey: ["symptomLog", patientId?.toString()],
    queryFn: async () => {
      if (!actor || !patientId) return [];
      return actor.getSymptomQueryLog(patientId);
    },
    enabled: !!actor && !isFetching && !!patientId,
  });
}

// ---- Notifications ----
export function useNotifications(userId: Principal | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications", userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getNotificationsForUser(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error("Not connected");
      return actor.markNotificationRead(notificationId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useCreateNotification() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      title,
      body,
      notifType,
    }: {
      userId: Principal;
      title: string;
      body: string;
      notifType: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createNotification(userId, title, body, notifType);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ---- Hospitals ----
export function useHospitalsByCity(city: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Hospital[]>({
    queryKey: ["hospitals", city],
    queryFn: async () => {
      if (!actor || !city.trim()) return [];
      return actor.getHospitalsByCity(city.toLowerCase().trim());
    },
    enabled: !!actor && !isFetching && !!city.trim(),
  });
}

// ---- Admin ----
export function useSystemStats() {
  const { actor, isFetching } = useActor();
  return useQuery<SystemStats | null>({
    queryKey: ["systemStats"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSystemStats();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveDoctor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doctorId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveDoctor(doctorId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

export function useRejectDoctor() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (doctorId: Principal) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectDoctor(doctorId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["callerProfile"] }),
  });
}

export function useAssignUserRole() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      user,
      role,
    }: {
      user: Principal;
      role: UserRole__1;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => qc.invalidateQueries(),
  });
}

// Re-export useInternetIdentity for convenience
export { useInternetIdentity };
