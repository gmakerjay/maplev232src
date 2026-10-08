/*
    Discord: CLEAN#6932
    HD 해상도(1.2.65), 로컬 작업(1.2.65 ~ 1.2.100), 스크립트(전 버전), 소스코드(전 버전) 외주 받습니다.
    Created At 2022.02.11
*/

importPackage(Packages.client.inventory);
importPackage(Packages.tools.packet);
importPackage(Packages.handling.world);
importPackage(Packages.constants);

// Const
var BACCARA_OPTION = {
    "BET_ITEM": 4319999, // 배팅 아이템 코드를 입력해주세요.
    "MINIMUM_BET": 1,    // 배팅 최소 수량을 입력해주세요. (MAXIMUM_BET보다 높거나 1보다 작으면 안됩니다.)
    "MAXIMUM_BET": 30000, // 배팅 최대 수량을 입력해주세요. (인벤토리 칸당 소지할 수 있는 최대 개수보다 높으면 안됩니다.)
    "MINIMUM_VALUE": 1,  // 카드에서 나올 수 있는 최수 숫자입니다.
    "MAXIMUM_VALUE": 10, // 카드에서 나올 수 있는 최대 숫자입니다.
    "MAXIMUM_TURN": 2,  // 게임이 진행될 턴 입니다. 큰 수 입력이 가능하긴 하지만 10회를 넘지 않는걸 권장합니다.
    "PLAYER": {
        "NAME": "#fc0xFF0016F2#PLAYER#k",
        "SUBNAME": "PLAYER", 
        "RATE": 2        // PLAYER 배팅 승리시 배당률입니다.
    },
    "BANKER": {
        "NAME": "#fc0xFFF20019#BANKER#k", 
        "SUBNAME": "BANKER", 
        "RATE": 2        // BANKER 배팅 승리시 배당률입니다.
    },
    "TIE": {
        "NAME": "#fc0xFFF27700#TIE#k", 
        "SUBNAME": "TIE", 
        "RATE": 6        // TIE 배팅 승리시 배당률입니다.
    }
};

// Const
var BACCARA_ERROR = {
    "LACK_INVENTORY_SLOT": "인벤토리를 최소 #fc0xFFF20019#{0}#k 칸 이상 비우고 시도해주시기 바랍니다.",
    "LACK_BET_ITEM": "#fc0xFF0016F2##z{0}##k이(가) 없거나 최소 배팅 개수보다 부족합니다.",
    "WRONG_BET_TARGET": "잘못된 배팅 대상입니다.",
    "WRONG_BET_QUANTITY": "잘못된 배팅 개수입니다."
};

var status, baccara, temp;

function start() {
    Object.freeze(BACCARA_OPTION);
    Object.freeze(BACCARA_ERROR);
    status = -1;
    action(1, 0, 0);
}

