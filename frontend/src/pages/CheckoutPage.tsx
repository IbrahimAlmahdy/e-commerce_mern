import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { useCart } from "../context/Cart/CartContext";
import { BASE_URL } from "../constants/baseUrl";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth/AuthContext";

const CheckoutPage = () => {
  const { cartItems, totalAmount } = useCart();
  const { token } = useAuth();

  const addressRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirmOrder = async () => {
    const address = addressRef.current?.value.trim();

    if (!address) {
      setError("Please enter your delivery address.");
      return;
    }

    if (!token) {
      setError("Please log in before placing your order.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch(`${BASE_URL}/cart/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to place order (${response.status}). Please try again.`,
        );
      }

      navigate("/order-success");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          NEXORA STORE
        </Typography>

        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", md: "2.5rem" },
            mt: 0.5,
          }}
        >
          Checkout
        </Typography>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Review your order and enter your delivery address.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.2fr 0.8fr" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Delivery Information
            </Typography>

            <TextField
              inputRef={addressRef}
              label="Delivery Address"
              name="address"
              placeholder="Enter your full address"
              fullWidth
              required
              multiline
              minRows={3}
              autoComplete="street-address"
            />
          </Paper>

          <Paper
            variant="outlined"
            sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              Order Items ({cartItems.length})
            </Typography>

            {cartItems.length === 0 ? (
              <Box sx={{ py: 3, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Your cart is empty.
                </Typography>

                <Button sx={{ mt: 2 }} onClick={() => navigate("/")}>
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {cartItems.map((item) => (
                  <Box
                    key={item.productId}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 84,
                        height: 84,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "action.hover",
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
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
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, overflowWrap: "anywhere" }}
                      >
                        {item.title}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Quantity: {item.quantity}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {item.unitPrice.toFixed(2)} EGP each
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                        fontSize: { xs: "0.85rem", sm: "1rem" },
                      }}
                    >
                      {(item.quantity * item.unitPrice).toFixed(2)} EGP
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Box>

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, sm: 3 },
            borderRadius: 3,
            position: { md: "sticky" },
            top: { md: 24 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Order Summary
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography color="text.secondary">Products</Typography>
            <Typography>{cartItems.length}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography color="text.secondary">Subtotal</Typography>
            <Typography>{totalAmount.toFixed(2)} EGP</Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
              mb: 3,
            }}
          >
            <Typography fontWeight={700}>Total Amount</Typography>

            <Typography
              variant="h5"
              sx={{ color: "primary.main", fontWeight: 800 }}
            >
              {totalAmount.toFixed(2)} EGP
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handleConfirmOrder}
            disabled={loading || cartItems.length === 0}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
              "&:hover": { boxShadow: 2 },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Order"
            )}
          </Button>

          <Button
            fullWidth
            onClick={() => navigate("/cart")}
            disabled={loading}
            sx={{ mt: 1.5, textTransform: "none" }}
          >
            Back to Cart
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", textAlign: "center", mt: 2 }}
          >
            Please review your delivery details before confirming.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
