/* eslint-disable react/prop-types */
import React from 'react'
import MenuList from './MenuList'

export default function MenuItem({item}) {
  return (
    <li>
      <p>{item.label}</p>
      {
        item && item.children && item.children.length > 0 ?
        <MenuList list={item.children} />
        :null
      }
    </li>
  )
}
