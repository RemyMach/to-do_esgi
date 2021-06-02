import request from "supertest";
import app from '../../../app';
import {validationResult} from "express-validator";
import {ItemController} from "../../../controllers/item.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListInstance} from "../../../models/toDoList.model";
import {UserInstance} from "../../../models/user.model";
import {destroyTablesElement, fillTables} from "../../fixtures";

describe('Determine the item route behavior', () => {

    let errorParam: any;

    let userController: UserController;
    let toDoListController: ToDoListController;

    let user: UserInstance;
    let toDoListId: number;

    beforeAll(async () => {
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();

        user = (await userController.getUserByEmail("jean@pomme.fr"))!;
        toDoListId = Number((await toDoListController.addToDoListToUser(user, "test-items"))!.getDataValue("id"));
    });

    beforeEach( async (done) => {
        errorParam = {
            errors: [ { message: 'The input provided is invalid' } ]
        }
        await destroyTablesElement();
        await fillTables();
        done();
    });

    describe('Test the creation of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            done();
        });

        it('should return 400 because toDoListId is null', async () => {
            errorParam['errors'][0]['fields'] = { toDoListId: [ 'le paramètre toDoListId ne peux pas être manquant' ]};
            const response = await request(app).post('/item')
                .send({
                    toDoListId: null,
                    name: "Test",
                    content: "Content",
                    createdAt: new Date()
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
        });

        it('should return 400 because name is empty', async () => {
            errorParam['errors'][0]['fields'] = { name: [ 'le champs name ne peux pas être vide' ]};
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoListId,
                    name: "",
                    content: "Content",
                    createdAt: new Date()
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
        });

        it('should return 400 because content is empty', async () => {
            errorParam['errors'][0]['fields'] = { content: [ 'le champs content doit contenir un minimum de 1 caractères et un maximum de 1000 caractères' ]};
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "",
                    createdAt: new Date()
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
        });

        it('should return 400 because creation date is null', async () => {
            errorParam['errors'][0]['fields'] = { createdAt: [ 'le paramètre createdAt ne peut pas être manquant' ]};
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "Content",
                    createdAt: null
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
        });

        it('should return 201', async () => {
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "Content",
                    createdAt: new Date()
                })
                //test status
                .expect(201);

            //test item is in the db
            const item = await itemController.getItemById(response.body.id);
            expect(item).not.toBeNull();
        });

    });

    describe('Test the query of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            done();
        });

        it('should return 404 because no item id are provided', async () => {
            const response = await request(app).get('/item/')
                //test status
                .expect(404);
        });

        it('should return 404 because item doesn\'t exist', async () => {
            const response = await request(app).get('/item/-1')
                //test status
                .expect(404);
        });

        it('should return 500 because item id is not a number', async () => {
            const response = await request(app).get('/item/zero')
                //test status
                .expect(500);
        });

        it('should return 201', async () => {
            const response = await request(app).get('/item/1')
                //test status
                .expect(201);

            //test item is in the db
            const item = await itemController.getItemById(1);
            expect(item!.name).toBe(response.body.name);
        });

    });

    describe('Test the deletion of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            done();
        });

        it('should return 404 because no item id are provided', async () => {
            const response = await request(app).delete('/item/')
                //test status
                .expect(404);
        });

        it('should return 404 because item doesn\'t exist', async () => {
            const response = await request(app).delete('/item/-1')
                //test status
                .expect(404);
        });

        it('should return 500 because item id is not a number', async () => {
            const response = await request(app).delete('/item/zero')
                //test status
                .expect(500);
        });

        it('should return 200', async () => {
            const response = await request(app).delete('/item/1')
                //test status
                .expect(200);

            //test item is in the db
            const item = await itemController.getItemById(1);
            expect(item).toBeNull();
        });

    });
});
