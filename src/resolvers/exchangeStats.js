import {transformExchangeDaily} from "../transformers/exchangeDaily.js";
import {getConnection, queryAsyncWithRetries, releaseConnection} from "./database.js";
import {transformQuickStats24H} from "../transformers/quickStats.js";
import {DB_RETRIES} from "../constants.js";

export async function getQuickStats()
{
    console.log("getQuickStats:");

    let connectionPool = null;
    let result = {};

    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select * 
from exchange_24h 
`,
            null,
            ([rows,fields]) => {
                for(let i = 0; i < rows.length; i++)
                {
                    result = transformQuickStats24H(rows[i]);
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching quickstats",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return result;
}

export async function getExchangeDaily()
{
    console.log("getExchangeDaily:");

    let connectionPool = null;
    let results = [];

    try {
        connectionPool = await getConnection();

        await queryAsyncWithRetries(connectionPool,
            `
select * 
from exchange_daily 
order by stat_date asc 
`,
            null,
            ([rows,fields]) => {
                for (let i = 0; i < rows.length; i++) {
                    let result = transformExchangeDaily(rows[i]);
                    results.push(result);
                }
            }, DB_RETRIES);
    }
    catch(e) {
        console.error("Error fetching exchange daily",e);
    }
    finally
    {
        releaseConnection(connectionPool);
    }

    return results;
}