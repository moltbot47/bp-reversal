const CACHE_NAME = "bp-reversal-v1";
const OFFLINE_URL = "/today";

// Install: cache offline page
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip API and auth routes
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/auth/")) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful GET responses
        if (request.method === "GET" && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        // Serve from cache on network failure
        return caches.match(request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  let data = { title: "BP Reversal", body: "Time for your next check-in!" };

  try {
    data = event.data.json();
  } catch {
    // Use default data
  }

  const options = {
    body: data.body,
    icon: data.icon || "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/today",
    },
    actions: [
      { action: "open", title: "Open checklist" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/today";

  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clients) => {
      // Focus existing tab if found
      for (const client of clients) {
        if (client.url.includes(url) && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise open new window
      return self.clients.openWindow(url);
    })
  );
});
