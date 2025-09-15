import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { CampaignsTable } from "../campaign/CampaignsTable";
import { UserCampaignsChart } from "./UserCampaignsChart";
import { UserSectionCards } from "./UserSectionCards";
import { fetchAWorkspaceUser } from "@/redux/slices/workspaceUserSlice";

export const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAWorkspaceUser());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem("user-token")) navigate("/");
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 sm:gap-6 md:py-6">
          <UserSectionCards />
          <div className="px-4 lg:px-6 sm:flex xs:flex-col gap-3 justify-between">
            <UserCampaignsChart />
          </div>
          <CampaignsTable />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
