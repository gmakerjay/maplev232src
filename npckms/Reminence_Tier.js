var status = -1;
var enter = "\r\n";
var tier_coin = 4310298;
var talkType = 0x86;

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
        var chat = "\r\n";

        chat += "설명" + enter;
        chat += "#L0#" + "티어 승급하기" + enter;
        chat += "#L1#" + "티어컨텐츠에 대한 설명듣기" + enter;

        cm.sendSimpleS(chat, talkType);
    }
}