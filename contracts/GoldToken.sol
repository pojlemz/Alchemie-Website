pragma solidity ^0.4.24;

import './Standard223Token.sol';

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract GoldToken is Standard223Token  {
    // Gold tokens can be traded in for gold bars.

    event Ship(
        string _emailOfOwner
    );

    address public m_signer;
    address public m_cosigner;
    address public m_administrator;

    mapping (bytes32 => bool) public m_isConfirmationNumberSigned; // this variable is used to approve confirmation numbers by the signer
    mapping (bytes32 => bool) public m_isConfirmationNumberCosigned; // this variable is used to approve confirmation numbers by the cosigner
    mapping (bytes32 => address) public m_mintConfirmationRecipient; // A mapping from confirmations to recipients

    // constructor
    constructor() public {
        m_administrator = msg.sender;
        m_signer = msg.sender;
        m_cosigner = msg.sender;
    }

    // Getter functions
    function getAdministrator() public constant returns(address){
        return m_administrator;
    }

    function getSigner() public constant returns(address){
        return m_signer;
    }

    function getCosigner() public constant returns(address){
        return m_cosigner;
    }

    function getSignedConfirmationNumber(bytes32 _confirmationNumber) public constant returns(bool){
        return m_isConfirmationNumberSigned[_confirmationNumber];
    }

    function getCosignedConfirmationNumber(bytes32 _confirmationNumber) public constant returns(bool){
        return m_isConfirmationNumberCosigned[_confirmationNumber];
    }

    function getRecipientFromConfirmationNumber(bytes32 _confirmationNumber) public constant returns(address){
        return m_mintConfirmationRecipient[_confirmationNumber];
    }

    modifier onlyAdmin() {
        require(msg.sender == m_administrator);
        _;
    }

    // Setter/Main functionality
    function setAdministrator(address _newAdministrator) public onlyAdmin() { // sets a new administrator
            m_administrator = _newAdministrator; // Assign a new administrator based on argument
    }

    function setSigner(address _newSigner) public onlyAdmin() { // Sets a new signer
            m_signer = _newSigner; // Assign a new signer based on argument
    }

    function setCosigner(address _newCosigner) public onlyAdmin() { // Sets a new cosigner
            m_cosigner = _newCosigner; // Assign a new cosigner based on argument
    }

    // Note: As soon as we both sign and cosign a confirmation number then minting occurs
    function abba() public returns(bool) {
        return false;
    }

    // Note: As soon as we both sign and cosign a confirmation number then minting occurs
    function mintAndSign(bytes32 _confirmationNumber, address _recipient) public returns(bool) { // Signs and mints if cosigned as well
        require(msg.sender == m_signer);
        if (!m_isConfirmationNumberSigned[_confirmationNumber]) { // If confirmation number has not been signed yet.
            m_isConfirmationNumberSigned[_confirmationNumber] = true; // Sign this confirmation number.
            m_mintConfirmationRecipient[_confirmationNumber] = _recipient; // Sets the recipient of this confirmation number.
            if (m_isConfirmationNumberCosigned[_confirmationNumber]) { // If confirmation number has been cosigned.
                mint(_recipient); // Mint one unit of tokens for confirmation number and recipient.
                return true;
            }
        }
        return false;
    }

    function mintAndCosign(bytes32 _confirmationNumber) public returns(bool) { // Cosigns and mints if signed as well
        require(msg.sender == m_cosigner);
        if (!m_isConfirmationNumberCosigned[_confirmationNumber]) { // If confirmation number has not been cosigned yet.
            m_isConfirmationNumberCosigned[_confirmationNumber] = true; // Cosign this confirmation number.
            if (m_isConfirmationNumberSigned[_confirmationNumber]) { // If confirmation number has been signed.
                mint(m_mintConfirmationRecipient[_confirmationNumber]); // Mint one unit of tokens for confirmation number and recipient.
                return true;
            }
        }
        return false;
    }

    function mint(address _recipient) internal { // Mints a fresh balance
        balances[_recipient] = balances[_recipient].add(1000000000000000000); // Mint a fresh balance of tokens for the product.
    }

    function burnAndShip(string _emailOfOwner) public { // Burns tokens in exchange for a shipment
        if (balances[msg.sender] >= 1000000000000000000){ // If the token balance exceeds the amount required for a product shipment
            balances[msg.sender] = balances[msg.sender].sub(1000000000000000000); // Subtract the tokens from the user sending the message
            emit Ship(_emailOfOwner);
        }
    }
}