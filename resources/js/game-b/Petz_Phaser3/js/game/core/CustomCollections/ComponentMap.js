import {DynamicMap} from "../System/Collections/DynamicMap.js";

export class ComponentMap extends DynamicMap
    {
    add(key, component, isDisabled)
        {
        this.map.set(key, component);

        if (isDisabled)
            {
            component.setActive  (false);
            component.setVisible (false);
            }

        return component;
        }

    addClones(config, number)
        {
        for (let i = 0; i <number; i ++)
            this.add(config.key + "-" + i.toString(), config.component, config.disabled);
        }

    disableChildren()
        {
        this.map.forEach(function(component)
            {
            if (component.visible)
                {
                component.setActive(false);
                component.setVisible(false);
                }
            });

        }

    enableChildren()
        {
        this.map.forEach(component =>
            {
            if (!component.visible)
                {
                component.setActive  (true);
                component.setVisible (true);
                }
            });
        }

    destroyChildren()
        {
        this.map.forEach(component =>
            {
            component.destroy();
            });
        }

    }
