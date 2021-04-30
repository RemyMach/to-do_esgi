import {ToDoListModel} from "../../models/toDoList.model";
import {ItemModel} from "../../models/item.model";

describe("Test to validate ToDoList model and methods", () => {

    let to_do_list_model: ToDoListModel;

    beforeEach(() => {
        to_do_list_model = new ToDoListModel();
    });

    it("Test addNewItem method", async () => {
        expect(await to_do_list_model.getNumberOfItem()).toEqual(0);
        await to_do_list_model.addNewItem(new ItemModel("Test", new Date(19, 1, 2000), "Me"));
        expect(await to_do_list_model.getNumberOfItem()).toEqual(1);
    });
})
