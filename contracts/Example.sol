pragma solidity ^0.4.24;

/**
 * @title Reference implementation of the ERC223 standard token.
 */
contract Example {
    // Gold tokens can be traded in for gold bars.

    event Greeting(
        string _message
    );

    string public m_message;

    function getLatestGreeting() public constant returns(string) {
        return m_message;
    }

    function greet(string _message) public {
        m_message = _message;
        emit Greeting(_message);
    }
}