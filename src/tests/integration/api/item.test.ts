import request from "supertest";
import app from '../../../app';
import {validationResult} from "express-validator";
import {ItemController} from "../../../controllers/item.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListInstance} from "../../../models/toDoList.model";
import {UserInstance} from "../../../models/user.model";
import {destroyTablesElement, fillTables} from "../../fixtures";
import {SessionFixture} from "../../fixtures/session.fixture";
import {SessionController} from "../../../controllers/session.controller";

describe('Determine the item route behavior', () => {

    let errorParam: any;
    let itemCount: number;

    let userController: UserController;
    let toDoListController: ToDoListController;
    let sessionController: SessionController;

    let user: UserInstance;
    let toDoListId: number;

    let sessionFixture: SessionFixture;

    const delay = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));

    beforeAll(async (done) => {
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();

        sessionFixture = await SessionFixture.getInstance();

        user = (await userController.getUserByEmail("jean@pomme.fr"))!;
        toDoListId = 1;

        done();
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
            sessionController = await SessionController.getInstance();
            done();
        });

        beforeEach(async (done) => {
            itemCount = await itemController.countItems();
            done();
        });

        it('should return 401 because the user doesn\'t fill any header', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .send()
                //test status
                .expect(401);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 403 because the header for authorization is bad', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .set('Authorization', `ffsdfsfsdfsd`)
                .send()
                //test status
                .expect(403);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because toDoListId is null', async () => {
            const token = sessionFixture.session_user_jean?.token;
            errorParam['errors'][0]['fields'] = { toDoListId: [ 'le paramètre toDoListId ne peux pas être manquant' ]};
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    toDoListId: null,
                    name: "Test",
                    content: "Content",
                    createdAt: new Date(Date.now() + 60 * 60 * 1000)
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 400 because name is empty', async () => {
            const token = sessionFixture.session_user_jean?.token;
            errorParam['errors'][0]['fields'] = { name: [ 'le champs name ne peux pas être vide' ]};
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    toDoListId: toDoListId,
                    name: "",
                    content: "Content",
                    createdAt: new Date(Date.now() + 60 * 60 * 1000)
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 400 because content is empty', async () => {
            const token = sessionFixture.session_user_jean?.token;
            errorParam['errors'][0]['fields'] = { content: [ 'le champs content doit contenir un minimum de 1 caractères et un maximum de 1000 caractères' ]};
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "",
                    createdAt: new Date(Date.now() + 60 * 60 * 1000)
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 400 because creation date is null', async () => {
            const token = sessionFixture.session_user_jean?.token;
            errorParam['errors'][0]['fields'] = { createdAt: [ 'le paramètre createdAt ne peut pas être manquant' ]};
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
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
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 201', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "Content",
                    createdAt: new Date(Date.now() + 60 * 60 * 1000)
                })
                //test status
                .expect(201);

            //test item is in the db
            const item = await itemController.getItemById(response.body.id);
            expect(item).not.toBeNull();
            expect(itemCount ).not.toBe(await itemController.countItems());
        });

        it('should return 400 because last item isn\'t 30min old', async () => {
            await delay(2000);
            const token = sessionFixture.session_user_jean?.token;
            errorParam['errors'][0]['fields'] = { createdAt: [ 'merci d\'attendre 30min entre la creation de deux notes' ]};
            const response = await request(app).post('/item')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    toDoListId: toDoListId,
                    name: "Test",
                    content: "Content",
                    createdAt: new Date()
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);
            expect(itemCount).toBe(await itemController.countItems());
        });

    });

    describe('Test the query of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            sessionController = await SessionController.getInstance();
            done();
        });

        it('should return 401 because the user doesn\'t fill any header', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .send()
                //test status
                .expect(401);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 403 because the header for authorization is bad', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .set('Authorization', `ffsdfsfsdfsd`)
                .send()
                //test status
                .expect(403);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 404 because no item id are provided so the route doesn\'t exist', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).get('/item/').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(404);
        });

        it('should return 400 because item doesn\'t exist', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).get('/item/-1').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(400);
        });

        it('should return 400 because item id is not a number', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).get('/item/zero').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(400);
        });

        it('should return 200', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).get('/item/1').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(200);

            //test item is in the db
            const item = await itemController.getItemById(1);
            expect(item!.name).toBe(response.body.name);
        });

    });

    describe('Test the deletion of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            sessionController = await SessionController.getInstance();
            done();
        });

        beforeEach(async (done) => {
            itemCount = await itemController.countItems();
            done();
        });

        it('should return 401 because the user doesn\'t fill any header', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .send()
                //test status
                .expect(401);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 403 because the header for authorization is bad', async () => {

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).delete('/auth/logout')
                .set('Authorization', `ffsdfsfsdfsd`)
                .send()
                //test status
                .expect(403);

            //test return body
            expect(response.body).toEqual({});

            //test session table have the same number of element
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 404 because no item id are provided so the route doesn\'t exist', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).delete('/item/').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(404);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 400 because item doesn\'t exist', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).delete('/item/-1').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(400);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 400 because item id is not a number', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).delete('/item/zero').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(400);
            expect(itemCount).toBe(await itemController.countItems());
        });

        it('should return 200', async () => {
            const token = sessionFixture.session_user_jean?.token;
            const response = await request(app).delete('/item/1').send()
                .set('Authorization', `Bearer ${token}`)
                //test status
                .expect(200);

            //test item is in the db
            const item = await itemController.getItemById(1);
            expect(item).toBeNull();
            expect(itemCount - 1).toBe(await itemController.countItems());
        });

    });
});
