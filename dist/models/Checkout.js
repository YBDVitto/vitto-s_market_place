import sequelize from "../util/database.js";
import { Model, DataTypes } from 'sequelize';
class Checkout extends Model {
}
Checkout.init({
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
}, {
    sequelize,
    modelName: 'Checkout',
    tableName: 'checkouts'
});
export default Checkout;
