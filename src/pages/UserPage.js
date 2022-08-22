import {useState, useEffect, useContext} from 'react';
import { useParams } from 'react-router-dom';
import mainContext from '../context/mainContext';

const UserPage = () => {
    const { id } = useParams()
    const [error, setError] = useState('Submit offer')
    const [openUser, setOpenUser] = useState({})
    const [images, setimages] = useState([])
    const [offer, setOffer] = useState({youget:[], iget:[]})
    const { user, myImages, socket } = useContext(mainContext)
    useEffect(()=>{
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        fetch(`http://localhost:4000/user/${id}`, options)
        .then(res => res.json())
        .then(data => {
            setOpenUser(data.user)
            setimages(data.images)
        })
    })
    function addToIGet(id){
        const item = images.find(x=>x._id===id)
        let newOffer = offer;
        if (newOffer.iget.find(x=>x._id===id)) console.log('You allready offered this image')
        else newOffer.iget.push(item)
        setOffer(newOffer)
    }
    function addToYouGet(id){
        const item = myImages.find(x=>x._id===id)
        let newOffer = offer;
        if (newOffer.youget.find(x=>x._id===id)) console.log('You allready offered this image')
        else newOffer.youget.push(item)
        setOffer(newOffer)
    }
    function returnMine(id){
        setOffer({iget: offer.iget, youget: offer.youget.filter(x=>x._id!==id)})
    }
    function returnHis(id){
        setOffer({iget: offer.iget.filter(x=>x._id!==id), youget: offer.youget})
    }
    function submitOffer(){
        let data = offer
        data.madeByName = user.username
        data.madeByID = user._id
        data.madeToName = openUser.username
        data.madeToID = openUser._id
        socket.emit('submitOffer', data)
        if (offer.iget.length===0 && offer.youget.length===0) return setError('offer is empty')
        const options = {
            method: 'POST',
            headers: {"content-type":"application/json"},
            body: JSON.stringify(data),
            credentials: 'include'
        }
        fetch(`http://localhost:4000/submitOffer`, options)
        .then(res => res.json())
        .then(res => {
            if (!res.error) return setError(res.status)
            setError('somethings wrong')
        })
        setOffer({youget:[], iget:[]})
    }

    return (
        <div className='UserPage'>
            <div className='top'>
                <div className='UserInfo'>
                    <div className='info'>
                        {/* <h5>id: {openUser._id}</h5> */}
                        <h5>User: {openUser.username}</h5>
                    </div>
                    <div className='myImageList'>
                        {images && images.map((image, i) =>
                        {  

                            return <div onClick={()=>addToIGet(image._id)} key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                        }
                        )}
                    </div>
                </div>
                <div className='MySide'>
                    <div className='info'>
                        {/* <h5>id: {user._id}</h5> */}
                        <h5>User: {user.username}</h5>
                    </div>
                    <div className='imageList'>
                        {myImages && myImages.map((image, i) =>
                        {  

                            return <div onClick={()=>addToYouGet(image._id)} key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                        }
                        )}
                    </div>
                </div>
            </div>
            <div className='offer dFlex flexWrap'>
                <div className='youget dFlex flexWrap'>
                    {offer.youget.length > 0 && offer.youget.map((image, i) =>
                    {

                       return <div onClick={()=>returnMine(image._id)} key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                    }
                    )}
                </div>
                <div className='iget dFlex flexWrap'>
                    {offer.iget.length > 0 && offer.iget.map((image, i) =>
                    {

                        return <div onClick={()=>returnHis(image._id)} key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                    }
                    )}
                </div>
            </div>
            <button className='offerButton' onClick={submitOffer}>Offer</button>
            <h1>{error}</h1>
        </div>
    );
};

export default UserPage;