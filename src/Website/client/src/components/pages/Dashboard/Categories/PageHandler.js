import { Fragment } from "react";

// Other Copms
import General from "./General/General";
import ComingSoon from "./Coming Soon/ComingSoon";

const PageHandler = ({
  activePage,
  pushAlert,
  removeAlert,
  guild,
  guildData,
  setElements,
}) => {
  switch (activePage.toLowerCase()) {
    case "general":
      return (
        <Fragment>
          <General
            setElements={setElements}
            pushAlert={pushAlert}
            removeAlert={removeAlert}
            guild={guild}
            guildData={guildData}
          />
        </Fragment>
      );

    default:
      return (
        <Fragment>
          <ComingSoon
            setElements={setElements}
            pushAlert={pushAlert}
            removeAlert={removeAlert}
            guild={guild}
            guildData={guildData}
          />
        </Fragment>
      );
  }
};

export default PageHandler;
