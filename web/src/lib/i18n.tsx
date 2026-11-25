import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export const LANGUAGES = [
  { id: 'en', label: 'English', locale: 'en-GB' },
  { id: 'uk', label: 'Українська', locale: 'uk-UA' },
  { id: 'es', label: 'Español', locale: 'es-ES' },
  { id: 'de', label: 'Deutsch', locale: 'de-DE' },
] as const

export type Lang = (typeof LANGUAGES)[number]['id']

export type Translate = (key: string, vars?: Record<string, string | number>) => string

const en = {
  'app.title': 'Kudos — celebrate your team',
  'app.footerLeft': 'Kudos · built for teams who say thanks out loud.',
  'app.footerRight': 'Updates every few seconds — no refresh needed.',
  'app.bootTitle': 'The board is out of reach',
  'app.tryAgain': 'Try again',
  'app.toastSent': 'Kudos sent — that teammate will feel it.',
  'app.toastLoadError': 'Could not load the board.',
  'app.toastReactionError': 'Could not save that reaction.',

  'header.tagline': 'Team recognition',
  'header.viewingAs': 'Viewing as',
  'header.whoAreYou': 'Who are you?',
  'header.you': 'You',
  'header.giveKudos': 'Give kudos',
  'header.kudosShort': 'Kudos',

  'subscribe.cta': 'Weekly GIFs',
  'subscribe.on': 'Subscribed',
  'subscribe.add': 'Subscribe to weekly GIFs',
  'subscribe.remove': 'Unsubscribe from weekly GIFs',

  'theme.label': 'Theme',
  'theme.light': 'Light',
  'theme.dark': 'Dark',
  'theme.system': 'Light and dark',
  'theme.systemHint': 'Follows your device',

  'language.label': 'Language',

  'hero.badge': 'Public recognition',
  'hero.titleLead': 'Great work deserves',
  'hero.titleAccent': 'an audience.',
  'hero.subtitle':
    'Call out the people who made your week better. Say thanks out loud, make it stick, and watch the whole team light up.',
  'hero.cta': 'Celebrate a teammate',
  'hero.spotlightCta': 'See the spotlight',
  'hero.statWeek': 'Kudos this week',
  'hero.statPeople': 'People celebrated',
  'hero.statTotal': 'Kudos all time',

  'feed.title': 'The wall',
  'feed.loading': 'Gathering the latest…',
  'feed.count': '{count} in view',
  'feed.sortGroup': 'Sort kudos',
  'feed.sortNew': 'Newest',
  'feed.sortTop': 'Most loved',
  'feed.searchLabel': 'Search kudos by teammate or message',
  'feed.searchPlaceholder': 'Search a name or a word…',
  'feed.filter': 'Filter',
  'feed.all': 'All',
  'feed.emptyTitle': 'The wall is waiting for its first kudos',
  'feed.emptyBody': 'Be the first to make someone’s day — a few honest words go a long way.',
  'feed.emptyFilteredTitle': 'Nothing matches that yet',
  'feed.emptyFilteredBody': 'Try a different badge or clear the search to see the whole wall.',
  'feed.giveKudos': 'Give kudos',

  'card.celebrated': 'celebrated',
  'card.react': 'React',
  'card.addReaction': 'Add a reaction',
  'card.reactWith': 'React with {emoji}',
  'card.reactWithCount': 'React with {emoji}, {count} so far',

  'time.justNow': 'just now',
  'time.minutes': '{count}m ago',
  'time.hours': '{count}h ago',
  'time.days': '{count}d ago',

  'spotlight.title': 'Spotlight',
  'spotlight.subtitle': 'Most appreciated, all time',
  'spotlight.empty': 'No kudos yet — the spotlight is wide open.',
  'spotlight.categoriesTitle': 'What we celebrate',
  'spotlight.categoriesSubtitle': 'Kudos by badge',
  'spotlight.categoriesEmpty': 'Nothing yet — the first kudos sets the tone.',
  'spotlight.quote':
    '“People will forget what you said, forget what you did, but never forget how you made them feel.”',
  'spotlight.quoteAuthor': 'Maya Angelou',

  'composer.title': 'Give kudos',
  'composer.subtitle': 'Say it out loud — the whole team will see it.',
  'composer.whoDeserves': 'Who deserves it',
  'composer.selected': '{count} selected',
  'composer.searchTeammates': 'Search teammates',
  'composer.findPlaceholder': 'Find a teammate…',
  'composer.noMatch': 'No teammate matches “{query}”.',
  'composer.whatCelebrating': 'What are you celebrating',
  'composer.yourMessage': 'Your message',
  'composer.messagePlaceholder': 'Be specific — what did they do, and why did it matter?',
  'composer.cardStyle': 'Card style',
  'composer.textColor': 'Text color',
  'composer.gif': 'GIF',
  'composer.gifAdd': 'Add a GIF',
  'composer.gifChange': 'Change GIF',
  'composer.gifRemove': 'Remove GIF',
  'composer.gifSearch': 'Search GIFs',
  'composer.gifSearchPlaceholder': 'Search a feeling, a dance, a face…',
  'composer.gifLoading': 'Loading GIFs…',
  'composer.gifEmpty': 'No GIFs match that search.',
  'composer.gifError': 'Could not load GIFs right now.',
  'composer.preview': 'Preview',
  'composer.previewPlaceholder': 'Your words of appreciation will appear here.',
  'composer.postedPublicly': 'Posted publicly to the team wall.',
  'composer.cancel': 'Cancel',
  'composer.post': 'Post kudos',
  'composer.sending': 'Sending…',
  'composer.errorInvalid': 'Add a teammate and at least 10 characters to send this kudos.',
  'composer.errorGeneric': 'Could not send that kudos.',

  'common.and': 'and',
  'common.close': 'Close',

  'badge.teamwork': 'Teamwork',
  'badge.innovation': 'Innovation',
  'badge.kindness': 'Kindness',
  'badge.impact': 'Impact',
  'badge.leadership': 'Leadership',
  'badge.craft': 'Craft',

  'cardTheme.sunrise': 'Sunrise',
  'cardTheme.ocean': 'Ocean',
  'cardTheme.orchid': 'Orchid',
  'cardTheme.forest': 'Forest',

  'color.default': 'Default',
  'color.violet': 'Violet',
  'color.blue': 'Blue',
  'color.emerald': 'Emerald',
  'color.amber': 'Amber',
  'color.rose': 'Rose',
}

