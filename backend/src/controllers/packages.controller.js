import Package from '../models/Package.js';

/**
 * Obtém todos os pacotes
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
export const getAllPackages = async (req, res) => {
  try {
    // Se o usuário for admin, retorna todos os pacotes com detalhes completos
    if (req.session && req.session.user && req.session.user.role === 'admin') {
      const packages = await Package.findAllForAdmin();
      return res.json(packages);
    }
    
    // Para usuários normais, retorna apenas informações públicas
    const packages = await Package.findAllPublic();
    res.json(packages);
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    res.status(500).json({ error: 'Erro ao buscar pacotes' });
  }
};

/**
 * Obtém um pacote pelo ID
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
export const getPackageById = async (req, res) => {
  try {
    const package_ = await Package.findById(parseInt(req.params.id));
    if (package_) {
      res.json(package_);
    } else {
      res.status(404).json({ error: 'Pacote não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao buscar pacote:', error);
    res.status(500).json({ error: 'Erro ao buscar pacote' });
  }
};

/**
 * Cria um novo pacote
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
export const createPackage = async (req, res) => {
  try {
    const { 
      name, description, destination, image_url, 
      departure_date, duration, price, available_seats 
    } = req.body;
    
    // Validação básica
    if (!name || !destination || !departure_date || !price || !available_seats) {
      return res.status(400).json({ 
        error: 'Dados incompletos. Todos os campos obrigatórios devem ser preenchidos.' 
      });
    }
    
    const newPackage = await Package.create({
      name, 
      description, 
      destination, 
      image_url, 
      departure_date, 
      duration, 
      price, 
      available_seats
    });
    
    res.status(201).json({
      success: true,
      package: newPackage
    });
  } catch (error) {
    console.error('Erro ao criar pacote:', error);
    res.status(500).json({ error: 'Erro ao criar pacote' });
  }
};

/**
 * Atualiza um pacote existente
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
export const updatePackage = async (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    
    // Verifica se o pacote existe
    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }
    
    // Atualiza o pacote
    const success = await Package.update(packageId, req.body);
    
    if (success) {
      // Busca o pacote atualizado
      const updatedPackage = await Package.findById(packageId);
      res.json({
        success: true,
        package: updatedPackage
      });
    } else {
      res.status(400).json({ error: 'Não foi possível atualizar o pacote' });
    }
  } catch (error) {
    console.error('Erro ao atualizar pacote:', error);
    res.status(500).json({ error: 'Erro ao atualizar pacote' });
  }
};

/**
 * Exclui um pacote
 * @param {Object} req - Requisição Express
 * @param {Object} res - Resposta Express
 */
export const deletePackage = async (req, res) => {
  try {
    const packageId = parseInt(req.params.id);
    
    // Verifica se o pacote existe
    const existingPackage = await Package.findById(packageId);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Pacote não encontrado' });
    }
    
    // Tenta excluir o pacote
    try {
      const success = await Package.delete(packageId);
      if (success) {
        res.json({ success: true, message: 'Pacote excluído com sucesso' });
      } else {
        res.status(400).json({ error: 'Não foi possível excluir o pacote' });
      }
    } catch (error) {
      if (error.message.includes('possui reservas')) {
        return res.status(400).json({ 
          error: 'Não é possível excluir um pacote que possui reservas' 
        });
      }
      throw error;
    }
  } catch (error) {
    console.error('Erro ao excluir pacote:', error);
    res.status(500).json({ error: 'Erro ao excluir pacote' });
  }
};

export default {
  getAllPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
