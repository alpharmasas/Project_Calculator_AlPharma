# Calculadora Farmaceutica AlPharma

Aplicacion web para comparar presentaciones farmaceuticas de baja y alta concentracion, estimando equivalencias, costos, ahorros, tiempos operativos, residuos, incineracion y almacenamiento.

La aplicacion esta construida como frontend estatico con React, TypeScript y Vite. No usa backend ni base de datos; los datos de referencia viven en el codigo fuente.

## Tecnologias

- React
- TypeScript
- Vite
- Recharts
- Lucide React
- IIS para publicacion interna

## Estructura Del Proyecto

```text
index.html
package.json
vite.config.ts
tsconfig.json
src/
  App.tsx
  calculator.ts
  data.ts
  main.tsx
  styles.css
  assets/
dist/
```

## Archivos Principales

### `src/main.tsx`

Punto de entrada de React. Monta el componente principal `App` dentro del HTML base.

### `src/App.tsx`

Componente principal de la interfaz. Contiene:

- Modulo Calculadora.
- Modulo de referencia.
- Modulo de informe.
- Inputs de parametros.
- Graficas.
- Tablas.
- Navegacion entre modulos.
- Vista imprimible del informe.

### `src/calculator.ts`

Motor de calculo de la aplicacion. Recibe los datos seleccionados por el usuario y calcula:

- Equivalencia entre presentaciones.
- Costos mensuales.
- Ahorro mensual.
- Ahorro anual.
- Ahorro porcentual.
- Costo por miligramo.
- Tiempos evitados.
- Residuos evitados.
- Costos evitados de incineracion.
- Ahorro de almacenamiento.

### `src/data.ts`

Contiene los datos base y valores de referencia usados por la calculadora:

- Presentaciones farmaceuticas.
- Molecula.
- Contenido en miligramos.
- Precio de referencia.
- Tiempo de quimico.
- Tiempo de regente/asistente.
- Tiempo de recepcion tecnica.
- Volumen por vial.
- Peso de residuo.
- Costo de incineracion.
- Salarios base.
- Costo de uso del metro cubico.

Actualmente la aplicacion no lee automaticamente el archivo Excel. Si se requiere actualizar valores de referencia, deben actualizarse en `src/data.ts` y luego ejecutar el build.

### `src/styles.css`

Contiene el diseno visual de la aplicacion:

- Layout principal.
- Tarjetas KPI.
- Formularios.
- Tablas.
- Graficas.
- Modulos.
- Responsive.
- Estilos de impresion del informe.

### `src/assets/`

Carpeta de recursos estaticos, como el logo de AlPharma.

### `dist/`

Carpeta generada por Vite para produccion. Es la carpeta publicada por IIS.

No se edita manualmente. Se regenera con:

```powershell
npm run build
```

## Instalacion

Desde la raiz del proyecto:

```powershell
npm install
```

## Desarrollo Local

Para levantar la aplicacion en modo desarrollo:

```powershell
npm run dev
```

La aplicacion queda disponible normalmente en:

```text
http://localhost:5173/
```

El script `dev` usa:

```text
vite --host 0.0.0.0
```

Esto permite acceder tambien desde otros equipos de la red si el firewall lo permite.

## Build De Produccion

Para generar la version productiva:

```powershell
npm run build
```

Este comando ejecuta:

```text
tsc -b && vite build
```

Primero valida TypeScript y luego genera la carpeta `dist/`.

## Vista Previa Del Build

Para probar localmente la carpeta generada:

```powershell
npm run preview
```

## Despliegue En IIS

La aplicacion se publica como sitio estatico. No requiere Node.js corriendo en produccion.

Configuracion usada:

```text
Sitio IIS: CalculadoraAlPharma
Application Pool: CalculadoraAlPharma
Ruta fisica: C:\Data_Code\Project_Calculator_AlPharma\dist
URL interna: http://calculadora.alpharma.local/
```

Configuracion recomendada del Application Pool:

```text
.NET CLR version: Sin codigo administrado
Modo de canalizacion: Integrada
Estado: Iniciado
```

Permisos recomendados sobre la carpeta del proyecto o `dist`:

```text
IIS AppPool\CalculadoraAlPharma
Read & execute
List folder contents
Read
```

Despues de cada cambio en codigo o datos:

```powershell
npm run build
```

Luego refrescar el navegador con:

```text
Ctrl + F5
```

## DNS Interno

Para navegar con:

```text
http://calculadora.alpharma.local/
```

Debe existir un registro DNS interno que apunte al servidor IIS:

```text
calculadora.alpharma.local -> IP_DEL_SERVIDOR_IIS
```

Para pruebas puntuales tambien se puede usar el archivo `hosts` del equipo cliente.

## Modulos De La Aplicacion

### Calculadora

Modulo principal de analisis. Permite seleccionar:

- Presentacion de baja concentracion.
- Presentacion de alta concentracion.
- Consumo mensual de viales.
- Salario quimico.
- Salario regente.
- Precio de las presentaciones.
- Costo de uso del metro cubico.

Muestra KPIs, graficas y tablas de comparacion.

### Modulos De Referencia

Vista de consulta con los valores base usados por el proyecto:

- Parametros generales.
- Precios de venta de referencia.
- Tiempos operativos.
- Residuos e incineracion.
- Almacenamiento.

Esta informacion se alimenta desde `src/data.ts`.

### Informe

Modulo para generar un informe tecnico ejecutivo imprimible. Tiene dos versiones:

- Con graficos.
- Tecnico.

Incluye:

- Membrete con logo de AlPharma.
- Fecha de consulta.
- Comparacion entre presentaciones.
- Equivalencias.
- Montos.
- Metricas.
- Unidades.
- Detalle economico y tecnico.

El boton `Imprimir` usa `window.print()` y los estilos de impresion definidos en `src/styles.css` para imprimir solo el informe.

## Datos Y Fuente De Verdad

La fuente activa de datos para la aplicacion es:

```text
src/data.ts
```

El archivo Excel original puede servir como referencia documental, pero no se lee automaticamente durante `npm run build`.

Si se cambia un valor en Excel, tambien debe actualizarse en `src/data.ts` para que impacte la aplicacion.

Flujo actual:

```text
src/data.ts -> calculator.ts -> App.tsx -> npm run build -> dist -> IIS
```

## Actualizar Valores De Referencia

1. Editar `src/data.ts`.
2. Guardar cambios.
3. Ejecutar:

```powershell
npm run build
```

4. Refrescar la pagina publicada:

```text
Ctrl + F5
```

## Notas Sobre Moneda Y Numeros

Los campos monetarios permiten escribir el numero limpio mientras el input esta enfocado. Al salir del campo, se formatean como moneda COP.

Ejemplo:

```text
10000000 -> $ 10.000.000
```

## Comandos Utiles

```powershell
npm install
npm run dev
npm run build
npm run preview
```

## Consideraciones

- La aplicacion es estatica.
- No requiere servicio Windows para produccion.
- No requiere backend.
- IIS solo sirve los archivos generados en `dist/`.
- Si el navegador no muestra cambios despues de compilar, usar `Ctrl + F5`.
- Si el build falla por permisos en Windows, cerrar procesos que puedan estar usando `dist/` o ejecutar la terminal como administrador.
