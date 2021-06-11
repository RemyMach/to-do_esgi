import {destroyTablesElement, fillTables} from "../../fixtures";
import {UserController} from "../../../controllers/user.controller";
import {ToDoListController} from "../../../controllers/toDoList.controller";
import app from "../../../app";
import request from "supertest";

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
        it('should return 201', async () => {
            await request(app).post('/toDoList/user/add')
                .send({
                    user_email: 'jean@pomme.fr',
                    list_name: 'test list'
                })
                .expect(201);
        });
    })
})
