import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./login.scss";

const API_URL = process.env.REACT_APP_API_URL;

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
      const res = await axios.post(`${API_URL}/auth/login`, credentials, {
        withCredentials: true,  // Ensures cookies are sent and stored**
    });
    //   console.log("Server Response:", res.data);

  
      
      if(res.data.isAdmin) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.details });
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAILURE", payload: {message: "You are not allowed!"} });
      }     
  
    } catch (err) {
      const errorMessage = err.response?.data || err.message || "Something went wrong.";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };
  


  return (
    <div className="login">
      <div className="lContainer">
        <h2 className="lTitle">Login Admin</h2>

        <div className="lGroup">
          <label className="lLabel" htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="Keth"
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
        {error && <span className="errorMessage">{error?.message || error}</span>}
      </div>
    </div >
  );
};

export default Login;