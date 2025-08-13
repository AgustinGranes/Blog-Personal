// Global flag to track if any modal or popup is open
window.isModalOrPopupOpen = false;

// Global scroll disabling functions
function disableBodyScrollGlobally() {
    document.body.style.overflow = 'hidden';
}

function enableBodyScrollGlobally() {
    // Only enable scroll if no project popup or skill modal is currently active
    const projectPopupActive = document.querySelector('.proyecto-popup.active');
    const skillModalActive = document.querySelector('.skill-checkbox:checked');
    const blogPopupActive = document.getElementById('popupBg') && document.getElementById('popupBg').classList.contains('active');

    if (!projectPopupActive && !skillModalActive && !blogPopupActive) {
        document.body.style.overflow = ''; // Restore default body overflow
    }
}

// Script Principal del Portfolio
document.addEventListener('DOMContentLoaded', function() {
    let currentSection = 0;
    const totalSections = document.querySelectorAll('.section').length;
    let isScrolling = false; // Prevents concurrent goToSection calls
    let scrollTimeout;

    const menu = document.querySelector('.menu');
    const sections = document.querySelectorAll('.section');
    const dotNavLinks = document.querySelectorAll('.dot-navigation a');

    function goToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= totalSections || isScrolling) return;
        
        isScrolling = true;
        currentSection = sectionIndex;
        
        sections.forEach((section) => {
            section.style.transform = `translateY(-${currentSection * 100}vh)`;
        });
        
        updateDotNavigation();
        
        if (currentSection > 0) {
            menu.classList.add('hidden');
        } else {
            menu.classList.remove('hidden');
        }
        
        setTimeout(() => {
            isScrolling = false;
        }, 800);
    }

    window.addEventListener('wheel', function(e) {
        if (window.isModalOrPopupOpen) {
            const activeProyectoPopupContent = document.querySelector('.proyecto-popup.active .proyecto-popup-content');
            const activeSkillModal = document.querySelector('.skill-modal[style*="visibility: visible"]');
            const activeBlogPopupContent = document.querySelector('#popupBg.active #popupMainContent');

            let allowModalScroll = false;
            if (activeProyectoPopupContent && activeProyectoPopupContent.contains(e.target) && activeProyectoPopupContent.scrollHeight > activeProyectoPopupContent.clientHeight) {
                allowModalScroll = true;
            } else if (activeSkillModal && activeSkillModal.contains(e.target) && activeSkillModal.scrollHeight > activeSkillModal.clientHeight) {
                allowModalScroll = true;
            } else if (activeBlogPopupContent && activeBlogPopupContent.contains(e.target) && activeBlogPopupContent.scrollHeight > activeBlogPopupContent.clientHeight) {
                allowModalScroll = true;
            }

            if (allowModalScroll) {
                return;
            } else {
                e.preventDefault();
                return;
            }
        }

        if (isScrolling) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (e.deltaY > 0 && currentSection < totalSections - 1) {
                goToSection(currentSection + 1);
            } else if (e.deltaY < 0 && currentSection > 0) {
                goToSection(currentSection - 1);
            }
        }, 50);
    }, { passive: false });

    window.addEventListener('keydown', function(e) {
        if (window.isModalOrPopupOpen) {
            if (e.key === "Escape") {
                const activeProyectoPopup = document.querySelector('.proyecto-popup.active');
                const activeSkillCheckbox = document.querySelector('.skill-checkbox:checked');
                const blogPopup = document.getElementById('popupBg');

                if (activeProyectoPopup) {
                    const closeBtn = activeProyectoPopup.querySelector('.proyecto-popup-close');
                    if(closeBtn) closeBtn.click();
                } else if (activeSkillCheckbox) {
                    const closeLabel = document.querySelector(`label.close-modal-btn[for="${activeSkillCheckbox.id}"]`);
                    if(closeLabel) closeLabel.click();
                } else if (blogPopup && blogPopup.classList.contains('active')) {
                    closePopup(); // Blog popup close function
                }
            }
            return;
        }

        if (isScrolling) return;

        if (e.key === 'ArrowDown' && currentSection < totalSections - 1) {
            goToSection(currentSection + 1);
        } else if (e.key === 'ArrowUp' && currentSection > 0) {
            goToSection(currentSection - 1);
        }
    });

    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', function(e) {
        if (window.isModalOrPopupOpen || isScrolling) return;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', function(e) {
        if (window.isModalOrPopupOpen || isScrolling) return;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const swipeThreshold = 50; 
        if (touchStartY - touchEndY > swipeThreshold) { 
            if (currentSection < totalSections - 1) goToSection(currentSection + 1);
        } else if (touchEndY - touchStartY > swipeThreshold) { 
            if (currentSection > 0) goToSection(currentSection - 1);
        }
    }

    dotNavLinks.forEach((dot) => {
        dot.addEventListener('click', function(e) {
            e.preventDefault();
            if (window.isModalOrPopupOpen || isScrolling) return;
            const sectionIndex = parseInt(this.getAttribute('data-section'));
            goToSection(sectionIndex);
        });
    });

    function updateDotNavigation() {
        dotNavLinks.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSection);
        });
    }

    if (document.getElementById('auto-type')) {
        new Typed("#auto-type", {
            strings: [
                "¡Bienvenido!<br>Mi nombre es <span class='nombre'>Agustín</span>.",
                "Welcome!<br>My name is <span class='nombre'>Agustin</span>.",
                "Bienvenue !<br>Je m'appelle <span class='nombre'>Augustin</span>.",
                "Benvenuto!<br>Mi chiamo <span class='nombre'>Agostino</span>.",
                "Bem-vindo!<br>Meu nome é <span class='nombre'>Agostinho</span>."
            ],
            typeSpeed: 50,
            backSpeed: 50,
            loop: true,
            contentType: 'html'
        });
    }

    if (document.getElementById('about-typed')) {
        new Typed("#about-typed", {
            strings: ["About Me"],
            typeSpeed: 60,
            showCursor: false
        });
    }

    const skillCheckboxes = document.querySelectorAll('.skill-checkbox');
    const skillItems = document.querySelectorAll('.skill-item');

    skillCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parentItem = this.closest('.skill-item');
            if (this.checked) { // Modal is being opened
                window.isModalOrPopupOpen = true;
                disableBodyScrollGlobally();

                skillItems.forEach(item => {
                    if (item !== parentItem) {
                        item.classList.add('disabled');
                    }
                });
            } else { // Modal is being closed
                window.isModalOrPopupOpen = false;
                enableBodyScrollGlobally();

                skillItems.forEach(item => {
                    item.classList.remove('disabled');
                });
            }
        });
    });
    
    updateDotNavigation();
    goToSection(0); // Ensure initial section setup

    const contactForm = document.querySelector('.contact-form');
    if(contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // The form will submit to formsubmit.co, so we don't prevent default
        });
    }
});

