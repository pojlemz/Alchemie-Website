pragma solidity ^0.4.4;

import "./ConvertLib.sol";
import "./EIP20Interface.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract BUGToken is EIP20Interface {
    uint256 constant private MAX_UINT256 = 2**256 - 1;
    mapping (address => uint256) public balances;
    mapping (address => mapping (address => uint256)) public allowed;

    mapping (uint8 => address) administrator; // The uint8 corresponds to the administrator index.
    mapping (uint8 => mapping (uint8 => address)) administratorVote; // The uint8 corresponds to the administrator index in both cases.

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show.
    string public symbol;                 //An identifier: eg SBX

    function BUGToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
    ) public {
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);
        balances[msg.sender] -= _value;
        balances[_to] += _value;
        Transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        uint256 allowance = allowed[_from][msg.sender];
        require(balances[_from] >= _value && allowance >= _value);
        balances[_to] += _value;
        balances[_from] -= _value;
        if (allowance < MAX_UINT256) {
            allowed[_from][msg.sender] -= _value;
        }
        Transfer(_from, _to, _value);
        return true;
    }

    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }

    function allowance(address _owner, address _spender) public view returns (uint256 remaining) {
        return allowed[_owner][_spender];
    }

    function mint(address _to, uint256 _value) {
        if (msg.sender == 0 || msg.sender ==  1 || msg.sender == 2){
            balances[_to] += _value;
        }
    }

    function redeem(address _to, uint256 _value) {
        if (msg.sender == 0 || msg.sender ==  1 || msg.sender == 2){
            if (_value <= balances[_to]){
                balances[_to] -= _value;
            }
        }
    }

    // This function enables a way for users to provide 2 of 3 style votes to
    function voteToReassignAdministrator(uint8 _votingAdministratorType, uint8 _delegateAdministratorType, address _addressVote) {
        if (msg.sender == administrator[_votingAdministratorType]) {
            uint8 totalVotes = 0;
            administratorVote[_votingAdministratorType][_delegateAdministratorType] = _addressVote;
            if (administratorVote[0][_delegateAdministratorType] == _addressVote){
                totalVotes++;
            }
            if (administratorVote[1][_delegateAdministratorType] == _addressVote){
                totalVotes++;
            }
            if (administratorVote[2][_delegateAdministratorType] == _addressVote){
                totalVotes++;
            }
            if (totalVotes >= 2){
                administrator[_delegateAdministratorType] = _addressVote;
            }
        }
    }
}