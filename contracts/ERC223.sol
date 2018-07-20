pragma solidity ^0.4.8;

import "./ERC20/ERC20.sol";

contract ERC223 is ERC20 {
  function transfer(address to, uint value, bytes data) returns (bool ok);
  function transferFrom(address from, address to, uint value, bytes data) returns (bool ok);
}