// Datos de los proyectos
const proyectos = {
    1: {
        nombre: 'Preguntados',
        imagen: "{% static 'blog/Assets/Preguntados.png' %}",
        descripcion: 'Lenguaje: Python/PyGame\n\nAño: 2024\n\nDescripcion: Proyecto realizado para 3er año de Nivel Secundario, en el cual se nos pide utilizar la libreria PyGame para realizar un juego que luego fue expuesto en la ExpoHuergo 2025. El juego fue utilizado satisfoctoriamente por el publico, y estuvo bien diseñado para haber sido hecho por un adolescente y encima sin experiencia en la libreria que se estaba utilizando.\n\nDificultades: El diseño de la aplicacion fue dificultosa al principio, ya que en su momento aun no contaba con el conocimiento suficiente como para realizar una aplicacion con una buena interfaz grafica. Por otro lado, aprender a usar los comandos y las funciones de una nueva libreria como lo era PyGame fueron otra de las dificultades que se presentaron.\n\nCosas a destacar: Poder haber empleado un sistema de Backend por primera vez, utilizar PyGame por primera vez, trabajar con el manejo de datos, el trabajo en equipo, entre otras cosas, hicieron que quiera destacar este proyecto (el primero de gran importancia en mi carrera como estudiante y como profesional.',
        proposito: 'Este proyecto sirvió como una introducción práctica al desarrollo de juegos y a la gestión de datos en una aplicación interactiva.',
        github: 'https://github.com/AgustinGranes/Portfolio/tree/main/Personal/Preguntados%20(Juego%20-%202024)'
    },
    2: {
        nombre: 'Space Invaders',
        imagen: "{% static 'blog/Assets/Space Invaders.png' %}",
        descripcion: 'Lenguaje: Python/PyGame\n\nAño: 2025\n\nDescripcion: Proyecto realizado para 4to año de Nivel Secundario, en el cual se nos pide utilizar la libreria PyGame para realizar un juego que seria nuestra nota de fin de cuatrimestre. El juego fue calificado por el maestro en base no solo a su diseño, sino a su funcionalidad tambien. El juego, fue aprobado.\n\nDificultades: Simular el juego a la perfeccion fue dificil, la idea no era sencilla de replicar. Trabajar con varios archivos complico la tarea, pero el resultado fue satisfactorio. Devuelta, se hizo dificultoso trabajar con la libreria PyGame\n\nCosas a destacar: Poder recrear el juego tal y como era originalmente, que la funcionalidad y el uso de JSON haya sido satisfactoria, y poder haber realizado mi primer proyecto 100% individual, y haberlo hecho satisfactoriamente, es un gran logro.',
        proposito: 'El objetivo fue replicar la mecánica clásica de Space Invaders, enfocándose en la lógica del juego y la interacción del usuario.',
        github: 'https://github.com/AgustinGranes/Portfolio/tree/main/Personal/Space%20Invaders%20(Juego%20-%202025)'
    }
};

