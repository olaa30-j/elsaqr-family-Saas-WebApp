import { Outlet } from 'react-router-dom'
import ControlPanelSidebar from '../../../components/shared/ControlPanelSidebar'

const Admin = () => {
    return (
        <section className="flex">
            <div className='md:relative absolute w-[25vw]'><ControlPanelSidebar /></div>

            <div className='w-[75vw]'>
                <Outlet/>
            </div>
        </section>
    )
}

export default Admin