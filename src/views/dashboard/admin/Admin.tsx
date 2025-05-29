import { Outlet } from 'react-router-dom'
import ControlPanelSidebar from '../../../components/shared/ControlPanelSidebar'
import { useState } from 'react'
import { EyeClosedIcon } from 'lucide-react';

const Admin = () => {
    const [showControlPanel, setshowControlPanel] = useState<boolean>(true);

    return (
        <section className="md:flex px-2">
            <button onClick={() => setshowControlPanel(!showControlPanel)} className='md:hidden'>
                <EyeClosedIcon width={15} height={15} className='w-12 h-12 text-green'/>
            </button>
            <div className={`md:static  md:w-[25vw] w-[100vw]  right ${!showControlPanel? 'hidden': 'block'}`}>
                <ControlPanelSidebar />
            </div>

            <div className='md:w-[75vw] w-[95vw] md:relative absolute inset-0'>
                <Outlet />
            </div>
        </section>
    )
}

export default Admin