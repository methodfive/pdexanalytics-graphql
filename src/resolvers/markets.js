import {getConnection, queryAsyncWithRetries, releaseConnection} from "./database.js";
import {transformMarkets} from "../transformers/markets.js";
import {isEmpty, isNumber} from "../util.js";
import {transformMarketsDaily} from "../transformers/marketsDaily.js";
import {getAssetsByMarketPair} from "./assets.js";
import {DB_RETRIES} from "../constants.js";

export async function getMarkets()
{
    console.log("getMarkets:");

    let connectionPool = null;
    let result = [];

    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select markets_24h.*, a1.name as base_name, a1.symbol as base_symbol, a2.name as quote_name, a2.symbol as quote_symbol 
from markets 
join assets a1 on a1.asset_id = markets.base_asset_id 
join assets a2 on a2.asset_id = markets.quote_asset_id 
join markets_24h on markets_24h.base_asset_id = markets.base_asset_id and markets_24h.quote_asset_id = markets.quote_asset_id 
order by volume desc`,
            null,
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result.push(transformMarkets(rows[i]));
                }
            },
            DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getmarkets",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}

export async function getMarket(baseAssetID, quoteAssetID)
{
    if(isEmpty(baseAssetID) || isEmpty(quoteAssetID))
        return;

    console.log("getMarket:", baseAssetID, quoteAssetID);

    let connectionPool = null;
    let result = {};

    try {
        connectionPool = await getConnection();

        if(!isNumber(baseAssetID) || !isNumber(quoteAssetID))
        {
            let newIDs = await getAssetsByMarketPair(connectionPool, baseAssetID, quoteAssetID);
            baseAssetID = newIDs.baseAssetID;
            quoteAssetID = newIDs.quoteAssetID;

            if(isEmpty(baseAssetID) || isEmpty(quoteAssetID))
                return;
        }

        await queryAsyncWithRetries(connectionPool,
            `
select markets_24h.*, a1.name as base_name, a1.symbol as base_symbol, a2.name as quote_name, a2.symbol as quote_symbol  
from markets 
join assets a1 on a1.asset_id = markets.base_asset_id 
join assets a2 on a2.asset_id = markets.quote_asset_id 
join markets_24h on markets_24h.base_asset_id = markets.base_asset_id and markets_24h.quote_asset_id = markets.quote_asset_id 
where markets.base_asset_id = ? && markets.quote_asset_id = ?`,
            [baseAssetID, quoteAssetID],
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result = transformMarkets(rows[i]);
                }
            },
            DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getmarket",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}

export async function getMarketDaily(baseAssetID, quoteAssetID)
{
    if(isEmpty(baseAssetID) || isEmpty(quoteAssetID))
        return;

    console.log("getMarketHistory:", baseAssetID, quoteAssetID);

    let connectionPool = null;
    let result = [];

    try {
        connectionPool = await getConnection();

        if(!isNumber(baseAssetID) || !isNumber(quoteAssetID))
        {
            let newIDs = await getAssetsByMarketPair(connectionPool, baseAssetID, quoteAssetID);
            baseAssetID = newIDs.baseAssetID;
            quoteAssetID = newIDs.quoteAssetID;

            if(isEmpty(baseAssetID) || isEmpty(quoteAssetID))
                return;
        }

        await queryAsyncWithRetries(connectionPool,
            `
select markets_daily.*, a1.name as base_name, a1.symbol as base_symbol, a2.name as quote_name, a2.symbol as quote_symbol 
from markets_daily 
join assets a1 on a1.asset_id = markets_daily.base_asset_id 
join assets a2 on a2.asset_id = markets_daily.quote_asset_id 
where markets_daily.base_asset_id = ? && markets_daily.quote_asset_id = ?
order by stat_date asc `,
            [baseAssetID, quoteAssetID],
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result.push(transformMarketsDaily(rows[i]));
                }
            },
            DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getMarketHistory",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}