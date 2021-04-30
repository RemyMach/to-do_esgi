import {ItemValidatorService} from '../../services/itemValidator.service';

describe("Tests to validate the email service", () => {

    let itemValidatorService: ItemValidatorService ;

    beforeEach(() => {
        itemValidatorService = new ItemValidatorService();
    });

    it("Should return false because item name is empty", () => {
        expect(itemValidatorService.isNameNotEmpty("")).toBeFalsy();
    });

    it("Should return false when content have more than 1000 characters", () => {

        const word: string = "a".repeat(1001);
        expect(itemValidatorService.isContentValid(word)).toBeFalsy();
    });

    it("Should return false when content is empty", () => {

        expect(itemValidatorService.isContentValid("")).toBeFalsy();
    });

    it("Should return true when content have length > or equal to 1000 characters", () => {

        const word: string = "a".repeat(1000);
        expect(itemValidatorService.isContentValid(word)).toBeTruthy();
    });

    it("Should return false createdAt is higher than now", () => {
        const date: Date = new Date();
        date.setMinutes(date.getMinutes()+ 1);
        expect(itemValidatorService.isCreatedDateValid(date)).toBeFalsy();
    });

    it("Should return true when createdAt is less or equal to now", () => {

        expect(itemValidatorService.isCreatedDateValid(new Date())).toBeTruthy();
    });
})