import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import Axios from 'axios';
import CreateNewForm from './components/CreateNewForm/CreateNewForm';
import SubletCard from './components/SubletCard/SubletCard';

function App() {
    const [sublets, setSublets] = useState([])

    useEffect(() => {
        async function go() {
            const response = await Axios.get('/api/Sublets');
            setSublets(response.data);
        }
        go()
    }, [])
    return (
        <div className='container'>
            <p><a href='/'>&laquo; Back to the homepage</a></p>
            <CreateNewForm setSublets={setSublets} />
            <div className='sublet-grid'>
                {sublets.map(function(sublet) {
                    return <SubletCard key={sublet._id} city={sublet.city} rooms={sublet.rooms} 
                    photo={sublet.photo} id={sublet._id} setSublets={setSublets} />
                })}
            </div>
        </div>
    )
}


const root = createRoot(document.querySelector('#app'))
root.render(<App />)