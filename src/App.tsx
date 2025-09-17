import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

// Doctor Dashboard Pages
import DoctorDashboard from "./pages/doctor/Dashboard";
import CreatePrescription from "./pages/doctor/CreatePrescription";
import MyPrescriptions from "./pages/doctor/MyPrescriptions";
import BlockchainVerification from "./pages/doctor/BlockchainVerification";
import DoctorActivityLogs from "./pages/doctor/ActivityLogs";

// Patient Dashboard Pages
import PatientDashboard from "./pages/patient/Dashboard";
import PatientPrescriptions from "./pages/patient/MyPrescriptions";
import QRCodeViewer from "./pages/patient/QRCodeViewer";
import PatientAlerts from "./pages/patient/MyAlerts";
import PatientActivityLogs from "./pages/patient/ActivityLogs";

// Pharmacist Dashboard Pages
import PharmacistDashboard from "./pages/pharmacist/Dashboard";
import ScanPrescription from "./pages/pharmacist/ScanPrescription";
import VerifyPrescription from "./pages/pharmacist/VerifyPrescription";
import DispenseDrug from "./pages/pharmacist/DispenseDrug";
import Inventory from "./pages/pharmacist/Inventory";
import PharmacistActivityLogs from "./pages/pharmacist/ActivityLogs";

// Manufacturer Dashboard Pages
import ManufacturerDashboard from "./pages/manufacturer/Dashboard";
import RegisterBatch from "./pages/manufacturer/RegisterBatch";
import BatchList from "./pages/manufacturer/BatchList";
import ManufacturerBlockchainVerification from "./pages/manufacturer/BlockchainVerification";
import ManufacturerActivityLogs from "./pages/manufacturer/ActivityLogs";

// Distributor Dashboard Pages
import DistributorDashboard from "./pages/distributor/Dashboard";
import ActiveShipments from "./pages/distributor/ActiveShipments";
import UpdateShipment from "./pages/distributor/UpdateShipment";
import ShipmentLogs from "./pages/distributor/ShipmentLogs";
import DistributorActivityLogs from "./pages/distributor/ActivityLogs";

// Regulator Dashboard Pages
import RegulatorDashboard from "./pages/regulator/Dashboard";
import Audits from "./pages/regulator/Audits";
import Reports from "./pages/regulator/Reports";
import RegulatorAlerts from "./pages/regulator/Alerts";
import ComplianceActions from "./pages/regulator/ComplianceActions";
import RegulatorActivityLogs from "./pages/regulator/ActivityLogs";

// Admin Dashboard Pages
import AdminDashboard from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import SystemSettings from "./pages/admin/SystemSettings";
import AdminReports from "./pages/admin/Reports";
import AdminActivityLogs from "./pages/admin/ActivityLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/create-prescription" element={<CreatePrescription />} />
          <Route path="/doctor/prescriptions" element={<MyPrescriptions />} />
          <Route path="/doctor/blockchain-verification" element={<BlockchainVerification />} />
          <Route path="/doctor/activity-logs" element={<DoctorActivityLogs />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/patient/qr-viewer" element={<QRCodeViewer />} />
          <Route path="/patient/alerts" element={<PatientAlerts />} />
          <Route path="/patient/activity-logs" element={<PatientActivityLogs />} />
          
          {/* Pharmacist Routes */}
          <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
          <Route path="/pharmacist/scan" element={<ScanPrescription />} />
          <Route path="/pharmacist/verify" element={<VerifyPrescription />} />
          <Route path="/pharmacist/dispense" element={<DispenseDrug />} />
          <Route path="/pharmacist/inventory" element={<Inventory />} />
          <Route path="/pharmacist/activity-logs" element={<PharmacistActivityLogs />} />
          
          {/* Manufacturer Routes */}
          <Route path="/manufacturer/dashboard" element={<ManufacturerDashboard />} />
          <Route path="/manufacturer/register-batch" element={<RegisterBatch />} />
          <Route path="/manufacturer/batch-list" element={<BatchList />} />
          <Route path="/manufacturer/blockchain-verification" element={<ManufacturerBlockchainVerification />} />
          <Route path="/manufacturer/activity-logs" element={<ManufacturerActivityLogs />} />
          
          {/* Distributor Routes */}
          <Route path="/distributor/dashboard" element={<DistributorDashboard />} />
          <Route path="/distributor/active-shipments" element={<ActiveShipments />} />
          <Route path="/distributor/update-shipment" element={<UpdateShipment />} />
          <Route path="/distributor/shipment-logs" element={<ShipmentLogs />} />
          <Route path="/distributor/activity-logs" element={<DistributorActivityLogs />} />
          
          {/* Regulator Routes */}
          <Route path="/regulator/dashboard" element={<RegulatorDashboard />} />
          <Route path="/regulator/audits" element={<Audits />} />
          <Route path="/regulator/reports" element={<Reports />} />
          <Route path="/regulator/alerts" element={<RegulatorAlerts />} />
          <Route path="/regulator/compliance" element={<ComplianceActions />} />
          <Route path="/regulator/activity-logs" element={<RegulatorActivityLogs />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/activity-logs" element={<AdminActivityLogs />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
