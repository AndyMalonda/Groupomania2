// Scripts
import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

// MUI
import CssBaseline from "@mui/material/CssBaseline";
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

function Register() {
  const initialValues = {
    email: "",
    username: "",
    password: "",
    passwordConfirmation: "",
  };

  let navigate = useNavigate();

  const onSubmit = (data) => {
    axios.post("http://localhost:3006/users", data).then(() => {
      navigate("/");
    });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Adresse email incorrecte")
      .required("Champs requis"),
    password: Yup.string()
      .required("Champs requis")
      .min(8, "Doit contenir au moins 8 caractères"),
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
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LanguageIcon />
          </Avatar>
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
    </div>
  );
}

export default Register;
