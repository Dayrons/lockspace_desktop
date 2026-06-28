const { ipcRenderer } = require("electron");
import { Box, Button, Modal } from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch, useSelector } from "react-redux";
import { setPasswords } from "../context/slice/AppSlice";
import { setUser, setMasterPassword } from "../context/slice/UserSlice";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { Checkbox, CircularProgress } from "@mui/material";

export function Home() {
  const state = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [value, setvalue] = useState("");
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  // "Recuérdame": guarda el user en localStorage para que al reiniciar
  // solo pida la contraseña (no el nombre). La contraseña NUNCA se guarda en localStorage.
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(async () => {
    if (false) {
      navigate("/page-password");
    } else {
      const jwt = await ipcRenderer.invoke("get-hostname");
      setvalue(jwt);
      ipcRenderer.send("start-server");
    }
  }, []);

  ipcRenderer.on("show-modal-password", (e, data) => {
    setOpen(true);
  });

  ipcRenderer.on("redirect", async (e, _) => {
    await ipcRenderer.invoke("get-file");
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
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          disablePortal
          disableEnforceFocus
          disableAutoFocus
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none",
            outline: "none",
          }}
        >
          <Formik
            initialValues={{
              password: "",
            }}
            onSubmit={async (values) => {
              let res = await ipcRenderer.invoke(
                "validate-file-password",
                values
              );
              res = JSON.parse(res);
              if (res.error) {
                toast.error(res.message);
              } else {
                dispatch(setUser(res.data));
                dispatch(setMasterPassword(values.password));
                toast.success("Sincronización exitosa");
                navigate("/page-password");
              }
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
                  width: "400px",
                  height: "300px",
                  boxSizing: "border-box",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#1c1d22",
                  borderRadius: "10px",
                }}
              >
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
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress sx={{ color: "rgba(44, 218, 157, 1)" }} />
                  </div>
                ) : (
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
                    Validar contraseña
                  </button>
                )}
              </form>
            )}
          </Formik>
        </Modal>
        <div
          style={{
            width: "50%",
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
              setloading(true);
              let res = await ipcRenderer.invoke("singin", values);
              res = JSON.parse(res);
              if (res.error) {
                toast.error(res.message);
              } else {
                dispatch(setUser(res.data));
                dispatch(setMasterPassword(values.password));
                // Si "Recuérdame" está desmarcado, eliminar el user de localStorage
                // para que al reiniciar pida usuario + contraseña completos
                if (!rememberMe) {
                  localStorage.removeItem("user");
                }
                toast.success("logeado");
                navigate("/page-password");
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
              <form onSubmit={handleSubmit}>
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

                <div>
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
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
                  <span>Recuérdame</span>
                </div>

                {loading ? (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress sx={{ color: "rgba(44, 218, 157, 1)" }} />
                  </div>
                ) : (
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
                )}

                <p>
                  Aun no tienes cuenta?{" "}
                  <span
                    style={{
                      color: "rgba(44, 218, 157, 1)",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => navigate("/signup")}
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
            width: "50%",
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
                width: "280px",
                height: "280px",
                boxSizing: "border-box",
                padding: "25px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                borderRadius: "10px",
              }}
            >
              <QRCode value={value} size={280} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
