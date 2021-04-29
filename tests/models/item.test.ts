import {ItemModel} from '../../models/item.model';
import {ItemValidatorService} from '../../services/itemValidator.service';
import {StringEmptyService} from "../../services/stringEmpty.service";

jest.mock('../../services/itemValidator.service', () => {
    return class {
        constructor() {

        }

        isContentValid(content: string): boolean {
            return true;
        }

        isNameNotEmpty(name: string): boolean {
            return true;
        }

        isCreatedDateValid(createdDate: Date): boolean {
            return true;
        }
    }
})

describe('tests the validation for the creation of an item', () => {


    it('Should return true when all the validations are correct', () => {
        let item: ItemModel = new ItemModel("jean", new Date,  "pomme");
        expect(item.isValid()).toBeTruthy();
    });
});