package net.swordie.ms.jaycustom;

import net.swordie.ms.client.character.items.Equip;
import net.swordie.ms.enums.ItemGrade;
import net.swordie.ms.constants.ItemConstants; // Import ใหม่
import java.util.Random;
import java.util.Arrays;

public class JayPotentialHandler {

    private static final Random rand = new Random();
    private static final boolean SHOW_LOG = false;

    // ============== [ส่วนตั้งค่า 1] : แถวบน (Main) - สุ่มแบบปกติ ==============
    private static final int PROB_0_LINE = 25;
    private static final int PROB_1_LINE = 25;
    private static final int PROB_2_LINES = 25;
    private static final int PROB_3_LINES = 25;

    private static final int RATE_LEGENDARY = 25;
    private static final int RATE_UNIQUE = 25;
    private static final int RATE_EPIC = 25;
    private static final int RATE_RARE = 25;

    // ============== [ส่วนตั้งค่า 2] : แถวล่าง (Bonus) - CUSTOM POOL ==============
    private static final int[] BONUS_LEGENDARY_IDS = {
            40041, 40042, 40043, 40044, 40045, 40051, 40052, 40601, 40602, 40603, 40292, 40056, 40055, 40556,
            30041, 30042, 30043, 30044, 30051, 30052, 40070, 40086, 40091
    };

    private static final int[] BONUS_UNIQUE_IDS = {
            30041, 30042, 30043, 30044, 30045, 30051, 30052,
            20041, 20042, 20043, 20044, 20051, 20052, 30070, 30086, 30091
    };

    private static final int[] BONUS_EPIC_IDS = {
            20041, 20042, 20043, 20044, 20045, 20051, 20052,
            10041, 10042, 10043, 10044, 10051, 10052, 20070, 20086
    };

    private static final int[] BONUS_RARE_IDS = {
            10041, 10042, 10043, 10044, 10001, 10002, 10003, 10004, 10006, 10007, 10070, 10086
    };

    // ============== [ส่วนตั้งค่า 3] : BLACKLIST (ห้ามมี Potential) ==============
    // ใส่รหัสไอเทมที่ต้องการยกเว้นที่นี่ (เช่น แหวน Event, ของ Cash)
    private static final int[] BLACKLIST_POTENTIAL_IDS = {
            1112000, // Example Ring
            // เพิ่ม ID ต่อได้เลย...
    };

    // =================================================================================
    // [ ส่วนตั้งค่า: โอกาสการติดออฟชั่นแถวล่าง (Bonus Potential) ]
    // =================================================================================
    private static final int BONUS_POT_CHANCE = 50;

    private static final int BONUS_PROB_1_LINE = 40;
    private static final int BONUS_PROB_2_LINES = 35;
    private static final int BONUS_PROB_3_LINES = 25;

    private static final int BONUS_RATE_LEGENDARY = 25;
    private static final int BONUS_RATE_UNIQUE = 25;
    private static final int BONUS_RATE_EPIC = 25;
    private static final int BONUS_RATE_RARE = 25;

    // ============== [เมธอดหลัก: คำนวณออฟชั่น] ==============

    public static void apply(Equip equip, boolean isBoss, int monsterId) {
        if (equip == null)
            return;

        // 1. ตรวจสอบ Blacklist (User Control)
        if (isBlacklisted(equip.getItemId())) {
            if (SHOW_LOG)
                System.out.println("[JayLog] ข้ามการใส่ Poten (Blacklist): " + equip.getItemId());
            return;
        }

        // 2. ตรวจสอบตามกฎของ Server (ItemConstants)
        // เช็คว่าเป็น item ที่มี poten ได้หรือไม่ (ไม่ใช่ Cash, ไม่ใช่ NoPoten, มี
        // Slot)
        if (!ItemConstants.canEquipHavePotential(equip)) {
            return;
        }

        // 3. ตรวจสอบ Custom Logic เดิม (ถ้ามี)
        if (isNaturalDropItem(equip)) {
            return;
        }

        int maxMain = getEquipMaxOptionSlot(equip, false);
        int maxBonus = getEquipMaxOptionSlot(equip, true);

        resetEquipPotential(equip);

        String mainGradeLog = "ไม่มี (ขอบขาว)";
        int mainLinesLog = 0;
        String bonusGradeLog = "ไม่มี";
        int bonusLinesLog = 0;

        // ---------------------------------------------------------
        // [ส่วนที่ 1] แถวบน (Main)
        // ---------------------------------------------------------
        int mainLines = canEquipHaveHiddenOption(equip) ? getMainLineCount() : 0;
        mainLines = Math.min(mainLines, maxMain);
        mainLinesLog = mainLines;

        if (mainLines > 0) {
            ItemGrade mainGrade = getWeightedGrade(RATE_LEGENDARY, RATE_UNIQUE, RATE_EPIC);
            short hiddenVal = (short) mainGrade.getVal();

            equip.setSpecialGrade(hiddenVal);
            equip.setItemState(getItemStateFromHidden(mainGrade));

            for (int i = 0; i < mainLines; i++) {
                equip.setOption(i, -hiddenVal, false);
            }
            mainGradeLog = mainGrade.name().replace("Hidden", "");
        }

        // ---------------------------------------------------------
        // [ส่วนที่ 2] แถวล่าง (Bonus)
        // ---------------------------------------------------------
        if (rand.nextInt(100) < BONUS_POT_CHANCE && canEquipHaveBonusOption(equip)) {

            int bonusLines = getBonusLineCount();
            bonusLines = Math.min(bonusLines, maxBonus);
            bonusLinesLog = bonusLines;

            if (bonusLines > 0) {
                ItemGrade bonusGrade = getWeightedGrade(BONUS_RATE_LEGENDARY, BONUS_RATE_UNIQUE, BONUS_RATE_EPIC);
                short bonusState = (short) getItemStateFromHidden(bonusGrade);

                // รวม ItemState (Main | Bonus)
                equip.setItemState((short) (equip.getItemState() | bonusState));

                int[] pool = getBonusPoolByGrade(bonusGrade);
                for (int i = 0; i < bonusLines; i++) {
                    int customId = getRandomIdFromPool(pool);
                    equip.setOption(i, customId, true);
                }
                bonusGradeLog = bonusGrade.name().replace("Hidden", "");
            }
        }

        // ---------------------------------------------------------
        // [ส่วนที่ 3] แสดงผล Log
        // ---------------------------------------------------------
        if (SHOW_LOG) {
            System.out.println(String.format(
                    "[JayLog] มอนสเตอร์: %d | รหัสไอเทม: %d | ระดับ: %s | แถวบน: %d/%d แถว | แถวล่าง: %d/%d แถว (ระดับ %s)",
                    monsterId, equip.getItemId(), mainGradeLog, mainLinesLog, maxMain, bonusLinesLog, maxBonus,
                    bonusGradeLog));
        }
    }

