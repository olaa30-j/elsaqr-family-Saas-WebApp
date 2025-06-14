import { useState } from 'react';
import { useAppSelector } from '../../store/store';
import SettingDropDown from './SettingDropDown';
import { useLogoutMutation } from '../../store/api/authApi';
import DropdownNotification from './DropdownNotification';


const Navbar = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const [logout] = useLogoutMutation();

    const now = new Date();
    const hijriDate = new Date(now).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })


    const toggleProfileMenu = () => {
        setIsProfileMenuOpen(!isProfileMenuOpen);
    };

    const handleLogout = async () => {
        setIsProfileMenuOpen(false);
        try {
            await logout().unwrap();
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };
    return (
        <nav className="bg-white shadow-sm py-4 px-8 flex items-center justify-between sticky -top-1 z-[15] ">
            {/* Menu button  */}
            <div className="text-xs leading-none max-w-[23vw] -mr-2 md:w-full">
                <span className="text-[0.75rem] text-gray-500">{hijriDate}</span>
            </div>

            {/* logo */}
            <div className="absolute left-1/2 -translate-x-1/2 w-fit">
                <div className="flex flex-col md:gap-2 md:flex-row items-center">
                    <img
                        src="https://res.cloudinary.com/dmhvfuuke/image/upload/v1748029147/family-logo_z54fug.png"
                        alt="شعار عائلة الصقر الدهمش"
                        className="h-8 w-8 object-contain"
                    />
                    <h1 className="font-heading text-responsive-sm font-bold text-primary">
                        عائلة الصقر الدهمش
                    </h1>

                </div>
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications button */}
                <DropdownNotification />

                {/* Profile button */}
                <div className="relative">
                    <button
                        onClick={toggleProfileMenu}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-full p-0 h-auto"
                        type="button"
                        id="profile-button"
                        aria-haspopup="menu"
                        aria-expanded={isProfileMenuOpen}
                    >
                        <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9 border-2 border-primary">
                            <img
                                className="aspect-square h-full w-full"
                                alt={'صورة المستخدم'}
                                loading="lazy"
                                src={`${user?.memberId?.image}` || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSsuWiNNpEjZxIi0uQPyEq6qecEqY0XaI27Q&s'}
                            />
                        </span>
                    </button>

                    {user && isProfileMenuOpen && (
                        <SettingDropDown user={user} onLogout={handleLogout} toggleProfileMenu={toggleProfileMenu} />
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;