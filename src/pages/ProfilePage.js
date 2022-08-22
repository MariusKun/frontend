import userEvent from '@testing-library/user-event';
import { useContext, useEffect, useState } from 'react';
import mainContext from '../context/mainContext';

const ProfilePage = () => {
    const { login, user, setMyImages } = useContext(mainContext)
    const [ images, setImages ] = useState([])
    useEffect(()=>{
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        if (user) fetch(`http://localhost:4000/imagesList/${user._id}`, options)
        .then(res => res.json())
        .then(data => {
            setMyImages(data.images)
            setImages(data.images)
        })
    }, [user])

    
    return (
        
        <div className='profilePage dFlex'>
            <div className='userInfo'>
                {user && 
                    <>
                        <h3>Nickname: {user.username}</h3>
                        <h3>You own {images.length} cars:</h3>
                 
                    </>
                }
            </div>
            <div className='imageContainer dFlex flexWrap'>
                {images && images.map((image, i) =>
                {
                    return <div key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                }
                )}
            </div>
        </div>
    );
};

export default ProfilePage;