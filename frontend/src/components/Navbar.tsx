import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useAuth } from "../context/Auth/AuthContext";
import { useCart } from "../context/Cart/CartContext";
import { Badge, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import nexoraLogo from "../assets/nexora-logo.png";
import { useThemeMode } from "../theme/ThemeModeContext";

function Navbar() {
  const { username, isAuthenticated, logout } = useAuth();
  const { cartItems } = useCart();
  const { mode, toggleColorMode } = useThemeMode();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null,
  );

  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleCloseUserMenu();
  };

  const handleCart = () => {
    navigate(isAuthenticated ? "/cart" : "/login");
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Button
              variant="text"
              onClick={() => navigate("/")}
              sx={{ color: "common.white" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Box
                  component="img"
                  src={nexoraLogo}
                  alt="NEXORA"
                  sx={{ display: "flex", width: 32, height: 32, mr: 1 }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  sx={{
                    mr: 2,
                    display: "flex",
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  NEXORA
                </Typography>
              </Box>
            </Button>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                flexGrow: 0,
                gap: 4,
                alignItems: "center",
              }}
            >
              <Tooltip
                title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              >
                <IconButton
                  aria-label={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
                  color="inherit"
                  onClick={toggleColorMode}
                >
                  <Box
                    sx={{
                      display: "flex",
                      transform:
                        mode === "dark" ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 200ms ease-in-out",
                    }}
                  >
                    {mode === "light" ? (
                      <DarkModeOutlinedIcon />
                    ) : (
                      <LightModeOutlinedIcon />
                    )}
                  </Box>
                </IconButton>
              </Tooltip>
              <IconButton
                color="inherit"
                aria-label="cart"
                onClick={handleCart}
              >
                <Badge badgeContent={cartItems.length} color="secondary">
                  <ShoppingCartIcon sx={{ color: "common.white" }} />
                </Badge>
              </IconButton>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Open settings">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                      }}
                    >
                      <Typography>{username}</Typography>

                      <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar
                          alt={username || ""}
                          src="/static/images/avatar/2.jpg"
                        />
                      </IconButton>
                    </Box>
                  </Tooltip>

                  <Menu
                    sx={{ mt: "45px" }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem
                      onClick={() => {
                        handleCloseUserMenu();
                        navigate("/orders");
                      }}
                    >
                      <Typography align="center">My Orders</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <Typography align="center">Logout</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