// Script para el popup de Proyectos
document.addEventListener('DOMContentLoaded', function() {
    const proyectoCards = document.querySelectorAll('.proyecto-card');
    const popup = document.getElementById('proyecto-popup');
    if (!popup) return;

    const popupNombre = popup.querySelector('.proyecto-popup-nombre');
    const popupDescripcion = popup.querySelector('.proyecto-popup-descripcion');
    const popupProposito = popup.querySelector('.proyecto-popup-proposito');
    const popupImgContainer = popup.querySelector('.proyecto-popup-img');
    const githubLink = popup.querySelector('#github-repo-link');
    const popupCloseBtn = popup.querySelector('.proyecto-popup-close');

    proyectoCards.forEach(card => {
        card.addEventListener('click', function() {
            const proyectoId = this.getAttribute('data-proyecto');
            const proyectoData = proyectos[proyectoId];

            if (proyectoData) {
                popupNombre.textContent = proyectoData.nombre;
                popupDescripcion.innerHTML = proyectoData.descripcion.replace(/\n/g, '<br>');
                popupProposito.innerHTML = proyectoData.proposito ? proyectoData.proposito.replace(/\n/g, '<br>') : '';
                
                popupImgContainer.innerHTML = '';
                if (proyectoData.imagen) {
                    const img = document.createElement('img');
                    // The image path is now a template literal that needs to be resolved by Django.
                    // This JS runs client-side, so we need to get the path from the HTML element itself.
                    const cardImgSrc = card.querySelector('.proyecto-card-img img').src;
                    img.src = cardImgSrc;
                    img.alt = proyectoData.nombre;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'cover';
                    popupImgContainer.appendChild(img);
                } else {
                    popupImgContainer.textContent = 'Imagen no disponible';
                }

                if (proyectoData.github) {
                    githubLink.href = proyectoData.github;
                    githubLink.style.display = 'inline-flex';
                } else {
                    githubLink.style.display = 'none';
                }

                popup.classList.add('active');
                window.isModalOrPopupOpen = true;
                disableBodyScrollGlobally();
            }
        });
    });

    function cerrarProyectoPopup() {
        popup.classList.remove('active');
        window.isModalOrPopupOpen = false;
        enableBodyScrollGlobally();
    }

    if (popupCloseBtn) {
        popupCloseBtn.addEventListener('click', cerrarProyectoPopup);
    }

    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            cerrarProyectoPopup();
        }
    });
});

