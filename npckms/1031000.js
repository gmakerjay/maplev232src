importPackage(java.lang);

var status = -1;

var items = [ //강화수, 강화성공확률, 각스탯, 공마
    [0, 0, 0, 0],
    [1, 50, 2, 2],
    [2, 50, 2, 2],
    [3, 50, 2, 2],
    [4, 50, 2, 2],
    [5, 50, 2, 2],
    [6, 50, 2, 2],
    [7, 50, 2, 2],
    [8, 50, 2, 2],
    [9, 50, 2, 2],
    [10, 50, 2, 2],
    [11, 50, 2, 2],
    [12, 50, 2, 2],
    [13, 50, 2, 2],
    [14, 50, 2, 2],
    [15, 50, 2, 2],
    [16, 50, 2, 2],
    [17, 50, 2, 2],
    [18, 50, 2, 2],
    [19, 50, 2, 2],
    [20, 50, 2, 2],
    [21, 50, 2, 2],
    [22, 50, 2, 2],
    [23, 50, 2, 2],
    [24, 50, 2, 2],
    [25, 50, 2, 2],
    [26, 50, 2, 2],
    [27, 50, 2, 2],
    [28, 50, 2, 2],
    [29, 50, 2, 2],
    [30, 50, 2, 2],
    [31, 50, 2, 2],
    [32, 50, 2, 2],
    [33, 50, 2, 2],
    [34, 50, 2, 2],
    [35, 50, 2, 2],
    [36, 50, 2, 2],
    [37, 50, 2, 2],
    [38, 50, 2, 2],
    [39, 50, 2, 2],
    [40, 50, 2, 2],
    [41, 50, 2, 2],
    [42, 50, 2, 2],
    [43, 50, 2, 2],
    [44, 50, 2, 2],
    [45, 50, 2, 2],
    [46, 50, 2, 2],
    [47, 50, 2, 2],
    [48, 50, 2, 2],
    [49, 50, 2, 2],
    [50, 50, 2, 2]    
];

function getAddEnhance(item) {
	var owner = item.getOwner();
    return owner == "★1강★" ? 1 : 
	        owner == "★2강★" ? 2 : 
	        owner == "★3강★" ? 3 : 
	        owner == "★4강★" ? 4 : 
	        owner == "★5강★" ? 5 : 
	        owner == "★6강★" ? 6 : 
	        owner == "★7강★" ? 7 : 
	        owner == "★8강★" ? 8 : 
	        owner == "★9강★" ? 9 : 
	        owner == "★10강★" ? 10 : 
	        owner == "★11강★" ? 11 : 
	        owner == "★12강★" ? 12 : 
	        owner == "★13강★" ? 13 : 
	        owner == "★14강★" ? 14 : 
	        owner == "★15강★" ? 15 : 
	        owner == "★16강★" ? 16 : 
	        owner == "★17강★" ? 17 : 
	        owner == "★18강★" ? 18 : 
	        owner == "★19강★" ? 19 : 
	        owner == "★20강★" ? 20 : 
            owner == "★21강★" ? 21 : 
	        owner == "★22강★" ? 22 : 
	        owner == "★23강★" ? 23 : 
	        owner == "★24강★" ? 24 : 
	        owner == "★25강★" ? 25 : 
	        owner == "★26강★" ? 26 : 
	        owner == "★27강★" ? 27 : 
	        owner == "★28강★" ? 28 : 
	        owner == "★29강★" ? 29 : 
	        owner == "★30강★" ? 30 : 
	        owner == "★31강★" ? 31 : 
	        owner == "★32강★" ? 32 : 
	        owner == "★33강★" ? 33 : 
	        owner == "★34강★" ? 34 : 
	        owner == "★35강★" ? 35 : 
	        owner == "★36강★" ? 36 : 
	        owner == "★37강★" ? 37 : 
	        owner == "★38강★" ? 38 : 
	        owner == "★39강★" ? 39 : 
	        owner == "★40강★" ? 40 : 
            owner == "★41강★" ? 41 : 
	        owner == "★42강★" ? 42 : 
	        owner == "★43강★" ? 43 : 
	        owner == "★44강★" ? 44 : 
	        owner == "★45강★" ? 45 : 
	        owner == "★46강★" ? 46 : 
	        owner == "★47강★" ? 47 : 
	        owner == "★48강★" ? 48 : 
	        owner == "★49강★" ? 49 : 
	        owner == "★50강★" ? 50 : 
            0; 
}

