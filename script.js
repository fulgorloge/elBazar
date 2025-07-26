document.addEventListener('DOMContentLoaded', () => {
    // --- Funcionalidad del Encabezado ---
    const accountLink = document.getElementById('account-link');
    if (accountLink) {
        accountLink.addEventListener('click', function(event) {
            // Evitar que el enlace navegue si solo queremos abrir el dropdown
            // Solo prevenir si estamos en una pantalla donde el dropdown tiene sentido
            if (window.innerWidth > 992) { // Asumiendo que en móvil el menú se gestiona diferente o no tiene dropdown
                event.preventDefault();
                const dropdownMenu = this.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
                }
            }
        });

        // Cerrar el dropdown si se hace clic fuera
        document.addEventListener('click', function(event) {
            if (accountLink && !accountLink.contains(event.target)) {
                const dropdownMenu = accountLink.querySelector('.dropdown-menu');
                if (dropdownMenu) {
                    dropdownMenu.style.display = 'none';
                }
            }
        });
    }

    // --- Funcionalidad del Carrusel Principal ---
    const slides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.prev-slide');
    const nextBtn = document.querySelector('.next-slide');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (slides.length > 0) {
        showSlide(currentSlide); // Mostrar la primera slide al cargar

        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);

        // Auto-avance del carrusel
        setInterval(nextSlide, 5000); // Cambia cada 5 segundos
    }


    // --- Funcionalidad de Pestañas en Mi Cuenta (my-account.html) ---
    const accountSidebarLinks = document.querySelectorAll('.account-sidebar ul li a');
    const accountSections = document.querySelectorAll('.account-section');

    accountSidebarLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Evitar el comportamiento predeterminado del ancla

            // Remover clase 'active' de todos los enlaces y secciones
            accountSidebarLinks.forEach(item => item.classList.remove('active'));
            accountSections.forEach(section => section.classList.remove('active'));

            // Añadir clase 'active' al enlace clickeado
            this.classList.add('active');

            // Mostrar la sección correspondiente
            const targetId = this.getAttribute('href').substring(1); // Obtener el ID sin el '#'
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Activar la primera sección por defecto o la que esté en el hash URL
    const initialHash = window.location.hash;
    if (initialHash) {
        const targetLink = document.querySelector(`.account-sidebar ul li a[href="${initialHash}"]`);
        if (targetLink) {
            targetLink.click(); // Simular un click para activar la sección
        } else {
            // Si el hash no coincide con un enlace, activar el primer enlace por defecto
            if (accountSidebarLinks.length > 0) {
                accountSidebarLinks[0].click();
            }
        }
    } else {
        // Si no hay hash, activar el primer enlace por defecto
        if (accountSidebarLinks.length > 0) {
            accountSidebarLinks[0].click();
        }
    }


    // --- Funcionalidad del Chatbot ---
    const chatbotContainer = document.getElementById('chatbot-container');
    const openChatbotBtn = document.getElementById('open-chatbot-btn');
    const closeChatbotBtn = document.getElementById('close-chatbot');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSendBtn = document.getElementById('chatbot-send-btn');
    const chatbotBody = document.getElementById('chatbot-body');

    if (openChatbotBtn) { // Asegurarse de que los elementos del chatbot existan
        // Abrir chatbot
        openChatbotBtn.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            openChatbotBtn.style.display = 'none'; // Ocultar el botón de abrir
            chatbotInput.focus(); // Poner el foco en el input
            scrollToBottom();
        });

        // Cerrar chatbot
        closeChatbotBtn.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
            openChatbotBtn.style.display = 'flex'; // Mostrar el botón de abrir
        });

        // Función para añadir un mensaje al chat
        function addMessage(text, sender) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', `${sender}-message`);
            messageDiv.textContent = text;
            chatbotBody.appendChild(messageDiv);
            scrollToBottom();
        }

        // Función para desplazar el chat hacia abajo
        function scrollToBottom() {
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }

        // Respuestas predefinidas del bot (simulación)
        const botResponses = {
            "hola": "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            "ayuda": "Claro, puedo ayudarte con preguntas frecuentes, estado de tu pedido o información de productos. ¿Qué necesitas?",
            "pedido": "Para consultar el estado de tu pedido, por favor, visita la sección 'Mis Pedidos' en tu cuenta. Necesitarás tu número de pedido.",
            "gracias": "De nada. ¡Estoy aquí para ayudarte!",
            "producto": "Si tienes preguntas sobre un producto específico, por favor, indícame el nombre o la categoría.",
            "horario": "Nuestro horario de atención es de Lunes a Viernes de 9:00 AM a 6:00 PM (hora de Colombia).",
            "envio": "Puedes encontrar toda la información sobre envíos y entregas en nuestra sección de 'Envíos y Entregas' en el pie de página.",
            "devolucion": "Para devoluciones, por favor, revisa nuestra política de 'Devoluciones y Reembolsos' o contacta a soporte. ¿Necesitas el enlace?",
            "enlace devolucion": "Aquí tienes el enlace a nuestra política de devoluciones: [enlace a tu política de devoluciones].", // Reemplaza con el enlace real
            "default": "Lo siento, no entendí tu pregunta. ¿Podrías reformularla o preguntar sobre otro tema? Puedes intentar con 'ayuda', 'pedido', 'envio', 'devolucion'."
        };

        // Enviar mensaje (al presionar Enter o hacer clic en el botón)
        function sendMessage() {
            const userText = chatbotInput.value.trim();
            if (userText === '') return;

            addMessage(userText, 'user');
            chatbotInput.value = '';

            // Simular respuesta del bot
            setTimeout(() => {
                const lowerCaseText = userText.toLowerCase();
                let botResponse = botResponses["default"];

                // Buscar una respuesta que contenga la palabra clave
                for (const keyword in botResponses) {
                    if (lowerCaseText.includes(keyword)) {
                        botResponse = botResponses[keyword];
                        break;
                    }
                }
                addMessage(botResponse, 'bot');
            }, 500); // Retraso para simular "pensamiento" del bot
        }

        chatbotSendBtn.addEventListener('click', sendMessage);

        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    } // Fin del if para chatbot elements


    // --- Funcionalidad de Preguntas Frecuentes (FAQ) en subscription-plans.html ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            faqItem.classList.toggle('active'); // Alterna la clase 'active'
        });
    });


    // --- Funcionalidad del Carrito y Checkout (Simulación de Precios y Crédito) ---

    // Función para formatear números a COP
    function formatCurrency(amount) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0, // No mostrar decimales para COP
            maximumFractionDigits: 0,
        }).format(amount);
    }

    // SIMULACIÓN DE DATOS DEL CARRITO (En un entorno real, esto vendría de un backend)
    const simulatedCartItems = [
        { name: "Smartphone X", price: 800000, quantity: 1 },
        { name: "Auriculares Bluetooth", price: 120000, quantity: 2 }
    ];
    const simulatedShippingCost = 15000; // Costo de envío fijo para simulación
    const maxCreditValue = 10000; // Valor máximo del crédito en COP

    // --- LÓGICA DE SIMULACIÓN PARA EL CRÉDITO POR 2 COMPRAS ---
    // En un sistema real, este valor provendría de la base de datos del usuario
    // y se incrementaría después de cada compra exitosa.
    const simulatedCompletedPurchases = 1; // <--- CAMBIA ESTE VALOR (0, 1, 2, etc.) para probar la funcionalidad
                                         // 0 o 1 -> Crédito NO disponible
                                         // 2 o más -> Crédito SÍ disponible

    const isCreditAvailable = simulatedCompletedPurchases >= 2;
    // --- FIN LÓGICA DE SIMULACIÓN ---


    // --- Lógica para la página del Carrito (cart.html) ---
    const cartSubtotalElem = document.getElementById('cart-subtotal');
    const cartShippingElem = document.getElementById('cart-shipping');
    const cartTotalElem = document.getElementById('cart-total');
    const cart20PercentElem = document.getElementById('cart-20-percent');
    const cart80PercentEligibleElem = document.getElementById('cart-80-percent-eligible');
    const cartItemsContainer = document.querySelector('.cart-items');

    if (cartSubtotalElem && cartItemsContainer) { // Solo ejecutar si estamos en cart.html
        let currentSubtotal = 0;
        cartItemsContainer.innerHTML = ''; // Limpiar items existentes para simulación

        simulatedCartItems.forEach(item => {
            currentSubtotal += item.price * item.quantity;

            // Añadir item al DOM del carrito (esto es una simulación básica)
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item');
            itemDiv.innerHTML = `
                <img src="https://via.placeholder.com/80x80?text=Producto" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>Precio: ${formatCurrency(item.price)}</p>
                    <div class="quantity-controls">
                        <button>-</button>
                        <span>${item.quantity}</span>
                        <button>+</button>
                    </div>
                </div>
                <div class="item-total">${formatCurrency(item.price * item.quantity)}</div>
                <button class="remove-item"><span class="material-icons">delete</span></button>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });

        const totalCart = currentSubtotal + simulatedShippingCost;
        const commission20Percent = totalCart * 0.20;
        const productValue80Percent = totalCart * 0.80;

        cartSubtotalElem.textContent = formatCurrency(currentSubtotal);
        cartShippingElem.textContent = formatCurrency(simulatedShippingCost);
        cartTotalElem.textContent = formatCurrency(totalCart);
        cart20PercentElem.textContent = formatCurrency(commission20Percent);
        cart80PercentEligibleElem.textContent = formatCurrency(productValue80Percent);
    }

    // --- Lógica para la página de Checkout (checkout.html) ---
    const checkoutSubtotalElem = document.getElementById('checkout-subtotal');
    const checkoutShippingElem = document.getElementById('checkout-shipping');
    const checkoutTotalElem = document.getElementById('checkout-total');
    const checkout20PercentElem = document.getElementById('checkout-20-percent');
    const checkout80PercentElem = document.getElementById('checkout-80-percent');
    const availableCreditElem = document.getElementById('available-credit');
    const applyCreditCheckbox = document.getElementById('apply-credit-checkbox');
    const creditAppliedRow = document.querySelector('.credit-applied-row');
    const creditAppliedElem = document.getElementById('credit-applied');
    const finalAmountToPayElem = document.getElementById('final-amount-to-pay');

    if (checkoutSubtotalElem) { // Solo ejecutar si estamos en checkout.html
        let currentSubtotal = 0;
        simulatedCartItems.forEach(item => {
            currentSubtotal += item.price * item.quantity;
        });

        const totalOrder = currentSubtotal + simulatedShippingCost;
        const commission20Percent = totalOrder * 0.20; // Tu comisión
        let productValue80Percent = totalOrder * 0.80; // Valor del producto sobre el que se aplica el crédito

        checkoutSubtotalElem.textContent = formatCurrency(currentSubtotal);
        checkoutShippingElem.textContent = formatCurrency(simulatedShippingCost);
        checkoutTotalElem.textContent = formatCurrency(totalOrder);
        checkout20PercentElem.textContent = formatCurrency(commission20Percent); // Ahora como "Tu Comisión"
        checkout80PercentElem.textContent = formatCurrency(productValue80Percent); // Ahora como "Valor del Producto"

        // --- ACTUALIZACIÓN AQUÍ: Mostrar crédito disponible condicionalmente ---
        if (isCreditAvailable) {
            availableCreditElem.textContent = formatCurrency(maxCreditValue);
            if (applyCreditCheckbox) applyCreditCheckbox.disabled = false;
        } else {
            availableCreditElem.textContent = "No disponible aún (requiere 2 compras completadas)";
            if (applyCreditCheckbox) {
                applyCreditCheckbox.checked = false;
                applyCreditCheckbox.disabled = true;
            }
        }

        // Función para actualizar el monto final a pagar
        function updateFinalAmount() {
            let creditToApply = 0;

            // --- ACTUALIZACIÓN AQUÍ: Solo aplica crédito si está disponible y el checkbox está marcado ---
            if (isCreditAvailable && applyCreditCheckbox && applyCreditCheckbox.checked) {
                creditToApply = Math.min(maxCreditValue, productValue80Percent);
                creditAppliedRow.style.display = 'flex';
                creditAppliedElem.textContent = formatCurrency(-creditToApply);
            } else {
                creditAppliedRow.style.display = 'none';
                creditAppliedElem.textContent = formatCurrency(0);
            }

            const finalAmount = commission20Percent + (productValue80Percent - creditToApply);
            finalAmountToPayElem.textContent = formatCurrency(finalAmount);
        }

        if (applyCreditCheckbox) {
            applyCreditCheckbox.addEventListener('change', updateFinalAmount);
        }

        updateFinalAmount(); // Llamar a la función al cargar la página para establecer el monto inicial
    }
});
