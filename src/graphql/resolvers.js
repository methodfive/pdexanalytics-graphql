import {getExchangeDaily, getQuickStats} from "../resolvers/exchangeStats.js";
import {getMarket, getMarketDaily, getMarkets} from "../resolvers/markets.js";
import {getAsset, getAssetDaily, getAssets} from "../resolvers/assets.js";
import {getTrades} from "../resolvers/trades.js";

export const resolvers = {
  Query: {
    quickStats(obj, args, context, info) {
      return getQuickStats();
    },

    exchangeDaily(obj, args, context, info) {
      return getExchangeDaily();
    },

    markets(obj, args, context, info) {
      return getMarkets();
    },
    market(obj, args, context, info) {
      if(args == null)
        return;
      return getMarket(args.baseAssetID, args.quoteAssetID);
    },
    marketDaily(obj, args, context, info) {
      if(args == null)
        return;
      return getMarketDaily(args.baseAssetID, args.quoteAssetID);
    },

    assets(obj, args, context, info) {
      return getAssets();
    },
    asset(obj, args, context, info) {
      if(args == null)
        return;
      return getAsset(args.assetID);
    },
    assetDaily(obj, args, context, info) {
      if(args == null)
        return;
      return getAssetDaily(args.assetID);
    },

    trades(obj, args, context, info) {
      return getTrades();
    }
  }
};
