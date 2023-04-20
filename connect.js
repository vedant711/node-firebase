const {initializeApp} = require('firebase/app');
const {getDatabase} = require('firebase/database');
const {getAuth} = require('firebase/auth');
const {firebaseConfig} = require('./firebase-config');
// const firebaseAdmin = require('firebase-admin')
// const { initializeApp } = require('firebase-admin/app');

const firebase = initializeApp(firebaseConfig);
// const app = firebaseAdmin.initializeApp(firebaseConfig);
// console.log(app)
// console.log(database)
// const db = getDatabase(firebase)
// db.ref('users').set({hi:'HELLO'},err=>{
//     if(err) throw err;
//     else console.log('success')
// })
// const initializeApp = () => firebaseAdmin.initializeApp();
// module.exports = initializeApp();

const db = getDatabase(firebase)
const auth = getAuth(firebase)

module.exports = {db,auth};


// db.set({hi:'Hello'},err=>{
//     if (err) throw err
//     else console.log('success')
// })

// console.log(db.database())

// console.log(firebase)

// module.exports = firebase;