import {isEmpty} from "../util.js";

export const transformQuickStats24H = item => {
  if(isEmpty(item))
    return;

  return {
    o: item.tvl,
    po: item.previous_tvl,
    h: item.total_holders,
    ph: item.previous_total_holders,
    str: item.total_stakers,
    pstr: item.previous_total_stakers,
    u: item.users,
    pu: item.previous_users,
    nu: item.new_users,
    pnu: item.previous_new_users,
    s: item.staked_tvl,
    ps: item.previous_staked_tvl,
    st: item.total_staked,
    pst: item.previous_total_staked,
    t: item.trades,
    v: item.volume,
    pt: item.previous_trades,
    pv: item.previous_volume,
    tb: item.treasury_balance,
    tt: item.treasury_tvl,
    ptb: item.previous_treasury_balance,
    ptt: item.previous_treasury_tvl,
    ti: item.total_issuance,
    pti: item.previous_total_issuance,
    f: item.new_total_fees,
    pf: item.previous_new_total_fees
  };
};