import express, {Express} from "express";
import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, async () => console.log("Listening on " + port));
