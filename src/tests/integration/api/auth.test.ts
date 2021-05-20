import request from "supertest";
import app from '../../../app';
import {validationResult} from "express-validator";

describe('Determine the auth routes behavior', () => {

    describe('Test the creation of a user', () => {

        let birthDateValid: string;

        beforeAll(() => {
            const date = new Date();
            date.setUTCFullYear(new Date().getUTCFullYear() -13);
            birthDateValid  = date.toISOString();
        });



        it('should return 400 because the firstName is empty', async () => {
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: '',
                    lastName: "pomme",
                    email: 'remy@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);

        });

        it('should return 400 because the lastName is empty', async () => {
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "",
                    email: 'remy@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because firstName is not provide', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    lastName: "pomme",
                    email: 'remy@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because lastName is not provide', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    email: 'remy@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because email have not the good format', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because password is not provide', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'remy@example.com',
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because password have less than 8 characters', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'remy@example.com',
                    password: "a".repeat(7),
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should  return 400 because password have more than 40 characters', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'remy@example.com',
                    password: "a".repeat(41),
                    birthDate: birthDateValid
                }).expect(400);
        });

        it('should return 400 because birthDate is missing', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'remy@example.com',
                    password: "azertyuiop",
                }).expect(400);
        });

        it('should not work because a birthdate is not a date', async () => {

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'rem@example.com',
                    password: "azertyuiop",
                    birthDate: "pomme"
                }).expect(400);
        });

        it('should not work because the birthdate is under 13 years', async () => {
            const date_less_12_years = new Date();
            date_less_12_years.setUTCFullYear(date_less_12_years.getFullYear() - 12);

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 're@exmple.com',
                    password: "azertyuiop",
                    birthDate: date_less_12_years.toISOString()
                }).expect(400);
            console.log(date_less_12_years.toISOString())
        });

        it('should work beacause all parameters are godd', async () => {
            const date_less_12_years = new Date();
            date_less_12_years.setUTCFullYear(date_less_12_years.getFullYear() - 12);

            await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'pomme@pomme.example',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(201);
        });
    });
});
