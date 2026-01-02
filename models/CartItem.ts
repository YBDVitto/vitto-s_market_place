import sequelize from '../util/database.js'
import { DataTypes, Model } from 'sequelize'
import Cart from './Cart.js'
import Product from './Product.js'

class CartItem extends Model {
    public id!: number
    public cartId!: number
    public productId!: number
    public quantity!: number
}

CartItem.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'carts',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        productId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cartitems'
    }
)

export default CartItem