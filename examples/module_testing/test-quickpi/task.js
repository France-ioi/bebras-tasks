function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 0,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                quickpi: {
                    //     ["turnLedOn", "turnLedOff", "buttonState", "waitForButton", "setLedState", "displayText", "readTemperature", "sleep", "buttonState"]
                    basic: ["turnLedOn", "turnLedOff", "readTemperature", "sleep", "buttonState"],
                    easy: [
                            "sleep",
                            "currentTime",
                            "turnLedOn",
                            "turnLedOff",
                            "setLedState",
                            "toggleLedState",

                            "waitForButton",
                            "buttonWasPressed",

                            "setServoAngle",
                            "displayText",

                            "readTemperature",
                            "getTemperature",
                            "readRotaryAngle",
                            "readDistance",
                            "readLightIntensity",

                            "setBuzzerState",
                            "setBuzzerNote",
                            "getBuzzerNote",

                            "displayText",
                            "drawPoint",
                            "clearScreen",
                            "drawLine",
                            "drawRectangle",
                            "drawCircle",
                            "fill",
                            "noFill",
                            "stroke",
                            "noStroke",
                            "updateScreen",
                            "autoUpdate",

                            "readAcceleration",
                            "computeRotation",
                            "readSoundLevel",
                            "readMagneticForce",
                            "computeCompassHeading",
                            "readInfraredState",
                            "setInfraredState",
                            "readAngularVelocity",
                            "setGyroZeroAngle",
                            "computeRotationGyro"
                            ],
                    medium: ["displayText", "waitForButton"],
                    hard: ["readRotaryAngle", "readDistance"],
                }
            },
            standardBlocks: {
                includeAll: true,
                //wholeCategories: ["logic", "loops", "math", "variables"],
                //wholeCategories: ["loops"],
                singleBlocks: {
                    basic: ["controls_if_else"],
                    easy: ["controls_infiniteloop", "logic_boolean", "controls_if_else", "controls_if"],
                    medium: ["controls_whileUntil", "logic_boolean", "controls_if_else", "controls_if"],
                    hard: ["controls_whileUntil", "logic_boolean"]
                },
            },
        },
        maxIterWithoutAction: 100000,

        customSensors: true,

        quickPiSensors: {
            easy: "default",
        }
    };

    subTask.data = {
        easy: [{
            autoGrading: false,
            testName: "Expérimenter",
        }],
    };

    initBlocklySubTask(subTask);
}

displayHelper.avatarType = "none";
displayHelper.timeoutMinutes = 0;
//initWrapper(initTask, null, null);
initWrapper(initTask, ["easy"], "easy", true);


/*
setTimeout(function() {
    task.displayedSubTask.blocklyHelper._aceEditor.setValue(
        'from quickpi import *\n' +
        //'drawCircle(32, 16, 32) \n' +
        //'clearScreen()\n' +
        'displayText("screen1", "line1 text", "line2 text")\n'+
        'drawCircle(64, 16, 32) \n' +
        'drawRectangle(0, 0, 16, 16)\n' +
        'drawLine(0, 0, 127, 31)\n' +
        'drawLine(0, 31, 127, 0)\n' + 
        'drawPoint(120, 15)'
    );
}, 50)

*/