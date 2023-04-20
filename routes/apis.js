const router = require('express').Router();
const {db,auth} = require('../connect');
// const {auth,initializeApp} = require('firebase-admin');

const path = require('path');
require('dotenv').config({path:path.resolve(__dirname,'./.env')});
const {set,ref,get,equalTo,push,child, orderByChild,query, update, remove} = require('firebase/database')
const {signInWithEmailAndPassword, createUserWithEmailAndPassword} = require('firebase/auth');
const jwt = require('jsonwebtoken');

router.post('/login',async(req,res)=>{
    try{
        const {email,password} = req.body;
        if (!email||!password) res.status(201).json('Invalid Input');
        else {
            const user = await signInWithEmailAndPassword(auth,email,password)
            // const token = user._tokenResponse.idToken
            if (user) {
                const user1 = (await get(child(ref(db),`users/${user.user.uid}`))).val();
                res.status(200).json({token:generateToken(user.user.uid,user.user.email,user1)})
            }
        }
    } catch (err) {console.log(err)}
})

const generateToken = (uid,email,user) => {
    try {
        const payload ={
            email:email,
            id:uid,
            name:user.name,
            book1:user.book1,
            issue1:user.issue1,
            book2:user.book2,
            issue2:user.issue2,
            book3:user.book3,
            issue3:user.issue3,
            number:user.number,
            isAdmin:user.isAdmin
        }
        const options ={}
        const token = jwt.sign(payload,process.env.JWT_SECRET,options)
        return token
    } catch (err) {console.log(err)}
}

router.post('/create',async(req,res)=>{
    try {
        const {email,password,name} = req.body;
        if (!email||!password||!name) res.status(201).json('Invalid Input');
        else {
            const user = await createUserWithEmailAndPassword(auth,email,password);
            // const user1 = await auth.createCustomToken(user.localId)
            const userObj = {
                name:name,
                book1:'',
                issue1:'',
                book2:'',
                issue2:'',
                book3:'',
                issue3:'',
                number:0,
                isAdmin:false
            }
            await set(ref(db,'users/'+user.user.uid),userObj)
            res.status(200).json('User Created Successfully')
        }
    } catch (err) {console.log(err)}
    
})

router.post('/addbook',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {book} = req.body;
        if (!book||!token) res.status(201).json('Invalid Input');
        else{
            jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                if (err) {
                    res.status(400).json({message:'Bad Request'})
                    console.log(err)
                } else if (decoded.isAdmin===true) {
                    const bookRef = query(ref(db,'books'),orderByChild("bookname"),equalTo(book))
                    const b = (await get(bookRef)).val()
                    if (!b){
                        await push(ref(db,'books/'),{"bookname":book,"is_issued":false,"issuedBy":''});
                        res.status(200).json('Book Added Successfully')
                    } else res.status(201).json('Book Already Exists')
                } else res.status(403).json('Forbidden')
            })    
        }
    } catch (err) {console.log(err)}
})

