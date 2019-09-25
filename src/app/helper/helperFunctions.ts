export class HelperFunctions {
    public static checkForValidBoolean(val: any): boolean {
        if (typeof val !== 'boolean') {
            return false;
        }

        return true;
    }

    // public static removeItemFromArrayAtIndex(array: any[], i: number): boolean {
    //     if (i < 0 || i > array.length) {
    //         return false;
    //     }

    //     array.splice(i, 1);
    //     return true;
    // }

    // public static removeItemFromArray(array: any[], item: any): boolean {
    //     const i = array.indexOf(item);
    //     if (i === -1) {
    //         return false;
    //     }

    //     return this.removeItemFromArrayAtIndex(array, i);
    // }
}
