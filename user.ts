interface UserProps {
    email: string;
    firstName: string;
    lastName: string;
    birth_date: Date;

}

export class User implements UserProps{
    birth_date: Date;
    email: string;
    firstName: string;
    lastName: string;

    constructor(birth_date: Date, email: string, name: string, surname: string) {
        this.birth_date = birth_date;
        this.email = email;
        this.firstName = name;
        this.lastName = surname;
    }

    validateEmail(): boolean {
        const re = /\S+@\S+\.\S+/;
        return this.email.match(re) !== null;
    }

    validatePropsAreNotEmpty(): boolean {
        return this.firstName !== "" && this.lastName !== "" && this.email !== "";
    }

    validateBirthDateIsLessRecentThan13Years(): boolean {
        const date_before_13_years: Date = new Date();
        date_before_13_years.setUTCFullYear(date_before_13_years.getFullYear() - 13);
        return this.birth_date < date_before_13_years;
    }

    isValid(): boolean {

        return this.validatePropsAreNotEmpty() && this.validateEmail() && this.validateBirthDateIsLessRecentThan13Years();
    }
}