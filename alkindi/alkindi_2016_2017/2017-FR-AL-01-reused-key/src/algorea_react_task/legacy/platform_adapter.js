
export default function (platform) {

    function initWithTask (task) {
        return new Promise(function (resolve, reject) {
            platform.initWithTask(task, resolve, reject);
        });
    }

    function getTaskParams (key, defaultValue) {
        return new Promise(function (resolve, reject) {
            platform.getTaskParams(key, defaultValue, resolve, reject);
        });
    }

    function askHint (hintToken) {
        return new Promise(function (resolve, reject) {
            platform.askHint(hintToken, resolve, reject);
        });
    }

    function validate (mode) {
        return new Promise(function (resolve, reject) {
            platform.validate(mode, resolve, reject);
        });
    }

    return {initWithTask, getTaskParams, askHint, validate};

}
