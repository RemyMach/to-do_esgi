import {ToDoListModel} from "../../models/toDoList.model";
import {ItemModel} from "../../models/item.model";
import {ToDoListValidatorService} from "../../services/toDoListValidator.service";

describe("Test to validate ToDoList model and methods", () => {

    let to_do_list_model: ToDoListModel;
    let to_do_list_validator_service: ToDoListValidatorService;

    beforeEach(() => {
        to_do_list_model = new ToDoListModel();

        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return true;
        });
        ToDoListValidatorService.prototype.checkLastItemInsertTime = jest.fn().mockImplementation(() => {
            return true;
        });
    });

    it("Test addNewItem method", async () => {
        const newItem = new ItemModel("Test", new Date(19, 1, 2000), "Me");
        expect(to_do_list_model.addNewItem(newItem)).toBe(newItem);
    });
})
