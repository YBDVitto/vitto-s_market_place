import sequelize from '../util/database.js';
import { DataTypes, Model } from 'sequelize';
class CartItem extends Model {
}
CartItem.init({
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
}, {
    sequelize,
    modelName: 'CartItem'
});
export default CartItem;
