
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import TwitterIcon from '@mui/icons-material/Twitter';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "../context/Context";
import { useState } from "react";
import { toast } from "react-toastify";

const theme = createTheme();

export default function SignIn() {
    let { state, dispatch } = useContext(GlobalContext);
    const [result, setresult] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const data = new FormData(event.currentTarget);
      let response = await axios.post(
        `${state.baseUrl}/login`,
        {
          email: data.get("email"),
          password: data.get("password"),
        },
        {
          withCredentials: true,
        }
      );
      dispatch({
                type: "USER_LOGIN",
                payload: response.data.profile,
              });
        // toast.success("signin successful")

    } catch (error) {
      toast.error(error.response.data.message)

    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {result}
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: "white",}}>
            <TwitterIcon  color="primary"/>
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}