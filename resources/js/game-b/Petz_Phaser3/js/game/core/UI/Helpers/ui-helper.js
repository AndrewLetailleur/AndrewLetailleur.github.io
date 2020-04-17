import "../../../phaser.js";

/**
 * An abstract UI container to place and position UI elements
 */
export class UIContainer
    {
    constructor(min, max)
        {
        this.min = min;
        this.max = max;
        }

    get GetLength()
        {
        return this.max - this.min;
        }

    Lerp(targetValue)
        {
        let amount = this.LerpAmount(targetValue);

        //(1 - t) * a + (t * b)
        return this.min * (1 - amount) + this.max * amount;
        }

    LerpCentered(value, t)
        {
        return this.Lerp(value * t) + value/2;
        }

    LerpAmount(targetValue)
        {
        return targetValue/this.GetLength;
        }
    }

export class HorizontalGroup
    {
    /**
     *@type {UIContainer} container
     *@type {Number} groupCount
     */
    constructor(container, groupCount)
        {
        this.container = container;
        this.count = groupCount;
        this.elements = [groupCount];

        this.currentIndex = 0;
        }

    get GetCount()
        {
        return this.count;
        }

    get GetSpacing()
        {
        return this.container.GetLength/this.GetCount;
        }


    addElement(element)
        {
        if (this.currentIndex === this.count - 1)
            return;

        this.elements[this.currentIndex] = element;
        }

    updateElementPosition(index)
        {
        if (index >= this.count)
            index = this.count - 1;
        else
        if (index < 0)
            index = 0;

        return this.container.LerpCentered(this.GetSpacing, index);
        }
    }