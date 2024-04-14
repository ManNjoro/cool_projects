import React, { useState } from 'react'
import { useEffect } from 'react'
import axios from 'axios'

export default function Accordion() {
    const [selected, setSelected] = useState(null)
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios.get('http://localhost:8000/data')
        .then(res => setData(res.data))
        .catch(e => console.log(e.message))
        .finally(()=> setLoading(false))
    }, [])
    
  return (
    <div className='wrapper'>
        <div className="accordion">
            {
                data && data.length > 0 ?
                data.map((dataItem => (
                    <div className="item">
                        <div className="title">
                            <h3>{dataItem.question}</h3>
                        </div>
                    </div>
                )))
                :
                <div>No data found</div>
            }
        </div>
    </div>
  )
}
