import {isEmpty} from "../util.js";

export const transformTrade = item => {
  if(isEmpty(item))
    return;

  return {
    i: item.trade_id,
    b: {
      __typename: "Asset",
      i: item.base_asset_id,
      s: item.base_symbol
    },
    q: {
      __typename: "Asset",
      i: item.quote_asset_id,
      s: item.quote_symbol
    },
    p: item.price,
    qu: item.quantity,
    v: item.volume,
    t: item.timestamp
  };
};
