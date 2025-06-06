import { useState } from 'react';
import { useAppSelector } from '../../store/store';
import SettingDropDown from './SettingDropDown';
import { useLogoutMutation } from '../../store/api/authApi';

const Navbar = () => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const [logout] = useLogoutMutation();
    
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
        <nav className="bg-white shadow-sm py-4 px-8 flex items-center justify-between sticky top-0 z-10 ">
            {/* Menu button  */}
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 w-10 mr-2 rounded-full hover:bg-muted transition-colors">
                <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="bars"
                    className="svg-inline--fa fa-bars h-5 w-5"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                >
                    <path
                        fill="currentColor"
                        d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
                    ></path>
                </svg>
            </button>

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
                <button
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground h-10 w-10 rounded-full hover:bg-muted transition-colors relative"
                    type="button"
                    id="notifications-button"
                    aria-haspopup="menu"
                    aria-expanded="false"
                    data-state="closed"
                >
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fas"
                        data-icon="bell"
                        className="svg-inline--fa fa-bell h-5 w-5"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                    >
                        <path
                            fill="currentColor"
                            d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z"
                        ></path>
                    </svg>
                    <span className="sr-only">الإشعارات</span>
                </button>

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
                        <SettingDropDown user={user} onLogout={handleLogout} toggleProfileMenu={toggleProfileMenu}/>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;