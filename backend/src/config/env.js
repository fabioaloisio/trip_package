/**
 * @fileoverview Configuração das variáveis de ambiente
 * @module config/env
 */

import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carrega o arquivo .env da raiz do backend
config({ path: join(__dirname, '../../.env') });

// Verifica se as variáveis essenciais foram carregadas
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Variável de ambiente ${envVar} não definida`);
    }
}

console.log('Diretório do arquivo .env:', join(__dirname, '../../.env'));
console.log('Variáveis carregadas:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME
}); 