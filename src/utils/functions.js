/*
 * Форматирование вывода цепочки редиректов
 */
export const formatChains = chains => {
    const result = chains.map(chain => {
        return `${chain.http_code} : ${chain.location}`
    });
    return result.join("<br />");
};

/*
* Скачивание отчета в Excel
*/
export const download = async (data) => {
    fetch(`/responser/xls.php?timestamp=${new Date().getTime()}`,
        {
            method: 'POST',
            headers: {
                'Accept': 'application/vnd.ms-excel',
            },
            responseType: 'blob',
            body: JSON.stringify(data)
        }
    )
    .then(response => {
        if (response.ok) {
            return response.blob();
        }
    })
    .then(blob => {
        var downloadUrl = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "report.xls";
        document.body.appendChild(a);
        a.click();
    });
};

/*
 * Выбираем следующий адрес для проверки, у которого статус verified=false
 */
export const findNextPage = (pages) => pages.find(item => item.verified === false ? item : null)