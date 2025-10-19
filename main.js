fetch('data/posts.json')
  .then(response => response.json())
  .then(posts => {
    const container = document.getElementById('blog-posts');
    posts.forEach(post => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;
      container.appendChild(div);
    });
  });
