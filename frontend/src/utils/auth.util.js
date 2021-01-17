import Cookies from "js-cookie";
import { login, register } from "../api/authApi";

const loginUserFunction = async (email, password) => {
  if (email === "" || password === "") {
    return null;
  }
  const loginobject = {
    email: email,
    password: password,
  };
  const response = await login(loginobject).then((resp) => {
    if (resp.status === 200) return resp.json();
    return false;
  });
  if (response === false) {
    return false;
  }
  Cookies.set("user", response.user);
  return response;
};

const signUpUserFunction = async (email, password, username) => {
  if (email === "" || password === "" || username === "") {
    return "Please fill fields below";
  }
  const newuserobje = {
    email: email,
    password: password,
    username: username,
  };
  const response = await register(newuserobje).then((resp) => {
    if (resp.status === 200) return resp.json();
    else if (resp.status === 400) return 400;
    else return 500;
  });
  return response === 400
    ? "User with that email exists"
    : response === 500
    ? "Wrong with server"
    : response;
};
export { loginUserFunction,signUpUserFunction };
