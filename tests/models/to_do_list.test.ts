import {ToDoListModel} from "../../models/to_do_list.model";
import {Item} from "../../models/item.model";

describe("Test to validate ToDoList model and methods", () => {

    let to_do_list_model: ToDoListModel;

    beforeEach(() => {
        to_do_list_model = new ToDoListModel();
    });

    it("Test addNewItem method", async () => {
        expect(await to_do_list_model.getNumberOfItem()).toEqual(0);
        await to_do_list_model.addNewItem(new Item("Test", new Date(19, 1, 2000), "Me"));
        expect(await to_do_list_model.getNumberOfItem()).toEqual(1);
    });
})
