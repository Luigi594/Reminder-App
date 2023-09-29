export default function getExpirationColor(expiresAt: Date) {
  const days = Math.floor((expiresAt.getTime() - Date.now()) / 1000 / 60 / 60);

  if (days < 0) return "text-gray-500 dark:text-gray-500";
  if (days <= 3 * 24) return "text-red-500 dark:text-red-500";
  if (days <= 7 * 24) return "text-orange-500 dark:text-orange-500";

  return "text-green-500 dark:text-green-500";
}
