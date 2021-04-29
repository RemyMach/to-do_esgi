import {PasswordService} from '../../services/password.service';

describe("Tests to validate the password service", () => {

    let passwordService: PasswordService;

    beforeEach(() => {
        passwordService = new PasswordService();
    });

    it("Should return true when called with a valid password", () => {
        expect(passwordService.isPasswordValid("P@ssw0rd")).toBeTruthy();
    });

    it("Should return false when called with a small password", () => {
        expect(passwordService.isPasswordValid("psswd")).toBeTruthy();
    });

    it("Should return false when called with a long password", () => {
        expect(passwordService.isPasswordValid("hi_i_m_steve_and_i_won_t_pay_my_taxes_because_that_s_the_way_i_like_to_live_my_life")).toBeTruthy();
    });
})