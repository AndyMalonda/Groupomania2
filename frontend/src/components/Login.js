// Scripts
import React, { useContext, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import toast, { Toaster } from "react-hot-toast";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { TextField } from "formik-mui";

// Style
import MainLogo from "../icon-above-font.png";
import CardMedia from "@mui/material/CardMedia";

const theme = createTheme();

function Login() {
  const initialValues = { email: "", password: "" };
  const { setAuthState } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);

  let navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:3006/users/login",
        data
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        sessionStorage.setItem("token", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        toast.success(response.data);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  const togglePassword = (e) => {
    // e.preventDefault();
    setPasswordShown(!passwordShown);
  };

  return (
    <div className="Login">
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
            <Box
              sx={{
                width: 150,
                height: 150,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardMedia
                component="img"
                image={MainLogo}
                sx={{ height: 200, width: 300 }}
              />
            </Box>
            <Typography component="h2" variant="h5">
              Connexion
            </Typography>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              <Form>
                <ErrorMessage name="email" component="span"></ErrorMessage>

                <Field
                  component={TextField}
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                <ErrorMessage name="password" component="span"></ErrorMessage>

                <Field
                  component={TextField}
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />
                <div>
                  <input
                    type="checkbox"
                    name="showPassword"
                    onChange={togglePassword}
                  />
                  <label htmlFor="showPassword">Montrer le mot de passe</label>
                </div>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Se connecter
                </Button>
              </Form>
            </Formik>
          </Box>
          <Grid container justifyContent="center">
            <Link href="/register">Pas encore de compte ?</Link>
          </Grid>
        </Container>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default Login;
