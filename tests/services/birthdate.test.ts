import {DateService} from '../../services/date.service';

describe("Tests to validate the birthdate service", () => {

    let dateService: DateService;
    let test_birthdate: Date;

    beforeEach(() => {
        dateService = new DateService();
        test_birthdate = new Date();
    });

    it("Should return true when called with a valid birthdate", () => {
        test_birthdate = new Date("2000-01-01")
        expect(dateService.isBirthdateValid(test_birthdate)).toBeTruthy();
    });

    it("Should return false when called with an invalid birthdate", () => {
        expect(dateService.isBirthdateValid(new Date())).toBeFalsy();
    });

    it("Should return true when called with a barely legal birthdate", () => {
        test_birthdate.setUTCFullYear(test_birthdate.getFullYear() - 13);
        expect(dateService.isBirthdateValid(test_birthdate)).toBeTruthy();
    });

    it("Should return false when called with a barely illegal birthdate", () => {
        test_birthdate.setUTCFullYear(test_birthdate.getUTCFullYear() - 13);
        test_birthdate.setTime(test_birthdate.getTime() + 1 * 24 * 60 * 60 * 1000);
        expect(dateService.isBirthdateValid(test_birthdate)).toBeFalsy();
    });
})