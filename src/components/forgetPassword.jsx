import * as React from "react";
import { useState, useContext } from "react";
import { GlobalContext } from "../context/Context";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import "./home.css";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import TwitterIcon from "@mui/icons-material/Twitter";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import axios from "axios";
import { toast } from "react-toastify";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();

function ForgetPassword() {
  let { state, dispatch } = useContext(GlobalContext);
  const [isotpSent, setisotpSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    try {
      const data = new FormData(event.currentTarget);
      let response = await axios.post(
        `${state.baseUrl}/forget_password`,
        {
          email: data.get("email"),
        },
        {
          withCredentials: true,
        }
      );
      setisotpSent(!isotpSent);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const CheckOTP = async (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    try {
      const data = new FormData(event.currentTarget);
      let response = await axios.post(
        `${state.baseUrl}/check_otp`,
        {
          new_password: data.get("password"),
          otp: data.get("otpNumber"),
          email: data.get("email"),
        },
        {
          withCredentials: true,
        }
      );
      console.log(data);
      setisotpSent(!isotpSent);
      //   toast.success(response.data.message);
    } catch (error) {
      //   toast.error(error.response.data.message);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />

        {isotpSent ? (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "white" }}>
              <TwitterIcon color="primary" />
            </Avatar>
            <Typography component="h1" variant="h5">
              O T P
            </Typography>
            <Box component="form" onSubmit={CheckOTP} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="otpNumber"
                label="Enter Your OTP"
                name="otpNumber"
                autoComplete="one-time-code"
                autoFocus
              />
             <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="New Password"
                name="password"
                autoComplete="new-password"
                autoFocus
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Check
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "white" }}>
              <TwitterIcon color="primary" />
            </Avatar>
            <Typography component="h1" variant="h5">
              Forget Password
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Send
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default ForgetPassword;
