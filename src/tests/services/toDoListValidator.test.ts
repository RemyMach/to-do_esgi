import {DateService} from '../../services/date.service';
import {ToDoListModel} from "../../models/toDoList.model";
import {ToDoListValidatorService} from "../../services/toDoListValidator.service";
import {ItemModel} from "../../models/item.model";

describe("Tests to validate the toDoList service", () => {

    let dateService: DateService;
    let toDoListValidatorService: ToDoListValidatorService;
    let toDoList: ToDoListModel;
    let itemCreationDate: Date;
    let newItem: ItemModel;

    beforeEach(() => {
        dateService = new DateService();
        toDoListValidatorService = new ToDoListValidatorService();
        toDoList = new ToDoListModel(1, "list test", []);
        itemCreationDate = new Date();
        itemCreationDate.setUTCFullYear(itemCreationDate.getFullYear() - 5);
        newItem = new ItemModel(0, "Test", itemCreationDate, "Me");
    });

    it("The item list should not be full if there is less than 10 items in it", () => {
        toDoList.items = new Array(5).fill(newItem);
        expect(toDoListValidatorService.itemsIsNotFull(toDoList.items)).toBeTruthy();
    });

    it("The item list should be full if there is 10 items in it", () => {
        toDoList.items = new Array(10).fill(newItem);
        expect(toDoListValidatorService.itemsIsNotFull(toDoList.items)).toBeFalsy();
    });

    it("The item list should not be empty if there is items in it", () => {
        toDoList.items = new Array(5).fill(newItem);
        expect(toDoListValidatorService.itemsIsEmpty(toDoList.items)).toBeFalsy();
    });

    it("The item list should be empty if there is no items in it", () => {
        expect(toDoListValidatorService.itemsIsEmpty(toDoList.items)).toBeTruthy();
    });

    it("Test getLastItem", () => {
        const testItem = new ItemModel(0, "Other test", itemCreationDate, "You");
        toDoList.items = new Array(5).fill(newItem);
        toDoList.items.push(testItem);
        expect(toDoListValidatorService.getLastItem(toDoList.items)).toBe(testItem);
    });

    it("Test getNumberOfItem", () => {
        const numberOfItems = 6;
        toDoList.items = new Array(numberOfItems).fill(newItem);
        expect(toDoListValidatorService.getNumberOfItem(toDoList.items)).toBe(numberOfItems);
    });

    it("The newItem name should be unique", () => {
        toDoList.items = new Array(5).fill(newItem);
        const testItem = new ItemModel(0, "Other test", itemCreationDate, "You");
        expect(toDoListValidatorService.newItemNameIsUnique(toDoList.items, testItem)).toBeTruthy();
    });

    it("The newItem name shouldn't be unique", () => {
        toDoList.items = new Array(5).fill(newItem);
        expect(toDoListValidatorService.newItemNameIsUnique(toDoList.items, newItem)).toBeFalsy();
    });

    it("searchItemByName should return newItem if newItem is in item list", () => {
        toDoList.items = new Array(1).fill(newItem);
        expect(toDoListValidatorService.searchItemByName(newItem.name, toDoList.items)).toBe(newItem);
    });

    it("searchItemByName should return null if newItem isn't in item list", () => {
        expect(toDoListValidatorService.searchItemByName("Something that doesn't exist", toDoList.items)).toBe(undefined);
    });

    it("updateItemContent should return the same item list if the item name doesn't exist", () => {
        toDoList.items = new Array(5).fill(newItem);
        const testItem = new ItemModel(0, "Other test", itemCreationDate, "You");
        expect(toDoListValidatorService.updateItemContent(testItem.name, "En fait non", toDoList.items)).toStrictEqual(toDoList.items);
    });

    it("updateItemContent should only modify testItem1 content", () => {
        const testItem1 = new ItemModel(0, "Other test", itemCreationDate, "You");
        const testItem2 = new ItemModel(0, "test again", itemCreationDate, "You again");
        toDoList.items = [testItem1, testItem2];

        toDoList.items = toDoListValidatorService.updateItemContent("You", "test", toDoList.items);
        const newTestItem1 = new ItemModel(0, "test", itemCreationDate, "You");

        expect(toDoList.items[0]).toStrictEqual(newTestItem1);
        expect(toDoList.items[1]).toStrictEqual(testItem2);
    });

    it("deleteItemByName should return the same item list if the item name doesn't exist", () => {
        toDoList.items = new Array(5).fill(newItem);
        const testItem = new ItemModel(0, "Other test", itemCreationDate, "You");
        expect(toDoListValidatorService.deleteItemByName(testItem.name, toDoList.items)).toStrictEqual(toDoList.items);
    });

    it("updateItemContent should only delete testItem1", () => {
        const testItem1 = new ItemModel(0, "Other test", itemCreationDate, "You");
        const testItem2 = new ItemModel(0, "test again", itemCreationDate, "You again");
        toDoList.items = [testItem1, testItem2];

        expect(toDoListValidatorService.deleteItemByName(testItem1.name, toDoList.items)).toStrictEqual([testItem2]);
    });
})
