fetch('posts.json')
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById('blog-container');
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <img src="${post.image}" alt="${post.title}">
        <h2>${post.title}</h2>
        <p><em>${post.date}</em></p>
        <p>${post.content}</p>
      `;
      container.appendChild(postElement);
    });
  })
  .catch(error => console.error('Yazılar yüklenemedi:', error));
<button onclick="toggleDarkMode()">🌙 Mod Değiştir</button>
<script>
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
</script>
let count = localStorage.getItem('visitCount') || 0;
count++;
localStorage.setItem('visitCount', count);
document.getElementById('count').textContent = count;


