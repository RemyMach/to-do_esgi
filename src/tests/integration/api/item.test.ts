import request from "supertest";
import app from '../../../app';
import {validationResult} from "express-validator";
import {ItemController} from "../../../controllers/item.controller";
import {destroyTablesElement, fillTables} from "../../fixtures";

describe('Determine the item route behavior', () => {

    describe('Test the creation of an item', () => {

        let itemController: ItemController;

        beforeAll(async () => {
            itemController = await ItemController.getInstance();
        });

        beforeEach(async (done) => {
            //await destroyTablesElement();
            //await fillTables();
            done();
        });

        it('should return 201', async () => {

            const response = await request(app).post('/item')
                .send({
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
