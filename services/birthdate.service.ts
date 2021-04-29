export class BirthdateService {

    isBirthdateValid(birthdate: Date): boolean {
        birthdate.setUTCFullYear(birthdate.getUTCFullYear() + 13);
        return birthdate.getTime() <= (new Date()).getTime();
    }
}