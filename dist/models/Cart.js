import sequelize from '../util/database.js';
import { DataTypes, Model } from 'sequelize';
class Cart extends Model {
}
Cart.init({
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
}, {
    sequelize,
    modelName: 'Cart'
});
export default Cart;
