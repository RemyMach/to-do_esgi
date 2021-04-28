interface UserProps {
    email: string;
    firstName: string;
    lastName: string;
    birth_date: Date;
    password: string;
}

export class UserModel implements UserProps{
    birth_date: Date;
    email: string;
    firstName: string;
    lastName: string;
    password: string;

    constructor(birth_date: Date, email: string, firstname: string, lastname: string, password: string) {
        this.birth_date = birth_date;
        this.email = email;
        this.firstName = firstname;
        this.lastName = lastname;
        this.password = password;
    }

    validatePropsAreNotEmpty(): boolean {
        return this.firstName !== "" && this.lastName !== "" && this.email !== "" && this.password !== "";
    }

    validateEmail(): boolean {
        const re = /\S+@\S+\.\S+/;
        return this.email.match(re) !== null;
    }

    validateBirthDateIsLessRecentThan13Years(): boolean {
        const date_before_13_years: Date = new Date();
        date_before_13_years.setUTCFullYear(date_before_13_years.getFullYear() - 13);
        return this.birth_date < date_before_13_years;
    }

    validatePasswordLenght(): boolean {
        return this.password.length >= 8 && this.password.length <= 40;
    }

    isValid(): boolean {

        return this.validatePropsAreNotEmpty() && this.validateEmail() && this.validateBirthDateIsLessRecentThan13Years() && this.validatePasswordLenght();
    }
}