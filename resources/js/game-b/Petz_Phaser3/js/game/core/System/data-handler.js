import "../../phaser.js";

export default class DataHandler
    {
    static SaveObject(key, value)
        {
        localStorage.setItem(key, JSON.stringify(value));
        // console.log(`Saved object as ${key}:\n${JSON.stringify(value)}`);
        }

    static GetObject(key)
        {
        return JSON.parse(localStorage.getItem(key));
        }

    static Exists(key)
        {
        return JSON.parse(localStorage.getItem(key)) != null;
        }

    static RemoveObject(key)
        {
        localStorage.removeItem(key);
        // console.log(`Removed object with key ${key}.`);
        }
    }