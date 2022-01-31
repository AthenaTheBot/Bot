// Modules
import dayjs from "dayjs";

// Classes
import Utils from "./Utils";

class Logger {
  readonly defaultTag: string;
  readonly successTag: string;
  readonly warnTag: string;
  readonly errorTag: string;

  private utils: Utils;

  constructor(dTag?: string, stag?: string, wtag?: string, etag?: string) {
    if (dTag) this.defaultTag = dTag;
    else this.defaultTag = " LOG ".bgWhite.black;

    if (stag) this.successTag = stag;
    else this.successTag = " SUCCESS ".bgGreen.black;

    if (wtag) this.warnTag = wtag;
    else this.warnTag = " WARN ".bgYellow.black;

    if (etag) this.errorTag = etag;
    else this.errorTag = " ERROR ".bgRed.black;

    this.utils = new Utils();
  }

  // TODO: $bold, $color string modifiers.
  private _log(tag: string, msg: string) {
    const date = dayjs(Date.now()).format("DD/MM/YYYY hh:mm");
    console.log(`[${date}] ${tag} ${msg}`);
  }

  log(msg: string) {
    this._log(this.defaultTag, msg);
  }

  success(msg: string) {
    this._log(this.successTag, msg);
  }

  warn(msg: string) {
    this._log(this.warnTag, msg);
  }

  error(msg: string | Error) {
    if (msg instanceof Error) msg = this.utils.parseError(msg);
    this._log(this.errorTag, msg);
  }
}

export default Logger;
