import {getConnection, queryAsyncWithRetries, releaseConnection} from "./database.js";
import {transformAssets} from "../transformers/assets.js";
import {isEmpty} from "../util.js";
import {transformAssetDaily} from "../transformers/assetsDaily.js";
import {DB_RETRIES} from "../constants.js";

export async function getAssets()
{
    console.log("getAssets:");

    let connectionPool = null;
    let result = [];

    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select assets.symbol, assets.name, assets.real_name, assets_24h.* 
from assets 
join assets_24h on assets_24h.asset_id = assets.asset_id 
order by tvl desc 
`,
            null,
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result.push(transformAssets(rows[i]));
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getassets",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}

export async function getAsset(assetID)
{
    if(isEmpty(assetID))
        return;

    console.log("getAsset:", assetID);

    let connectionPool = null;
    let result = {};
    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select assets.symbol, assets.name, assets.real_name, assets_24h.* 
from assets 
join assets_24h on assets_24h.asset_id = assets.asset_id 
where assets.symbol = ? 
`,
            [assetID],
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result = transformAssets(rows[i]);
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getasset",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}

export async function getAssetDaily(assetID)
{
    if(isEmpty(assetID))
        return;

    console.log("getAssetDaily:", assetID);

    let connectionPool = null;
    let result = [];
    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select assets_daily.* 
from assets_daily 
join assets on assets.asset_id = assets_daily.asset_id 
where symbol = ? 
order by stat_date asc`,
            [assetID],
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result.push(transformAssetDaily(rows[i]));
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getAssetDaily",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;

}

export async function getAssetsByMarketPair(connectionPool, baseSymbol, quoteSymbol)
{
    if(isEmpty(baseSymbol) || isEmpty(quoteSymbol))
        return;

    console.log("getAssetsByMarketPair:", baseSymbol,quoteSymbol );

    let result = {};
    try {
        await queryAsyncWithRetries(connectionPool,
            `
select * 
from assets 
where symbol = ? or symbol = ?
`,
            [baseSymbol, quoteSymbol],
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    if(rows[i].symbol.localeCompare(baseSymbol) == 0)
                        result.baseAssetID = rows[i].asset_id;
                    else if(rows[i].symbol.localeCompare(quoteSymbol) == 0)
                        result.quoteAssetID = rows[i].asset_id;
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching getAssetsByMarketPair",e);
    }

    return result;
}