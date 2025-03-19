import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import { 
  Box, 
  Grid, 
  Container, 
  useTheme,
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import UserDashboardLayout from "@/components/UserDashboardLayout";
import { StatsGrid, StatCard, DashboardSection } from "@/components/DashboardStats";
import { ActivityFeed } from "@/components/DashboardActivity";
import { Package, Heart, Clock, TrendingUp, PlusCircle } from "lucide-react";

// Import our components
import { DonationsList } from "./DonationsList";
import { DonationTips } from "./DonationsTips";
import { QuickActions } from "./QuickActions";
import ChatWidget from "@/components/Chat/ChatWidget";


const DonorDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [donorId, setDonorId] = useState(null);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({});

  const [loading, setLoading] = useState(true);
  const [activityItems, setActivityItems] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [donationData, setDonationData] = useState({
    food_name: "",
    category: "",
    otherCategory: "",
    description: "",
    quantity: "",
    expiry_date: "",
    pickup_location: "",
    status: "available", // Default status
    image: null,
  });
  const [foodCategoryData, setFoodCategoryData] = useState([]);
  const [otherCategory, setOtherCategory] = useState("");
  const token = localStorage.getItem("token");

  const categoryOptions = [
    "Vegetarian",
    "Non-Vegetarian",
    "Dairy",
    "Grains",
    "Canned Goods",
    "Fresh Produce",
    "Others",
  ];

  useEffect(() => {
    console.log("Stats State:", stats); // Debugging
    if (!token) {
      console.error("User is not authenticated. Redirecting to login.");
      navigate("/login"); // Redirect if not authenticated
      return;
    }
    const storedDonorId = localStorage.getItem("donorId"); // Retrieve donor ID
    if (!storedDonorId) {
      console.error("Donor ID is missing. Ensure it's set after login.");
      return;
    }
    setDonorId(storedDonorId);
    fetchStats(storedDonorId);
    fetchDonations(storedDonorId);
    fetchActivityFeed(storedDonorId);
  }, []);

  const fetchStats = async (donorId) => {
    if (!donorId) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/stats/donor`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Stats Response:", response.data); // Debugging
      setStats(response.data);

      // Convert stats.totalFoodByCategory into chart-friendly data
      if (response.data.totalFoodByCategory) {
        const chartData = Object.keys(response.data.totalFoodByCategory).map((category) => ({
          name: category,
          quantity: response.data.totalFoodByCategory[category],
        }));
        setFoodCategoryData(chartData);
      }
      
    } catch (error) {
      console.error("Error fetching donation stats:", error);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/food`,{
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Donations Response:", response.data); // Debugging
      setDonations(response.data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchActivityFeed = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/stats/activities/donor`,{
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Activity Feed Response:", response.data); // Debugging
    setActivityItems(response.data.activities || []); // Extract activities from stats response
    } catch (error) {
      console.error("Error fetching activity feed:", error);
    }
};

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonationData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDonationData((prevData) => ({ ...prevData, image: e.target.files[0] }));
  };

  const handleCreateDonation = async () => {
    const finalCategory = donationData.category === "Others" ? otherCategory : donationData.category;

    if (!donationData.food_name.trim() || !donationData.quantity || !donationData.expiry_date || !donationData.pickup_location.trim()) {
      iziToast.error({ title: "Error", message: "Please fill in all required fields." });
      return;
    }

    const formData = new FormData();
    formData.append("foodType", donationData.food_name);
    formData.append("category", finalCategory);
    formData.append("description", donationData.description);
    formData.append("quantity", donationData.quantity);
    formData.append("expiryDate", donationData.expiry_date);
    formData.append("pickupLocation", donationData.pickup_location);
    formData.append("status", donationData.status);
    if (donationData.image) {
      formData.append("image", donationData.image);
    }

    try {
      await axios.post("http://localhost:5000/api/food/", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}`
        },
      });
      iziToast.success({ title: "Success", message: "Donation created successfully!" });
      handleCloseModal();
      fetchStats();
      fetchActivityFeed();  
      setDonationData({ food_name: "", category: "", description: "", quantity: "", expiry_date: "", pickup_location: "", status: "available", image: null });
      fetchDonations();
    } catch (error) {
      console.error("Error creating donation:", error);
      iziToast.error({ title: "Error", message: "Failed to create donation." });
    }
  };

  return (
    <UserDashboardLayout title="Donor Dashboard" userType="donor">
      <Container maxWidth="xl">
        <DashboardSection title="Your Impact">
        {loading ? <p>Loading stats...</p> : (
          <StatsGrid>
            <StatCard 
              title="Total Donations" 
              value={stats.totalDonations || 0} 
              icon={<Package size={24} />} 
              trend={{ value: "+3 this month", direction: "up" }}
            />
            <StatCard 
              title="Donations Claimed" 
              value={stats.claimedDonations || 0} 
              icon={<Heart size={24} />} 
              trend={{ value: "78% success rate", direction: "up" }}
            />
            <StatCard 
              title="Active Donations" 
              value={stats.activeDonations || 0}
              icon={<Clock size={24} />} 
            />
            <StatCard 
              title="Food Saved (lbs)" 
              value={stats.foodSaved || 0} Kg
              icon={<TrendingUp size={24} />} 
              trend={{ value: "Great job!", direction: "up" }}
            />
          </StatsGrid>
        )}
        </DashboardSection>
        

        <Box display="flex" justifyContent="space-between" mb={3}>
          <Button variant="contained" color="success" startIcon={<PlusCircle />} onClick={handleOpenModal}>
            Create Donation
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate("/donor/donations")}>
            View All Donations
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <DashboardSection title="Your Donations">
              <DonationsList data={donations} />
            </DashboardSection>

            <DashboardSection title="Donation Tips">
              <DonationTips />
            </DashboardSection>
          </Grid>

          <Grid item xs={12} lg={4}>
            <DashboardSection title="Recent Activity">
              <ActivityFeed items={activityItems} />
            </DashboardSection>

            <DashboardSection title="Quick Actions">
              <QuickActions />
            </DashboardSection>
          </Grid>
        </Grid>
      </Container>
      
      {/* Chat Widget */}
      <ChatWidget />

      {/* Create Donation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Create a Donation</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Food Type"
            margin="dense"
            name="food_name"
            value={donationData.food_name}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select name="category" value={donationData.category} onChange={handleChange}>
              {categoryOptions.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {donationData.category === "Others" && (
            <TextField fullWidth label="Other Category" margin="dense" value={otherCategory}
              onChange={(e) => setOtherCategory(e.target.value)} />
          )}

          <TextField fullWidth label="Description" margin="dense" name="description" multiline rows={3} 
            value={donationData.description} onChange={handleChange} />
          <TextField
            fullWidth
            label="Quantity (lbs)"
            margin="dense"
            name="quantity"
            type="number"
            value={donationData.quantity}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="Expiry Date"
            margin="dense"
            type="date"
            name="expiry_date"
            InputLabelProps={{ shrink: true }}
            value={donationData.expiry_date}
            onChange={handleChange}
          />
          <TextField
          fullWidth
          label="Pickup Location"
          margin="dense"
          name="pickup_location"
          value={donationData.pickup_location}
          onChange={handleChange}
        />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
          <Button onClick={handleCreateDonation} color="success" variant="contained">Submit</Button>
        </DialogActions>
      </Dialog>
    </UserDashboardLayout>
  );
};

export default DonorDashboard;
