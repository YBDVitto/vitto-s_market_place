import sequelize from '../util/database.js'
import { DataTypes, Model } from 'sequelize'

class Product extends Model {
    public id!: number
    public category!: string
    public title!: string
    public image!: string
    public description!: string
    public price!: number
    public userId!: number
} 

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }

    },
    {
        sequelize,
        modelName: 'Product',
        tableName: 'products'
    }
)


export default Product