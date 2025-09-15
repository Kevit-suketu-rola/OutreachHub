import { logoutAdmin, logoutUser } from "@/redux/slices/authSlice";
import type { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const LogoutButton: React.FC<{}> = () => {
  const { isAdmin } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleLogout = () => {
    if (isAdmin) dispatch(logoutAdmin());
    else dispatch(logoutUser());
    navigate("/");
  };
  return (
    <button
      className="ml-auto md:w-24 w-full md:bg-white bg-transparent px-3 py-1 rounded-full font-bold md:hover:bg-black hover:text-white transition"
      onClick={handleLogout}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
