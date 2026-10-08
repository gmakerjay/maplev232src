var status = -1;

function start() {
    action(1, 0, 0);
}


function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    wList = [];
    wGain = [];
    if (status == 0) {
        getItem();
        getItem2();
        if (cm.getPlayer().getClient().getKeyValue("ServerBackRE") == null) {
            selStr = "#b2022-11-30 서버 백섭#k으로 인한 보상입니다..\r\n\r\n #b다음#l을 누르면 아이템이 수령됩니다.\r\n\r\n";
            for (i = 0; i < wList.length; i++) {
                selStr += "#i" + wList[i] + ":# #t" + wList[i] + ":# #b" + wGain[i] + "개#l\r\n";
            }
            cm.sendSimpleS(selStr, 4, 2007);
        } else {
            selStr = "이미 보상을 획득 하셨습니다.";
            cm.sendOk(selStr);
            cm.dispose();
        }


    } else if (status == 1) {
		 cm.getPlayer().getClient().setKeyValue("ServerBackRE", "1");
        getItem();
        getItem2();
        selStr2 = "아래의 아이템이 수령되었습니다.\r\n\r\n";
        for (i = 0; i < wList.length; i++) {
            selStr2 += "#i" + wList[i] + ":# #t" + wList[i] + ":# #b" + wGain[i] + "개#l\r\n";
        }
        for (i = 0; i < wList.length; i++) {

            cm.gainItem(wList[i], wGain[i]);
        }

       
        cm.sendSimpleS(selStr2, 4, 2007);
        cm.dispose();
    }
}

function getItem() {

         wList.push(2450134),
        wList.push(2023072),
        wList.push(2439869),
        wList.push(5060048);
}

function getItem2() {

    wGain.push(5),
        wGain.push(2),
        wGain.push(300),
        wGain.push(3);
}