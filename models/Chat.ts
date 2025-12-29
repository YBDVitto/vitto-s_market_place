import sequelize from "../util/database.js"
import { DataTypes, Model } from 'sequelize'
import User from './User.js'
class Chat extends Model {
    public id!: number
    public user1Id!: number
    public user2Id!: number
}

Chat.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user1Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        user2Id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Chat'

    }
)

export default Chat