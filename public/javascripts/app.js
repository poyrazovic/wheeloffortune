let data = localStorage.getItem('wheelOfFortuneData');

data = data ? $.parseJSON(data) : {
    titles: [],
    photos: [],
    colors: []
};

let shotData = localStorage.getItem('shotData');

shotData = shotData ? $.parseJSON(shotData) :  {
    titles: [],
    photos: [],
    colors: [],
    counts: []
};

const $wheelOfFortune = $('#wheel-of-fortune');

Array.prototype.clean = function (deleteValue) {
    for (let i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

$('#addPerson').modal('show');

createPersonList();
createShotList();

$('#addPersonButton').on('click', function () {
    let nameVal = $('#addPersonName').val();
    let colorVal = $('#addPersonColor').val();
    let fileVal = $('#addPersonFile').val();
    let fileB64Val = $('#b64').text();
    if (!nameVal || !colorVal || !fileVal) {
        alert('Alanları doldurun size zahmet!!!');
    } else {
        addPerson({
            name: nameVal,
            color: colorVal,
            file: fileB64Val
        });
        createPersonList();
        $('#addPersonName').val('');
        $('#addPersonColor').val('');
        $('#addPersonFile').val('');
        $('#b64').val('');
        $('#img').attr('src', '');
    }
});

$('#addPersonFile').on('change', readFile);

$('#start').on('click', function () {
    $(this).remove();
    createWheelOfFortune();
    interval();
})/*.trigger('click')*/;

function createWheelOfFortune() {
    let wheelOfFortune = new Chart($wheelOfFortune[0], {
        type: 'pie',
        data: {
            labels: [],
            datasets: [
                {
                    fill: true,
                    borderColor: data.colors,
                    backgroundColor: data.colors,
                    data: function () {
                        const values = [];
                        let percent = 100 / data.titles.length;
                        for (let i = 0; i < data.titles.length; i++) {
                            values.push(percent);
                        }
                        return values;
                    }()
                }
            ]
        },
        left: 0, // left edge of the scale bounding box
        right: 0, // right edge of the bounding box'
        top: 0,
        bottom: 0,
        // Margin on each side. Like css, this is outside the bounding box.
        margins: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        },

        // Amount of padding on the inside of the bounding box (like CSS)
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        tooltip: {
            enabled: false
        }
    });
}

function interval() {
    setInterval(function () {
        rotate();
    }, 1000 * 60 * 10);
}

function rotate() {
    let random = Math.random();
    let randomDeg = Math.round((random < .5 ? random + .5: random) * 360 * 50);
    let time = randomDeg / 360;
    let index = Math.floor(Math.abs(((randomDeg % 360)) - 360) / (360 / data.titles.length));
    console.log(index);
    $("#wheel-of-fortune").rotate({
        duration:time * 1000,
        angle: 0,
        animateTo:randomDeg,
        easing: $.easing.easeOutCirc,
        callback: function () {
            showPerson(index);
            addShotPerson(index);
            removePerson(index);
            createPersonList();
            createShotList();
            setTimeout(function () {
                $("#wheel-of-fortune").rotate({
                    duration:1000,
                    animateTo:0,
                    easing: $.easing.easeOutCirc
                });
                hidePerson();
                createWheelOfFortune();
            }, 1000 * 60);

        }
    });
}

function showPerson(index) {
    $('body').append(`
    <div class="win-person animate">
        <img src="${data.photos[index]}" />
    </div>
    `)
}

function hidePerson() {
    $('.win-person').remove();
}

function createShotList() {
    const $shotList = $('#shot-list').empty();
    for (let i = 0; i < shotData.titles.length; i++) {
        $shotList.append(
            `<li class="nav-item" style="display: inline-block">
                <a class="nav-link">
                <img src="${shotData.photos[i]}" style="border-radius: 50%;border: solid 5px ${shotData.colors[i]};max-width: 50px; max-height:50px; width: auto; height: auto;margin-right: 15px;" />  ${shotData.titles[i]} (${shotData.counts[i]})</a>
            </li>`);
    }
}

function addShotPerson(index) {
    let item = {
        name: data.titles[index],
        color: data.colors[index],
        file: data.photos[index]
    };
    let status = true;
    for (let i = 0; i < shotData.titles.length; i++) {
        if (shotData.titles[i] === item.name) {
            status = false;
            shotData.counts[i] += 1;
        }
    }

    if (status) {
        shotData.titles.push(item.name);
        shotData.colors.push(item.color);
        shotData.photos.push(item.file);
        shotData.counts.push(1);
    }
    updateStorage();
}

function createPersonList() {
    const $list = $('#person-list').empty();
    for (let i = 0; i < data.titles.length; i++) {
        $list.append(
            `<li class="nav-item" style="display: inline-block">
                <a class="nav-link"><img src="${data.photos[i]}" style="border-radius: 50%;border: solid 5px ${data.colors[i]};max-width: 50px; max-height:50px; width: auto; height: auto;margin-right: 15px;" />  ${data.titles[i]} <span class="remove" data-index="${i}">X</span></a>
            </li>`);
    }
    $('#person-list .remove').on('click', function () {
        let index = $(this).attr('data-index');
        removePerson(index);
        createPersonList();
    });
}

function addPerson(item) {
    data.titles.push(item.name);
    data.colors.push(item.color);
    data.photos.push(item.file);
    updateStorage();
}

function removePerson(index) {
    delete data.titles[index];
    delete data.colors[index];
    delete data.photos[index];
    data.titles.clean(undefined);
    data.colors.clean(undefined);
    data.photos.clean(undefined);
    updateStorage();
}

function updateStorage() {
    localStorage.setItem('wheelOfFortuneData', JSON.stringify(data));
    localStorage.setItem('shotData', JSON.stringify(shotData));
}

function readFile() {

    if (this.files && this.files[0]) {

        var FR = new FileReader();

        FR.addEventListener("load", function (e) {
            document.getElementById("img").src = e.target.result;
            document.getElementById("b64").innerHTML = e.target.result;
        });

        FR.readAsDataURL(this.files[0]);
    }

}


/*
 localStorage.setItem('wheelOfFortuneData', JSON.stringify({
 titles: ["kişi 1", "Kişi 2", "Kişi 3", "Kişi 4", "Kişi 5", "Kişi 6", "Kişi 7", "Kişi 8", "Kişi 9", "Kişi 10"],
 photos: ['','','','','','','','','',''],
 colors: [
 '#9400D3',
 '#7900af',
 '#4B0082',
 '#0000FF',
 '#00FF00',
 '#FFFF00',
 '#bfbf00',
 '#FF7F00',
 '#bb5e00',
 '#FF0000'
 ]
 }));*/
