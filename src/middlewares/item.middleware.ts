import express from "express";
import {ItemController} from "../controllers/item.controller";
import {ToDoListInstance} from "../models/toDoList.model";
import {validationResult} from "express-validator";
import {ItemValidatorService} from "../services/itemValidator.service";
import {isValid, parseISO, formatISO} from 'date-fns';

export async function validateItemCreation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const itemValidatorService = new ItemValidatorService();
    const toDoListId = req.body.toDoListId;
    const name = req.body.name;
    const content = req.body.content;
    const creationDate = parseISO(req.body.createdAt);

    if(!isValid(creationDate)) {
        res.locals.errors = {};
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'le paramètre createdAt ne peut pas être manquant',
        };
        next();
    }else if (!itemValidatorService.isToDoListIdValid(toDoListId)) {
        res.locals.errors = {};
        res.locals.errors.toDoListId = {
            location: 'body',
            value: 'toDoListId',
            param: 'toDoListId',
            msg: 'le paramètre toDoListId ne peux pas être manquant',
        };
        next();
    }else if(!itemValidatorService.isCreatedDateValid(creationDate)) {
        res.locals.errors = {};
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'merci d\'attendre 30min entre la creation de deux notes',
        };
        next();
    }else {
        next();
    }
}
