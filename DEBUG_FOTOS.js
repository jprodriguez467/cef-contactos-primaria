/**
 * DIAGNÓSTICO: Verificar URLs de Fotos Firebase Storage
 * 
 * Agregá este código temporalmente en la consola del navegador (F12 en producción)
 * para debuguear si las URLs están siendo guardadas correctamente en Firestore
 * y si hay errores de CORS o de validez de URL.
 */

// 1. Verificar las URLs guardadas en Firestore
async function verificarFotosEnFirestore() {
  console.log("🔍 Buscando alumnos con fotos en Firestore...");
  
  // Reemplazá estos valores según el grado y turno que quieras verificar
  const grado = "1° grado"; // Cambiar según necesites
  const turno = "manana";   // Cambiar según necesites
  
  // Simular búsqueda (el componente real usa useAlumnos)
  // Abrir DevTools → Network → filtrar por "alumnos"
  // Verificar que las respuestas incluyan el campo "fotoUrl"
  
  console.log("✅ Esperado:", {
    id: "...",
    nombreCompleto: "Juan Pérez",
    grado: "1° grado",
    turno: "manana",
    fotoUrl: "https://firebasestorage.googleapis.com/..."
  });
}

// 2. Verificar si las URLs son accesibles desde el navegador
function verificarAccesoAFoto(fotoUrl: string) {
  console.log("🔗 Verificando acceso a:", fotoUrl);
  
  const img = new Image();
  
  img.onload = () => {
    console.log("✅ ÉXITO: La imagen cargó correctamente");
    console.log("📊 Dimensiones:", img.width, "x", img.height);
  };
  
  img.onerror = () => {
    console.error("❌ ERROR: No se pudo cargar la imagen");
    console.error("Posibles causas:");
    console.error("- CORS: Firebase Storage bloqueando acceso desde este dominio");
    console.error("- URL inválida: La URL está malformada o expirada");
    console.error("- Rutas de Storage: La foto no está en la carpeta 'fotos/'");
  };
  
  img.src = fotoUrl;
}

// 3. Verificar manualmente una URL de prueba
async function probarURLDePrueba() {
  const testUrl = "https://firebasestorage.googleapis.com/v0/b/cef-tel-tutores.appspot.com/o/fotos%2F...";
  console.log("🧪 Probando URL de prueba:", testUrl);
  
  try {
    const response = await fetch(testUrl, { method: 'HEAD' });
    if (response.ok) {
      console.log("✅ URL accesible (HTTP", response.status + ")");
    } else {
      console.log("❌ Error HTTP:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("❌ Error de CORS u otro:", error);
  }
}

console.log(`
📋 PASOS PARA DEBUGUEAR:

1. Abre DevTools (F12) en producción
2. Ve a Console y pega: verificarAccesoAFoto("URL_COMPLETA_AQUI")
   Reemplazá "URL_COMPLETA_AQUI" con una URL que veas en una ficha de alumno
3. Observa si dice ✅ ÉXITO o ❌ ERROR

NOTA IMPORTANTE:
- Las URLs de Firebase Storage NO tienen permisos por defecto
- Necesitas reglas en Firebase Storage console que permitan lectura:
  
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      match /fotos/{allPaths=**} {
        allow read;
        allow write: if request.auth != null;
      }
    }
  }

- También verifica que 'firebasestorage.googleapis.com' esté en:
  next.config.ts → images.remotePatterns ✓ (ya lo está)
`);
