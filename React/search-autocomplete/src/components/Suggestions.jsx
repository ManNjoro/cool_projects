/* eslint-disable react/prop-types */
import React from 'react'

export default function Suggestions({data}) {
  return (
    <ul>
        {
            (data && data.length) &&
            data.map((item, index) => <li key={index}>{item}</li>)
        }
    </ul>
  )
}
