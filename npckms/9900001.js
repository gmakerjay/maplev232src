importPackage(java.lang);
var enter = "\r\n";

function start() {
    status = -1;
    action(1, 0, 0);
}
function action(mode, type, selection) {
    if (mode == 1) {
        status++;
    } else {
        cm.dispose();
        return;
    }
    if (status == 0) {
        if (!cm.getPlayer().isGM()) {
            cm.sendOk("님아즐~");
            cm.dispose();
            return;
        }
        var t = "강화할 아이템 종류를 선택해주세요." + enter + enter;
        t += "#L1#장비#l" + enter;
        t += "#L6#치장#l";
        cm.sendNext(t);
    } else if (status == 1) {
        types = selection;
        var t = "강화할 아이템을 선택해주세요" + enter;
        for (i = 0; i < cm.getInventory(types).getSlotLimit(); i++) {
            var item = cm.getInventory(types).getItem(i);
            if (item != null) {
                t += "#L" + i + "# #i" + item.getItemId() + "# #z" + item.getItemId() + "#" + enter;
            }
        }
        cm.sendNext(t);
    } else if (status == 2) {
        sel = selection;
        var item = cm.getInventory(types).getItem(sel);
        var t = "#i" + item.getItemId() + "# 무슨 옵션으로 강화할까요?" + enter + enter;
        t += "#L0#크크크/크크크#l" + enter;
        t += "#L3#쿨감2초#l" + enter;
        t += "#L4#메획 6줄" + enter;
        t += "#L5#아획 6줄#l" + enter;
        t += "#L1#데미지100퍼 보공100퍼 방무100퍼#l" + enter;
        t += "#L2#데미지125퍼 보공250퍼 방무250퍼#l";
        cm.sendNext(t);
    } else if (status == 3) {
        what = selection;
        var item = cm.getInventory(types).getItem(sel);
		if (types == 6) {
			item.setReqLevel(100);
		}
        if (what == 0) {
			item.setState(20);
			item.setPotential1(40056);
			item.setPotential2(40056);
			item.setPotential3(40056);
			item.setPotential4(40056);
			item.setPotential5(40056);
			item.setPotential6(40056);
		}
        else if (what == 3) {
			item.setState(20);
			item.setPotential1(40557);
			item.setPotential2(40557);
			item.setPotential3(40557);
			item.setPotential4(40557);
			item.setPotential5(40557);
			item.setPotential6(40557);
        }   
        else if (what == 5) {
            item.setState(20);
            item.setPotential1(40656);
            item.setPotential2(40656);
            item.setPotential3(40656);
            item.setPotential4(40656);
            item.setPotential5(40656);
            item.setPotential6(40656);
        }    
        else if (what == 4) {
            item.setState(20);
            item.setPotential1(40650);
            item.setPotential2(40650);
            item.setPotential3(40650);
            item.setPotential4(40650);
            item.setPotential5(40650);
            item.setPotential6(40650);
		}
        else if (what == 1) {
			item.setTotalDamage(100);
			item.setBossDamage(100);
			item.setIgnorePDR(100);
		}
        else if (what == 2) {
			var intt = 250;
			item.setTotalDamage(125);
			item.setBossDamage(intt);
			item.setIgnorePDR(intt);
		}
        if (types == 1) {
            cm.getPlayer().forceReAddItem(item, Packages.client.inventory.MapleInventoryType.EQUIP);
        } else if (types == 6) {
            cm.getPlayer().forceReAddItem(item, Packages.client.inventory.MapleInventoryType.DECORATION);
        }
        var t = "강화 완료";
        cm.sendNext(t);
        cm.dispose();
    }
}