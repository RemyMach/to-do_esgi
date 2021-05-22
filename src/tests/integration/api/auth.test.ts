import request from "supertest";
import app from '../../../app';
import {validationResult} from "express-validator";
import {UserController} from "../../../controllers/user.controller";
import {destroyTablesElement, fillTables} from "../../fixtures";
import {SessionController} from "../../../controllers/session.controller";

describe('Determine the auth routes behavior', () => {

    let errorParam: any;
    let userController: UserController;
    let sessionController: SessionController;

    beforeAll(async (done) => {
        userController = await UserController.getInstance();
        sessionController = await SessionController.getInstance();
        done();
    });

    beforeEach(async (done) => {
        errorParam = {
            errors: [ { message: 'The input provided is invalid' } ]
        }
        await destroyTablesElement();
        await fillTables();
        done();
    });

    describe('Test the creation of a user', () => {

        let birthDateValid: string;

        beforeAll(async () => {
            const date = new Date();
            date.setUTCFullYear(new Date().getUTCFullYear() -13);
            birthDateValid  = date.toISOString();
        });



        it('should return 400 because the firstName is empty', async () => {

            errorParam['errors'][0]['fields'] = { firstName: [ 'le firstName ne peut pas être vide' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: '',
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();

        });

        it('should return 400 because the lastName is empty', async () => {
            errorParam['errors'][0]['fields'] = { lastName: [ 'le lastName ne peut pas être vide' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because firstName is not provide', async () => {
            errorParam['errors'][0]['fields'] = { firstName: [ 'le firstName ne peut pas être vide' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because lastName is not provide', async () => {
            errorParam['errors'][0]['fields'] = { lastName: [ 'le lastName ne peut pas être vide' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because email have not the good format', async () => {
            errorParam['errors'][0]['fields'] = { email: [ 'Email must be in a valid format' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because password is not provide', async () => {
            errorParam['errors'][0]['fields'] = { password: [ 'le mot de passe doit-être entre 8 et 40 carractères' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because password have less than 8 characters', async () => {
            errorParam['errors'][0]['fields'] = { password: [ 'le mot de passe doit-être entre 8 et 40 carractères' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "a".repeat(7),
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should  return 400 because password have more than 40 characters', async () => {
            errorParam['errors'][0]['fields'] = { password: [ 'le mot de passe doit-être entre 8 et 40 carractères' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "a".repeat(41),
                    birthDate: birthDateValid
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should return 400 because birthDate is missing', async () => {
            errorParam['errors'][0]['fields'] = { birthDate: [ 'le paramètre birthDate ne peut pas être manquant' ]  };
            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                }).expect(400);
            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should not work because a birthdate is not a date', async () => {
            errorParam['errors'][0]['fields'] = { birthDate: [ 'le paramètre birthDate ne peut pas être manquant' ]  };

            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: "pomme"
                }).expect(400);
            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should not work because the birthdate is under 13 years', async () => {
            errorParam['errors'][0]['fields'] = { birthDate: [ 'le user est trop jeune pour s\'incrire, il doit minimum avoir 13 ans' ]  };

            const date_less_12_years = new Date();
            date_less_12_years.setUTCFullYear(date_less_12_years.getFullYear() - 12);

            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'tom@example.com',
                    password: "azertyuiop",
                    birthDate: date_less_12_years.toISOString()
                }).expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('tom@example.com');
            expect(user).toBeNull();
        });

        it('should work beacause all parameters are good', async () => {
            const validParam = {
                    "firstName": "remy",
                    "lastName": "pomme",
                    "user": "jean@pomme.uk"
                 };

            const response = await request(app).post('/auth/subscribe')
                .send({
                    firstName: "remy",
                    lastName: "pomme",
                    email: 'jean@pomme.uk',
                    password: "azertyuiop",
                    birthDate: birthDateValid
                }).expect(201);

            //test return body
            expect(response.body).toEqual(validParam);

            //test user not insert in the db
            const user = await userController.getUserByEmail('jean@pomme.uk');
            expect(user).not.toBeNull();
        });
    });

    describe("Test the login of a user", () => {

        it('should return 400 because the login and password are not filled', async () => {
            errorParam['errors'][0]['fields'] = { email: [ 'Email must be in a valid format' ] , password: ["Invalid value"]};

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because the login is not filled', async () => {
            errorParam['errors'][0]['fields'] = { email: [ 'Email must be in a valid format' ]  };

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    password: 'azertyuiop'
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because the password is not filled', async () => {
            errorParam['errors'][0]['fields'] = { password: ["Invalid value"]};

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    email: 'jean@pomme.fr'
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because the password is not filled', async () => {
            errorParam['errors'][0]['fields'] = {  password: ["Invalid value"]};

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    email: 'jean@pomme.fr'
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because the email doesn\'t exist in the db', async () => {
            errorParam['errors'][0]['fields'] = { user: [ 'le login et / ou le mot de passe est incorrect' ]  };

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    email: 'pomme@jean.fr',
                    password: 'azertyuiop'
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 400 because the password is not the good one for the email', async () => {
            errorParam['errors'][0]['fields'] = { user: [ 'le login et / ou le mot de passe est incorrect' ]  };

            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    email: 'jean@pomme.fr',
                    password: 'azertyuiopo'
                })
                //test status
                .expect(400);

            //test return body
            expect(response.body).toEqual(errorParam);

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions);

        });

        it('should return 200 because the login and password are valid', async () => {
            const sessions = await sessionController.getAllSessions();
            const numberSessions = sessions.length;

            const response = await request(app).post('/auth/login')
                .send({
                    email: "jean@pomme.fr",
                    password: "azertyuiop"
                })
                //test status
                .expect(200);

            //test return body
            expect(response.body).toHaveProperty('token');

            //test user not insert in the db
            expect(await sessionController.getAllSessions()).toHaveLength(numberSessions + 1);

        });
    })
});