// SLIDER PROYECTOS
document.addEventListener('DOMContentLoaded', function() {
    const sliderInner = document.getElementById('slider-proyectos-inner');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    
    if (!sliderInner || !prevBtn || !nextBtn) return;

    const cards = sliderInner.querySelectorAll('.proyecto-card');
    if (cards.length === 0) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    let currentIndex = 0;
    let cardWidth = cards[0].offsetWidth; 
    const gap = 24; 
    let maxVisible = 3; 

    function calculateMaxVisibleAndCardWidth() {
        const sliderVisibleWidth = document.getElementById('slider-proyectos').offsetWidth;
        if (cards.length > 0) {
            cardWidth = cards[0].offsetWidth;
        }
        maxVisible = Math.floor((sliderVisibleWidth + gap) / (cardWidth + gap));
        if (maxVisible < 1) maxVisible = 1;
    }

    function updateSlider() {
        calculateMaxVisibleAndCardWidth(); 

        const offset = currentIndex * (cardWidth + gap);
        sliderInner.style.transform = `translateX(-${offset}px)`;

        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= cards.length - maxVisible || cards.length <= maxVisible;

        prevBtn.classList.toggle('active', currentIndex > 0);
        nextBtn.classList.toggle('active', currentIndex < cards.length - maxVisible && cards.length > maxVisible);
    }

    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    nextBtn.addEventListener('click', function() {
        if (currentIndex < cards.length - maxVisible) {
            currentIndex++;
            updateSlider();
        }
    });

    let resizeTimeoutSlider;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeoutSlider);
        resizeTimeoutSlider = setTimeout(updateSlider, 200);
    });
    
    updateSlider();
});

// Animación del Avión
function startPlaneAnimation() {
    const plane = document.querySelector('.flying-plane');
    if (!plane) return;
    
    function animate() {
        plane.style.animation = 'none';
        void plane.offsetHeight; 
        plane.style.animation = 'flyAcross 7s linear';
        setTimeout(animate, 9000); 
    }
    setTimeout(animate, 500); 
}

document.addEventListener('DOMContentLoaded', function() {
    startPlaneAnimation();
});


// --- SCRIPT DEL BLOG ---
document.addEventListener('DOMContentLoaded', function() {
    const slides = document.getElementById('slides');
    if (!slides || slides.children.length === 0) return;

    let totalSlides = slides.children.length;
    let currentSlide = 0;
    let postsToShow = 1;

    const leftBtn = document.getElementById('sliderLeft');
    const rightBtn = document.getElementById('sliderRight');
    const slider = document.querySelector('#blog .slider');

    function updateSlider() {
        if (slides.children.length === 0) return;
        const slideWidth = slides.children[0].offsetWidth + 24;
        const containerWidth = slider.offsetWidth;
        postsToShow = Math.max(1, Math.floor(containerWidth / slideWidth));

        if (totalSlides > postsToShow) {
            leftBtn.style.display = 'block';
            rightBtn.style.display = 'block';
        } else {
            leftBtn.style.display = 'none';
            rightBtn.style.display = 'none';
        }

        slides.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        updateSliderBtns();
    }

    function moveSlide(dir) {
        currentSlide += dir;
        if (currentSlide < 0) {
            currentSlide = 0;
        }
        if (currentSlide > totalSlides - postsToShow) {
            currentSlide = totalSlides - postsToShow;
        }
        updateSlider();
    }

    function updateSliderBtns() {
        if (leftBtn) leftBtn.disabled = currentSlide === 0;
        if (rightBtn) rightBtn.disabled = currentSlide >= totalSlides - postsToShow;
    }
    
    leftBtn.addEventListener('click', () => moveSlide(-1));
    rightBtn.addEventListener('click', () => moveSlide(1));
    
    window.addEventListener('resize', updateSlider);
    updateSlider();
});

