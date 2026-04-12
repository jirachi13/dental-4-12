import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Login } from "./components/Login";
import { Dashboard } from "./components/Dashboard";
import { PatientList } from "./components/PatientList";
import { PatientProfile } from "./components/PatientProfile";
import { DentalChart } from "./components/DentalChart";
import { DentalChartNav } from "./components/DentalChartNav";
import { TreatmentLog } from "./components/TreatmentLog";
import { TreatmentRecords } from "./components/TreatmentRecords";
import { Appointments } from "./components/Appointments";
import { RPCTracking } from "./components/RPCTracking";
import { AIAnalytics } from "./components/AIAnalytics";
import { FollowUpAlerts } from "./components/FollowUpAlerts";
import { Reports } from "./components/Reports";
import { AccountManagement } from "./components/AccountManagement";
import { AuditTrail } from "./components/AuditTrail";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "patients", Component: PatientList },
      { path: "patients/:id", Component: PatientProfile },
      { path: "dental-charts", Component: DentalChartNav },
      { path: "dental-chart/:id", Component: DentalChart },
      { path: "treatment-records", Component: TreatmentRecords },
      { path: "treatment-log/:id", Component: TreatmentLog },
      { path: "appointments", Component: Appointments },
      { path: "rpc", Component: RPCTracking },
      { path: "ai-analytics", Component: AIAnalytics },
      { path: "follow-up", Component: FollowUpAlerts },
      { path: "reports", Component: Reports },
      { path: "accounts", Component: AccountManagement },
      { path: "audit", Component: AuditTrail },
    ],
  },
]);