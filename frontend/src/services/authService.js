import { api, reqConfig } from "../utils/config";

// register a new user
const register = async (data) => {
  const config = reqConfig("POST", data);

  try {
    const res = await fetch(api + "/users/register", config)
      .then((res) => res.json())
      .catch((err) => console.log(err));
    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    return res;
  } catch (error) {
    console.log(error);
  }
};
// logout an user

const logout = () => {
  localStorage.removeItem("user");
};

const authService = { register, logout };

export default authService;
