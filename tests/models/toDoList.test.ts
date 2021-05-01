import {ToDoListModel} from "../../models/toDoList.model";
import {ItemModel} from "../../models/item.model";
import {ToDoListValidatorService} from "../../services/toDoListValidator.service";
import {DateService} from "../../services/date.service";

describe("Test to validate ToDoList addNewItem method", () => {

    let to_do_list_model: ToDoListModel;
    let newItem: ItemModel;

    beforeEach(() => {
        to_do_list_model = new ToDoListModel();
        newItem = new ItemModel("Test", new Date(19, 1, 2000), "Me");
    });

    it("If item list is empty, the new item should be added", async () => {
        ToDoListValidatorService.prototype.itemsIsEmpty = jest.fn().mockImplementation(() => {
            return true;
        });
        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.newItemNameIsUnique = jest.fn().mockImplementation(() => {
            return false;
        });
        DateService.prototype.isItemCreationDateStamped = jest.fn().mockImplementation(() => {
            return false;
        });
        expect(to_do_list_model.addNewItem(newItem)).toBe(newItem);
    });

    it("If item list is not empty but the new item pass all condition he should be added", async () => {
        ToDoListValidatorService.prototype.itemsIsEmpty = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return true;
        });
        ToDoListValidatorService.prototype.newItemNameIsUnique = jest.fn().mockImplementation(() => {
            return true;
        });
        DateService.prototype.isItemCreationDateStamped = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(to_do_list_model.addNewItem(newItem)).toBe(newItem);
    });

    it("If item list is full the new item shouldn't be added", async () => {
        ToDoListValidatorService.prototype.itemsIsEmpty = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.newItemNameIsUnique = jest.fn().mockImplementation(() => {
            return true;
        });
        DateService.prototype.isItemCreationDateStamped = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(to_do_list_model.addNewItem(newItem)).toBe(null);
    });

    it("If newItem name is not unique the new item shouldn't be added", async () => {
        ToDoListValidatorService.prototype.itemsIsEmpty = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return true;
        });
        ToDoListValidatorService.prototype.newItemNameIsUnique = jest.fn().mockImplementation(() => {
            return false;
        });
        DateService.prototype.isItemCreationDateStamped = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(to_do_list_model.addNewItem(newItem)).toBe(null);
    });

    it("If there is not 30 minutes between the last item and the newItem he shouldn't be added", async () => {
        ToDoListValidatorService.prototype.itemsIsEmpty = jest.fn().mockImplementation(() => {
            return false;
        });
        ToDoListValidatorService.prototype.itemsIsNotFull = jest.fn().mockImplementation(() => {
            return true;
        });
        ToDoListValidatorService.prototype.newItemNameIsUnique = jest.fn().mockImplementation(() => {
            return true;
        });
        DateService.prototype.isItemCreationDateStamped = jest.fn().mockImplementation(() => {
            return false;
        });
        expect(to_do_list_model.addNewItem(newItem)).toBe(null);
    });
})
