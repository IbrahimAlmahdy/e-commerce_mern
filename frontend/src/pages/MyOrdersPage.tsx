import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowBackRounded,
  CalendarMonthOutlined,
  CheckCircleOutlineRounded,
  Inventory2Outlined,
  LocationOnOutlined,
  RefreshRounded,
  ShoppingBagOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";

interface OrderProduct {
  productId?: string;
  title: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  _id: string;
  createdAt?: string;
  status?: string;
  address?: string;
  orderItems?: {
    productTitle: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
  }[];
  items?: OrderProduct[];
  total?: number;
  totalAmount?: number;
}

const getStatusColor = (
  status: string,
): "default" | "warning" | "info" | "success" | "error" => {
  switch (status.toLowerCase()) {
    case "delivered":
    case "completed":
      return "success";
    case "shipped":
      return "info";
    case "processing":
      return "warning";
    case "cancelled":
    case "canceled":
      return "error";
    default:
      return "default";
  }
};

const formatStatus = (status?: string) => {
  if (!status) return "Pending";

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getOrderItems = (order: Order): OrderProduct[] => {
  if (Array.isArray(order.orderItems)) {
    return order.orderItems.map((item) => ({
      title: item.productTitle,
      image: item.productImage,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
  }

  return order.items ?? [];
};

const MyOrdersPage = () => {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${BASE_URL}/cart/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to load orders (${response.status}).`);
      }

      const data: unknown = await response.json();

      const result = Array.isArray(data)
        ? data
        : typeof data === "object" &&
            data !== null &&
            "orders" in data &&
            Array.isArray(data.orders)
          ? data.orders
          : null;

      if (!result) {
        throw new Error("The server returned an unexpected orders format.");
      }

      setOrders(result as Order[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading your orders.",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  if (!isAuthenticated || !token) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 9 } }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 84,
              height: 84,
              mx: "auto",
              mb: 3,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: "action.hover",
              color: "primary.main",
            }}
          >
            <Inventory2Outlined sx={{ fontSize: 42 }} />
          </Box>

          <Typography variant="h5" fontWeight={800} gutterBottom>
            Sign in to view your orders
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.8 }}>
            Log in to access your order history and track your purchases.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              px: 4,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Page Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        spacing={3}
        sx={{ mb: { xs: 3, md: 4 } }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{
              color: "primary.main",
              fontWeight: 800,
              letterSpacing: 2,
            }}
          >
            NEXORA STORE
          </Typography>

          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.8px",
              fontSize: { xs: "1.9rem", sm: "2.4rem" },
              mt: 0.3,
            }}
          >
            My Orders
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1, fontSize: "0.95rem" }}
          >
            Track your purchases and manage your order history.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackRounded />}
            onClick={() => navigate("/")}
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              borderColor: "divider",
              "&:hover": {
                borderColor: "primary.main",
                bgcolor: "action.hover",
              },
            }}
          >
            Shop
          </Button>

          <Button
            variant="contained"
            startIcon={
              loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <RefreshRounded />
              )
            }
            onClick={() => void fetchOrders()}
            disabled={loading}
            sx={{
              minHeight: 42,
              px: 2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
                filter: "brightness(1.08)",
              },
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {/* Error Message */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2, alignItems: "center" }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => void fetchOrders()}
              disabled={loading}
              sx={{ fontWeight: 700 }}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Paper
          variant="outlined"
          sx={{
            py: 8,
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            borderColor: "divider",
          }}
        >
          <CircularProgress size={36} />
          <Typography color="text.secondary">Loading your orders...</Typography>
        </Paper>
      ) : !error && orders.length === 0 ? (
        /* Empty State */
        <Paper
          elevation={0}
          sx={{
            textAlign: "center",
            py: { xs: 5, md: 8 },
            px: 3,
            borderRadius: 4,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              mx: "auto",
              mb: 3,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              bgcolor: "action.hover",
              color: "primary.main",
            }}
          >
            <ShoppingBagOutlined sx={{ fontSize: 46 }} />
          </Box>

          <Typography variant="h5" fontWeight={800} gutterBottom>
            No orders yet
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Your purchases will appear here after checkout.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Start Shopping
          </Button>
        </Paper>
      ) : (
        /* Orders List */
        <Stack spacing={2.5}>
          {orders.map((order) => {
            const items = getOrderItems(order);
            const status = formatStatus(order.status);
            const total = Number(order.total ?? order.totalAmount ?? 0);

            return (
              <Paper
                key={order._id}
                elevation={0}
                sx={{
                  overflow: "hidden",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "background.paper",
                  transition:
                    "border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease",
                  "&:hover": {
                    borderColor: "primary.main",
                    boxShadow: (theme) =>
                      `0 8px 28px ${theme.palette.primary.main}12`,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Order Card Header */}
                <Box
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 2.5,
                    bgcolor: "action.hover",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    spacing={2}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontWeight: 800,
                          letterSpacing: 1.2,
                        }}
                      >
                        ORDER NUMBER
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                          fontWeight: 800,
                          fontSize: "0.98rem",
                          overflowWrap: "anywhere",
                        }}
                      >
                        #{order._id}
                      </Typography>

                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.7}
                        sx={{ mt: 1 }}
                      >
                        <CalendarMonthOutlined
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />

                        <Typography variant="body2" color="text.secondary">
                          {order.createdAt &&
                          !Number.isNaN(Date.parse(order.createdAt))
                            ? new Date(order.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )
                            : "Date unavailable"}
                        </Typography>
                      </Stack>
                    </Box>

                    <Chip
                      label={status}
                      color={getStatusColor(status)}
                      variant="outlined"
                      icon={
                        status.toLowerCase() === "completed" ||
                        status.toLowerCase() === "delivered" ? (
                          <CheckCircleOutlineRounded />
                        ) : undefined
                      }
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        "& .MuiChip-label": { px: 1.2 },
                      }}
                    />
                  </Stack>
                </Box>

                <Divider />

                {/* Products */}
                <Box sx={{ p: { xs: 2, sm: 3 } }}>
                  {items.length > 0 ? (
                    <Stack spacing={2}>
                      {items.map((item, index) => (
                        <Stack
                          key={`${item.productId ?? item.title}-${index}`}
                          direction="row"
                          alignItems="center"
                          spacing={{ xs: 1.5, sm: 2 }}
                        >
                          <Box
                            sx={{
                              width: { xs: 64, sm: 78 },
                              height: { xs: 64, sm: 78 },
                              flexShrink: 0,
                              p: 1,
                              borderRadius: 2,
                              bgcolor: "action.hover",
                              border: 1,
                              borderColor: "divider",
                              display: "grid",
                              placeItems: "center",
                            }}
                          >
                            {item.image ? (
                              <Box
                                component="img"
                                src={item.image}
                                alt={item.title}
                                sx={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <ShoppingBagOutlined
                                sx={{
                                  fontSize: 30,
                                  color: "text.secondary",
                                }}
                              />
                            )}
                          </Box>

                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                overflowWrap: "anywhere",
                                lineHeight: 1.5,
                              }}
                            >
                              {item.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              Quantity: {item.quantity}
                            </Typography>
                          </Box>

                          <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                            <Typography
                              sx={{
                                fontWeight: 800,
                                fontSize: { xs: "0.85rem", sm: "0.95rem" },
                                whiteSpace: "nowrap",
                              }}
                            >
                              {(Number(item.unitPrice) * item.quantity).toFixed(
                                2,
                              )}{" "}
                              EGP
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {Number(item.unitPrice).toFixed(2)} / item
                            </Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  ) : (
                    <Typography color="text.secondary" variant="body2">
                      No product details available for this order.
                    </Typography>
                  )}

                  {/* Delivery Address */}
                  {order.address && (
                    <>
                      <Divider sx={{ my: 2.5 }} />

                      <Stack
                        direction="row"
                        spacing={1.2}
                        alignItems="flex-start"
                      >
                        <LocationOnOutlined
                          sx={{ color: "text.secondary", mt: 0.2 }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            Delivery Address
                          </Typography>

                          <Typography
                            sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
                          >
                            {order.address}
                          </Typography>
                        </Box>
                      </Stack>
                    </>
                  )}
                </Box>

                <Divider />

                {/* Order Total */}
                <Box
                  sx={{
                    px: { xs: 2, sm: 3 },
                    py: 2,
                    bgcolor: "action.hover",
                  }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                  >
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontWeight: 800, letterSpacing: 1 }}
                      >
                        TOTAL AMOUNT
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </Typography>
                    </Box>

                    <Typography
                      variant="h6"
                      sx={{
                        color: "primary.main",
                        fontWeight: 900,
                        fontSize: { xs: "1.1rem", sm: "1.3rem" },
                        whiteSpace: "nowrap",
                      }}
                    >
                      {total.toFixed(2)} EGP
                    </Typography>
                  </Stack>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Container>
  );
};

export default MyOrdersPage;
