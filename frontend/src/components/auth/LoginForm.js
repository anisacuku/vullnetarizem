import {useState, useContext, Component} from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../context/AuthContext';
import '../styles/LoginForm.css';

class LoginForm extends Component {
    render() {
        const {t} = useTranslation();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);
        const {login} = useContext(AuthContext);
        const navigate = useNavigate();

        async function handleSubmit(event) {
            event.preventDefault();

            if (!email || !password) {
                setError(t('errors.allFieldsRequired'));
                return;
            }

            try {
                setLoading(true);
                setError('');
                await login({email, password});
                navigate('/dashboard');
            } catch (err) {
                setError(t('errors.invalidCredentials'));
                console.error('Login error:', err);
            } finally {
                setLoading(false);
            }
        }

        return createElement('div', {className: 'login-form-container'},
            createElement('form', {onSubmit: handleSubmit, className: 'login-form'},
                createElement('h2', null, t('login.title')),

                error && createElement('div', {className: 'error-message'}, error),

                createElement('div', {className: 'form-group'},
                    createElement('label', {htmlFor: 'email'}, t('login.email')),
                    createElement('input', {
                        type: 'email',
                        id: 'email',
                        value: email,
                        onChange: (e) => setEmail(e.target.value),
                        placeholder: t('login.emailPlaceholder'),
                        required: true
                    })
                ),

                createElement('div', {className: 'form-group'},
                    createElement('label', {htmlFor: 'password'}, t('login.password')),
                    createElement('input', {
                        type: 'password',
                        id: 'password',
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        placeholder: t('login.passwordPlaceholder'),
                        required: true
                    })
                ),

                createElement('button', {
                    type: 'submit',
                    className: 'login-button',
                    disabled: loading
                }, loading ? t('buttons.loggingIn') : t('buttons.login'))
            )
        );
    }
}

export default LoginForm;