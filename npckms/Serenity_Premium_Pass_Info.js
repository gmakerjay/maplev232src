var status = -1;
var enter = "\r\n";
var talkType = 0x86;

var NormalPassKeyValue = "Serenity_Premium_Pass_KeyValue";

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
        PremiumPassRewardFunction();
        if (cm.getPlayer().getV("HAS_PREMIUM_PASS") == null) {
            cm.sendOkS("FANCY PREMIUM PASS 이용권이 없습니다.", talkType);
            cm.dispose();
            return;
        } 
        if (cm.getPlayer().getSerenityPremiumPassCountComplete() == 11) {
            cm.sendOkS("이미 모든 #bFANCY PREMIUM PASS#k 를 클리어 하셨습니다.", talkType);
            cm.dispose();
            return;
        }
        var chat = "FANCY 프리미엄 패스를 이용하시고 있습니다#k" + enter + enter;

        chat += "현재 #b" + cm.getPlayer().getName() + "#k님의 #b경험치#k : #fc0xFF191919#" + cm.getPlayer().getSerenityPremiumPassExpToString() +"#k"+ enter + enter;

                // Daily Check
                if (cm.getPlayer().getV("Clear_Pass_Premium_Kill_Monster_Amount") == "1" && !cm.getPlayer().isGM()) {
                    var chat = "FANCY 프리미엄 패스를 이용하시고 있습니다#k" + enter + enter;

                    chat += "현재 #b" + cm.getPlayer().getName() + "#k님의 #b경험치#k : " + cm.getPlayer().getSerenityPremiumPassExpToString() + enter + enter;
                    
                    chat += "#r금일 PREMIUM PASS 이용을 이미 하셨습니다 다음날 다시 이용해주세요";
                    cm.sendOkS(chat, talkType);
                    cm.dispose();
                    return;
                }

        chat += "#r금일 레벨 범위 몬스터 사냥 수 #k: (" + cm.getPlayer().getPassKillMonsterAmount()+ " / " + "#r5000" + "#k)" + enter + enter;
        chat += "#b[획득 가능한 보상] : " + "#i" + reward + "# " + rewardAmount +" 개"+ enter
        
        if (cm.getPlayer().getPassKillMonsterAmount() >= 5000) {
            chat += "#L0#" + "#r[클릭] #fc0xFF191919#FANCY 프리미엄 패스 보상 획득하기 ";
        } else {
            chat += "#k레벨범위 몬스터를 5000마리 이상 잡으시고 다시 말을 걸어주세요!";
        }

        cm.sendSimpleS(chat, talkType);
        // Clear Pass & Daily Mission
    } else if (status == 1) {
        if (selection == 0 ) {
            //cm.getPlayer().ClearPassKillMonsterAmount(); // Daily Clear
            cm.getPlayer().setSerenityPremiumPassCountComplete(1); // Increase Pass Exp +1
            cm.getPlayer().ClearPassKillPremiumMonsterAmount(); // Clear Key
            cm.getPlayer().setSerenityPass(); // Clear Monster Kill Count 
            cm.getPlayer().addPassKillMonsterAmount(5000);
            cm.getPlayer().gainItem(reward, rewardAmount);
            cm.sendOkS("#rFANCY PREMIUM PASS REWARD! 를 지급받았습니다 보상내역은 아래와 같습니다.\r\n\r\n#k획득한 보상 : #i" + reward+ "# #b" + rewardAmount + "개" , talkType);
            cm.dispose();
            return;
        }
    }
}

function PremiumPassRewardFunction() {
    var passRewardCount = cm.getPlayer().getSerenityPremiumPassCountComplete();
    var PremiumPassReward = 0;
    var PremiumPassRewardAmount = 0;
    switch(passRewardCount) {
        case 1:
            PremiumPassReward = 5062005; 
            PremiumPassRewardAmount = 10;
            break;
        case 2:
            PremiumPassReward =  5060048; // 골드 애플 1개
            PremiumPassRewardAmount = 10;
            break;
        case 3 :
            PremiumPassReward =  4310248; // LUNA 코인 1000개
            PremiumPassRewardAmount = 5000;
            break;
        case 4:
            PremiumPassReward =  4001716; // 10억 메소 주머니
            PremiumPassRewardAmount = 10;
            break;
        case 5 :
            PremiumPassReward =  4001782; 
            PremiumPassRewardAmount = 3;
            break;
        case 6:
            PremiumPassReward =  2630120;
            PremiumPassRewardAmount = 3;
            break;
        case 7:
            PremiumPassReward =  2049376; 
            PremiumPassRewardAmount = 1;
            break;
        case 8 :
            PremiumPassReward =  5062005; 
            PremiumPassRewardAmount = 50;
            break;
        case 9:
            PremiumPassReward =  2437573; 
            PremiumPassRewardAmount = 3;
            break;
        case 10 :
            PremiumPassReward =  2633924; 
            PremiumPassRewardAmount = 4;
            break;
        }
        reward = PremiumPassReward;
        rewardAmount = PremiumPassRewardAmount;
}
    