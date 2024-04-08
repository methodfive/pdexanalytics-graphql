export const typeDefs = `
  type Asset {
     i: String!
     n: String
     s: String
     p: String
     t: String
     pp: String
     pt: String
     tr: String
     v: String
     ptr: String
     pv: String
     b: String
     pb: String
  }
  
  type Market {
     b: Asset!
     q: Asset!
     t: String
     v: String
     pt: String
     pv: String
  }
  
  type Trade {
    i: String!
    b: Asset!
    q: Asset!
    p: String!
    qu: String
    v: String
    t: String
  }
  
  type QuickStats {
    o: String
    po: String
    s: String
    ps: String
    st: String
    pst: String
    v: String
    pv: String
    t: String
    pt: String
    u: String
    pu: String
    nu: String
    pnu: String
    h: String
    str: String
    ph: String
    pstr: String
    tb: String
    tt: String
    ptb: String
    ptt: String
    ti: String
    pti: String
    f: String
    pf: String
  }
  
  type ExchangeDaily {
    d: String
    tv: String
    v: String
    f: String
    u: String
    nu: String
    t: String
    s: String
    sv: String
    h: String
    str: String
    tb: String
    tt: String
    ti: String
  }
  
  type AssetDaily {
     d: String!
     a: Asset!
  }
  
  type MarketDaily {
     d: String!
     m: Market!
  }

  type Query {
    quickStats: QuickStats,
    exchangeDaily: [ExchangeDaily],
    exchangeAllTime: ExchangeDaily,
    markets: [Market],
    assets: [Asset],
    market(baseAssetID: String, quoteAssetID: String): Market,
    asset(assetID: String!): Asset,
    assetDaily(assetID: String!): [AssetDaily],
    marketDaily(baseAssetID: String!, quoteAssetID: String!): [MarketDaily],
    trades: [Trade],
  }
`;