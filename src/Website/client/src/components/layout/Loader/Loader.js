import { useEffect } from "react";

// Styling
import "./Loader.css";

const Loader = ({ active, coverAllPage, loaderMsg }) => {
  useEffect(() => {
    if (!active) {
      document.getElementById("loader").classList.add("loader-disabled");
      setTimeout(() => {
        document.getElementById("loader").classList.add("disabled");
      }, 610);
    } else {
      document.getElementById("loader").classList.remove("loader-disabled");
    }

    if (coverAllPage) {
      document.getElementById("loader").classList.add("cover");
    } else {
      document.getElementById("loader").classList.remove("cover");
    }
  });

  return (
    <div id="loader">
      <div className="spinner">
        <div className="bounce1"></div>
        <div className="bounce2"></div>
        <div className="bounce3"></div>
        <p>{loaderMsg ? loaderMsg : "Sit tight! We are getting there.."}</p>
      </div>
    </div>
  );
};

export default Loader;
