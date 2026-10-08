var status = -1;
var txt1, txt2, txt3, txt4, price;
var name
var code;

importPackage(Packages.server);
importPackage(java.util);
importPackage(java.lang);
importPackage(java.sql);
importPackage(java.util);
importPackage(java.lang);
importPackage(java.io);
importPackage(java.awt)
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
	
	cm.sendGetText("초기화 전 지급을 담당하는 엔피시 입니다.\r\n #r이전 닉네임#k을 적어주세요");
    } else if (status == 1) {
	 name = cm.getText();
	 chrs = cm.getClient().getChannelServer().getPlayerStorage().getCharacterByName(name);
	switch(name) {
			case "연지":
			point = 320000;
			code = ""+ name + "8948941";
			break;
			
			case "악질":
			point = 170000;
			code = ""+ name + "12132135";
			break;
			
			case "삐약":
			point = 80000;
			code = ""+ name + "452784277";
			break;
			case "첼시":
			point = 70000;
			code = ""+ name + "165154287261";
			break;
			case "머겅":
			point = 120000;
			code = ""+ name + "165154287261";
			break;
			case "금태양":
			point = 80000;
			code = ""+ name + "165154287261";
			break;
			case "도리토수":
			point = 50000;
			code = ""+ name + "1651612354";
			break;
			case "탱구":
			point = 50000;
			code = ""+ name + "165154287261";
			break;
			case "애기":
			point = 50000;
			code = ""+ name + "165154287261";
			break;
			case "썬더":
			point = 170000;
			code = ""+ name + "165154287261";
			break;
			case "우꼬삼":
			point = 50000;
			code = ""+ name + "165154287261";
			break;
			case "아대":
			point = 100000;
			code = ""+ name + "165154287261";
			break;

			case "올텟":
			point = 50000;
			code = ""+ name + "165154287261";
			break;
			case "캐리":
			point = 80000;
			code = ""+ name + "165154287261";
			break;
			case "보우마스터":
			point = 80000;
			code = ""+ name + "165154287261";
			break;
			case "헬린이":
			point = 80000;
			code = ""+ name + "165154287261";
			break;
			case "한라":
			point = 50000;
			code = "mkd901emd";
			break;

			default:
				point = -1
				code = "";
				break;
	}

	if(point > 1) {
		cm.sendGetText(""+ name + "님 이시군요 관리자에게 지급받은 코드를 입력해주세요.");
		} else {
			cm.sendOk("대상이 아닙니다. 혹은 아직 정보가 입력되지 않았습니다.");
			cm.dispose();
		}
    } else if (status == 2) {
		code2 = cm.getText();
		if(cm.getPlayer().getClient().getKeyValue("RESETRE") != null) {
			cm.sendOk("이미 보상을 받으셨습니다.");
			cm.dispose();
		}
		if(code2 == code) {
		cm.getPlayer().setKeyValue(14434, "point", cm.getPlayer().getKeyValue(14434, "point")+ point);
		cm.sendOk("이전 닉네임인 #b"+ name +"#k 캐릭터를 확인했습니다. "+ point +" 포인트 지급이 완료되었습니다.");
		cm.getPlayer().getClient().setKeyValue("RESETRE", "1");
		a = new Date();
		 fFile1 = new File("Log/RESETRE.log");
            if (!fFile1.exists()) {
                fFile1.createNewFile();
            }
        out1 = new FileOutputStream("Log/RESETRE.log", true);
        var msg = "캐릭터 : " + cm.getPlayer().getName() + "\r\n";
		msg += "사용 이름 및 코드 : " + name + ""+ code+"\r\n";
        msg += "사용 시각 : "+a.getFullYear()+"년 "+Number(a.getMonth() + 1)+"월 "+a.getDate()+"일 "+a.getHours()+"시 "+a.getMinutes()+"분 "+a.getSeconds()+"초\r\n";
        out1.write(msg.getBytes());
        out1.close();
		cm.dispose();

		} else {
			cm.sendOk("맞지 않는 코드입니다.");
			cm.dispose();
		}

    } else if (status == 3) {
	txt3 = selection;
	cm.sendGetNumber("네번째 코드 입력.", 1, 100000, 999999);
    } else if (status == 4) {
	txt4 = selection;
	cm.sendGetNumber("쿠폰 가격 입력", 10000, 10000, 500000);
    } else if (status == 5) {
	price = selection;
	cm.sendSimple("상태 입력 : #L1#사용 가능 #L2#사용 불가능");
    } else if (status == 6) {
	couponid = txt1 + "-" + txt2 + "-" + txt3 + "-" + txt4;
	if (cm.CouponCharId(selection, couponid) == -1) {
		cm.sendOk("error");
	} else {
		cm.setCouponType(selection, couponid);
		if (selection == 1) {
			chr = Packages.handling.world.World.getChar(cm.CouponCharId(selection, couponid));
			if (chr != null) {
				if (price < 30000) {
					count = price / 10000;
				} else if (price < 50000) {
					count = price >= 40000 ? 7 : 5;
				} else {
					count = price / 5000;
				}
				chr.setKeyValue(5304, "2435718", count);
				chr.dropMessage(-1, "후원 아이템이 지급되었습니다.");
			} else {
				cm.updateKeyValue(cm.CouponCharId(selection, couponid), 5304, "2435718=" + count + ";");
			}
		}
		cm.sendOk("ok");
	}
	cm.dispose();
    }
}