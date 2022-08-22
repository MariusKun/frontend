import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import mainContext from '../context/mainContext';
const Navigation = () => {
    const [requests, setRequests] = useState(0)
    const { login, setLogin, setUser, socket, user } = useContext(mainContext)
    const nav = useNavigate();
    useEffect(()=>{
        if (login) socket.emit('requestStatus', user);
        socket.on('requestStatus', data => {
            setRequests(data)
        });
        
    }, [user])
    useEffect(()=>{
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        fetch('http://localhost:4000/autoLogin', options)
        .then(res => res.json())
        .then(data => {
            if (data.user) {
                setLogin(true)
                setUser(data.user)
            }
        })
    }, [])
    function logout(){
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        fetch('http://localhost:4000/logout', options)
        .then(res => res.json())
        .then(data => {
            setLogin(false)
            nav('/')
        })
    }
    return (
        <div className='Navigation'>
            {login && 
                <>
                    <h2 onClick={()=>nav('/profile')}>Profile</h2>
                    <h2 onClick={()=>nav('/upload')}>Upload</h2>
                    <h2 onClick={()=>nav('/users')}>Users</h2>
                    <h2 onClick={()=>nav('/requests')}>Requests({requests})</h2>
                </>}
                {login ? <h3 onClick={logout}>Sign out</h3> : <h3 onClick={()=>nav('/')}>Login</h3>}
        </div>
    );
};

export default Navigation;