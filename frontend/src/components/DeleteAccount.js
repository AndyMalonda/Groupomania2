import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TextField } from "formik-mui";
import toast, { Toaster } from "react-hot-toast";

import { BackButton } from "./BackButton";

export default function DeleteAccount() {
  const navigate = useNavigate();
  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  async function onSubmit(data) {
    try {
      const response = await axios.delete(
        "http://localhost:3006/users/delete",
        data,
        {
          headers: { token: sessionStorage.getItem("token") },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      }
      toast.success("Votre compte a été supprimé.");
      navigate("/");
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  return (
    <div>
      <h1>Supprimer le compte</h1>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <Field
            component={TextField}
            required
            fullWidth
            type="password"
            name="password"
            placeholder="Mot de passe"
          />
          <Field
            component={TextField}
            required
            fullWidth
            type="password"
            name="confirmPassword"
            placeholder="Confirmer le nouveau mot de passe"
          />
          <Button type="submit">Changer le mot de passe</Button>
        </Form>
      </Formik>
      <BackButton />
      <Toaster />
    </div>
  );
}
