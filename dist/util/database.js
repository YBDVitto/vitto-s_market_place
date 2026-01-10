import { Sequelize } from 'sequelize';
import { env } from '../env.js';
const isProduction = process.env.NODE_ENV === 'production';
const sequelize = new Sequelize(isProduction ? (env.DB_NAME || 'test') : 'portfolio_project', isProduction ? env.DB_USER : 'root', env.DB_PASSWORD, {
    dialect: 'mysql',
    host: isProduction ? env.DB_HOST : 'localhost',
    port: isProduction ? Number(env.DB_PORT) || 4000 : 3306,
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: true,
        }
    } : {},
    logging: false
});
export default sequelize;
