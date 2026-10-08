var status = -1;
var ItemId = 2635156;
var itemQuantity = 1; //필요갯수
var itemQuantity = 1; //필요갯수
var prItemId = 4310012; // 2배로 뜰수도있음 프리미엄 아이템 보유시 
var successRate = 100; //성공확률 (%)
var minUpStat = 0; 
var maxUpStat = 0;

var select;

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
 var say = "#h #님 어서오세요 이곳은 고정데미지 상점입니다.\r\n";
	   say += "#b#L0#상자를 기부하고  고정데미지를 상승시키고 싶어요#l#k";
         cm.sendSimple(say);
		 } else if (status == 1) {
        select = selection;
        var text = "무엇을 통해 하실껀가요?\r\n\r\n";
 text += "#L0##d#z" + ItemId + "# " + itemQuantity + "개로 하고 싶습니다#k\r\n";
        cm.sendSimple(text);
    } else if (status == 2) {
        st = selection;
      reqitemid = st == 0 ? ItemId : prItemId;
	reqs = st == 0 ? Math.floor(ItemId/300) : prItemId;
        cm.sendGetNumber("몇번 하시겠어요?", 1, 1, reqs);
    } else if (status == 3) {
		if(cm.itemQuantity(reqitemid) < itemQuantity * selection ) {
			cm.sendOk("아이템이 부족합니다.");
			cm.dispose();
			return;
		}
        var count = 0;
        var rnd = Packages.server.Randomizer.rand(minUpStat, maxUpStat);

        for (i = 0; i < selection; i++) {
            rd = Math.floor(Math.random() * 10000);
            if (st == 0 && rd < successRate || st == 1) {
                if (select == 0) {
                } else {
                }
                count++;
            }
        }
        reqqty = st == 0 ? 1 : 1;
	cm.getPlayer().addACDamage(reqqty * selection * 10000);
        cm.gainItem(reqitemid,-(reqqty * selection));
        cm.sendOk("#b#h #님의 #b고정데미지#k#b" + cm.getPlayer().getACDamage() +"#k이 상승하였습니다!");
        cm.playerMessage("현재 총 고정데미지는 " + cm.getPlayer().getACDamage() +" 입니다 !");
        cm.dispose();
    }
}