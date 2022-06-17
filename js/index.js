
$(document).ready(function () {
    login();


    const corsURL = 'https://cors-anywhere.herokuapp.com/';
    const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvAttractions.aspx';

    /**
     * 產生名為 ajax 的 promise 來發送 ajax 請求
     * 
     * @param {*} url 
     * @param {*} data 
     * @param {*} type 
     * @returns promise
     */
    function ajax(url, data, type) {
        return new Promise((resolve, reject) => {
            $.ajax({
                async: true,
                type: type, url: url, data: data, dataType: "json",
                success: function (data) {
                    resolve(data);
                },
                error: function (err) {
                    console.log(err);
                    reject(console.log("無法抓取API, 請確認是否正確！"));
                },
            })
        })
    }

    let url = `${corsURL}${dataUrl}`;
    let data = {};

    let promise = ajax(url, data, "GET");//注意這裡返回的是promise對象 
    promise
        .then(data => {
            console.log(data);
            return data;
        })
        .then(data => {
            card(data);
            return data;
        })
        .then(data => {
            search(data);
            return data;
        })
        .catch(err => {
            console.log(err);
        })

    /**
     * 卡片資訊隨機存取。
     * 
     * @param {*} data 
     */
    function card(data) {
        for (i = 1; i <= 6; i += 2) {
            let number = getRandom();

            let img = "#" + "card-img-top-" + `${i}`;
            let title = "#" + "card-title-" + `${i}`;
            let body1 = "#" + "accordion-body-" + `${i}`;
            let body2 = "#" + "accordion-body-" + `${i * 2}`;
            let footer = "#" + "footer-" + `${i}`;

            $(img).attr("src", data[`${number}`]['Photo']);
            $(title).text(data[`${number}`]["Name"]);
            $(body1).text(data[`${number}`]["Address"]);
            $(body2).text(data[`${number}`]["Introduction"]);
            $(footer).children().text(`聯絡資訊: ${data[`${number}`]['Tel']}`)
        }
    }

    /**
     * 隨機產生亂數
     * 
     * @returns number;
     */
    function getRandom() {
        return Math.floor(Math.random() * 300);
    }

    /**
     * 搜尋
     * 
     * @param {*} data 
     */
    function search(data) {
        let input;

        $(".col-sm").children().click(function () {
            input = $(this).text();
            $(this).attr("href", `./search.html?city=${input}`);
        })

        $("#searchButton").click(function () {

            input = $("#dropdownMenuInput1").val();


            if (input.includes("台")) {
                input = input.replace('台', '臺');
            }

            $("#searchButton").attr("href", `./search.html?city=${input}`);
        })

    }

    function login() {
        $("#loginSystem").click(function (event) {
            event.preventDefault(); /**暫停打開連結的事件 */
            vex.dialog.open({
                message: '請輸入您的帳號密碼',
                input: [
                    '<input name="username" type="text" placeholder="用戶名" required />',
                    '<input name="password" type="password" placeholder="密碼" required />'
                ].join(''),
                buttons: [
                    $.extend({}, vex.dialog.buttons.YES, { text: '登入' }),
                    $.extend({}, vex.dialog.buttons.NO, { text: '返回' })
                ],
                callback: function (data) {
                    if (!data) {
                        console.log('Cancelled');
                    } else {
                        let logout = "<a class='nav-link' href='index.html' id='logout'>登出</a>";
                        $("#loginSystem").replaceWith(`<a class="nav-link">歡迎, ${data.username}</a>`);
                        document.cookie = `username=${data.username}`;
                        $("#navbarCollapse").append(logout);
                        console.log('Username', data.username, 'Password', data.password);
                    }
                }
            })
        })
    }

})
