import express, {Request, Response} from "express";
import { body, validationResult } from 'express-validator';
import InvalidInput from "../errors/invalid-input";
import {ValidationError} from "sequelize";
import {UserController} from "../controllers/user.controller";
import {ToDoListController} from "../controllers/toDoList.controller";
import {authMiddleware} from "../middlewares/auth.middleware";
import {ItemController} from "../controllers/item.controller";

const toDoListRouter = express.Router();

toDoListRouter.post("/user/add",
    authMiddleware,
    [
        body('user_email')
            .isEmail()
            .withMessage('le mail n\'est pas un mail valide')
            .normalizeEmail(),
        body('list_name')
            .trim()
            .isLength({ min: 1 })
            .withMessage('lastName ne peut pas être vide')
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
                return res.status(400)
                    .end();
            }

            const toDoList = await toDoListController.addToDoListToUser(user, list_name);
            if(toDoList === null){
                return res.status(400)
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

toDoListRouter.get("/",
    authMiddleware,
    async function(req: Request, res: Response) {
        const list_id = req.query.list_id ? Number.parseInt(req.query.list_id as string) : undefined;
        const user_email = req.query.user_email ? req.query.user_email as string : undefined;

        if (list_id === undefined || user_email === undefined) {
            res.status(400).end();
            return;
        }

        const userController = await UserController.getInstance();
        const toDoListController = await ToDoListController.getInstance();
        try{
            const user = await userController.getUserByEmail(user_email);
            if(user === null){
                return res.status(400)
                    .end();
            }

            const toDoList = await toDoListController.getToDoListById(list_id);
            if(toDoList === null){
                return res.status(400)
                    .end();
            }

            const json = JSON.parse(JSON.stringify(toDoList));
            if(json.User.email !== user_email){
                return res.status(403)
                    .end();
            }

            return res.status(200)
                .json({toDoList})
                .end();

        }
        catch(validationError) {
            return res.status(400)
                .end();
        }
    });

toDoListRouter.delete("/",
    authMiddleware,
    [
        body('user_email')
            .isEmail()
            .withMessage('le mail n\'est pas un mail valide')
            .normalizeEmail(),
        body('list_id')
            .trim()
            .isNumeric()
            .withMessage('list_id n\'est pas valide')
    ],
    async function(req: Request, res: Response) {

        const errors = validationResult(req).array();
        if(res.locals.errors) {
            errors.push(res.locals.errors.user_email);
            errors.push(res.locals.errors.list_name);
        }

        const {user_email, list_id} = req.body;

        if (errors.length > 0) {
            throw new InvalidInput(errors);
        }

        const userController = await UserController.getInstance();
        const toDoListController = await ToDoListController.getInstance();
        try{
            const user = await userController.getUserByEmail(user_email);
            if(user === null){
                return res.status(400)
                    .end();
            }

            const toDoList = await toDoListController.getToDoListById(list_id);
            if(toDoList === null){
                return res.status(400)
                    .end();
            }

            const json = JSON.parse(JSON.stringify(toDoList));
            if(json.User.email !== user_email){
                return res.status(403)
                    .end();
            }

            const items = await toDoListController.getToDoListItemsWithToDoListId(list_id);
            const itemController = await ItemController.getInstance();

            for (const item of JSON.parse(JSON.stringify(items))) {
                await itemController.deleteItem(item.id);
            }
            await toDoListController.deleteToDoListById(list_id);

            return res.status(200)
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
