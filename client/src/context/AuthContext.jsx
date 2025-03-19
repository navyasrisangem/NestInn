import { createContext, useEffect, useReducer } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        loading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        loading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        loading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        user: null,
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  const fetchUserData = async () => {
    if (!state.user) return;

    try {
      const res = await axios.get(`${API_URL}/users/${state.user._id}`, {
        withCredentials: true,
      });

      const updatedUser = res.data;

      //  Update the user in context and localStorage
      dispatch({ type: "UPDATE_USER", payload: updatedUser });
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  //  Automatically re-fetch user data when the component mounts or user changes
  useEffect(() => {
    if (state.user) {
      fetchUserData();
    }
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ user: state.user, loading: state.loading,error: state.error, dispatch, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};