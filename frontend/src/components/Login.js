// Scripts
import React, { useContext, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { TextField } from "formik-mui";

// Style
import LanguageIcon from "@mui/icons-material/Language";
const theme = createTheme();

function Login() {
  const initialValues = { email: "", password: "" };
  const { setAuthState } = useContext(AuthContext);
  const [passwordShown, setPasswordShown] = useState(false);

  let navigate = useNavigate();

  const onSubmit = (data) => {
    console.log(data);
    axios.post("http://localhost:3006/users/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log("connecté");
        sessionStorage.setItem("token", response.data.token);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        navigate("/");
      }
    });
  };

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
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LanguageIcon />
            </Avatar>
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
      </ThemeProvider>
    </div>
  );
}

export default Login;
