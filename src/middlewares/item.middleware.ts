import express from "express";
import {ItemController} from "../controllers/item.controller";
import {ToDoListInstance} from "../models/toDoList.model";
import {ToDoListController} from "../controllers/toDoList.controller";
import {validationResult} from "express-validator";
import {ItemValidatorService} from "../services/itemValidator.service";
import {isValid, parseISO, formatISO} from 'date-fns';
import {DateService} from '../services/date.service';
import {ItemModel} from "../models/item.model";

export async function validateItemCreation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const itemValidatorService = new ItemValidatorService();
    const toDoListId = req.body.toDoListId;
    const name = req.body.name;
    const content = req.body.content;
    const creationDate = parseISO(req.body.createdAt);
    const dateService = new DateService();
    if (isNaN(Number.parseInt(toDoListId))) {
        return next();
    }

    if(!isValid(creationDate)) {
        res.locals.errors = {};
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'le paramètre createdAt ne peut pas être manquant',
        };
        return next();
    }else if (!itemValidatorService.isToDoListIdValid(toDoListId)) {

        res.locals.errors = {};
        res.locals.errors.toDoListId = {
            location: 'body',
            value: 'toDoListId',
            param: 'toDoListId',
            msg: 'le paramètre toDoListId ne peux pas être manquant',
        };
        return next();
    }


    const newItem = new ItemModel(0, name, creationDate, content);
    const toDoListController = await ToDoListController.getInstance();
    const allItems = await toDoListController.getToDoListItemsWithToDoListId(Number.parseInt(toDoListId));
    let lastItem: ItemModel | null = null;

    if (allItems !== null) {
        let latestItemId: number = 0;

        for (let i = 0; i < allItems.length; i++) {
            if (allItems[latestItemId].createdAt.getTime() < allItems[i].createdAt.getTime()) {
                latestItemId = i;
            }
        }

        lastItem = new ItemModel(allItems[latestItemId].id, allItems[latestItemId].name, allItems[latestItemId].createdAt, allItems[latestItemId].content);
    }
    if(lastItem != null && !dateService.isItemCreationDateStamped(lastItem!, newItem)) {
        res.locals.errors = {};
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'merci d\'attendre 30min entre la creation de deux notes',
        };
        return next();
    }else {
        return next();
    }
}
