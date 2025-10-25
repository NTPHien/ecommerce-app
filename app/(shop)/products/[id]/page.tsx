'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import { AddShoppingCart, ArrowBack } from '@mui/icons-material';
import Navigation from '../../../components/Navigation';
import { useProductStore } from '../../../store/products';
import { useCartStore } from '../../../store/cart';
import { useAuthStore } from '../../../store/auth';
import type { Product } from '../../../types';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { products } = useProductStore();
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  const product = products.find((p) => p.id === Number(params.id));

  useEffect(() => {
    if (!product) {
      router.push('/products');
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const handleAddToCart = () => {
    try {
      if (quantity < 1) {
        setError('Quantity must be at least 1');
        return;
      }

      addItem({
        ...product,
        quantity,
      });

      router.push('/checkout');
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  return (
    <Box>
      <Navigation />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => router.back()}
            startIcon={<ArrowBack />}
          >
            Back to Products
          </Button>
        </Box>
        <Paper sx={{ p: 4 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <Box>
              <Box
                component="img"
                src={product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 400,
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
              <Box sx={{ mt: 4 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' }, gap: 2, alignItems: 'start' }}>
                  <Box>
                    <TextField
                      type="number"
                      label="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      fullWidth
                      inputProps={{ min: 1 }}
                    />
                  </Box>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<AddShoppingCart />}
                      onClick={() => {
                        if (!isAuthenticated) {
                          router.push('/login');
                        } else {
                          handleAddToCart();
                        }
                      }}
                    >
                      {isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}