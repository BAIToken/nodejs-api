const WavesConnection = require('./connectors/wavesConnection');
const EVMConnection = require('./connectors/evmConnection');

require('dotenv').config();

class BAIAPI {

    constructor() {
        const type = process.env.type;

        if (type == 'Waves') {
            this.blockchainConnection = new WavesConnection();
        } else if (type == 'evm') {
            this.blockchainConnection = new EVMConnection();
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

