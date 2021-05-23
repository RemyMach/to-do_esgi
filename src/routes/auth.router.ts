import express, {NextFunction, Request, Response} from "express";
import {AuthController} from "../controllers/auth.controller";
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import InvalidInput from "../errors/invalid-input";
import {authMiddleware, validateBodyBirthDate} from "../middlewares/auth.middleware";
import validator from "validator";
import {SessionInstance} from "../models/session.model";
import {ValidationError} from "sequelize";

const authRouter = express.Router();

authRouter.post("/subscribe",[
    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('le firstName ne peut pas être vide'),
    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('le lastName ne peut pas être vide'),
    body('email')
        .isEmail()
        .withMessage('Email must be in a valid format')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 8, max: 40 })
        .withMessage('le mot de passe doit-être entre 8 et 40 carractères'),
    validateBodyBirthDate
    ],
    async function(req: Request, res: Response) {

        const errors = validationResult(req).array();
        if(res.locals.errors) {
            errors.push(res.locals.errors.birthDate);
        }

        if (errors.length > 0) {
            throw new InvalidInput(errors);
        }

        const {firstName, lastName, email, password, birthDate} = req.body;

        const authController = await AuthController.getInstance();
        try{
            const user = await authController.subscribe({
                firstName,
                lastName,
                email,
                password,
                birthDate
            });

            return res.status(201)
                .json({user: user.email, firstName: user.firstName, lastName: user.lastName})
                .end();

        }catch(validationError){
            if(validationError instanceof ValidationError) {
                errors.push({
                    location: 'body',
                    value: req.body.email,
                    param: 'email',
                    msg: validationError.message,
                });
            }else {
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

authRouter.post("/login", [
    body('email')
        .isEmail()
        .withMessage('Email must be in a valid format')
        .normalizeEmail(),
    body('password')
        .trim()
        .isLength({ min: 1 })
    ],
    async function(req: Request, res: Response) {

    const errors = validationResult(req).array();

    if (errors.length > 0) {
        throw new InvalidInput(errors);
    }

    const {email, password} = req.body;
    const authController = await AuthController.getInstance();
    let session: SessionInstance | null;

    try{
        session = await authController.log(email, password);

    }catch(validationError){
        errors.push({
            location: 'body',
            value: 'db',
            param: 'db',
            msg: 'db problems',
        });
        throw new InvalidInput(errors);
    }

    if(session === null) {
        errors.push({
            location: 'body',
            value: 'user',
            param: 'user',
            msg: 'le login et / ou le mot de passe est incorrect',
        });
        throw new InvalidInput(errors);
    }

    return res.status(200).json({token: session.token}).end();
});

authRouter.delete("/logout",
    authMiddleware,
    async function(req: Request, res: Response) {

    const errors = validationResult(req).array();
    const auth = req.headers["authorization"];
    if(auth === undefined) {
        return res.status(403).end();
    }

    const token = auth.replace('Bearer ', '');
    const authController = await AuthController.getInstance();

    try{
        await authController.deleteSession(token);
        return res.status(204).end();

    }catch{
        errors.push({
            location: 'body',
            value: 'db',
            param: 'db',
            msg: 'db problems',
        });
        throw new InvalidInput(errors);
    }

});

export {
    authRouter
};
