import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

const semicolon = {
  begin: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAkCAYAAACNBsqdAAAABHNCSVQICAgIfAhkiAAAAdBJREFUSImt1r1rFEEYx/HvSOIZsfAUJYKkiggWWljFQlFMKTYptLL0H7C6wsJC7CzEXkSw0kIECxECKcRCQUEQLIKgEhs7Bd/4WmRXj9md2bf8qt1jns/uzTO7O6ioDIk6p07Uh+qO8sdBsLqkvvN/zg+C1bF6y2peqft7weoZdb0GLXOjE6yO1GsZsMzF1nDx1582gDfVfWVBI6zOq88z4Fv1RFyUhVug19WddYVJWN2rrmXQldwd1cJuNupBBj2dRBvgyxl0OYumYPWwupFALzSidXDDFNxXt/eFzybQz+piKzSG1V3qkwQ8aY3WwMfS/fJIF3dbdH4qMW4V+NQLVueA1DLaAL71goE9wKHEuLUQwu8u8MzUcQB+JMbdVpeK43K5fQCeFRf9Xqkom6ceUF9nmpfLJaP1PT0Vf4DqldvlDvBYHdfBs8A4ruiQZeBKHZyb47aZlOt9GhYYDYQBjsfwV2B9C+DdMfyL/s2r5B9cPAB3txwu8hJ4M9AcVeAQwscCH5IXQO2LftH89imXR+Z2m+q5nvDRaST1lV7piJ6MgdyGZUG9avqLrXpPXYhrQ4mGEJLdUGeAeeAgm++UWeAn8D6E8KWuJqTudmj+Atakw9OnF0WmAAAAAElFTkSuQmCC",
  end: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAkCAYAAACNBsqdAAAABHNCSVQICAgIfAhkiAAAAeBJREFUSIm11rFrFEEUgPFv4pnEs1KJCkpEiAgWSZFCIkQQtVLRIoWCiGAh+CdYWFikEizsrYRUWlgJBzYWVloISkBEC5GrjJ1Ehc/ibsPeZmdud+/yYFlm5u3vZmd4sxdUdiJCbEA9BJwAJoG//es70A0h/Es8Fx2YVZ8Zj676QJ2Nwdtw9WwCLIuVobA6XxPN4koUVqfVlw3hr+pcDF5uiGbxtAhP9NunI5tcNRbVo/mODN4cEZ4HFsvgccQttbUTcBvYXYR/jQE+Duwvwu/GAG+SOyImAEIIn4DVEeEpYKvk8mv8COiMAG/QO6gG4RDCBnAZuN0QbgO7tryyDLUNLAPngWP97j/9+80I/AG4RO9orR/qvUhZr6tHiiVdFW3Re5Oy+Az8zBp1C2QvcDgy1gkh/K7p9UI9lTjhFvo59ZcCuBbpfwV8aTrbOfVHZLYXcnnxD2oJOqmuRdDn6lRT+HoE7aonC7nVYPViYsPuluQPh9VzCXRgCSrD6koCfaMeiDxXDqttdTWBvlVjRRL9J3RG/dgU3QarM+rjBKjaUfel0AFYvTEEVH1oyUal4BawkMj7BtwJIbyughZ/4aD6vmSWT6q8emzGWeNqDlxXl2rPMAJPqy/U++qepmge/g/a1Juv6l0yFQAAAABJRU5ErkJggg==",
};

export const charBlock = new BlockBuilder("text_char")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .addDummyInput("")
  .addImageField(semicolon.begin, 12, 12)
  .addTextField("SYMBOL", "")
  .addImageField(semicolon.end, 12, 12)
  .setOutput("char")
  .setTooltip("This block returns a character value.")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block, generator) => {
    const code = block.getFieldValue("SYMBOL");
    return [`'${code}'`, generator.ORDER_ATOMIC];
  })
  .build();
