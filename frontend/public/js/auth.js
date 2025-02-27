const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

// Validação do formulário de login
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                localStorage.setItem('isAuthenticated', 'true');
                window.location.href = '/';  // Redireciona para a página inicial
            } else {
                loginError.textContent = 'Usuário ou senha inválidos';
                loginError.style.display = 'block';
            }
        } catch (error) {
            loginError.textContent = 'Erro ao tentar fazer login. Tente novamente.';
            loginError.style.display = 'block';
        }
    });
}

loginBtn.addEventListener('click', () => {
  // Simulação de login com usuário fixo
  fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: 'admin',
      password: 'admin123'
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
      localStorage.setItem('isAuthenticated', 'true');
    }
  });
});

logoutBtn.addEventListener('click', () => {
  fetch('/auth/logout', {
    method: 'POST'
  })
  .then(() => {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
    localStorage.removeItem('isAuthenticated');
  });
});
