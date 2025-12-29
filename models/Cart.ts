import sequelize from '../util/database.js'
import { DataTypes,  Model } from 'sequelize'
import User from './User.js'


class Cart extends Model {
    public id!: number
    public userId!: number
}

Cart.init(
    {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    }
    },
    {
        sequelize,
        modelName: 'Cart'
    }
)

export default Cart