export class DynamicMap
    {
    constructor()
        {
        this._map = new Map();
        }

    clear()
        {
        this._map = new Map();
        }

    delete(key)
        {
        return this._map.delete(key);
        }

    get (key)
        {
        return this._map.get(key);
        }

    has (key)
        {
        return this._map.has(key);
        }

    add (key, value)
        {
        this._map.set(key, value);
        return this.get(key);
        }

    get map ()
        {
        return this._map;
        }
    }