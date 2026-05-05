# Micorriza — Sitio web

Sitio web institucional de **Micorriza**: infraestructura inteligente inspirada en redes vivas.

Construido como un sitio estático con HTML, CSS y JavaScript vanilla, fiel a la guía de marca:

- **Paleta:** Tierra Oscura `#3B2E26`, Arcilla `#898561`, Arena `#DCC8A8`, Azul Profundo `#1F3B5B`, Azul Agua `#66B7C9`, Blanco Mineral `#F7F5F2`.
- **Tipografía:** Sora (300/400/500/600/700) — Moderna, Amigable, Versátil.
- **Lenguaje visual:** redes nodales, líneas topográficas, texturas orgánicas, capas de infraestructura.

## Estructura

```
.
├── index.html         # Marcado y secciones del sitio
├── vistas.html        # Galería de combinaciones portada + transición
├── styles.css         # Sistema de diseño y layout
├── script.js          # Navegación móvil y reveal-on-scroll
├── intros/
│   ├── intros.css     # Estilos overlay + 4 animaciones de bienvenida
│   └── intros.js      # Controlador y secuencias (módulo ES)
├── assets/
│   └── favicon.svg
└── README.md
```

## Secciones

1. **Hero** — Propuesta de valor + ilustración SVG de la red micorrícica.
2. **Esencia de marca** — Manifiesto y posicionamiento.
3. **Soluciones** — Escalabilidad, resiliencia, seguridad e impacto sostenible.
4. **Sectores** — Industrias atendidas.
5. **Tecnología** — Las cuatro capas (Aplicación, Datos, Red, Infraestructura) + panel de métricas en vivo.
6. **Capacidades** — Iconografía oficial.
7. **Recursos** — Whitepapers, casos de estudio, guías.
8. **Nosotros** — Equipo y manifiesto.
9. **Contacto** — Formulario y CTA final.

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
| `mycelium`  | Hilos que brotan desde el centro y conectan nodos. | SVG + CSS |
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