function action(mode, type, selection) {
    if (mode == -1 || mode == 0) {
        cm.dispose();
        return;
    } else {
        status++;
    }

    var message = "#fs11#";
    switch (status) {
        case 0: {
            message += "#fc0xFFB90ED4#BACCARA#k 게임에 오신걸 환영합니다.\r\n\r\n";
            var arr = [BACCARA_OPTION.PLAYER, BACCARA_OPTION.BANKER, BACCARA_OPTION.TIE];
            for (var i = 0; i < arr.length; i++) {
                message += "#L{0}#{1}에 배팅하겠습니다.\r\n".format(i, arr[i].NAME);
            }
            cm.sendSimple(message);
            break;
        }

        case 1: {
            switch (selection) {
                case 0:
                    temp = BACCARA_OPTION.PLAYER;
                    break;
                case 1:
                    temp = BACCARA_OPTION.BANKER;
                    break;
                case 2:
                    temp = BACCARA_OPTION.TIE;
                    break;
                default:
                    cm.sendOk(message += BACCARA_ERROR.WRONG_BET_TARGET);
                    cm.dispose();
                    return;
            }

            baccara = new Baccara(cm.getPlayer());
            var slot = getMaxRate();
            if (baccara.isInventoryFull(slot)) {
                cm.sendOk(message += BACCARA_ERROR.LACK_INVENTORY_SLOT.format(slot));
                cm.dispose();
                break;
            }

            var quantity = baccara.getPlayerBetItemQuantity();
            if (quantity < BACCARA_OPTION.MINIMUM_BET) {
                cm.sendOk(message + BACCARA_ERROR.LACK_BET_ITEM.format(BACCARA_OPTION.BET_ITEM));
                cm.dispose();
                break;
            }

            var maximum = quantity < BACCARA_OPTION.MAXIMUM_BET ? quantity : BACCARA_OPTION.MAXIMUM_BET;
            message += "#fc0xFF0016F2##z{0}##k을(를) 배팅 하실 수량을 입력해주세요.\r\n게임 진행 중 임의로 #fc0xFFF20019#닫을 시#k 아이템을 돌려받을 수 없습니다.\r\n\r\n"
                .format(BACCARA_OPTION.BET_ITEM);
            message += "#fc0xA04A4849#현재 소지중인 개수: {0}#k".format(quantity.comma());
            cm.sendGetNumber(message, BACCARA_OPTION.MINIMUM_BET, BACCARA_OPTION.MINIMUM_BET, maximum);
            break;
        }

        case 2: {
            var quantity = baccara.getPlayerBetItemQuantity();
            var maximum = quantity < BACCARA_OPTION.MAXIMUM_BET ? quantity : BACCARA_OPTION.MAXIMUM_BET;
            if (!(selection >= BACCARA_OPTION.MINIMUM_BET && selection <= maximum)) {
                cm.sendOk(message += BACCARA_ERROR.WRONG_BET_QUANTITY);
                cm.dispose();
                break;
            }

            baccara.betting(temp, selection);
            cm.sendNext("게임 준비가 완료 되었습니다. \'#fc0xFF0016F2#다음#k\'을 눌러 진행해주세요.");
            break;
        }

        default: {
            if (baccara.getTurn() < BACCARA_OPTION.MAXIMUM_TURN) {
                var card = baccara.nextTurn();
                message += "#e[{0}번째 턴]#n\r\n{1}은(는) {2} {3}은(는) {4}을(를) 얻었습니다.\r\n\r\n"
                    .format(baccara.getTurn(), BACCARA_OPTION.PLAYER.NAME, card.PLAYER, BACCARA_OPTION.BANKER.NAME, card.BANKER);
                message += "#e{0} ({1})#n\r\n카드: {2}\r\n\r\n".format(BACCARA_OPTION.PLAYER.NAME, baccara.getPlayer().getScore(), baccara.getPlayer().getCard()).replaceAll(",", ", ");
                message += "#e{0} ({1})#n\r\n카드: {2}\r\n".format(BACCARA_OPTION.BANKER.NAME, baccara.getBanker().getScore(), baccara.getBanker().getCard()).replaceAll(",", ", ");
                cm.sendNext(message);
                break;
            }
            
            var result = baccara.endGame();
            message += "{0}이(가) 이겼습니다. 플레이어 결과: {1}".format(result.WINNER.NAME, result.RESULTSTR);
            cm.sendOk(message);
            cm.dispose();
            return;
        }
    }
}

// Struct Baccara
function Baccara(character) {
    this.character = character;
    this.inventory = character.getInventory(GameConstants.getInventoryType(BACCARA_OPTION.BET_ITEM));
    
    this.bet = null;
    
    this.card = function() {
        var arr = [];
        for (var i = BACCARA_OPTION.MINIMUM_VALUE; i <= BACCARA_OPTION.MAXIMUM_VALUE; i++) {
            for (var j = 0; j < (BACCARA_OPTION.MAXIMUM_TURN * 2); j++) {
                arr.push(i);
            }
        }
        arr.sort(function() { return Math.random() - Math.random(); });
        return arr;
    }();
    this.player = new Gamer();
    this.banker = new Gamer();
    this.turn = 0;
}

