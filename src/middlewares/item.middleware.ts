import express from "express";
import {ItemController} from "../controllers/item.controller";
import {validationResult} from "express-validator";
import {ItemValidatorService} from "../services/itemValidator.service";
import {isValid, parseISO, formatISO} from 'date-fns';

export async function validateItemCreation(req: express.Request, res: express.Response, next: express.NextFunction) {
    const itemValidatorService = new ItemValidatorService();
    const name = req.body.name;
    const content = req.body.content;
    const creationDate = parseISO(req.body.createdAt);

    if(!isValid(creationDate)) {
        res.locals.errors = {}
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'le paramètre createdAt ne peut pas être manquant',
        }
        next();
    }else if(!itemValidatorService.isNameNotEmpty(name)) {
        res.locals.errors = {}
        res.locals.errors.name = {
            location: 'body',
            value: 'name',
            param: 'name',
            msg: 'le champs name ne peux pas être vide',
        }
        next();
    }else if(!itemValidatorService.isContentValid(content)) {
        res.locals.errors = {}
        res.locals.errors.content = {
            location: 'body',
            value: 'content',
            param: 'content',
            msg: 'le champs content doit contenir un minimum de 1 caractères et un maximum de 1000 caractères',
        }
        next();
    }else if(!itemValidatorService.isCreatedDateValid(creationDate)) {
        res.locals.errors = {}
        res.locals.errors.createdAt = {
            location: 'body',
            value: 'createdAt',
            param: 'createdAt',
            msg: 'merci d\'attendre 30min entre la creation de deux notes',
        }
        next();
    }else {
        next();
    }
}
