document.addEventListener('DOMContentLoaded', () => {
    fetchPackages();
  });
  
  function fetchPackages() {
    fetch('/packages')
      .then(response => response.json())
      .then(packages => {
        const packagesContainer = document.getElementById('packages-list');
        packagesContainer.innerHTML = '';
        
        const packagesGrid = document.createElement('div');
        packagesGrid.className = 'packages-grid';
        
        packages.forEach(package => {
          const card = createPackageCard(package);
          packagesGrid.appendChild(card);
        });
        
        packagesContainer.appendChild(packagesGrid);
      });
  }
  
  function createPackageCard(package) {
    const card = document.createElement('div');
    card.className = 'package-card';
    
    card.innerHTML = `
      <h2>${package.name}</h2>
      <p>Destino: ${package.destination}</p>
      <p>Data de Partida: ${new Date(package.departureDate).toLocaleDateString()}</p>
      <p>Preço: R$ ${package.price.toFixed(2)}</p>
      <button onclick="viewPackageDetails(${package.id})">Ver Detalhes</button>
    `;
    
    return card;
  }
  
  function viewPackageDetails(packageId) {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    
    if (!isAuthenticated) {
      alert('Por favor, faça login para ver os detalhes do pacote.');
      return;
    }
    
    window.location.href = `/package-details.html?id=${packageId}`;
  }