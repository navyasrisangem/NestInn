import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";


const Home = () => {

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="info">Click on the Sidebar lists to get the Users, Hotels or Rooms</div>
      </div>
    </div>
  );
};

export default Home;
