function openModal() {
	document.querySelector('.quiz-modal').classList.add('active')
	document.body.classList.add('no-scroll')
}

function closeModal() {
	document.querySelector('.quiz-modal').classList.remove('active')
	document.body.classList.remove('no-scroll')
}

// Бургер-меню
const burgerMenu = document.getElementById('burgerMenu')
const navMenu = document.getElementById('navMenu')
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay')
const menuLinks = document.querySelectorAll('.menu-link')

function toggleMenu() {
	burgerMenu.classList.toggle('active')
	navMenu.classList.toggle('active')
	mobileMenuOverlay.classList.toggle('active')
	document.body.classList.toggle('no-scroll')
}

function closeMenu() {
	burgerMenu.classList.remove('active')
	navMenu.classList.remove('active')
	mobileMenuOverlay.classList.remove('active')
	document.body.classList.remove('no-scroll')
}

burgerMenu.addEventListener('click', toggleMenu)
mobileMenuOverlay.addEventListener('click', closeMenu)

menuLinks.forEach(link => {
	link.addEventListener('click', () => {
		closeMenu()
	})
})

document.addEventListener('keydown', e => {
	if (e.key === 'Escape') {
		closeMenu()
	}
})

window.addEventListener('resize', () => {
	if (window.innerWidth > 768) {
		closeMenu()
	}
})

// Telegram form — tokens must NOT be committed.
// Set locally only (e.g. replace before private deploy), or proxy via a backend.
const TELEGRAM_CONFIG = {
	BOT_TOKEN: '', // revoked from public repo — set locally, never commit
	CHAT_ID: '',
}

// Функция для поиска правильного Chat ID
async function findChatId() {
	try {
		const response = await fetch(
			`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/getUpdates`
		)
		const data = await response.json()

		if (data.ok && data.result.length > 0) {
			const chatId = data.result[0].message.chat.id
			return chatId
		} else {
			return null
		}
	} catch (error) {
		return null
	}
}

// Основная функция отправки
async function sendToTelegram(formData) {
	if (!TELEGRAM_CONFIG.BOT_TOKEN || !TELEGRAM_CONFIG.CHAT_ID) {
		console.error('Telegram bot token/chat id not configured')
		return false
	}

	// Сначала пробуем найти правильный Chat ID
	const correctChatId = await findChatId()
	const chatIdToUse = correctChatId || TELEGRAM_CONFIG.CHAT_ID

	const message =
		`🎯 *НОВАЯ ЗАЯВКА С САЙТА!*\n\n` +
		`👤 *Имя:* ${formData.name}\n` +
		`📱 *Telegram:* ${formData.telegram}\n` +
		`💬 *Пожелания:* ${formData.comment}\n\n` +
		`🕒 *Время:* ${new Date().toLocaleString('ru-RU')}`

	try {
		const response = await fetch(
			`https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: chatIdToUse,
					text: message,
					parse_mode: 'Markdown',
				}),
			}
		)

		const result = await response.json()

		return result.ok
	} catch (error) {
		return false
	}
}

// Обработчик формы - УЛУЧШЕННАЯ ВЕРСИЯ
document.getElementById('form').addEventListener('submit', async function (e) {
	e.preventDefault()

	const submitBtn = document.getElementById('submit-btn')
	const originalText = submitBtn.textContent

	// Показываем загрузку
	submitBtn.textContent = 'Отправляем...'
	submitBtn.disabled = true

	try {
		// Получаем данные формы
		const formData = {
			name: document.getElementById('name').value.trim(),
			telegram: document.getElementById('telegram').value.trim(),
			comment: document.getElementById('comment').value.trim() || 'Не указано',
		}


		// Отправляем в Telegram
		const success = await sendToTelegram(formData)

		if (success) {
			alert(
				'Заявка отправлена! Я свяжусь с вами в Telegram в ближайшее время!'
			)

			// Очищаем форму
			this.reset()

			// Закрываем модальное окно
			setTimeout(() => {
				closeModal()
			}, 500)
		} else {
			alert(
				'Не удалось отправить заявку. Напишите мне напрямую в Telegram: @Dmitriu_web'
			)
		}
	} catch (error) {
		alert('Произошла ошибка. Напишите мне напрямую в Telegram: @Dmitriu_web')
	} finally {
		// Всегда восстанавливаем кнопку
		submitBtn.textContent = originalText
		submitBtn.disabled = false
	}
})


// Закрытие модального окна при клике на оверлей
document.querySelector('.quiz-overlay').addEventListener('click', closeModal)

// Закрытие модального окна по Escape
document.addEventListener('keydown', function (e) {
	if (e.key === 'Escape') {
		closeModal()
	}
})


