import {DateService} from '../../services/date.service';
import {ItemModel} from "../../models/item.model";

describe("Tests to validate the email service", () => {

    let dateService: DateService;
    let oldItem: ItemModel;
    let newItem: ItemModel;

    beforeEach(() => {
        dateService = new DateService();
        oldItem = new ItemModel(0, "content", new Date(), "name1");
        newItem = new ItemModel(0, "content", new Date(), "name2");
    });

    it("Should return true when called with a valid creation date", () => {
        oldItem.createdAt = new Date(oldItem.createdAt.getTime() - 60 * 60 * 1000);
        expect(dateService.isItemCreationDateStamped(oldItem, newItem)).toBeTruthy();
    });

    it("Should return true when called with an invalid creation date", () => {
        expect(dateService.isItemCreationDateStamped(oldItem, newItem)).toBeFalsy();
    });

    it("Should return true when called with a barely allowed creation date", () => {
        oldItem.createdAt = new Date(oldItem.createdAt.getTime() - 30 * 60 * 1000);
        expect(dateService.isItemCreationDateStamped(oldItem, newItem)).toBeFalsy();
    });
})
