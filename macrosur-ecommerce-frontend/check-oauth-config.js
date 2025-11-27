/**
 * Script de diagnóstico OAuth2
 * Ejecutar con: node check-oauth-config.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando configuración OAuth2...\n');

// Verificar archivo .env.local
const envPath = path.join(__dirname, '.env.local');
const hasEnvFile = fs.existsSync(envPath);

if (hasEnvFile) {
  console.log('✅ Archivo .env.local encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const googleMatch = envContent.match(/VITE_GOOGLE_CLIENT_ID=(.+)/);
  const microsoftMatch = envContent.match(/VITE_MICROSOFT_CLIENT_ID=(.+)/);
  
  if (googleMatch && googleMatch[1] !== 'YOUR_GOOGLE_CLIENT_ID' && googleMatch[1].trim()) {
    console.log('✅ Google Client ID configurado:', googleMatch[1].substring(0, 20) + '...');
  } else {
    console.log('⚠️  Google Client ID no configurado en .env.local');
  }
  
  if (microsoftMatch && microsoftMatch[1] !== 'YOUR_MICROSOFT_CLIENT_ID' && microsoftMatch[1].trim()) {
    console.log('✅ Microsoft Client ID configurado:', microsoftMatch[1].substring(0, 20) + '...');
  } else {
    console.log('ℹ️  Microsoft Client ID no configurado (opcional)');
  }
} else {
  console.log('⚠️  Archivo .env.local no encontrado');
  console.log('   Puedes crearlo copiando .env.example:');
  console.log('   cp .env.example .env.local');
}

console.log('\n📝 Alternativas de configuración:\n');
console.log('1. Usar .env.local (Recomendado):');
console.log('   - Copiar .env.example a .env.local');
console.log('   - Editar y pegar tu Client ID');
console.log('   - Reiniciar servidor: npm run dev\n');

console.log('2. Editar directamente clientAuth.js:');
console.log('   - Abrir: src/api/clientAuth.js');
console.log('   - Buscar línea ~12: clientId: \'YOUR_GOOGLE_CLIENT_ID\'');
console.log('   - Reemplazar con tu Client ID\n');

console.log('📖 Ver instrucciones completas en: COMO_OBTENER_GOOGLE_OAUTH.md\n');

// Verificar si el código tiene las credenciales hardcodeadas
const clientAuthPath = path.join(__dirname, 'src', 'api', 'clientAuth.js');
if (fs.existsSync(clientAuthPath)) {
  const clientAuthContent = fs.readFileSync(clientAuthPath, 'utf8');
  
  if (clientAuthContent.includes("clientId: 'YOUR_GOOGLE_CLIENT_ID'") || 
      clientAuthContent.includes('clientId: "YOUR_GOOGLE_CLIENT_ID"')) {
    console.log('⚠️  clientAuth.js tiene placeholders por defecto\n');
  } else if (clientAuthContent.includes('import.meta.env.VITE_GOOGLE_CLIENT_ID')) {
    console.log('ℹ️  clientAuth.js usa variables de entorno (correcto)\n');
  }
}

console.log('🚀 Siguiente paso:');
console.log('   1. Obtener Client ID de Google Cloud Console');
console.log('   2. Configurar usando una de las alternativas de arriba');
console.log('   3. Probar en: http://localhost:5173/login\n');
