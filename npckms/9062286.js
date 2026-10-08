importPackage(java.lang);
importPackage(Packages.constants);
importPackage(Packages.handling.channel.handler);

파랑 = "#fc0xFF0054FF#";
연파 = "#fc0xFF6B66FF#";
연보 = "#fc0xFF8041D9#";
보라 = "#fc0xFF5F00FF#";
노랑 = "#fc0xFFEDD200#";
검정 = "#fc0xFF191919#";
화이트 = "#fc0xFFFFFFFF#";


틀 = "#fUI/Basic.img/actMark/23#";
다이어리 = "#fUI/Basic.img/actMark/24#";
시즌패스 = "#fUI/Basic.img/actMark/25#";
일일임무 = "#fUI/Basic.img/actMark/26#";
레벨업 = "#fUI/Basic.img/actMark/27#";
랭크 = "#fUI/Basic.img/actMark/28#";
환생 = "#fUI/Basic.img/actMark/29#";

var status = -1;


function start() {
    action(1, 0, 0);
}

/*
            cm.dispose();
            InterServerHandler.EnterCS(cm.getPlayer().getClient(),cm.getPlayer(), false); 캐시샵
*/

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
				var msg = "";
				msg += "#fs12##b#e   [일일 퀘스트]#k#n\r\n#l\r\n";
				msg += "#r#e*일일 퀘스트 보상 수령시 \r\n꼭 장비 인벤토리 20칸 비울 것!\r\n#k#n**#r#e복구X#n#k**\r\n#l\r\n";
				msg += "#L1##fs11##fUI/UIWindow.img/Quest/icon0#  (Lv. 190)#d 헤이븐 - #b긴급 지원#n#k#l\r\n";
				msg += "#L7##fs11##fUI/UIWindow.img/Quest/icon0#  (Lv. 190)#d 버려진 야영지 - #b어둠 퇴치#n#k#l\r\n";
				msg += "#L2##fUI/UIWindow.img/Quest/icon0#  (Lv. 200)#d 소멸의여로 - #b소멸의 여로 조사#n#k#l\r\n";
				msg += "#L3##fUI/UIWindow.img/Quest/icon0#  (Lv. 210)#d 츄츄아일랜드 - #b삐빅의 의뢰#n#k#l\r\n";
				msg += "#L4##fUI/UIWindow.img/Quest/icon0#  (Lv. 220)#d 레헬른 - #b마을촌장의 부탁#n#k#l\r\n";
				msg += "#L8##fUI/UIWindow.img/Quest/icon0#  (Lv. 235)#d 아르카나 - #b아르카나의 위기#n#k#l\r\n";
				msg += "#L5##fUI/UIWindow.img/Quest/icon0#  (Lv. 230)#d 모라스 - #b모라스의 안정을 위해#n#k#l\r\n";
				msg += "#L6##fUI/UIWindow.img/Quest/icon0#  (Lv. 235)#d 에스페라 - #b에스페라 정화#l#n#k#l\r\n";
				msg += "#L11##fUI/UIWindow.img/Quest/icon0#  (Lv. 260)#d 세르니움 - #b세르니움 정화#l#n#k\r\n#l\r\n";
        cm.sendOk(msg);

    } else if (status == 1) {
        if (selection == 100) { // 사냥이벤트 아이템교환
            cm.dispose();
            cm.openNpc(9062710);
        } else if (selection == 1) { 
            cm.dispose();
            cm.openNpc(2155000);
        } else if (selection == 2) { 
            cm.dispose();
            cm.openNpc(3003104);
        } else if (selection == 3) { 
            cm.dispose();
            cm.openNpc(3003162);
        } else if (selection == 4) { 
            cm.dispose();
            cm.openNpc(3003252);
        } else if (selection == 5) { 
            cm.dispose();
            cm.openNpc(3003480);
        } else if (selection == 6) { 
            cm.dispose();
            cm.openNpc(3003756);
        } else if (selection == 7) { 
            cm.dispose();
            cm.openNpc(1540895);
        } else if (selection == 8) { 
            cm.dispose();
            cm.openNpc(3003326);
        } else if (selection == 9) { 
            cm.dispose();
            cm.openNpc(3004540);
        } else if (selection == 11) { 
            cm.dispose();
            cm.openNpc(3004540);

        } else if (selection == 40) { // 검키우기
            cm.dispose();
            cm.openNpc(3005575);
        } else if (selection == 50) { // 후원룰렛
            cm.dispose();
            cm.openNpc(9010049);    
        } else if (selection == 4) { // 어빌리티
            if (cm.getPlayer().getInnerSkills().size() > 2) {
                cm.sendOk("#fs11#" + 검정 + "이미 어빌리티가 개방되어 있다네!#k", 9401232);
                cm.dispose();
                return;
            }
            cm.forceCompleteQuest(12394);
            cm.forceCompleteQuest(12395);
            cm.forceCompleteQuest(12396);
            cm.setInnerStats(1);
            cm.setInnerStats(2);
            cm.setInnerStats(3);
            cm.fakeRelog();
            cm.updateChar();
            cm.sendOk("#fs11#" + 검정 + "자네를 위해 어빌리티를 개방해주었다네!", 9401232);
            cm.dispose();
        } else if (selection == 6) { // 펫 교환
            말 = "#fs11#" + 검정 + "교환하고 싶은 라벨의 펫을 선택해보게.\r\n"
            말 += "#fc0xFFD5D5D5#───────────────────────────#k\r\n";
            말 += "#fs11##L0#" + 펫 + "#fc0xFF6B66FF# 라벨 펫#k" + 검정 + "을 교환하고 싶습니다.#l\r\n"
            말 += "#fs11##L1#" + 펫1 + "#fc0xFFA566FF# 라벨 펫#k" + 검정 + "을 교환하고 싶습니다.#l\r\n"
            cm.sendSimpleS(말, 0x04, 9401232)
             } else if (selection == 14) {
            cm.dispose();
			cm.openNpcCustom(cm.getClient(), 9062294, "원클큐브");
        } else if (selection == 15) {
			cm.dispose();
			cm.openNpcCustom(cm.getClient(), 9062294, "원클환불");
        } else if (selection == 16) {
			cm.dispose();
			cm.openNpcCustom(cm.getClient(), 9062294, "CashStroage");
        } else if (selection == 17) {
			cm.dispose();
            cm.openNpc(9062543);
		} else if (selection == 20) {
			cm.dispose();
			cm.openNpcCustom(cm.getClient(), 1052206, "LevelReward");
//		 cm.openNpcCustom(cm.getClient(), 1052206, "LevelReward");
		 } else if (selection == 22) {
			cm.dispose();
		 cm.openNpcCustom(cm.getClient(), 1052206, "SeasonPass");
        }  else if (selection == 18) {
        cm.dispose();
        cm.openNpcCustom(cm.getClient(), 1052206, "Stealskill");
         } else if (selection == 6974) {
					cm.dispose();
					cm.warp(101084400, 0);
		 }
    } else if (status == 2) {
        if (selection == 0) {
            cm.dispose();
            cm.openNpc(2074149);
        } else if (selection == 1) {
            cm.dispose();
            cm.openNpc(2074150);
        }
    }
}