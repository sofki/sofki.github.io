document.addEventListener('DOMContentLoaded', function() {
  const shares = document.querySelectorAll('.share-links li');
  shares.forEach((li, i) => {
    if (i === shares.length - 1) {  // Add after last share button
      const blueskyBtn = document.createElement('li');
      blueskyBtn.className = 'list-inline-item';
      blueskyBtn.innerHTML = `
        <a href="javascript:void(0)" onclick="shareToBluesky()" title="Share on Bluesky">
          <span class="fa-stack fa-lg">
            <i class="fas fa-circle fa-stack-2x"></i>
            <i class="fab fa-bluesky fa-stack-1x fa-inverse"></i>  <!-- or custom SVG -->
          </span>
        </a>`;
      li.parentNode.insertBefore(blueskyBtn, li.nextSibling);
    }
  });
});

function shareToBluesky() {
  const url = window.location.href;
  const title = document.title;
  window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
}
