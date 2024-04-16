/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import {FaStar} from 'react-icons/fa'

export default function StarRating({noOfStars = 5}) {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)

    const handleClick = (getCurrentIndex) => {
        console.log("click",getCurrentIndex)
    }

    const handleMouseOver = (getCurrentIndex) => {
        console.log("over", getCurrentIndex)
    }

    const handleMouseLeave = (getCurrentIndex) => {
        console.log("Leave", getCurrentIndex)
    }
  return (
    <div className='star-rating'>
        {
        [...Array(noOfStars)].map((_,index) => {
            index += 1
            return <FaStar
            key={index}
            onClick={()=> handleClick(index)}
            onMouseMove={()=> handleMouseOver(index)}
            onMouseLeave={()=> handleMouseLeave(index)}
            size={40}
             />
        })
        }
    </div>
  )
}
