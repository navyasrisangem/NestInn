import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./register.css";

const API_URL = "https://nestinn.onrender.com/api";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    country: "",
    city: "",
    phone: "",
    img: null, // File object
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, img: e.target.files[0] }); // Store file object
  };

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/davlb41px/image/upload", 
        data, {withCredentials: true}
      );
      return res.data.secure_url; // Returns the uploaded image URL
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (formData.img) {
      imageUrl = await uploadToCloudinary(formData.img);
      if (!imageUrl) {
        setError("Image upload failed. Please try again.");
        return;
      }
    }

    try {
      const userData = {
        ...formData,
        img: imageUrl, // Store the Cloudinary image URL
      };

      await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { "Content-Type": "application/json" },
      }, {withCredentials:true});

      alert("Registered succesfully!");

      navigate("/login"); 
    } catch (err) {
      setError(err.response?.data || "Something went wrong.");
    }
  };

  return (
    <div className="register">
      <div className="rContainer">
        <h2 className="rTitle">Register User</h2>

        <form onSubmit={handleSubmit} className="rForm">
        
          <div className="rColumn">
            <div className="rGroup">
              <label className="rLabel" htmlFor="username">Username</label>
              <input type="text" id="username" onChange={handleChange} className="rInput" required placeholder="username"/>
            </div>

            <div className="rGroup">
              <label className="rLabel" htmlFor="email">Email</label>
              <input type="email" id="email" onChange={handleChange} className="rInput" required placeholder="username@gmail.com" />
            </div>

            <div className="rGroup">
              <label className="rLabel" htmlFor="password">Password</label>
              <input type="password" id="password" onChange={handleChange} className="rInput" required placeholder="password" />
            </div>
          </div>

         
          <div className="rColumn">
            <div className="rGroup">
              <label className="rLabel" htmlFor="country">Country</label>
              <input type="text" id="country" onChange={handleChange} className="rInput" required placeholder="country"  />
            </div>

            <div className="rGroup">
              <label className="rLabel" htmlFor="city">City</label>
              <input type="text" id="city" onChange={handleChange} className="rInput" required placeholder="city"  />
            </div>

            <div className="rGroup">
              <label className="rLabel" htmlFor="phone">Phone</label>
              <input type="text" id="phone" onChange={handleChange} className="rInput" required placeholder="+912345678956"  />
            </div>
          </div>

        
          <div className="rFullWidth">
            <div className="rGroup">
              <label className="rLabel" htmlFor="img">Profile Image (Optional)</label>
              <input type="file" id="img" onChange={handleFileChange} />
            </div>

            <button type="submit" className="rButton">Register</button>
          </div>
        </form>

        <p>Already have an account? <Link to="/login" className="loginLink">Login here</Link></p>
        {error && <span className="errorMessage">{error}</span>}
      </div>
    </div>
  );
};

export default Register;
