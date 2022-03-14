import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "./Login.css";

function Login() {
  const initialValues = { email: "", password: "" };

  const onSubmit = () => {
    console.log("submit");
  };

  return (
    <div className="Login">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="form-group">
            <label>Adresse email</label>
            <Field
              className="form-control"
              id="inputEmail"
              name="email"
              placeholder="ex: j.doe@groupomania.fr"
            />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <Field
              className="form-control"
              id="inputPassword"
              name="password"
              placeholder="ex: MotDePasse123*"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Se connecter
          </button>
        </Form>
      </Formik>
    </div>
  );
}

export default Login;
