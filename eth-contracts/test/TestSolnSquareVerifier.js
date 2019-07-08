let SquareVerifier = artifacts.require('SquareVerifier');
let SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

let correctproof = require('../../zokrates/code/square/proof');
contract('TestSolnSquareVerifier', accounts => {
    
        const account_one = accounts[0];
        const account_two = accounts[1];
    
        beforeEach(async function () { 
            const _SquareVerifier = await SquareVerifier.new({from:account_one});
            this.contract = await SolnSquareVerifier.new(_SquareVerifier.address, {from: account_one});
        })

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('if a new solution can be added for contract', async function(){
            let canAdd=true;
            try{
            await this.contract.CheckSolMintToken(account_two, 2, correctproof.proof.A, correctproof.proof.A_p, 
                correctproof.proof.B, correctproof.proof.B_p, correctproof.proof.C, correctproof.proof.C_p, correctproof.proof.H, 
                correctproof.proof.K, correctproof.input, {from:account_one});
            }
            catch(e)
            {
                canAdd = false;
            }
            assert.equal(canAdd,true,"Solution cannot be added");
        }) 

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('Test if an ERC721 token can be minted for contract', async function(){
            let canMint = true;
            try{
                await this.contract.mintToken(account_two, 2, correctproof.proof.A, correctproof.proof.A_p, correctproof.proof.B, correctproof.proof.B_p, correctproof.proof.C, correctproof.proof.C_p, correctproof.proof.H, correctproof.proof.K, correctproof.input, {from:account_one});
            }
            catch(e) {
                canMint = false;
            }
                assert.equal(canMint, true, "This token could not be minted");
            })
});