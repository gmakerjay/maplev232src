importPackage(java.lang);

var list = [ //아이템코드, 묶음갯수, 개당가격
  //  [5121060, 3, 100], //경뿌 50%
    //[2450163, 3, 150], //경험치 3배쿠폰
    [2633915, 1, 150], //아케인방어구상자
    [2633914, 1, 200], //아케인무기상자
    [4319999, 200, 100], //하얀 결정 - F
    [4310308, 1, 100], //네오코어
    [4001716, 3, 250], //10억 	
	[5062005, 6, 300],  //어메큐
    [5062503, 6, 300], //화에큐
    [4319994, 200, 500], //푸른구슬	
	[4319997, 100, 500], //하인즈코어
	[4319996, 3, 500], //호신부적[H]
    [4319995, 3, 500], //악쫓부
  //  [2049704, 1, 300], //레잠 
    [2049376, 1, 500], //20성강화권
  //  [2431156, 1, 10000],//보공상자
];

var choice = -1;
var count = -1;
var status = -1;

function start() {
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    var say = "#fs11#"
    if (status == 0) {
        // 501368, "point"
       // cm.getPlayer().setKeyValue(501368, "point", 200);
        var jampoint = cm.getPlayer().getKeyValue(501368, "point"); 
        if (cm.getPlayer().getKeyValue(501368, "point") == null) {
            cm.getPlayer().setKeyValue(501368, "point", 0);
        }
        say += "   잠수 포인트 상점에 오신 것을 환영합니다.\r\n   구입하실 아이템을 선택해 주세요.\r\n\r\n";
        say += "   현재 잠수 포인트 : " + jampoint + "\r\n\r\n";
        for (var i = 0; i < list.length; i++) {
            if(list[i][0] == 5121060) {
                say += "#L" + i + "##i" + list[i][0] + "##b 경험치 뿌리기 50%#k (" + list[i][1] + "개) - #r" + list[i][2] + "P#k#l\r\n";
                continue;
            }
            say += "#L" + i + "##i" + list[i][0] + "##b #z" + list[i][0] + "##k (" + list[i][1] + "개) - #r" + list[i][2] + "P#k#l\r\n";
        }
        cm.sendSimple(say);
    } else if (status == 1) {
        choice = selection;
        say += "#i" + list[choice][0] + "##z" + list[choice][0] + "# (" + list[choice][1] + "개 묶음)을 선택하셨습니다.\r\n";
        say += "몇 묶음을 구입하시겠습니까? 1묶음 당 " + list[choice][2] + "잠수포인트가 필요합니다.\r\n\r\n";
        say += "현재 잠수 포인트 : " + cm.getPlayer().getKeyValue(501368, "point") + "\r\n\r\n";
        if (list[choice][0] >= 2000000) {
            cm.sendGetNumber(say, 0, 1, Math.floor(30000/list[choice][1]));
        } else {
            cm.sendGetNumber(say, 0, 1, 1);
        }
    } else if (status == 2) {
        count = selection;
        cm.sendYesNo("정말로 #i" + list[choice][0] + "##z" + list[choice][0] + "# (" + list[choice][1] + "개 묶음)을 " + count + "개 구입하시겠습니까?\r\n" +
        "총 " + (list[choice][2] * count) + "잠수포인트가 필요합니다.\r\n" +
        "현재 잠수 포인트 : " + cm.getPlayer().getKeyValue(501368, "point") + "");
    } else if (status == 3) {
        if (Integer.parseInt(cm.getPlayer().getKeyValue(501368, "point")) >= list[choice][2] * count && cm.canHold(list[choice][0], list[choice][1] * count)) {
            cm.getPlayer().setKeyValue(501368, "point", Integer.parseInt(cm.getPlayer().getKeyValue(501368, "point")) - list[choice][2] * count + "");
            cm.gainItem(list[choice][0], list[choice][1] * count);
            cm.sendOk("#i" + list[choice][0] + "##z" + list[choice][0] + "# (" + list[choice][1] + "개 묶음)을 " + count + "개 구입하였습니다. \r\n\r\n" +
            "현재 잠수 포인트 : " + cm.getPlayer().getKeyValue(501368, "point") + "");
            cm.dispose();
            return;
        } else {
            cm.sendOk("잠수포인트가 부족하거나, 인벤토리 슬롯이 부족한 것은 아닌지 확인해 주세요.");
            cm.dispose();
            return;
        }
    } else {
        cm.dispose();
        return;
    }
}

