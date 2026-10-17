# akinori796.com.br

Sitio oficial de **Akinori796**: servicios, portafolio, juegos de Roblox, apps gratis y contacto. Idiomas: PT (principal), ES, EN.

## Estructura
- `public/` — el sitio (HTML, imágenes, `_headers`). Todo liviano: nada pesado en GitHub.
- `functions/api/roblox.js` — datos en vivo de los juegos (visitas, favoritos, jugando, íconos). API pública de Roblox, gratis, caché de 10 min.

## Publicar en Cloudflare Pages (plan gratis)
- Framework preset: **None** · Build command: *(vacío)* · Output directory: **`public`**
- Dominio: `akinori796.com.br` (+ `www` redirige al principal).

## Pendiente
- `/api/contact` (formulario → email) con Cloudflare Turnstile.
- Páginas `/privacidade` y `/termos` (PT/ES/EN), `/tiktok` y `/tiktok/callback`.
- Apps gratis: Agenda con reloj, reajuste de alquiler, Pix QR, multa e intereses.
