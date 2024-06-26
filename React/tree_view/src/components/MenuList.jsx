/* eslint-disable react/prop-types */
import MenuItem from './MenuItem'

export default function MenuList({list = []}) {
  return (
    <ul className='menu-list-container'>
        {
            list && list.length ?
            list.map(listItem=> <MenuItem key={2} item={listItem} />)
             :null
        }
    </ul>
  )
}
