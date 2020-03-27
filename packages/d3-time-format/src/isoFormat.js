import {utcFormat} from "./defaultLocale.js";

/** ISO标准的时间格式directive */
export var isoSpecifier = "%Y-%m-%dT%H:%M:%S.%LZ";

function formatIsoNative(date) {
  return date.toISOString();
}

var formatIso = Date.prototype.toISOString
    ? formatIsoNative
    : utcFormat(isoSpecifier);

export default formatIso;
