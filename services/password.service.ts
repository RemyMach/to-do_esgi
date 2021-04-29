export class PasswordService {

    isPasswordValid(password: string): boolean {
        return password.length >= 8 && password.length <= 40;
    }
}