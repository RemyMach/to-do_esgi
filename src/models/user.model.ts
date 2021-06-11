import {
    CreateOptions,
    DataTypes,
    HasManyAddAssociationMixin,
    HasManyGetAssociationsMixin,
    Model,
    ModelCtor,
    Optional,
    Sequelize
} from "sequelize";
import {SessionInstance, SessionProps} from "./session.model";
import {hash} from "bcrypt";
import {ToDoListInstance} from "./toDoList.model";

interface UserProps {
    readonly id: number;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    password: string;
}

export class UserModel implements UserProps{
    readonly id: number;
    birthDate: Date;
    email: string;
    firstName: string;
    lastName: string;
    password: string;

    constructor(birth_date: Date, email: string, firstname: string, lastname: string, password: string, id: number) {
        this.id = id;
        this.birthDate = birth_date;
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
        this.password = password;
    }

    validatePropsAreNotEmpty(): boolean {
        // id return always true because readonly no need test it
        return this.firstName !== "" && this.lastName !== "" && this.email !== "" && this.password !== "";
    }

    validateEmail(): boolean {
        const re = /\S+@\S+\.\S+/;
        return this.email.match(re) !== null;
    }

    validateBirthDateIsLessRecentThan13Years(): boolean {
        const date_before_13_years: Date = new Date();
        date_before_13_years.setUTCFullYear(date_before_13_years.getFullYear() - 13);
        return this.birthDate < date_before_13_years;
    }

    validatePasswordLength(): boolean {
        return this.password.length >= 8 && this.password.length <= 40;
    }

    isValid(): boolean {

        return this.validatePropsAreNotEmpty() && this.validateEmail() && this.validateBirthDateIsLessRecentThan13Years() && this.validatePasswordLength();
    }
}

export interface UserCreationProps extends Optional<UserProps, "id"> {}

export interface UserInstance extends Model<UserProps, UserCreationProps>, UserProps {
    addSession: HasManyAddAssociationMixin<SessionInstance, "id">;
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;

    addToDoList: HasManyAddAssociationMixin<ToDoListInstance, "id">;
    getToDoLists: HasManyGetAssociationsMixin<ToDoListInstance>;
}

export default function(sequelize: Sequelize): ModelCtor<UserInstance> {
    const user =  sequelize.define<UserInstance>("User", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                name: 'email',
                msg: 'le mail fournit est déjà utilisé par un autre utilisateur'
            },
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            validate: {
                len: {
                    args: [8, 40],
                    msg: "le mot de passe doit-être compris entre 8 et 40 caractères inclus"
                }
            }
        },
    }, {
        freezeTableName: true,
        underscored: false,
        timestamps: true
    });

    user.addHook('beforeCreate', async (user: UserInstance, options: CreateOptions<UserProps>) => {
        const passwordHashed = await hash(user.password, 8);
        user.password = passwordHashed;
    });

    user.addHook('beforeUpdate', async (user: UserInstance, options: CreateOptions<UserProps>) => {
        const passwordHashed = await hash(user.password, 8);
        user.password = passwordHashed;
    });

    return user;
}
