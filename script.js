let selectedPackage = '';
let selectedPrice = 0;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Анимация появления карточек при прокрутке
    observeCards();
    
    // Добавляем плавную прокрутку
    smoothScroll();
    
    // Проверяем статус сервера (имитация)
    checkServerStatus();
});

// Функция выбора пакета
function selectPackage(packageName, price) {
    selectedPackage = packageName;
    selectedPrice = price;
    
    // Обновляем модальное окно
    document.getElementById('selectedPackage').textContent = packageName;
    document.getElementById('selectedPrice').textContent = price;
    
    // Показываем модальное окно
    showModal();
    
    // Добавляем анимацию кнопки
    animateButton(event.target);
}

// Показать модальное окно
function showModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Фокус на поле ввода ника
    setTimeout(() => {
        document.getElementById('nickname').focus();
    }, 300);
}

// Закрыть модальное окно
function closeModal() {
    const modal = document.getElementById('purchaseModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Очищаем форму
    document.getElementById('nickname').value = '';
    
    // Сбрасываем выбор способа оплаты
    document.querySelector('input[value="card"]').checked = true;
}

// Подтверждение покупки
function confirmPurchase() {
    const nickname = document.getElementById('nickname').value.trim();
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    
    // Валидация
    if (!nickname) {
        showNotification('Пожалуйста, введите ваш ник в Minecraft', 'error');
        shakeElement(document.getElementById('nickname'));
        return;
    }
    
    if (nickname.length < 3 || nickname.length > 16) {
        showNotification('Ник должен содержать от 3 до 16 символов', 'error');
        shakeElement(document.getElementById('nickname'));
        return;
    }
    
    // Имитация обработки покупки
    const confirmBtn = document.querySelector('.confirm-btn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Обработка...';
    
    // Показываем уведомление об успешной покупке
    setTimeout(() => {
        closeModal();
        showNotification(`✅ Пакет "${selectedPackage}" успешно приобретен для игрока ${nickname}!`, 'success');
        
        // Восстанавливаем кнопку
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Подтвердить покупку';
        
        // Здесь можно добавить логику для отправки данных на сервер
        console.log('Покупка:', {
            package: selectedPackage,
            price: selectedPrice,
            nickname: nickname,
            paymentMethod: paymentMethod,
            timestamp: new Date().toISOString()
        });
    }, 2000);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Стили для уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    `;
    
    // Цвет в зависимости от типа
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4caf50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #d32f2f)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
    
    // Добавляем в DOM
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 5 секунд
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Анимация встряхивания элемента
function shakeElement(element) {
    element.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

// Анимация кнопки
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    button.style.transition = 'transform 0.1s ease';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 100);
}

// Наблюдение за появлением карточек при прокрутке
function observeCards() {
    const cards = document.querySelectorAll('.package-card, .advantage-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
}

// Плавная прокрутка
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Проверка статуса сервера (имитация)
function checkServerStatus() {
    const statusElement = document.querySelector('.server-status');
    
    // Имитация проверки статуса
    setInterval(() => {
        // В реальном приложении здесь был бы запрос к API сервера
        const isOnline = Math.random() > 0.05; // 95% шанс, что сервер онлайн
        
        if (isOnline) {
            statusElement.textContent = 'ОНЛАЙН';
            statusElement.className = 'server-status online';
        } else {
            statusElement.textContent = 'ОФФЛАЙН';
            statusElement.className = 'server-status offline';
        }
    }, 30000); // Проверка каждые 30 секунд
}

// Закрытие модального окна по клику вне его
window.onclick = function(event) {
    const modal = document.getElementById('purchaseModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Закрытие модального окна по клавише Escape
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Обработка Enter в поле ввода ника
document.getElementById('nickname').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        confirmPurchase();
    }
});

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .server-status.offline {
        background: #f44336;
        color: white;
    }
    
    .notification {
        font-family: 'Montserrat', sans-serif;
    }
`;
document.head.appendChild(style);

// Функция для копирования IP сервера
function copyServerIP() {
    const ip = 'f1.rustix.me:27852';
    
    navigator.clipboard.writeText(ip).then(() => {
        showNotification('IP сервера скопирован в буфер обмена!', 'success');
    }).catch(() => {
        // Fallback для старых браузеров
        const textArea = document.createElement('textarea');
        textArea.value = ip;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('IP сервера скопирован в буфер обмена!', 'success');
    });
}

// Добавляем обработчик клика на IP сервера
document.addEventListener('DOMContentLoaded', function() {
    const serverIP = document.querySelector('.server-ip');
    if (serverIP) {
        serverIP.style.cursor = 'pointer';
        serverIP.title = 'Нажмите, чтобы скопировать IP';
        serverIP.addEventListener('click', copyServerIP);
    }
});

// Параллакс эффект для фона
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('body');
    parallax.style.backgroundPositionY = -(scrolled * 0.5) + 'px';
});

// Анимация чисел (цены) при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const prices = document.querySelectorAll('.package-price');
    
    prices.forEach(price => {
        const finalPrice = parseInt(price.textContent);
        let currentPrice = 0;
        const increment = finalPrice / 20;
        const timer = setInterval(() => {
            currentPrice += increment;
            if (currentPrice >= finalPrice) {
                currentPrice = finalPrice;
                clearInterval(timer);
            }
            price.textContent = Math.floor(currentPrice) + ' ₽';
        }, 50);
    });
});
