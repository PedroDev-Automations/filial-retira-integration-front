const fs = require('fs');

// =======================================================
// 1. CONFIGURAÇÃO DO ANGULAR
// =======================================================
const apiUrl = process.env.API_URL || '/api/integracao';

const envConfigFile = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};`;

fs.mkdirSync('./src/environments', { recursive: true });
fs.writeFileSync('./src/environments/environment.ts', envConfigFile);

// =======================================================
// 2. A MÁGICA MULTI-CLIENTE (Geração do Proxy Dinâmico)
// =======================================================
const vpsUrl = process.env.VPS_URL;

// TRAVA DE SEGURANÇA: Se esquecer de configurar na Netlify, o build falha na hora!
if (!vpsUrl) {
  console.error('❌ ERRO FATAL: Variável VPS_URL não foi configurada na Netlify!');
  console.error('👉 O deploy foi abortado para proteger os dados dos clientes.');
  process.exit(1); 
}

const redirectsText = `/api/* ${vpsUrl}/api/:splat  200
/* /index.html 200`;

fs.writeFileSync('./src/_redirects', redirectsText);

console.log(`🚀 Configuração do Cliente gerada com sucesso!`);
console.log(`👉 A Netlify vai redirecionar silenciosamente para a VPS: ${vpsUrl}`);