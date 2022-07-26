import * as React from "react";
import { useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import "./app.css";
import Register from "./components/Register";
import Login from "./components/Login";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoicHJpeWFua2siLCJhIjoiY2w1djN4Nmk2MDV5NTNrbWlob2o0Y3JzaiJ9.etx6YubOjBXBBhCc1-G9hA";

function App() {
  //const currentUser = "Rohan";
  const myStorage = window.localStorage;
  const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [showAll, setShowAll] = useState(true);
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "100vh",
    latitude: 19,
    longitude: 72,
    zoom: 3,
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long });
  };

  // Want to add PIN
  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  //
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      console.log(newPin);
      const res = await axios.post("/api/pins", newPin);
      console.log(res);

      setPins([...pins, res.data]);
      return;
    } catch (err) {
      console.log(err);
      return;
    }
  };

  const handleLogOut = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  React.useEffect(() => {
    const getPins = async () => {
      try {
        const allPins = await axios.get("/api/pins");
        setPins(allPins.data);
        console.log("Loded Pins");
        return;
      } catch (err) {
        console.log(err);
        return;
      }
    };
    getPins();
  }, []);

  return (
    <>
      <ReactMapGL
        {...viewport}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/zapdos/cl1hom06y000m14o3g1lwwzqo"
        onDblClick={handleAddClick}
      >
        {pins
          .filter((p) => {
            return showAll || p.username === currentUser;
          })
          .map((p) => (
            <>
              <Marker
                latitude={p.lat}
                longitude={p.long}
                offsetLeft={-3.5 * viewport.zoom}
                offsetTop={-7 * viewport.zoom}
              >
                <Room
                  style={{
                    fontSize: viewport.zoom * 7,
                    color: p.username === currentUser ? "slateblue" : "red",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                />
              </Marker>
              {p._id === currentPlaceId && (
                <Popup
                  latitude={p.lat}
                  longitude={p.long}
                  closeButton={true}
                  closeOnClick={false}
                  anchor="left"
                  onClose={() => {
                    setCurrentPlaceId(null);
                  }}
                >
                  <div className="card">
                    <label>Place </label>
                    <h4 className="place"> {p.title}</h4>
                    <label>Review </label>
                    <p className="desc"> {p.desc}</p>
                    <label>Rating </label>

                    <div className="stars">
                      {Array(p.rating).fill(<Star className="star" />)}
                      {Array(5 - p.rating).fill(<Star />)}
                    </div>

                    <label>Information </label>
                    <span className="username">
                      created by <b> {p.username}</b>{" "}
                    </span>
                    <span className="date"> {format(p.createdAt)}</span>
                  </div>
                </Popup>
              )}
            </>
          ))}

        {/* New location functions */}

        {newPlace && (
          <Popup
            latitude={newPlace.lat}
            longitude={newPlace.long}
            closeButton={true}
            closeOnClick={false}
            anchor="left"
            onClose={() => {
              setNewPlace(null);
            }}
          >
            <div>
              <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input
                  placeholder="Enter a title"
                  autoFocus
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label>Description</label>
                <textarea
                  placeholder="Say us something about this place."
                  onChange={(e) => setDesc(e.target.value)}
                />
                <label>Rating</label>
                <select onChange={(e) => setStar(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
                <button type="submit" className="submitButton">
                  Add Pin
                </button>
              </form>
            </div>
          </Popup>
        )}

        {currentUser ? (
          <div className="buttons">
         <button className="login" onClick={()=>{
          showAll ? setShowAll(false) : setShowAll(true)
         }} >
              Show MINE
          </button>
          <button className="register" onClick={handleLogOut}>
            {" "}
            Log out
          </button>
          
          </div>
        ) : (
          <div className="buttons">
            <button
              className="login"
              onClick={() => {
                setShowLogin(true);
              }}
            >
              Log In
            </button>
            <button
              className="register"
              onClick={() => {
                setShowRegister(true);
              }}
            >
              Register
            </button>
          </div>
        )}

        {showRegister && <Register setShowRegister={setShowRegister} />}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
          />
        )}
      </ReactMapGL>
    </>
  );
}
export default App;
