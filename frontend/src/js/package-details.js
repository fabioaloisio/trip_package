/**
 * @fileoverview Script da página de detalhes do pacote
 */

import { checkAuth } from './auth.js';

// Elementos do DOM
const packageDetails = document.getElementById('package-details');
const quantityInput = document.getElementById('quantity');
const totalSpan = document.getElementById('total');
const bookBtn = document.getElementById('bookBtn');

let currentPackage = null;
const API_URL = 'http://localhost:3001/api';

/**
 * Formata o preço em reais
 * @param {number} price - Preço a ser formatado
 * @returns {string} Preço formatado
 */
function formatPrice(price) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(price);
}

/**
 * Formata a data para o padrão brasileiro
 * @param {string} date - Data em formato ISO
 * @returns {string} Data formatada
 */
function formatDate(date) {
    return new Date(date).toLocaleDateString('pt-BR');
}

/**
 * Atualiza o preço total baseado na quantidade
 */
function updateTotal() {
    if (!currentPackage) return;
    
    const quantity = parseInt(quantityInput.value) || 0;
    const total = quantity * currentPackage.price;
    totalSpan.textContent = formatPrice(total);
}

/**
 * Carrega os detalhes do pacote
 * @param {string} id - ID do pacote
 */
async function loadPackageDetails(id) {
    try {
          // Verificar autenticação antes de carregar os detalhes
          const isAuthenticated = await checkAuth();
          
          if (!isAuthenticated) {
              const currentPath = window.location.pathname + window.location.search;
              sessionStorage.setItem('redirectAfterLogin', currentPath);
              window.location.href = '/login.html';
              return;
          }

          const response = await fetch(`${API_URL}/packages/${id}`, {
              method: 'GET',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              credentials: 'include'
          });
          
          if (!response.ok) {
              const errorData = await response.json();
              console.error('Erro na resposta:', errorData);
              throw new Error(errorData.error || 'Erro ao carregar pacote');
          }
          
          currentPackage = await response.json();
          
          if (!currentPackage) {
              throw new Error('Pacote não encontrado');
          }
          
          packageDetails.innerHTML = `
              <img src="${currentPackage.image_url}" alt="${currentPackage.name}" class="package-image">
              <h2>${currentPackage.name}</h2>
              <p class="package-destination">${currentPackage.destination}</p>
              <p class="package-description">${currentPackage.description}</p>
              <div class="package-info-grid">
                  <div>
                      <strong>Data de Partida:</strong>
                      <p>${formatDate(currentPackage.departure_date)}</p>
                  </div>
                  <div>
                      <strong>Duração:</strong>
                      <p>${currentPackage.duration} dias</p>
                  </div>
                  <div>
                      <strong>Lugares Disponíveis:</strong>
                      <p>${currentPackage.available_seats}</p>
                  </div>
                  <div>
                      <strong>Preço por pessoa:</strong>
                      <p>${formatPrice(currentPackage.price)}</p>
                  </div>
              </div>
          `;
          
          // Atualiza o total inicial
          updateTotal();
          
          // Configura o máximo de lugares disponíveis
          quantityInput.max = currentPackage.available_seats;
          
      } catch (error) {
          console.error('Erro ao carregar detalhes:', error);
          packageDetails.innerHTML = `<p class="error">Erro ao carregar detalhes do pacote: ${error.message}</p>`;
      }
  }

// Event Listeners
quantityInput?.addEventListener('input', updateTotal);

bookBtn?.addEventListener('click', async () => {
    const quantity = parseInt(quantityInput.value);
    if (!quantity || quantity < 1) {
        alert('Por favor, selecione uma quantidade válida');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/packages/${currentPackage.id}/book`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
            throw new Error('Erro ao fazer reserva');
        }
        
        alert('Reserva realizada com sucesso!');
        window.location.href = '/';
        
    } catch (error) {
        console.error('Erro na reserva:', error);
        alert('Erro ao fazer reserva. Tente novamente.');
    }
});

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    try {
          // Obtém o ID do pacote da URL
          const urlParams = new URLSearchParams(window.location.search);
          const packageId = urlParams.get('id');
          
          if (!packageId) {
              window.location.href = '/';
              return;
          }
          
          await loadPackageDetails(packageId);
      } catch (error) {
          console.error('Erro na inicialização:', error);
      }
  }); 