type Key = keyof typeof en
type Dict = Partial<Record<Key, string>>

const uk: Dict = {
  'app.title': 'Kudos — святкуймо команду',
  'app.footerLeft': 'Kudos · для команд, які кажуть «дякую» вголос.',
  'app.footerRight': 'Оновлюється кілька разів на хвилину — без перезавантаження.',
  'app.bootTitle': 'Дошка недоступна',
  'app.tryAgain': 'Спробувати ще раз',
  'app.toastSent': 'Дякую надіслано — колега це відчує.',
  'app.toastLoadError': 'Не вдалося завантажити дошку.',
  'app.toastReactionError': 'Не вдалося зберегти реакцію.',

  'header.tagline': 'Визнання команди',
  'header.viewingAs': 'Ви як',
  'header.whoAreYou': 'Хто ви?',
  'header.you': 'Ви',
  'header.giveKudos': 'Подякувати',
  'header.kudosShort': 'Дякую',

  'subscribe.cta': 'Щотижневі GIF',
  'subscribe.on': 'Підписка активна',
  'subscribe.add': 'Підписатися на щотижневі GIF',
  'subscribe.remove': 'Скасувати підписку на щотижневі GIF',

  'theme.label': 'Тема',
  'theme.light': 'Світла',
  'theme.dark': 'Темна',
  'theme.system': 'Світла й темна',
  'theme.systemHint': 'Як на пристрої',

  'language.label': 'Мова',

  'hero.badge': 'Публічне визнання',
  'hero.titleLead': 'Гарна робота заслуговує',
  'hero.titleAccent': 'на глядачів.',
  'hero.subtitle':
    'Відзначте тих, хто зробив ваш тиждень кращим. Скажіть «дякую» вголос, залиште це на стіні — і побачите, як засяє вся команда.',
  'hero.cta': 'Відзначити колегу',
  'hero.spotlightCta': 'Дивитися вітрину',
  'hero.statWeek': 'Дякую цього тижня',
  'hero.statPeople': 'Відзначених людей',
  'hero.statTotal': 'Дякую за весь час',

  'feed.title': 'Стіна',
  'feed.loading': 'Збираємо найновіше…',
  'feed.count': 'У полі зору: {count}',
  'feed.sortGroup': 'Сортувати дякую',
  'feed.sortNew': 'Найновіші',
  'feed.sortTop': 'Найулюбленіші',
  'feed.searchLabel': 'Шукати дякую за колегою або текстом',
  'feed.searchPlaceholder': 'Ім’я або слово…',
  'feed.filter': 'Фільтр',
  'feed.all': 'Усі',
  'feed.emptyTitle': 'Стіна чекає на перше дякую',
  'feed.emptyBody': 'Зробіть комусь день — кілька щирих слів важать багато.',
  'feed.emptyFilteredTitle': 'Поки нічого не знайдено',
  'feed.emptyFilteredBody': 'Спробуйте інший бейдж або очистіть пошук, щоб побачити всю стіну.',
  'feed.giveKudos': 'Подякувати',

  'card.celebrated': 'дякує',
  'card.react': 'Реакція',
  'card.addReaction': 'Додати реакцію',
  'card.reactWith': 'Реакція {emoji}',
  'card.reactWithCount': 'Реакція {emoji}, уже {count}',

  'time.justNow': 'щойно',
  'time.minutes': '{count} хв тому',
  'time.hours': '{count} год тому',
  'time.days': '{count} дн тому',

  'spotlight.title': 'Вітрина',
  'spotlight.subtitle': 'Найбільше визнання за весь час',
  'spotlight.empty': 'Дякую ще немає — вітрина вільна.',
  'spotlight.categoriesTitle': 'Що ми відзначаємо',
  'spotlight.categoriesSubtitle': 'Дякую за бейджами',
  'spotlight.categoriesEmpty': 'Поки порожньо — перше дякую задасть тон.',
  'spotlight.quote':
    '«Люди забудуть, що ви казали, забудуть, що ви робили, але ніколи не забудуть, якими ви змусили їх почуватися».',
  'spotlight.quoteAuthor': 'Мая Анджелу',

  'composer.title': 'Подякувати',
  'composer.subtitle': 'Скажіть це вголос — це побачить уся команда.',
  'composer.whoDeserves': 'Хто заслуговує',
  'composer.selected': 'Обрано: {count}',
  'composer.searchTeammates': 'Пошук колег',
  'composer.findPlaceholder': 'Знайти колегу…',
  'composer.noMatch': 'Немає колег за запитом «{query}».',
  'composer.whatCelebrating': 'Що ви відзначаєте',
  'composer.yourMessage': 'Ваше повідомлення',
  'composer.messagePlaceholder': 'Будьте конкретні — що вони зробили і чому це важливо?',
  'composer.cardStyle': 'Стиль картки',
  'composer.textColor': 'Колір тексту',
  'composer.gif': 'GIF',
  'composer.gifAdd': 'Додати GIF',
  'composer.gifChange': 'Змінити GIF',
  'composer.gifRemove': 'Прибрати GIF',
  'composer.gifSearch': 'Пошук GIF',
  'composer.gifSearchPlaceholder': 'Настрій, танець, обличчя…',
  'composer.gifLoading': 'Завантажуємо GIF…',
  'composer.gifEmpty': 'Нічого не знайдено.',
  'composer.gifError': 'Не вдалося завантажити GIF.',
  'composer.preview': 'Попередній перегляд',
  'composer.previewPlaceholder': 'Тут з’являться ваші слова вдячності.',
  'composer.postedPublicly': 'Публікується на командній стіні.',
  'composer.cancel': 'Скасувати',
  'composer.post': 'Опублікувати',
  'composer.sending': 'Надсилаємо…',
  'composer.errorInvalid': 'Додайте колегу і щонайменше 10 символів, щоб надіслати дякую.',
  'composer.errorGeneric': 'Не вдалося надіслати дякую.',

  'common.and': 'і',
  'common.close': 'Закрити',

  'badge.teamwork': 'Командна робота',
  'badge.innovation': 'Інновації',
  'badge.kindness': 'Доброта',
  'badge.impact': 'Вплив',
  'badge.leadership': 'Лідерство',
  'badge.craft': 'Майстерність',

  'cardTheme.sunrise': 'Світанок',
  'cardTheme.ocean': 'Океан',
  'cardTheme.orchid': 'Орхідея',
  'cardTheme.forest': 'Ліс',

  'color.default': 'Стандартний',
  'color.violet': 'Фіолетовий',
  'color.blue': 'Синій',
  'color.emerald': 'Смарагдовий',
  'color.amber': 'Бурштиновий',
  'color.rose': 'Рожевий',
}

