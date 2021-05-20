import { Request, Response, NextFunction } from 'express';
import BaseCustomError from '../errors/base-custom-error';

const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    
    if (err instanceof BaseCustomError) {
        return res.status(err.getStatusCode()).send(err.serializeErrorOutput());
    }
    
    return res.status(500).send().end();
};

export default errorHandler;
