import { Checkbox } from "@mui/material";
import { Formik } from "formik";
import React from "react";

function SignupPage() {
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
        onSubmit={async (values) => {}}
      >
        {({}) => (
          <form
            style={{
              width: "300px",
              height: "450px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              alignItems:"start"
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

            <div >
              <Checkbox
                defaultChecked
                color="success"
                sx={{
                  marginLeft:0,
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
