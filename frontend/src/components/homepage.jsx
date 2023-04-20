import React, { useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthContext";
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import 'font-awesome/css/font-awesome.min.css';
// import Loader from './loader';


const Home = () => {
    const { user,logoutUser,setUser,setAuthTokens} = useContext(AuthContext);
    const [response,setResponse] = useState('')
    const navigate = useNavigate();
    const cookie = localStorage.getItem('authTokens')
    // console.log(cookie)


    const [showCreateRoot,setShowCreateRoot] = useState(false);
    const [showIssue,setShowIssue] = useState(false);
    const [showBooks,setShowBooks] = useState(false);

    const [showReturn,setShowReturn] = useState(false);
    const [books,setBooks] = useState([]);
    const [bookIds,setBookIds] = useState([]);
    const [issueBook, setIssueBook] = useState('');
    const [returnBook, setReturnBook] = useState('');
    const [allBooks,setAllBooks] = useState([]);
    const [showAdd,setShowAdd] = useState(false);



    useEffect(()=>{
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.get('http://localhost:55355/getbooks',{headers:headers}).then(res=>{
            setBooks(res.data.books);
            setBookIds(res.data.bookIds);
        })
    },[]);

    const fetchNonIssued = ()=>{
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.get('http://localhost:55355/getbooks',{headers:headers}).then(res=>{
            setBooks(res.data.books);
            setBookIds(res.data.bookIds);
        })
    }

    const fetchBooks = ()=>{
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.get('http://localhost:55355/getallbooks',{headers:headers}).then(res=>{
            setAllBooks(res.data.books);
        })
    }

    const handleCreateRoot = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const password = e.target.password.value;
        const email = e.target.email.value;
        // const mobile = e.target.mobile.value;
        const headers = {
            "Authorization" : `JWT ${cookie}`
        }
        axios.post(`http://localhost:55355/create-root`,{'email':email,'name':name,'password':password,},{headers:headers}).then(res=>{
            if (res.data !== 'Invalid Input' && res.data !== 'User already exists' && res.data !=='Invalid Mobile Number') setShowCreateRoot(false)
            setResponse(res.data)
            setTimeout(()=>setResponse(''),5000)
            if (res.status===200) setShowIssue(false)
            fetchNonIssued();
        });
    }

    const onIssueBookChange = e => {
        setIssueBook(e.target.value)
    }

    const onReturnBookChange = e => {
        setReturnBook(e.target.value)
    }

    const handleSubmitIssue = e => {
        e.preventDefault();
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.post('http://localhost:55355/issuebook',{"book":issueBook},{headers:headers}).then(res=>{
            if (res.status===200) {
                setResponse(res.data.message)
                setAuthTokens(res.data.token)
                localStorage.setItem("authTokens", JSON.stringify(res.data.token));
                setUser(jwt_decode(res.data.token))
                setShowIssue(false)
            } else setResponse(res.data)
            setTimeout(()=>setResponse(''),5000)
            fetchNonIssued();
        })
    }

    const handleSubmitReturn = e => {
        e.preventDefault();
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.post('http://localhost:55355/returnbook',{"book":returnBook},{headers:headers}).then(res=>{
            if (res.status===200) {
                setResponse(res.data.message)
                setAuthTokens(res.data.token)
                localStorage.setItem("authTokens", JSON.stringify(res.data.token));
                setUser(jwt_decode(res.data.token))
                setShowReturn(false)
            } else setResponse(res.data)
            setTimeout(()=>setResponse(''),5000)
            fetchNonIssued();
        })
    }

    const deleteBook = (book) => {
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.delete('http://localhost:55355/delete-book',{headers:headers,data:{"book":book}}).then(res=>{
            setResponse(res.data)
            setTimeout(()=>setResponse(''),5000)
            // if (res.status===200) setShowIssue(false)
            fetchNonIssued();
            fetchBooks();
        })
    }

    const handleAdd = e => {
        e.preventDefault();
        const addbook = e.target.addbook.value;
        const headers = {"Authorization" : `JWT ${cookie}`};
        axios.post('http://localhost:55355/addbook',{"book":addbook},{headers:headers}).then(res=>{
            setResponse(res.data)
            setTimeout(()=>setResponse(''),5000)
            if (res.status===200) setShowAdd(false)
            fetchNonIssued();
        })
    }
     
    return (
        <>
            <div class="header">
                <p onClick={()=>{setShowAdd(false);setShowIssue(!showIssue);setShowReturn(false);setShowBooks(false);setShowCreateRoot(false)}}>Issue Book</p>
                <p onClick={()=>{setShowAdd(false);setShowReturn(!showReturn);setShowIssue(false);setShowBooks(false);setShowCreateRoot(false)}}>Return Book</p>
                {user.isAdmin===true ? <p onClick={()=>{fetchBooks();setShowAdd(false);setShowIssue(false);setShowReturn(false);setShowBooks(!showBooks);setShowCreateRoot(false)}}>View all Books</p>:null}
                {user.isAdmin===true ? <p onClick={()=>{setShowAdd(!showAdd);setShowIssue(false);setShowReturn(false);setShowBooks(false);setShowCreateRoot(false)}}>Add a Book</p>:null}
                {user.isAdmin===true ? <p onClick={()=>{setShowAdd(false);setShowIssue(false);setShowReturn(false);setShowBooks(false);setShowCreateRoot(!showCreateRoot)}}>Create Root User</p>:null}
                <p onClick={logoutUser}>Logout</p>
            </div>
            <div className='container'>
                <h1>Welcome {user.name}</h1>
                {response!==''?<p>{response}</p>:null}
                {showIssue ?books && bookIds?<form onSubmit={handleSubmitIssue} style={{width:'100%'}}>
                    {/* <input type="text" name="editname" id="editname" placeholder='Enter New Name'/><br /> */}
                    <h3>Issue a Book</h3>
                    {books.map((book,key)=>
                        <>
                            
                            <input type="radio" name="books" id={bookIds[key]} value={book.bookname} onChange={onIssueBookChange} checked={issueBook===book.bookname}/>
                            <label htmlFor={bookIds[key]}>{book.bookname}</label><br/>
                        </>
                    )}
                    {/* <input type="text" name="pincredit" id="pincredit" placeholder='Enter PIN'/><br /> */}
                    <button type="submit" >Submit</button><br />
                </form>:<p>No Books Available to be Issued</p>:null}
                {showReturn? user.book1 || user.book2 || user.book3 ? <form onSubmit={handleSubmitReturn} style={{width:'100%'}}>
                    <h3>Return a Book</h3>
                        {user.book1?<>
                        <input type="radio" name="returnbooks" id='book1' value={user.book1} onChange={onReturnBookChange} checked={returnBook===user.book1}/>
                        <label htmlFor='book1'>{user.book1}</label><br /></>:null}
                        {user.book2?<>
                        <input type="radio" name="returnbooks" id='book2' value={user.book2} onChange={onReturnBookChange} checked={returnBook===user.book2}/>
                        <label htmlFor='book2'>{user.book2}</label><br /></>:null}
                        {user.book3?<>
                        <input type="radio" name="returnbooks" id='book3' value={user.book3} onChange={onReturnBookChange} checked={returnBook===user.book3}/>
                        <label htmlFor='book3'>{user.book3}</label><br /></>:null}
                    <button type="submit" >Submit</button><br />

                </form> : <p>You haven't Issued Any book</p> :null}
                {showCreateRoot? <form onSubmit={handleCreateRoot} style={{width:'100%'}}>
                    <h3>Create Root</h3>
                    <input type="text" id="name" placeholder="Enter Username" /><br />
                    <input type="password" id="password" placeholder="Enter Password" /><br />
                    <input type="email" id="email" placeholder="Enter your Email" /><br />
                    {/* <input type="text" id="mobile" placeholder="Enter your Mobile Number" /><br /> */}
                    <button type="submit">Create</button></form> :null}
                {showAdd? <form onSubmit={handleAdd} style={{width:'100%'}}>
                    <h3>Add Book</h3>
                    <input type="text" name="addbook" id="addbook" placeholder='Enter the Book Name'/><br />
                    <button type="submit">Create</button></form>:null}
                {showBooks? 
                <table>
                    <thead>
                        <tr colspan={3}>All Books</tr>
                        <tr>
                            <th>Book Name</th>
                            {/* <th>Is Issued</th> */}
                            <th>Issued By</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allBooks.map((book,key)=>
                            <tr>
                                <td>{book.bookname}</td>
                                {/* <td>{book.is_issued}</td> */}
                                <td>{book.issuedBy}</td>
                                <td><button onClick={()=>deleteBook(book.bookname)}><i className='fa fa-trash'></i></button></td>
                            </tr>
                        )}
                    </tbody>
                </table> :null}
            </div>
        </>
    )
}

export default Home