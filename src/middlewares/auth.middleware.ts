import express from "express";
import {AuthController} from "../controllers/auth.controller";
import {validationResult} from "express-validator";
import {DateService} from "../services/date.service";
import {isValid, parseISO, formatISO} from 'date-fns';

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];

    if(auth !== undefined) {
        const token = auth.replace('Bearer ', '');
        const authController = await AuthController.getInstance();
        const session = await authController.getSession(token);
        if(session !== null) {
            next();
            return;
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
    }
}

export async function validateBodyBirthDate(req: express.Request, res: express.Response, next: express.NextFunction) {
    const dateService = new DateService();
    const date = parseISO(req.body.birthDate);

    if(!isValid(date)) {
        res.locals.errors = {}
        res.locals.errors.birthDate = {
            location: 'body',
            value: 'birthDate',
            param: 'birthDate',
            msg: 'le paramètre birthDate ne peut pas être manquant',
        }

        next();
    }else if(!dateService.isBirthdateValid(date)) {

        res.locals.errors = {}
        res.locals.errors.birthDate = {
            location: 'body',
            value: 'birthDate',
            param: 'birthDate',
            msg: 'le user est trop jeune pour s\'incrire, il doit minimum avoir 13 ans',
        }

        next();
    }else {
        next();
    }
}
