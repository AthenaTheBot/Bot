import Helmet from "react-helmet";
import "./RickRoll.css";

function RickRoll() {
  return (
    <div className="athena-rickroll">
      <Helmet>
        <meta content="title" content="Source code of Athena." />
        <meta
          content="decription"
          content="Definitely the source code of Athena."
        />
        <meta property="og:title" content="Source code of Athena." />
        <meta
          property="og:description"
          content="Definitely the source code of Athena."
        />
        <title>:)</title>
      </Helmet>
      <h1>:)</h1>
      <iframe
        id="rick-roll-yt-player"
        src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&disablekb=1&loop=1"
        title="You have been rick rolled!"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  );
}

export default RickRoll;
