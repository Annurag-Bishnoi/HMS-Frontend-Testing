import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";

import DashboardLayout from "../layouts/DashboardLayout";

import Dashboard from "../pages/Admin/Dashboard/Dashboard";

import PatientList from "../pages/Admin/Patients/PatientList";
import AddPatient from "../pages/Admin/Patients/AddPatient";
import EditPatient from "../pages/Admin/Patients/EditPatient";
import PatientDetails from "../pages/Admin/Patients/PatientDetails";

import DoctorList from "../pages/Admin/Doctors/DoctorList";
import AddDoctor from "../pages/Admin/Doctors/AddDoctor";
import EditDoctor from "../pages/Admin/Doctors/EditDoctor";
import DoctorDetails from "../pages/Admin/Doctors/DoctorDetails";

import AppointmentList from "../pages/Admin/Appointments/AppointmentList";
import AddAppointment from "../pages/Admin/Appointments/AddAppointment";
import EditAppointment from "../pages/Admin/Appointments/EditAppointment";
import AppointmentDetails from "../pages/Admin/Appointments/AppointmentDetails";

import AdminPharmacyHub from "../pages/Admin/Pharmacy/AdminPharmacyHub";
import AdminLaboratoryPage from "../pages/Admin/Laboratory/AdminLaboratoryPage";
import AddLabStaff from "../pages/Admin/Laboratory/AddLabStaff";
import EditLabStaff from "../pages/Admin/Laboratory/EditLabStaff";
import AddPharmacist from "../pages/Admin/Pharmacy/AddPharmacist";
import EditPharmacist from "../pages/Admin/Pharmacy/EditPharmacist";

// Master Data & System Pages
import AdminReceptionistPage from "../pages/Admin/Receptionists/AdminReceptionistPage";
import AddReceptionist from "../pages/Admin/Receptionists/AddReceptionist";
import EditReceptionist from "../pages/Admin/Receptionists/EditReceptionist";
import ManageDepartments from "../pages/Admin/MasterData/ManageDepartments";
import ManageMedicines from "../pages/Admin/MasterData/ManageMedicines";
import ManageLabTests from "../pages/Admin/MasterData/ManageLabTests";
import ManageBeds from "../pages/Admin/MasterData/ManageBeds";
import HospitalSettings from "../pages/Admin/System/HospitalSettings";
import AuditLogs from "../pages/Admin/System/AuditLogs";

// Role Dashboards
import DoctorDashboard from "../pages/Roles/DoctorDashboard";
import ClinicalWorkspace from "../pages/Roles/ClinicalWorkspace";
import DoctorAppointmentsPage from "../pages/Roles/Doctor/DoctorAppointmentsPage";
import DoctorPatientsPage from "../pages/Roles/Doctor/DoctorPatientsPage";
import DoctorPrescriptionsPage from "../pages/Roles/Doctor/DoctorPrescriptionsPage";
import ReceptionistDashboard from "../pages/Roles/ReceptionistDashboard";
import PharmacistDashboard from "../pages/Roles/PharmacistDashboard";
import PharmacyInventoryPage from "../pages/Roles/Pharmacy/PharmacyInventoryPage";
import PharmacyDispensePage from "../pages/Roles/Pharmacy/PharmacyDispensePage";
import LaboratoryDashboard from "../pages/Roles/LaboratoryDashboard";
import LabRequestsPage from "../pages/Roles/Lab/LabRequestsPage";
import LabResultsPage from "../pages/Roles/Lab/LabResultsPage";
import BillingDashboard from "../pages/Roles/BillingDashboard";
import PatientDashboard from "../pages/Roles/PatientDashboard";
import PatientAppointmentsPage from "../pages/Roles/Patient/PatientAppointmentsPage";
import PatientVisitHistoryPage from "../pages/Roles/Patient/PatientVisitHistoryPage";
import PatientPrescriptionsPage from "../pages/Roles/Patient/PatientPrescriptionsPage";
import PatientLabTestsPage from "../pages/Roles/Patient/PatientLabTestsPage";

