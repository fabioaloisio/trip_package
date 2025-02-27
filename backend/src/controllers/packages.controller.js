const packages = require('../data/packages');

const getAllPackages = (req, res) => {
  res.json(packages);
};

const getPackageById = (req, res) => {
  const package = packages.find(p => p.id === parseInt(req.params.id));
  if (package) {
    res.json(package);
  } else {
    res.status(404).json({ message: 'Pacote não encontrado' });
  }
};

module.exports = { getAllPackages, getPackageById };
