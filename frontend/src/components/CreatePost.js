import React, { useContext } from "react";
import { Formik, Form, Field } from "formik";
// possibilité d'installer Yup pour ValidationSchema
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/auth-context";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const initialValues = { title: "", message: "", imageUrl: "" };
  let navigate = useNavigate();
  const notify = () => toast("Votre post a été publié !");

  const onSubmit = (data) => {
    if (!authState.status) {
      navigate("/login");
    } else {
      axios.post("http://localhost:3006/posts", data).then((response) => {
        notify();
        navigate("/");
      });
    }
  };

  return (
    <div className="CreatePost">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <div className="container">
            <div className="row">
              <div className="col w-90 p-3">
                <div className="card">
                  <h5 className="card-title">Image (facultatif)</h5>

                  <Field
                    id="inputCreatePost"
                    name="imageUrl"
                    placeholder="ex: http://chatsmagazine/photos/photodechat1.jpg"
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
