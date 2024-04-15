// eslint-disable-next-line simple-import-sort/imports
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { OrganizationContextProvider } from '../../contexts/OrganizationContext';
import { Copyright } from '../Copyright';
import { Header } from '../Header';
import { SideNav } from '../SideNav';
import { useAuthenticationContext } from '../../contexts/useAuthenticationContext';

export const Authenticated = () => {
  const { isLoggedIn } = useAuthenticationContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  if (isLoggedIn === false) {
    navigate('/');
    return null;
  } else if (isLoggedIn === undefined) {
    return <></>;
  }

  return (
    <OrganizationContextProvider>
      <Box sx={{ display: 'flex' }}>
        <Header open={open} toggleDrawer={toggleDrawer} />
        <SideNav open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Outlet />
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </OrganizationContextProvider>
  );
};
