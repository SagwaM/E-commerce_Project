import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Chip, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Stack,
  alpha
} from '@mui/material';
import { DashboardTable } from '@/components/DashboardTable';
import { Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Ensure AuthContext is used for user data

// Helper function for conditional classnames
const getStatusChipProps = (status) => {
  switch (status) {
    case "available":
      return {
        color: 'success',
        sx: { fontWeight: 500 }
      };
    case "claimed":
      return {
        color: 'primary',
        sx: { fontWeight: 500 }
      };
    case "expired":
      return {
        color: 'default',
        sx: { fontWeight: 500 }
      };
    default:
      return {
        color: 'default',
        sx: { fontWeight: 500 }
      };
  }
};

export function DonationsList({ data}) {
  const { user } = useAuth(); // Fetch current user from context
  console.log("User Object:", user);
  const donorId = user?._id || user?.id; 

  console.log("Current Donor ID:", donorId);
  console.log("Donations Data:", data);

  if (!donorId) {
    console.warn("Donor ID is undefined. Ensure the user is authenticated.");
  }

  // Filter donations to only include those belonging to the logged-in donor
  const donorDonations = donorId
  ? data.filter(donation => donation.donor?._id === donorId)
  : [];

  const columns = [
    { header: "ID", accessorKey: "_id" },
    { header: "Items", accessorKey: "food_name" },
    { 
      header: "Status", 
      accessorKey: "status", 
      cell: (value) => (
        <Chip
          size="small"
          label={value}
          {...getStatusChipProps(value)}
        />
      )
    },
    { header: "Claimed By", accessorKey: "claimed_by?.name", 
      cell: (value) => value ? value.name : "Not Claimed"
    },
    { header: "Posted", accessorKey: "created_at" },
    
  ];

  return (
    <>
    {donorDonations.length > 0 ? (
        <DashboardTable
          columns={columns}
          data={donorDonations}
        />
      ) : (
        <Box sx={{ textAlign: 'center', p: 3, color: 'gray' }}>
          <Package size={64} />
          <Box sx={{ mt: 2 }}>
            You haven't made any donations yet. Click below to get started!
          </Box>
        </Box>
      )}
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          component={Link} 
          to="/dashboard/donor/donations"
          variant="outlined" 
          size="small"
        >
          View All Donations
        </Button>
      </Box>
    </>
  );
}

