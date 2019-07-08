pragma solidity >=0.4.21 <0.6.0;
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./Verifier.sol";
import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>


contract SquareVerifier is Verifier{}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is  ERC721MintableComplete{
    SquareVerifier public verifierContract;
    constructor(address verifierAddress)
    ERC721MintableComplete() 
    public
    {
        verifierContract = SquareVerifier(verifierAddress);

    }



// TODO define a solutions struct that can hold an index & an address
struct Solutions{
    uint tokenId;
    address to;
}


// TODO define an array of the above struct
Solutions[] SolutionsArray;


// TODO define a mapping to store unique solutions submitted
mapping (bytes32 => Solutions) private uniqueSolutions;



// TODO Create an event to emit when a solution is added
event SolutionAdded(uint tokenid,address to);



// TODO Create a function to add the solutions to the array and emit the event
function AddSolution(address _to, uint _tokenId, bytes32 key)
public
{
    Solutions memory _soln = Solutions({tokenId:_tokenId,to:_to});
    SolutionsArray.push(_soln);
    uniqueSolutions[key] = _soln;
    emit SolutionAdded(_tokenId,_to);
}


function CheckSolMintToken(address _to,uint _tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input)
            public
            
{
     // check if solution is valid
    require(verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "solution not valid");
    bytes32 key = keccak256(abi.encodePacked(a,a_p,b,b_p,c,c_p,h,k,input));
    require(uniqueSolutions[key].to == address(0),"Solution already used.");    
       
    AddSolution(_to,_tokenId,key);
      
}


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function mintToken(address _to, uint _tokenId,
        uint[2] memory a,
        uint[2] memory a_p,
        uint[2][2] memory b,
        uint[2] memory b_p,
        uint[2] memory c,
        uint[2] memory c_p,
        uint[2] memory h,
        uint[2] memory k,
        uint[2] memory input)
        public
{
    bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));
    require(uniqueSolutions[key].to == address(0), "The solution is already used.");
    require(verifierContract.verifyTx(a, a_p, b, b_p, c, c_p, h, k, input), "This solution is already used.");
    
    AddSolution(_to, _tokenId, key);
    super.mint(_to, _tokenId);
}


}
  


























