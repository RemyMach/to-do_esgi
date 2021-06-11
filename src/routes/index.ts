import {Express} from "express";
import {authRouter} from "./auth.router";
import {itemRouter} from "./item.router";
import {toDoListRouter} from "./toDoList.router";

export function buildRoutes(app: Express) {
    app.use("/auth", authRouter);
    app.use("/item", itemRouter);
    app.use("/toDoList", toDoListRouter);
}
