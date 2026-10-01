# Manual de Marca y Sistema de Diseño — CGB Academy
## Ecosistema de Capacitación e Inducción Institucional
**Universidad Nacional de San Antonio Abad del Cusco (UNSAAC)**  
*Escuela Profesional de Ingeniería Informática y de Sistemas*  
*Proyecto: Plataforma de Capacitación e Inducción Corporativa CGB Academy*  
*Versión:* 2.0 (Edición Oficial para Desarrollo e Implementación)

---

## 1. Propósito y Filosofía del Sistema

Este documento establece la **normativa visual, estructural y técnica obligatoria** para el desarrollo de la plataforma de **Capacitación e Inducción Institucional de CGB Academy**, integrando de manera transversal las tres unidades corporativas y académicas:

1. **CIIP LATAM** (Centro Internacional de Investigación y Postgrado)
2. **GEOMINA LATAM** (Escuela de Minería, Geología y Geotecnia)
3. **BIOMEDIC LATAM** (Ciencias Biomédicas y Tecnologías para la Salud)

### Enfoque Específico: Capacitación e Inducción
La plataforma está concebida exclusivamente para:
* **Rutas Jerárquicas de Onboarding:** Inducción secuencial para nuevos colaboradores y participantes.
* **Visores de Diapositivas Interactivas:** Presentaciones estructuradas con navegación síncrona y asíncrona.
* **Microevaluaciones Continuas:** Validación de competencias por módulo.
* **Emisión de Acreditaciones:** Constancias y certificados de inducción verificables.

> [!IMPORTANT]
> **Elementos Excluidos:** Se eliminan formalmente todos los artefactos de streaming o "en vivo" (como puntos pulsantes live o canales en directo) ajenos al proceso formativo estructurado de inducción corporativa.

---

## 2. Paleta de Colores Canónica y Roles Semánticos

La identidad cromática transmite **solidez institucional, sobriedad académica y acabado premium**.

### A. Colores Primarios y Acentos Institucionales

| Rol Semántico | Token / Variable CSS | Código Hex | Uso y Aplicación |
| :--- | :--- | :--- | :--- |
| **Navy CGB (Primario)** | `--brand-navy` | `#092A60` | Títulos institucionales, fondos oscuros de actos, rellenos principales. |
| **Navy Alto (Intermedio)**| `--brand-navy-alto` | `#0D3873` | Variación en hover o degradados controlados de fondos oscuros. |
| **Navy Hondo (Profundo)** | `--brand-navy-hondo`| `#05183A` | Fondos de pie de página institucionales y base de elevación. |
| **Azul Acero (Secundario)**| `--brand-blue` | `#146287` | Enlaces, kickers, subtítulos técnicos, iconografía institucional. |
| **Cian CGB (Acento Único)**| `--brand-cyan` | `#4DC4D3` | **La señal de acción exclusiva:** Foco de inputs, chips de estado activo, barras de progreso y botón pill primario. |
| **Cian Hover** | `--brand-cyan-hover` | `#62D8E7` | Estado hover de botones primarios y elementos interactivos cian. |

> [!CAUTION]
> **Norma de Accesibilidad WCAG (Contraste Innegociable):**
> Nunca utilices `#4DC4D3` como color de texto sobre fondos claros o blancos, ya que incumple el ratio de contraste mínimo WCAG AA (requiere 4.5:1). El cian debe usarse exclusivamente como color de fondo con texto en Navy `#092A60`, o como acento vectorial sobre fondos oscuros.

### B. Rampa Canónica de Superficies Claras

Para dar dinamismo y ritmo a las pantallas sin recurrir a contrastes estridentes, solo están permitidas estas cuatro superficies:

1. `#F9FAFB` (`--bg-primary`): Fondo claro base del lienzo institucional.
2. `#F3F6FA` (`--bg-surface-alt`): Superficie clara intermedia para alternancia de bloques y catálogos.
3. `#EEF2F7` (`--bg-surface-deep`): Superficie clara profunda de cierre antes de un acto oscuro.
4. `#FFFFFF` (`--bg-card`): Superficie pura para tarjetas de módulo, formularios y paneles elevados.

> [!WARNING]
> **Prohibición de Grises Fríos Slate:** Queda estrictamente prohibido el uso de grises azulados fríos de Tailwind por defecto (`#f8fafc`, `#f1f5f9`, `#e2e8f0`). Cualquier tinte neutro debe formularse a partir de opacidades controladas del Navy corporativo: `rgba(9, 42, 96, α)`.

### C. Textos y Jerarquía de Contraste

