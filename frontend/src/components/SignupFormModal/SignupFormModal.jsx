import { useState } from "react";
import { useDispatch} from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

const SignupFormModal = () => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();

        const frontendErrors = {};

        if (username.length < 4) frontendErrors.username = "Username must be at least 4 characters";
        if (firstName.length < 2) frontendErrors.firstName = "First Name must be at least 2 characters";
        if (lastName.length < 2) frontendErrors.lastName = "Last Name must be at least 2 characters";
        if (!email.includes("@")) frontendErrors.email = "Email must be valid";
        if (password.length < 6) frontendErrors.password = "Password must be at least 6 characters";

        if (Object.keys(frontendErrors).length > 0) {
            setErrors(frontendErrors);
            return;
        }

        if (password === confirmPassword) {
            setErrors({});
            return dispatch(sessionActions.signup({
                email,
                username,
                firstName,
                lastName,
                password
            }))
            .then(() => {
                closeModal();
                window.location.href = '/';
            })
            .catch(async (res) => {
                const data = await res.json();
                if (data?.errors) {
                    setErrors(data.errors);
                }
            })
        }

        return setErrors({
            confirmPassword: 'Confirm Password field must be the same as the Password field'
        })

    }

    return (
        <div className="signup-form-modal">
            <h1 className="signup-title">Sign Up</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <label className="input-label">
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p className="error">{errors.email}</p>}
                <label className="input-label">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p className="error">{errors.username}</p>}
                <label className="input-label">
                    First Name
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p className="error">{errors.firstName}</p>}
                <label className="input-label">
                    Last Name
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastName && <p className="error">{errors.lastName}</p>}
                <label className="input-label">
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p className="error">{errors.password}</p>}
                <label className="input-label">
                    Confirm Password
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                <button
                    className="signup-button"
                    type="submit"
                    disabled={
                        firstName === "" ||
                        username.length < 4 ||
                        lastName === "" ||
                        email === "" ||
                        password.length < 6 ||
                        confirmPassword === ""
                    }>
                    Sign Up
                </button>
            </form>
        </div>
    )
};


export default SignupFormModal;