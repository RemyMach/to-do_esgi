import {ToDoListModel} from "../../models/toDoList.model";
import {ItemModel} from "../../models/item.model";
import {ToDoListValidatorService} from "../../services/toDoListValidator.service";
import {DateService} from "../../services/date.service";
import {EmailService} from "../../services/email.service";

describe("Test to validate ToDoList addNewItem method", () => {

    let toDoList: ToDoListModel;
    let newItem: ItemModel;

    beforeEach(() => {
        toDoList = new ToDoListModel();
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
        EmailService.prototype.sendEmail = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(toDoList.addNewItem(newItem)).toBe(newItem);
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
        EmailService.prototype.sendEmail = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(toDoList.addNewItem(newItem)).toBe(newItem);
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
        EmailService.prototype.sendEmail = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(toDoList.addNewItem(newItem)).toBe(null);
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
        EmailService.prototype.sendEmail = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(toDoList.addNewItem(newItem)).toBe(null);
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
        EmailService.prototype.sendEmail = jest.fn().mockImplementation(() => {
            return true;
        });
        expect(toDoList.addNewItem(newItem)).toBe(null);
    });

    it("getItem return newItem if he exist", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return newItem;
        });
        expect(toDoList.getItem(newItem.name)).toBe(newItem);
    });

    it("getItem don't return newItem if he doesn't exist", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return null;
        });
        expect(toDoList.getItem(newItem.name)).toBe(null);
    });

    it("item list should be updated if the item name exist in the list", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return newItem;
        });
        expect(toDoList.updateItem(newItem.name, "new content")).toBe(newItem);
    });

    it("item list shouldn't be updated if the item name exist in the list", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return null;
        });
        expect(toDoList.updateItem(newItem.name, "new content")).toBe(null);
    });

    it("item list should be delete if the item name exist in the list", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return newItem;
        });
        expect(toDoList.deleteItem(newItem.name)).toBeTruthy();
    });

    it("item list shouldn't be updated if the item name exist in the list", async () => {
        ToDoListValidatorService.prototype.searchItemByName = jest.fn().mockImplementation(() => {
            return null;
        });
        expect(toDoList.deleteItem(newItem.name)).toBeFalsy();
    });
})
