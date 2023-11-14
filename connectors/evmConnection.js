const { Web3 } = require('web3');

require('dotenv').config();

class EVMConnection {

    abi = [
        {
            "inputs": [],
            "name": "getLastCounter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "taskId",
                    "type": "string"
                }
            ],
            "name": "getResultForTaskId",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "taskType",
                    "type": "string"
                }
            ],
            "name": "getPriceForType",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "taskType",
                    "type": "string"
                }
            ],
            "name": "registerTask",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];
    erc20abi = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    constructor() {
        this.privateKey = process.env.privateKey;
        this.contractAddress = process.env.contractAddress;
        this.endpoint = process.env.endpoint;
        this.tokenAddress = process.env.tokenAddress;
        this.web3 = new Web3(this.endpoint);

        const privateKeyWithPrefix = this.privateKey.startsWith('0x') ? this.privateKey : '0x' + this.privateKey;
        this.account = this.web3.eth.accounts.wallet.add(privateKeyWithPrefix).get(0);
        this.myAddress = this.account.address;
        this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
        this.token = new this.web3.eth.Contract(this.erc20abi, this.tokenAddress);
    }

    getPaymentForTaskType(taskType) {
        return new Promise((resolve, reject) => {
            const getPrice = () => {
                this.contract.methods.getPriceForType(taskType).call()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            };

            getPrice();
        });
    }

    getLastCounter() {
        return new Promise((resolve, reject) => {
            const getCounter = () => {
                this.contract.methods.getLastCounter().call()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            };

            getCounter();
        });
    }

    waitForSolution(taskId) {
        return new Promise((resolve, reject) => {
            const checkSolution = () => {
                this.contract.methods.getResultForTaskId(taskId).call()
                    .then((result) => {
                        if (result.length == 0) {
                            console.log('Checking for solution again in 3 seconds...');
                            setTimeout(checkSolution, 3000);
                        } else {
                            resolve(result);
                        }
                    })
                    .catch((error) => {
                        reject(error);
                    });
            };

            checkSolution();
        });
    }

    async solveTask(task, taskType) {
        try {
            const necessaryPaymentAmount = await this.getPaymentForTaskType(taskType);

            // approving the payment
            const approve = this.token.methods.approve(this.contractAddress, necessaryPaymentAmount);
            const encodedABI = approve.encodeABI();
            const tx = {
                from: this.myAddress,
                to: this.tokenAddress,
                gas: 7000000,
                gasPrice: this.web3.utils.toWei(1.4, 'gwei'),
                data: encodedABI
            };
            const signed = await this.web3.eth.accounts.signTransaction(tx, this.privateKey);
            const receipt = await this.web3.eth.sendSignedTransaction(signed.rawTransaction);

            // registering the task
            const registerTask = this.contract.methods.registerTask(task, taskType);
            const registerTaskEncodedABI = registerTask.encodeABI();
            const registerTaskTX = {
                from: this.myAddress,
                to: this.contractAddress,
                gas: 7000000,
                gasPrice: this.web3.utils.toWei(1.4, 'gwei'),
                data: registerTaskEncodedABI
            };
            const signedRegisterTask = await this.web3.eth.accounts.signTransaction(registerTaskTX, this.privateKey);
            const receiptRegisterTask = await this.web3.eth.sendSignedTransaction(signedRegisterTask.rawTransaction);

            const lastCounter = await this.getLastCounter();
            const taskId = this.myAddress.toLowerCase() + '_' + lastCounter;
            const result = await this.waitForSolution(taskId);
            return result;
        } catch (error) {
            console.error('Failed to register task with contract:', error);

            throw error;
        }
    }


}

module.exports = EVMConnection;