import { AiOutlineUser } from "react-icons/ai";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import * as spotActions from '../../store/spots';
import './Navigation.css';

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const logout = (e) => {
        e.preventDefault();
        dispatch(sessionActions.logout());
    };

    const toggleMenu = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

    const handleManageSpots = () => {
        dispatch(spotActions.getCurrentUserSpots());
        closeMenu();
    };

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    return (
        <>
            <button onClick={toggleMenu} className="profile-button">
                <AiOutlineUser />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                {user ? (
                    <div>
                        <div className="user-info">
                            <p>Hello, {user.username}</p>
                            <p>{user.firstName} {user.lastName}</p>
                            <p>{user.email}</p>
                        </div>
                        <div className="manage-spots">
                            <NavLink to={"/spots/current"} onClick={handleManageSpots}>Manage Spots</NavLink>
                        </div>
                        <div>
                            <button className="logout" onClick={logout}>Log Out</button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="login-modal">
                            <OpenModalMenuItem
                                itemText="Log In"
                                onItemClick={closeMenu}
                                modalComponent={<LoginFormModal />}
                            />
                        </div>
                        <div className="signup-modal">
                            <OpenModalMenuItem
                                itemText="Sign Up"
                                onItemlick={closeMenu}
                                modalComponent={<SignupFormModal />}
                            />
                        </div>
                    </>
                )}
            </ul>
        </>
    );
};

export default ProfileButton;