var enter = "\r\n";
var seld = -1;

var reward = [
    {
        'lvl': 265, 'ap': 350, 'item': [
		{'itemid' : 1712001, 'qty' : 1},
		{'itemid' : 1712002, 'qty' : 1},
		{'itemid' : 1712003, 'qty' : 1},
		{'itemid' : 1712004, 'qty' : 1},
		{'itemid' : 1712005, 'qty' : 1},
		{'itemid' : 1712006, 'qty' : 1},
                {'itemid' : 5062500, 'qty' : 60},
                {'itemid' : 5062010, 'qty' : 150},
        ]
    },
    {
        'lvl': 270, 'ap': 351, 'item': [
		{'itemid' : 2435719, 'qty' : 100},
                {'itemid' : 5062500, 'qty' : 200},
                {'itemid' : 5062010, 'qty' : 400},
                {'itemid' : 4310237, 'qty' : 300},
        ]
    },
    {
        'lvl': 275, 'ap': 370, 'item': [
		{'itemid' : 2450064, 'qty' : 2},
                {'itemid' : 2437760, 'qty' : 10},
                {'itemid' : 2435719, 'qty' : 100},
                {'itemid' : 2431940, 'qty' : 2},
        ]
    },
    {
        'lvl': 280, 'ap': 370, 'item': [
                {'itemid' : 4001716, 'qty' : 1},
                {'itemid' : 2437760, 'qty' : 10},
                {'itemid' : 2049360, 'qty' : 3},
                {'itemid' : 4310266, 'qty' : 500},
                {'itemid' : 4310237, 'qty' : 2000},
        ]
    },
    {
        'lvl': 285, 'ap': 370, 'item': [
		{'itemid' : 4310266, 'qty' : 500},
              	{'itemid' : 2048717, 'qty' : 200},
                {'itemid' : 2450064, 'qty' : 5},
                {'itemid' : 2023072, 'qty' : 3},
                {'itemid' : 2430042, 'qty' : 2},
        ]
    },
    {
        'lvl': 290, 'ap': 370, 'item': [
		{'itemid' : 2048753, 'qty' : 20},
		{'itemid' : 2633336, 'qty' : 10},
		{'itemid' : 4001716, 'qty' : 5},
        ]
    },
    {
        'lvl': 295, 'ap': 370, 'item': [
                {'itemid' : 2430889, 'qty' : 1},
                {'itemid' : 5062005, 'qty' : 4},
                {'itemid' : 4001716, 'qty' : 15},
        ]
    },
    {
        'lvl': 300, 'ap': 370, 'item': [
                {'itemid' : 5062005, 'qty' : 5},
                {'itemid' : 5062503, 'qty' : 5},
                {'itemid' : 4001716, 'qty' : 20},

        ]
    }
];

function start() {
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, sel) {
    if (mode == -1) {
        cm.dispose();
    }
    if (mode == 0) {
        cm.dispose();
        return;
    }
    if (mode == 1) {
        status++;
    }
    if (status == 0) {
        var msg = "#fs15# #r※ 주의 ※\r\n\r\n 레벨 보상은 계정당 1번만 받으실 수 있습니다.#k" + enter + enter + enter;
        msg += "#fs11# #d수령 가능한 레벨 보상은 아래와 같습니다.#k" + enter;

        for (var i = 0; i < reward.length; i++) {
            if (cm.getPlayer().getLevel() >= reward[i]['lvl']) {
                if (cm.getClient().getKeyValue("Level Reward " + reward[i]['lvl']) != 1) {
                    msg += "#L" + i + "##b" + reward[i]['lvl'] + "레벨 보상 (수령 가능)#k" + enter;
                } else {
                    msg += "#L" + i + "##b" + reward[i]['lvl'] + "레벨 보상 - " + (cm.getPlayer().getKeyValue(1234567, "Level Reward " + reward[i]['lvl']) == -1 ? "타 캐릭터 수령" : "직접 수령") + "(수령 완료)#k" + enter;
                }
            } else {
                msg += "#L" + i + "##r" + reward[i]['lvl'] + "레벨 보상 (수령 불가)#k" + enter;
            }
        }

        cm.sendSimple(msg);
    } else if (status == 1) {
        if (cm.getClient().getKeyValue("Level Reward " + reward[sel]['lvl']) == 1) {
            cm.sendOk("#fs11##r이미 수령한 보상 입니다.");
            cm.dispose();
            return;
        }

        if (reward[sel]['lvl'] > cm.getPlayer().getLevel()) {
            cm.sendOk("#fs11##r수령이 불가능한 보상 입니다.");
            cm.dispose();
            return;
        }

        cm.getClient().setKeyValue("Level Reward " + reward[sel]['lvl'], 1 + "");
        cm.getPlayer().setKeyValue(1234567, "Level Reward " + reward[sel]['lvl'], 1 + "");

        gainReward(sel);

        cm.sendOk("#fs11##r보상 지급이 완료되었습니다.");
        cm.dispose();
    }
}

function gainReward(sel) {
    for (var p = 0; p < reward[sel]['item'].length; p++) {
        cm.gainItem(reward[sel]['item'][p]['itemid'], reward[sel]['item'][p]['qty']);
    }
}