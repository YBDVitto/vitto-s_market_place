import sequelize from "../util/database.js"
import { DataTypes, Model } from 'sequelize'
import Chat from './Chat.js'
import User from './User.js'

class Message extends Model {
    public id!: number
    public chatId!: number
    public senderId!: number
    public content!: string
    public createdAt!: Date
}

Message.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true 
        },
        chatId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Chat,
                key: 'id'
            }
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            }
        },
        content: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,
        modelName: 'Message',
        tableName: 'messages'
    }
)

export default Message