const BAIAPI = require('./BAIAPI');

(async () => {
    const apiInstance = new BAIAPI();

    try {
        const solution = await apiInstance.solveTask('Create a picture of Kurt Gödel', 'dalle');

        console.log('Solution: ', solution);
    } catch (error) {
        console.error('Error:', error);
    }
})();
