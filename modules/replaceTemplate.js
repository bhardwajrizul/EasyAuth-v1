function replaceTemplate(tempHTML, data) {
    let html = tempHTML.replace(/{%USER_EMAIL%}/g, data.userEmail)
    html =html.replace(/{%USER_NAME%}/g, data.userName);
    return html;
}


module.exports = replaceTemplate;