export class BirthdateService {

    isBirthdateValid(birthdate: Date): boolean {
        return (new Date()).getUTCFullYear() - birthdate.getUTCFullYear() >= 13;
    }
}