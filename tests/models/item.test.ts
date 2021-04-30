import {ItemModel} from '../../models/item.model';
import {ItemValidatorService} from '../../services/itemValidator.service';


jest.mock('../../services/itemValidator.service');


describe('tests the validation for the creation of an item', () => {


    it('Should return true when all the validations are correct', () => {
        ItemValidatorService.prototype.isCreatedDateValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isNameNotEmpty = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isContentValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        let item: ItemModel = new ItemModel("", new Date,  "");
        expect(item.isValid()).toBeTruthy();
    });

    it('Should return false when isNameNotEmpty is not valid', () => {
        ItemValidatorService.prototype.isCreatedDateValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isNameNotEmpty = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        ItemValidatorService.prototype.isContentValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        let item: ItemModel = new ItemModel("", new Date,  "");
        expect(item.isValid()).toBeFalsy();
    });

    it('Should return false when isContentValid is not valid', () => {
        ItemValidatorService.prototype.isCreatedDateValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isNameNotEmpty = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isContentValid = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        let item: ItemModel = new ItemModel("", new Date,  "");
        expect(item.isValid()).toBeFalsy();
    });

    it('Should return false when isCreatedDateValid is not valid', () => {
        ItemValidatorService.prototype.isCreatedDateValid = jest.fn().mockImplementationOnce(() => {
            return false;
        });
        ItemValidatorService.prototype.isNameNotEmpty = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        ItemValidatorService.prototype.isContentValid = jest.fn().mockImplementationOnce(() => {
            return true;
        });
        let item: ItemModel = new ItemModel("", new Date,  "");
        expect(item.isValid()).toBeFalsy();
    });
});