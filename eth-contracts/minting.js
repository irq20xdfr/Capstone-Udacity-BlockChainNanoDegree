// adaptaed from: https://github.com/ProjectOpenSea/opensea-creatures/blob/master/scripts/mint.js

const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const MNEMONIC = "[hidden for security]" //infura mnemonic
const INFURA_KEY = "[hidden for security]" 
const NFT_CONTRACT_ADDRESS = "0x8b324b459845203efCE7Af262aBd978E6228e19d" //SolnSquareVerifier  Contract (deployed to rinkeby)
const OWNER_ADDRESS = "0x28f2fAe714FDcF85d9FC01Ea837641Ecfbe035EB" //my rinkeby address
const NETWORK = "rinkeby"
const NUM_CREATURES = 12


if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const NFT_CONTRACT = require('./build/contracts/solnSquareVerifier');
const NFT_ABI = NFT_CONTRACT.abi; 
console.log(NFT_ABI);

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )

    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, {from: OWNER_ADDRESS, gasLimit: "1000000" })
        console.log(nftContract);

        for (var i = 0; i < NUM_CREATURES; i++) {
            try {
                const result = await nftContract.methods.mint(OWNER_ADDRESS, 3).send({from: OWNER_ADDRESS, gas: 553000});
            } catch (e) {
                console.log(`Encountered error while minting`, e.message);
            }
       }

    }
}

main()