* **Tinta Primaria (Títulos y etiquetas clave):** `#092A60` (sobre fondo claro) / `#FFFFFF` (sobre fondos oscuros).
* **Tinta Secundaria (Cuerpo y párrafos descriptivos):** `#434654` (`--text-secondary`).
* **Tinta Apagada (Metadatos, ayudas, duraciones):** `#5F6673` (`--text-muted`).
* **Placeholder en Formularios:** `rgba(9, 42, 96, 0.32)`.
* **Texto atenuado sobre fondos oscuros:** `rgba(255, 255, 255, 0.72)`.

### D. Bordes y Sombras Tintadas

* **Borde Sutil de Tarjetas:** `rgba(9, 42, 96, 0.11)`.
* **Borde Divisor Interno:** `rgba(9, 42, 96, 0.06)`.
* **Borde de Campos / Inputs:** `rgba(9, 42, 96, 0.12)`.
* **Sombras (Nunca Negro Puro):** Las sombras deben estar teñidas con el navy institucional:
  * Tarjetas estándar: `box-shadow: 0 10px 15px rgba(9, 42, 96, 0.08);`
  * Elementos elevados / Visores: `box-shadow: 0 25px 50px -12px rgba(9, 42, 96, 0.25);`
  * Hover dinámico: `box-shadow: 0 14px 20px rgba(9, 42, 96, 0.12);`

---

## 3. Tipografía Oficial y Escala

La jerarquía visual se resuelve mediante **peso, color y tracking**, evitando saltos desmedidos de tamaño.

### Familias Tipográficas

1. **Titulares, Botones, Precios, Métricas y UI:**
   ```css
   font-family: 'Montserrat', 'Gotham', sans-serif;
   ```
   *Pesos implementados: 700 (Bold), 800 (ExtraBold), 900 (Black).*
2. **Cuerpo de Lectura y Párrafos:**
   ```css
   font-family: 'Inter', sans-serif;
   ```
   *Pesos implementados: 400 (Regular), 500 (Medium), 600 (SemiBold).*
3. **Constancias y Certificados de Inducción:**
   ```css
   font-family: Georgia, 'Times New Roman', serif;
   ```
   *Exclusivo dentro del papel digital de constancias de acreditación.*

> [!NOTE]
> Fuentes como *Poppins*, *Outfit*, *Exo* o *Plus Jakarta Sans* están expresamente prohibidas en todo el proyecto.

### Escala Tipográfica de la Interfaz

| Nivel | Tamaño | Peso | Tracking / Propiedad | Aplicación |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `clamp(28px, 4vw, 48px)` | 800–900 | `-0.02em` | Encabezado principal de inducción. |
| **Título de Sección** | `24px – 32px` | 800 | `-0.015em` | Módulos, arquitectura, rutas. |
| **Título de Tarjeta** | `18px – 20px` | 700 | Normal | Nombre del módulo o unidad. |
| **Cuerpo de Texto** | `14px – 15px` | 400–500 | `line-height: 1.6` | Descripciones de temas y guías. |
| **Metadatos y Leyendas**| `12px – 13px` | 500 | Normal | Duración, requisitos, autoría. |
| **Kickers / Versalitas** | `11px` | 800 | `letter-spacing: 0.12em; text-transform: uppercase;` | Categorías y subtítulos de apoyo. |
| **Botones Píldora** | `12px – 13px` | 700 | `letter-spacing: 0.04em; text-transform: uppercase;` | Botones de acción CTA. |
| **Cifras y Porcentajes**| `16px – 32px` | 800 | `font-variant-numeric: tabular-nums;` | Porcentajes de avance y cronómetros. |

---

## 4. Componentes Específicos para Capacitación e Inducción

### A. Botones (Jerarquía y Accesibilidad)
* **Regla de Jerarquía:** Solo **UN** botón primario píldora por bloque o tarjeta de catálogo.
* **Altura Mínima Táctil:** `48px` (garantiza accesibilidad en móviles y pantallas táctiles).

```css
/* Botón Primario Píldora */
.boton-primario {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 28px;
  min-height: 48px;
  border-radius: var(--radius-full);
  background-color: var(--brand-cyan);
  color: var(--brand-navy);
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(77, 196, 211, 0.25);
  transition: background-color var(--dur-fast) var(--ease-out-soft),
              color var(--dur-fast) var(--ease-out-soft),
              transform var(--dur-fast) var(--ease-out-soft);
}

.boton-primario:hover {
  background-color: var(--brand-blue);
  color: #FFFFFF;
  transform: translateY(-1px);
}

/* Botón Secundario (Outline) */
.boton-secundario {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 26px;
  min-height: 48px;
  border-radius: var(--radius-full);
  border: 1.5px solid rgba(9, 42, 96, 0.25);
  background-color: transparent;
  color: var(--brand-navy);
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all var(--dur-fast) var(--ease-out-soft);
}

.boton-secundario:hover {
  background-color: var(--brand-navy);
  color: #FFFFFF;
  border-color: var(--brand-navy);
  transform: translateY(-1px);
}
```

