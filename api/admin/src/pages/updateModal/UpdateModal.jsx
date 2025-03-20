import React, { useEffect, useState } from "react";
import axios from "axios";
import "./updateModal.scss";

const API_URL = "https://nestinn.onrender.com/api";

const UpdateModal = ({ isOpen, onClose, rowData, apiPath, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (rowData) {
      setFormData(rowData);
    }
  }, [rowData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Upload image to Cloudinary
  const uploadImage = async () => {
    if (!selectedFile) return formData.img; // Keep existing image if no new one is selected

    const imageFormData = new FormData(); // Renamed local variable
    imageFormData.append("file", selectedFile);
    imageFormData.append("upload_preset", "upload"); // Cloudinary Upload Preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/davlb41px/image/upload", // Replace with your Cloudinary cloud name
        imageFormData
      );

      return response.data.secure_url; // Return uploaded image URL
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      alert("Image upload failed!");
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let imageUrl = await uploadImage();
    try {
      const updatedData = { ...formData, img: imageUrl || formData.img };
      const token = localStorage.getItem("access_token"); // Get token separately
  
      await axios.put(
        `${API_URL}/${apiPath}/${rowData._id}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` }, // Attach token
          withCredentials: true,
        }
      );
  
      alert("Update successful!");
      onUpdateSuccess(updatedData);
      onClose();
    } catch (err) {
      console.error("Error updating data:", err);
      alert("Update failed!");
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <h2>Update {apiPath.slice(0, -1)}</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(rowData || {}).map((field) =>
            !["password", "createdAt", "updatedAt","isAdmin", "_id", "__v", "photos", "rooms", "featured", "roomNumbers", "hotelId"].includes(field) ? ( // Exclude specific fields
              <div className="formGroup" key={field}>
                <label>{field}:</label>
                {field === "img" ? (
                  <>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {formData.img && <img src={formData.img} alt="Preview" width="100" />}
                  </>
                ) : (
                  <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} required />
                )}
              </div>
            ) : null
          )}
          <div className="modalButtons">
            <button type="submit" className="updateBtn">Update</button>
            <button type="button" className="cancelBtn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
