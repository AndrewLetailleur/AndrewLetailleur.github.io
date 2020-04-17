export function Vector2(x = 0, y = 0)
    {
    this.x = x;
    this.y = y;
    }

Vector2.prototype.SetRelative = function (x,y)
    {
    this.x += x;
    this.y += y;
    };

Vector2.prototype.Set = function (x,y)
    {
    this.x = x;
    this.y = y;
    };

Vector2.prototype.Scale = function (scale)
    {
    this.x *= scale;
    this.y *= scale;
    };

Vector2.prototype.Scale = function (x, y)
    {
    this.x *= x;
    this.y *= y;
    };

Vector2.prototype.toString = function()
    {
    return "Vector2: (" + this.x + "," + this.y + ")";
    };