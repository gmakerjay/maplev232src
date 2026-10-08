/*


	엔피시아이디 : 

	엔피시 이름 : 

	엔피시가 있는 맵 :  :  ()

	엔피시 설명 : 일일 퀘스트


*/
var status = -1;

var date = new Date();
var day = date.getDay();
switch (day) {
    case 0:
        week = "일"
        reqitem = [4000051,4000052];  //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 5060048, 4310900]; //클리어시 받을 아이템
        rewardea = [2,1,50]; //클리어시 받을 아이템 개수
        break;
    case 1:
        week = "월"
        reqitem = [4000160,4000179]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 2635909, 4310900]; //클리어시 받을 아이템
        rewardea = [2,1,50]; //클리어시 받을 아이템 개수
        break;
    case 2:
        week = "화"
        reqitem = [4000644,4000642]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 2633616, 4310900]; //클리어시 받을 아이템
        rewardea = [2,100,100]; //클리어시 받을 아이템 개수
        break;
    case 3:
        week = "수"
        reqitem = [4000180,4000181]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 2048717, 4310900]; //클리어시 받을 아이템
        rewardea = [2,200,200]; //클리어시 받을 아이템 개수
        break;
    case 4:
        week = "목"
        reqitem = [4000623,4000673]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 2048767, 4310900]; //클리어시 받을 아이템
        rewardea = [2,100,100]; //클리어시 받을 아이템 개수
        break;
    case 5:
        week = "금"
        reqitem = [4000155,4000156]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 2635906, 4310900]; //클리어시 받을 아이템
        rewardea = [2,1,200]; //클리어시 받을 아이템 개수
        break;
    case 6:
        week = "토"
        reqitem = [4000324,4000325]; //필요한 아이템
        reqitemea = [1000,1000]; //필요한 아이템 개수
        reward = [4001716, 4310900, 2635908]; //클리어시 받을 아이템
        rewardea = [2,100,1]; //클리어시 받을 아이템 개수
        break;
    default:
}

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        status--;
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }

    if (status == 0) {
        var text = ""
        if (cm.getPlayer().getKeyValue(20, "talak") != day) {
            cm.getPlayer().setKeyValue(20, "talak", day);
            cm.getPlayer().setKeyValue(20, "talak1", 0);
        }
        text += "안녕하세요 #b#h0##k님\r\n"
        text += "오늘은 #b" + week + "요일#k 이군요.\r\n#b"
        if (cm.getPlayer().getKeyValue(20, "talak1") == 2) {
            text += "#L0#퀘스트를 완료하시겠습니까?#l\r\n"
        } else {
            text += "#L0#요일에 맞는 퀘스트를 내드리겠습니다.#l\r\n"
        }
        text += "#L99#보상보기#l\r\n"
        cm.sendSimple(text);
    } else if (status == 1) {
        var text = ""
        if (selection == 0) {
            if (cm.getPlayer().getKeyValue(20, "talak1") == 1) {
                text += "#fs11#이미 #b" + week + "요일#k의 일일 퀘스트를 완료하였습니다."
                cm.sendOk(text);
                cm.dispose();
                return;
            } else {
                text += "#b"
                for (i = 0; i < reqitem.length; i++) {
                    text += "#fs11##i" + reqitem[i] + "# #z" + reqitem[i] + "# " + reqitemea[i] + "개\r\n"
                    if (i == (reqitem.length - 1)) {
                        text += "\r\n"
                    }
                }
                if (cm.getPlayer().getKeyValue(20, "talak1") == 2) {
                    text += "#fs11##k입니다. 지금 완료하시겠습니까?"
                } else {
                    text += "#fs11##k입니다. 지금 시작하시겠습니까?"
                }
                cm.sendYesNo(text);
            }
        } else if (selection == 99) {
        reward = [4001716,2635909,2633616,2048767,2635906,4310900,5060048]; //클리어시 받을 아이템
        rewardea = [1,5,20,30,40,50,50]; //클리어시 받을 아이템 개수
            text += "#fs11#보상목록입니다.\r\n\r\n"
            text += "#i4001716##i2635909##i2633616##i2048767##i2635906##i43101745##i5060048##i4310900#\r\n"
            cm.sendOk(text);
            cm.dispose();
            return;
        }
    } else if (status == 2) {
        var text = ""
        var ready = true;
        if (cm.getPlayer().getKeyValue(20, "talak1") == 2) {
            for (i = 0; i < reqitem.length; i++) {
                if (cm.getPlayer().getItemQuantity(reqitem[i], false) < reqitemea[i]) {
                    ready = false;
                    text += "#fs11##t" + reqitem[i] + "##n\r\n"
                    text += "#fs11##r" + cm.getPlayer().getItemQuantity(reqitem[i], false) + "#k / " + reqitemea[i] + "개\r\n\r\n"
                }
            }
            if (ready == false) {
                text += "#fs11#퀘스트를 완료하기 위한 조건이 부족합니다.\r\n"
            } else {
                cm.getPlayer().setKeyValue(20, "talak1", 1);
                text += "#fs11#퀘스트를 완료하였습니다.\r\n\r\n"
                text += "#fUI/UIWindow.img/Quest/reward#\r\n"
                for (i = 0; i < reward.length; i++) {
                    text += "#i" + reward[i] + "# #b#t" + reward[i] + "##k #b" + rewardea[i] + "#k개\r\n";
                }
                for (i = 0; i < reqitem.length; i++) {
                    cm.gainItem(reqitem[i], -(reqitemea[i]));
                }
                for (i = 0; i < reward.length; i++) {
                    cm.gainItem(reward[i], rewardea[i]);
                }
            }
        } else {
            cm.getPlayer().setKeyValue(20, "talak1", 2);
            text += "#fs11#퀘스트를 수락하였습니다.\r\n"
        }
        cm.sendOk(text);
        cm.dispose();
        return;
    }
}