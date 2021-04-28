import {UserModel} from '../models/user.model';


describe('tests the validation for th user props', () => {

    let user: UserModel;

    beforeEach(() => {
        const date_less_14_years: Date = new Date();
        date_less_14_years.setUTCFullYear(date_less_14_years.getFullYear() - 14);
        user = new UserModel(date_less_14_years, "pomme@pomme.fr", "jean", "tom" );
    });

    it('Should return false because email is not an email', () => {

        user.email = "pomme";
        expect(user.isValid()).toBe(false);
    });

    it('Should return false because name is empty', () => {

        user.firstName = "";
        expect(user.isValid()).toBe(false);
    });

    it('Should return false because surname is empty', () => {

        user.lastName = "";
        expect(user.isValid()).toBe(false);
    });

    it('Should return false because email is empty', () => {

        user.email = "";
        expect(user.isValid()).toBe(false);
    });

    it('Should return false because year is higher than 13 years', () => {

        const date_higher_13_years: Date = new Date();
        date_higher_13_years.setUTCFullYear(date_higher_13_years.getFullYear() - 12);
        user.birth_date = date_higher_13_years;
        expect(user.isValid()).toBe(false);
    });

    it('Should return valid the user because field are ok', () => {

        expect(user.isValid()).toBe(true);
    });
});