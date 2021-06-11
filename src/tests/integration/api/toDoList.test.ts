import {destroyTablesElement, fillTables} from "../../fixtures";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import app from "../../../app";
import request from "supertest";
import {SessionController} from "../../../controllers/session.controller";

describe('Determine the todo list routes behavior', () => {

    let errorParam: any;
    let userController: UserController;
    let toDoListController: ToDoListController;

    beforeAll(async (done) => {
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();
        done();
    });

    beforeEach(async (done) => {
        errorParam = {
            errors: [ { message: 'The input provided is invalid' } ]
        }
        await destroyTablesElement();
        await fillTables();
        done();
    });

    describe('Test the creation of a todo list to a user', () => {
        // TODO: jean pomme isn't added to his todo list
        it('should return 201 because all parameters are good', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: 'test list'
                })
                .expect(201);
        });

        it('should return 400 because list_name is not provide', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pomme.fr'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not provide', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because list_name is empty', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: ''
                })
                .expect(400);
        });

        it('should return 400 because user_email is empty', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: '',
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not a mail', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jeanjean',
                    list_name: 'test list'
                })
                .expect(400);
        });

        it('should return 400 because user_email is not a mail', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pommier.fr',
                    list_name: 'test list'
                })
                .expect(404);
        });
    })
})
