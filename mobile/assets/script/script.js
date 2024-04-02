document.getElementById("content").style.display = "flex";
CurDate = "";
if (KRZSStore.getItem("lists") != "{}") {
    ListItems = JSON.parse(KRZSStore.getItem("lists"))["items"];
    InterList = 0;
    ListItems.forEach(function (itemname) {
        InterList = InterList+1;
        var newop = document.createElement("option");
        newop.innerHTML = itemname;
        newop.value = InterList;
        document.getElementById("listsgroup").appendChild(newop);
    })
} else {
    ListItems = [];
}
CurrentList = new Number(document.getElementById("listslist").value);
if (KRZSStore.getItem("level") == "{}") {
    CurrentLevel = 0;
    CurrentXp = 0;
    XpToNextLevel = 100;
} else {
    CurrentLevel = new Number(KRZSStore.getItem("level"));
    CurrentXp = new Number(KRZSStore.getItem("xp"));
    document.querySelector(".xplevel").textContent = CurrentLevel;
    document.querySelector(".xpwidth").style.width = (CurrentXp*100)/(5 * (CurrentLevel ^ 2) + (50 * CurrentLevel) + 90) + "%";
};
if (KRZSStore.getItem("taskscompleted") == "{}") {
    TasksCompleted = 0;
} else {
    TasksCompleted = new Number(KRZSStore.getItem("taskscompleted"));
};
if (KRZSStore.getItem("tasks" + CurrentList) == "{}") {
    Names = [];
    Values = [];
    Numbers = [];
    Descriptions = [];
    DueDates = [];
} else {
    Names = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).names;
    Values = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).values;
    Numbers = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).numbers;
    Descriptions = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).descriptions;
    DueDates = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).duedates;
};
TempDesc = []
TempDue = []
Names.forEach(function (element) {
    TempDesc.push("");
})
Names.forEach(function () {
    TempDue.push("");
})
if (KRZSStore.getItem("tasks" + CurrentList) != "{}") {
    if (Descriptions == undefined) {
        KRZSStore.setItem("tasks" + CurrentList, JSON.stringify({
            "names": Names,
            "values": Values,
            "numbers": Numbers,
            "descriptions": TempDesc,
            "duedates": DueDates
        }));
        location.reload();
    }
    if (DueDates == undefined) {
        KRZSStore.setItem("tasks" + CurrentList, JSON.stringify({
            "names": Names,
            "values": Values,
            "numbers": Numbers,
            "descriptions": Descriptions,
            "duedates": TempDue
        }));
        location.reload();
    }
};
function removeItem(item) {
    setTimeout(function () {item.remove();},1500);
};
function btnClick() {
    event.target.disabled = true;
    Parenttarget = event.target.parentElement.parentElement;
    addXp(event.target.parentElement.parentElement.firstChild.nextSibling.innerHTML);
    event.target.parentElement.parentElement.style.opacity = "0%";
    removeItem(event.target.parentElement.parentElement);
    var indexnum = Numbers.indexOf(event.target.parentElement.parentElement.firstChild.nextSibling.nextSibling.innerHTML);
    Numbers.splice(indexnum, 1);
    Names.splice(indexnum, 1);
    Values.splice(indexnum, 1);
    Descriptions.splice(indexnum, 1);
    DueDates.splice(indexnum, 1);
    updateCloudTasks();
    TasksCompleted = TasksCompleted+1;
    KRZSStore.setItem("taskscompleted", TasksCompleted);
};
function updateName(text, index) {
    Names.splice(new Number(index), 1, text);
    updateCloudTasks();
};
for (let index = 0; index < Names.length; index++) {
    createTask(Names[index], Values[index], false, Numbers[index], Descriptions[index], DueDates[index])
}
document.getElementById("newtaskform").onsubmit = function () {
    event.preventDefault();
    document.querySelector("#taskcreate").disabled = true;
    document.querySelector("#taskcancel").disabled = true;
    document.querySelector("#taskpriority").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    if (document.querySelector(".taskdue").value != CurDate) {
        createTask(document.querySelector(".taskname").value, document.querySelector(".taskpriority").value, true, "", document.querySelector(".taskdesc").value, document.querySelector(".taskdue").value)
    } else {
        createTask(document.querySelector(".taskname").value, document.querySelector(".taskpriority").value, true, "", document.querySelector(".taskdesc").value, "")
    }
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".taskmodal").style.display = "none";
        document.querySelector("#taskcreate").disabled = false;
        document.querySelector("#taskcancel").disabled = false;
        document.querySelector("#taskpriority").disabled = false;
        document.querySelector("#taskname").value = "";
        document.querySelector("#taskdesc").value = "";
        document.querySelector("#taskpriority").value = "75";
    }, 1100);
};
function convertToDateTimeLocalString(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
document.querySelector(".addnewtask").onclick = function () {
    CurDate = convertToDateTimeLocalString(new Date());
    document.getElementById("taskdue").value = CurDate;
    document.querySelector(".taskmodal").style.display = "block";
    document.querySelector(".modaloverlay").style.display = "flex";
    setTimeout(function () {document.querySelector(".modaloverlay").style.opacity = "100%";},100);
};
document.querySelector("#taskcancel").onclick = function () {
    event.preventDefault();
    document.querySelector("#taskcreate").disabled = true;
    document.querySelector("#taskcancel").disabled = true;
    document.querySelector("#taskpriority").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".taskmodal").style.display = "none";
        document.querySelector("#taskcreate").disabled = false;
        document.querySelector("#taskcancel").disabled = false;
        document.querySelector("#taskpriority").disabled = false;
        document.querySelector("#taskname").value = "";
        document.querySelector("#taskdesc").value = "";
        document.querySelector("#taskpriority").value = "75";
    }, 1100);
};
function createTask(txt, priority, storetask, id, desc, duedate) {
    var taskelem = document.createElement("div");
    taskelem.classList.add("task");
    var pelem = document.createElement("p");
    var checkbox = document.createElement("button");
    checkbox.classList.add("checkbox");
    checkbox.onclick = function () { btnClick() };
    var ptext = document.createElement("span");
    ptext.onclick = function () {
        editTask()
    }
    ptext.textContent = furrySpeak(txt);
    ptext.textContent = furrySpeak(txt);
    var furdance = document.createElement("img");
    furdance.src = "/furdance.gif";
    furdance.classList.add("furdance");
    ptext.appendChild(furdance);
    if (priority == "75") {
        ptext.classList.add("normalpriority");
    } else if (priority == "100") {
        ptext.classList.add("highpriority");
    } else if (priority == "50") {
        ptext.classList.add("lowpriority");
    } else {
        ptext.classList.add("debugpriority");
    };
    var descript = document.createElement("span");
    descript.textContent = desc;
    JokeInputs = ["zakem is a femboy", "zakem is not a femboy", "owo", "uwu", "ios > android", "i use a mac", "this software is so buggy", "is zakem a girl or a boy"]
    JokeOutputs = ["no", "yes thats true", "what's this", "awww~ uwu to you too!", "THIS IS A GOOD OPINION", "I LOVE YOUUU (platonically)", "ikr", "zakem is a gi- I mean boy...I mean... uh... i cant tell, his pronouns are set to any... hmm... you decide."]
    if (JokeInputs.indexOf(txt) != -1) {
        descript.textContent = JokeOutputs[JokeInputs.indexOf(txt)];
    }
    descript.classList.add("description");
    pelem.appendChild(checkbox);
    pelem.appendChild(ptext);
    pelem.appendChild(descript);
    if (duedate != "") {
        var duedateelem = document.createElement("span");
        var countDownDate = new Date(duedate).getTime();
        var x = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        duedateelem.textContent = days + "d " + hours + "h " + minutes + "m " + seconds + "s";
        if (distance < 0) {
            clearInterval(x);
            duedateelem.classList.add("dateexpire");
            duedateelem.textContent = "Task is due.";
        }
        }, 1000);
        duedateelem.classList.add("ddateitem");
        pelem.appendChild(duedateelem);
    }
    var xpvalue = document.createElement("xpvalue");
    xpvalue.innerHTML = priority;
    var randnum = document.createElement("randnum");
    if (id != "") {
        randnum.innerHTML = id;
    } else {
        randnum.innerHTML = Math.random()*10;
    }
    Nindex = Numbers.length;
    ptext.onblur = function(){updateName(event.target.textContent, Numbers.indexOf(event.target.parentElement.nextSibling.nextSibling.textContent.toString()))};
    taskelem.appendChild(pelem);
    taskelem.appendChild(xpvalue);
    taskelem.appendChild(randnum);
    document.querySelector(".tasks").appendChild(taskelem);
    if (storetask) {
        Names.push(txt);
        Values.push(priority);
        Numbers.push(randnum.innerHTML);
        Descriptions.push(desc);
        DueDates.push(duedate);
        updateCloudTasks();
    }
}
function addXp(amount) {
    CurrentXp = CurrentXp + new Number(amount);
    XpToNextLevel = 5 * (CurrentLevel ^ 2) + (50 * CurrentLevel) + 90 - CurrentXp;
    if (XpToNextLevel <= 0) {
        CurrentLevel = CurrentLevel + 1;
        CurrentXp = Math.abs(XpToNextLevel);
        XpToNextLevel = 5 * (CurrentLevel ^ 2) + (50 * CurrentLevel) + 90 - CurrentXp;
        document.querySelector(".xplevel").textContent = CurrentLevel;
    }
    document.querySelector(".xpwidth").style.width = (CurrentXp*100)/(5 * (CurrentLevel ^ 2) + (50 * CurrentLevel) + 90) + "%";
    KRZSStore.setItem("level", CurrentLevel);
    KRZSStore.setItem("xp", CurrentXp);
}
function dataClear() {
    if (confirm("You are about to clear all the website data.\n\nThis includes XP, levels, tasks, customization settings, and statistics. Are you sure you want to do this?")) {
        KRZSStore.clear();
        alert("All cleared!");
        location.reload();
    };
};
function notify(text) {
    var notification = document.createElement("div");
    notification.classList.add("notification");
    notification.textContent = text;
    document.body.insertBefore(notification, document.body.firstChild);
    var audio = document.querySelector("audio");
    audio.currentTime = 0;
    audio.play();
    setTimeout(function () {
        notification.remove();
    },5000);
};
// Debug
function showDebugOption(num) {
    var option = document.createElement("option");
    option.value = num;
    option.textContent = `Debug (${num})`;
    document.querySelector("#taskpriority").appendChild(option);
    return "Successfully added a debug option.";
};
DevMode = false;
function developerMode() {
    if (DevMode == false) {
        DevMode = true;
        document.getElementById("devmode").textContent = `xpvalue,randnum{display:block}`
        return "Developer mode enabled.";
    } else {
        DevMode = false;
        document.getElementById("devmode").textContent = `xpvalue,randnum{display:none}`
        return "Developer mode disabled.";
    }
};

