# Escuela Primaria San Francisco — App de Contactos

## Stack

- Next.js 14 + TypeScript (strict mode)
- Firebase (Auth, Firestore)
- Tailwind CSS
- Deploy en Vercel — repo GitHub: jprodriguez467/cef-tel-tutores

## Estructura de roles

- **Padre/Tutor**: sin login — busca al hijo por grado + turno + apellido, carga datos de contacto
- **Docente**: login email/password — solo consulta fichas de alumnos
- **Admin**: login propio — importa CSV, elimina alumnos, ve estadísticas

## Datos Firebase

- Project ID: `cef-tel-tutores`
- Admin email: `admin@cef.edu.ar`
- Colección principal: `alumnos`

## Estructura de un documento en Firestore (colección `alumnos`)

```json
{
  "nombreCompleto": "ACOSTA GIANLUCCA",
  "grado": "1° grado",
  "turno": "manana"
}
```

## Valores exactos — MUY IMPORTANTE

Estos valores deben coincidir EXACTAMENTE entre el CSV, Firestore y el código:

### Grados (campo `grado` en Firestore):

```
"Sala de 3"
"Sala de 4"
"Sala de 5"
"1° grado"
"2° grado"
"3° grado"
"4° grado"
"5° grado"
"6° grado"
"7° grado"
```

> El símbolo `°` es parte del valor. No usar `º` (ordinal masculino) ni omitirlo.

### Turnos (campo `turno` en Firestore):

```
"manana"   ← sin tilde, siempre así
"tarde"
```

> En la UI se muestra "Mañana" / "Tarde" pero en Firestore y en el código se guarda y filtra como "manana" / "tarde".

## Formato del CSV para importar alumnos

```
nombre,grado,turno
ACOSTA GIANLUCCA,1° grado,manana
ALVAREZ PELOZO ZAIR,1° grado,manana
```

- Separador: coma
- Sin comillas
- Columnas obligatorias: `nombre`, `grado`, `turno`
- El campo `nombre` se guarda en Firestore como `nombreCompleto`

## Reglas de TypeScript — NO romper estas reglas en Vercel

1. Todo objeto dinámico debe tener tipo explícito: `const row: Record<string, string> = {}`
2. Acceso a propiedades dinámicas con bracket notation: `row["nombre"]` no `row.nombre`
3. Nunca usar `catch (e)` si `e` no se usa — usar `catch { }` sin variable
4. Estados con archivos: `useState<File | null>(null)` — nunca `useState(null)` solo
5. Valores de Firestore (tipo `unknown`) siempre envolver con `String(valor ?? "")` antes de renderizar
6. Nunca dejar `@ts-ignore` ni `any` explícito sin justificación

## Comandos útiles

```bash
npm run lint          # verificar errores antes de push
npm run build         # simular build de Vercel localmente
git add . && git commit -m "mensaje" && git push
```

## Flujo de trabajo

1. Hacer cambios
2. Correr `npm run lint` — si hay errores, corregirlos antes de continuar
3. Correr `npm run build` — si falla, corregir antes de hacer push
4. Solo hacer push cuando lint y build pasen sin errores

## Archivos principales

- `src/app/admin/page.tsx` — panel administrador (importar CSV, filtros, eliminar)
- `src/app/page.tsx` — búsqueda de alumnos para padres/tutores
- `src/lib/firebase.ts` — configuración de Firebase
- `src/app/login/page.tsx` — login para docentes y admin
  Estoy en Windows con PowerShell. Borrá la carpeta del proyecto anterior con el comando correcto para PowerShell:

Remove-Item -Recurse -Force "C:\Users\Juan P\Desktop\escuela-san-francisco-nuevo"

Luego continuá con el resto del Paso 1 usando comandos compatibles con Windows/PowerShell.
Estamos en Windows PowerShell. La carpeta vieja ya fue borrada. Ahora ejecutá estos comandos uno por uno:

1. cd "C:\Users\Juan P\Desktop"
2. npx create-next-app@latest escuela-san-francisco --typescript --tailwind --eslint --app --src-dir --import-alias "@/\*" --no-git
3. Cuando pregunte "Would you like to use Turbopack?" responder NO
4. cd "C:\Users\Juan P\Desktop\escuela-san-francisco"
5. npm install firebase xlsx lucide-react react-hot-toast
6. git init
7. git add .
8. git commit -m "inicial: proyecto Next.js limpio"
9. npm run build

Reportame el resultado del build. Si hay errores de TypeScript, mostrámelos antes de continuar.
