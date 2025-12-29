import { Sequelize } from 'sequelize'
import { env } from '../env.js'


const sequelize = new Sequelize(
    'portfolio_project',
    'root',
    env.DB_PASSWORD,
    {
        dialect: 'mysql',
        host: 'localhost'
    }
)

export default sequelize