function homeTab() {
    document.querySelector(".content").style.display = "none";
    document.querySelector(".statistics").style.display = "none";
    document.querySelector(".theme").style.display = "none";
    document.querySelector(".home").style.display = "block";
    document.querySelector("#tasksbutton").classList.remove("tabbedin");
    document.querySelector("#statsbutton").classList.remove("tabbedin");
    document.querySelector("#themebutton").classList.remove("tabbedin");
    document.querySelector("#homebutton").classList.add("tabbedin");
};
function tasksTab() {
    document.querySelector(".statistics").style.display = "none";
    document.querySelector(".home").style.display = "none";
    document.querySelector(".theme").style.display = "none";
    document.querySelector(".content").style.display = "flex";
    document.querySelector("#statsbutton").classList.remove("tabbedin");
    document.querySelector("#homebutton").classList.remove("tabbedin");
    document.querySelector("#themebutton").classList.remove("tabbedin");
    document.querySelector("#tasksbutton").classList.add("tabbedin");
};
function themeTab() {
    document.querySelector(".content").style.display = "none";
    document.querySelector(".home").style.display = "none";
    document.querySelector(".statistics").style.display = "none";
    document.querySelector(".theme").style.display = "flex";
    document.querySelector("#tasksbutton").classList.remove("tabbedin");
    document.querySelector("#homebutton").classList.remove("tabbedin");
    document.querySelector("#statsbutton").classList.remove("tabbedin");
    document.querySelector("#themebutton").classList.add("tabbedin");
};
function statisticsTab() {
    allxp = 0;
    for (let i = 0; i < CurrentLevel-1; i++) {
        var allxp = allxp + (5 * (CurrentLevel ^ 2) + (50 * CurrentLevel) + 90);
    }
    allxp = allxp + CurrentXp;
    if (CurrentLevel != 0) {
        allxp = allxp + 100;
    }
    document.querySelector("#stats1").textContent = TasksCompleted;
    document.querySelector("#stats2").textContent = allxp;
    document.querySelector("#stats3").textContent = CurrentLevel;
    document.querySelector(".content").style.display = "none";
    document.querySelector(".home").style.display = "none";
    document.querySelector(".theme").style.display = "none";
    document.querySelector(".statistics").style.display = "block";
    document.querySelector("#tasksbutton").classList.remove("tabbedin");
    document.querySelector("#homebutton").classList.remove("tabbedin");
    document.querySelector("#statsbutton").classList.add("tabbedin");
};
// Colors
if (KRZSStore.getItem("themeColor1") != "{}") {
    document.getElementById("themeColor1").value = KRZSStore.getItem("themeColor1");
}
if (KRZSStore.getItem("themeColor2") != "{}") {
    document.getElementById("themeColor2").value = KRZSStore.getItem("themeColor2");
}
if (KRZSStore.getItem("themeColor3") != "{}") {
    document.getElementById("themeColor3").value = KRZSStore.getItem("themeColor3");
}
if (KRZSStore.getItem("themeColor4") != "{}") {
    document.getElementById("themeColor4").value = KRZSStore.getItem("themeColor4");
}
if (KRZSStore.getItem("themeColor5") != "{}") {
    document.getElementById("themeColor5").value = KRZSStore.getItem("themeColor5");
}
function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}
function themeColorChange(log, num) {
document.getElementById("stylecolors").textContent = `
body, html {
    background: ${document.getElementById("themeColor1").value};
}
.tasks {
    background: ${document.getElementById("themeColor2").value};
}
.task p span {
    color: ${document.getElementById("themeColor3").value};
}
.task {
    border-bottom: 1px solid ${hexToRGB(document.getElementById("themeColor3").value,0.2)};
}
.checkbox {
    border: 2px solid ${document.getElementById("themeColor3").value};
}
.main {
    color: ${document.getElementById("themeColor4").value};
}
.xpbar {
    outline: 3px solid ${document.getElementById("themeColor5").value};
}
.xpwidth {
    background: ${document.getElementById("themeColor5").value};
}
.xplevel {
    color: ${document.getElementById("themeColor5").value};
}
.addnewtask {
    background: ${document.getElementById("themeColor2").value};
    color: ${document.getElementById("themeColor3").value};
}
`
if (log != undefined) {
    KRZSStore.setItem("themeColor" + num, log);
}
}
themeColorChange()

