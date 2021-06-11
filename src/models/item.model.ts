import {
    BelongsToGetAssociationMixin,
    BelongsToSetAssociationMixin,
    DataTypes,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {ItemValidatorService} from '../services/itemValidator.service';
import {ToDoListInstance} from "./toDoList.model";

interface ItemProps {
    readonly id: number;
    name: string;
    content: string;
    createdAt: Date;
}

export class ItemModel implements ItemProps {

    readonly id: number;
    content: string;
    createdAt: Date;
    name: string;

    itemValidator: ItemValidatorService;

    constructor(id: number, content: string, createdAt: Date, name: string) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.name = name;
        this.itemValidator = new ItemValidatorService();
    }

    isValid(): boolean {

        return this.itemValidator.isContentValid(this.content)
            && this.itemValidator.isNameNotEmpty(this.name)
            && this.itemValidator.isCreatedDateValid(this.createdAt);
    }
}

export interface ItemCreationProps extends Optional<ItemProps, "id"> {}

export interface ItemInstance extends Model<ItemProps, ItemCreationProps>, ItemProps {
    setToDoList: BelongsToSetAssociationMixin<ToDoListInstance, "id">;
    getToDoList: BelongsToGetAssociationMixin<ToDoListInstance>;
}

export default function (sequelize: Sequelize): ModelCtor<ItemInstance> {
    return sequelize.define<ItemInstance>("Item", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 1000],
                    msg: "Content length must be between 1 and 1000 chars"
                }
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
    })
}
