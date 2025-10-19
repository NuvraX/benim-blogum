fetch('posts.json')
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById('blog-container');
    posts.forEach(post => {
      const postElement = document.createElement('div');
      postElement.className = 'blog-post';
      postElement.innerHTML = `
        <h2>${post.title}</h2>
        <p><em>${post.date}</em></p>
        <p>${post.content}</p>
      `;
      container.appendChild(postElement);
    });
  })
  .catch(error => console.error('Yazılar yüklenemedi:', error));
