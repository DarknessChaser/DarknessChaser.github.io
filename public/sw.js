// Legacy Jekyll-era service worker retire script.
// The old hux-blog sw.js aggressively cached pages. On the new Astro site this
// worker unregisters itself and flushes all caches so visitors stop seeing
// stale cached pages.
self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((k) => caches.delete(k)));
			await self.registration.unregister();
			const clientList = await self.clients.matchAll({ type: "window" });
			clientList.forEach((client) => client.navigate(client.url));
		})(),
	);
});
