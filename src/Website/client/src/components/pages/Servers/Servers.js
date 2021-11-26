import { Fragment, useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Cookie from "js-cookie";
import userContext from "../../../context/user/userContext";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";
import Loader from "../../layout/Loader/Loader";
import Server from "./Server/Server";

// Stylng
import "./Servers.css";

const Commands = () => {
  const { user, userServers, getUserServers } = useContext(userContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userServers) return setLoading(false);

    const session = Cookie.get("session");

    if (!user && !session)
      return window.location.replace("/oauth/login?redirect=dashboard");
    else if (!user && session) {
      // Wait
      getUserServers();
    }
  });

  return (
    <Fragment>
      <Helmet>
        <title>Servers - Athena</title>
      </Helmet>
      <Navbar activeElement="dashboard" />
      <div className="dash-server-container">
        <div className="dash-servers-head">
          <h1 style={{ color: "var(--primary-theme)" }}>Servers</h1>
          <p>Please choose a server to continue.</p>
        </div>
        <div className="dash-servers-main">
          <Loader
            active={loading}
            loaderMsg="Fetcing your servers.."
            coverAllPage={false}
          />
          {userServers?.map((guild) => {
            return (
              <Server
                id={guild.id}
                name={guild.name}
                icon={guild.icon || "/assets/images/default.png"}
                available={guild.available}
              />
            );
          })}
        </div>
      </div>
      <Footer />
    </Fragment>
  );
};

export default Commands;
