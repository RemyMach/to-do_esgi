import express, {NextFunction, Request, Response, ErrorRequestHandler} from "express";
import {buildRoutes} from "./routes";
import 'express-async-errors';
import {errorHandler} from "./middlewares";

const app = express();

app.use(express.json());


app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', ['Content-Type','Authorization']);

    next();
});

buildRoutes(app);

app.use(errorHandler);


export default app;
