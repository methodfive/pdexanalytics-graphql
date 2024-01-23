import {isEmpty} from "../util.js";
import {transformMarkets} from "./markets.js";
import {transformAssets} from "./assets.js";

export const transformAssetDaily = item => {
  if(isEmpty(item))
    return;

  return {
    d: (item.stat_date).getTime(),
    a: transformAssets(item)
  };
};
