import { Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useCookies } from "react-cookie";
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";
import Loader from "../../layout/Loader/Loader";
import Server from "./Server/Server";

// Stylng
import "./Servers.css";

const Commands = () => {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cookies] = useCookies(0);

  useEffect(() => {
    if (!cookies?.session) return window.location.replace("/oauth/login");

    fetch("/api/users/@me/guilds?selectManageable=true")
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) window.location.replace("/oauth/login");
        setGuilds(res.data);
        setLoading(false);
      })
      .catch((err) => {});
  }, []);

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
          <Loader active={loading} coverAllPage={false} />
          {guilds.map((guild) => {
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
