import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Toolbar,
  AppBar,
  Avatar,
  MenuItem,
  Menu,
  IconButton,
  CssBaseline,
  useTheme,
} from "@mui/material";

import {
  BarChart as BarChartIcon,
  Home as HomeIcon,
  Inventory as InventoryIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Favorite as FavoriteIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import { useAuth } from "@/context/AuthContext"; // Assuming you have an auth context

const iconMap = {
  Home: HomeIcon,
  Users: PeopleIcon,
  Donations: InventoryIcon,
  Reports: BarChartIcon,
  Settings: SettingsIcon,
  "My Donations": FavoriteIcon,
  "Create Donation": AddIcon,
};

const drawerWidth = 240;

const CreateDonations = ({ title }) => {
  const theme = useTheme();
  const { user } = useAuth();
  const userType = user?.role || "donor";

  const [showModal, setShowModal] = useState(false);
  const [donations, setDonations] = useState([]);
  const [newDonation, setNewDonation] = useState({ foodName: "", quantity: "" });

  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const donorSidebarItems = [
    { icon: "Home", label: "Overview", href: "/dashboard/donor" },
    { icon: "My Donations", label: "My Donations", href: "/dashboard/donor/my-donations" },
    { icon: "Create Donation", label: "Create Donation", href: "/dashboard/donor/create" },
    { icon: "Manage Donation Claims", label: "Manage Donation Claim", href: "/dashboard/donor/claims" },
    { icon: "Settings", label: "Settings", href: "/settings" },
  ];

  const sidebarItemsMap = { donor: donorSidebarItems };
  const sidebarItems = sidebarItemsMap[userType];

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewDonation({ ...newDonation, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDonations([...donations, { ...newDonation, id: donations.length + 1 }]);
    setNewDonation({ foodName: "", quantity: "" });
    handleClose();
  };

  const isActive = (href) => {
    return window.location.pathname === href;
  };

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FavoriteIcon sx={{ fontSize: "2rem", color: "primary.main", mb: 1 }} />
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          FoodShare
        </Typography>
        <Box sx={{ backgroundColor: "primary.main", color: "white", py: 0.75, px: 1.5, borderRadius: 1 }}>
          Welcome, {user?.name || "User"}
        </Box>
      </Box>

      <Divider />

      <List sx={{ px: 1, flexGrow: 1 }}>
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon] || HomeIcon;
          return (
            <ListItem key={item.href} disablePadding component={Link} to={item.href}>
              <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1.5, borderRadius: 1 }}>
                <ListItemIcon sx={{ color: isActive(item.href) ? "primary.contrastText" : "inherit" }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
              </Box>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mt: "auto" }} />

      <Box sx={{ p: 2 }}>
        <ListItem component={Link} to="/">
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Back to Site" primaryTypographyProps={{ fontSize: 14 }} />
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <IconButton onClick={handleProfileClick}>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </IconButton>
          <Menu anchorEl={profileAnchorEl} open={Boolean(profileAnchorEl)} onClose={handleProfileClose}>
            <MenuItem onClick={handleProfileClose} component={Link} to="/profile">
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileClose} component={Link} to="/settings">
              Account Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleProfileClose} component={Link} to="/login">
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle}>
          {drawer}
        </Drawer>
        <Drawer variant="permanent" sx={{ display: { xs: "none", sm: "block" } }}>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};

export default CreateDonations;







Uncaught TypeError: Cannot read properties of undefined (reading 'filter')
    at Claims.jsx:148:22
    at Array.map (<anonymous>)
    at DonorClaimsPage (Claims.jsx:143:32)
    at react-stack-bottom-frame (react-dom-client.development.js:22428:20)
    at renderWithHooks (react-dom-client.development.js:5757:22)
    at updateFunctionComponent (react-dom-client.development.js:8018:19)
    at beginWork (react-dom-client.development.js:9683:18)
    at runWithFiberInDEV (react-dom-client.development.js:543:16)
    at performUnitOfWork (react-dom-client.development.js:15044:22)
    at workLoopSync (react-dom-client.development.js:14870:41)
(anonymous) @ Claims.jsx:148
DonorClaimsPage @ Claims.jsx:143
react-stack-bottom-frame @ react-dom-client.development.js:22428
renderWithHooks @ react-dom-client.development.js:5757
updateFunctionComponent @ react-dom-client.development.js:8018
beginWork @ react-dom-client.development.js:9683
runWithFiberInDEV @ react-dom-client.development.js:543
performUnitOfWork @ react-dom-client.development.js:15044
workLoopSync @ react-dom-client.development.js:14870
renderRootSync @ react-dom-client.development.js:14850
performWorkOnRoot @ react-dom-client.development.js:14384
performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:15931
performWorkUntilDeadline @ scheduler.development.js:44
react-dom-client.development.js:7409  An error occurred in the <DonorClaimsPage> component.

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://react.dev/link/error-boundaries to learn more about error boundaries.