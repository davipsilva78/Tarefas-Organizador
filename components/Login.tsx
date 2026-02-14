
import React, { useState } from 'react';
import { User } from '../types';
import Icon from './Icon';

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const allUsers: { [key: string]: User } = JSON.parse(localStorage.getItem('taskAppUsers') || '{}');

        if (isLoginView) {
            const user = Object.values(allUsers).find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password);
            if (user) {
                onLogin(user);
            } else {
                setError('Nome de usuário ou senha inválidos.');
            }
        } else {
            // Register
            if (Object.values(allUsers).some(u => u.name.toLowerCase() === name.toLowerCase())) {
                setError('Este nome de usuário já existe.');
                return;
            }
            const newUserId = `user-${Date.now()}`;
            const newUser: User = {
                id: newUserId,
                name,
                password,
                avatarUrl: `https://i.pravatar.cc/150?u=${newUserId}`
            };
            allUsers[newUserId] = newUser;
            localStorage.setItem('taskAppUsers', JSON.stringify(allUsers));
            onLogin(newUser);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center">
            <div className="flex items-center mb-8">
                 <div className="bg-custom-blue p-3 rounded-lg mr-4">
                    <Icon name="check" className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-gray-700 dark:text-gray-300">Task Pro</h1>
            </div>
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">{isLoginView ? 'Login' : 'Registrar'}</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome de Usuário</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
                        <input 
                            type="password" 
                             value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-custom-blue focus:border-custom-blue bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                            required 
                        />
                    </div>
                    <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-custom-blue hover:bg-custom-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-custom-blue">
                        {isLoginView ? 'Entrar' : 'Criar Conta'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                    <button onClick={() => { setIsLoginView(!isLoginView); setError(''); }} className="font-medium text-custom-blue hover:text-custom-dark-blue ml-1">
                        {isLoginView ? 'Registre-se' : 'Faça login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
