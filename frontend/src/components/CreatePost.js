import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
// possibilité d'installer Yup pour ValidationSchema
import axios from "axios";
import "../styles/CreatePost.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function CreatePost() {
  const initialValues = { title: "", message: "", imageUrl: "" };

  const notify = () => toast("Vous avez partagé un nouveau post !");

  const onSubmit = (data) => {
    axios.post("http://localhost:3006/posts", data).then((response) => {
      notify();
      navigate("/");
    });
  };

  let navigate = useNavigate();

  return (
    <div className="CreatePost">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="container">
            <div className="row">
              <div className="col w-90 p-3">
                <div className="card">
                  <h5 className="card-title">Image</h5>

                  <Field
                    id="inputCreatePost"
                    name="imageUrl"
                    placeholder="ex: photodechat.jpg"
                  />
                  <h5 className="card-title">Titre </h5>
                  <Field
                    id="inputCreatePost"
                    name="title"
                    placeholder="ex: Mon petit chat"
                  />
                  <h5 className="card-title">Message </h5>
                  <Field
                    id="inputCreatePost"
                    name="message"
                    placeholder="ex: Voici mon petit chat..."
                  />
                  <button className="btn btn-primary" type="submit">
                    Créer un post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default CreatePost;
