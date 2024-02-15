import * as mysql2 from "mysql2";
import pkg from 'aws-sdk';
const {RDS} = pkg;

export const IS_LAMBDA = process.env.NOT_LAMBDA == null ? true : false;

let signer = new RDS.Signer({
    region: process.env.MYSQL_DB_REGION,
    hostname: process.env.MYSQL_DB_PROXY,
    port: 3306,
    username: process.env.MYSQL_DB_USER
});

let tokenRDS = null;
let tokenExpiration = null;
let connectionPool = null;

export async function getConnection()
{
    if(IS_LAMBDA) {
        return await createConnectionPool();
    }
    else
    {
        if (connectionPool == null)
            await createConnectionPool();

        return connectionPool;
    }
}

export function releaseConnection(conn)
{
    if(IS_LAMBDA) {
        try {
            if(conn != null)
                conn.end();
        }
        catch(e) {}
    }
}

async function createConnectionPool() {
    if (IS_LAMBDA) {
        try {
            if(tokenRDS == null || (tokenRDS != null && tokenExpiration != null && Date.now() >= tokenExpiration)) {
                // Token expires in 15 minutes https://aws.amazon.com/premiumsupport/knowledge-center/users-connect-rds-iam/
                tokenExpiration = new Date().getTime() + 14 * 60000;

                tokenRDS = signer.getAuthToken({
                    username: process.env.MYSQL_DB_USER
                });
            }

            let connectionConfig = {
                host: process.env.MYSQL_DB_PROXY,
                user: process.env.MYSQL_DB_USER,
                database: process.env.MYSQL_DB,
                ssl: 'Amazon RDS',
                password: tokenRDS,
                authSwitchHandler: function (data, cb) { // modifies the authentication handler
                    if (data.pluginName === 'mysql_clear_password') { // authentication tokenRDS is sent in clear text but connection uses SSL encryption
                        cb(null, Buffer.from(tokenRDS + '\0'));
                    }
                },
                timezone: 'Z'
            };

            let connection = mysql2.createConnection(connectionConfig);

            connection.connect(function (err) {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                }
                console.log('connected as id ' + connection.threadId + "\n");
            });

            return connection;
        } catch (e) {
            console.error("DB error:", e);
            tokenRDS = null;
            tokenExpiration = null;
        }
    } else {
        connectionPool = mysql2.createPool({
            host: process.env.MYSQL_DB_HOST,
            user: process.env.MYSQL_DB_USER,
            database: process.env.MYSQL_DB,
            password: process.env.MYSQL_DB_PASSWORD,
            ssl: {rejectUnauthorized: false},
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10,
            idleTimeout: 60000,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0,
            timezone: 'Z',
        });
    }

    return connectionPool;
}

export async function queryAsyncWithRetries(connectionPool, sql, params, then, retries_left = 1) {
    return connectionPool.promise().query(sql, params)
        .then(then)
        .catch((err) => {
            if (retries_left >= 1 && (err.code === 'ECONNRESET' || err.code === 'EPIPE')) {
                console.error({msg: 'Retrying query', retries_left, err})
                return queryAsyncWithRetries(connectionPool, sql, params, then,retries_left - 1)
            } else {
                throw err
            }
        }
    );
}