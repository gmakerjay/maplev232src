importPackage(Packages.tools.packet);


//3004620
var status = -1;

function start() {
    status = -1;
    action (1, 0, 0);
}

function action(mode, type, selection) {

    if (mode == -1) {
        cm.dispose();
        return;
    }
    if (mode == 0) {
        status --;
    }
    if (mode == 1) {
        status++;
    }

    if (status == 0) {
        cm.player.getClient().getSession().writeAndFlush(CWvsContext.getTopMsg("통로를 지나자 숨겨져 있던 요정들의 숲이 드러납니다."));
         cm.EnterFairy(true);
        cm.dispose();
        return;
    }
}
