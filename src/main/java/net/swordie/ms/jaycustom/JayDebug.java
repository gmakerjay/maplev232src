package net.swordie.ms.jaycustom;

import net.swordie.ms.life.mob.Mob;
import net.swordie.ms.life.drop.DropInfo;
import net.swordie.ms.client.character.Char;
import net.swordie.ms.client.character.items.Item;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Jay's Custom Debug Logger
 * เปิด/ปิด Debug ตามหมวดได้อิสระ
 * 
 * วิธีใช้:
 * JayDebug.mob("message");
 * JayDebug.drop("message");
 * JayDebug.mobInfo(mob);
 */
public class JayDebug {
    private static final Logger log = LogManager.getLogger(JayDebug.class);

    // ==========================================
    // MASTER SWITCH - ปิดอันนี้ = ปิดทั้งหมด
    // ==========================================
    public static final boolean ENABLED = true;

    // ==========================================
    // CATEGORY SWITCHES - เปิด/ปิดตามหมวด
    // ==========================================
    public static final boolean DEBUG_MOB = true;
    public static final boolean DEBUG_DROP = true;
    public static final boolean DEBUG_ITEM = false;
    public static final boolean DEBUG_SKILL = false;
    public static final boolean DEBUG_PACKET = false;
    public static final boolean DEBUG_FIELD = false;
    public static final boolean DEBUG_QUEST = false;
    public static final boolean DEBUG_CHAR = false;

    // ==========================================
    // BASIC LOG METHODS
    // ==========================================

    /**
     * Log ทั่วไป
     */
    public static void log(String msg) {
        if (ENABLED) {
            log.info("[JayDebug] {}", msg);
        }
    }

    /**
     * Log พร้อมระบุหมวด
     */
    public static void log(String category, String msg) {
        if (ENABLED) {
            log.info("[JayDebug][{}] {}", category, msg);
        }
    }

    /**
     * Log พร้อม format
     */
    public static void log(String format, Object... args) {
        if (ENABLED) {
            log.info("[JayDebug] " + String.format(format, args));
        }
    }

    // ==========================================
    // CATEGORY LOG METHODS
    // ==========================================

    public static void mob(String msg) {
        if (ENABLED && DEBUG_MOB) {
            log.info("[JayDebug][MOB] {}", msg);
        }
    }

    public static void drop(String msg) {
        if (ENABLED && DEBUG_DROP) {
            log.info("[JayDebug][DROP] {}", msg);
        }
    }

    public static void item(String msg) {
        if (ENABLED && DEBUG_ITEM) {
            log.info("[JayDebug][ITEM] {}", msg);
        }
    }

    public static void skill(String msg) {
        if (ENABLED && DEBUG_SKILL) {
            log.info("[JayDebug][SKILL] {}", msg);
        }
    }

    public static void packet(String msg) {
        if (ENABLED && DEBUG_PACKET) {
            log.info("[JayDebug][PACKET] {}", msg);
        }
    }

    public static void field(String msg) {
        if (ENABLED && DEBUG_FIELD) {
            log.info("[JayDebug][FIELD] {}", msg);
        }
    }

    public static void quest(String msg) {
        if (ENABLED && DEBUG_QUEST) {
            log.info("[JayDebug][QUEST] {}", msg);
        }
    }

    public static void chr(String msg) {
        if (ENABLED && DEBUG_CHAR) {
            log.info("[JayDebug][CHAR] {}", msg);
        }
    }

    // ==========================================
    // FORMATTED INFO METHODS
    // ==========================================

    /**
     * แสดงข้อมูล Mob แบบละเอียด
     */
    public static void mobInfo(Mob mob) {
        if (!ENABLED || !DEBUG_MOB || mob == null)
            return;

        log.info("[JayDebug][MOB] =============================");
        log.info("[JayDebug][MOB] Template ID: {}", mob.getTemplateId());
        log.info("[JayDebug][MOB] Level: {}", mob.getLevel());
        log.info("[JayDebug][MOB] HP: {} / {}", mob.getHp(), mob.getMaxHp());
        log.info("[JayDebug][MOB] Is Boss: {}", mob.isBoss());
        log.info("[JayDebug][MOB] Position: {}", mob.getPosition());
        log.info("[JayDebug][MOB] =============================");
    }

    /**
     * แสดงข้อมูล DropInfo
     */
    public static void dropInfo(DropInfo drop) {
        if (!ENABLED || !DEBUG_DROP || drop == null)
            return;

        double percent = drop.getChance() / 10000.0;
        log.info("[JayDebug][DROP] Item: {} | Chance: {} ({:.2f}%)",
                drop.getItemID(),
                drop.getChance(),
                percent);
    }

    /**
     * แสดงข้อมูล Char
     */
    public static void charInfo(Char chr) {
        if (!ENABLED || !DEBUG_CHAR || chr == null)
            return;

        log.info("[JayDebug][CHAR] =============================");
        log.info("[JayDebug][CHAR] Name: {}", chr.getName());
        log.info("[JayDebug][CHAR] Level: {}", chr.getLevel());
        log.info("[JayDebug][CHAR] Job: {}", chr.getJob());
        log.info("[JayDebug][CHAR] Map: {}", chr.getFieldID());
        log.info("[JayDebug][CHAR] =============================");
    }

    /**
     * แสดงข้อมูล Item
     */
    public static void itemInfo(Item item) {
        if (!ENABLED || !DEBUG_ITEM || item == null)
            return;

        log.info("[JayDebug][ITEM] ID: {} | Qty: {} | Type: {}",
                item.getItemId(),
                item.getQuantity(),
                item.getInvType());
    }

    // ==========================================
    // UTILITY METHODS
    // ==========================================

    /**
     * แสดง separator line
     */
    public static void separator() {
        if (ENABLED) {
            log.info("[JayDebug] ===============================================");
        }
    }

    /**
     * แสดง separator พร้อม title
     */
    public static void separator(String title) {
        if (ENABLED) {
            log.info("[JayDebug] ============= {} =============", title);
        }
    }

    /**
     * แสดง method entry
     */
    public static void enter(String methodName) {
        if (ENABLED) {
            log.info("[JayDebug] >>> ENTER: {}()", methodName);
        }
    }

    /**
     * แสดง method exit
     */
    public static void exit(String methodName) {
        if (ENABLED) {
            log.info("[JayDebug] <<< EXIT: {}()", methodName);
        }
    }

    /**
     * แสดง method entry พร้อม parameter
     */
    public static void enter(String methodName, Object... params) {
        if (ENABLED) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < params.length; i++) {
                if (i > 0)
                    sb.append(", ");
                sb.append(params[i]);
            }
            log.info("[JayDebug] >>> ENTER: {}({})", methodName, sb.toString());
        }
    }
}
