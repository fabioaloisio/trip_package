const login = (req, res) => {
    const { username, password } = req.body;
    
    // Usuário fixo para demonstração
    if (username === 'admin' && password === 'admin123') {
      req.session.user = { username };
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Credenciais inválidas' });
    }
  };
  
  const logout = (req, res) => {
    req.session.destroy();
    res.json({ success: true });
  };
  
  module.exports = { login, logout };
  