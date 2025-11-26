// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title QuestToken
 * @dev ERC20 token for Celo Runner game rewards
 * Players earn these tokens by completing game stages
 */
contract QuestToken is ERC20, Ownable {
    
    // Address of the game contract that can mint tokens
    address public gameContract;
    
    event GameContractUpdated(address indexed oldContract, address indexed newContract);
    
    constructor() ERC20("Quest Token", "QUEST") Ownable(msg.sender) {
        // Initial supply can be minted to owner if needed
        // _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Set the game contract address that can mint tokens
     * @param _gameContract Address of the CeloRunner contract
     */
    function setGameContract(address _gameContract) external onlyOwner {
        require(_gameContract != address(0), "Invalid address");
        address oldContract = gameContract;
        gameContract = _gameContract;
        emit GameContractUpdated(oldContract, _gameContract);
    }
    
    /**
     * @dev Mint tokens to a player (only callable by game contract)
     * @param _to Address to mint tokens to
     * @param _amount Amount of tokens to mint
     */
    function mint(address _to, uint256 _amount) external {
        require(msg.sender == gameContract, "Only game contract can mint");
        require(_to != address(0), "Cannot mint to zero address");
        _mint(_to, _amount);
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param _amount Amount of tokens to burn
     */
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }
}
