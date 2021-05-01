import {DateService} from '../../services/date.service';
import {ToDoListModel} from "../../models/toDoList.model";
import {ToDoListValidatorService} from "../../services/toDoListValidator.service";
import {ItemModel} from "../../models/item.model";

describe("Tests to validate the toDoList service", () => {

    let dateService: DateService;
    let toDoListValidatorService: ToDoListValidatorService;
    let toDoList: ToDoListModel;
    let newItem: ItemModel;

    beforeEach(() => {
        dateService = new DateService();
        toDoListValidatorService = new ToDoListValidatorService();
        toDoList = new ToDoListModel();
        newItem = new ItemModel("Test", new Date(19, 1, 2000), "Me");
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
        const testItem = new ItemModel("Other test", new Date(19, 1, 2000), "You");
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
        const testItem = new ItemModel("Other test", new Date(19, 1, 2000), "You");
        expect(toDoListValidatorService.newItemNameIsUnique(toDoList.items, testItem)).toBeTruthy();
    });

    it("The newItem name shouldn't be unique", () => {
        toDoList.items = new Array(5).fill(newItem);
        expect(toDoListValidatorService.newItemNameIsUnique(toDoList.items, newItem)).toBeFalsy();
    });
})