var mat = 4310237; //사냥 코인
var count = 20; //갯수

var item, itemid, slot, choice, say;
var re = 0;

function start () {
    action (1, 0, 0);
}

function action (mode, type, selection) {
    if (mode != 1) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
        var count1 = 0;
        var say = "강화할 치장아이템을 선택해 주세요.\r\n\r\n";
        for (i = 0; i < cm.getInventory(6).getSlotLimit(); i++) {
            if (cm.getInventory(6).getItem(i) != null) {
                if (Packages.server.MapleItemInformationProvider.getInstance().isCash(cm.getInventory(6).getItem(i).getItemId())) {
                    say += "#L" + i + "##e#b#i" + cm.getInventory(6).getItem(i).getItemId() + "# #z" + cm.getInventory(6).getItem(i).getItemId() + "# (" + i + "번째 슬롯)#l\r\n";
                    count1++;
                }
            }
        }
        if (count1 <= 0) {
            cm.sendOk("강화할 치장아이템 소지하고 있는지 확인해 주세요.");
            cm.dispose();
            return;
        }
        cm.sendSimple(say);
    } else if (status == 1) {
        if (re == 0) {
            slot = selection;
            item = cm.getInventory(6).getItem(selection);
        }
        if (item.getOwner().equals("★50강★")) {
            cm.sendOk("이미 50강까지 강화가 완료된 아이템 입니다.");
            cm.dispose();
            return;
        }
        itemid = item.getItemId(); 
        say = "";
        say += "<강화 재료 정보>\r\n";
        say += "#i" + mat + "##z" + mat + "# " + count + "개 필요\r\n\r\n";
        say += "<강화 정보>\r\n";
        say += "강화 : " + getAddEnhance(item) + "강 -> " + (getAddEnhance(item) + 1) + "강\r\n";
        say += "강화 성공 시 올스탯 +" + items[getAddEnhance(item) + 1][2] + ", 공마 +" + items[getAddEnhance(item) + 1][3] + " 증가\r\n";
        say += "성공확률 " + items[getAddEnhance(item) + 1][1] + "%\r\n\r\n"; 
        say += "<아이템 정보>\r\n";
        say += "강화할 아이템 : #i" + itemid + "# #z" + itemid + "#\r\n";
        say += "STR : " + item.getStr() + "  |  DEX : " + item.getDex() + "  |  INT : " + item.getInt() + "  |  LUK " + item.getLuk() + "\r\n";
        say += "공격력 : " + item.getWatk() + "  |  마력 : " + item.getMatk() + "  | 스타포스 : " + item.getEnhance() + "성\r\n";
        say += "올 스탯 : " + item.getAllStat() + "%  |  총 데미지 : " + item.getTotalDamage() + "%  |  보스 공격력 : " + item.getBossDamage() + "%\r\n";
        say += "아이템 강화 횟수 : " + getAddEnhance(item) + "강\r\n\r\n";
        cm.sendYesNo(say + "정말로 이 아이템을 강화 하시겠습니까?");
    } else if (status == 2) {
        if (cm.haveItem(mat, count)) {
            cm.gainItem(mat, -count);
        } else {
            cm.sendOk("#i" + mat + "##z" + mat + "# " + count + "개가 없어 강화가 불가능합니다.");
            cm.dispose();
            return;
        }
        if (cm.getInventory(1).getItem(slot) != null) {
            if (item.getOwner().equals("★50강★")) {
                cm.sendOk("이미 50강까지 강화가 완료된 아이템 입니다.");
                cm.dispose();
                return;
            }
            var rand = Math.ceil(Math.random() * 100);
            if (rand >= 0 && rand <= items[getAddEnhance(item) + 1][1]) {
                item.setStr(item.getStr() + items[getAddEnhance(item) + 1][2]);
                item.setDex(item.getDex() + items[getAddEnhance(item) + 1][2]);
                item.setInt(item.getInt() + items[getAddEnhance(item) + 1][2]);
                item.setLuk(item.getLuk() + items[getAddEnhance(item) + 1][2]);
                item.setWatk(item.getWatk() + items[getAddEnhance(item) + 1][3]);
                item.setMatk(item.getMatk() + items[getAddEnhance(item) + 1][3]);
                item.setOwner("★"+(getAddEnhance(item)+1)+"강★");
                cm.getPlayer().forceReAddItem(item, Packages.client.inventory.MapleInventoryType.DECORATION);
                say = "";     
                say += "<아이템 정보>\r\n";
                say += "강화할 아이템 : #i" + itemid + "# #z" + itemid + "#\r\n";
                say += "STR : " + item.getStr() + "  |  DEX : " + item.getDex() + "  |  INT : " + item.getInt() + "  |  LUK " + item.getLuk() + "\r\n";
                say += "공격력 : " + item.getWatk() + "  |  마력 : " + item.getMatk() + "  | 스타포스 : " + item.getEnhance() + "성\r\n";
                say += "올 스탯 : " + item.getAllStat() + "%  |  총 데미지 : " + item.getTotalDamage() + "%  |  보스 공격력 : " + item.getBossDamage() + "%\r\n";
                say += "아이템 강화 횟수 : " + getAddEnhance(item) + "강\r\n\r\n\r\n";
                cm.sendYesNo("강화에 성공하였습니다.\r\n계속 강화하시려면 '예'를 눌러 주세요.\r\n\r\n" + say);
                Packages.handling.world.World.Broadcast.broadcastMessage(Packages.tools.packet.CWvsContext.serverNotice(2, "[시스템] : " + cm.getPlayer().getName() + "님의 " + Packages.server.MapleItemInformationProvider.getInstance().getName(itemid) + "가 " + getAddEnhance(item) + "강을 달성하였습니다."));
                re = 1;
                status = 1;
            } else {
                item.setStr(item.getStr() - items[getAddEnhance(item)][2]);
                item.setDex(item.getDex() - items[getAddEnhance(item)][2]);
                item.setInt(item.getInt() - items[getAddEnhance(item)][2]);
                item.setLuk(item.getLuk() - items[getAddEnhance(item)][2]);
                item.setWatk(item.getWatk() - items[getAddEnhance(item)][3]);
                item.setMatk(item.getMatk() - items[getAddEnhance(item)][3]);
                item.setOwner("★"+(getAddEnhance(item)-1)+"강★");
                cm.getPlayer().forceReAddItem(item, Packages.client.inventory.MapleInventoryType.DECORATION);
                say = "";
                say += "<아이템 정보>\r\n";
                say += "강화할 아이템 : #i" + itemid + "# #z" + itemid + "#\r\n";
                say += "STR : " + item.getStr() + "  |  DEX : " + item.getDex() + "  |  INT : " + item.getInt() + "  |  LUK " + item.getLuk() + "\r\n";
                say += "공격력 : " + item.getWatk() + "  |  마력 : " + item.getMatk() + "  | 스타포스 : " + item.getEnhance() + "성\r\n";
                say += "올 스탯 : " + item.getAllStat() + "%  |  총 데미지 : " + item.getTotalDamage() + "%  |  보스 공격력 : " + item.getBossDamage() + "%\r\n";
                say += "아이템 강화 횟수 : " + getAddEnhance(item) + "강\r\n\r\n\r\n";
                cm.sendYesNo("강화에 실패하여 옵션이 하락하였습니다.\r\n계속 강화하시려면 '예'를 눌러 주세요.\r\n\r\n" + say);
                re = 1;
                status = 1;
            }
        } else {
            cm.dispose();
            return;
        }
    } else {
        cm.dispose();
        return;
    }
}