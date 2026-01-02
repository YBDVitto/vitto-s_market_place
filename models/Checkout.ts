import sequelize from "../util/database.js";
import { Model, DataTypes } from 'sequelize'
import Product from './Product.js'

class Checkout extends Model {
    public id!: number
    public amount!: number
    public userId!: number
    declare addProduct: (product : Product | number, options?: any) => Promise<void>

    public Products?: Product[]
}

Checkout.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Checkout',
        tableName: 'checkouts'
    }
)


export default Checkout