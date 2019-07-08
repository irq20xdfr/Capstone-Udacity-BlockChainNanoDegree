var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});

            // TODO: mint multiple tokens
            for (let i=0; i<8; i++) {
                await this.contract.mint(account_one, i);
            }
        })

        it('should return total supply', async function () { 
            let total = await this.contract.totalSupply();
            assert.equal(total, 8, "The totalSupply should be 8");
        })

        it('should get token balance', async function () { 
            let balance = await this.contract.balanceOf(account_one);
            assert.equal(balance.toNumber(), 8, "The balance of account_one should be 8");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let _tokenURI = await this.contract.tokenURI.call(1, {from: account_one});
            assert(_tokenURI == "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", "The tokenURI is not right"); 
        })

        it('should transfer token from one owner to another', async function () { 
            let tokenId=1;
            await this.contract.approve(account_two, tokenId, {from: account_one});
            await this.contract.transferFrom(account_one, account_two, tokenId, {from: account_one});
            
            // check new owner is the right one
            currentOwner = await this.contract.ownerOf.call(tokenId);
            assert.equal(currentOwner, account_two, "The owner should be account_two");    
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(account_six,5,{from: account_two});
            } catch (e) {
                failed = true;
            }
    
            assert.equal(failed, true, "should fail since address is not contract owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.owner.call({from: account_one});
            assert.equal(owner, account_one, "The owner should be account_one"); 
        })

    });
})