### B. Barras de Progreso de Inducción
Indican el porcentaje de avance en cada ruta de aprendizaje o módulo formativo:

```css
.barra-progreso {
  width: 100%;
  height: 8px;
  background-color: rgba(9, 42, 96, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.barra-progreso-avance {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-blue), var(--brand-cyan));
  border-radius: var(--radius-full);
  transition: width var(--dur-base) var(--ease-out-soft);
}
```

### C. Chips de Estado de Módulos de Aprendizaje
Etiquetas semánticas para identificar el estado de las capacitaciones:

* `.chip-estado--completado`: Módulo finalizado satisfactoriamente.
* `.chip-estado--en-curso`: Módulo en progreso activo.
* `.chip-estado--pendiente`: Módulo bloqueado o pendiente de inicio.

### D. Visor de Diapositivas de Capacitación
Contenedor con relación de aspecto estandarizada (`16:9`) para reproducir contenidos multimedia y presentaciones:

```css
.visor-diapositiva {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px solid var(--borde-sutil);
  box-shadow: var(--sombra-elevada);
  overflow: hidden;
}
```

### E. Campos de Formulario Accesibles
* Altura: `48px`.
* Fondo en reposo: `#F8F9FC`.
* Radio de borde: `8px` (`--radius-md`).
* Borde en foco: `1px solid var(--brand-cyan)` con halo exterior `box-shadow: 0 0 0 3px rgba(77, 196, 211, 0.25);`.
* Etiquetas: Visibles y permanentes por encima del input (12.5px, peso 700, color navy).

---

## 5. Ritmo de Fondos y Transición de Actos

1. **Continuidad de Bloques:** La navegación visual alterna bloques claros (`#F9FAFB` y `#F3F6FA`) y concluye con actos oscuros (`#092A60` y `#05183A`). Está prohibido intercalar un bloque claro entre dos secciones oscuras (efecto sándwich).
2. **Acto Oscuro con Esquinas Curvas:** La transición de claro a oscuro debe presentar esquinas curvadas de 24px en su borde superior:
   ```css
   .acto-oscuro {
     background-color: var(--brand-navy);
     color: #FFFFFF;
     border-radius: 24px 24px 0 0;
   }
   ```
3. **Contenedor Sticky Seguro:** Tanto en `html` como en `body` se define:
   ```css
   overflow-x: clip; /* 'clip' evita el desbordamiento horizontal sin romper 'position: sticky' */
   ```

---

## 6. Micro-movimiento y Transiciones (Motion Tokens)

Duraciones y aceleraciones oficiales para interacciones de usuario:

```css
--dur-micro: 120ms;  /* Clicks de botones, micro-hover */
--dur-fast: 200ms;   /* Botones, menús, chips */
--dur-base: 320ms;   /* Acordeones, barras de progreso */
--dur-slow: 520ms;   /* Cambios de pantalla */

--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);
--ease-in-out-soft: cubic-bezier(0.65, 0, 0.35, 1);
```

* **Regla Técnica:** Animar estrictamente `transform` y `opacity`. El estado `:hover` nunca debe alterar propiedades que fuercen el recálculo del layout (`width`, `height`, `margin`, `padding`).

---

## 7. Nomenclatura y Convenciones de Código (100% Español)

* **Clases CSS:** Redactadas en español técnico con guiones (`.tarjeta-cgb`, `.boton-primario`, `.barra-progreso`, `.chip-estado`).
* **Variables y Props:** Descriptivas en camelCase en español (`moduloActual`, `porcentajeAvance`, `unidadSeleccionada`).
* **Iconografía:** Exclusivamente SVG inline limpios con trazo de `1.5` a `2.0` (estilo Lucide / Feather). **Prohibido el uso de emojis en componentes de interfaz.**

---

## 8. Lista de Verificación Previa a Pull Request (PR)

Antes de fusionar código hacia `desarrollo` o `edmil-saire`, cada desarrollador debe comprobar:

- [ ] **Paleta:** ¿Todos los colores provienen de las variables de `globals.css` sin hardcodear colores inventados?
- [ ] **Accesibilidad WCAG:** ¿El cian (`#4DC4D3`) se utiliza solo como fondo con texto `#092A60` o acento en oscuro?
- [ ] **Superficies:** ¿Se evitó el uso de grises slate tipo `#f1f5f9`?
- [ ] **Tipografía:** ¿Se emplean Montserrat para títulos/UI e Inter para texto continuo?
- [ ] **Tarjetas:** ¿Tienen la misma altura en la fila usando `flex: 1` y `margin-top: auto` en el pie?
- [ ] **Botones:** ¿Hay un único botón primario sólido por bloque?
- [ ] **Iconos:** ¿Son todos SVG vectoriales y no emojis?
- [ ] **Compilación:** ¿El comando `npm run build` concluye con éxito (código de salida 0)?
