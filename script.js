// Ссылки на опубликованные CSV-файлы
const indexSheetUrl = "https://docs.google.com/spreadsheets/d/1bnGVEQUkAyMB3CoFyUremGd-_WSuKyGH_vR7Ojl2usY/export?format=csv&gid=0";
const changeSheetUrl = "https://docs.google.com/spreadsheets/d/1bnGVEQUkAyMB3CoFyUremGd-_WSuKyGH_vR7Ojl2usY/export?format=csv&gid=943962094";

// Функция для получения данных из Google Sheets
function fetchSheetData() {
    // Получаем текущий индекс
    fetch(indexSheetUrl)
        .then(response => response.text())
        .then(indexData => {
            const index = parseInt(indexData.split("\n")[1].trim()); // Индекс из первого листа

            // Получаем данные с листа "Change"
            fetch(changeSheetUrl)
                .then(response => response.text())
                .then(changeData => {
                    const rows = changeData.split("\n").slice(1); // Убираем заголовок
                    const entries = rows.map(row => {
                        const [phoneNumber, message] = row.split(",");
                        return { phoneNumber, message };
                    });

                    // Выбираем данные по индексу
                    const { phoneNumber, message } = entries[index];

                    // Формируем ссылку для WhatsApp
                    const redirectUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                    // Обновляем индекс в листе Index (например, увеличиваем на 1, и сбрасываем на 0, если > 2)
                    const nextIndex = (index + 1) % 3;

                    // Перенаправляем через 2 секунды
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);

                    // Сохраняем новый индекс в листе Index (это можно делать через Google Apps Script)
                    // Для этого потребуется дополнительный код для записи данных на Google Sheets
                })
                .catch(error => console.error("Ошибка при загрузке данных с Change:", error));
        })
        .catch(error => console.error("Ошибка при загрузке данных с Index:", error));
}

// Запуск функции при загрузке страницы
window.onload = fetchSheetData;

// Функция для ручного редиректа
function goToWhatsApp() {
    fetchSheetData();
}
