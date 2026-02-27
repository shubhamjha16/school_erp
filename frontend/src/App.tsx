import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminLayout } from './components/layout/AdminLayout';
import { ParentLayout } from './components/layout/ParentLayout';
import { Login } from './pages/auth/Login';
import { Onboarding } from './pages/onboarding/Onboarding';
import { Academics } from './pages/academics/Academics';
import { Guardians } from './pages/sis/Guardians';
import { Students } from './pages/sis/Students';
import { Attendance } from './pages/attendance/Attendance';
import { Notifications } from './pages/communications/Notifications';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Exams } from './pages/exams/Exams';
import { ReportCards } from './pages/exams/ReportCards';
import { Fees } from './pages/fees/Fees';
import { Invoices } from './pages/fees/Invoices';
import { ParentDashboard } from './pages/parent/ParentDashboard';
import { MyChildren } from './pages/parent/MyChildren';
import { AuditLogs } from './pages/operations/AuditLogs';
import { NotificationStatus } from './pages/operations/NotificationStatus';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Layout */}
        <Route element={<AdminLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/guardians" element={<Guardians />} />
          <Route path="/students" element={<Students />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/exams" element={<Exams />} />
          <Route path="/reports" element={<ReportCards />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/notification-jobs" element={<NotificationStatus />} />
        </Route>

        {/* Parent Portal Layout */}
        <Route element={<ParentLayout />}>
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/children" element={<MyChildren />} />
          <Route path="/parent/academics" element={<div className="animate-fade-in">Academic Reports - Coming Soon</div>} />
          <Route path="/parent/fees" element={<div className="animate-fade-in">Fee Status - Coming Soon</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
