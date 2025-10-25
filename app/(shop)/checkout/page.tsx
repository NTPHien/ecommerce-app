'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useCartStore } from '../../store/cart';
import type { CartItem } from '../../types';

interface CheckoutForm {
  fullName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((state: { items: CartItem[] }) => state.items);
  const clearCart = useCartStore((state: { clearCart: () => void }) => state.clearCart);
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>();

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const onSubmit = async (data: CheckoutForm) => {
    // TODO: Implement order submission
    console.log('Order data:', { ...data, items: cartItems, total: calculateTotal() });
    clearCart();
    router.push('/orders');
  };

  if (cartItems.length === 0) {
    return (
      <Box>
        <Navigation />
        <Container sx={{ mt: 4 }}>
          <Typography variant="h5">Your cart is empty</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => router.push('/')}
          >
            Continue Shopping
          </Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Navigation />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          <Box sx={{ width: { xs: '100%', md: '66.66%' }, p: 2 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Checkout
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    {...register('fullName', { required: 'Full name is required' })}
                    label="Full Name"
                    fullWidth
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                  />
                  <TextField
                    {...register('email', { required: 'Email is required' })}
                    label="Email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                  <TextField
                    {...register('address', { required: 'Address is required' })}
                    label="Address"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors.address?.message}
                  />
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      {...register('city', { required: 'City is required' })}
                      label="City"
                      fullWidth
                      error={!!errors.city}
                      helperText={errors.city?.message}
                    />
                    <TextField
                      {...register('postalCode', { required: 'Postal code is required' })}
                      label="Postal Code"
                      fullWidth
                      error={!!errors.postalCode}
                      helperText={errors.postalCode?.message}
                    />
                  </Box>
                  <TextField
                    {...register('phone', { required: 'Phone number is required' })}
                    label="Phone"
                    fullWidth
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Place Order
                </Button>
              </form>
            </Paper>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 2 }}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List>
                {cartItems.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={`Quantity: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                  </ListItem>
                ))}
                <Divider sx={{ my: 2 }} />
                <ListItem>
                  <ListItemText primary="Total" />
                  <Typography variant="h6" color="primary">
                    ${calculateTotal().toFixed(2)}
                  </Typography>
                </ListItem>
              </List>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}