pragma solidity ^0.4.11;

import './Standard223Token.sol';

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract GoldToken is Standard223Token  {
    // Gold tokens can be traded in for gold bars.

    address public m_signer;
    address public m_cosigner;
    address public m_administrator;

    mapping (bytes32 => bool) public m_signedConfirmationNumbers; // this variable is used to approve confirmation numbers by the signer
    mapping (bytes32 => bool) public m_cosignedConfirmationNumbers; // this variable is used to approve confirmation numbers by the cosigner
    mapping (bytes32 => address) public m_mintConfirmationRecipient; // A mapping from confirmations to recipients

    mapping (uint => bytes32) public m_shippingEmails;
    uint public m_shippingCount;

    function setAdministrator(address _newAdministrator) public { // sets a new administrator
        if (msg.sender == m_administrator) { // If this transaction is coming from the administrator
            m_administrator = _newAdministrator; // Assign a new administrator based on argument
        }
    }

    function setSigner(address _newSigner) public { // Sets a new signer
        if (msg.sender == m_administrator) { // If this transaction is coming from the administrator
            m_signer = _newSigner; // Assign a new signer based on argument
        }
    }

    function setCosigner(address _newCosigner) public { // Sets a new cosigner
        if (msg.sender == m_administrator) { // If this transaction is coming from the administrator
            m_cosigner = _newCosigner; // Assign a new cosigner based on argument
        }
    }

    // Note: As soon as we both sign and cosign a confirmation number then minting occurs
    function mintAndSign(bytes32 _confirmationNumber, address _recipient) public { // Signs and mints if cosigned as well
        if (!m_signedConfirmationNumbers[_confirmationNumber]) { // If confirmation number has not been signed yet.
            m_signedConfirmationNumbers[_confirmationNumber] = true; // Sign this confirmation number.
            m_mintConfirmationRecipient[_confirmationNumber] = _recipient; // Sets the recipient of this confirmation number.
            if (m_cosignedConfirmationNumbers[_confirmationNumber]) { // If confirmation number has been cosigned.
                mint(_recipient); // Mint one unit of tokens for confirmation number and recipient.
            }
        }
    }

    function mintAndCosign(bytes32 _confirmationNumber) public { // Cosigns and mints if signed as well
        if (!m_cosignedConfirmationNumbers[_confirmationNumber]) { // If confirmation number has not been cosigned yet.
            m_cosignedConfirmationNumbers[_confirmationNumber] = true; // Cosign this confirmation number.
            if (m_signedConfirmationNumbers[_confirmationNumber]) { // If confirmation number has been signed.
                mint(m_mintConfirmationRecipient[_confirmationNumber]); // Mint one unit of tokens for confirmation number and recipient.
            }
        }
    }

    function mint(address _recipient) internal { // Mints a fresh balance
        balances[_recipient] = balances[_recipient].add(1000000000000000000); // Mint a fresh balance of tokens for the product.
    }

    function burn(bytes32 _emailOfOwner) public { // Burns tokens in exchange for a shipment
        if (balances[msg.sender] >= 1000000000000000000){ // If the token balance exceeds the amount required for a product shipment
            balances[msg.sender] = balances[msg.sender].sub(1000000000000000000); // Subtract the tokens from the user sending the message
            m_shippingEmails[m_shippingCount] = _emailOfOwner; // Set email of owner
            m_shippingCount++; // Increase the shipping count for the message sender
        }
    }
}