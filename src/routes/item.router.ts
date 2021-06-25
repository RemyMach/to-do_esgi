import express, {NextFunction, Request, Response} from "express";
import {ItemController} from "../controllers/item.controller";
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import {authMiddleware} from "../middlewares/auth.middleware";
import InvalidInput from "../errors/invalid-input";
import {validateItemCreation} from "../middlewares/item.middleware";
import {ValidationError} from "sequelize";

const itemRouter = express.Router();

itemRouter.get("/:id", authMiddleware, async function(req: Request, res: Response) {
        const id = req.params.id ? Number.parseInt(req.params.id as string) : undefined;

        if (id == undefined || isNaN(id)) {
            return res.status(400)
                .end();
        }

        const itemController = await ItemController.getInstance();
        const item = await itemController.getItemById(id);

        if (item != null) {
            return res.status(200)
                .json(item)
                .end();
        } else {
            return res.status(400)
                .end();
        }
    }
);

itemRouter.post("/",[
        body('toDoListId')
            .trim()
            .isNumeric()
            .withMessage("le paramètre toDoListId ne peux pas être manquant"),
        body('name')
            .trim()
            .isLength({ min: 1 })
            .withMessage('le champs name ne peux pas être vide'),
        body('content')
            .trim()
            .isLength({ min: 1, max: 1000 })
            .withMessage('le champs content doit contenir un minimum de 1 caractères et un maximum de 1000 caractères'),
        validateItemCreation
    ],
    authMiddleware,
    async function(req: Request, res: Response) {

        const errors = validationResult(req).array();
        if(res.locals.errors) {
            if(res.locals.errors.toDoListId) {
                errors.push(res.locals.errors.toDoListId);
            }
            if(res.locals.errors.name) {
                errors.push(res.locals.errors.name);
            }
            if(res.locals.errors.content) {
                errors.push(res.locals.errors.content);
            }
            if(res.locals.errors.createdAt) {
                errors.push(res.locals.errors.createdAt);
            }
        }

        if (errors.length > 0) {
            throw new InvalidInput(errors);
        }

        const {toDoListId, name, content, createdAt} = req.body;

        const itemController = await ItemController.getInstance();
        try {
            const item = await itemController.createItem(
                toDoListId,
                name,
                content,
                createdAt
            );


            if (item != null) {
                return res.status(201)
                    .json({id: item.id, name: item.name, content: item.content})
                    .end();
            } else {

                return res.status(500)
                    .end();
            }

        }catch(validationError){
            errors.push({
                location: 'body',
                value: 'db',
                param: 'db',
                msg: 'db problems',
            });
            throw new InvalidInput(errors);
        }
    }
);

itemRouter.delete("/:id", authMiddleware, async function(req: Request, res: Response) {
        const id = req.params.id ? Number.parseInt(req.params.id as string) : undefined;

        if (id === undefined || isNaN(id)) {
            return res.status(400)
                .end();
        }

        const itemController = await ItemController.getInstance();
        const item = await itemController.getItemById(id);

        if (item === null) {
            return res.status(400)
                .end();
        }

        const isItemDeleted = await itemController.deleteItem(id);

        if (isItemDeleted) {
            return res.status(200)
                .end();
        } else {
            return res.status(400)
                .end();
        }
    }
);

export {
    itemRouter
};
