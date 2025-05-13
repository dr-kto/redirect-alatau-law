const spreadsheetId = '1bnGVEQUkAyMB3CoFyUremGd-_WSuKyGH_vR7Ojl2usY';

// Чтение индекса из листа Index
const indexUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Index&tq=${encodeURIComponent('SELECT A')}`;

// Чтение всех данных из листа Change
const changeUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Change&tq=${encodeURIComponent('SELECT A, B')}`;

function fetchSheetData() {
    fetch(indexUrl)
        .then(res => res.text())
        .then(indexText => {
            const indexJson = JSON.parse(indexText.substring(47).slice(0, -2));
            const index = parseInt(indexJson.table.rows[0].c[0].v); // значение из A1

            fetch(changeUrl)
                .then(res => res.text())
                .then(changeText => {
                    const changeJson = JSON.parse(changeText.substring(47).slice(0, -2));
                    const rows = changeJson.table.rows;

                    if (!rows[index] || !rows[index].c[0] || !rows[index].c[1]) {
                        console.error("Некорректный индекс или пустые данные.");
                        return;
                    }

                    const phoneNumber = rows[index].c[0].v.trim();
                    const message = rows[index].c[1].v;

                    const redirectUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

                    console.log("Переход на WhatsApp через 2 секунды:", redirectUrl);
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 2000);
                })
                .catch(err => console.error("Ошибка при загрузке Change:", err));
        })
        .catch(err => console.error("Ошибка при загрузке Index:", err));
}

window.onload = fetchSheetData;

// Кнопка (если нужно вручную)
function goToWhatsApp() {
    fetchSheetData();
}
