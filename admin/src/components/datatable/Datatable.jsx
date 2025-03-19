import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useState, useEffect,useContext } from "react";
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import axios from "axios";
import UpdateModal from "../../pages/updateModal/UpdateModal";
import { AuthContext } from "../../context/AuthContext"; 

const API_URL = process.env.REACT_APP_API_URL;

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const { data} = useFetch(`${API_URL}/${path}`);

  const { fetchUserData } = useContext(AuthContext);  //  Trigger client update

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);


  const handleUpdate = async (updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/${path}/${updatedData._id}`, updatedData, {
        withCredentials: true,
      });

      setList((prevList) =>
        prevList.map((item) => (item._id === updatedData._id ? res.data : item))
      );

      alert(`${path.slice(0, -1)} updated successfully!`);

      //  Trigger re-fetch of client data
      if (fetchUserData) {
        fetchUserData();
      }

      setSelectedItem(null); // Close modal
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

  const handleDelete = async (id, hotelId = null) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (path === "rooms" && !hotelId) {
        alert("Hotel ID is required to delete a room!");
        return;
      }


      const endpoint = hotelId
        ? `${API_URL}/rooms/${id}/${hotelId._id}`  // Room deletion
        : `${API_URL}/${path}/${id}`;          // User or Hotel deletion

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setList(prevList => prevList.filter(item => item._id !== id));  // Remove from UI

      alert(`${path.slice(0, -1)} deleted successfully!`);

       //  Trigger re-fetch of client data
       if (fetchUserData) {
        fetchUserData();
      }
    } catch (err) {
      console.error("Delete error:", err);
      const message = err.response?.data?.message || "Deletion failed! Check console for details.";
      alert(message);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        // console.log("Row data:", params.row);   
        return (
          <div className="cellAction">
            <div
              className="updateButton"
              onClick={(e) => {
                e.stopPropagation();  //  Prevents row selection
                setSelectedItem(params.row);  // Open modal with row data
              }}
            >
              Update
            </div>
            <div
              className="deleteButton"
              onClick={(e) => {
                e.stopPropagation();  
                handleDelete(params.row._id, params.row.hotelId);
              }}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list || []}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={row => row._id}
        hideFooter
      />

      {selectedItem && (
        <UpdateModal
          isOpen={!!selectedItem}  // Ensure modal opens
          onClose={() => setSelectedItem(null)}
          rowData={selectedItem}  // Correct prop name
          apiPath={path}  // Pass API path dynamically
          onUpdateSuccess={handleUpdate}  // Update UI after success
        />
      )}

    </div>
  );
};

export default Datatable;
