/**
 * @fileoverview Script principal da página inicial
 */

import { checkAuth } from './auth.js';

// Elementos do DOM
const packagesGrid = document.getElementById('packages-grid');
const loginLink = document.getElementById('login-link');
const dashboardLink = document.getElementById('dashboard-link');
const adminLink = document.getElementById('admin-link');
const logoutBtn = document.getElementById('logout-btn');

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
 * Cria o HTML de um card de pacote
 * @param {Object} package_ - Dados do pacote
 * @returns {string} HTML do card
 */
function createPackageCard(package_) {
    return `
        <div class="package-card">
            <img src="${package_.image_url}" alt="${package_.name}" class="package-image">
            <div class="package-info">
                <h3>${package_.name}</h3>
                <p>${package_.destination}</p>
                <p>Partida: ${formatDate(package_.departure_date)}</p>
                <p class="package-price">${formatPrice(package_.price)}</p>
                <button class="btn-primary" onclick="handleViewDetails(${package_.id})">
                    Ver Detalhes
                </button>
            </div>
        </div>
    `;
}

/**
 * Carrega os pacotes da API
 */
async function loadPackages() {
    try {
        console.log('Carregando pacotes...');
        const API_URL = 'http://localhost:3001/api/packages';
        console.log('Fazendo requisição para:', API_URL);
        
        const response = await fetch(API_URL);
        console.log('Resposta da API:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const packages = await response.json();
        console.log('Pacotes recebidos:', packages);
        
        if (!packages || packages.length === 0) {
            packagesGrid.innerHTML = '<p class="error">Nenhum pacote disponível no momento.</p>';
            return;
        }
        
        packagesGrid.innerHTML = packages
            .map(createPackageCard)
            .join('');
        
        console.log('HTML gerado:', packagesGrid.innerHTML);
    } catch (error) {
        console.error('Erro ao carregar pacotes:', error);
        console.error('Detalhes do erro:', error.message);
        packagesGrid.innerHTML = '<p class="error">Erro ao carregar pacotes. Tente novamente mais tarde.</p>';
    }
}

/**
 * Atualiza a visibilidade dos links de navegação
 * @param {boolean} isAuthenticated - Se o usuário está autenticado
 * @param {boolean} isAdmin - Se o usuário é administrador
 */
function updateNavLinks(isAuthenticated, isAdmin = false) {
    if (loginLink) loginLink.style.display = isAuthenticated ? 'none' : 'block';
    if (dashboardLink) dashboardLink.style.display = isAuthenticated ? 'block' : 'none';
    if (logoutBtn) logoutBtn.style.display = isAuthenticated ? 'block' : 'none';
    
    // Adicionar link para o painel administrativo se o usuário for admin
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'block' : 'none';
    }
}

/**
 * Manipula o clique no botão de ver detalhes
 * @param {number} packageId - ID do pacote
 */
async function handleViewDetails(packageId) {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
        // Salvar o redirecionamento desejado
        sessionStorage.setItem('redirectAfterLogin', `/pages/package-details.html?id=${packageId}`);
        alert('Faça login para ver os detalhes do pacote');
        window.location.href = '/login.html';
        return;
    }
    window.location.href = `/pages/package-details.html?id=${packageId}`;
}

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Verifica autenticação
    const authResult = await checkAuth();
    const isAuthenticated = authResult.isAuthenticated || false;
    const isAdmin = authResult.isAdmin || false;
    
    updateNavLinks(isAuthenticated, isAdmin);
    
    // Carrega os pacotes
    loadPackages();
    
    // Adicionar event listener para o botão de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('/api/auth/logout', {
                    method: 'GET',
                    credentials: 'include'
                });
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Erro ao fazer logout:', error);
            }
        });
    }
});

// Tornar a função disponível globalmente
window.handleViewDetails = handleViewDetails; 
