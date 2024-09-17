function findArgument(arg) {
    return process.argv.includes(arg);
}

function getValueOfArgument(arg) {
    if (!findArgument) return null;
    const value = process.argv[process.argv.indexOf(arg) + 1];
    return {
        arg,
        value
    }
}

module.exports = {
    findArgument,
    getValueOfArgument
}