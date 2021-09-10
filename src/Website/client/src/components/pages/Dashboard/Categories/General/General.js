import { useState, useEffect } from "react";

// Other Comps
import InputText from "../../../../layout/Input/InputText/InputText";
import InputSelect from "../../../../layout/Input/InputSelect/InputSelect";

// Styling
import "./General.css";

let finished = false;
const General = ({ pushAlert, guild, guildData, setElements }) => {
  const [languages, setLanguages] = useState([
    { active: true, content: "English", id: "en-US" },
    { active: false, content: "Türkçe", id: "tr-TR" },
  ]);

  const [prefix, setPrefix] = useState("at!");

  useEffect(() => {
    if (guildData?.preferences?.prefix && !finished) {
      const langs = languages;

      for (var i = 0; i < langs.length; i++) {
        if (guildData?.preferences?.language === undefined) {
          break;
        }
        if (langs[i].id === guildData?.preferences?.language)
          langs[i].active = true;
        else langs[i].active = false;
      }

      setLanguages(langs);
      setPrefix(guildData?.preferences?.prefix);

      setElements([
        { name: "prefix", element: "#prefix-input", value: null, setFunc: setPrefix },
        { name: "language", element: "#language-input", value: null, setFunc: null },
      ]);

      finished = true;
    }
  });

  return (
    <div className="dash-contnet-general">
      <div className="dash-general-container">
        <h2>Server Prefix</h2>
        <p>Change Athena's current prefix on your server.</p>
        <hr />
        <p className="dash-input-head">Set prefix</p>
        <input
          className="athena-input-text"
          id="prefix-input"
          value={prefix}
          placeholder="Write your custom prefix."
          onChange={(e) => {
            setPrefix(e.currentTarget.value);
            pushAlert();
          }}
        />
      </div>

      <div className="dash-general-container">
        <h2>Server Language</h2>
        <p>
          Change Athena's language on your server. Currently 2 languages are
          availabe.
        </p>
        <hr />
        <p className="dash-input-head">Set Language</p>
        <InputSelect
          onChange={pushAlert}
          id="language-input"
          options={languages}
        />
      </div>
    </div>
  );
};

export default General;
