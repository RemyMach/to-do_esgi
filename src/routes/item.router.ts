import express, {NextFunction, Request, Response} from "express";
import {ItemController} from "../controllers/item.controller";
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import InvalidInput from "../errors/invalid-input";
import {validateItemCreation} from "../middlewares/item.middleware";

const itemRouter = express.Router();

itemRouter.post("/",[
        body('name')
            .trim()
            .isLength({ min: 1 })
            .withMessage('le nom ne peut pas être vide'),
        body('content')
            .trim()
            .isLength({ min: 1, max: 1000 })
            .withMessage('le contenu doit faire entre 1 et 1000 caractères'),
        body('createdAt')
            .trim()
            .notEmpty()
            .withMessage('la date de création n\'est pas optionelle'),
        validateItemCreation
    ],
    async function(req: Request, res: Response) {

        const errors = validationResult(req).array();
        if(res.locals.errors) {
            errors.push(res.locals.errors.name);
            errors.push(res.locals.errors.content);
            errors.push(res.locals.errors.createdAt);
        }

        if (errors.length > 0) {
            throw new InvalidInput(errors);
        }

        const {name, content, createdAt} = req.body;

        const itemController = await ItemController.getInstance();
        try {
            const item = await itemController.createItem(
                name,
                content,
                createdAt
            );

            if (item != null) {
                return res.status(201)
                    .json(item)
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

export {
    itemRouter
};
