import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import AdminHome from "./pages/admin/AdminHome";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminWorkspacesPage from "./pages/admin/AdminWorkspacePage";
import UserHome from "./pages/user/UserHome";
import UserWorkspaces from "./pages/user/UserWorkspaces";
import WorkSpace from "./pages/user/WorkSpace";
import { Contacts } from "./pages/user/Contacts";
import { Campaigns } from "./pages/user/Campaigns";
import { MessageTemplates } from "./pages/user/MessageTemplates";
import { NotFound } from "./pages/NotFound";


function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/admin-login" element={<Auth />} />
          <Route path="/admin" element={<AdminHome />}>
            <Route index element={<AdminDashboard />} />
            <Route path="workspaces" element={<AdminWorkspacesPage />} />
          </Route>
          <Route path="/user" element={<UserHome />}>
            <Route index element={<UserWorkspaces />} />
            <Route path="workspace" element={<WorkSpace />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="templates" element={<MessageTemplates />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
