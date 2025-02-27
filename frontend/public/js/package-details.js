document.addEventListener('DOMContentLoaded', () => {
    // Carregar o header
    fetch('/templates/header.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;
            // Recarregar os scripts de autenticação após inserir o header
            loadScript('/js/auth.js');
        });

    // Obter ID do pacote da URL
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('id');

    if (packageId) {
        fetchPackageDetails(packageId);
    }
});

function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
}

function fetchPackageDetails(packageId) {
    fetch(`/packages/${packageId}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Não autorizado');
        }
        return response.json();
    })
    .then(package => {
        displayPackageDetails(package);
        setupPriceCalculator(package.price);
    })
    .catch(error => {
        if (error.message === 'Não autorizado') {
            window.location.href = '/login.html';
        }
    });
}

function displayPackageDetails(package) {
    const packageInfo = document.getElementById('package-info');
    packageInfo.innerHTML = `
        <h2>${package.name}</h2>
        <div class="package-details-grid">
            <div class="detail-item">
                <h3>Destino</h3>
                <p>${package.destination}</p>
            </div>
            <div class="detail-item">
                <h3>Data de Partida</h3>
                <p>${new Date(package.departureDate).toLocaleDateString()}</p>
            </div>
            <div class="detail-item">
                <h3>Duração</h3>
                <p>${package.duration}</p>
            </div>
            <div class="detail-item">
                <h3>Local de Partida</h3>
                <p>${package.departureLocation}</p>
            </div>
            <div class="detail-item">
                <h3>Lugares Disponíveis</h3>
                <p>${package.availableSeats}</p>
            </div>
        </div>
        <div class="package-description">
            <h3>Descrição</h3>
            <p>${package.description}</p>
        </div>
    `;
}

function setupPriceCalculator(basePrice) {
    const quantityInput = document.getElementById('quantity');
    const totalPriceSpan = document.getElementById('total-price');
    const pricePerPersonSpan = document.getElementById('price-per-person');

    pricePerPersonSpan.textContent = basePrice.toFixed(2);

    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const total = quantity * basePrice;
        totalPriceSpan.textContent = total.toFixed(2);
    }

    quantityInput.addEventListener('input', updateTotalPrice);
    updateTotalPrice(); // Calcula o preço inicial
}
