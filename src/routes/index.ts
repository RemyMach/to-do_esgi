import {Express} from "express";
import {authRouter} from "./auth.router";
import {itemRouter} from "./item.router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/item", itemRouter)
}
