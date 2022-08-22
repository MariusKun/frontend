import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
    const nav = useNavigate()
    const [ users, setUsers ] = useState([])
    useEffect(()=>{
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        fetch(`http://localhost:4000/users`, options)
        .then(res => res.json())
        .then(data => {
            setUsers(data.users)
        })
    }, [])
    
    return (
        <div className='UsersPage'>
            <h2>Press on user to make an offer!</h2>
            {users.map((user, i) => 
                <div onClick={()=>nav(`/user/${user._id}`)} key={i} className='userText'>
                    <h3>Nick name: {user.username}</h3>
                </div>
            )}
        </div>
    );
};

export default UsersPage;