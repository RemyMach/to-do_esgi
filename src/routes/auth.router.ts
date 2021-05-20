import express, {Request, Response}from "express";
import {AuthController} from "../controllers/auth.controller";
import 'express-async-errors';
import { body, validationResult } from 'express-validator';
import InvalidInput from "../errors/invalid-input";

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
        .withMessage('le mot de passe doit-être entre 8 et 40 carractères')
    ],
    async function(req: Request, res: Response) {
        const date = new Date();
        date.setUTCFullYear(new Date().getUTCFullYear() -13);
        const errors = validationResult(req).array();
        if(date.toISOString() < req.body.birthDate) {
            errors.push({
                location: 'body',
                value: req.body.birthDate,
                param: 'birthDate',
                msg: 'la date ne respecte pas la consigne',
            });
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
