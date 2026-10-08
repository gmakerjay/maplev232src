//var enter = "\r\n";
var seld = -1;

var need = [
	{'itemid' : 4310248, 'qty' : 200},

]
var tocoin = 2433979, toqty = 1;

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
		var msg = "학교 과제 준비물 크레파스가 필요한데 .. 혹시 가지고있어?"+enter;

		for (i = 0; i < need.length; i++) {
			if (i != need.length - 1) msg += "#i"+need[i]['itemid']+"##z"+need[i]['itemid']+"# "+need[i]['qty']+"개와"+enter;
			else msg += "#i"+need[i]['itemid']+"##z"+need[i]['itemid']+"# "+need[i]['qty']+"개를 주신다면 저에게 큰 도움이 될겁니다. 대신 제가 가진 #b#z"+tocoin+"##k1개를 드리겠습니다."+enter;
		}

		
		if (haveNeed(1))
			cm.sendNext(msg);
		else {
			msg += enter+enter+"허허.. 크레파스를 가지고 있지 않군요.....";
			cm.sendOk(msg);
			cm.dispose();
		}
	} else if (status == 1) {
		temp = [];
		for (i = 0; i < need.length; i++) {
			temp.push(Math.floor(cm.itemQuantity(need[i]['itemid']) / need[i]['qty']));
		}
		temp.sort();
		max = temp[0];
		cm.sendGetNumber("당신은 최대 #b"+max+"번을#k 교환할 수 있군요..\r\n몇 번 교환하시겠습니까...?", 1, 1, max);
	} else if (status == 2) {
		if (!haveNeed(sel)) {
			cm.sendOk("당신이 소지한 아이템이 부족합니다.");
			cm.dispose();
			return;
		}
		for (i = 0; i < need.length; i++) {
			cm.gainItem(need[i]['itemid'], -(need[i]['qty'] * sel));
		}
		cm.gainItem(tocoin, (toqty * sel));
		cm.sendOk("메소럭키백 을 지급해드렸습니다.");
		cm.dispose();
	}
}

function haveNeed(a) {
	var ret = true;
	for (i = 0; i < need.length; i++) {
		if (!cm.haveItem(need[i]['itemid'], (need[i]['qty'] * a)))
			ret = false;
	}
	return ret;
}
