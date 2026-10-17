// GET /api/roblox — datos públicos y en vivo de los juegos de la portada (gratis, sin clave).
// Fuentes: games.roblox.com (visitas, favoritos, jugando) y thumbnails.roblox.com (íconos).
const UNIVERSES = ["9796089177", "10530585588", "9573263370"]; // Cholet Aki, Plomo Andino, Pisadão
const TTL = 600; // 10 minutos en caché del borde de Cloudflare

export async function onRequestGet({ request, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL("/api/roblox?v=1", request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;

  const ids = UNIVERSES.join(",");
  try {
    const [gr, ir] = await Promise.all([
      fetch(`https://games.roblox.com/v1/games?universeIds=${ids}`, { cf: { cacheTtl: TTL } }),
      fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${ids}&size=256x256&format=Png&isCircular=false`, { cf: { cacheTtl: TTL } }),
    ]);
    if (!gr.ok) throw new Error("games " + gr.status);
    const games = (await gr.json()).data || [];
    const icons = ir.ok ? (await ir.json()).data || [] : [];
    const iconOf = Object.fromEntries(icons.filter(i => i.state === "Completed").map(i => [String(i.targetId), i.imageUrl]));

    const body = JSON.stringify({
      updated: new Date().toISOString(),
      games: UNIVERSES.map(id => {
        const g = games.find(x => String(x.id) === id) || {};
        return { id, name: g.name ?? null, visits: g.visits ?? null, favoritedCount: g.favoritedCount ?? null,
                 playing: g.playing ?? null, maxPlayers: g.maxPlayers ?? null, placeId: g.rootPlaceId ?? null,
                 icon: iconOf[id] ?? null };
      }),
    });
    const res = new Response(body, { headers: { "content-type": "application/json; charset=utf-8", "cache-control": `public, max-age=${TTL}` } });
    waitUntil(cache.put(key, res.clone()));
    return res;
  } catch (e) {
    return new Response(JSON.stringify({ error: "roblox_unavailable" }), { status: 502, headers: { "content-type": "application/json" } });
  }
}