const es: Dict = {
  'app.title': 'Kudos — celebra a tu equipo',
  'app.footerLeft': 'Kudos · para equipos que dan las gracias en voz alta.',
  'app.footerRight': 'Se actualiza cada pocos segundos, sin recargar.',
  'app.bootTitle': 'El tablero no está disponible',
  'app.tryAgain': 'Reintentar',
  'app.toastSent': 'Kudos enviados: tu compañero lo sentirá.',
  'app.toastLoadError': 'No se pudo cargar el tablero.',
  'app.toastReactionError': 'No se pudo guardar la reacción.',

  'header.tagline': 'Reconocimiento del equipo',
  'header.viewingAs': 'Viendo como',
  'header.whoAreYou': '¿Quién eres?',
  'header.you': 'Tú',
  'header.giveKudos': 'Dar kudos',
  'header.kudosShort': 'Kudos',

  'subscribe.cta': 'GIF semanales',
  'subscribe.on': 'Suscrito',
  'subscribe.add': 'Suscribirse a los GIF semanales',
  'subscribe.remove': 'Cancelar la suscripción a los GIF semanales',

  'theme.label': 'Tema',
  'theme.light': 'Claro',
  'theme.dark': 'Oscuro',
  'theme.system': 'Claro y oscuro',
  'theme.systemHint': 'Según tu dispositivo',

  'language.label': 'Idioma',

  'hero.badge': 'Reconocimiento público',
  'hero.titleLead': 'El buen trabajo merece',
  'hero.titleAccent': 'un público.',
  'hero.subtitle':
    'Destaca a quienes mejoraron tu semana. Di gracias en voz alta, haz que perdure y mira cómo se ilumina todo el equipo.',
  'hero.cta': 'Celebrar a un compañero',
  'hero.spotlightCta': 'Ver el escaparate',
  'hero.statWeek': 'Kudos esta semana',
  'hero.statPeople': 'Personas celebradas',
  'hero.statTotal': 'Kudos en total',

  'feed.title': 'El muro',
  'feed.loading': 'Reuniendo lo último…',
  'feed.count': '{count} a la vista',
  'feed.sortGroup': 'Ordenar kudos',
  'feed.sortNew': 'Más recientes',
  'feed.sortTop': 'Más queridos',
  'feed.searchLabel': 'Buscar kudos por compañero o mensaje',
  'feed.searchPlaceholder': 'Busca un nombre o una palabra…',
  'feed.filter': 'Filtrar',
  'feed.all': 'Todos',
  'feed.emptyTitle': 'El muro espera sus primeros kudos',
  'feed.emptyBody': 'Sé quien alegre el día de alguien: unas palabras sinceras valen mucho.',
  'feed.emptyFilteredTitle': 'Aún no hay coincidencias',
  'feed.emptyFilteredBody': 'Prueba otra insignia o borra la búsqueda para ver todo el muro.',
  'feed.giveKudos': 'Dar kudos',

  'card.celebrated': 'reconoce a',
  'card.react': 'Reaccionar',
  'card.addReaction': 'Añadir una reacción',
  'card.reactWith': 'Reaccionar con {emoji}',
  'card.reactWithCount': 'Reaccionar con {emoji}, {count} hasta ahora',

  'time.justNow': 'ahora mismo',
  'time.minutes': 'hace {count} min',
  'time.hours': 'hace {count} h',
  'time.days': 'hace {count} d',

  'spotlight.title': 'Escaparate',
  'spotlight.subtitle': 'Los más valorados de siempre',
  'spotlight.empty': 'Aún no hay kudos: el escaparate está libre.',
  'spotlight.categoriesTitle': 'Lo que celebramos',
  'spotlight.categoriesSubtitle': 'Kudos por insignia',
  'spotlight.categoriesEmpty': 'Nada aún: los primeros kudos marcan el tono.',
  'spotlight.quote':
    '«La gente olvidará lo que dijiste, olvidará lo que hiciste, pero nunca olvidará cómo le hiciste sentir».',
  'spotlight.quoteAuthor': 'Maya Angelou',

  'composer.title': 'Dar kudos',
  'composer.subtitle': 'Dilo en voz alta: lo verá todo el equipo.',
  'composer.whoDeserves': 'Quién lo merece',
  'composer.selected': '{count} seleccionados',
  'composer.searchTeammates': 'Buscar compañeros',
  'composer.findPlaceholder': 'Encuentra a un compañero…',
  'composer.noMatch': 'Ningún compañero coincide con «{query}».',
  'composer.whatCelebrating': 'Qué estás celebrando',
  'composer.yourMessage': 'Tu mensaje',
  'composer.messagePlaceholder': 'Sé concreto: ¿qué hicieron y por qué importó?',
  'composer.cardStyle': 'Estilo de tarjeta',
  'composer.textColor': 'Color del texto',
  'composer.gif': 'GIF',
  'composer.gifAdd': 'Añadir un GIF',
  'composer.gifChange': 'Cambiar GIF',
  'composer.gifRemove': 'Quitar GIF',
  'composer.gifSearch': 'Buscar GIF',
  'composer.gifSearchPlaceholder': 'Un gesto, un baile, una cara…',
  'composer.gifLoading': 'Cargando GIF…',
  'composer.gifEmpty': 'Ningún GIF coincide con esa búsqueda.',
  'composer.gifError': 'No se pudieron cargar los GIF.',
  'composer.preview': 'Vista previa',
  'composer.previewPlaceholder': 'Tus palabras de agradecimiento aparecerán aquí.',
  'composer.postedPublicly': 'Se publica en el muro del equipo.',
  'composer.cancel': 'Cancelar',
  'composer.post': 'Publicar kudos',
  'composer.sending': 'Enviando…',
  'composer.errorInvalid': 'Añade un compañero y al menos 10 caracteres para enviar estos kudos.',
  'composer.errorGeneric': 'No se pudieron enviar los kudos.',

  'common.and': 'y',
  'common.close': 'Cerrar',

  'badge.teamwork': 'Trabajo en equipo',
  'badge.innovation': 'Innovación',
  'badge.kindness': 'Amabilidad',
  'badge.impact': 'Impacto',
  'badge.leadership': 'Liderazgo',
  'badge.craft': 'Oficio',

  'cardTheme.sunrise': 'Amanecer',
  'cardTheme.ocean': 'Océano',
  'cardTheme.orchid': 'Orquídea',
  'cardTheme.forest': 'Bosque',

  'color.default': 'Predeterminado',
  'color.violet': 'Violeta',
  'color.blue': 'Azul',
  'color.emerald': 'Esmeralda',
  'color.amber': 'Ámbar',
  'color.rose': 'Rosa',
}

