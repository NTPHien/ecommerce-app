'use client';

import { Box, Container, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useAuthStore } from '../../store/auth';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data.email, data.password);
      router.push('/');
    } catch (error: any) {
      setError('root', {
        type: 'server',
        message: error.message || 'Failed to login'
      });
    }
  };

  return (
    <Box>
      <Navigation />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
          {errors.root?.message && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errors.root.message}
            </Alert>
          )}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register('email', { required: 'Email is required' })}
              label="Email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
            />
            <TextField
              {...register('password', { required: 'Password is required' })}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message?.toString()}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Button
                color="primary"
                onClick={() => router.push('/register')}
                sx={{ textTransform: 'none', fontWeight: 'bold', p: 0, minWidth: 'auto', verticalAlign: 'baseline' }}
              >
                Sign up
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}