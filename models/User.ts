import sequelize from '../util/database.js'
import { Model, DataTypes } from 'sequelize'


class User extends Model {
    public id!: number
    public email!: string
    public name!: string | null
    public password!: string
    public resetToken?: string
    public resetTokenExpiration?: string
    public createdAt!: Date
    public updatedAt!: Date

}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        resetTokenExpiration: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'User'
    }

)



export default User