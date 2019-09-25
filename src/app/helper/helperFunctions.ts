export class HelperFunctions {
    public static checkForValidBoolean(val: any): boolean {
        if (typeof val !== 'boolean') {
            return false;
        }

        return true;
    }
}
