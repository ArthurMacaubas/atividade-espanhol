// Sistema de Comentarios con localStorage

// Cargar comentarios al abrir la página
document.addEventListener('DOMContentLoaded', function() {
  loadComments();
  setupCommentForm();
});

// Función para cargar comentarios desde localStorage
function loadComments() {
  const commentList = document.getElementById('comment-list');
  const commentCount = document.getElementById('comment-count');
  
  if (!commentList) return; // Si no estamos en la página de blog, salir
  
  // Obtener comentarios del localStorage
  const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
  
  // Actualizar contador
  commentCount.textContent = comments.length;
  
  // Limpiar lista de comentarios
  commentList.innerHTML = '';
  
  // Si no hay comentarios, mostrar mensaje
  if (comments.length === 0) {
    commentList.innerHTML = '<p style="color: var(--muted); text-align: center; padding: 2rem;">Sé el primero en dejar un comentario.</p>';
    return;
  }
  
  // Mostrar comentarios
  comments.forEach((comment, index) => {
    const commentHTML = createCommentElement(comment, index);
    commentList.innerHTML += commentHTML;
  });
}

// Función para crear el HTML de un comentario
function createCommentElement(comment, index) {
  // Obtener las iniciales del nombre
  const initials = comment.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  return `
    <div class="comment-item">
      <div class="comment-avatar">${initials}</div>
      <div class="comment-content">
        <div class="c-meta">
          <strong>${escapeHtml(comment.name)}</strong> · ${comment.date}
          <button class="delete-comment-btn" data-index="${index}" style="float: right; background: none; border: none; color: var(--rust); cursor: pointer; font-size: 0.8rem;">Eliminar</button>
        </div>
        <p>${escapeHtml(comment.text)}</p>
      </div>
    </div>
  `;
}

// Función para escapar caracteres HTML (seguridad)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Función para configurar el formulario de comentarios
function setupCommentForm() {
  const submitBtn = document.getElementById('submit-comment');
  
  if (!submitBtn) return; // Si no estamos en la página de blog, salir
  
  submitBtn.addEventListener('click', function() {
    addComment();
  });
  
  // Permitir enviar comentario con Enter (en textarea con Ctrl+Enter)
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  
  if (nameInput) {
    nameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && textInput.value.trim()) {
        addComment();
      }
    });
  }
  
  if (textInput) {
    textInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' && e.ctrlKey && nameInput.value.trim()) {
        addComment();
      }
    });
  }
}

// Función para agregar un nuevo comentario
function addComment() {
  const nameInput = document.getElementById('comment-name');
  const textInput = document.getElementById('comment-text');
  
  // Validar que los campos no estén vacíos
  if (!nameInput.value.trim()) {
    alert('Por favor, ingresa tu nombre.');
    nameInput.focus();
    return;
  }
  
  if (!textInput.value.trim()) {
    alert('Por favor, escribe un comentario.');
    textInput.focus();
    return;
  }
  
  // Crear objeto de comentario
  const comment = {
    name: nameInput.value.trim(),
    text: textInput.value.trim(),
    date: new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  };
  
  // Obtener comentarios existentes
  const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
  
  // Agregar nuevo comentario
  comments.push(comment);
  
  // Guardar en localStorage
  localStorage.setItem('blogComments', JSON.stringify(comments));
  
  // Limpiar formulario
  nameInput.value = '';
  textInput.value = '';
  
  // Recargar comentarios
  loadComments();
  
  // Mostrar mensaje de éxito
  showSuccessMessage('¡Comentario publicado exitosamente!');
  
  // Scroll a los comentarios
  setTimeout(() => {
    document.getElementById('comment-list').scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

// Función para mostrar mensaje de éxito
function showSuccessMessage(message) {
  const messageDiv = document.createElement('div');
  messageDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--rust);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
  `;
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}

// Delegación de eventos para botones de eliminar
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('delete-comment-btn')) {
    const index = parseInt(e.target.dataset.index);
    deleteComment(index);
  }
});

// Función para eliminar un comentario
function deleteComment(index) {
  if (confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
    const comments = JSON.parse(localStorage.getItem('blogComments')) || [];
    comments.splice(index, 1);
    localStorage.setItem('blogComments', JSON.stringify(comments));
    loadComments();
    showSuccessMessage('Comentario eliminado.');
  }
}

// Agregar estilos de animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .delete-comment-btn {
    opacity: 0;
    transition: opacity 0.2s;
  }
  
  .comment-item:hover .delete-comment-btn {
    opacity: 1;
  }
`;
document.head.appendChild(style);
