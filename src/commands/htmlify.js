/**
 * TODO:
 * 1. Need create a template html file for this command to be filled up by palette
 * 2. Handle additional options for tablifying, and output files based on colors
 */
var preCommandCheck = require('../lib/argParser');
const { USAGE_STRINGS } = require('../constants');

module.exports = {
    name: 'htmlify',
    run: async (toolbox) => {
        const { print, colorQuantifier, imagePrimer, paletteReporter } = toolbox;

        // Step 1: Gather params and options from CLI input.
        let params = toolbox.parameters.string;
        let options = toolbox.parameters.options;

        // Only continue with execution if proper input was supplied
        if (preCommandCheck(params)) {
            var spinner;

            try {
                // Load image source, gracefully exit if image source is null.
                spinner = print.spin('Loading Image');
                let imageBuffer = await imagePrimer.loadImage(params);

                // Draw image on canvas
                spinner.succeed('Image Loaded. Building Image Canvas...');
                let imageCanvas = await imagePrimer.buildCanvas(imageBuffer);
                spinner.succeed('Image Canvas Built. Analyzing Image...');

                // Build color palette by analyzing image colors
                let colorPalette = await colorQuantifier(imageCanvas);
                spinner.succeed('🌄 Analysis Complete. Building Color Palette...');

                // Output resulting palette based on options
                spinner.stopAndPersist({ symbol: '🎨', text: 'Color Palette Ready!' });
                paletteReporter.printColorTable(colorPalette);
            } catch (error) {
                spinner.fail(error);
            }
        } else {
            print.error(`Usage: ${USAGE_STRINGS['htmlify']}`);
        }
    },
};