Baccara.prototype.betting = function(target, quantitiy) { 
    this.bet = new Bet(target, quantitiy);
    cm.gainItem(BACCARA_OPTION.BET_ITEM, -quantitiy);
 } 

Baccara.prototype.getPlayerBetItemQuantity = function() { return this.inventory.countById(BACCARA_OPTION.BET_ITEM); };

Baccara.prototype.isInventoryFull = function(cap) {return this.inventory.isFull(cap); };

Baccara.prototype.nextTurn = function() {
    this.player.sum(this.card.splice(0, 1)[0]);
    this.banker.sum(this.card.splice(0, 1)[0]);
    this.turn++;
    return {"PLAYER": this.player.getCard()[this.player.getCard().length - 1], "BANKER": this.banker.getCard()[this.banker.getCard().length - 1]};
};

Baccara.prototype.endGame = function() {
    var winner = BACCARA_OPTION.PLAYER;

    var pScore = this.player.getScore();
    var bScore = this.banker.getScore();
    if (pScore == bScore) {
        winner = BACCARA_OPTION.TIE;
    } else if (pScore < bScore) {
        winner = BACCARA_OPTION.BANKER; 
    }

    var broadcast;
    var target = this.bet.getTarget();
    if (target == winner) {
        var quantity = this.bet.getRewardQuantity();
        broadcast = "[바카라] ({0}): {1}님께서 {2}로 {3}하였습니다. (+{4})"
            .format(winner.SUBNAME, this.character.getName(), target.SUBNAME, "승리", quantity.comma());
        cm.gainItem(BACCARA_OPTION.BET_ITEM, quantity);
        World.Broadcast.broadcastMessage(CField.getGameMessage(9, broadcast));
        return {"WINNER": winner, "RESULTSTR": "승리", "QUANTITY": quantity};
    } else if (winner == BACCARA_OPTION.TIE) {
        broadcast = "[바카라] ({0}): {1}님께서 {2}로 {3}하였습니다."
            .format(winner.SUBNAME, this.character.getName(), target.SUBNAME, "무승부");
        World.Broadcast.broadcastMessage(CField.getGameMessage(9, broadcast));
        cm.gainItem(BACCARA_OPTION.BET_ITEM, this.bet.getQuantity());
        return {"WINNER": winner, "RESULTSTR": "무승부", "QUANTITY": 0};
    }
    broadcast = "[바카라] ({0}): {1}님께서 {2}로 {3}하였습니다. (-{4})"
            .format(winner.SUBNAME, this.character.getName(), target.SUBNAME, "패배", this.bet.getQuantity().comma());
    World.Broadcast.broadcastMessage(CField.getGameMessage(9, broadcast));
    return {"WINNER": winner, "RESULTSTR": "패배", "QUANTITY": this.bet.getQuantity()};
};

Baccara.prototype.getBet = function() { return this.bet; };

Baccara.prototype.getPlayer = function() { return this.player; };

Baccara.prototype.getBanker = function() { return this.banker; };

Baccara.prototype.getTurn = function() { return this.turn; };

// Struct Bet
function Bet(target, quantity) {
    this.target = target;
    this.quantitiy = quantity;
}

Bet.prototype.getRewardQuantity = function(character) { return this.quantitiy * this.target.RATE; };

Bet.prototype.getTarget = function() { return this.target };

Bet.prototype.getQuantity = function() { return this.quantitiy };

// Struct Gamer
function Gamer() {
    this.card = [];
    this.score = 0;
}

Gamer.prototype.sum = function(value) {
    this.card.push(value);
    this.score = (this.score + parseInt(value)) % 10;
};

Gamer.prototype.getCard = function() { return this.card; };

Gamer.prototype.getScore = function() { return this.score; };

// Utilities
Number.prototype.comma = function() {
    return this.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};

String.prototype.format = function() {
    var formatted = this;
    for( var arg in arguments ) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
};

function getMaxRate() {
    var arr = [BACCARA_OPTION.PLAYER.RATE, BACCARA_OPTION.BANKER.RATE, BACCARA_OPTION.TIE.RATE];
    arr.sort(function(a, b) { return b - a; });
    return arr[0];
}