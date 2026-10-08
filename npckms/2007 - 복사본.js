


/*

	* 단문엔피시 자동제작 스크립트를 통해 만들어진 스크립트 입니다.

	* (Guardian Project Development Source Script)

	화이트 에 의해 만들어 졌습니다.

	엔피시아이디 : 2004

	엔피시 이름 : 토드

	엔피시가 있는 맵 : The Black : Night Festival (100000000)

	엔피시 설명 : MISSINGNO


*/
importPackage(java.lang);
importPackage(Packages.constants);
importPackage(Packages.handling.channel.handler);
importPackage(Packages.tools.packet);
importPackage(Packages.handling.world);
importPackage(java.lang);
importPackage(Packages.constants);
importPackage(Packages.server.items);
importPackage(Packages.client.items);
importPackage(java.lang);
importPackage(Packages.launch.world);
importPackage(Packages.tools.packet);
importPackage(Packages.constants);
importPackage(Packages.client.inventory);
importPackage(Packages.server.enchant);
importPackage(java.sql);
importPackage(Packages.database);
importPackage(Packages.handling.world);
importPackage(Packages.constants);
importPackage(java.util);
importPackage(java.io);
importPackage(Packages.client.inventory);
importPackage(Packages.client);
importPackage(Packages.server);
importPackage(Packages.tools.packet);
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
        cm.Entertuto(true);
    } else if (status == 1) {
        cm.sendScreenText("#fs25##fc0xFFF2CB61#여명 시스템#k에 대해 설명드리겠습니다.", false);
    } else if (status == 2) {
        cm.sendScreenText("#fs17##i1182000# #z1182000#　　　　　　　　　　　　　　　　　　　　　　　　#i1182001# #z1182001# (1차원)　　　　　　　　　　　　　　　　　　　　　#i1182002# #z1182002# (2차원)　　　　　　　　　　　　　　　　　　　　#i1182003# #z1182003# (3차원)　　　　　　　　　　　　　　　　　　　　#i1182004# #z1182004# (4차원)　　　　　　　　　　　　　　　　　　　　　#i1182005# #z1182005# (5차원)", false);
    } else if (status == 3) {
        cm.sendScreenText("#fc0xFFF2CB61#여명 아이템#k은 총 #fc0xFF6B66FF#6가지#k로 나뉘어져 있습니다.", true);
    } else if (status == 4) {
        cm.sendScreenText("#fs25##i1182000# #fc0xFFF2CB61##z1182000#란?#k", false);
    } else if (status == 5) {
        cm.sendScreenText("#fs17##fc0xFFFFBB00#여명 옵션#k 이라는 고유 옵션을 가지고 있습니다.", false);
    } else if (status == 6) {
        cm.sendScreenText("#fc0xFF6B66FF#차원 해방#k, 단순 업그레이드를 하기 위한 #fc0xFFF29661#베이스 장비 아이템#k 입니다.", false);
    } else if (status == 7) {
        cm.sendScreenText("다른 뱃지와는 달리 #fc0xFFFFE400#스타포스#k와 #fc0xFF6799FF#전용 주문서#k가 가능합니다.", false);
    } else if (status == 8) {
        cm.sendScreenText("이후 #fc0xFF6B66FF#차원 해방#k 시스템을 통해 고유 능력을 개방할 수 있습니다.", true);
    } else if (status == 9) {
        cm.sendScreenText("#fs25##fc0xFFFFBB00#여명 옵션#k은 #r2가지#k 방법으로 개방이 가능합니다.", false);
    } else if (status == 10) {
        cm.sendScreenText("#fs22##fc0xFFF15F5F#첫번째#k, #i4310006# #z4310006#로 업그레이드가 가능합니다.　　　　　#fs15##z4310006#은 #fc0xFFF29661#일일퀘스트, 파티퀘스트, 보스#k를 통해 획득이 가능합니다.", false);
    } else if (status == 11) {
        cm.sendScreenText("#fs22##fc0xFFF15F5F#두번째#k, #i4310004# 차원의 스톤으로 업그레이드가 가능합니다.　　　　#fs15#차원의 스톤은 #d스톤 조각#k으로 제작이 가능합니다.", true);
    } else if (status == 12) {
        cm.sendScreenText("#fs25##fc0xFF6B66FF#여명의 샘물#k과 #fc0xFFA566FF#차원의 스톤#k의 차이점?", false);
    } else if (status == 13) {
        cm.sendScreenText("#fs22##fc0xFF6B66FF#여명의 샘물#k은 #fc0xFFF15F5F#귀속 아이템#k이며,", false);
    } else if (status == 14) {
        cm.sendScreenText("업그레이드 마다 성공 확률이 내려갑니다.", false);
    } else if (status == 15) {
        cm.sendScreenText("#fc0xFFA566FF#차원의 스톤#k은 거래가 가능하며,", false);
    } else if (status == 16) {
        cm.sendScreenText("#r100%#k 확률로 업그레이드가 가능합니다.", true);
    } else if (status == 17) {
        cm.Endtuto()
        cm.dispose();
    }
}
