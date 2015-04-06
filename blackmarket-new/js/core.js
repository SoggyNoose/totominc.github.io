var money; var moneyPerSec; var shoot; var prestige;
var drugStock; var drugName; var drugPrice; var drugMultiplier; var drugPerSec;
var drugInit = [
    new Drug("Weed",        50),
    new Drug("Meth",        300),
    new Drug("Cocaine",     1250)
];

var fps = 60; var interval = (1000 / fps); var init = false; var key = "Blackmarket-"; var version = "1.00"; var release = "-r1";
var before; var now;
var allVars = [
    'money', 'shoot', 'prestige',
    'before',
    'drugStock', 'drugMultiplier',
    'shootRewardUpgradesOwned', 'shootTimeUpgradesOwned', 'ammoStockUpgradesOwned', 'reloadTimeUpgradesOwned', 'weedPriceUpgradesOwned', 'methPriceUpgradesOwned', 'cocainePriceUpgradesOwned',
    'weedBuildsOwned', 'methBuildsOwned', 'cocaineBuildsOwned',
    'weedDealersOwned', 'methDealersOwned', 'cocaineDealersOwned'
];

function Log(text) { console.log("Blackmarket - " + text); };

function Init() { Log("Calling Init()"); };
Init.variables = function() {
	Log("Calling Init.variables()");
	money = [0, 0];
	shoot = [12, 1, 12, 1500, 5000, 0, 0, 1];
    prestige = [0, 0, 1, "no rank"];

    drugStock = []; drugName = []; drugPrice = []; drugMultiplier = []; drugPerSec = []; moneyPerSec = [];
    for (var i = 0; i < drugInit.length; i++) {
        var d = drugInit[i];
        drugStock.push(0);
        drugName.push(d.name);
        drugPrice.push(d.price);
        drugPerSec.push(0);
        drugMultiplier.push(1);
        moneyPerSec.push(0);
    };

    before = new Date().getTime();
    init = true;
};
Init.update = function() {
    if (init == true) {
        $("#navbar-money").html("Money : " + fix(money[0]) + "$");
        $("#action-shoot").html("+" + fix(getShootReward()) + "$/shoot<br>" + fix((shoot[3] / 1000)) + " sec/shoot");
        $("#action-reload").html(shoot[0] + "/" + shoot[2] + " ammo<br>" + fix((shoot[4] / 1000)) + " sec/reload");
        $("#stats-money").html("Money : <b>" + fix(money[0]) + "$</b><br>Total money : <b>" + fix(money[1]) + "$</b>");
        $("#stats-ammo").html("Ammo : <b>" + shoot[0] + "/" + shoot[2] + "</b><br>Total shoots : <b>" + shoot[5] + "</b><br>Total reloads : <b>" + shoot[6] + '</b>');
        $("#stats-weed").html("Weed stock : <b>" + fix(drugStock[0]) + "g</b> (" + fix(drugPerSec[0]) + "g/sec)<br>Weed price : <b>" + fix(getDrugPrice(0)) + "$/g</b><br>Weed multiplier : <b>x" + fix(drugMultiplier[0]) + '</b>');
        $("#stats-meth").html("Meth stock : <b>" + fix(drugStock[1]) + "g</b> (" + fix(drugPerSec[1]) + "g/sec)<br>Meth price : <b>" + fix(getDrugPrice(1)) + "$/g</b><br>Meth multiplier : <b>x" + fix(drugMultiplier[1]) + '</b>');
        $("#stats-cocaine").html("Cocaine stock : <b>" + fix(drugStock[2]) + "g</b> (" + fix(drugPerSec[2]) + "g/sec)<br>Cocaine price : <b>" + fix(getDrugPrice(2)) + "$/g</b><br>Cocaine multiplier : <b>x" + fix(drugMultiplier[2]) + '</b>');
        $("#stats-weedcash").html("Money from weed : <b>" + fix(moneyPerSec[0]) + "$/sec</b><br>");
        $("#stats-methcash").html("Money from meth : <b>" + fix(moneyPerSec[1]) + "$/sec</b><br>");
        $("#stats-cocainecash").html("Money from cocaine : <b>" + fix(moneyPerSec[2]) + "$/sec</b><br>");
        $("#stats-totalmoneypersec").html("Total money per sec : <b>" + fix(moneyPerSec[0] + moneyPerSec[1] + moneyPerSec[2]) + "$/sec</b>");
        $("#stats-experience").html("Experience : <b>" + fix(prestige[0]) + "</b><br>Experience on reset : <b>" + fix(prestige[1]) + "</b>");
        $("#stats-prestige").html("Prestige rank : <b>" + prestige[3] + "</b><br>Prestige multiplier : <b>x" + fix(prestige[2]) + "</b>");
        $("#options-version").html("Current version : " + version + release);

        getExperience();
        PrestigeRank.rankup();

        if (shoot > 0) {
            $("#a-1").attr("class", "btn btn-success center-btn");
            $("#a-2").attr("class", "btn btn-success center-btn");
        } else {
            if (shoot[0] == shoot[2]) {
                $("#a-2").attr("class", "btn btn-success center-btn disabled");
            } else {
                if (shoot[0] == 0) {
                    $("#a-1").attr("class", "btn btn-success center-btn disabled");
                    $("#a-2").attr("class", "btn btn-danger center-btn");
                };
            }
        };
    };
};
Init.game = function() {
    Init.variables();
    Upgrade.init();
    Build.init();
    Dealer.init();
    loadData();
    Upgrade.saveCheck();
    Build.check();
    Dealer.check();
    PrestigeRank.fillTable();
    resize();
};
Init.coreUpdate = function() {
    if (init == true) {
        now = new Date().getTime();
        var elapsedTime = now - before;
        if (elapsedTime > interval) {
            Build.earn(Math.floor(elapsedTime / interval));
            Dealer.sell(Math.floor(elapsedTime / interval));
        } else {
            Build.earn(1);
            Dealer.sell(1);
        };
        Init.update();
        before = new Date().getTime();
    };
};

function Drug(name, price) {
    this.name = name;
    this.price = price;
};

window.onload = function() {
    Init.game();
};
window.setInterval(function() {
    Init.coreUpdate();
}, interval);
var intSave = window.setInterval(function() {saveData(); }, 10000);