const { ipcRenderer } = require("electron");
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { setPasswords } from "../context/slice/AppSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import Checkbox from "@mui/material/Checkbox";
export function Home() {
  const state = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setvalue] = useState("");

  useEffect(async () => {
    if (state.passwords != null) {
      navigate("/page-password");
    } else {
      const jwt = await ipcRenderer.invoke("get-hostname");
      setvalue(jwt);
      ipcRenderer.send("start-server");
    }
  }, []);

  ipcRenderer.on("redirect", async (e, _) => {
    const res = await ipcRenderer.invoke("get-file");

    if (res != null) {
      dispatch(setPasswords(res));
      navigate("/page-password");
    }
  });

  return (
    <>
      <Toaster />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          height: "100vh",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "60%",
            height: "100%",
            boxSizing: "border-box",
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h4 style={{ margin: "10px 0px" }}>
            Escanea desde la app{" "}
            <span style={{ color: "#2CDA9D" }}>LockSpace</span> o incia sesion
            para gestionar tus contraseñas
          </h4>

          <Formik
            initialValues={{
              name: "",
              password: "",
            }}
            onSubmit={async (values) => {
              // setsubmit(<CircularProgress size={30} style={{ margin: 'auto' }} />)

              let res = await ipcRenderer.invoke("singin", values);
              res = JSON.parse(res);
              if (res.error) {
                toast.error(res.message);
              } else {
                // window.localStorage.setItem('usuario', JSON.stringify(res.data))
                // const user = await ipcRenderer.invoke('localStorage', res.data)
                // navigate("/dashboard")
                // toast.success('logeado')
              }
              // setsubmit(<button className='boton'>Ingresar</button>)
            }}
          >
            {({}) => (
              <form action="">
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
                <div>
                  <Checkbox
                    defaultChecked
                    color="success"
                    sx={{
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
                <button
                  style={{
                    height: "40px",
                    width: "100%",
                    borderRadius: "5px",
                    border: "none",
                    marginTop: "10px",
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
                  Iniciar sesion
                </button>
                ¨
                <p>
                  Aun no tienes cuenta?{" "}
                  <span
                    style={{
                      color: "rgba(44, 218, 157, 1)",
                      cursor: "pointer",
                      fontWeight:"bold"
                    }}
                    onClick={()=>navigate("/signup")}
                  >
                    Comenzar
                  </span>
                </p>
              </form>
            )}
          </Formik>
        </div>
        <div
          style={{
            width: "40%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {value == "" ? (
            <></>
          ) : (
            <div
              style={{
                width: "230px",
                height: "230px",
                boxSizing: "border-box",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: "10px",
              }}
            >
              <QRCode value={value} size={230} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
