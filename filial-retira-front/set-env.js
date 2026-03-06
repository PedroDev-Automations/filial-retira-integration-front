const fs = require('fs');

// Descobre o IP que você cadastrou no painel da Netlify (ou usa o localhost por padrão)
const apiUrl = process.env.API_URL || 'http://localhost:8080/api/integracao';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};`;

// Cria a pasta caso não exista
fs.mkdirSync('./src/environments', { recursive: true });

// Escreve a configuração antes do Angular compilar
fs.writeFileSync('./src/environments/environment.ts', envConfigFile);

console.log(`🚀 Script: Variável API_URL gerada com sucesso -> ${apiUrl}`);