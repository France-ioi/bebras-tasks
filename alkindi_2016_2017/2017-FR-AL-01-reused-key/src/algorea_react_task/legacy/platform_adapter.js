
export default function (platform) {

    function initWithTask (task) {
        return new Promise(function (resolve, reject) {
            platform.initWithTask(task, resolve, reject);
        });
    }

    function validate (mode) {
        return new Promise(function (resolve, reject) {
            platform.validate(mode, resolve, reject);
        });
    }

    return {initWithTask, validate};

}
