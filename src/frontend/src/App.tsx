import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useCallerProfile } from "@/hooks/useQueries";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { UserRole } from "./backend.d";

import { AdminLayout } from "@/components/layout/AdminLayout";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
// Layouts
import { PatientLayout } from "@/components/layout/PatientLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/RegisterPage";

import AppointmentsPage from "@/pages/patient/AppointmentsPage";
import BookAppointmentPage from "@/pages/patient/BookAppointmentPage";
import ChatListPage from "@/pages/patient/ChatListPage";
import ChatPage from "@/pages/patient/ChatPage";
import DoctorsPage from "@/pages/patient/DoctorsPage";
import EmergencyPage from "@/pages/patient/EmergencyPage";
import MedicalHistoryPage from "@/pages/patient/MedicalHistoryPage";
import NotificationsPage from "@/pages/patient/NotificationsPage";
// Patient pages
import PatientDashboard from "@/pages/patient/PatientDashboard";
import PatientSettings from "@/pages/patient/PatientSettings";
import PrescriptionsPage from "@/pages/patient/PrescriptionsPage";
import RemindersPage from "@/pages/patient/RemindersPage";
import SymptomChecker from "@/pages/patient/SymptomChecker";

import DoctorAppointmentsPage from "@/pages/doctor/DoctorAppointmentsPage";
import DoctorChatListPage from "@/pages/doctor/DoctorChatListPage";
import DoctorChatPage from "@/pages/doctor/DoctorChatPage";
// Doctor pages
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import DoctorPatientsPage from "@/pages/doctor/DoctorPatientsPage";
import DoctorPrescriptionsPage from "@/pages/doctor/DoctorPrescriptionsPage";
import DoctorProfilePage from "@/pages/doctor/DoctorProfilePage";

// Admin pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminDoctorsPage from "@/pages/admin/AdminDoctorsPage";
import AdminNotificationsPage from "@/pages/admin/AdminNotificationsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";

// Auth redirect component
function AuthRedirect() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: profile, isLoading } = useCallerProfile();

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/assets/generated/medi-nibunar-logo-transparent.dim_200x200.png"
            alt="Medi-Nibunar"
            className="h-16 w-16 rounded-2xl animate-pulse"
          />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <LandingPage />;
  }

  if (!profile) {
    return <Navigate to="/register" />;
  }

  if (profile.role === UserRole.patient) {
    return <Navigate to="/patient/dashboard" />;
  }
  if (profile.role === UserRole.doctor) {
    return <Navigate to="/doctor/dashboard" />;
  }
  if (profile.role === UserRole.admin) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <Navigate to="/register" />;
}

// Root
const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-center" />
    </>
  ),
});

// Index
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: AuthRedirect,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

// Patient Routes
function PatientRoot() {
  return (
    <PatientLayout>
      <Outlet />
    </PatientLayout>
  );
}

const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient",
  component: PatientRoot,
});

const patientDashboardRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/dashboard",
  component: PatientDashboard,
});

const patientSymptomRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/symptom-checker",
  component: SymptomChecker,
});

const patientDoctorsRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/doctors",
  component: DoctorsPage,
});

const patientBookRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/book/$doctorId",
  component: BookAppointmentPage,
});

const patientAppointmentsRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/appointments",
  component: AppointmentsPage,
});

const patientChatListRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/chat",
  component: ChatListPage,
});

const patientChatRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/chat/$doctorId",
  component: ChatPage,
});

const patientPrescriptionsRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/prescriptions",
  component: PrescriptionsPage,
});

const patientMedicalHistoryRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/medical-history",
  component: MedicalHistoryPage,
});

const patientRemindersRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/reminders",
  component: RemindersPage,
});

const patientEmergencyRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/emergency",
  component: EmergencyPage,
});

const patientNotificationsRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const patientSettingsRoute = createRoute({
  getParentRoute: () => patientRoute,
  path: "/settings",
  component: PatientSettings,
});

// Doctor Routes
function DoctorRoot() {
  return (
    <DoctorLayout>
      <Outlet />
    </DoctorLayout>
  );
}

const doctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/doctor",
  component: DoctorRoot,
});

const doctorDashboardRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/dashboard",
  component: DoctorDashboard,
});

const doctorAppointmentsRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/appointments",
  component: DoctorAppointmentsPage,
});

const doctorPatientsRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/patients",
  component: DoctorPatientsPage,
});

const doctorChatListRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/chat",
  component: DoctorChatListPage,
});

const doctorChatRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/chat/$patientId",
  component: DoctorChatPage,
});

const doctorPrescriptionsRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/prescriptions",
  component: DoctorPrescriptionsPage,
});

const doctorProfileRoute = createRoute({
  getParentRoute: () => doctorRoute,
  path: "/profile",
  component: DoctorProfilePage,
});

// Admin Routes
function AdminRoot() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminRoot,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/dashboard",
  component: AdminDashboard,
});

const adminDoctorsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/doctors",
  component: AdminDoctorsPage,
});

const adminUsersRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/users",
  component: AdminUsersPage,
});

const adminNotificationsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: "/notifications",
  component: AdminNotificationsPage,
});

// Build route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  registerRoute,
  patientRoute.addChildren([
    patientDashboardRoute,
    patientSymptomRoute,
    patientDoctorsRoute,
    patientBookRoute,
    patientAppointmentsRoute,
    patientChatListRoute,
    patientChatRoute,
    patientPrescriptionsRoute,
    patientMedicalHistoryRoute,
    patientRemindersRoute,
    patientEmergencyRoute,
    patientNotificationsRoute,
    patientSettingsRoute,
  ]),
  doctorRoute.addChildren([
    doctorDashboardRoute,
    doctorAppointmentsRoute,
    doctorPatientsRoute,
    doctorChatListRoute,
    doctorChatRoute,
    doctorPrescriptionsRoute,
    doctorProfileRoute,
  ]),
  adminRoute.addChildren([
    adminDashboardRoute,
    adminDoctorsRoute,
    adminUsersRoute,
    adminNotificationsRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
