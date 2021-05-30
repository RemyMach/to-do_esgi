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

    let userController: UserController;
    let toDoListController: ToDoListController;

    let user: UserInstance;
    let toDoList: ToDoListInstance;

    beforeAll(async () => {
        userController = await UserController.getInstance();
        toDoListController = await ToDoListController.getInstance();

        user = (await userController.getUserByEmail("jean@pomme.fr"))!;
        toDoList = (await toDoListController.addToDoListToUser(user, "test-items"))!;
    });

    describe('Test the creation of an item', () => {

        let itemController: ItemController;

        beforeAll(async (done) => {
            itemController = await ItemController.getInstance();
            done();
        });

        it('should return 400 because name is empty', async () => {
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoList.getDataValue("id"),
                    name: "",
                    content: "Content",
                    createdAt: new Date()
                })
                //test status
                .expect(400);
        });

        it('should return 400 because content is empty', async () => {
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoList.getDataValue("id"),
                    name: "Test",
                    content: "",
                    createdAt: new Date()
                })
                //test status
                .expect(400);
        });

        it('should return 400 because creation date is null', async () => {
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoList.getDataValue("id"),
                    name: "",
                    content: "Content",
                    createdAt: null
                })
                //test status
                .expect(400);
        });

        it('should return 201', async () => {
            const response = await request(app).post('/item')
                .send({
                    toDoListId: toDoList.getDataValue("id"),
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
});
