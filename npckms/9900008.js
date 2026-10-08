
importPackage(java.lang);

var enter = "\r\n";
var year, month, date2, date, day
var hour, minute;

var questt = "boss_7"; // jump_고유번호
검정 = "#fc0xFF191919#"
var reward = [
	{ 'itemid': 4036315, 'qty': 1 }


]

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
		if (cm.getClient().getKeyValue(questt) == null)
			cm.getClient().setKeyValue(questt, "0");

		if (parseInt(cm.getClient().getKeyValue(questt)) > 0) {
			cm.sendOk("#fs11#" + 검정 + "오늘의 보상을 이미 받으셨습니다.");
			cm.dispose();
			return;
		}
		cm.sendYesNo("#fs11#" + 검정 + "카오 합병 보상을 지급받으시겠어요?");
	} else if (status == 1) {
		if (parseInt(cm.getClient().getKeyValue(questt)) > 0) {
			cm.sendOk("#fs11#" + 검정 + "계정당  1회만 보상을 받을수 있어요.");
			cm.dispose();
			return;
		}

		cm.getClient().setKeyValue(questt, "1");
		cm.gainItem(2431295, 1);
		//cm.warp(100000000);
		말 = "#fs11#" + 검정 + "보상입니다 입니다.\r\n\r\n"
		cm.sendOk(말);
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