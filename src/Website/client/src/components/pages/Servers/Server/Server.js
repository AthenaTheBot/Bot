import { Link } from "react-router-dom";

// Styling
import "./Server.css";

const Server = ({ icon, name, id, available }) => {
  return (
    <div className="server">
      <img src={icon || "/assets/images/default.png"} alt={name || "Server"} />
      <h4>{name.length > 10 ? name.slice(0, 10) + ".." : name}</h4>
      {available ? (
        <Link className="server-btn" to={"/dashboard/" + id + "/general"}>
          Go to Dashboard
        </Link>
      ) : (
        <a
          className="server-btn"
          href="/invite"
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundColor: "gray" }}
        >
          Invite Athena
        </a>
      )}
    </div>
  );
};

export default Server;
