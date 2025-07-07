import React, { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerPassword } from "../context/slice/AppSlice";
import Switch from "@mui/material/Switch";
import Input from "../components/Input";
import { Formik } from "formik";
import toast, { Toaster } from "react-hot-toast";
import { IoIosRefresh } from "react-icons/io";
import { getItem } from "../utils/function";
import { ipcRenderer } from "electron";
import { Slider } from "@mui/material";

export function RegisterPassword() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");

  const [isNumber, setIsNumber] = useState(false);
  const [isCapital, setIsCapital] = useState(false);
  const [isSpecialCharacter, setIsSpecialCharacter] = useState(false);

  const generatePassword = () => {
    let lower = [
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
    let capital = [
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
    let special = [
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
    let numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

    let allChars = [...lower];
    let mustInclude = [];

    if (isNumber) {
      allChars = allChars.concat(numbers);
      mustInclude.push(numbers[Math.floor(Math.random() * numbers.length)]);
    }
    if (isCapital) {
      allChars = allChars.concat(capital);
      mustInclude.push(capital[Math.floor(Math.random() * capital.length)]);
    }
    if (isSpecialCharacter) {
      allChars = allChars.concat(special);
      mustInclude.push(special[Math.floor(Math.random() * special.length)]);
    }

    // Always include at least one of each selected type
    let randomPasswordArr = [...mustInclude];

    // Fill the rest
    let length = passwordLength || 12;
    for (let i = randomPasswordArr.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      randomPasswordArr.push(allChars[randomIndex]);
    }

    // Shuffle to avoid predictable placement of mustInclude chars
    for (let i = randomPasswordArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomPasswordArr[i], randomPasswordArr[j]] = [
        randomPasswordArr[j],
        randomPasswordArr[i],
      ];
    }

    setPassword(randomPasswordArr.join(""));
  };

  const createPassword = async (values) => {
    values.password = password != "" ? password : values.password;
    const user = getItem({ str: "user" });
    values.UserId = user.id;
    let res = await ipcRenderer.invoke("create-password", values);
    res = JSON.parse(res);
  };

  const [passwordLength, setPasswordLength] = useState(8);

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
      <Toaster />

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
          width: "80%",
          boxSizing: "border-box",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Formik
          initialValues={{ title: "", password: "" }}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            createPassword(values);
            password != "" && setPassword("");
            toast.success("Contraseña registrada correctamente");

            resetForm();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
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
                  onChange={(e) => {
                    setPassword("");
                    handleChange(e);
                  }}
                  value={password != "" ? password : values.password}
                  name="password"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "flex-start",
                  alignContent: "flex-start",
                  boxSizing: "border-box",
                  padding: "20px",
                  width: "50%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>
                    <h5 style={{ margin: "5px 0" }}>Mayuscula</h5>
                    <Switch
                      name="capital"
                      checked={isCapital}
                      onChange={(e) => {
                        setIsCapital(e.target.checked);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "rgba(44, 218, 157, 1)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "rgba(44, 218, 157, 1)",
                          },
                      }}
                    />
                  </div>
                  <div>
                    <h5 style={{ margin: "5px 0" }}>Simbolos</h5>
                    <Switch
                      name="special_character"
                      checked={isSpecialCharacter}
                      onChange={(e) => {
                        setIsSpecialCharacter(e.target.checked);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "rgba(44, 218, 157, 1)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "rgba(44, 218, 157, 1)",
                          },
                      }}
                    />
                  </div>

                  <div>
                    <h5 style={{ margin: "5px 0" }}>Numeros</h5>
                    <Switch
                      name="number"
                      checked={isNumber}
                      onChange={(e) => {
                        setIsNumber(e.target.checked);
                      }}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "rgba(44, 218, 157, 1)",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "rgba(44, 218, 157, 1)",
                          },
                      }}
                    />
                  </div>
                </div>

                <div style={{ width: "100%" }}>
                  <h5 style={{ margin: "5px 0" }}>Longitud de la contraseña</h5>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <Slider
                      min={4}
                      max={32}
                      value={passwordLength}
                      onChange={(e, value) => setPasswordLength(value)}
                      aria-label="Default"
                      valueLabelDisplay="auto"
                      sx={{
                        color: "rgba(44, 218, 157, 1)",
                        "& .MuiSlider-thumb": {
                          backgroundColor: "rgba(44, 218, 157, 1)",
                        },
                        "& .MuiSlider-rail": {
                          backgroundColor: "rgba(44, 218, 157, 0.2)",
                        },
                        "& .MuiSlider-track": {
                          backgroundColor: "rgba(44, 218, 157, 1)",
                        },
                      }}
                    />
                    <input
                      type="number"
                      name="passwordLength"
                      min={passwordLength}
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(e.target.value)}
                      style={{
                        textAlign: "center",
                        color: "white",
                        height: "30px",
                        width: "25%",
                        boxSizing: "border-box",
                        borderRadius: "5px",
                        marginLeft: "10px",
                        // padding: "20px",
                        background: "#1c1d22",
                        border: "none",
                        outline: "none",
                      }}
                    />
                  </div>
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
                  fontWeight: "bold",
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
