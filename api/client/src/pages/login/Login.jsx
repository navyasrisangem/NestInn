import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: undefined,
    password: undefined,
  });

  const { loading, error, dispatch } = useContext(AuthContext);
  

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });

    try {
      const res = await axios.post(`${API_URL}/auth/login`, credentials, { withCredentials: true });
      //   console.log("Server Response:", res.data);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
      navigate("/");

    } catch (err) {
      const errorMessage = err.response?.data || err.message || "Something went wrong.";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };



  return (
    <div className="login">
      <div className="lContainer">
        <h2 className="lTitle">Login User</h2>

        <div className="lGroup">
          <label className="lLabel" htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="kiwi"
            id="username"
            onChange={handleChange}
            className="lInput"
          />
        </div>
        <div className="lGroup">
          <label className="lLabel" htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="12"
            id="password"
            onChange={handleChange}
            className="lInput"
          />
        </div>
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        <p>Don&apos;t have an account? <Link to="/register" className="registerLink">Register here</Link></p>
        {error && <span className="errorMessage">{error?.message || error}</span>}
      </div>
    </div >
  );
};

export default Login;