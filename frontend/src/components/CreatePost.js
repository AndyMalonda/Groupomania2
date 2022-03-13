import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
// possibilité d'installer Yup pour ValidationSchema
import axios from "axios";
import "./CreatePost.css";
import "../bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const initialValues = { title: "", message: "", imageUrl: "" };

  const onSubmit = (data) => {
    axios.post("http://localhost:3006/posts", data).then((response) => {
      navigate("/");
    });
  };

  let navigate = useNavigate();

  return (
    <div className="CreatePost">
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        <Form>
          <label>Titre</label>
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="ex: Mon petit chat"
          />
          <label>Message</label>
          <Field
            id="inputCreatePost"
            name="message"
            placeholder="ex: Voici mon petit chat..."
          />
          <label>Image</label>
          <Field
            id="inputCreatePost"
            name="imageUrl"
            placeholder="ex: photodechat.jpg"
          />
          <button type="submit">Créer un post</button>
        </Form>
      </Formik>
    </div>
  );
}

export default CreatePost;
