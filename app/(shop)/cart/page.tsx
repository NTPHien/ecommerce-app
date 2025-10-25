'use client';

import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { useCartStore } from '../../store/cart';
import type { CartItem } from '../../types';

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state: { items: CartItem[] }) => state.items);
  const updateQuantity = useCartStore((state: { updateQuantity: (id: number, quantity: number) => void }) => state.updateQuantity);
  const removeItem = useCartStore((state: { removeItem: (id: number) => void }) => state.removeItem);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(id, newQuantity);
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
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    {item.quantity}
                    <IconButton
                      size="small"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => removeItem(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Typography variant="h6">
            Total: ${calculateTotal().toFixed(2)}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Container>
    </Box>
  );
}