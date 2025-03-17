import { User } from '../models/User.js';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuário pelo email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
    
    // Verificar senha
    const isPasswordValid = await User.checkPassword(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
    
    // Criar sessão
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    res.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor' });
  }
};

const logout = (req, res) => {
  req.session.destroy();
  res.json({ success: true });
};

const checkAuth = (req, res) => {
  if (req.session.user) {
    res.json({ 
      isAuthenticated: true,
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        email: req.session.user.email,
        role: req.session.user.role
      }
    });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
};

export { login, logout, checkAuth };
  
