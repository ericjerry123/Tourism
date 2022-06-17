$(document).ready(function () {
    $("#status").delay(5000).fadeOut(3000); //delay --> 延遲幾秒才fadeOut
    $("#preloader").delay(5000).fadeOut(3000);

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
            return search(data);
        })
        .then(citys => {
            return generateCard(citys);
        })
        .catch(err => {
            console.log(err);
        })

    function search(data) {
        let citys = [];
        let searchURL = location.href;
        // console.log(searchURL);

        if (searchURL.indexOf('?') != -1) {
            let ary1 = searchURL.split('?city=');

            let city = decodeURIComponent(ary1[1]);
            // console.log(city);

            if (city === "全國") {
                data.forEach(element => {
                    citys.push(element);
                });
                return citys;
            }

            data.forEach(element => {
                if (element['City'].includes(city)) {
                    citys.push(element);
                }
            });
            return citys;
        }
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
                    $.extend({}, vex.dialog.buttons.NO, { text: '登出' })
                ],
                callback: function (data) {
                    if (!data) {
                        console.log('Cancelled');
                    } else {
                        let logout = "<a class='nav-link' href='index.html'>登出</a>";
                        $("#loginSystem").replaceWith(`<a class="nav-link">歡迎, ${data.username}</a>`);
                        $("#navbarCollapse").append(logout);
                        console.log('Username', data.username, 'Password', data.password);
                    }
                }
            })
        })
    }

    function generateCard(citys) {
        console.log(citys.length);

        if (citys.length === 0) {
            return $("h1").text("尚無資料！");
        }

        for (let i = 1; i <= citys.length; i++) {
            let col = `<div class="col" id="col-${i}">`;
            let card = ` <div class="card" id="card-${i}" style="max-width:540px">`;
            let img = `<img src="" class="card-img-top" alt="圖片" id="img-${i}">`;
            let cardBody = `<div class="card-body" id="body-${i}">`;
            let h5 = `<h5 class="card-title" id="title-${i}">`;
            let p = ` <p class="card-text" id="text-${i}"> `;

            let cols = "#col-" + `${i}`;
            let cards = "#card-" + `${i}`;
            let bodys = "#body-" + `${i}`;


            $("#cards").append(col);

            $(cols).append(card);
            $(cards).append(img).children().attr("src", citys[i - 1]['Photo']);
            $(cards).append(cardBody).children().text(citys[i - 1]['Name']);
            $(bodys).append(h5).children().text(citys[i - 1]['Address']);
            $(bodys).append(p).children().next().text(citys[i - 1]['Tel']);

        }
    }
})
