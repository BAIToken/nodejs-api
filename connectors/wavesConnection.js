const {invokeScript, broadcast} = require("@waves/waves-transactions");
const request = require("request-promise-native");

require('dotenv').config();

class WavesConnection {

    constructor() {
        this.seed = process.env.seed;
        this.nodeURL = process.env.nodeURL;
        this.chainId = 87;
        this.contractAddress = process.env.contractAddress;
        this.network = process.env.network;

        if (this.network === 'testnet') {
            this.chainId = 84;
        }
    }

    getPaymentForTaskType(taskType) {
        return new Promise((resolve, reject) => {
            const getPrice = () => {
                request.get(`${this.nodeURL}/addresses/data/${this.contractAddress}/price_${taskType}`)
                    .then(result => resolve(JSON.parse(result).value))
                    .catch(error => {
                        resolve(0);
                        console.log('Could not get price for task type...');
                    });
            };

            getPrice();
        });
    }

    waitForSolution(taskId) {
        return new Promise((resolve, reject) => {
            const checkSolution = () => {
                request.get(`${this.nodeURL}/addresses/data/${this.contractAddress}/${taskId}`)
                    .then(result => resolve(result))
                    .catch(error => {
                        console.log('Checking for solution again in 3 seconds...');
                        setTimeout(checkSolution, 3000);
                    });
            };

            checkSolution();
        });
    }

    async solveTask(task, taskType) {
        try {
            const functionCall = {
                function: 'registerTask',
                args: [
                    { type: 'string', value: task },
                    { type: 'string', value: taskType }
                ]
            };

            const necessaryPaymentAmount = await this.getPaymentForTaskType(taskType);

            const payment = [{
                assetId: 'AxGKQRxKo4F2EbhrRq6N2tdLsxtMnpzQsS4QemV6V1W1',
                amount: necessaryPaymentAmount
            }];

            const tx = invokeScript({
                dApp: this.contractAddress,
                call: functionCall,
                payment: payment,
                chainId: this.chainId
            }, this.seed);

            const taskId = tx.id + '_' + tx.senderPublicKey + '_result_' + taskType;
            await broadcast(tx, this.nodeURL);
            const result = await this.waitForSolution(taskId);
            return JSON.parse(result).value;
        } catch (error) {
            console.error('Failed to register task with contract:', error);

            throw error;
        }
    }


}

module.exports = WavesConnection;