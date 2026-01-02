import { Sequelize } from 'sequelize';
import { env } from '../env.js';
console.log('merda', env.DB_NAME);
const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    dialect: 'mysql',
    host: env.DB_HOST,
    port: Number(env.DB_PORT) || 3306
});
export default sequelize;
