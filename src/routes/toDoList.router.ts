import express, {Request, Response} from "express";
import {AuthController} from "../controllers/auth.controller";
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import InvalidInput from "../errors/invalid-input";
import {validateBodyBirthDate} from "../middlewares/auth.middleware";
import {ValidationError} from "sequelize";
import {UserController} from "../controllers/user.controller";
import {ToDoListController} from "../controllers/toDoList.controller";
import {validateItemCreation} from "../middlewares/item.middleware";

const toDoListRouter = express.Router();

toDoListRouter.post("/user/add",[
        body('user_email')
            .isEmail()
            .withMessage('le mail n\'est pas un mail valide')
            .normalizeEmail(),
        body('list_name')
            .trim()
            .isLength({ min: 1 })
            .withMessage('le lastName ne peut pas être vide'),
        validateItemCreation
    ],
    async function(req: Request, res: Response) {

        const errors = validationResult(req).array();
        if(res.locals.errors) {
            errors.push(res.locals.errors.user_email);
            errors.push(res.locals.errors.list_name);
        }

        if (errors.length > 0) {
            throw new InvalidInput(errors);
        }

        const {user_email, list_name} = req.body;

        const userController = await UserController.getInstance();
        const toDoListController = await ToDoListController.getInstance();
        try{
            const user = await userController.getUserByEmail(user_email);
            if(user === null){
                return res.status(404)
                    .end();
            }

            const toDoList = await toDoListController.addToDoListToUser(user, list_name);
            if(toDoList === null){
                return res.status(404)
                    .end();
            }

            return res.status(201)
                .json({toDoList})
                .end();

        }
        catch(validationError) {
            if(validationError instanceof ValidationError) {
                errors.push({
                    location: 'body',
                    value: req.body.email,
                    param: 'email',
                    msg: validationError.message,
                });
            }
            else {
                errors.push({
                    location: 'body',
                    value: 'db',
                    param: 'db',
                    msg: 'db problems',
                });
            }
            throw new InvalidInput(errors);
        }
    });

export {
    toDoListRouter
};
