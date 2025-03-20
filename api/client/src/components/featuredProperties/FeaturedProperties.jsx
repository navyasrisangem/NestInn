import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";
import { useNavigate } from "react-router-dom";

const API_URL = "https://nestinn.onrender.com/api";

const FeaturedProperties = () => {
  const navigate = useNavigate();
  const { data, loading} = useFetch(`${API_URL}/hotels?featured=true&limit=4`);

  const handleClick = (hotelId) => {
    navigate(`/hotels/${hotelId}`);
  };

  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        <>
          {data.map((item) => (
            <div className="fpItem" key={item._id} onClick={() => handleClick(item._id)}>
              <img
                src={item.photos[0]}
                alt=""
                className="fpImg"
              />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from Rs {item.cheapestPrice}</span>
              {item.rating && <div className="fpRating">
                <button>{item.rating}</button>
                <span>Excellent</span>
              </div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
