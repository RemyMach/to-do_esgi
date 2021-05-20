import {StringEmptyService} from "./stringEmpty.service";

export class ItemValidatorService {

    stringEmptyService: StringEmptyService

    constructor() {
        this.stringEmptyService = new StringEmptyService();
    }

    isContentValid(content: string): boolean {
        return this.stringEmptyService.isStringNotEmpty(content) && content.length <= 1000;
    }

    isNameNotEmpty(name: string): boolean {
        return this.stringEmptyService.isStringNotEmpty(name);
    }

    isCreatedDateValid(createdDate: Date): boolean {
        return createdDate <= new Date();
    }
}