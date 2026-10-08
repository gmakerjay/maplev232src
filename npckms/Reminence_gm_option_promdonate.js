importPackage(Packages.server);
importPackage(Packages.database);
importPackage(Packages.client);
importPackage(java.lang);

var status = -1;
var enter = "\r\n";
var tier_coin = 4310298;
var talkType = 0x86;

var colorBlack = "#fc0xFF191919#";

function start() {
    action(1, 0 ,0);
}

function action(mode, type ,sel) {
    if (mode == 1) {
        status++;
    } else {
        status--;
    }
    if (status == 0) {
        var chat = "#fs11#";
        chat += "#L0#" + "#e#r홍보 관련 GM 옵션 이용하기" + enter;
        chat += "#L1#" + "#e#b후원 관련 GM 옵션 이용하기" + enter;

        cm.sendSimple(chat);
    } else if (status == 1) {

        switch (sel)
             {
             case 0 :
                cm.dispose();
                cm.openNpc(3003167);
             break;

             case 1:
                   cm.dispose();
                   cm.openNpc(3003168);
             break;

             }
     }
}