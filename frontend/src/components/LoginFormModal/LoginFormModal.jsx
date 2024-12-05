import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    return dispatch(sessionActions.login({ credential, password }))
      .then(() => {
        closeModal();
        window.location.href = '/';
      })
      .catch((error) => {
        if (error.errors) {
          setErrors(error.errors);
        } else {
          setErrors({ credential: 'Invalid credentials' });
        }
      });
  };

  return (
    <div className='login-form-modal'>
      <h1 className='login-title'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <label className='input-label'>
          Username or Email
          <input
            className='input-text'
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </label>
        <label className='input-label'>
          Password
          <input
            className='input-text'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.credential && <p style={{ color: 'red', margin: '5px 0' }}>{errors.credential}</p>}
        <button className='login-button' type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginFormModal;