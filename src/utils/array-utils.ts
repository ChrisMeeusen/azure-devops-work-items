/**
 * Blatantly stolen from here:
 * https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
 * Thanks!
 * @param key
 */
export const groupBy = (key: any) => (array: any[]) =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});