// Fonts
if (KRZSStore.getItem("themeFont1") != "{}") {
    document.getElementById("themeFont1").value = KRZSStore.getItem("themeFont1");
}
if (KRZSStore.getItem("themeFont2") != "{}") {
    document.getElementById("themeFont2").value = KRZSStore.getItem("themeFont2");
}

function themeFontChange(log, num) {
document.getElementById("font1").href = `https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,400;0,700;1,400;1,700&family=${document.getElementById("themeFont1").value}&display=swap`
document.getElementById("font2").href = `https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,400;0,700;1,400;1,700&family=${document.getElementById("themeFont2").value}&display=swap`
document.getElementById("stylefonts").textContent = `
h1, h2, h3, h4, h5, h6 {
    font-family: '${document.getElementById("themeFont1").value}';
}
.menumain {
    font-family: '${document.getElementById("themeFont1").value}';
}
.task p span {
    font-family: '${document.getElementById("themeFont2").value}';
}
.xplevel {
    font-family: '${document.getElementById("themeFont1").value}';
}
.addnewtask {
    font-family: '${document.getElementById("themeFont2").value}';
}
`
if (log != undefined) {
    KRZSStore.setItem("themeFont" + num, log);
}
}
themeFontChange();
function changeList(lnum) {
    if (lnum == -1) {
        document.querySelector(".listmodal").style.display = "block";
        document.querySelector(".modaloverlay").style.display = "flex";
        setTimeout(function () {document.querySelector(".modaloverlay").style.opacity = "100%";},100);
    } else {
        CurrentList = lnum;
        document.querySelector(".tasks").innerHTML = "";
        if (KRZSStore.getItem("tasks" + CurrentList) == "{}") {
            Names = [];
            Values = [];
            Numbers = [];
            Descriptions = [];
            DueDates = [];
        } else {
            Names = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).names;
            Values = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).values;
            Numbers = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).numbers;
            Descriptions = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).descriptions;
            DueDates = JSON.parse(KRZSStore.getItem("tasks" + CurrentList)).duedates;
        };
        for (let index = 0; index < Names.length; index++) {
            createTask(Names[index], Values[index], false, Numbers[index], Descriptions[index], DueDates[index])
        }
    }
}
document.getElementById("newlistform").onsubmit = function () {
    event.preventDefault();
    document.querySelector("#listcreate").disabled = true;
    document.querySelector("#listcancel").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    var newop = document.createElement("option");
    newop.innerHTML = document.querySelector("#listname").value;
    newop.value = ListItems.length+1;
    document.getElementById("listsgroup").appendChild(newop);
    ListItems.push(document.querySelector("#listname").value);
    KRZSStore.setItem("lists", JSON.stringify({"items":ListItems}));
    document.getElementById("listslist").value = newop.value;
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".listmodal").style.display = "none";
        document.querySelector("#listcreate").disabled = false;
        document.querySelector("#listcancel").disabled = false;
        document.querySelector("#listname").value = "";
    }, 1100);
};
document.getElementById("listcancel").onclick = function () {
    event.preventDefault();
    document.querySelector("#listcreate").disabled = true;
    document.querySelector("#listcancel").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    document.getElementById("listslist").value = "0";
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".listmodal").style.display = "none";
        document.querySelector("#listcreate").disabled = false;
        document.querySelector("#listcancel").disabled = false;
        document.querySelector("#listname").value = "";
    }, 1100);
};
function updateCloudTasks() {
    updateCloudTasks();
}
function editTask() {
    Idindex = Numbers.indexOf(event.target.parentElement.parentElement.firstChild.nextSibling.nextSibling.innerHTML);
    Idelem = event.target.parentElement.parentElement;
    document.getElementById("e-taskname").value = Names[Idindex];
    document.getElementById("e-taskpriority").value = Values[Idindex];
    document.getElementById("e-taskdesc").value = Descriptions[Idindex];
    document.querySelector(".editmodal").style.display = "block";
    document.querySelector(".modaloverlay").style.display = "flex";
    setTimeout(function () {document.querySelector(".modaloverlay").style.opacity = "100%";},100);
};
document.getElementById("editform").onsubmit = function () {
    event.preventDefault();
    document.querySelector("#e-taskcreate").disabled = true;
    document.querySelector("#e-taskcancel").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    Idelem.firstChild.firstChild.nextSibling.textContent = document.getElementById("e-taskname").value;
    Names.splice(new Number(Idindex), 1, document.getElementById("e-taskname").value);
    var priority = document.getElementById("e-taskpriority").value;
    Idelem.firstChild.firstChild.nextSibling.className = '';
    if (priority == "75") {
        Idelem.firstChild.firstChild.nextSibling.classList.add("normalpriority");
    } else if (priority == "100") {
        Idelem.firstChild.firstChild.nextSibling.classList.add("highpriority");
    } else if (priority == "50") {
        Idelem.firstChild.firstChild.nextSibling.classList.add("lowpriority");
    } else if (priority == "25") {
        Idelem.firstChild.firstChild.nextSibling.classList.add("aipriority");
    } else {
        Idelem.firstChild.firstChild.nextSibling.classList.add("debugpriority");
    };
    Values.splice(new Number(Idindex), 1, document.getElementById("e-taskpriority").value);
    Idelem.firstChild.firstChild.nextSibling.nextSibling.textContent = document.getElementById("e-taskdesc").value;
    Descriptions.splice(new Number(Idindex), 1, document.getElementById("e-taskdesc").value);
    updateCloudTasks();
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".editmodal").style.display = "none";
        document.querySelector("#e-taskcreate").disabled = false;
        document.querySelector("#e-taskcancel").disabled = false;
    }, 1100);
};
document.getElementById("e-taskcancel").onclick = function () {
    event.preventDefault();
    document.querySelector("#e-taskcreate").disabled = true;
    document.querySelector("#e-taskcancel").disabled = true;
    document.querySelector(".modaloverlay").style.opacity = "0%";
    setTimeout(function () {
        document.querySelector(".modaloverlay").style.display = "none";
        document.querySelector(".editmodal").style.display = "none";
        document.querySelector("#e-taskcreate").disabled = false;
        document.querySelector("#e-taskcancel").disabled = false;
    }, 1100);
};

// April Fools
function furrySpeak(text) {
    const transformations = {
      "r": "w",
      "l": "w",
      "th": "d",
      "s": "sh",
      "you": "yuw",
      "ve": "v"
    };
    let result = text.toLowerCase();
      for (const original in transformations) {
      const replacement = transformations[original];
      result = result.replace(new RegExp(original, 'g'), replacement); 
    }
    if (Math.random() < 0.5) {
      result += " uwu";
    }
    return result;
  }