import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "../styles/Registration.css";
import { useNavigate } from "react-router-dom";

function Registration() {
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
    <div className="Registration">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form>
          <div className="form-group">
            <label>Adresse email</label>
            <Field
              className="form-control"
              id="inputEmail"
              name="email"
              placeholder="ex: j.doe@groupomania.fr"
            />
            <ErrorMessage
              className="text-danger"
              name="email"
              component="div"
            ></ErrorMessage>
          </div>
          <div className="form-group">
            <label>Nom</label>
            <Field
              className="form-control"
              id="inputusername"
              name="username"
              placeholder="ex: John Doe"
            />
            <ErrorMessage
              className="text-danger"
              name="username"
              component="div"
            ></ErrorMessage>
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <Field
              className="form-control"
              id="inputPassword"
              name="password"
              type="password"
              placeholder="ex: MotDePasse123*"
            />
            <ErrorMessage
              className="text-danger"
              name="password"
              component="div"
            ></ErrorMessage>
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <Field
              className="form-control"
              id="inputPasswordConfirmation"
              name="passwordConfirmation"
              type="password"
              placeholder="ex: MotDePasse123*"
            />
            <ErrorMessage
              className="text-danger"
              name="passwordConfirmation"
              component="div"
            ></ErrorMessage>
          </div>
          <button className="btn btn-primary" type="submit">
            S'inscrire
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Registration;
