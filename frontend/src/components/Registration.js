import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./Registration.css";
import { useNavigate } from "react-router-dom";

function Registration() {
  const initialValues = { email: "", password: "", passwordConfirmation: "" };

  let navigate = useNavigate();

  const onSubmit = (data) => {
    axios.post("http://localhost:3006/users", data).then(() => {
      navigate("/");
    });
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Required"),
  });

  return (
    <div className="Registration">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="form-group">
            <label>Adresse email</label>
            <ErrorMessage name="email" component="span"></ErrorMessage>
            <Field
              className="form-control"
              id="inputEmail"
              name="email"
              placeholder="ex: j.doe@groupomania.fr"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <ErrorMessage name="password" component="span"></ErrorMessage>

            <Field
              className="form-control"
              id="inputPassword"
              name="password"
              placeholder="ex: MotDePasse123*"
            />
          </div>
          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <ErrorMessage
              name="passwordConfirmation"
              component="span"
            ></ErrorMessage>

            <Field
              className="form-control"
              id="inputPasswordConfirmation"
              name="passwordConfirmation"
              placeholder="ex: MotDePasse123*"
            />
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
