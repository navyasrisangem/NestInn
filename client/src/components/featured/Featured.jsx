import "./featured.css";
import useFetch from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Featured = () => {
    const navigate = useNavigate();
    const { data, loading } = useFetch(
      `${API_URL}/hotels/countByCity?cities=Hyderabad,Bangalore,Mumbai`
    );
    
  
    // Handle city click
    const handleClick = (city) => {
      navigate("/hotels", {
        state: {
          destination: city, 
          dates: [{ startDate: new Date(), endDate: new Date(), key: 'selection' }], 
          options: { adult: 1, children: 0, room: 1 },
        },
      });
    };

    return (
        <div className="featured">
            {loading ? (
                "Loading..."
            ) : (
                <>
                    <div className="featuredItem" onClick={() => handleClick("Hyderabad")}>
                        <img src="../../../images/hyderabad.png" alt="hyderabad" className="featuredImg" />
                        <div className="featuredTitles">
                            <h1>Hyderabad</h1>
                            <h2>{data[0]} properties</h2>
                        </div>
                    </div>

                    <div className="featuredItem" onClick={() => handleClick("Bangalore")}>
                        <img src="../../../images/bangalore.png" alt="bangalore" className="featuredImg" />
                        <div className="featuredTitles">
                            <h1>Bangalore</h1>
                            <h2>{data[1]} properties</h2>
                        </div>
                    </div>

                    <div className="featuredItem" onClick={() => handleClick("Mumbai")}>
                        <img src="../../../images/mumbai.png" alt="mumbai" className="featuredImg" />
                        <div className="featuredTitles">
                            <h1>Mumbai</h1>
                            <h2>{data[2]} properties</h2>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Featured;
