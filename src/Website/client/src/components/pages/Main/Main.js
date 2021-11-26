import { Helmet } from "react-helmet";

// Other Comp
import Navbar from "../../layout/Navbar/Navbar";
import Footer from "../../layout/Footer/Footer";

// Context
import dashCtx from "../../../context/user/userContext";

// Styling
import "./Main.css";

const Main = () => {
  return (
    <div className="athena-main">
      <Helmet>
        <title>Athena - The Discord Bot</title>
      </Helmet>
      <Navbar activeElement="home" />
      <header>
        <div className="headMsg">
          <h1>
            A Discord Bot that can fulfill your server needs for{" "}
            <span style={{ color: "var(--primary-theme)" }}>FREE</span>
          </h1>
          <p>
            Athena is a multi-functional discord bot that offers many services
            for free such as playing any song you desire or making moderation of
            your server easier.
          </p>
        </div>
      </header>
      <main>
        <div className="features">
          <div className="feature">
            <div id="feature_music" className="featureContent">
              <img src="/assets/images/feature_music.svg" alt="Music" />
              <div className="feature_desc">
                <h1>Music</h1>
                <p>
                  Athena has a powerful music module which you can listen to
                  music from Youtube and Spotify.
                </p>
              </div>
            </div>
          </div>
          <div className="feature">
            <div id="feature_moderation" className="featureContent">
              <img src="/assets/images/feature_moderation.svg" alt="Music" />
              <div className="feature_desc">
                <h1>Moderation</h1>
                <p>
                  With Athena's big range of moderation commands you can
                  moderate your server easily and quickly!
                </p>
              </div>
            </div>
          </div>
          <div className="feature">
            <div id="feature_fun" className="featureContent">
              <img src="/assets/images/feature_fun.svg" alt="Music" />
              <div className="feature_desc">
                <h1>Fun</h1>
                <p>
                  Do you like fun commands such as magik ? Because we do and we
                  put some fun commands to Athena that you may love such as
                  mimic command!
                </p>
              </div>
            </div>
          </div>
          <div className="feature">
            <div id="feature_misc" className="featureContent">
              <img src="/assets/images/feature_misc.svg" alt="Music" />
              <div className="feature_desc">
                <h1>Misc</h1>
                <p>
                  Other commands that we couldn't put in a section such as
                  fortnite stats or weather forecast.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer>
        <div className="question">
          <h1>Ready to try Athena?</h1>
          <a href="/invite" className="btn-main">
            Invite Athena!
          </a>
        </div>
      </footer>
      <Footer />
    </div>
  );
};

export default Main;