// IPD Modules
import NurseIPDDashboard from "../pages/Roles/Nurse/NurseIPDDashboard";
import DoctorIPDDashboard from "../pages/Roles/Doctor/DoctorIPDDashboard";
import IPDBedManager from "../pages/Roles/Reception/IPDBedManager";

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={<DashboardLayout />}>

        {/* Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />

        {/* Patient Routes */}
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/add" element={<AddPatient />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="patients/edit/:id" element={<EditPatient />} />

        {/* Doctor Routes */}
        <Route path="doctors" element={<DoctorList />} />
        <Route path="doctors/add" element={<AddDoctor />} />
        <Route path="doctors/:id" element={<DoctorDetails />} />
        <Route path="doctors/:id/edit" element={<EditDoctor />} />

        {/* Appointment Routes */}

        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/add" element={<AddAppointment />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />
        <Route path="appointments/:id/edit" element={<EditAppointment />} />

        {/* Pharmacy Routes */}
        <Route path="pharmacy" element={<AdminPharmacyHub />} />
        <Route path="pharmacy/add" element={<AddPharmacist />} />
        <Route path="pharmacy/edit/:id" element={<EditPharmacist />} />

        {/* Laboratory Staff Routes */}
        <Route path="laboratory" element={<AdminLaboratoryPage />} />
        <Route path="laboratory/add" element={<AddLabStaff />} />
        <Route path="laboratory/edit/:id" element={<EditLabStaff />} />

        {/* User Management Extensions */}
        <Route path="receptionists" element={<AdminReceptionistPage />} />
        <Route path="receptionists/add" element={<AddReceptionist />} />
        <Route path="receptionists/edit/:id" element={<EditReceptionist />} />

        {/* Master Data Routes */}
        <Route path="departments" element={<ManageDepartments />} />
        <Route path="medicines" element={<ManageMedicines />} />
        <Route path="lab-tests" element={<ManageLabTests />} />
        <Route path="beds" element={<ManageBeds />} />

        {/* System Oversight */}
        <Route path="settings" element={<HospitalSettings />} />
        <Route path="audit-logs" element={<AuditLogs />} />

        {/* Billing Route */}
        <Route path="billing" element={<BillingDashboard />} />

      </Route>

      {/* Doctor Routes */}
      <Route path="/doctor/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="workspace/:appointmentId" element={<ClinicalWorkspace />} />
        <Route path="appointments" element={<DoctorAppointmentsPage />} />
        <Route path="patients" element={<DoctorPatientsPage />} />
        <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
        <Route path="ipd" element={<DoctorIPDDashboard />} />
      </Route>

      {/* Receptionist Routes */}
      <Route path="/receptionist/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<ReceptionistDashboard />} />
        
        {/* Shared Patient Routes */}
        <Route path="patients" element={<PatientList />} />
        <Route path="patients/add" element={<AddPatient />} />
        <Route path="patients/:id" element={<PatientDetails />} />
        <Route path="patients/edit/:id" element={<EditPatient />} />

        {/* Shared Appointment Routes */}
        <Route path="appointments" element={<AppointmentList />} />
        <Route path="appointments/add" element={<AddAppointment />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />
        <Route path="appointments/:id/edit" element={<EditAppointment />} />
        
        {/* IPD Bed Manager */}
        <Route path="ipd-beds" element={<IPDBedManager />} />
        
        {/* Billing Route */}
        <Route path="billing" element={<BillingDashboard />} />
      </Route>
      
      {/* Nurse Routes */}
      <Route path="/nurse/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<NurseIPDDashboard />} />
      </Route>

      {/* Pharmacy Routes */}
      <Route path="/pharmacy/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<PharmacistDashboard />} />
        <Route path="inventory" element={<PharmacyInventoryPage />} />
        <Route path="dispense" element={<PharmacyDispensePage />} />
      </Route>

      {/* Lab Routes */}
      <Route path="/lab/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<LaboratoryDashboard />} />
        <Route path="requests" element={<LabRequestsPage />} />
        <Route path="results" element={<LabResultsPage />} />
      </Route>

      {/* Billing Routes */}
      <Route path="/billing/*" element={<DashboardLayout />}>
        <Route path="dashboard" element={<BillingDashboard />} />
      </Route>

      {/* Patient Routes */}
      <Route path="/patient/*" element={<DashboardLayout />}>
        <Route path="dashboard"     element={<PatientDashboard />} />
        <Route path="appointments"  element={<PatientAppointmentsPage />} />
        <Route path="history"       element={<PatientVisitHistoryPage />} />
        <Route path="prescriptions" element={<PatientPrescriptionsPage />} />
        <Route path="labs"          element={<PatientLabTestsPage />} />
      </Route>

    </Routes>
  );
}