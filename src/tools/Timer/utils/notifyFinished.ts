export function notifyFinished(): void {
  if ("Notification" in window && Notification.permission === "granted") {
    try {
      new Notification("Timer complete", {
        body: "Your countdown has finished.",
      });
    } catch {
      // The in-page completion alert remains available as a fallback.
    }
  }
}
