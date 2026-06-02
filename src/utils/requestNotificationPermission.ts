export function requestNotificationPermission(): void {
  if ("Notification" in window && Notification.permission === "default") {
    void Notification.requestPermission();
  }
}
