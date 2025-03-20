import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AuthContextProvider } from "./context/AuthContext";
import {BrowserRouter} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
    <DarkModeContextProvider>
      <BrowserRouter basename="/admin">
        <App />
      </BrowserRouter>      
    </DarkModeContextProvider>
    </AuthContextProvider>    
  </React.StrictMode>,
  document.getElementById("root")
);
