'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useProductStore } from '../store/products';
import { useAuthStore } from '../store/auth';
import Navigation from '../components/Navigation';
import type { Product } from '../types';
import { supabase } from '@/lib/supabaseClient';

export default function ProductsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });
  const [file, setFile] = useState<File | null>(null); // thêm state cho file

  const handleOpen = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: ''
    });
    setFile(null);
    setEditingProduct(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image: product.image || ''
    });
    setFile(null);
    setEditingProduct(product);
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      id: editingProduct?.id || Date.now()
    };

    if (file) {
      const fileName = `${Date.now()}-image-${file.name.split('.').pop()}`;
      const { data, error } = await supabase
        .storage
        .from('commerce-app')
        .upload(fileName, file);
      if (error) {
        alert('Upload image failed: ' + error.message);
        setFile(null);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('commerce-app')
        .getPublicUrl(fileName);

      productData.image = publicUrlData.publicUrl;
    }

    if (editingProduct) {
      await supabase
        .from('products')
        .update(productData)
        .eq('id', editingProduct.id);
      updateProduct(editingProduct.id, productData as Product);
    } else {
      await supabase
        .from('products')
        .insert([productData]);
      addProduct(productData as Product);
    }
    handleClose();
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await supabase
        .from('products')
        .delete()
        .eq('id', id);
      deleteProduct(id);
    }
  };

  return (
    <Box>
      <Navigation />
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4">Products</Typography>
          {isAuthenticated && (
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Add Product
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
          {products.map((product) => (
            <Box key={product.id} sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://via.placeholder.com/200'}
                  alt={product.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ mb: 1 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => window.location.href = `/products/${product.id}`}
                  >
                    View Details
                  </Button>
                  {isAuthenticated && (
                    <Box>
                      <Button size="small" onClick={() => handleEditProduct(product)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Product Name"
                fullWidth
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Description"
                fullWidth
                multiline
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Price"
                type="number"
                fullWidth
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Product Image</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ marginTop: '8px' }}
                />
                {formData.image && !file && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2">Current Image:</Typography>
                    <img
                      src={formData.image}
                      alt="current"
                      style={{ width: '100px', borderRadius: '4px', marginTop: '4px' }}
                    />
                  </Box>
                )}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                {editingProduct ? 'Update' : 'Add'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </Box>
  );
}