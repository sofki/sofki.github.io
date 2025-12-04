function shareToBluesky(url, title) {
  const blueskyUrl = `https://bsky.app/intent/compose?text=${encodeURIComponent(title + ' ' + url)}`;
  window.open(blueskyUrl, '_blank');
}
