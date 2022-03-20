import React, { useContext } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";

function Login() {
  const initialValues = { email: "", password: "" };
  const { setAuthState } = useContext(AuthContext);

  let navigate = useNavigate();

  const onSubmit = (data) => {
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

  return (
    <div className="Login">
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
              type="password"
              placeholder="ex: MotDePasse123*"
            />
          </div>
          <button className="btn btn-primary" type="submit">
            Se connecter
          </button>
        </Form>
      </Formik>
      <p>
        Pas encore de compte ? <a href="/registration">S'inscrire</a>
      </p>
    </div>
  );
}

export default Login;
