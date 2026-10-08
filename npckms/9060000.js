qty = [];
box = 2433019;

function start() {
	status = -1;
	action(1, 0, 0);
}
function action(mode, type, selection) {
	if (mode == 1) {
		status++;
	} else {
		cm.dispose();
		return;
    	}
	if (status == 0) {
		itemcheck();
		var text = "저는 동물원 조련사 켄타라고 해요. 우리 안의 동물들에게 함부로 먹이를 주시면 안돼요.\r\n\r\n";
		if (NumberMin > 0) {
			text += "#fUI/UIWindow.img/UtilDlgEx/list3#\r\n";
		} else {
			text += "#fUI/UIWindow.img/UtilDlgEx/list1#\r\n";
		}
		text += "#L0##d숨겨둔 종이조각#k#l";
		cm.sendSimple(text);
	} else if (status == 1) {
		if (selection == 0) {
			if (NumberMin > 0) {
				var text = "우와, 정말로 종이조각을 전부 찾아오셨네요! 놀라운데요?\r\n"
				text += "자, 그럼 종이조각을 몇개나 모아왔는지 확인해볼까요?\r\n\r\n";
				text += "#fc0xffA6A6A6# * 퀘스트를 몇번 완료하시겠습니까?#k\r\n"
				text += "#r * 최대 #e"+NumberMin+"번#n 퀘스트를 완료하실 수 있습니다.#k";
				cm.sendGetNumber(text, 1, 1, NumberMin);	
			} else {
				var text = "동물원에만 있는건 정말 심심한일이에요.\r\n그래서 제가 Fancy 월드에 #i4031274# #b종이조각#k을 숨겨두었어요.\r\n";
				text += "몬스터를 사냥해서 #r#eA~E#n#k 까지의 #b5가지#k 종이조각을 전부 모아보시겠어요?\r\n\r\n";
				text += "종이조각을 전부 모으셨다면 절 다시 찾아와주세요.\r\n";
				text += "#i" + box + "# #b#z" + box + "##k 아이템을 드릴게요.";
				cm.sendOk(text);
				cm.dispose();
			}
		}
	} else if (status == 2) {
		st = selection;
		if (st < 0 || st > NumberMin) {
			cm.sendOk("비정상적인 값이 발견되어 스크립트를 종료합니다.");
			fw = new java.io.FileWriter("gainItemLog/log_9060000 (종이조각).txt", true);
			fw.write("" + new Date() + " │ cid : "+cm.getPlayer().getId()+" │ cname : "+ cm.getPlayer().getName() + " 이(가) 비정상적인 ["+st+"] 의 값을 유도함\r\n");
			fw.close();
			cm.dispose();
			return;
		}
		if (!cm.canHold(box)) {
		    cm.sendOk("소비창이 부족합니다.");
		    cm.dispose();
		    return;
		}
		for (i = 0; i < 5; i++) {
		    cm.getPlayer().removeItem(4031274 + i, -st);
		}
		var text = "자 약속한대로 종이조각을 유용한 아이템으로 바꿔드렸어요.\r\n";
		text += "아직 숨겨둔 종이조각은 많으니 찾으실때마다 절 찾아와주세요.\r\n\r\n";
		text += "#fUI/UIWindow2.img/QuestIcon/4/0#\r\n";
		text += "#i" + box + "# #b#z" + box + "##k #r" + st + "개#k";
		cm.sendOk(text);
		cm.gainItem(box, st);
		if (st > 1) {
			cm.getPlayer().dropMessage(6, "[퀘스트] 종이조각 퀘스트를 "+st+"회 일괄처리하였습니다.");
		}
		fw.close();
		cm.dispose();
		return;
	}
}

function itemcheck() {
	for (i = 0; i < 5; i++) {
	    var a = cm.itemQuantity(4031274 + i);
	    qty.push(a);
	}
	NumberMin = qty[0];
	for (j = 0; j < qty.length; j++) {
	    if (NumberMin > qty[j]) {
		NumberMin = qty[j];
	    }
	}
}