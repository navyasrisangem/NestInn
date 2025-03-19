import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import "./reserve.css";
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Reserve = ({ setOpen, hotelId }) => {
  const [selectedRooms, setSelectedRooms] = useState([]);
  const { data} = useFetch(`${API_URL}/hotels/room/${hotelId}`);
  const { dates } = useContext(SearchContext);

  const getDatesInRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const date = new Date(start.getTime());

    const dates = [];

    while (date <= end) {
      dates.push(new Date(date).getTime());
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const alldates = getDatesInRange(dates[0].startDate, dates[0].endDate);

  const isAvailable = (roomNumber) => {
    const isFound = roomNumber.unavailableDates.some((date) =>
      alldates.includes(new Date(date).getTime())
    );
    return !isFound;
  };

  const handleSelect = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    setSelectedRooms(
      checked
        ? [...selectedRooms, value]
        : selectedRooms.filter((item) => item !== value)
    );
  };

  const navigate = useNavigate();

  const handleClick = async () => {
    // console.log("Selected Rooms:", selectedRooms);
    // console.log("Start Date:", dates[0]?.startDate);
    // console.log("End Date:", dates[0]?.endDate);
    if (selectedRooms.length === 0) {
      alert("Please select at least one room before reserving.");
      return;
    }
  
    // Get the latest dates to avoid stale state issue
    const latestStartDate = new Date(dates[0]?.startDate);
    const latestEndDate = new Date(dates[0]?.endDate);
  
    if (!dates[0]?.endDate || latestEndDate.getTime() <= latestStartDate.getTime()) {
      alert("Please select a valid check-out date before reserving. Redirecting to hotels page...");
      
      // **Force a state update in SearchContext to store the latest selected dates**
      navigate("/hotels");
      return;
    }
    try {
      await Promise.all(
        selectedRooms.map((roomId) => {
          const res = axios.put(`${API_URL}/rooms/availability/${roomId}`, {
            dates: alldates,
          });
          return res.data;
        })
      );
      setOpen(false);
      alert("Yay! Your room is reserved");
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="reserve">
      <div className="rContainer">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="rClose"
          onClick={() => setOpen(false)}
        />
        <h2 className="rTitle">Select Your Rooms</h2>
        {data.map((item) => (
          <div className="rItem" key={item._id}>
            <div className="rItemInfo">
              <div className="rItemTitle">{item.title}</div>
              <div className="rItemDesc">{item.desc}</div>
              <div className="rItemMax">
                Max people: <b>{item.maxPeople}</b>
              </div>
              <div className="rItemPrice">Rs {item.price} per night</div>
            </div>
            <div className="rSelectRooms">
              {item.roomNumbers.map((roomNumber) => (
                <div className="room" key={roomNumber._id}>
                  <label>{roomNumber.number}</label>
                  <input
                    type="checkbox"
                    value={roomNumber._id}
                    onChange={handleSelect}
                    disabled={!isAvailable(roomNumber)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleClick}
          className="rButton"
        > Reserve
        </button>
      </div>
    </div>
  );
};

export default Reserve;