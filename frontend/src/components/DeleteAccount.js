import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
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

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Mot de passe requis"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Le mot de passe ne correspond pas")
      .required("Confirmation requise"),
  });

  // make a request to delete the account and redirect to the login page  //
  async function onSubmit(data) {
    try {
      const response = await axios.delete(
        "http://localhost:3006/users/delete",
        {
          headers: {
            token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
          },
          data: { password: data.password },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success(response.data);
        sessionStorage.removeItem("token");
        navigate("/");
      }
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
          <Button type="submit" sx={{ color: "red" }}>
            Supprimer le compte
          </Button>
        </Form>
      </Formik>
      <BackButton />
      <Toaster />
    </div>
  );
}
