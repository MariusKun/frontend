import { useEffect, useState, useContext } from 'react'
import mainContext from '../context/mainContext'

const RequestsPage = () => {
    const { socket, user } = useContext(mainContext)
    const [offers, setOffers] = useState([])
    useEffect(()=>{
        const options = {
            method: 'GET',
            headers: {"content-type":"application/json"},
            credentials: 'include'
        }
        fetch('http://localhost:4000/getOffers', options)
        .then(res => res.json())
        .then(data => {
            setOffers(data.offers)
        })
    },[])

    function reject(offer){
        
        const options = {
            method: 'POST',
            headers: {"content-type":"application/json"},
            body: JSON.stringify({offerID:offer._id}),
            credentials: 'include'
        }
        fetch('http://localhost:4000/rejectOffer', options)
        .then(res => res.json())
        .then(data => {
            setOffers(data.offers)
            socket.emit('requestStatus', user)
            let message = {}
            message.id = offer.madeByID
            message.message = `${offer.madeToName} has rejected your offer`
            
        })
    }
    function accept(offer){
        const options = {
            method: 'POST',
            headers: {"content-type":"application/json"},
            body: JSON.stringify({offerID:offer._id}),
            credentials: 'include'
        }
        fetch('http://localhost:4000/acceptOffer', options)
        .then(res => res.json())
        .then(data => {
            setOffers(data.offers)
            socket.emit('requestStatus', user)
            socket.emit('acceptOffer', offer)
        })
    }
    return (
        <div className='RequestsPage'>
            {offers.map(offer=> 
                <div key={offer._id} className='imageCard'>
                <div className='container dFlex'>
                    <div className='requestSide flex1'>
                        <h3>{offer.madeByName} would get:</h3>
                        <div className='imageCard dFlex flexWrap'>
                            {offer.iget.map((image, i) =>
                                <div key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                            )}
                        </div>
                        <button className='requestButtonR' onClick={()=>reject(offer)} >Reject offer</button>
                    </div>
                    <div className='offerSide flex1'>
                        <h3>You would get:</h3>
                        <div className='imageCard'>
                            {offer.youget.map((image, i) =>
                                <div key={i} className='imageCard' style={{backgroundImage:`url(${image.image})`}}></div>
                            )}
                        </div>
                        <button className='requestButtonA' onClick={()=>accept(offer)}>Accept Offer</button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default RequestsPage;