/**
 * @return {number}
 */
export function Lerp(start, end, delta)
    {
    return Phaser.Math.Interpolation.Linear([start, end], delta);
    //return (start * (1.0 - delta)) + (end * delta);
    }

/**
 * @return {number}
 */
export function Clamp(value, min, max)
    {
    const lowerValue = Math.max(value, min);
    return Math.min(lowerValue, max);
    }
