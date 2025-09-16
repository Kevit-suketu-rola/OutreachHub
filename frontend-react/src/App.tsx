import { useSelector } from 'react-redux';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import { PrivateRoute } from './PrivateRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import Auth from './pages/Auth';
import Home from './pages/Home';
import { NotFound } from './pages/NotFound';
import AdminHome from './pages/admin/AdminHome';
import AdminWorkspacesPage from './pages/admin/AdminWorkspacePage';
import { Campaigns } from './pages/user/Campaigns';
import { Contacts } from './pages/user/Contacts';
import { MessageTemplates } from './pages/user/MessageTemplates';
import UserHome from './pages/user/UserHome';
import UserWorkspaces from './pages/user/UserWorkspaces';
import WorkSpace from './pages/user/WorkSpace';
import { RootState } from './redux/store';

function App() {
  const isUserAuthenticated =
    typeof useSelector((state: RootState) => state.auth.email) === 'string';
  const isAdminAuthenticated = useSelector((state: RootState) => state.auth.isAdmin);
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/admin-login" element={<Auth />} />

        {/* Admin */}
        <Route element={<PrivateRoute isAllowed={isAdminAuthenticated} />}>
          <Route path="/admin" element={<AdminHome />}>
            <Route index element={<AdminDashboard />} />
            <Route path="workspaces" element={<AdminWorkspacesPage />} />
          </Route>
        </Route>

        {/* User */}
        <Route element={<PrivateRoute isAllowed={isUserAuthenticated} />}>
          <Route path="/user" element={<UserHome />}>
            <Route index element={<UserWorkspaces />} />
            <Route path="workspace" element={<WorkSpace />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="templates" element={<MessageTemplates />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
