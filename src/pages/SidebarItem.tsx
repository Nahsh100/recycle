import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import React from 'react'

type SidebaritemProps = {
    title: string;
    Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
        muiName: string;
    }
}

function SidebarItem({title, Icon}: SidebaritemProps) {
  return (
    <div className='flex mx-5 justify-right space-x-10 text-sky-700 mt-10 items-center'>
        <Icon />
        <h2>{title}</h2>
    </div>
  )
}

export default SidebarItem