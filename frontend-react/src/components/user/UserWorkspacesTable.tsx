import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { setCurrentWorkspace } from '@/redux/slices/userSlice';
import { fetchAllWorkspacesOfUser } from '@/redux/slices/workspaceSlice';
import type { AppDispatch, RootState } from '@/redux/store';

import { LoaderCircle } from '../LoaderCircle';
import { getUsersPerWorkspace } from '@/redux/slices/workspaceUserSlice';

const UserWorkspacesTable = () => {
  const [userCounts, setUserCounts] = useState<[]>([]);

  const userWorkspaces = useSelector(
    (state: RootState) => state.workspace?.userWorkspaces,
  );

  const userWorkspacesLoading = useSelector(
    (state: RootState) => state.workspace?.userWorkspacesLoading,
  );

  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllWorkspacesOfUser());
      dispatch(setCurrentWorkspace({ workspaceId: '', name: '' }));

      const resultAction = await dispatch(getUsersPerWorkspace());

      if (getUsersPerWorkspace.fulfilled.match(resultAction)) {
        setUserCounts(resultAction.payload.count);
      }
    };

    fetchData();
  }, [dispatch]);



  const filteredData = userWorkspaces?.filter(
    (row) =>
      typeof row?.workspaceId !== 'string' &&
      row?.workspaceId?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSetWorkspace = (workspaceId: string, name: string) => {
    dispatch(setCurrentWorkspace({ workspaceId, name }));
    setTimeout(() => navigate('/user/workspace'), 300);
  };

  return (
    <Box sx={{ p: 2, margin: 'auto' }}>
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
                <TableCell>Users</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!userWorkspacesLoading ? (
                filteredData?.map((row, index) => (
                  <TableRow key={index} className="hover:bg-violet-100">
                    <TableCell>{row.workspaceId.name}</TableCell>
                    <TableCell>
                      {row.permissions && Object.entries(row.permissions).map(([permKey, permValue]) =>
                        permValue ? (
                          <Chip
                            key={permKey}
                            label={`${permKey}`}
                            size="small"
                            color={'default'}
                            sx={{ mr: 0.5, borderRadius: '12px' }}
                          />
                        ) : null,
                      )}
                    </TableCell>
                    <TableCell>

                      <div>{userCounts?.find(item => item.workspaceId === row.workspaceId._id)?.userCount}</div>

                    </TableCell>
                    <TableCell>
                      <button
                        className="w-full hover:text-violet-400"
                        onClick={() =>
                          handleSetWorkspace(row.workspaceId._id, row.workspaceId.name)
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

              {!userWorkspacesLoading && filteredData?.length === 0 && (
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
