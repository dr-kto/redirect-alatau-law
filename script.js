const spreadsheetId = '1bnGVEQUkAyMB3CoFyUremGd-_WSuKyGH_vR7Ojl2usY';
const indexUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Index&tq=${encodeURIComponent('SELECT A')}`;
const changeUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=Change&tq=${encodeURIComponent('SELECT A, B')}`;
const updateIndexUrl = 'https://script.google.com/macros/s/AKfycbzHJybAnTej_2007fXN5PXxRAYrGKuipV4GU2H8HkUm_4H-I0gpx5ccPjMCkqWa6GM_sg/exec'; // вставь свой

function fetchSheetData() {
    console.log("Загрузка индекса...");

    fetch(indexUrl)
        .then(res => res.text())
        .then(indexText => {
            const rawIndexJson = indexText.substring(47).slice(0, -2);
            const indexJson = JSON.parse(rawIndexJson);
            const index = parseInt(indexJson.table.rows[0].c[0].v);

            console.log("Текущий индекс:", index);

            fetch(changeUrl)
                .then(res => res.text())
                .then(changeText => {
                    const rawChangeJson = changeText.substring(47).slice(0, -2);
                    const changeJson = JSON.parse(rawChangeJson);
                    const rows = changeJson.table.rows;

                    if (!rows[index]) {
                        console.error(`Нет строки с индексом ${index}`);
                        return;
                    }

                    const row = rows[index];
                    const phoneNumber = String(row.c[0].v).trim();
                    const message = String(row.c[1].v).trim();

                    console.log("Номер:", phoneNumber);
                    console.log("Сообщение:", message);

                    // ⬇️ Сначала обновляем индекс
                    fetch(updateIndexUrl, { method: 'POST' })
                        .then(() => {
                            console.log("Индекс обновлён. Переход через 2 секунды...");
                            const redirectUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                            
                        })
                        .catch(err => console.error("Ошибка при обновлении индекса:", err));
                })
                .catch(err => console.error("Ошибка при загрузке Change:", err));
        })
        .catch(err => console.error("Ошибка при загрузке Index:", err));
}

window.onload = fetchSheetData;
