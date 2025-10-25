'use client';

import { Box, Container, Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from './components/Navigation';
import { useProductStore } from './store/products';
import { useCartStore } from './store/cart';
import type { Product } from './types';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const router = useRouter();
  const { products, setProducts } = useProductStore();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      
      if (!error) {
        setProducts(data as Product[]);
      }
    }
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      quantity: 1
    });
    router.push('/checkout');
  };

  return (
    <Box>
      <Navigation />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -2 }}>
          {products.map((product) => (
            <Box key={product.id} sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' }, p: 2 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    transition: 'transform 0.2s ease-in-out'
                  }
                }}
                onClick={() => window.location.href = `/products/${product.id}`}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Typography variant="h6" color="primary" gutterBottom>
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click when clicking button
                        handleAddToCart(product);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
