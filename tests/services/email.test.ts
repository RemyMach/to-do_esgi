describe("Tests to validate the email service", () => {

    let emailService: EmailService;

    beforeEach(() => {
        emailService = new EmailService();
    });

    it("Should return true when called with a valid email", () => {
        expect(emailService.isEmailValid("email@domain.com")).toBeTruthy();
    });

    it("Should return false when called with an invalid email", () => {
        expect(emailService.isEmailValid("email_address")).toBeFalsy();
    });

    it("Should return true when called with an empty string", () => {
        expect(emailService.isEmailValid("")).toBeFalsy();
    });

    it("Should return true when called with a valid email", () => {
        // @ts-ignore
        expect(emailService.isEmailValid(null)).toThrowError("Invalid type");
    });
})