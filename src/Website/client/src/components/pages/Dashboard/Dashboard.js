import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FiChevronUp, FiTerminal } from "react-icons/fi";
import { VscMenu } from "react-icons/vsc";
import { Helmet } from "react-helmet";
import $ from "jquery";
import { Link } from "react-router-dom";

// Other Comps
import PageHandler from "./Categories/PageHandler";
import Profile from "../../layout/Navbar/Profile/Profile";
import Loader from "../../layout/Loader/Loader";
import ChangeAlert from "../../layout/ChangeAlert/ChangeAlert";

// Styling
import "./Dashboard.css";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [guild, setGuild] = useState([]);
  const [guildData, setGuildData] = useState({});
  const [page, setPage] = useState("General");
  const [alert, setAlert] = useState(false);
  const [elements, setElements] = useState([]);
  const validCategories = ["general", "autorole", "linkprotection", "player"];

  const { id, category } = useParams();

  const updateGuildData = () => {
    return new Promise((resolve, reject) => {
      fetch("/api/guilds/" + id)
        .then((res) => res.json())
        .then((res) => {
          if (!res.data) return;
          setGuildData({
            ...res.data,
            easyAccess: {
              prefix: res.data.preferences.prefix,
              language: res.data.preferences.language,
            },
          });
          resolve();
        })
        .catch((err) => {});
    });
  };

  useEffect(() => {
    if (validCategories.includes(category)) setPage(category);
    else {
      window.location.replace(`/dashboard/${id}/general`);
    }

    const toggleControlBar = () => {
      if ($(".dash-control").hasClass("dash-control-collapsed")) {
        $(".dash-control").removeClass("dash-control-collapsed");
      } else {
        $(".dash-control").addClass("dash-control-collapsed");
      }
    };

    $(".dash-category-title").on("click", function () {
      if ($(this).siblings().hasClass("disabled")) {
        $(this).siblings().removeClass("disabled");
        $(this).children().removeClass("dash-category-collapsed");
      } else {
        $(this).siblings().addClass("disabled");
        $(this).children().addClass("dash-category-collapsed");
      }
    });

    $("#dash-control-toggle").on("click", () => {
      toggleControlBar();
    });

    $(".dash-category-option").on("click", function () {
      const id = $(this).attr("data-id");
      setPage(id);
      $(".dash-category-option").removeClass("dash-category-active");
      $(this).addClass("dash-category-active");
      toggleControlBar();
    });

    if (!id || isNaN(id) || id.length !== 18)
      window.location.replace("/dashboard");

    fetch("/api/users/@me/guilds?selectManageable=true")
      .then((res) => res.json())
      .then((res) => {
        const guilds = res.data.filter((x) => x.available === true);

        let canManageAble = false;
        guilds.forEach((guild) => {
          if (guild.id === id) canManageAble = true;
        });
        if (!canManageAble) window.location.replace("/dashboard");

        const guild = res.data.find((x) => x.id === id);
        if (guild.name.length > 15)
          guild.display_name = guild.name.slice(0, 15) + "..";
        else guild.display_name = guild.name;

        setGuild(guild);
      })
      .catch((err) => {});

    fetch("/api/guilds/" + id)
      .then((res) => res.json())
      .then((res) => {
        if (!res.data) return;
        setGuildData({
          ...res.data,
          easyAccess: {
            prefix: res.data.preferences.prefix,
            language: res.data.preferences.language,
          },
        });
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      })
      .catch((err) => {});
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dash-container">
      <Helmet>
        <title>Dashboard - Athena</title>
      </Helmet>
      <Loader active={loading} coverAllPage={true} />
      <div className="dash-control dash-control-collapsed">
        <div className="dash-server">
          <img src={guild.icon || "/assets/images/default.png"} alt="Server" />
          <h2>{guild.display_name || "Server Name"}</h2>
          <div className="dash-server-stats">
            <p>
              <span className="dash-num">{guild.memberCount || "Unknown"}</span>
              &nbsp;Members
            </p>
            <p>
              <span className="dash-num">
                {guild.channelCount || "Unknown"}
              </span>
              &nbsp;Channels
            </p>
          </div>
          <div className="dash-categories">
            <ul className="dash-category">
              <p className="dash-category-title">
                Configuration{" "}
                <FiChevronUp className="dash-category-toggle-ico" />
              </p>
              <Link to="general">
                <li
                  className="dash-category-option dash-category-active"
                  data-id="general"
                >
                  <FiTerminal className="dash-ico" /> General
                </li>
              </Link>
            </ul>

            <ul className="dash-category">
              <p className="dash-category-title">
                Moderation <FiChevronUp className="dash-category-toggle-ico" />
              </p>
              <Link className="athena-dash-category-disabled">
                <li className="dash-category-option" data-id="autorole">
                  <FiTerminal className="dash-ico" /> Auto Role &nbsp;
                  <span className="athena-dash-badge">SOON</span>
                </li>
              </Link>
              <Link className="athena-dash-category-disabled">
                <li className="dash-category-option" data-id="linkprotection">
                  <FiTerminal className="dash-ico" /> Link Protection &nbsp;
                  <span className="athena-dash-badge">SOON</span>
                </li>
              </Link>
            </ul>

            <ul className="dash-category">
              <p className="dash-category-title">
                Music <FiChevronUp className="dash-category-toggle-ico" />
              </p>
              <Link className="athena-dash-category-disabled">
                <li className="dash-category-option" data-id="Player">
                  <FiTerminal className="dash-ico" /> Player &nbsp;
                  <span className="athena-dash-badge">SOON</span>
                </li>
              </Link>
            </ul>
            <br />
          </div>
        </div>
      </div>
      <div className="dash-main">
        <div className="dash-top-bar">
          <VscMenu id="dash-control-toggle" />
          <div className="dash-brand">
            <img src="/assets/images/logo.png" alt="Athena" />
          </div>
          <Profile
            drodpownOptions={[
              { url: "/dashboard", content: "Servers", reload: false },
            ]}
          />
        </div>
        <div className="dash-content">
          <PageHandler
            setElements={(arr) => {
              setElements(arr);
            }}
            guild={guild}
            guildData={guildData}
            activePage={page}
            pushAlert={() => {
              setAlert(true);
            }}
            removeAlert={() => {
              setAlert(false);
            }}
          />
        </div>

        <ChangeAlert
          updateAlert={setAlert}
          guildID={id}
          guild={guild}
          guildData={guildData}
          elementsToSave={elements}
          active={alert}
          updateGuildData={updateGuildData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
