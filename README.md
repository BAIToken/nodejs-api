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
contractAddress = '<the address of the task BAI contract>'
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

## `Contract Addresses`

### Waves mainnet: 
- BAI Token: [2fdzyHvXGCqaz1XA8m9fodemmP9giVBcpe4Jq9F63oFL](https://wavesexplorer.com/assets/2fdzyHvXGCqaz1XA8m9fodemmP9giVBcpe4Jq9F63oFL)
- BAI Tasks: [3PMu8gHthb5uQgpqDvUQ3GZGdovPvypoMQ5](https://wavesexplorer.com/addresses/3PMu8gHthb5uQgpqDvUQ3GZGdovPvypoMQ5)

### BNB mainnet: 
- BAI Token: [0x10Da043D0B46e43B53B74a88AC60CCC28e2AFDf8](https://bscscan.com/token/0x10Da043D0B46e43B53B74a88AC60CCC28e2AFDf8)
- BAI Tasks: [0xbEfd1Ac0eF34136f3F4E2baCc878bea99b45951F](https://bscscan.com/address/0xbEfd1Ac0eF34136f3F4E2baCc878bea99b45951F)

### Base Mainnet: 
- BAI Token: [0x6a27CD26a373530835B9fE7aC472B3e080070F64](https://basescan.org/token/0x6a27CD26a373530835B9fE7aC472B3e080070F64)
- BAI Tasks: [0xC9C19f5ac2433b4B96d8AaAca6890598801f626F](https://basescan.org/address/0xC9C19f5ac2433b4B96d8AaAca6890598801f626F)

## `Available Task Types`

### Simple Text Request:
chatgpt, orca, gemini, llama3

### Image Generation:
dalle, stable-diffusion

### Video Summarize:
youtube

### Discussion:
discussion

### Brainstorming:
brainstorm

*[Fee and extra details:](https://docs.blockai.dev/bai/contracts)*

## Contributing
If you'd like to contribute to the project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licensing
The code in this project is licensed under MIT license.