    // ============== [ฟังก์ชั่นเสริม - Helper Methods] ==============

    // [New Helper] Blacklist Check
    private static boolean isBlacklisted(int itemId) {
        for (int id : BLACKLIST_POTENTIAL_IDS) {
            if (id == itemId)
                return true;
        }
        return false;
    }

    // [New Helper] ฟังก์ชันเช็ค Natural Drop (ปรับปรุงแล้ว)
    // ใช้สำหรับกรองกลุ่มไอเทมกว้างๆ ที่ไม่อยากให้สุ่ม Poten สูตรพิเศษนี้
    private static boolean isNaturalDropItem(Equip equip) {
        // สามารถเพิ่ม logic เพิ่มเติมได้ที่นี่ ถ้าต้องการข้ามกลุ่มไหนเป็นพิเศษ
        return false;
    }

    private static int getEquipMaxOptionSlot(Equip equip, boolean isBonus) {
        return 3;
    }

    private static boolean canEquipHaveHiddenOption(Equip equip) {
        int id = equip.getItemId();
        if (id / 10000 == 114)
            return false;
        return true;
    }

    private static boolean canEquipHaveBonusOption(Equip equip) {
        int id = equip.getItemId();
        if (id / 10000 == 114)
            return false;
        return true;
    }

    private static void resetEquipPotential(Equip equip) {
        equip.setSpecialGrade(0);
        equip.setItemState((short) 0);

        int maxMain = getEquipMaxOptionSlot(equip, false);
        int maxBonus = getEquipMaxOptionSlot(equip, true);

        for (int i = 0; i < maxMain; i++) {
            equip.setOption(i, 0, false);
        }
        for (int i = 0; i < maxBonus; i++) {
            equip.setOption(i, 0, true);
        }
    }

    private static int getMainLineCount() {
        int roll = rand.nextInt(100);
        if (roll < PROB_0_LINE)
            return 0;
        if (roll < (PROB_0_LINE + PROB_1_LINE))
            return 1;
        if (roll < (PROB_0_LINE + PROB_1_LINE + PROB_2_LINES))
            return 2;
        return 3;
    }

    private static int getBonusLineCount() {
        int roll = rand.nextInt(100);
        if (roll < BONUS_PROB_1_LINE)
            return 1;
        if (roll < (BONUS_PROB_1_LINE + BONUS_PROB_2_LINES))
            return 2;
        return 3;
    }

    private static ItemGrade getWeightedGrade(int legRate, int uniRate, int epicRate) {
        int roll = rand.nextInt(100);
        if (roll < legRate)
            return ItemGrade.HiddenLegendary;
        if (roll < (legRate + uniRate))
            return ItemGrade.HiddenUnique;
        if (roll < (legRate + uniRate + epicRate))
            return ItemGrade.HiddenEpic;
        return ItemGrade.HiddenRare;
    }

    private static short getItemStateFromHidden(ItemGrade hidden) {
        switch (hidden) {
            case HiddenLegendary:
                return (short) ItemGrade.Legendary.getVal();
            case HiddenUnique:
                return (short) ItemGrade.Unique.getVal();
            case HiddenEpic:
                return (short) ItemGrade.Epic.getVal();
            default:
                return (short) ItemGrade.Rare.getVal();
        }
    }

    private static int[] getBonusPoolByGrade(ItemGrade grade) {
        if (grade == ItemGrade.HiddenLegendary || grade == ItemGrade.Legendary)
            return BONUS_LEGENDARY_IDS;
        if (grade == ItemGrade.HiddenUnique || grade == ItemGrade.Unique)
            return BONUS_UNIQUE_IDS;
        if (grade == ItemGrade.HiddenEpic || grade == ItemGrade.Epic)
            return BONUS_EPIC_IDS;
        return BONUS_RARE_IDS;
    }

    private static int getRandomIdFromPool(int[] pool) {
        if (pool == null || pool.length == 0)
            return 0;
        return pool[rand.nextInt(pool.length)];
    }
}