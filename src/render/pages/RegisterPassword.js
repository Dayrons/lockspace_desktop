import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerPassword } from "../context/slice/AppSlice";
import Switch from "@mui/material/Switch";
import Input from "../components/Input";
import { Formik } from "formik";

import { IoIosRefresh } from "react-icons/io";
import { getItem } from "../utils/function";
import { ipcRenderer } from "electron";

export function RegisterPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");

  const [isNumber, setIsNumber] = useState(false);
  const [isCapital, setIsCapital] = useState(false);
  const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);

  const generatePassword = () => {
    let characters = [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ];

    const capital = [
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
    ];
    const Specialcharacters = [
      "!",
      "@",
      "#",
      "$",
      "%",
      "^",
      "&",
      "*",
      "(",
      ")",
      "+",
      "{",
      "}",
      "[",
      "]",
    ];
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    if (isNumber) characters = characters.concat(numbers);
    if (isCapital) characters = characters.concat(capital);
    if (isSpecialCharacter) characters = characters.concat(Specialcharacters);

    let randomPassword = "";

    // Validar que si se estan en check alguna de las opciones que minimo tenga uno de los caracteres indicados
    for (var i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomPassword += characters[randomIndex];
    }

    setPassword(randomPassword);
  };

  const createPassword = async (values)=>{
       const user = getItem({str:"user"})
       values.UserId = user.id
        let res = await ipcRenderer.invoke('create-password', values)
        res = JSON.parse(res)
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "20px",
          top: "20px",
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <FaArrowLeft style={{ color: "#2CDA9D" }} />
        </IconButton>
      </div>

      <div
        style={{
          background: "rgba(43, 46, 61)",
          height: "80vh",
          width: "50%",
          boxSizing: "border-box",
          padding: "20px 80px",
          borderRadius: "10px",
        }}
      >
        <Formik
          initialValues={{ title: "", password: "" }}
          // validate={(values) => {
          //   const errors = {};
          //   if (!values.email) {
          //     errors.email = "Required";
          //   } else if (
          //     !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          //   ) {
          //     errors.email = "Invalid email address";
          //   }
          //   return errors;
          // }}
          onSubmit={(values, { setSubmitting }) => createPassword(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form
              onSubmit={handleSubmit}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                alignItems: "start",
              }}
            >
              <h2>
                Registra una nueva{" "}
                <span style={{ color: "rgba(44, 218, 157)" }}>contraseña</span>
              </h2>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  marginBottom: "20px",
                }}
              >
                <Input
                  title="Titulo"
                  onChange={handleChange}
                  value={values.title}
                  name="title"
                />
                <Input
                  title="Contraseña"
                  // inputType="password"
                  onChange={(e) => {
                    setPassword("");
                    handleChange(e);
                  }}
                  value={password != "" ? password : values.password}
                  name="password"
                />
              </div>

              <div>
                <div>
                  <h4 style={{ margin: "5px 0" }}>Caracteres especiales</h4>
                  <Switch
                    name="special_character"
                    color="default"
                    checked={isSpecialCharacter}
                    onChange={(e) => {
                      setIsSpecialCharacter(e.target.checked);
                    }}
                  />
                </div>
                <div>
                  <h4 style={{ margin: "5px 0" }}>Mayuscula</h4>
                  <Switch
                    name="capital"
                    color="default"
                    checked={isCapital}
                    onChange={(e) => {
                      setIsCapital(e.target.checked);
                    }}
                  />
                </div>{" "}
                <div>
                  <h4 style={{ margin: "5px 0" }}>Numeros</h4>
                  <Switch
                    name="number"
                    color="default"
                    checked={isNumber}
                    onChange={(e) => {
                      setIsNumber(e.target.checked);
                    }}
                  />
                </div>
                <div
                  style={{
                    height: "30px",
                    borderRadius: "10px",
                    marginTop: "10px",
                    padding: "5px",
                    background: "rgba(44, 218, 157, 0.7)",
                    display: "flex",
                    fontSize: "12px",
                    justifyContent: "center",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => generatePassword()}
                >
                  <IoIosRefresh size={15} style={{ marginRight: "10px" }} />
                  <span style={{ fontWeight: "bold" }}>Generar contraseña</span>
                </div>
              </div>

              <button
                style={{
                  height: "40px",
                  width: "100%",
                  borderRadius: "10px",
                  border: "none",
                  marginTop: "10px",
                  padding: "10px",
                  background: "white",
                  display: "flex",
                  color: "black",
                  fontSize: "16px",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight:"bold"
                }}
                type="submit"
              >
                Registrar contrasña
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
