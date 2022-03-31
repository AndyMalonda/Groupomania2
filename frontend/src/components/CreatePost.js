import React, { useContext, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../contexts/auth-context";
import { Container, Box, Typography, Button } from "@mui/material";
import { TextField } from "formik-mui";
import { BackButton } from "../components/BackButton";

function CreatePost() {
  const { authState } = useContext(AuthContext);
  const initialValues = { title: "", message: "", imageUrl: "" };
  let navigate = useNavigate();
  const notify = () => toast("Votre post a été publié !");

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  });

  // function onSubmit to make a post request to create a new post  //
  async function onSubmit(data) {
    try {
      const response = await axios.post(
        "http://localhost:3006/posts/create",
        data,
        {
          headers: { token: sessionStorage.getItem("token") },
        }
      );
      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        notify();
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  }

  return (
    <div className="CreatePost">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h2" variant="h5">
            Nouvelle publication
          </Typography>
          <Formik initialValues={initialValues} onSubmit={onSubmit}>
            <Form>
              <Field
                component={TextField}
                margin="normal"
                fullWidth
                name="imageUrl"
                label="Image (facultatif)"
                placeholder="ex: http://chatsmagazine/photos/photodechat1.jpg"
              />
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                name="title"
                label="Titre"
                placeholder="ex: Mon petit chat"
              />
              <Field
                component={TextField}
                margin="normal"
                required
                fullWidth
                multiline
                name="message"
                label="Message"
                placeholder="ex: Voici mon petit chat..."
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Publier
              </Button>
            </Form>
          </Formik>
        </Box>
      </Container>
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
      <BackButton />
    </div>
  );
}

export default CreatePost;
