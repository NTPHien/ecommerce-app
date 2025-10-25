'use client';

import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useAuthStore } from '../store/auth';

export default function Navigation() {
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>
            E-Commerce
          </Link>
        </Typography>
        <Box>
          {isAuthenticated && (
            <Button color="inherit" component={Link} href="/products">
              Products
            </Button>
          )}
          <Button color="inherit" component={Link} href="/cart">
            Cart
          </Button>
          {!isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={handleMenu}>
                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                  {user?.email?.[0].toUpperCase()}
                </Avatar>
                {user?.email}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}