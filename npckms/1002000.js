


/*

    * 단문엔피시 자동제작 스크립트를 통해 만들어진 스크립트 입니다.

    * (Guardian Project Development Source Script)

    ★ 에 의해 만들어 졌습니다.

    엔피시아이디 : 1002000

    엔피시 이름 : 필

    엔피시가 있는 맵 : 헤네시스 : 헤네시스 (100000000)

    엔피시 설명 : MISSINGNO


*/
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
var sel = 0;
var selectitem = 0;
var used = 0;
var use = 0;
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
    }
    if (mode == 1) {
        status++;
    }

    if (status == 0) {
        말 = "#fs11#초월자의 힘에 다가가기 위해 여명의 힘을 개방해보게!\r\n"
        말 += "#fc0xFFD5D5D5#─────────────────────────────#k\r\n";
        말 += "#L1##i1182001##b#t1182001# 1차원 업그레이드#l\r\n"
        말 += "#L2##i1182002##t1182002# 2차원 업그레이드#l\r\n"
        말 += "#L3##i1182003##t1182003# 3차원 업그레이드#l\r\n"
        말 += "#L4##i1182004##t1182004# 4차원 업그레이드#l\r\n"
        말 += "#L5##i1182005##t1182005# 5차원 업그레이드#l\r\n"
        cm.sendSimpleS(말, 0x04, 2192030);
    } else if (status == 1) {
        var check = false;
        sel = selection;
        used = (1182000 + (selection - 1));
        use = (4310000 + (selection - 1));
        inz = cm.getInventory(1);
        txt = "#fs11##d차원의 스톤#n#k을 이용해 #b업그레이드#k를 진행할 뱃지를 선택하게나.\r\n";
        txt += "#b업그레이드#k 진행 시, #fc0xFFDB9700#여명 옵션#k이 #r1단계#k 해방된다네!\r\n";
        txt += "#d#z" + use + "##k을 이용한 확률은 #r100%#k 이니 참고하게.\r\n";
        txt += "#fc0xFFD5D5D5#─────────────────────────────#k\r\n";
        txt += "";
        for (w = 0; w < inz.getSlotLimit(); w++) {
            if (!inz.getItem(w)) {
                continue;
            }
            if (inz.getItem(w).getItemId() == used) {
                txt += "#L" + w + "##i" + inz.getItem(w).getItemId() + "# #z" + inz.getItem(w).getItemId() + "##l\r\n";
                check = true;
            }
        }
        if (!check) {
            cm.sendOkS("#fs11##i" + used + "# #r#z" + used + "##k 아이템이 없는것 같구만.", 4, 2192030);
            cm.dispose();
        } else {
            cm.sendSimpleS(txt, 0x04, 2192030);
        }
    } else if (status == 2) {
        selectitem = inz.getItem(selection);
        var state = selectitem.getState() == 20 ? "#fUI/UIWindow2.img/AdditionalOptionTooltip/legendary# #k#e#fs12##fc0xFFAAD34A#레전더리#fs11##n#k" : selectitem.getState() == 19 ? "#fUI/UIWindow2.img/AdditionalOptionTooltip/unique# #k#e#fs12##fc0xFFEDA900#유니크#fs11##n" : selectitem.getState() == 18 ? "#fUI/UIWindow2.img/AdditionalOptionTooltip/epic# #k#e#fs12##fc0xFF5F00FF#에픽#fs11##n" : selectitem.getState() == 17 ? "#fUI/UIWindow2.img/AdditionalOptionTooltip/rare# #k#e#fs12##fc0xFF1266FF#레어#fs11##n" : "없음";

        txt = "#fs11#선택하신 아이템이#b[ #i" + selectitem.getItemId() + "# #z" + selectitem.getItemId() + "##l]#k가 맞나?\r\n";
        txt += "#r#z" + use + "##k 아이템이 소모된다네.\r\n"; //차원에 따라 표기 다르게
        txt += "#fc0xFFD5D5D5#─────────────────────────────#k\r\n";
        txt += "#b#z" + selectitem.getItemId() + "#의 옵션은 아래와 같습니다.\r\n"
        txt += "#fc0xFFBDBDBD#업그레이드시, 옵션은 유지되며, 계정 내 이동가능으로 변경됩니다.\r\n\r\n#d"

        if (selectitem.getStr() > 0)
            txt += "STR : +" + (selectitem.getStr() + selectitem.getEnchantStr()) + "\r\n"
        if (selectitem.getDex() > 0)
            txt += "DEX : +" + (selectitem.getDex() + selectitem.getEnchantDex()) + "\r\n"
        if (selectitem.getInt() > 0)
            txt += "INT : +" + (selectitem.getInt() + selectitem.getEnchantInt()) + "\r\n"
        if (selectitem.getLuk() > 0)
            txt += "LUK : +" + (selectitem.getLuk() + selectitem.getEnchantLuk()) + "\r\n"
        if (selectitem.getHp() > 0)
            txt += "MAXHP : +" + (selectitem.getHp() + selectitem.getEnchantHp()) + "\r\n"
        if (selectitem.getMp() > 0)
            txt += "MAXMP : +" + (selectitem.getMp() + selectitem.getEnchantMp()) + "\r\n"
        if (selectitem.getWatk() > 0)
            txt += "공격력 : +" + (selectitem.getWatk() + selectitem.getEnchantWatk()) + "\r\n"
        if (selectitem.getMatk() > 0)
            txt += "마력 : +" + (selectitem.getMatk() + selectitem.getEnchantMatk()) + "\r\n"
        if (selectitem.getWdef() > 0)
            txt += "방어력 : +" + (selectitem.getWdef() + selectitem.getEnchantWdef()) + "\r\n"
        if (selectitem.getAcc() > 0)
            txt += "명중률 : +" + (selectitem.getAcc() + selectitem.getEnchantAcc()) + "\r\n"
        if (selectitem.getAvoid() > 0)
            txt += "회피 : +" + (selectitem.getAvoid() + selectitem.getEnchantAviod()) + "\r\n"
        if (selectitem.getSpeed() > 0)
            txt += "스피드 : +" + selectitem.getSpeed() + "\r\n"
        if (selectitem.getJump() > 0)
            txt += "점프력 : +" + selectitem.getJump() + "\r\n"
        if (selectitem.getBossDamage() > 0)
            txt += "보스 공격 시 데미지 : +" + selectitem.getBossDamage() + "\r\n"
        if (selectitem.getIgnorePDR() > 0)
            txt += "몬스터 방어력 무시 : +" + selectitem.getIgnorePDR() + "\r\n"
        if (selectitem.getTotalDamage() > 0)
            txt += "총 데미지 : +" + selectitem.getTotalDamage() + "\r\n"
        if (selectitem.getAllStat() > 0)
            txt += "올스탯 : +" + selectitem.getAllStat() + "\r\n"
        if (selectitem.getReqLevel() > 0)
            txt += "착용 레벨 감소 : +" + selectitem.getReqLevel() + "\r\n"
        if (selectitem.getEnhance() > 0)
            txt += "스타포스 성공 횟수 : +" + selectitem.getEnhance() + "\r\n"
        if (selectitem.getLevel() > 0)
            txt += "주문서 성공 횟수 : + " + selectitem.getLevel() + "\r\n"
        if (selectitem.getUpgradeSlots() > 0)
            txt += "업그레이드 가능 횟수 : +" + selectitem.getUpgradeSlots() + "\r\n"
        if (state != null) {
            txt += "잠재능력 등급 : " + state + "\r\n";
        }
        if (selectitem.getViciousHammer() > 0) {
            txt += "황금망치 제련 적용#k\r\n\r\n"
        }

        txt += "해방을 진행 하시고 싶으시다면 입력창에\r\n#e#r해방하겠습니다#n#k라고 적어주세요.\r\n\r\n";
        txt += "#fs11##r※ 잠재 능력 옵션은 표기되진 않지만 그대로 전승 됩니다.\r\n "
        cm.sendGetText(txt, 2192030);
    } else if (status == 3) {
        text = cm.getText().replaceAll(" ", "");;
        if (!text.contains("해방하겠습니다")) {
            cm.dispose();
        } else {
            if (!cm.haveItem(use, 1)) {   //재료체크
                cm.sendOkS("#fs11##r#z" + use + "##k 아이템이 있는지 다시 한번 확인해보게.", 0x04, 2192030);
                cm.dispose();
                return;
            }
            var starforce = selectitem.getEnhance();
            wonitem = Packages.server.MapleItemInformationProvider.getInstance().getEquipById(selectitem.getItemId());
            giveitem = Packages.server.MapleItemInformationProvider.getInstance().getEquipById(selectitem.getItemId() + 1);
            var name = giveitem.getItemId() == 1182001 ? "1차원" : giveitem.getItemId() == 1182002 ? "2차원" : giveitem.getItemId() == 1182003 ? "3차원" : giveitem.getItemId() == 1182004 ? "4차원" : giveitem.getItemId() == 1182005 ? "5차원" : "";
            giveitem.addStr((selectitem.getStr()) - wonitem.getStr());
            giveitem.addDex((selectitem.getDex()) - wonitem.getDex());
            giveitem.addInt((selectitem.getInt()) - wonitem.getInt());
            giveitem.addLuk((selectitem.getLuk()) - wonitem.getLuk());
            giveitem.addHp((selectitem.getHp()) - wonitem.getHp());
            giveitem.addMp((selectitem.getMp()) - wonitem.getMp());
            giveitem.addWatk((selectitem.getWatk()) - wonitem.getWatk());
            giveitem.addMatk((selectitem.getMatk()) - wonitem.getMatk());
            giveitem.addWdef((selectitem.getWdef()) - wonitem.getWdef());
            giveitem.addMdef((selectitem.getMdef()) - wonitem.getMdef());
            //    giveitem.addAcc((selectitem.getAcc()) - wonitem.getAcc());
            //    giveitem.addAvoid((selectitem.getAvoid()) - wonitem.getAvoid());
            giveitem.addSpeed((selectitem.getSpeed()) - wonitem.getSpeed());
            giveitem.addJump((selectitem.getJump()) - wonitem.getJump());
            giveitem.addBossDamage((selectitem.getBossDamage()) - wonitem.getBossDamage());
            giveitem.addIgnoreWdef((selectitem.getIgnorePDR()) - wonitem.getIgnorePDR());
            giveitem.addAllStat((selectitem.getAllStat()) - wonitem.getAllStat());
            giveitem.setUpgradeSlots(selectitem.getUpgradeSlots());
            giveitem.setLevel(selectitem.getLevel());
            giveitem.setState(selectitem.getState());
            giveitem.setPotential1(selectitem.getPotential1());
            giveitem.setPotential2(selectitem.getPotential2());
            giveitem.setPotential3(selectitem.getPotential3());
            giveitem.setPotential4(selectitem.getPotential4());
            giveitem.setPotential5(selectitem.getPotential5());
            giveitem.setPotential6(selectitem.getPotential6());
            giveitem.setViciousHammer(selectitem.getViciousHammer());
            cm.JoinNubGuild(giveitem, starforce)
            MapleInventoryManipulator.removeFromSlot(cm.getClient(), GameConstants.getInventoryType(selectitem.getItemId()), selectitem.getPosition(), selectitem.getQuantity(), false);
            MapleInventoryManipulator.addbyItem(cm.getClient(), giveitem);
            World.Broadcast.broadcastMessage(CWvsContext.serverMessage(11, cm.getPlayer().getClient().getChannel(), "", cm.getPlayer().getName() + "님이 차원의 스톤을 사용하여 {}를 획득하셨습니다!", true, giveitem));

            cm.gainItem(use, -1);
            말 = "#fs11#" + name + " 해방에 성공했네!\r\n\r\n"
            말 += "#fUI/UIWindow2.img/QuestIcon/4/0#\r\n"
            말 += "#i" + giveitem.getItemId() + "##b#z" + giveitem.getItemId() + "##k";
            cm.sendOkS(말, 0x04, 2192030);
            cm.dispose();
        }

    }
}

