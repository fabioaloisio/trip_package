/**
 * @fileoverview Funções de autenticação do frontend
 */

const API_URL = 'http://localhost:3001/api';

/**
 * Verifica se o usuário está autenticado
 * @returns {Promise<boolean>} True se autenticado, false caso contrário
 */
export async function checkAuth() {
    try {
        const response = await fetch(`${API_URL}/auth/check`, {
            credentials: 'include'
        });
        return response.ok;
    } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        return false;
    }
}

/**
 * Realiza o login do usuário
 * @param {Event} event - Evento do formulário
 */
export async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };

    console.log('Tentando login com email:', data.email);

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        console.log('Resposta do servidor:', responseData);

        if (!response.ok) {
            throw new Error(responseData.error || 'Erro ao fazer login');
        }

        if (responseData.success) {
            // Verificar se há um redirecionamento pendente
            const redirectTo = sessionStorage.getItem('redirectAfterLogin');
            if (redirectTo) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectTo;
            } else {
                window.location.href = '/';
            }
        }
    } catch (error) {
        console.error('Erro no login:', error);
        showError(error.message);
    }
}

/**
 * Realiza o registro do usuário
 * @param {Event} event - Evento do formulário
 */
export async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password')
    };

    console.log('Enviando dados:', { ...data, password: '***' });

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (!response.ok) {
            throw new Error(responseData.error);
        }

        if (responseData.success) {
            window.location.href = '/dashboard.html';
        }
    } catch (error) {
        console.error('Erro no registro:', error);
        showError(error.message);
    }
}

/**
 * Realiza o logout do usuário
 */
export async function handleLogout() {
    try {
        console.log('Iniciando logout...');
        await fetch(`${API_URL}/auth/logout`, {
            method: 'GET',
            credentials: 'include'
        });
        console.log('Logout realizado com sucesso');
        window.location.href = '/login.html';
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
        alert('Erro ao fazer logout. Tente novamente.');
    }
}

/**
 * Mostra mensagem de erro no formulário
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

// Exportar todas as funções necessárias
export { showError }; 