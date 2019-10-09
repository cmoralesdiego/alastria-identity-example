const {tokensFactory} = require('alastria-identity-lib')
const fs = require('fs')

let rawdata = fs.readFileSync('./configuration.json')
let config = JSON.parse(rawdata)

// Data
const rawPublicKey = config.rawPublicKey
const rawPrivateKey = config.rawPrivateKey
const tokenPayload = config.tokenPayload
// End data

console.log("---- signJWT ----")

// console.log("\tFunction arguments: Token payload, Raw Public Key")
// console.log("\t\tToken payload:\n", tokenPayload)
// console.log("\t\tRaw Public key:", rawPublicKey)

const signedJWT = tokensFactory.tokens.signJWT(tokenPayload, rawPrivateKey)
console.log('\tThe signed JWT is: ', signedJWT)

console.log("\n---- decodeJWT ----")

// console.log("\tFunction arguments: signed JWT")
// console.log("\t\tSigned JWT:", signedJWT)

let decodedJWT = tokensFactory.tokens.decodeJWT(signedJWT)
console.log('\tThe decoded token is: \n', decodedJWT)

console.log("\n---- verifyJWT ----")

// console.log("\tFunction arguments: signed JWT, Raw Public Key")
// console.log("\t\tSigned JWT:", signedJWT)
// console.log("\t\tRaw Public key:", rawPublicKey)

let verifyJWT = tokensFactory.tokens.verifyJWT(signedJWT, rawPublicKey)
console.log('\tIs the signedJWT verified?', verifyJWT)

// Data
let context = config.context
let userPublicKey = config.userPublicKey
let didIsssuer = config.didIsssuer
let providerURL = config.providerURL
let callbackURL = config.callbackURL
let alastriaNetId = config.alastriaNetId
let tokenExpTime = config.tokenExpTime
let tokenActivationDate = config.tokenActivationDate
let jsonTokenId = config.jsonTokenId
// End data

console.log("\n---- createAlastriaToken ----")

// console.log("\tFunction arguments: Issuer DID, Provider URL, Callback URL, Alastria Net ID, Token Exp Time, nbf, jti")
// console.log("\t\tIssuer DID:", didIsssuer)
// console.log("\t\tProvider URL:", providerURL)
// console.log("\t\tCallback URL:", callbackURL)
// console.log("\t\tAlastria Net ID:", alastriaNetId)
// console.log("\t\tToken Exp Time:", tokenExpTime)
// console.log("\t\tnbf:", tokenActivationDate)
// console.log("\t\tjti:", jsonTokenId)

const alastriaToken = tokensFactory.tokens.createAlastriaToken(didIsssuer, providerURL, callbackURL, alastriaNetId, tokenExpTime, tokenActivationDate, jsonTokenId)
console.log('\tThe Alastria token is: \n', alastriaToken)

// Signing the AlastriaToken
let signedAT = tokensFactory.tokens.signJWT(alastriaToken, rawPrivateKey)
//console.log('The signed Alastria token is: ', signedAT)

console.log("\n---- createAlastriaSesion ----")

// console.log("\tFunction arguments: Context, Issuer DID, User Public Key, Signed Alastria Token, Token Exp Time, nbf, jti")
// console.log("\t\tContext:", context)
// console.log("\t\tIssuer DID:", didIsssuer)
// console.log("\t\tUser Public Key:", userPublicKey)
// console.log("\t\tSigned Alastria Token:", signedJWT)
// console.log("\t\tToken Exp Time:", tokenExpTime)
// console.log("\t\tnbf:", tokenActivationDate)
// console.log("\t\tjti:", jsonTokenId)

const alastriaSession = tokensFactory.tokens.createAlastriaSession(context, didIsssuer, userPublicKey, signedAT, tokenExpTime, tokenActivationDate, jsonTokenId)
console.log('\tThe Alastria session is:\n', alastriaSession)

// Data
let jti = config.jti
let kidCredential = config.kidCredential
let subjectAlastriaID = config.subjectAlastriaID
let credentialSubject = {};
let credentialKey = config.credentialKey
let credentialValue = config.credentialValue
credentialSubject[credentialKey]=credentialValue;
credentialSubject["levelOfAssurance"]="basic";
// End data

console.log("\n---- createCredential ----")

// console.log("\tFunction arguments: KID Credential, Issuer DID, Subject DID, Context, Credential Subject, Token Exp Time, nbf, jti")
// console.log("\t\tKID Credential:", context)
// console.log("\t\tIssuer DID:", didIsssuer)
// console.log("\t\tUser Subject DID:", subjectAlastriaID)
// console.log("\t\tContext:", context)
// console.log("\t\tCredential Subject:\n", credentialSubject)
// console.log("\t\tToken Exp Time:", tokenExpTime)
// console.log("\t\tnbf:", tokenActivationDate)
// console.log("\t\tjti:", jti)

const credential1 = tokensFactory.tokens.createCredential(kidCredential, didIsssuer, subjectAlastriaID, context, credentialSubject, tokenExpTime, tokenActivationDate, jti)
console.log('\nThe credential1 is: ', credential1)

console.log("\n---- PSMHash ----")

// Data
let Web3 = require('web3')
// Init your blockchain provider
let myBlockchainServiceIp = config.nodeUrl

const web3 = new Web3(new Web3.providers.HttpProvider(myBlockchainServiceIp))

// End data
// console.log("\tFunction arguments: web3. signedJWT, Issuer DID")
// console.log("\t\tWeb3")
// console.log("\t\tSigned JWT:", signedJWT)
// console.log("\t\tIssuer DID:", didIsssuer)

let psmHash = tokensFactory.tokens.PSMHash(web3, signedJWT, didIsssuer);
console.log("\tThe PSMHash is:", psmHash);


//create AIC

let createAlastriaIDTX = { to: '0x70e7e63928b8f274f018160207d4275fd8ea5bbe',
  data: '0x6d69d99a000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000a450382c1a0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000004230336664643537616465633364343338656132333766653436623333656531653031366564613662353835633365323765613636363836633265613533353834373900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
  gasLimit: 600000,
  gasPrice: 0,
  nonce: '0x0' }

let aic = tokensFactory.tokens.createAIC(createAlastriaIDTX,alastriaToken,userPublicKey);
console.log("\t\tAIC:", aic);

//End create AIC

// TODO: CreatePresentationRequest and CreatePresentation