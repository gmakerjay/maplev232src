/* 길드 수로 npc 
941000000 입구
941000001 제단 나오는 길
941000100 제단으로 향하는 길
941000200 제단
*/
importPackage(Packages.tools.packet);
importPackage(Packages.database);
function start() {
	St = -1;
	action(1, 0, 0);
}

var se = -1;
var EtcTimer = Packages.server.Timer.EtcTimer;
var higher = false;
var score = 0;

function action(M, T, S) {
	if(M == -1) {
		cm.dispose();
		return;
	}

    if(M == 0) {
        if(St == 1 && se == 0){
            cm.sendOk("알겠습니다. 조사할 준비가 되시면 다시 시도해주세요.");
            cm.dispose();
            return;
        }
        if(St == 0){
            cm.sendOk("그렇다면 정비를 마친 후 다시 시도해주세요.");
            cm.dispose();
            return;
        }
		St--;
	}

	if(M == 1)
	    St++;

	if(St == 0) {
        if(cm.getPlayer().getClient().getGuildSulo().getSuloWeekPoint() == -1 || cm.getPlayer().getClient().getGuildSulo().getSuloPoint() == -1){
            cm.getPlayer().getClient().getGuildSulo().setSuloPoint(0);
            cm.getPlayer().getClient().getGuildSulo().setSuloWeekPoint(0);
        }
		if (cm.getPlayerStat("GID") > 0) {
            if(cm.getPlayer().getMapId() != 941000001 && cm.getPlayer().getMapId() != 941000100) {
                if(cm.getPlayer().getMapId() == 941000000){
                    말 = "유적지가 불길한 기운을 내뿜고 있습니다. 지금 지하 수로를 조사하시겠습니까?\r\n\r\n";
                    말 += "- #e이번 주 최고 점수 : #r"+cm.getPlayer().getClient().getGuildSulo().getSuloWeekPoint()+"#k#n\r\n";
                } else {
                    말 = "샤레니안의 악마, 아르카누스에게 도전하시겠습니까?\r\n";
                }
                말 += "#L1##b샤레니안의 지하 수로에 입장한다.#l\r\n";
                말 += "#L2##b샤레니안의 지하 수로는 어떤 공간인가요?#l\r\n";
                말 += "#L3##b길드 포인트를 얻고싶어요#l\r\n";
                cm.sendSimple(말);
            } else if(cm.getPlayer().getMapId() == 941000100) {
                cm.sendYesNo("준비가 완료되셧다면 안내해드리겠습니다.\r\n\r\n#b#e지금 제단으로 이동하시겠습니까?#k#n");
            } else if(cm.getPlayer().getMapId() == 941000001) {
                var txt = "제단의 불길한 기운이 조금은 줄어든 것 같습니다.\r\n다시 지하 수로 입구로 안내해드리겠습니다.\r\n\r\n";
                higher = parseInt(cm.getPlayer().getClient().getGuildSulo().getSuloPoint()) > parseInt(+cm.getPlayer().getClient().getGuildSulo().getSuloWeekPoint());
                txt += "#e- 획득 점수: #n#b#e" + cm.getPlayer().getClient().getGuildSulo().getSuloPoint() + "점#n#k"
                if (higher) {
                    txt += " #b#e(이번 주 신기록!)#n#k"
                }
                txt += "\r\n"
                txt += "#e- 이번주 최고 점수: #n#r#e" + cm.getPlayer().getClient().getGuildSulo().getSuloWeekPoint() + "점#n#k\r\n\r\n"
                txt +="#L3##b지하 수로 입구로 돌아간다.\r\n"
                txt +="#L4#대화를 종료한다.#k"
                cm.sendSimple(txt);
            }
        } else {
            cm.sendOk("길드에 가입을 하셔야 도전을 하실 수 있으십니다.");
            cm.dispose();
            return;
        }
    } else if(St == 1) {
        se = S;
        if(S == 1){
            if(cm.getPlayer().getMapId() == 941000000){
                cm.sendAcceptDecline("#fs13#지하 수로에 입장 시 지금 적용되어 있는\r\n#fs16##b#e모든 버프 효과가 해제#k#n#fs13#됩니다.\r\n\r\n지금 도전하시겠습니까?");
            } else {
                cm.warp(941000000, 2);
                cm.dispose();
            }
        } else if(S == 2){
            cm.sendNext("#r#e샤레니안의 지하 수로#k#n에 대해 궁금하신가요?");
        } else if(S == 3){
            cm.getPlayer().getGuildScore();
            higher = true;
            if (higher) {
                cm.getPlayer().getClient().getGuildSulo().setSuloWeekPoint(cm.getPlayer().getClient().getGuildSulo().getSuloPoint());
                score += cm.getPlayer().getClient().getGuildSulo().getSuloPoint();
                cm.getPlayer().setGuildScore(cm.getPlayer().getGuildId(), score);
            }
            cm.warp(941000000);
            cm.dispose();
            return;
        } else if(S == 4){
            cm.dispose();
            return;
        } else {
            cm.EnterSulo();
            cm.dispose();
            return;
        }
    } else if(St == 2) {
        if(se == 1){
            cm.TimeMoveMap(941000100, 941000000, 125);
			cm.cancelSkillsbuff()
            cm.getPlayer().getClient().getSession().writeAndFlush(SLFCGPacket.OnYellowDlg(2012041, 1000, "제단의 불길한 기운으로 인해#r모든 버프가 해제#k되었습니다.", ""));
            nextMsg();
            cm.dispose();
            return;
        }
        cm.sendNextPrev("아주 먼 옛날... 샤레니안이라는 고대의 왕국이 있었습니다.\r\n비록 끔찍한 사건으로 인해 왕국이 통째로 멸망하고 말았지만요.");
    } else if(St == 3) {
        cm.sendNextPrev("샤레니안의 유적지를 탐험하려는 시도는 여러 번 있었지만\r\n쉽지 않았고, 결국 그곳으로 향하는 길은 잊히고 말았습니다.\r\n\r\n#r#e얼마 전까지만 해도 말이지요...#k#n");
    } else if(St == 4) {
        cm.sendNextPrev("전 이전부터 샤레니안의 유적지를 조사 중이었는데 사고로 인해 아무도 가지 않았던 곳에서 #b샤레니안의 지하 수로로 통하는 길을 발견했습니다.#k");
    } else if(St == 5) {
        cm.sendNextPrev("매우 많은 입구들이 미로처럼 얽혀있지만 어느 길로 가도 불길한 기운이 잠들어 있는 제단이 있는 곳으로 갈 수 있었지요.");
    } else if(St == 6) {
        cm.sendNextPrev("길드 본부는 지하 수로 조사를 결정했습니다. 지하 수로 입구에서 저에게 말을 걸어서 샤레니안의 지하 수로로 통하는 문을 열면, 불긴한 기운의 제단으로 향하는 통로로 갈 수 있습니다.");
    } else if(St == 7) {
        cm.sendNextPrev("조사는 혼자서만 진행할 수 있고 중간에 길드를 탈퇴하거나\r\n추방되면 던전 포인트를 획득 할 수 없습니다. 또한, 길드에서 탈퇴하거나 추방당하면 해당 길드의 총 포인트에서 차감되니 주의하시길 바랍니다.");
    } else if(St == 8) {
        cm.sendNextPrev("조사는 제한 없이 진행할 수 있습니다. 단, 지하 수로의 불길한 기운으로 인해 입장 시 모든 버프 효과가 해제되므로 신중하게 결정하시길 바랍니다.");
    } else if(St == 9) {
        cm.sendNextPrev("제단으로 향하는 통로에서는 잠시 동안 버프 스킬과 소비 아이템을 사용할 수 있으니 이후 올 시련에 대비하실 수 있습니다.\r\n단, 일정 시간 내 제단으로 입장하지 못하면 지하 수로에서 퇴장하게 되니 주의하십시오.");
    } else if(St == 10) {
        cm.sendNextPrev("수로의 가장 깊은 곳에 자리한 불길한 기운의 제단에서 숨죽인 채 때를 기다리던 존재가 곧 깨어날 겁니다. 바로\r\n\r\n"
        +"#r샤레니안의 악마, 아르카누스#k\r\n\r\n"
        +"입니다.");
    } else if(St == 11) {
        cm.sendNextPrev("그는 불명의 존재... 공격을 받을수록 점점 더 강한 존재가 되어 태어나니 조심해야 합니다. 가장 강력한 상태로 재탄생되면 아무리 강한 공격을 받더라도 그는 결코 쓰러지는 모습을"
        +"보이지 않을 것이니 주의를 기울이는 것이 좋습니다.\r\n또한 아르카누스의 공격에 의해 사망한다면 곧바로 제단 밖으로 이동되니 주의하시길 바랍니다.");
    } else if(St == 12) {
        cm.sendNextPrev("지하 수로의 존재들에게 입힌 피해에 비례해 던전 포인트를 얻을 수 있고 월요일 0시마다 목표 달성에 따라 길드 본부에서 포상으로 노블레스 SP를 지급하니 힘내서 도전해보십시오."
        +"다만 길드의 총 던전 포인트가 일정 점수 이상이 되어야 받을 수 있을 겁니다.");
    } else if(St == 13) {
        cm.sendNextPrev("또, 포인트 순위에 따라 추가로 노블레스 SP를 얻을 수도 있고 지하 수로에서 퇴장하고 일정 시간이 지나야 던전 포인트가 정산되니 참고하십시오.\r\n"
        +"#r각 길드원의 던전 포인트 합산에 일정 시간에 소요되어 랭킹에 모두 반영 되기까지 어느정도 시간이 필요하오니 포인트가 적게 기록되어도 당황하지 말고 잠시 후 다시 확인해 보십시오.#k");
    } else if(St == 14) {
        var msg ="#b#e1위 : 40개의 SP\r\n";
        msg+="2위 : 38개의 SP\r\n";
        msg+="3위 : 36개의 SP\r\n";
        msg+="4위 ~ 5위 : 34개의 SP\r\n";
        msg+="6위 ~ 10위 : 32개의 SP\r\n";
        // msg+="상위 5% : 29개의 SP\r\n";
        // msg+="상위 10% : 27개의 SP\r\n";
        // msg+="상위 15% : 25개의 SP\r\n";
        // msg+="상위 20% : 23개의 SP\r\n";
        // msg+="상위 25% : 21개의 SP\r\n";
        // msg+="상위 30% : 19개의 SP\r\n";
        // msg+="상위 40% : 17개의 SP\r\n";
        // msg+="상위 60% : 15개의 SP\r\n";
        // msg+="상위 80% : 13개의 SP\r\n";
        msg+="500포인트 이상 : 10개의 SP\r\n\r\n";
        msg+="#r※ 단, 500포인트 이상 획득하지 못하면 순위 안에 들었더라도 보상을 받을 수 없습니다.\r\n";
        cm.sendNextPrev(msg);
    } else if(St == 15) {
        cm.sendPrev("제가 함께 수로 속으로 갈 테니 길을 잃을 염려는 하지 않으셔도 됩니다. 어서 도전하시지요.");
    } else if(St == 16) {
        cm.dispose();
	}
}

function nextMsg() {
    var tick = 0;
    schedule = EtcTimer.getInstance().register(function () {
    if(tick == 2){
        cm.getPlayer().getClient().getSession().writeAndFlush(SLFCGPacket.OnYellowDlg(2012041, 2500, "#r샤레니안의 악마#k와의 결전을 위해 정비하세요", ""));
        schedule.cancel(true);
    }
        tick++;
    }, 1000);
}

