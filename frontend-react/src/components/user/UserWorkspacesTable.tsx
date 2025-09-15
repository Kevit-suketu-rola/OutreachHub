import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { fetchAllWorkspacesOfUser } from "@/redux/slices/workspaceSlice";
import { setCurrentWorkspace } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "../LoaderCircle";

const UserWorkspacesTable = () => {
  const { workspaces, userWorkspacesLoading } = useSelector(
    (state: RootState) => state.workspace
  );

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchAllWorkspacesOfUser());
  }, [dispatch]);

  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredData = workspaces.filter((row) =>
    row?.workspaceId?.name
      ? row.workspaceId.name.toLowerCase().includes(search.toLowerCase())
      : false
  );

  const handleSetWorkspace = (workspaceId: string, name: string) => {
    dispatch(setCurrentWorkspace({ workspaceId, name }));
    setTimeout(() => navigate("/user/workspace"), 300);
  };

  return (
    <Box sx={{ p: 2, margin: "auto" }}>
      <TextField
        label="Search by Name"
        variant="filled"
        margin="normal"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="md:max-w-lg bg-white/50 rounded"
      />

      {!userWorkspacesLoading ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Permissions</strong>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!userWorkspacesLoading ? (
                filteredData.map((row, index) => (
                  <TableRow key={index} className="hover:bg-violet-100">
                    <TableCell>{row.workspaceId.name}</TableCell>
                    <TableCell>
                      {Object.entries(row.permissions).map(
                        ([permKey, permValue]) =>
                          permValue ? (
                            <Chip
                              key={permKey}
                              label={`${permKey}`}
                              size="small"
                              color={"default"}
                              sx={{ mr: 0.5, borderRadius: "12px" }}
                            />
                          ) : null
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        className="w-full hover:text-violet-400"
                        onClick={() =>
                          handleSetWorkspace(
                            row.workspaceId._id,
                            row.workspaceId.name
                          )
                        }
                      >
                        Select
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!userWorkspacesLoading && filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <LoaderCircle color="#fff" />
      )}
    </Box>
  );
};
export default UserWorkspacesTable;
