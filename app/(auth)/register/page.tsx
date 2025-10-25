'use client';

import { Box, Container, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useAuthStore } from '../../store/auth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'validate',
          message: 'Passwords do not match'
        });
        return;
      }

      await signUp(data.email, data.password);
      router.push('/');
    } catch (error: any) {
      setError('root', {
        type: 'server',
        message: error.message || 'Failed to register'
      });
    }
  };

  return (
    <Box>
      <Navigation />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Register
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
            <TextField
              {...register('confirmPassword', {
                required: 'Please confirm your password',
              })}
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message?.toString()}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Register
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}