import {isEmpty} from "../util.js";
import {transformMarkets} from "./markets.js";

export const transformMarketsDaily = item => {
  return {
    d: (item.stat_date).getTime(),
    m: transformMarkets(item)
  };
};
