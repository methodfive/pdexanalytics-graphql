import {getConnection, queryAsyncWithRetries, releaseConnection} from "./database.js";
import {transformTrade} from "../transformers/trades.js";
import {DB_RETRIES} from "../constants.js";

export async function getTrades()
{
    console.log("getTrades:");

    let connectionPool = null;
    let result = [];

    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select trades.*, a_base.symbol as base_symbol, a_quote.symbol as quote_symbol 
from trades 
join assets a_base on a_base.asset_id = trades.base_asset_id 
join assets a_quote on a_quote.asset_id = trades.quote_asset_id 
order by timestamp desc limit 100`,
            null,
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result.push(transformTrade(rows[i]));
                }
            },
            DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching trades",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}