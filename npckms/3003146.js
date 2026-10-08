var status = -1;

var 일반스킬 =  [
    // 키벨류, 스킬코드, 스킬이름, 가격, 개별 명령어 사용여부 (true시 개별사용)
    ["ww_cross", 1311015, "크오체", 100000, false],
    ["ww_holy", 2311003 , "홀리 심볼", 100000, false],
    ["ww_sharp", 3121002, "샤프아이즈", 100000, false],
    ["ww_winb", 5121009, "윈드 부스터", 100000, false],
    ["ww_bullseye", 3221054, "불스아이", 100000, false],
    ["ww_ccut", 4341002, "파이널 컷", 500000, false],
]

var 후원스킬 = [
    // 키벨류, 스킬코드, 스킬이름, 가격, 갯수,개별 명령어 사용여부 (true시 개별사용)
    ["ww_secro", 1221054, "새크로생티티", 4251402, 6, true],
    ["ww_sup", 5321054, "벅 샷", 4251402, 2, true],
    ["ww_fireaura", 2121054, "파이어 오라", 4430000, 1, true],
    ["ww_tripling", 13100022, "트라이플링 윔", 4251401, 1, true],
    ["ww_serpent", 400051015, "서펜트 스크류", 4251401, 1, true],
    //["ww_tripling3", 13110022, "트라이플링 윔 추가타", 4430000, 1, false],
    //["ww_quiver", 3100010, "퀴버 카트리지", 4430000, 1, false],
    ["ww_autodrop", 80003068, "오토루팅", 4251401, 3, false],
]

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
    if (status == 0) {
        talk = "#fn나눔고딕 Extrabold##fs11# 구매하실 카테고리를 선택하세요.\r\n#b";
        talk += "#L0##fUI/GuildMark.img/Mark/Pattern/00004001/11# 일반 후원스킬#l\r\n";
        talk += "#L1##fUI/GuildMark.img/Mark/Pattern/00004001/11# VIP 후원스킬#l\r\n";
        cm.sendSimple(talk);
    } else if (status == 1) {
        talk = "#fn나눔고딕 Extrabold##fs11#후원 스킬을 구매하고 싶으신가요?\r\n\r\n";
        talk += "#fc0xFF000000#현재 #fc0xFFFF3366##h ##fc0xFF000000# 님의 도네이션 포인트 : #fc0xFFFF3366#"+cm.getPlayer().getDonationPoint()+"P#k\r\n";
        if (selection == 0) { // 후원스킬
            for (i=0; i < 일반스킬.length; i++) {
                talk += "#L"+i+"# #s"+일반스킬[i][1]+"# "+일반스킬[i][2]+" #r("+일반스킬[i][3]+"P)#k#l\r\n";
            }
            cm.sendSimple(talk);
        } else if (selection == 1) { // 스페셜 스킬
            for (i=0; i < 후원스킬.length; i++) {
                talk += "#L"+(i + 100)+"# #s"+후원스킬[i][1]+"# "+후원스킬[i][2]+" #r(#i"+후원스킬[i][3]+"# "+후원스킬[i][4]+"개)#k#l\r\n";
            }
            cm.sendSimple(talk);
        }
    } else if (status == 2) {
        if (selection < 100) {
            if (cm.getPlayer().getKeyValue(일반스킬[selection][1], ""+일반스킬[selection][0]+"") != 1) {
                if (cm.getPlayer().getDonationPoint() >= 일반스킬[selection][3]) {
                    cm.getPlayer().gainDonationPoint(-일반스킬[selection][3]);
                    cm.getPlayer().setKeyValue(일반스킬[selection][1], ""+일반스킬[selection][0]+"", "1");
                    cm.getPlayer().setKeyValue(1234, "skill_on", "1");
                    cm.getPlayer().setKeyValue(1234, "isDont", "1");
                    if (일반스킬[(selection)][4]) {
                        cm.getPlayer().setKeyValue(1234, 일반스킬[(selection)][1] + "_on", "1");
                    }
                    cm.sendOk("#fn나눔고딕 Extrabold##fs11#선택하신 #s"+일반스킬[selection][1]+"# #b"+일반스킬[selection][2]+"#k를 구매하셨습니다.");
                } else {
                    cm.sendOk("#fn나눔고딕 Extrabold##fs11#후원포인트가 부족하여 구매 할수없습니다.");
                }
            } else {
                cm.sendOk("#fn나눔고딕 Extrabold##fs11#이미 구매하신 후원스킬 입니다.");
                if (일반스킬[(selection)][4]) {
                    cm.getPlayer().setKeyValue(1234, 일반스킬[(selection)][1] + "_on", "1");
                }
                cm.getPlayer().setKeyValue(1234, "isDont", "1");
                cm.getPlayer().setKeyValue(1234, "skill_on", "1");
            }
        } else {
            if (cm.getPlayer().getKeyValue(후원스킬[(selection - 100)][1], ""+후원스킬[(selection - 100)][0]+"") != 1) {
                if (cm.haveItem(후원스킬[(selection - 100)][3], 후원스킬[(selection - 100)][4])) {
                    cm.gainItem(후원스킬[(selection - 100)][3], -후원스킬[(selection - 100)][4]);
                    cm.getPlayer().setKeyValue(1234, "skill_on", "1");
                    cm.getPlayer().setKeyValue(1234, "isDont", "1");
                    if (후원스킬[(selection - 100)][5]) {
                        cm.getPlayer().setKeyValue(1234, 후원스킬[(selection - 100)][1] + "_on", "1");
                    }
                    cm.getPlayer().setKeyValue(후원스킬[(selection - 100)][1], ""+후원스킬[(selection - 100)][0]+"", "1");
                    cm.sendOk("#fn나눔고딕 Extrabold##fs11#선택하신 #s"+후원스킬[(selection - 100)][1]+"# #b"+후원스킬[(selection - 100)][2]+"#k를 구매하셨습니다.");
                } else {
                    cm.sendOk("#fn나눔고딕 Extrabold##fs11##r#i"+후원스킬[(selection - 100)][3]+"# #z"+후원스킬[(selection - 100)][3]+"# "+후원스킬[(selection - 100)][4]+"개#k 가 부족합니다.");
                }
            } else {
                cm.sendOk("#fn나눔고딕 Extrabold##fs11#이미 구매하신 후원스킬 입니다.");
                if (후원스킬[(selection - 100)][5]) {
                    cm.getPlayer().setKeyValue(1234, 후원스킬[(selection - 100)][1] + "_on", "1");
                }
                cm.getPlayer().setKeyValue(1234, "skill_on", "1");
                cm.getPlayer().setKeyValue(1234, "isDont", "1");
            }
        }
        cm.dispose();
    } 
}