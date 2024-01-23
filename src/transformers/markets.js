import {isEmpty} from "../util.js";

export const transformMarkets = item => {
  if(isEmpty(item))
    return;

  return {
    b: {
      __typename: "Asset",
      i: item.base_asset_id,
      n: item.base_name,
      s: item.base_symbol},
    q: {
      __typename: "Asset",
      i: item.quote_asset_id,
      n: item.quote_name,
      s: item.quote_symbol},
    t: item.trades,
    v: item.volume,
    pt: item.previous_trades,
    pv: item.previous_volume
  };
};
