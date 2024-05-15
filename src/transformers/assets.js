import {isEmpty} from "../util.js";

export const transformAssets = item => {
  if(isEmpty(item))
    return;

  return {
    i: item.asset_id,
    n: isEmpty(item.real_name) ? item.name : item.real_name,
    s: item.symbol,
    p: item.price,
    t: item.tvl,
    b: item.balance,
    pb: item.previous_balance,
    pp: item.previous_price,
    pt: item.previous_tvl,
    tr: item.trades,
    v: item.volume,
    ptr: item.previous_trades,
    pv: item.previous_volume
  };
};
