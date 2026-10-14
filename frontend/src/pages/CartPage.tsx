import { Box, Container, Typography } from "@mui/material";
import { useCart } from "../context/Cart/CartContext";

const CartPage = () => {
  const { cartItems, totalAmount, error } = useCart();

  return (
    <Container sx={{ mt: 2 }}>
      <Typography variant="h4">My Cart</Typography>
      {error && <Typography color="error">{error}</Typography>}
      {cartItems.length === 0 ? (
        <Typography sx={{ mt: 2 }}>Your cart is empty.</Typography>
      ) : (
        <>
          {cartItems.map((item) => (
            <Box key={item.productId} sx={{ mt: 2 }}>
              <Typography>{item.title}</Typography>
              <Typography variant="body2">
                {item.quantity} × {item.unitPrice} EGP
              </Typography>
            </Box>
          ))}
          <Typography sx={{ mt: 3 }} variant="h6">
            Total: {totalAmount} EGP
          </Typography>
        </>
      )}
    </Container>
  );
};

export default CartPage;
