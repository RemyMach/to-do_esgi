import {destroyTablesElement, fillTables} from "../../fixtures";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import app from "../../../app";
import request from "supertest";
import {SessionFixture} from "../../fixtures/session.fixture";

describe('Determine the todo list routes behavior', () => {

    let errorParam: any;
    let userController: UserController;
    let toDoListController: ToDoListController;

    let sessionFixture: SessionFixture;

    beforeAll(async (done) => {
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();
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

    describe('Test the creation of a todo list to a user', () => {
        // TODO: jean pomme isn't added to his todo list
        it('should return 201 because all parameters are good', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: 'test list'
                })
                .expect(201);
        });

        it('should return 401 because user session is not provide', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: 'test list'
                })
                .expect(401);
        });

        it('should return 400 because list_name is not provide', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: 'jean@pomme.fr'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not provide', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because list_name is empty', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: ''
                })
                .expect(400);
        });

        it('should return 400 because user_email is empty', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: '',
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not a mail', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: 'jeanjean',
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not a mail', async () => {
            const token = sessionFixture.session_user_jean?.token;
            await request(app).post('/toDoList/user/add')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    user_email: 'jean@pommier.fr',
                    list_name: 'test list'
                })
                .expect(404);
        });
    })
})
