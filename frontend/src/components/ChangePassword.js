import React from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { TextField } from "formik-mui";
import toast, { Toaster } from "react-hot-toast";

import { BackButton } from "./BackButton";

export default function ChangePassword() {
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    oldPassword: Yup.string().required("Champs requis"),
    newPassword: Yup.string()
      .required("Champs requis")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial"
      ),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("newPassword"), null],
        "Le mot de passe ne correspond pas"
      )
      .required("Champs requis"),
  });

  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  async function onSubmit(data) {
    try {
      const response = await axios.put(
        "http://localhost:3006/users/password",
        data,
        {
          headers: {
            token: JSON.parse(sessionStorage.getItem("groupomaniaAndy")).token,
          },
        }
      );
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

  return (
    <div>
      <h1>Changement de mot de passe</h1>
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
            name="oldPassword"
            placeholder="Ancien mot de passe"
          />
          <Field
            component={TextField}
            required
            fullWidth
            type="password"
            name="newPassword"
            placeholder="Nouveau mot de passe"
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