// Los datos de los posts se inicializan desde la plantilla de Django
let postsData = window.postsData || [];

function openPopup(idx) {
    if (typeof postsData === 'undefined' || !postsData[idx]) return;
    
    const post = postsData[idx];
    
    let html = '';
    if (post.cover) {
        html += `<img src="${post.cover}" alt="Portada" onerror="this.src='https://via.placeholder.com/600x300/e0e0e0/999?text=Imagen+no+disponible'">`;
    }
    html += `<h2>${post.title}</h2>`;
    html += `<div style='color:#444;font-size:1.1em;margin-bottom:12px;line-height:1.6;word-wrap:break-word;'>${post.content}</div>`;
    html += `<p style='color:#666;font-size:0.95em;'><i>${post.pub_date}</i></p>`;
    html += `<div class="comments-section" id="commentsSection"></div>`;
    
    document.getElementById('popupMainContent').innerHTML = html;
    document.getElementById('popupBg').classList.add('active');
    window.isModalOrPopupOpen = true;
    disableBodyScrollGlobally();
    
    loadComments(post.id);
}

function closePopup() {
    document.getElementById('popupBg').classList.remove('active');
    window.isModalOrPopupOpen = false;
    enableBodyScrollGlobally();
}

function loadComments(postId) {
    fetch(`/blog/post/${postId}/comments/`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                renderComments(data.comments, postId);
            }
        });
}

function renderComments(comments, postId) {
    const commentsSection = document.getElementById('commentsSection');
    let html = `
        <div class="comments-title">Comentarios (${comments.length})</div>
        <div class="comment-form">
            <input type="text" class="comment-input" id="usernameInput" placeholder="Tu nombre" maxlength="100">
            <textarea class="comment-textarea" id="commentInput" placeholder="Escribe tu comentario..." maxlength="1000"></textarea>
            <div id="errorMessage" class="error-message" style="display: none;"></div>
            <button class="comment-submit" onclick="submitComment(${postId})">Comentar</button>
        </div>
        <div class="comments-list" id="commentsList">
    `;
    
    if (comments.length === 0) {
        html += '<div class="no-comments">No hay comentarios aún. ¡Sé el primero en comentar!</div>';
    } else {
        comments.forEach(comment => {
            html += `
                <div class="comment">
                    <div class="comment-header">
                        <span class="comment-username">${escapeHtml(comment.username)}</span>
                        <span class="comment-date">${comment.created_date}</span>
                    </div>
                    <div class="comment-content">${escapeHtml(comment.content)}</div>
                </div>
            `;
        });
    }
    
    html += '</div>';
    commentsSection.innerHTML = html;
}

function submitComment(postId) {
    if (!postId) return;
    
    const username = document.getElementById('usernameInput').value.trim();
    const content = document.getElementById('commentInput').value.trim();
    const errorDiv = document.getElementById('errorMessage');
    const submitBtn = document.querySelector('.comment-submit');
    
    errorDiv.style.display = 'none';
    if (!username || !content) {
        showError('Por favor completa todos los campos');
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';
    
    // Obtener el token CSRF de la cookie
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='))?.split('=')[1];

    fetch(`/blog/post/${postId}/comment/add/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({username: username, content: content})
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('usernameInput').value = '';
            document.getElementById('commentInput').value = '';
            loadComments(postId);
        } else {
            showError(data.error || 'Error al enviar comentario');
        }
    })
    .catch(error => showError('Error de conexión'))
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Comentar';
    });
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Agregar el event listener para cerrar el popup
const popupBg = document.getElementById('popupBg');
if (popupBg) {
    popupBg.addEventListener('click', function(e) {
        if (e.target === this) {
            closePopup();
        }
    });
}

// Exponer funciones al objeto window
window.openPopup = openPopup;
window.closePopup = closePopup;
window.submitComment = submitComment;