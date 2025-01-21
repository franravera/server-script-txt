const fs = require('fs');
const path = require('path');

// Ruta del archivo TXT
const filePath = path.join(__dirname, 'archivo.txt');

// Variable para almacenar siempre la última línea leída
let lastLineGlobal = null;

// Crear el archivo si no existe
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '', 'utf8');
  console.log(`Archivo creado: ${filePath}`);
}

// Función para obtener la última línea del archivo
function getLastLine(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.trim().split('\n').filter(line => line.trim() !== ''); // Ignorar líneas vacías
    return lines.length > 0 ? lines[lines.length - 1] : null; // Retornar última línea si existe
  } catch (error) {
    console.error('Error al leer el archivo:', error.message);
    return null;
  }
}

// Función para limpiar el archivo dejando solo la última línea
function cleanFile(filePath) {
  if (lastLineGlobal) {
    try {
      fs.writeFileSync(filePath, `${lastLineGlobal}\n`, 'utf8');
      console.log(`Archivo limpiado. Última línea guardada: "${lastLineGlobal}"`);
    } catch (error) {
      console.error('Error al escribir en el archivo:', error.message);
    }
  } else {
    console.log('No hay ninguna línea para guardar.');
  }
}

// Monitorear cambios en el archivo
fs.watch(filePath, (eventType) => {
  if (eventType === 'change') {
    console.log(`Detectado cambio en el archivo: ${filePath}`);
    const lastLine = getLastLine(filePath);
    if (lastLine) {
      lastLineGlobal = lastLine; // Actualizamos la variable global
      console.log(`Última línea leída automáticamente: "${lastLine}"`);
    }
  }
});

// Leer el último valor periódicamente (en caso de que `fs.watch` falle)
setInterval(() => {
  const lastLine = getLastLine(filePath);
  if (lastLine && lastLine !== lastLineGlobal) {
    lastLineGlobal = lastLine;
    console.log(`Última línea leída periódicamente: "${lastLine}"`);
  }
}, 5000); // Cada 5 segundos

// Limpieza automática del archivo cada 30 segundos
setInterval(() => {
  console.log('Ejecutando limpieza automática...');
  cleanFile(filePath);
}, 30000); // 30 segundos