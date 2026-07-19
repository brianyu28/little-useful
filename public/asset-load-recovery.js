(() => {
  const reloadKey = "asset-load-reload";

  const reloadOnce = () => {
    // Avoid a reload loop if the failure is caused by something persistent.
    if (sessionStorage.getItem(reloadKey)) return;
    sessionStorage.setItem(reloadKey, "true");
    window.location.reload();
  };

  // Vite emits this when a dynamically imported route chunk or its CSS cannot
  // be preloaded.
  window.addEventListener("vite:preloadError", (event) => {
    event.preventDefault();
    reloadOnce();
  });

  // Initial stylesheets and entry scripts do not necessarily produce Vite's
  // preload event, so also catch load failures from those same-origin assets.
  window.addEventListener(
    "error",
    (event) => {
      const element = event.target;
      const assetUrl =
        element instanceof HTMLLinkElement && element.rel === "stylesheet"
          ? element.href
          : element instanceof HTMLScriptElement
            ? element.src
            : null;

      if (assetUrl && new URL(assetUrl).origin === window.location.origin) {
        reloadOnce();
      }
    },
    true,
  );

  window.addEventListener(
    "load",
    () => {
      // Once a complete document loads, allow a future deployment mismatch to
      // trigger one recovery reload of its own.
      sessionStorage.removeItem(reloadKey);
    },
    { once: true },
  );
})();
