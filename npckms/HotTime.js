importPackage(Packages.server);
importPackage(Packages.database);
importPackage(Packages.client.inventory);
importPackage(Packages.tools);
importPackage(java.lang);
importPackage(Packages.packet.creators);
importPackage(Packages.client.items);
importPackage(Packages.server.items);
importPackage(Packages.launch.world);
importPackage(Packages.main.world);
importPackage(Packages.database);
importPackage(java.lang);
importPackage(Packages.server);
importPackage(Packages.handling.world);
importPackage(Packages.tools.packet);
importPackage(Packages.server);
importPackage(Packages.client.inventory);
importPackage(Packages.server);
importPackage(Packages.server.items);


var enter = "\r\n";
var seld = -1;

var hoth = 20;

var year, month, date2, date, day
var hour, minute;

var reward = [
    [2635910, 1]
]

var 배율 = 1;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, sel) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        getData();

            if (cm.getClient().getKeyValue("ht_" + date) >= 1) {
                cm.sendOk("오늘은 이미 핫타임 보상을 받았습니다.");
                cm.dispose();
                return;
            }
		var chat = "PRAY의 깜짝 핫타임!! \r\n한 번만 받으실수 있습니다!!!\r\n\r\n지금 핫타임을 받으시겠어요?";
            //chat += "지금 핫타임을 받으시겠어요?"; //+ cm.getClient().getKeyValue("ht_" + date);
            cm.sendYesNo(chat);

    } else if (status == 1) {
		var msg = "";
        if (cm.getClient().getKeyValue("ht_" + date) >= 1) {
            cm.sendOk("#fs11#오늘은 이미 핫타임 보상을 받았습니다.");
            cm.dispose();
            return;
        }


        cm.getClient().setKeyValue("ht_" + date, "1");
        for (i = 0; i < reward.length; i++) {
			 cm.gainItem(reward[i][0], reward[i][1]);
			 msg += "#i" + reward[i][0]+"##b#z" + reward[i][0]+"# "+reward[i][1]+ "개\r\n";
        }

		msg += "\r\n#k위 아이템이 지급되었습니다.";

        cm.sendOk(msg);
        cm.dispose();
    }
}

function getData() {
    time = new Date();
    year = time.getFullYear();
    month = time.getMonth() + 1;
    if (month < 10) {
        month = "0" + month;
    }
    date2 = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    date = year + "" + month + "" + date2;
    day = time.getDay();
    hour = time.getHours();
    minute = time.getMinutes();
}