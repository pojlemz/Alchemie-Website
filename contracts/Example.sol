pragma solidity ^0.4.24;

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract Example {
    // Gold tokens can be traded in for gold bars.

    event Greeting(
        bytes32 _message
    );

    bytes32 public m_message;

    function getLatestGreeting() public constant returns(bytes32) {
        return m_message;
    }

    function greet(bytes32 _message) public {
        m_message = _message;
        emit Greeting(_message);
    }
}