# BAI Project Waves Blockchain API

This repository contains the NodeJS API for interacting with the BAI project's contracts on the Waves blockchain. It provides a convenient way to solve tasks using the blockchain and waits for the task's solutions.

## Installation

Before using this API, ensure you have Node.js installed on your system. You can check your current version with `node -v`. To set up the API, follow these steps:

1. Clone the repository to your local machine.
2. Navigate to the root directory of the cloned repository.
3. Install the necessary node modules by running `npm install`.

## Configuration

To configure the API, create a `.env` file in the root of your project directory with the following contents:

```env
type='Waves'
seed='<Your_Seed>'
contractAddress='3N9tKixzqTYWnEXQxrDQ5pBTGvQd6sFsvmV'
nodeURL='https://nodes-testnet.wavesnodes.com'
network='testnet'
```

for using the Waves network. In case of an EVM based network, the corresponding .env file should look like the following example:

```env
type='evm'
contractAddress = '<the address of the main BAI contract>'
privateKey = '<your private key>'
endpoint = '<your endpoint, e.g., from alchemy, ...>'
tokenAddress = '<the contract address of the ERC20 BAI token on the network>'
```

Replace the corresponding parameters with your actual settings to interact with the blockchain.

## Usage
Here's a quick example to use the API to solve a task:

```JavaScript
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
```

This script initializes the API, sends a task to the blockchain, and logs the solution once it's ready.

## API Reference

### `solveTask(task, taskType)`

Sends a task to the blockchain for solving and returns the solution.

- `task`: The task description or objective.
- `taskType`: The type of task to register on the blockchain.

## Modules

### `BAIAPI.js`

This is the main API module that abstracts the `WavesConnection` to interact with the Waves blockchain.

### `wavesConnection.js`

Handles direct interactions with the Waves blockchain, such as sending tasks, retrieving task prices, and waiting for task solutions.

## Contributing
If you'd like to contribute to the project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licensing
The code in this project is licensed under MIT license.