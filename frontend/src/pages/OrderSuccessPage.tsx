import { CheckCircleOutlined, ShoppingBagOutlined } from "@mui/icons-material";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const navigate = useNavigate();

  const handleHome = () => {
    navigate("/");
  };

  const handleOrders = () => {
    navigate("/orders");
  };

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 9 } }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          border: 1,
          borderColor: "divider",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2.5,
        }}
      >
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: "success.main",
            color: "success.contrastText",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <CheckCircleOutlined sx={{ fontSize: 64 }} />
        </Box>

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
          component="h1"
          variant="h4"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.8rem", sm: "2.2rem" },
          }}
        >
          Order Placed Successfully!
        </Typography>

        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
          Thank you for your order. We have received your request and will start
          processing it shortly.
        </Typography>

        <Box
          sx={{
            bgcolor: "action.hover",
            borderRadius: 2,
            p: 2,
            width: "100%",
            mt: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Thank you for shopping with NEXORA. We hope you enjoy your purchase!
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.5,
            width: "100%",
            mt: 1,
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<ShoppingBagOutlined />}
            onClick={handleHome}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              boxShadow: "none",
            }}
          >
            Continue Shopping
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            onClick={handleOrders}
            sx={{
              py: 1.4,
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            My Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderSuccessPage;
