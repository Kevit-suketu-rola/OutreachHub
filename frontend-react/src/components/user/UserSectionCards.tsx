import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { getAllCampaignsOfWorkspace } from "@/redux/slices/campaignSlice";
import { fetchContactsOfWorkspace } from "@/redux/slices/contactSlice";

export const UserSectionCards: React.FC<{}> = ({}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaceCampaigns } = useSelector(
    (state: RootState) => state.campaign
  );
  const { contacts } = useSelector((state: RootState) => state.contact);
  const { currentWorkspace } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(getAllCampaignsOfWorkspace(currentWorkspace?.id));
    dispatch(fetchContactsOfWorkspace(currentWorkspace?.id));
  }, [dispatch]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-1 @5xl/main:grid-cols-2">
      {/* <Card className="@container/card"> remove
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Workspaces
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {userLoading ? "-" : workspaces.length}
        </CardTitle>
      </Card> */}

      {/* <Card className="@container/card"> remove
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Users
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          
        </CardTitle>
      </Card> */}

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Campaigns
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {workspaceCampaigns.length}
        </CardTitle>
        <div className="m-auto bg-blue-500 rounded px-4 py-2 text-white">
          Running:{" "}
          {workspaceCampaigns.filter((c) => c.status === "Running").length}
        </div>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription className="text-center font-semibold text-2xl">
            Contacts
          </CardDescription>
        </CardHeader>
        <CardTitle className="text-6xl text-center font-bold">
          {contacts.length}
        </CardTitle>
      </Card>
    </div>
  );
};
