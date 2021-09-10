import { useEffect } from "react";
import { Button } from "react-bootstrap";
import $ from "jquery";

// Styling
import "./ChangeAlert.css";

const ChangeAlert = ({ active, elementsToSave, guildID, guild, guildData, updateAlert, updateGuildData }) => {

  let loading = false;
  let payload = {
    guild: guildID,
  };

  useEffect(() => {
    if (!active) $(".change-alert").addClass("disabled");
    else $(".change-alert").removeClass("disabled");
  });

  const disableAlert = () => {
    $(".change-alert").addClass("change-alert-closing-anim");

    setTimeout(() => {
      $(".change-alert").removeClass("change-alert-closing-anim");
      updateAlert(false);
    }, 700);
  }

  const saveChanges = async function () {
    if (loading) return;
    loading = true;

    $("#change-alert-reset").addClass("disabled");

    $(".change-alert-btn-sign").addClass("disabled");
    $(".change-alert-btn-loader").removeClass("disabled");

    for (var i = 0; i < elementsToSave.length; i++) {
      let value = $(elementsToSave[i].element).text();
      if (value.length === 0) value = $(elementsToSave[i].element).val();

      payload[elementsToSave[i].name] = value;
    }

    fetch("/api/guilds/" + guildID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status === 200) {
          await updateGuildData();
          $("#change-alert-reset").removeClass("disabled");
          $(".change-alert-btn-sign").removeClass("disabled");
          $(".change-alert-btn-loader").addClass("disabled");
          disableAlert();
        } else {
          $("#change-alert-save").addClass('change-alert-error-background');
          $(".change-alert").addClass('change-alert-error-border');

          setTimeout(() => {
            resetChanges();
            setTimeout(() => {
              $("#change-alert-reset").removeClass("disabled");
              $(".change-alert-btn-sign").removeClass("disabled");
              $(".change-alert-btn-loader").addClass("disabled");
              
              $("#change-alert-save").removeClass('change-alert-error-background');
              $(".change-alert").removeClass('change-alert-error-border');
            }, 700)
          }, 1100)
        }
      })
      .catch((err) => {});
  };

  const languages = [
    { active: true, content: "English", id: "en-US" },
    { active: false, content: "Türkçe", id: "tr-TR" },
  ]

  const resetChanges = () => {
    elementsToSave.forEach(e => {
      if (e.name == 'language') {
        const lang = languages.find(x => x.id == guildData.easyAccess.language);
        $(e.element).text(lang.content);
        $(e.element).val(lang.content);
      }
      else {

        if (e.setFunc) {

          e.setFunc(guildData.easyAccess[e.name]);
        }
        else {

          $(e.element).text(guildData.easyAccess[e.name]);
          $(e.element).val(guildData.easyAccess[e.name]);
        }
      }
    })

    disableAlert();
  };

  return (
    <div className="change-alert">
      <p>Be careful! You have unsaved changes.</p>
      <div className="change-alert-buttons">
        <Button id="change-alert-reset" className="change-alert-btn btn-transparent">
          <p className="change-alert-btn-sign" onClick={resetChanges}>Reset Changes</p>
        </Button>
        <Button id="change-alert-save" className="change-alert-btn">
          <p className="change-alert-btn-sign" onClick={saveChanges}>
            Save Changes
          </p>
          <div className="change-alert-btn-loader disabled">
            <div className="change-alert-bubble bubble-1"></div>
            <div className="change-alert-bubble bubble-2"></div>
            <div className="change-alert-bubble bubble-3"></div>
            <div className="change-alert-bubble bubble-4"></div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default ChangeAlert;
