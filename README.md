# Micorriza — Sitio web

Sitio web institucional de **Micorriza**: infraestructura inteligente inspirada en redes vivas.

Construido como un sitio estático con HTML, CSS y JavaScript vanilla, fiel a la guía de marca:

- **Paleta:** Tierra Oscura `#3B2E26`, Arcilla `#898561`, Arena `#DCC8A8`, Azul Profundo `#1F3B5B`, Azul Agua `#66B7C9`, Blanco Mineral `#F7F5F2`.
- **Tipografía:** Sora (300/400/500/600/700) — Moderna, Amigable, Versátil.
- **Lenguaje visual:** redes nodales, líneas topográficas, texturas orgánicas, capas de infraestructura.

## Estructura

```
.
├── index.html         # Home (8 secciones)
├── recursos.html      # Página dedicada de whitepapers/casos/guías
├── vistas.html        # Galería de combinaciones portada + transición
├── styles.css         # Sistema de diseño y layout
├── script.js          # Navegación móvil y reveal-on-scroll
├── intros/
│   ├── intros.css     # Estilos overlay + 5 animaciones de bienvenida
│   └── intros.js      # Controlador y secuencias (módulo ES)
├── assets/
│   ├── favicon.svg
│   └── partners/      # Logos placeholder en SVG (currentColor)
└── README.md
```

## Secciones (home)

Estructura editorial deliberadamente compacta — cada sección con un trabajo claro:

1. **Hero** — Propuesta de valor + ilustración SVG de la red micorrícica animada. La lede define el sustrato metafórico: bosque ↔ red invisible.
2. **¿Qué es una micorriza?** — Explainer visual del nombre y la metáfora: tres cards (Hongo + Raíz = Micorriza) con SVG diagramáticos y un puente que conecta la biología con la propuesta de la empresa.
3. **KPI strip** — Banda de credibilidad inmediata: años, sectores, operación, uptime.
4. **Soluciones (01)** — Cuatro principios reescritos con POV Micorriza explícita y iconografía custom.
5. **Sectores (02)** — Tesis "cada sector es un ecosistema" + 6 cards con POV específica de una línea.
6. **Sistemas vivos en producción** — Banda compacta con el panel de métricas en vivo.
7. **Aliados y casos (03)** — Muro de logos placeholder + 2 case study cards con métrica destacada.
8. **Nosotros (04)** — Equipo, credenciales y bento de disciplinas.
9. **Manifiesto** — Cita central como cierre poético antes del CTA.
10. **Contacto** — Formulario y CTA final.

Los recursos (whitepapers, casos extensos, guías) viven ahora en **`recursos.html`** — accesibles desde nav y footer. Las secciones "Capacidades" (iconografía decorativa) y la "Tecnología" extensa quedaron deliberadamente fuera de la home: aportaban menos de lo que ocupaban.

## Aliados y casos

La sección `#aliados` muestra dos bloques de prueba social:

### Logo wall

7 logos placeholder en `assets/partners/` (SVG monolínea, viewBox `200×60`,
`stroke="currentColor"` para que el CSS controle su color y estado de hover).
Para reemplazar por logos reales:

1. Coloca el logo nuevo en `assets/partners/logo-<slug>.svg`.
2. Mantén el mismo viewBox (`200×60`) y usa `currentColor` en lugar de
   colores fijos para que herede los estados de la grilla.
3. Reemplaza el `<svg>` inline correspondiente dentro de `index.html`
   bajo la `.partners-grid`.

Comportamiento por defecto: monocromos en color arcilla y opacidad 0.75;
en hover suben a azul Micorriza y opacidad completa.

### Case study cards

Dos `.case-card` con: sector tag (pill agua-claro), título h3, descripción
corta, métrica grande tipográfica (Fraunces 500) y CTA "Ver caso completo →".
Diseñadas para ser duplicadas — basta copiar el bloque `<article class="case-card">`
y ajustar contenido. La grilla `.cases-grid` colapsa a una columna en mobile.

## Desarrollo local

No requiere build. Sirve la carpeta con cualquier servidor estático:

```bash
python3 -m http.server 8000
# o
npx serve .
```

Luego abre <http://localhost:8000>.

## Despliegue — GitHub Pages

El sitio se publica directamente desde la rama, sin pipeline.

**Configuración por única vez:**

1. En el repositorio: `Settings` → `Pages`.
2. *Build and deployment* → *Source*: **Deploy from a branch**.
3. *Branch*: la rama de publicación (p. ej. `main`) · *Folder*: **`/ (root)`**.
4. **Save**. La URL aparece arriba (`https://<usuario>.github.io/<repo>/`)
   en cuanto termina el primer build (~1 min).

El archivo `.nojekyll` desactiva el procesamiento Jekyll: acelera el build
y evita transformaciones no deseadas sobre nuestros archivos.

Para usar un dominio propio (p. ej. `micorriza.tech`), añade un archivo
`CNAME` en la raíz con el dominio y configura los DNS según la documentación
oficial de GitHub Pages.

## Animaciones de bienvenida (intros)

El sitio reproduce una transición de bienvenida la primera vez que un visitante
llega en una sesión. Hay cuatro candidatas implementadas en `intros/intros.js`:

| ID | Concepto | Tecnología |
|---|---|---|
| `simbiosis` *(default)* | Hongo (izq) + raíz del árbol (der) crecen y se encuentran en el centro. Aparecen los nodos de la interfaz micorrícica con halo agua. Partículas doradas (azúcares) viajan del árbol hacia el hongo; partículas azules (agua/minerales) viajan del hongo hacia el árbol. En la unión se forma el nombre **Micorriza**. Etimología etiquetada (MYCO · HONGO / RHIZA · RAÍZ). | SVG + CSS + SMIL animateMotion |
| `mycelium`  | Raíces, red neuronal, nutrientes, arrayán que crece, hongos al pie y bosque interconectado. | SVG + CSS + SMIL |
| `logo`      | Construcción del logo Micorriza nodo a nodo + wordmark. | SVG + CSS |
| `spores`    | Esporas que caen, aterrizan y germinan en micelios. | SVG + WAAPI |
| `emergence` | Capa de tierra con raíces colgantes que se repliega hacia arriba. | SVG + CSS |

### Vistas (galería)

`vistas.html` muestra cada combinación **portada + transición** como una tarjeta:

- **Reproducir**: lanza la transición en overlay sobre la galería.
- **Abrir vista completa**: navega a `index.html?portada=1&intro=<id>`,
  forzando esa transición sobre el sitio real.
- **Marcar como predeterminada**: persiste la elección en `localStorage`
  (`micorriza:intro:default`). Se aplicará a futuros visitantes.

### Selección en `index.html`

Orden de prioridad al cargar:

1. Query param `?intro=mycelium|logo|spores|emergence|none` — fuerza esa
   intro (o ninguna) y **no** marca la sesión como vista. Ideal para QA y
   enlaces compartibles.
2. `localStorage["micorriza:intro:default"]` — la intro elegida en la galería.
3. Default: `mycelium`.

Si `sessionStorage["micorriza:intro:played"]` está marcado, la intro se omite
hasta que el usuario abra una pestaña/sesión nueva. `prefers-reduced-motion`
desactiva todas las intros.

Skip manual: clic en el botón **Saltar** (esquina inferior derecha) o tecla
`Esc` durante la reproducción.