router.post('/issuebook',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {book} = req.body;
        if(!token,!book) res.status(201).json('Invalid Input')
        else{
            const bookRef = query(ref(db,'books'),orderByChild("bookname"),equalTo(book))
            const b1 = (await get(bookRef)).val()
            const key = Object.keys(b1)[0]
            if (Object.values(b1)[0].is_issued===false) {
                jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                    if (err) {
                        res.status(400).json('Bad Request')
                        console.log(err)
                    } else {
                        if (decoded.book1 === '') {
                            decoded.book1 = book; 
                            decoded.issue1 = Date.now();
                            decoded.number +=1;
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:true,issuedBy:decoded.id}
                            const b = await update(ref(db),updates)
                            res.status(200).json({message:`Book ${book} issued successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        } else if (decoded.book2 === '') {
                            decoded.book2 = book; 
                            decoded.issue2 = Date.now();
                            decoded.number +=1;
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:true,issuedBy:decoded.id}
                            const b = await update(ref(db),updates)
                            res.status(200).json({message:`Book ${book} issued successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        } else if (decoded.book3 === '') {
                            decoded.book3 = book; 
                            decoded.issue3 = Date.now();
                            decoded.number +=1;
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:true,issuedBy:decoded.id}
                            const b = await update(ref(db),updates)
                            res.status(200).json({message:`Book ${book} issued successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        } else res.status(201).json('Issue Limit Exceeded')
                        // const userRef = query(child(ref(db,`users/${decoded.uid}`)))
                        const userUpdates = {}
                        userUpdates[`/users/${decoded.id}`] = {book1:decoded.book1, book2:decoded.book2, book3:decoded.book3, issue1:decoded.issue1, issue2:decoded.issue2, issue3:decoded.issue3, number:decoded.number, name:decoded.name, isAdmin:decoded.isAdmin}
                        const userUpdate = await update(ref(db),userUpdates);
                    }
                })
            } else res.status(201).json('Book Already Issued by Someone Else')
        }
    } catch (err) {console.log(err)}
})

router.post('/returnbook',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {book} = req.body;
        if(!token,!book) res.status(201).json('Invalid Input')
        else {
            const bookRef = query(ref(db,'books'),orderByChild("bookname"),equalTo(book))
            const b1 = (await get(bookRef)).val()
            const key = Object.keys(b1)[0]
            if (Object.values(b1)[0].is_issued===true) {
                jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                    if (err) {
                        res.status(400).json('Bad Request')
                        console.log(err)
                    } else {
                        if (decoded.book1===book) {
                            decoded.issue1 = '';
                            decoded.number -=1;
                            decoded.book1 = '';
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:false,issuedBy:''}
                            const b = await update(ref(db),updates)
                            // console.log(b)
                            res.status(200).json({message:`Book ${book} returned successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        }else if (decoded.book2 === book) {
                            decoded.book2 = ''; 
                            decoded.issue2 = '';
                            decoded.number -=1;
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:false,issuedBy:''}
                            const b = await update(ref(db),updates)
                            res.status(200).json({message:`Book ${book} returned successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        } else if (decoded.book3 === book) {
                            decoded.book3 = ''; 
                            decoded.issue3 = '';
                            decoded.number -=1;
                            const updates = {}
                            updates[`books/${key}`] = {bookname:book,is_issued:false,issuedBy:''}
                            const b = await update(ref(db),updates)
                            res.status(200).json({message:`Book ${book} returned successfully`, token:generateToken(decoded.id,decoded.email,decoded)})
                        } else res.status(201).json(`Book ${book} is not issued by you`)
                        // const userRef = query(child(ref(db,`users/${decoded.uid}`)))
                        const userUpdates = {}
                        userUpdates[`/users/${decoded.id}`] = {book1:decoded.book1, book2:decoded.book2, book3:decoded.book3, issue1:decoded.issue1, issue2:decoded.issue2, issue3:decoded.issue3, number:decoded.number, name:decoded.name, isAdmin:decoded.isAdmin}
                        const userUpdate = await update(ref(db),userUpdates);
                    }
                })
            }else res.status(201).json(`Book ${book} is not issued by you`) 
        }
    } catch (err) {console.log(err)}
})

router.post('/create-root',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {email,password,name} = req.body;
        if (!email||!password||!name||!token) res.status(201).json('Invalid Input');
        else {
            jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                if (err) {
                    res.status(400).json({message:'Bad Request'})
                    console.log(err)
                } else if (decoded.isAdmin===true) {
                    const user = await createUserWithEmailAndPassword(auth,email,password);
                    const userObj = {
                        name:name,
                        book1:'',
                        issue1:'',
                        book2:'',
                        issue2:'',
                        book3:'',
                        issue3:'',
                        number:0,
                        isAdmin:true
                    }
                    await set(ref(db,'users/'+user.user.uid),userObj)
                    res.status(200).json('User Created Successfully')
                } else res.status(403).json('Forbidden')
            })  
        }
    } catch (err) {console.log(err)}
})

router.get('/getbooks',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) res.status(201).json('Invalid Input');
        else {
            const userRef = query(ref(db,'users'))
            const users = (await get(userRef)).val()
            let uids = Object.keys(users)
            jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                if (err) {
                    res.status(400).json({message:'Bad Request'})
                    console.log(err)
                } else if (uids.includes(decoded.id)){
                    const bookRef = query(ref(db,'books'),orderByChild("is_issued"),equalTo(false))
                    const books = (await get(bookRef)).val()
                    if (books) {
                        const booksVals  = Object.values(books)
                        const booksKeys = Object.keys(books)
                        res.status(200).json({books:booksVals,bookIds:booksKeys})
                    } else res.status(201).json('All the books are Issued')
                } else res.status(403).json('Forbidden')
            })
        }
    } catch (err) {console.log(err)} 
})

router.get('/getallbooks',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) res.status(201).json('Invalid Input');
        else {
            const userRef = query(ref(db,'users'))
            const users = (await get(userRef)).val()
            let uids = Object.keys(users)
            jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                if (err) {
                    res.status(400).json({message:'Bad Request'})
                    console.log(err)
                } else if (uids.includes(decoded.id)){
                    const bookRef = query(ref(db,'books'))
                    const books = (await get(bookRef)).val()
                    const booksVals  = Object.values(books)
                    // const booksKeys = Object.keys(books)
                    res.status(200).json({books:booksVals})
                } else res.status(403).json('Forbidden')
            })
        }
    } catch (err) {console.log(err)}
})

router.delete('/delete-book',async(req,res)=>{
    try {
        const token = req.headers.authorization.split(' ')[1]
        const {book} = req.body; 
        if (!book||!token) res.status(201).json('Invalid Input');
        else {
            jwt.verify(token.slice(1,-1),process.env.JWT_SECRET,async(err,decoded)=>{
                if (err) {
                    res.status(400).json({message:'Bad Request'})
                    console.log(err)
                } else if (decoded.isAdmin === true) {
                    const bookRef = query(ref(db,'books'),orderByChild("bookname"),equalTo(book))
                    const b1 = (await get(bookRef)).val()
                    if (b1) {
                        if (Object.values(b1)[0].is_issued === false) {
                            const key = Object.keys(b1)[0]
                            await remove(ref(db,'books/'+key))
                            res.status(200).json('Removed Book Successfully')
                        } else res.status(201).json("Book is issued to someone")
                    } else res.status(201).json("Book doesn't exist")
                    // const bookRemove = ref(db,'books/'+key)
                } else res.status(403).json('Forbidden')
            })
        }
    } catch (err) {console.log(err)}
})

module.exports = router; 