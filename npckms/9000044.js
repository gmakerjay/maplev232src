importPackage(Packages.constants);

var status = -1;
var nowtime = new Date();
var 보스맵 = ServerConstants.worldbossmap;
var 돌아갈맵 = ServerConstants.worldbossfirstmap;

var 홀수보상 = [[4033897, 50], [4001129, 5], [4310237, 500]]; //그냥 들어가서 깨기만해도 받는보상
var 홀수막타보상 = [[4033897, 10], [4310237, 100], [4001129, 10]]; //막타치면 받는보상  

var 짝수보상 = [[4033897, 50], [4001129, 100], [4310237, 5000]]; //그냥 들어가서 깨기만해도 받는보상
var 짝수막타보상 = [[4033897, 100], [4310237, 10000], [4001129, 100]]; //막타치면 받는보상  
var 판매아이템 = [[4033897, 1, 1], [4310237, 100, 1], [2633620, 20, 1], [2431157, 1, 1], [2431156, 1, 1], [4033897, 10, 10], [4310237, 1000, 10], [2633620, 200, 10], [2431157, 10, 10], [2431156, 10, 10], [4033897, 100, 100], [4310237, 10000, 100], [2633620, 2000, 100], [2431157, 100, 100], [2431156, 100, 100]]; // 월드보스 코인 상점 목록
var 구매시필요아이템 = 4001129; //월드보스 상점에서 쓰이는 코인

var 고정보상홀짝;
var 막타보상홀짝;

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else if (mode == 0 && type == 0) {
        status--;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (보스맵 == cm.getPlayer().getMapId()) {
//            if (cm.getMap().getNumMonsters() <= 0) {//&& cm.haveItem(처치템, 1)
                cm.sendYesNo("보상을 받고나가시겠습니까");
//            }
        } else {
            if (cm.getPlayer().gethottimeboss() && cm.getPlayerCount(211070100) < 31) {
                if (cm.getMap().getChannel() == 1 || cm.getMap().getChannel() == 2 || cm.getMap().getChannel() == 3 || cm.getMap().getChannel() == 4) {
                    cm.sendYesNo("월드 보스가 시작 되었습니다.");
                } else {
                    cm.sendOk("1,20세,2,3 채널에서만 입장 가능합니다. 다른채널을 이용해주세요 최대인원은 30명입니다. (기타창은 꼭 한칸 비우세요)");
                    cm.dispose();
                }
            } else {
                var text = "아직 #b#e월드보스 핫타임 이벤트#k#n가 시작되지 않았습니다. 월드보스가 시작되기전에 다시 찾아와주세요.\r\n현재는 #r#e월드보스 의 전리품#k#n#i" + 구매시필요아이템 + "#으로 상점을 이용할수 있는 시간입니다.!어떤 아이템을 구매하시고 싶으세요?\r\n\r\n";
                for (var i = 0; i < 판매아이템.length; i++) {
                    text += "#L" + i + "# #i" + 판매아이템[i][0] + ":##z" + 판매아이템[i][0] + ":# " + 판매아이템[i][1] + " 개 = #i" + 구매시필요아이템 + "#" + 판매아이템[i][2] + "개 필요  #l \r\n";
                }
                text += "";
                cm.sendSimple(text);
            }
        }

    } else if (status == 1) {
        if (보스맵 == cm.getPlayer().getMapId() || cm.getPlayer().gethottimeboss()) {
            if (보스맵 == cm.getPlayer().getMapId()) {
                고정보상홀짝 = ServerConstants.hourcheck(nowtime.getHours()) ? 홀수보상 : 짝수보상;
                막타보상홀짝 = ServerConstants.hourcheck(nowtime.getHours()) ? 홀수막타보상 : 짝수막타보상;
                var 보상여부 = false;
                for (var i = 0; i < 고정보상홀짝.length; i++) {
                    if (!cm.canHold(고정보상홀짝[i][0], 고정보상홀짝[i][1])) {
                        보상여부 = true;
                        break;
                    }
                }
                if (cm.getPlayer().gethottimebosslastattack()) {
                    for (var i = 0; i < 막타보상홀짝.length; i++) {
                        if (!cm.canHold(막타보상홀짝[i][0], 막타보상홀짝[i][1])) {
                            보상여부 = true;
                            break;
                        }
                    }
                }

                for (var i = 0; i < 고정보상홀짝.length; i++) {
                    cm.gainItem(고정보상홀짝[i][0], 고정보상홀짝[i][1]);
                }

                if (cm.getPlayer().gethottimebosslastattack()) {
                    for (var i = 0; i < 막타보상홀짝.length; i++) {
                        cm.gainItem(막타보상홀짝[i][0], 막타보상홀짝[i][1]);
                    }
                }
                
                cm.getPlayer().sethottimeboss(false);
                cm.warp(돌아갈맵, 0);
                cm.dispose();
            } else {
                if (cm.getPlayer().gethottimeboss()) {
                    if (cm.getMap(보스맵).getCharactersSize() == 0) {
                        cm.getMap(보스맵).resetFully();
                    }
                    cm.warp(보스맵);
                    cm.dispose();
                }
            }
        } else {
            if (cm.haveItem(구매시필요아이템, 판매아이템[selection][2])) {
                if (cm.canHold(판매아이템[selection][2])) {
                    cm.sendOk("장비 공간이 부족합니다.");
                    cm.dispose();
                    return;
                }
                cm.gainItem(판매아이템[selection][0], 판매아이템[selection][1]);
                cm.gainItem(구매시필요아이템, -판매아이템[selection][2]);
                cm.sendOk("구매 완료");
                cm.dispose();
            } else {
                cm.sendOk("아이템이 부족합니다.");
                cm.dispose();
            }
        }
    }
}