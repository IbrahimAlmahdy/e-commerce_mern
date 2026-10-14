import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const { cartItems, totalAmount, error, removingProductId, removeItemFromCart } =
    useCart();
  const navigate = useNavigate();

  const handleQuantity = (_productId: string, quantity: number) => {
    if (quantity <= 0) {
      return;
    }

    // TODO: Call the CartContext update-quantity function here.
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        My Cart
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {cartItems.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Your cart is empty.
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
                alignItems: "center",
                gap: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <Box
                  component="img"
                  src={item.image}
                  alt={item.title}
                  sx={{
                    width: 80,
                    height: 80,
                    objectFit: "contain",
                  }}
                />

                <Box>
                  <Typography variant="h6">{item.title}</Typography>

                  <Typography color="text.secondary">
                    {item.quantity} × {item.unitPrice.toFixed(2)} EGP
                  </Typography>

                  <Typography sx={{ fontWeight: "bold" }}>
                    Subtotal: {(item.quantity * item.unitPrice).toFixed(2)} EGP
                  </Typography>

                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteOutlinedIcon />}
                    disabled={removingProductId === item.productId}
                    onClick={() => void removeItemFromCart(item.productId)}
                    sx={{ mt: 1.5 }}
                  >
                    {removingProductId === item.productId
                      ? "Removing…"
                      : "Remove Item"}
                  </Button>
                </Box>
              </Box>

              <ButtonGroup variant="outlined" aria-label="Product quantity">
                <Button
                  aria-label={`Decrease quantity of ${item.title}`}
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    handleQuantity(item.productId, item.quantity - 1)
                  }
                >
                  −
                </Button>

                <Button disabled>{item.quantity}</Button>

                <Button
                  aria-label={`Increase quantity of ${item.title}`}
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
              Total: {totalAmount.toFixed(2)} EGP
            </Typography>

            <Button variant="contained" size="large" onClick={handleCheckout}>
              Go to Checkout
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default CartPage;
