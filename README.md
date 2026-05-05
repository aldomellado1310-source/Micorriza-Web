# Micorriza — Sitio web

Sitio web institucional de **Micorriza**: infraestructura inteligente inspirada en redes vivas.

Construido como un sitio estático con HTML, CSS y JavaScript vanilla, fiel a la guía de marca:

- **Paleta:** Tierra Oscura `#3B2E26`, Arcilla `#898561`, Arena `#DCC8A8`, Azul Profundo `#1F3B5B`, Azul Agua `#66B7C9`, Blanco Mineral `#F7F5F2`.
- **Tipografía:** Sora (300/400/500/600/700) — Moderna, Amigable, Versátil.
- **Lenguaje visual:** redes nodales, líneas topográficas, texturas orgánicas, capas de infraestructura.

## Estructura

```
.
├── index.html      # Marcado y secciones del sitio
├── styles.css      # Sistema de diseño y layout
├── script.js       # Navegación móvil y reveal-on-scroll
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

## Despliegue — GitHub Pages (Actions)

El sitio se publica automáticamente con `.github/workflows/pages.yml`.

**Configuración por única vez:**

1. En el repositorio: `Settings` → `Pages`.
2. En *Build and deployment* → *Source*, elige **GitHub Actions**.

A partir de ahí, cada push a `main` (o a la rama de diseño actual) ejecuta
el workflow y publica el sitio. La URL aparece como output del job
`deploy` y queda visible en la pestaña *Environments → github-pages*.

El archivo `.nojekyll` evita que GitHub procese el contenido con Jekyll
(necesario para que carpetas/rutas con prefijo `_` se sirvan tal cual).

Para usar un dominio propio (p. ej. `micorriza.tech`), añade un archivo
`CNAME` en la raíz con el dominio y configura los DNS según la documentación
oficial de GitHub Pages.
