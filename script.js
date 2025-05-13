const spreadsheetId = '1bnGVEQUkAyMB3CoFyUremGd-_WSuKyGH_vR7Ojl2usY';

// Чтение индекса из листа Index
const indexUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Index&tq=${encodeURIComponent('SELECT A')}`;

// Чтение всех данных из листа Change
const changeUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Change&tq=${encodeURIComponent('SELECT A, B')}`;

function fetchSheetData() {
    console.log("Загрузка индекса...");

    fetch(indexUrl)
        .then(res => res.text())
        .then(indexText => {
            const rawIndexJson = indexText.substring(47).slice(0, -2);
            console.log("Ответ от Index:", rawIndexJson);

            const indexJson = JSON.parse(rawIndexJson);
            const index = parseInt(indexJson.table.rows[0].c[0].v);

            console.log("Текущий индекс:", index);
            console.log("Загрузка данных Change...");

            fetch(changeUrl)
                .then(res => res.text())
                .then(changeText => {
                    const rawChangeJson = changeText.substring(47).slice(0, -2);
                    console.log("Ответ от Change:", rawChangeJson);

                    const changeJson = JSON.parse(rawChangeJson);
                    const rows = changeJson.table.rows;

                    if (!rows[index]) {
                        console.error(`Нет строки с индексом ${index} в Change`);
                        return;
                    }

                    const row = rows[index];
                    console.log("Выбранная строка:", row);

                    const phoneCell = row.c[0];
                    const messageCell = row.c[1];

                    if (!phoneCell || !messageCell) {
                        console.error("Пустые ячейки:", phoneCell, messageCell);
                        return;
                    }

                    const phoneNumber = String(phoneCell.v).trim();
                    const message = String(messageCell.v).trim();

                    console.log("Номер:", phoneNumber);
                    console.log("Сообщение:", message);

                    const redirectUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    console.log("Ссылка для перехода:", redirectUrl);

                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                })
                .catch(err => console.error("Ошибка при загрузке Change:", err));
        })
        .catch(err => console.error("Ошибка при загрузке Index:", err));
}

window.onload = fetchSheetData;

function goToWhatsApp() {
    fetchSheetData();
}
