import * as Info from "../../core/System/system-info.js";

export class PetData
    {
    constructor(name)
        {
        this.name = name;
        this.age = 0;

        this.hunger = 100;
        this.clean = 100;
        this.stage = 0;

        this.key = "";

        this.initializeStats(1, 1, 1, 1, 1);
        this.DOB = new Date();

        //this.realtimeAge = Info.DateInfo.DayDifference(this.DOB, Date.now());
        }

    initializeStats(strength, agility, power, intelligence, fun)
        {
        this.strength       = strength;
        this.agility        = agility;
        this.power          = power;
        this.intelligence   = intelligence;
        this.fun            = fun;
        }

    get PetSystemInfo()
        {
        //return `Date of Creation: \n${Info.DateInfo.GetUTCDate(this.DOB)} \n\n` +
        //    `Realtime Days Alive:\n${this.realtimeAge}`;
        }

    get PetStatInfo()
        {
        return `Strength: ${this.strength}\n` +
            `Agility: ${this.agility}\n` +
            `Power: ${this.power}\n` +
            `Intelligence: ${this.intelligence}\n` +
            `Fun: ${this.fun}`;
        }

    get PetBasicInfo()
        {
        return `Name: ${this.name}\n` +
            `Age: ${this.age}\n`;
        }

    UpdateData()
        {
        //this.realtimeAge = (Info.DateInfo.DayDifference(this.DOB, Date.now())).toFixed(5);
        }
    }