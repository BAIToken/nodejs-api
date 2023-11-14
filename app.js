const BAIAPI = require('./BAIAPI');

(async () => {
    const apiInstance = new BAIAPI();

    try {
        const solution = await apiInstance.solveTask('Who was Kurt Gödel?', 'chatgpt');

        console.log('Solution: ', solution);
    } catch (error) {
        console.error('Error:', error);
    }
})();
