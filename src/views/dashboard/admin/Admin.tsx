import { Outlet } from 'react-router-dom'
import ControlPanelSidebar from '../../../components/shared/ControlPanelSidebar'
import { useState } from 'react'
import { EyeClosedIcon } from 'lucide-react';

const Admin = () => {
    const [showControlPanel, setShowControlPanel] = useState<boolean>(true);

    return (
        <section className="flex flex-col md:flex-row w-full">
            <button
                onClick={() => setShowControlPanel(!showControlPanel)}
                className={`md:hidden right-4 z-50 bg-white p-2 border-2  ${showControlPanel ? "fixed top-4" : "absolute top-20"} `}
            >
                <EyeClosedIcon
                    width={15}
                    height={15}
                    className="w-6 h-6 text-color-2"
                />
            </button>

            <div
                className={`
                    ${showControlPanel ? "block" : "hidden"} 
                    md:block 
                    fixed md:static 
                    inset-0 md:inset-auto 
                    z-40 md:z-auto 
                    w-full md:w-[25vw] 
                    min-h-sceen
                    bg-white md:bg-transparent
                    transition-transform duration-300 ease-in-out
                    ${!showControlPanel ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
                    `}
            >
                <ControlPanelSidebar closePanel={() => setShowControlPanel(false)} />
            </div>

            <div className="flex-1 w-full md:w-[75vw] relative px-6">
                <Outlet />
            </div>
        </section>
    )
}

export default Admin