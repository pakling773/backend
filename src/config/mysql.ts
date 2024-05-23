import mysql from "mysql2/promise";
import "dotenv/config";
import { PoolOptions } from "mysql2/promise";

// Create the connection pool. The pool-specific settings are the defaults

const config: PoolOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

const mySqlPool = mysql.createPool(config);
export default mySqlPool;
