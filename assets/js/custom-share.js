document.addEventListener('DOMContentLoaded', function() {
  // Target the share container correctly
  const shareContainer = document.querySelector('.share');
  if (shareContainer && shareContainer.querySelector('ul')) {
    const ul = shareContainer.querySelector('ul');
    const blueskyLi = document.createElement('li');
    blueskyLi.className = 'list-inline-item';
    blueskyLi.innerHTML = `
      <a href="#" onclick="shareToBluesky();return false;" title="Share on Bluesky">
        <span class="fa-stack fa-lg">
          <i class="fas fa-circle fa-stack-2x" style="color: #1D9BF0;"></i>
          <i class="fas fa-cloud fa-stack-1x fa-inverse"></i>
        </span>
        <span class="sr-only">Share on Bluesky</span>
      </a>`;
    ul.appendChild(blueskyLi);
  }
});

function shareToBluesky() {
  const url = window.location.href;
  const title = document.title.split(' - ')[0];  // Clean title
  window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
}
