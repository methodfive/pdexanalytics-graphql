import {isEmpty} from "../util.js";

export const transformExchangeDaily = item => {
  if(isEmpty(item))
    return;

  return {
    d: (item.stat_date != null) ? (item.stat_date).getTime() : null,
    tv: item.tvl,
    v: item.volume,
    u: item.users,
    f: item.new_total_fees || item.total_fees,
    nu: item.new_users,
    t: item.trades,
    s: item.total_staked,
    sv: item.staked_tvl,
    h: item.total_holders,
    str: item.total_stakers,
    tb: item.treasury_balance,
    tt: item.treasury_tvl,
    ti: item.total_issuance
  };
};
