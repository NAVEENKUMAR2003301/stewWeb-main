import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/common/AdminRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import TopProgressBar from './components/common/TopProgressBar';

// ------ User pages ------
import Home from './pages/user/Home';
import Gallery from './pages/user/Gallery';
import Contact from './pages/user/Contact';
import Services from './pages/user/Services';
import ServiceDetail from './pages/user/ServiceDetail';       // ← service detail
import UpcomingEvents from './pages/user/UpcomingEvents';     // ← upcoming events
import EventDetail from './pages/user/EventDetail';

// ------ Admin pages ------
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import PastEventsUpload from './pages/admin/PastEventsUpload';
import AdminEvents from './pages/admin/Events';
import NewEvent from './pages/admin/NewEvent';
import Enquiries from './pages/admin/Enquiries';
import MonthlyReport from './pages/admin/MonthlyReport';
import Settings from './pages/admin/Settings';
import AdminServices from './pages/admin/Services';

// ------- Admin wrapper (protects routes & uses AdminLayout) -------
const AdminWrapper = () => (
  <AdminRoute>
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  </AdminRoute>
);

// ------- Public wrapper (Navbar + Footer + ProgressBar) -------
const PublicWrapper = () => (
  <>
    <TopProgressBar />
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (Navbar + Footer) */}
          <Route element={<PublicWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />   {/* service detail */}
            <Route path="/upcoming" element={<UpcomingEvents />} />     {/* upcoming events */}
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/admin/login" element={<Login />} />
          </Route>

          {/* Admin routes (protected + Admin sidebar) */}
          <Route element={<AdminWrapper />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/past-events" element={<PastEventsUpload />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="/admin/events/new" element={<NewEvent />} />
            <Route path="/admin/enquiries" element={<Enquiries />} />
            <Route path="/admin/report" element={<MonthlyReport />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/services" element={<AdminServices />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;