const de: Dict = {
  'app.title': 'Kudos — feiere dein Team',
  'app.footerLeft': 'Kudos · für Teams, die Danke laut sagen.',
  'app.footerRight': 'Aktualisiert sich alle paar Sekunden — ohne Neuladen.',
  'app.bootTitle': 'Das Board ist nicht erreichbar',
  'app.tryAgain': 'Erneut versuchen',
  'app.toastSent': 'Kudos gesendet — die Person wird es spüren.',
  'app.toastLoadError': 'Das Board konnte nicht geladen werden.',
  'app.toastReactionError': 'Die Reaktion konnte nicht gespeichert werden.',

  'header.tagline': 'Team-Anerkennung',
  'header.viewingAs': 'Angemeldet als',
  'header.whoAreYou': 'Wer bist du?',
  'header.you': 'Du',
  'header.giveKudos': 'Kudos geben',
  'header.kudosShort': 'Kudos',

  'subscribe.cta': 'Wöchentliche GIFs',
  'subscribe.on': 'Abonniert',
  'subscribe.add': 'Wöchentliche GIFs abonnieren',
  'subscribe.remove': 'Wöchentliche GIFs abbestellen',

  'theme.label': 'Design',
  'theme.light': 'Hell',
  'theme.dark': 'Dunkel',
  'theme.system': 'Hell und dunkel',
  'theme.systemHint': 'Wie das Gerät',

  'language.label': 'Sprache',

  'hero.badge': 'Öffentliche Anerkennung',
  'hero.titleLead': 'Gute Arbeit verdient',
  'hero.titleAccent': 'ein Publikum.',
  'hero.subtitle':
    'Nenne die Menschen, die deine Woche besser gemacht haben. Sag Danke laut, mach es sichtbar und sieh zu, wie das ganze Team aufblüht.',
  'hero.cta': 'Kolleg:in feiern',
  'hero.spotlightCta': 'Zum Spotlight',
  'hero.statWeek': 'Kudos diese Woche',
  'hero.statPeople': 'Gefeierte Menschen',
  'hero.statTotal': 'Kudos insgesamt',

  'feed.title': 'Die Wand',
  'feed.loading': 'Neueste werden geladen…',
  'feed.count': '{count} in Sicht',
  'feed.sortGroup': 'Kudos sortieren',
  'feed.sortNew': 'Neueste',
  'feed.sortTop': 'Beliebteste',
  'feed.searchLabel': 'Kudos nach Person oder Text suchen',
  'feed.searchPlaceholder': 'Name oder Wort suchen…',
  'feed.filter': 'Filter',
  'feed.all': 'Alle',
  'feed.emptyTitle': 'Die Wand wartet auf die ersten Kudos',
  'feed.emptyBody': 'Mach jemandem den Tag: ein paar ehrliche Worte bewirken viel.',
  'feed.emptyFilteredTitle': 'Dazu passt noch nichts',
  'feed.emptyFilteredBody': 'Wähle ein anderes Badge oder leere die Suche, um die ganze Wand zu sehen.',
  'feed.giveKudos': 'Kudos geben',

  'card.celebrated': 'sagt Danke an',
  'card.react': 'Reagieren',
  'card.addReaction': 'Reaktion hinzufügen',
  'card.reactWith': 'Mit {emoji} reagieren',
  'card.reactWithCount': 'Mit {emoji} reagieren, bisher {count}',

  'time.justNow': 'gerade eben',
  'time.minutes': 'vor {count} Min.',
  'time.hours': 'vor {count} Std.',
  'time.days': 'vor {count} T.',

  'spotlight.title': 'Spotlight',
  'spotlight.subtitle': 'Am meisten geschätzt, insgesamt',
  'spotlight.empty': 'Noch keine Kudos — das Spotlight ist frei.',
  'spotlight.categoriesTitle': 'Was wir feiern',
  'spotlight.categoriesSubtitle': 'Kudos nach Badge',
  'spotlight.categoriesEmpty': 'Noch nichts — die ersten Kudos geben den Ton an.',
  'spotlight.quote':
    '„Menschen werden vergessen, was du gesagt hast, vergessen, was du getan hast, aber nie vergessen, wie du ihnen zumute gemacht hast.“',
  'spotlight.quoteAuthor': 'Maya Angelou',

  'composer.title': 'Kudos geben',
  'composer.subtitle': 'Sag es laut — das ganze Team sieht es.',
  'composer.whoDeserves': 'Wer hat es verdient',
  'composer.selected': '{count} ausgewählt',
  'composer.searchTeammates': 'Team durchsuchen',
  'composer.findPlaceholder': 'Kolleg:in finden…',
  'composer.noMatch': 'Keine Person passt zu „{query}“.',
  'composer.whatCelebrating': 'Was feierst du',
  'composer.yourMessage': 'Deine Nachricht',
  'composer.messagePlaceholder': 'Sei konkret — was haben sie getan und warum war es wichtig?',
  'composer.cardStyle': 'Kartenstil',
  'composer.textColor': 'Textfarbe',
  'composer.gif': 'GIF',
  'composer.gifAdd': 'GIF hinzufügen',
  'composer.gifChange': 'GIF ändern',
  'composer.gifRemove': 'GIF entfernen',
  'composer.gifSearch': 'GIFs suchen',
  'composer.gifSearchPlaceholder': 'Ein Gefühl, ein Tanz, ein Gesicht…',
  'composer.gifLoading': 'GIFs werden geladen…',
  'composer.gifEmpty': 'Kein GIF passt zu dieser Suche.',
  'composer.gifError': 'GIFs konnten nicht geladen werden.',
  'composer.preview': 'Vorschau',
  'composer.previewPlaceholder': 'Hier erscheinen deine Worte der Anerkennung.',
  'composer.postedPublicly': 'Wird öffentlich an der Team-Wand veröffentlicht.',
  'composer.cancel': 'Abbrechen',
  'composer.post': 'Kudos posten',
  'composer.sending': 'Wird gesendet…',
  'composer.errorInvalid':
    'Füge eine Person und mindestens 10 Zeichen hinzu, um die Kudos zu senden.',
  'composer.errorGeneric': 'Kudos konnten nicht gesendet werden.',

  'common.and': 'und',
  'common.close': 'Schließen',

  'badge.teamwork': 'Teamwork',
  'badge.innovation': 'Innovation',
  'badge.kindness': 'Freundlichkeit',
  'badge.impact': 'Wirkung',
  'badge.leadership': 'Führung',
  'badge.craft': 'Handwerk',

  'cardTheme.sunrise': 'Sonnenaufgang',
  'cardTheme.ocean': 'Ozean',
  'cardTheme.orchid': 'Orchidee',
  'cardTheme.forest': 'Wald',

  'color.default': 'Standard',
  'color.violet': 'Violett',
  'color.blue': 'Blau',
  'color.emerald': 'Smaragd',
  'color.amber': 'Bernstein',
  'color.rose': 'Rosé',
}

const DICTS: Record<Lang, Dict> = { en, uk, es, de }

const STORAGE_KEY = 'kudos.lang'

function isLang(value: string | null): value is Lang {
  return !!value && LANGUAGES.some((language) => language.id === value)
}

export function detectLanguage(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    /* storage can be unavailable */
  }
  const preferred = (navigator.language || '').slice(0, 2).toLowerCase()
  if (isLang(preferred)) return preferred
  return 'en'
}

type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  locale: string
  t: Translate
}

const I18nContext = createContext<I18nValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(detectLanguage)

  const value = useMemo<I18nValue>(() => {
    const dict = DICTS[lang]
    return {
      lang,
      setLang,
      locale: LANGUAGES.find((language) => language.id === lang)?.locale ?? 'en-GB',
      t: (key, vars) => {
        let text = dict[key as Key] ?? en[key as Key] ?? key
        if (vars) {
          for (const [name, replacement] of Object.entries(vars)) {
            text = text.split(`{${name}}`).join(String(replacement))
          }
        }
        return text
      },
    }
  }, [lang])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = value.t('app.title')
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage can be unavailable; the choice still applies for this visit */
    }
  }, [lang, value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used inside a LanguageProvider')
  return context
}
