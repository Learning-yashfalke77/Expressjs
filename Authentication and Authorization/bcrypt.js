// Authentication is process of verfying who the particular user it is, authenticate with username and password
// Authorization is a verifying what a specific user has access to (After Authentication)

// Never store the Password in PLain text
// Password is converted to hashiing function and then stored

// Hashing function takes arbitary size input and fixed size output
// For one input hashing should always get the same output(for checking)
//  BCRYPT Function for hashed password 
// Password Salt: we are concatinating some text to password and then letting it to undergo hashing

// Package : npm i bcrypt
const bcrypt = require('bcrypt');

// const hashPassword = async (pt) => {
//     const passwordSalt = await bcrypt.genSalt(12)   //10 is no of rounds , more round for time taken for password hashing more difficulty
//     const hash = await bcrypt.hash('monky', passwordSalt)
//     login(pt, hash)
//     console.log(passwordSalt);
//     console.log(hash);
// }
const hashPassword = async (pt) => {
    const hash = await bcrypt.hash(pt, 10) //1 function with 2 functionality of password salt generation + hash password
    login(pt, hash)
    console.log(hash);
}

const login = async (pt, hashPassword) => {
    const result = await bcrypt.compare(pt, hashPassword)  //returns true or false
    if (result) {
        console.log('Logged in succesfully');
    } else {
        console.log('Incorrect');
    }
}

hashPassword('monkey')


