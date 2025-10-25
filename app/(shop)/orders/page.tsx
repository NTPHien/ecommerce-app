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
} from '@mui/material';
import Navigation from '../../components/Navigation';

// Sample orders data - replace with API call
const orders = [
  {
    id: 1,
    date: '2023-10-25',
    total: 149.97,
    status: 'Completed',
    items: [
      { name: 'T-Shirt', quantity: 2, price: 19.99 },
      { name: 'Jeans', quantity: 1, price: 49.99 },
    ],
  },
  // Add more sample orders
];

export default function OrdersPage() {
  return (
    <Box>
      <Navigation />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Order History
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Items</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>
                    {order.items.map((item, index) => (
                      <div key={index}>
                        {item.name} x{item.quantity}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell align="right">${order.total.toFixed(2)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}