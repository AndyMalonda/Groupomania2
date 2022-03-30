// Scripts
import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Box from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { TextField } from "formik-mui";

// Style
import { CardMedia } from "@mui/material";
import MainLogo from "../icon-above-font.png";

function Register() {
  const initialValues = {
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  };

  let navigate = useNavigate();

  async function onSubmit(data) {
    try {
      const response = await axios.post("http://localhost:3006/users", data);
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Adresse email incorrecte")
      .required("Champs requis"),
    password: Yup.string()
      .required("Champs requis")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
      ),
    username: Yup.string()
      .required("Champs requis")
      .min(2, "Doit contenir au moins 2 caractères"),
    passwordConfirmation: Yup.string()
      .oneOf([Yup.ref("password"), null], "Le mot de passe ne correspond pas")
      .required("Champs requis"),
  });

  return (
    <div className="Register">
      <Container component="main" maxWidth="xs" sx={{ marginBottom: 4 }}>
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
            Inscription
          </Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={onSubmit}
            validationSchema={validationSchema}
          >
            <Form>
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse email"
                name="email"
                placeholder="ex: j.doe@gmail.com"
                autoComplete="email"
                autoFocus
              />

              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                name="username"
                label="Nom d'utilisateur"
                type="text"
                id="inputusername"
                placeholder="ex: John Doe"
              />
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
                placeholder="ex: M0tdepa$$e1*"
              />
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                name="passwordConfirmation"
                label="Mot de passe"
                type="password"
                id="inputPasswordConfirmation"
                autoComplete="current-password"
                placeholder="ex: M0tdepa$$e1*"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                S'inscrire
              </Button>
            </Form>
          </Formik>
        </Box>
        <Grid container justifyContent="center">
          <Link href="/login">Déjà inscrit·e ?</Link>
        </Grid>
      </Container>
      <Toaster />
    </div>
  );
}

export default Register;
