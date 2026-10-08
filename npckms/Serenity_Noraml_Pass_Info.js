var status = -1;
var enter = "\r\n";
var talkType = 0x86;

var NormalPassKeyValue = "Serenity_Normal_Pass_KeyValue";

var PassEvenetKey = "Pass_kill_Monster_amount";

var reward;
var rewardAmount;
function start() {
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
        NormalPassRewardFunction();

        if (cm.getPlayer().getSerenityNormalPassCountComplete() == 11) {
            cm.sendOkS("이미 모든 #bFANCY NORMAL PASS#k 를 클리어 하셨습니다.", talkType);
            cm.dispose();
            return;
        }
        var chat = "FANCY 일반 패스를 이용하시고 있습니다#k" + enter + enter;

        chat += "현재 #b" + cm.getPlayer().getName() + "#k님의 #b경험치#k : #fc0xFF191919#" + cm.getPlayer().getSerenityNormalPassExpToString() +"#k"+ enter + enter;

                // Daily Check
                if (cm.getPlayer().getV("Clear_Pass_Kill_Monster_Amount") == "1" && !cm.getPlayer().isGM()) {
                    var chat = "FANCY 일반 패스를 이용하시고 있습니다#k" + enter + enter;

                    chat += "현재 #b" + cm.getPlayer().getName() + "#k님의 #b경험치#k : " + cm.getPlayer().getSerenityNormalPassExpToString() + enter + enter;
                    
                    chat += "#r금일 NORMAL PASS 이용을 이미 하셨습니다 다음날 다시 이용해주세요";
                    cm.sendOkS(chat, talkType);
                    cm.dispose();
                    return;
                }

        chat += "#r금일 레벨 범위 몬스터 사냥 수 #k: (" + cm.getPlayer().getPassKillMonsterAmount()+ " / " + "#r5000" + "#k)" + enter + enter;
        chat += "#b[획득 가능한 보상] : " + "#i" + reward + "# " + rewardAmount +" 개"+ enter
        
        if (cm.getPlayer().getPassKillMonsterAmount() >= 5000) {
            chat += "#L0#" + "#r[클릭] #fc0xFF191919#FANCY 일반 패스 보상 획득하기 ";
        } else {
            chat += "#k레벨범위 몬스터를 5000마리 이상 잡으시고 다시 말을 걸어주세요!";
        }

        cm.sendSimpleS(chat, talkType);
        // Clear Pass & Daily Mission
    } else if (status == 1) {
        if (selection == 0 ) {
            cm.getPlayer().ClearPassKillMonsterAmount(); // Daily Clear
            cm.getPlayer().setSerenityNormalPassCountComplete(1); // Increase Pass Exp +1
           // cm.getPlayer().ClearPassKillMonsterAmount(); // Clear Key
            cm.getPlayer().setSerenityPass(); // Clear Monster Kill Count 
            cm.getPlayer().addPassKillMonsterAmount(5000);
            cm.getPlayer().gainItem(reward, rewardAmount);
            cm.sendOkS("#rFANCY NORMAL PASS REWARD! 를 지급받았습니다 보상내역은 아래와 같습니다.\r\n\r\n#k획득한 보상 : #i" + reward+ "# #b" + rewardAmount + "개" , talkType);
            cm.dispose();
            return;
        }
    }
}

function NormalPassRewardFunction() {
    var passRewardCount = cm.getPlayer().getSerenityNormalPassCountComplete();
    var NormalPassReward = 0;
    var NormalPassRewardAmount = 0;
    switch(passRewardCount) {
        case 1:
            NormalPassReward = 2437750; // 블랙 큐브 100개
            NormalPassRewardAmount = 20;
            break;
        case 2:
            NormalPassReward = 5060048; // 골드 애플 1개
            NormalPassRewardAmount = 1;
            break;
        case 3 :
            NormalPassReward = 4310999; //  코인 1000개
            NormalPassRewardAmount = 1000;
            break;
        case 4:
            NormalPassReward = 2437750; // 10억 메소 주머니
            NormalPassRewardAmount = 100;
            break;
        case 5 :
            NormalPassReward = 4001780; //돌리판 이용권 5개
            NormalPassRewardAmount = 5;
            break;
        case 6:
            NormalPassReward = 2048717; //영환불 500개
            NormalPassRewardAmount = 500;
            break;
        case 7:
            NormalPassReward = 2049372; // 스타포스 15성 강화권 1개
            NormalPassRewardAmount = 1;
            break;
        case 8 :
            NormalPassReward = 5062006; // 플래티넘 미라클 큐브 500개
            NormalPassRewardAmount = 50;
            break;
        case 9:
            NormalPassReward = 2430068; // 칠흑 선택 상자 1개
            NormalPassRewardAmount = 1;
            break;
        case 10 :
            NormalPassReward = 1142068; // 최종 보상
            NormalPassRewardAmount = 1;
            break;
        }
        reward = NormalPassReward;
        rewardAmount = NormalPassRewardAmount;
}
    