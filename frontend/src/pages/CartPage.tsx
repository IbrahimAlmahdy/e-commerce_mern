import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const {
    cartItems,
    totalAmount,
    error,
    updateItemInCart,
    removeItemInCart,
    clearCart,
    clearError,
  } = useCart();

  const navigate = useNavigate();

  const handleQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;

    void updateItemInCart(productId, quantity);
  };

  const handleRemoveItem = (productId: string) => {
    void removeItemInCart(productId);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleClearCart = () => {
    void clearCart();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          My Cart
        </Typography>

        {cartItems.length > 0 && (
          <Button color="error" onClick={handleClearCart}>
            Clear Cart
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" onClose={clearError} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Cart is empty. Start shopping and add items first.
          </Typography>

          <Button variant="contained" onClick={() => navigate("/")}>
            Continue Shopping
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {cartItems.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  minWidth: 0,
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: 90,
                    height: 90,
                    objectFit: "contain",
                    flexShrink: 0,
                  }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h6">{item.title}</Typography>

                  <Typography color="text.secondary">
                    {item.unitPrice.toFixed(2)} EGP × {item.quantity}
                  </Typography>

                  <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
                    Subtotal: {(item.unitPrice * item.quantity).toFixed(2)} EGP
                  </Typography>

                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleRemoveItem(item.productId)}
                    sx={{ mt: 1 }}
                  >
                    Remove Item
                  </Button>
                </Box>
              </Box>

              <ButtonGroup
                variant="outlined"
                aria-label={`Quantity controls for ${item.title}`}
              >
                <Button
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                  onClick={() =>
                    handleQuantity(item.productId, item.quantity - 1)
                  }
                >
                  −
                </Button>

                <Button disabled>{item.quantity}</Button>

                <Button
                  aria-label="Increase quantity"
                  onClick={() =>
                    handleQuantity(item.productId, item.quantity + 1)
                  }
                >
                  +
                </Button>
              </ButtonGroup>
            </Box>
          ))}

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
              mt: 2,
            }}
          >
            <Typography variant="h5" component="p">
              Total Amount: {totalAmount.toFixed(2)} EGP
            </Typography>

            <Button variant="contained" size="large" onClick={handleCheckout}>
              Go To Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
