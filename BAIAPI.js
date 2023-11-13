const WavesConnection = require('./wavesConnection');

require('dotenv').config();

class BAIAPI {

    constructor() {
        const type = process.env.type;

        if (type == 'Waves') {
            this.blockchainConnection = new WavesConnection();
        }
    }

    async solveTask(task, taskType) {
        try {
            return await this.blockchainConnection.solveTask(task, taskType);
        } catch(error) {
            console.log('Problem solving the task: ' + error);
        }
    }

}

module.exports = BAIAPI;

