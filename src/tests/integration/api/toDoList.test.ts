import {destroyTablesElement, fillTables} from "../../fixtures";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import app from "../../../app";
import request from "supertest";
import {SessionFixture} from "../../fixtures/session.fixture";
import {SessionController} from "../../../controllers/session.controller";

describe('Determine the todo list routes behavior', () => {

    let errorParam: any;
    let userController: UserController;
    let toDoListController: ToDoListController;
    let sessionFixture: SessionFixture;
    let sessionController: SessionController;

    beforeAll(async (done) => {
        errorParam = {
            errors: [ { message: 'The input provided is invalid' } ]
        }
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();
        sessionController = await SessionController.getInstance();
        done();
    });

    beforeEach(async (done) => {
        errorParam = {
            errors: [ { message: 'The input provided is invalid' } ]
        }

        sessionFixture = await SessionFixture.getInstance();

        await destroyTablesElement();
        await fillTables();
        done();
    });

    describe('Test the creation of a todo list to a user', () =>
    {
        it('should return 201 because all parameters are good', async () =>
        {
            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pomme.fr';
            const list_name = 'test list';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_name
                })
                .expect(201);

            expect(response.body).toHaveProperty('toDoList');

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists + 1);
        });

        it('should return 401 because user session is not provide', async () =>
        {
            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pomme.fr';
            const list_name = 'test list';

            const response = await request(app).post('/toDoList/user/add')
                .send({
                    user_email,
                    list_name
                })
                .expect(401);

            expect(response.body).toEqual({});

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because list_name is not provide', async () =>
        {
            errorParam['errors'][0]['fields'] = { list_name: [ 'lastName ne peut pas être vide' ] };

            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pomme.fr';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email
                })
                .expect(400);

            expect(response.body).toEqual(errorParam);

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because user_email is not provide', async () =>
        {
            errorParam['errors'][0]['fields'] = { user_email: [ 'le mail n\'est pas un mail valide' ] };

            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const list_name = 'test list';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    list_name
                })
                .expect(400);

            expect(response.body).toEqual(errorParam);

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because list_name is empty', async () =>
        {
            errorParam['errors'][0]['fields'] = { list_name: [ 'lastName ne peut pas être vide' ] };

            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pomme.fr';
            const list_name = '';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_name
                })
                .expect(400);

            expect(response.body).toEqual(errorParam);

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because user_email is empty', async () =>
        {
            errorParam['errors'][0]['fields'] = { user_email: [ 'le mail n\'est pas un mail valide' ] };

            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = '';
            const list_name = 'test list';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_name
                })
                .expect(400);

            expect(response.body).toEqual(errorParam);

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because user_email is not a mail', async () =>
        {
            errorParam['errors'][0]['fields'] = { user_email: [ 'le mail n\'est pas un mail valide' ] };

            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jeanjean';
            const list_name = 'test list';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_name
                })
                .expect(400);

            expect(response.body).toEqual(errorParam);

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });

        it('should return 400 because user_email is not a mail of a user in the database', async () =>
        {
            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pommier.fr';
            const list_name = 'test list';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_name
                })
                .expect(404);

            expect(response.body).toEqual({});

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists);
        });
    });

    describe('Test to getting a todo list', () =>
    {
        it('should return 200 because all parameters are good and the user is the owner of the list', async () =>
        {
            const validParam = {
                toDoList: {
                    id: 1,
                    name: 'My todo list, don\'t touch it you son of your mom',
                    User: {
                        email: 'jean@pomme.fr'
                    }
                }
            };

            const user_email = 'jean@pomme.fr';
            const list_id = 1;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=${user_email}&list_id=${list_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(200);

            expect(response.body).toEqual(validParam);
        });

        it('should return 403 because the user isn\' the owner of the list', async () =>
        {
            const user_email = 'jean@pomme.fr';
            const list_id = 2;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=${user_email}&list_id=${list_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(403);

            expect(response.body).toEqual({});
        });

        it('should return 404 because user_email is not a mail for a user in the database', async () =>
        {
            const user_email = 'jeanjean';
            const list_id = 1;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=${user_email}&list_id=${list_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404);

            expect(response.body).toEqual({});
        });

        it('should return 404 because list with this ID didn\'t exist in the database', async () =>
        {
            const user_email = 'jean@pomme.fr';
            const list_id = 1_000_000;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=${user_email}&list_id=${list_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(404);

            expect(response.body).toEqual({});
        });

        it('should return 400 because user_email isn\'t provided', async () =>
        {
            const list_id = 1;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=&list_id=${list_id}`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(400);

            expect(response.body).toEqual({});
        });

        it('should return 400 because list_id isn\'t provided', async () =>
        {
            const user_email = 'jean@pomme.fr';
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).get(`/toDoList/?user_email=${user_email}&list_id=`)
                .set('Authorization', `Bearer ${token}`)
                .send()
                .expect(400);

            expect(response.body).toEqual({});
        });
    });

    describe('Test to delete a todo list', () => {
        it('should return 200 because all parameters are good and the user is the owner of the list', async () =>
        {
            const toDoLists = await toDoListController.getAllToDoLists();
            const numberOfToDoLists = toDoLists.length;

            const user_email = 'jean@pomme.fr';
            const list_id = 1;
            const token = sessionFixture.session_user_jean?.token;

            const response = await request(app).delete(`/toDoList/`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email,
                    list_id
                })
                .expect(200);

            expect(response.body).toEqual({});

            expect(await toDoListController.getAllToDoLists()).toHaveLength(numberOfToDoLists - 1);
        });
    });
})
