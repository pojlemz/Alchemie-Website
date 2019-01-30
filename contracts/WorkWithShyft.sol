// pragma solidity ^0.4.0;
pragma solidity ^0.4.19;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract WorkWithShyft {
    event dog(uint8 indexed res);
    function callSetAttestation(address _addr, bytes _data) returns (uint8) {
        uint8 result;
        uint256 length = _data.length + 32;

        assembly {
            let x := mload(0x40) // get empty storage location

            let ret := call (gas,
            _addr,
            0, // no wei value passed to function
            _data, // input
            length, // input size
            x, // output stored at input location, save space
            0x01 // output size = 1 bytes // change size based on return value
            )

            result := mload(x)
            mstore(0x40, add(x,0x20)) // update free memory pointer
        }
        emit dog(result);
        return result;
    }
}