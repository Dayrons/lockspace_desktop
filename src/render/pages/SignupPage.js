const { ipcRenderer } = require("electron");
import { Checkbox, CircularProgress } from "@mui/material";
import { Formik } from "formik";
import React, {useState} from "react";

function SignupPage() {
  const [loading, setloading] = useState(false);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Formik
        initialValues={{
          name: "",
          password: "",
        }}
        onSubmit={async (values) => {
          setloading(true);
          let res = await ipcRenderer.invoke("signup", values);

          if (res.error) {
            toast.error("Hubo un error al registrar el Usuario");
          } else {
            toast.success("Cliente registrado");
            // navigate(-1)
          }
          setloading(false);
        }}
      >
        {({
          values,
          handleSubmit,
          touched,
          errors,
          handleChange,
          handleBlur,
        }) => (
          <form
            onSubmit={handleSubmit}
            style={{
              width: "300px",
              height: "450px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems: "start",
            }}
          >
            <h1 style={{ margin: "10px 0" }}>Comencemos</h1>
            <p style={{ margin: "0", marginBottom: "10px" }}>
              Manten tus contraseñas solo en tus dispositivos
            </p>
            <input
              type="text"
              placeholder="Usuario"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                color: "black",
                height: "30px",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "5px",
                padding: "20px",
                background: "white",
                border: "none",
                outline: "none",
                marginBottom: "20px",
              }}
            />
            <input
              type="text"
              placeholder="Contraseña"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{
                color: "black",
                height: "30px",
                width: "100%",
                boxSizing: "border-box",
                borderRadius: "5px",
                padding: "20px",
                background: "white",
                border: "none",
                outline: "none",
                marginBottom: "20px",
              }}
            />

            {loading ? (
              <div style={{
                display:"flex",
                justifyContent:"center",
                alignContent:"center",
                alignItems:"center"
              }}>
                <CircularProgress />
              </div>
            ) : (
              <button
                style={{
                  height: "40px",
                  width: "100%",
                  borderRadius: "5px",
                  border: "none",
                  padding: "10px",
                  background: "rgba(44, 218, 157, 1)",
                  display: "flex",
                  color: "white",
                  fontSize: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
                type="submit"
              >
                Comenzar
              </button>
            )}

            <div>
              <Checkbox
                defaultChecked
                color="success"
                sx={{
                  marginLeft: 0,
                  // paddingLeft:0,
                  color: '"rgba(44, 218, 157, 1)"',
                  "&.Mui-checked": {
                    color: "rgba(44, 218, 157, 1)",
                  },
                  "&.Mui-disabled": {
                    color: "grey",
                  },
                }}
              />
              <span>Recuerdame</span>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export { SignupPage };
