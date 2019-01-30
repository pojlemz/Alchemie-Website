const ethers = require('ethers')
const Wallet = ethers.Wallet
const providers = ethers.providers
// change ContractName to the name of your contract
const contractJson = require('../build/contracts/WorkWithShyft.json')
const abiEncoder = new ethers.utils.AbiCoder()

const abi = contractJson.abi;
const truffleDeployedAddress = contractJson.networks[1].address;

let addressOfContractToCall = "0x12Ef9a5337Bbb37f57b48C72f522a8D75668510F"
let provider = new providers.JsonRpcProvider("http://localhost:8545", "unspecified")
let wallet = new Wallet("0xa3103bd5cae0c3aa456df2aa7c72717c558031068d3cd895883e1828b02c87e9")
wallet = wallet.connect(provider)
let addressOfDeployed = truffleDeployedAddress;

const deploy = async() => {
    // copy your private key here

    // change url if needed
    let contractFactory = new ethers.ContractFactory( contractJson.abi , contractJson.bytecode , wallet )
    let contract = await contractFactory.deploy()
    await provider.waitForTransaction(contract.deployTransaction.hash)
    let receipt = await provider.getTransactionReceipt(contract.deployTransaction.hash)
    console.log("contract deployed")

    return contract
}

const connect = () => {
    return new ethers.Contract(addressOfDeployed, contractJson.abi, wallet)
}

const call = async() =>
{
    let contract = connect();
    // let contract = await
    // deploy()
    // these are the parameters
    let _identifiedAddress = "0xF58E01Ac4134468F9Ad846034fb9247c6C131d8C";
    let _jurisdiction = 2
    let _effectiveTime = 2
    let _expiryTime = 4
    let _publicData = "0x1234"
    let _documentsEncrypted = "0x1234"
    let _documentAvailabilityEncrypted = "0x2df38c20d937d95920d9306f5dbd6780d28fe064d7dbef72d27b08671e955561"

    // format calldata with abiEncoder
    let parameters = abiEncoder.encode(["address", "uint16", "uint64", "uint64", "bytes", "bytes", "bytes32"],
        [_identifiedAddress, _jurisdiction, _effectiveTime, _expiryTime, _publicData, _documentsEncrypted, _documentAvailabilityEncrypted])

    // generate hash of function signature
    let hash = ethers.utils.id("setAttestation(address,uint16,uint64,uint64,bytes,bytes,bytes32)")
    // let hash = ethers.utils.keccak256(signature)
    console.log(hash);
    let calldata = `${hash.slice(0,10)}${parameters.slice(2)}`
    console.log(calldata);

    let tx = await
    contract.functions.callSetAttestation(addressOfContractToCall, calldata)
    await
    provider.waitForTransaction(tx.hash)
    let receipt = await
    provider.getTransactionReceipt(tx.hash)
    console.log(receipt)
    console.log(receipt.logs[0].topics)
}

call()