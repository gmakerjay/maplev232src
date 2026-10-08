package net.swordie.ms.jaycustom;

import net.swordie.ms.life.drop.DropInfo;
import net.swordie.ms.life.mob.Mob;
import net.swordie.ms.client.character.Char;
import net.swordie.ms.util.Util;
import net.swordie.orm.dao.DropInfoDao;

import net.swordie.ms.client.character.items.Equip;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors; // Restored
import net.swordie.ms.loaders.ItemData;
import net.swordie.ms.loaders.containerclasses.EquipItemInfo;
import net.swordie.ms.constants.JobConstants;
import net.swordie.ms.constants.ItemConstants;

public class JayCustomDrop {

    private static final Logger log = LogManager.getLogger(JayCustomDrop.class);

    // [ CONFIG ]
    private static final boolean ENABLE_LOG_LOAD = true;
    private static final boolean ENABLE_LOG_GENERAL = false;
    private static final boolean ENABLE_LOG_BOSS = false;
    private static final boolean ENABLE_JOB_FILTER = true; // เปิด/ปิด ระบบกรองอาชีพ

    // ตัวคูณประเภท (Multiplier) - ระบบเอกเทศ ไม่ขึ้นกับ Drop Rate ของเซิฟเวอร์
    // ปรับค่าเหล่านี้เพื่อควบคุม drop rate ของ Lane -2 ถึง -20
    private static final double MULTIPLIER_MAIN_EQUIP = 1.0;
    private static final double MULTIPLIER_ACCESSORY = 1.0;
    private static final double MULTIPLIER_ETC = 5.0;

    // จำกัดจำนวนชิ้นสูงสุดต่อมอนสเตอร์
    private static final int MAIN_EQUIP_MAX = 1;
    private static final int ACCESSORY_MAX = 1;
    private static final int ETC_MAX = 3;

    private static final int FINAL_DROP_MIN = 0;
    private static final int FINAL_DROP_MAX = 5;

    private static final Map<Integer, Set<DropInfo>> customDropMap = new ConcurrentHashMap<>();
    private static final Map<DropInfo, Integer> baseChanceMap = new ConcurrentHashMap<>();

    private static boolean loaded = false;

    // ===========================================================================
    // [ LOAD ]
    // ===========================================================================
    public static void load() {
        try {
            DropInfoDao dao = new DropInfoDao();
            Map<Integer, Set<DropInfo>> tempMap = new HashMap<>();
            int totalItems = 0;

            if (ENABLE_LOG_LOAD)
                log.info("=== [JayCustomDrop] Loading Lanes -2 to -30 ===");

            for (int i = 2; i <= 30; i++) {
                int laneId = -i;
                Collection<DropInfo> drops = dao.byMobId(laneId);
                if (drops != null && !drops.isEmpty()) {
                    tempMap.put(laneId, new HashSet<>(drops));
                    for (DropInfo di : drops) {
                        // บันทึกค่า Chance ดั้งเดิมจาก DB โดยผูกกับ Object DropInfo โดยตรง
                        baseChanceMap.put(di, di.getChance());
                        totalItems++;
                    }
                }
            }
            customDropMap.clear();
            customDropMap.putAll(tempMap);
            loaded = true;
            if (ENABLE_LOG_LOAD)
                log.info("=== [JayCustomDrop] Load Complete (Total: {}) ===", totalItems);
        } catch (Exception e) {
            log.error("[JayCustomDrop] Load Error", e);
        }
    }

    // ===========================================================================
    // [ MAIN LOGIC ]
    // ===========================================================================
    public static Set<DropInfo> getDrops(Mob mob, Char chr) {
        if (!loaded)
            load();
        Set<DropInfo> rolled = new HashSet<>();
        int lv = mob.getForcedMobStat().getLevel();

        // ระบบเอกเทศ: ไม่ใช้ Drop Rate จากตัวละครหรือเซิฟเวอร์
        List<Integer> activeLanes = getEligibleLanes(lv);

        if (ENABLE_LOG_GENERAL) {
            log.info("[JayCustomDrop] Mob: {} (Lv.{}) | Lanes: {} | Independent System",
                    mob.getTemplateId(), lv, activeLanes);
        }

        for (int lane : activeLanes)
            rolled.addAll(rollLane(lane, chr)); // ส่ง chr เข้าไป
        if (mob.isBoss())
            rolled.addAll(rollLane(-15, chr));

        return applySmartLimit(rolled, mob.isBoss() ? ENABLE_LOG_BOSS : ENABLE_LOG_GENERAL, mob);
    }

    private static List<DropInfo> rollLane(int laneId, Char chr) {
        Set<DropInfo> pool = customDropMap.get(laneId);
        if (pool == null || pool.isEmpty())
            return Collections.emptyList();

        List<DropInfo> passed = new ArrayList<>();
        for (DropInfo di : pool) {
            // 0. กรองอาชีพ (Job Filter)
            if (ENABLE_JOB_FILTER && !isJobApplicable(chr, di.getItemID())) {
                continue;
            }

            // ดึงค่า Base Chance จาก Map เสมอ (ป้องกันค่าเพี้ยน)
            int baseChance = baseChanceMap.getOrDefault(di, di.getChance());

            boolean isEq = isMainEquip(di.getItemID());
            boolean isAc = isAccessory(di.getItemID());
            boolean isEtc = !isEq && !isAc;

            double mult = isEq ? MULTIPLIER_MAIN_EQUIP : isAc ? MULTIPLIER_ACCESSORY : MULTIPLIER_ETC;

            // สูตรคำนวณ Chance สุทธิ (เอกเทศ - ใช้เฉพาะ multiplier)
            long finalChance = (long) (baseChance * mult);
            finalChance = Math.min(finalChance, 1_000_000); // ห้ามเกิน 100%

            if (Util.succeedProp((int) finalChance, 1_000_000)) {
                // สร้าง Object ใหม่ (Clone) ทุกครั้งที่สุ่มติด
                DropInfo copy = new DropInfo();
                copy.setItemID(di.getItemID());
                copy.setChance(baseChance); // เก็บค่า Base ไว้เช็คความหายากตอน Sort
                copy.setMinQuant(di.getMinQuant());
                copy.setMaxQuant(di.getMaxQuant());

                passed.add(copy);
                if (ENABLE_LOG_GENERAL) {
                    log.info("   -> ผ่าน (Lane {}): รหัส {} | DB Chance: {} | Multiplier: x{} | Final: {}",
                            laneId, di.getItemID(), baseChance, mult, finalChance);
                }
            }
        }
        return passed;
    }

    private static Set<DropInfo> applySmartLimit(Set<DropInfo> rolled, boolean logEnabled, Mob mob) {
        // แยกกลุ่ม
        List<DropInfo> equips = filterByType(rolled, 1);
        List<DropInfo> accs = filterByType(rolled, 2);
        List<DropInfo> etcs = filterByType(rolled, 3);

        // ✅ 3. เรียงลำดับตาม Base Chance (มาก -> น้อย) = ของหาง่าย (Common)
        // มีสิทธิ์ถูกเลือกก่อน
        Comparator<DropInfo> sorter = (d1, d2) -> Integer.compare(d2.getChance(), d1.getChance());
        equips.sort(sorter);
        accs.sort(sorter);
        etcs.sort(sorter);

        // หยิบตามโควต้า
        List<DropInfo> candidates = new ArrayList<>();
        addTop(candidates, equips, MAIN_EQUIP_MAX);
        addTop(candidates, accs, ACCESSORY_MAX);
        addTop(candidates, etcs, ETC_MAX);

        // สุ่มจำนวนชิ้นสุดท้าย
        int finalCount = randomRange(FINAL_DROP_MIN, FINAL_DROP_MAX, candidates.size());

        Set<DropInfo> result = new HashSet<>();
        for (int i = 0; i < finalCount; i++) {
            DropInfo di = candidates.get(i);
            result.add(di);
            if (logEnabled) {
                // LOG แสดงค่า DB จริงๆ ไม่ใช่ค่าที่ถูกปรุงแต่ง
                log.info("[JayCustomDrop] DROP -> Mob: {} | Item: {} | DB Chance: {}",
                        mob.getTemplateId(), di.getItemID(), di.getChance());
            }
        }
        return result;
    }

    // ===========================================================================
    // [ HELPER METHODS ]
    // ===========================================================================
    private static void addTop(List<DropInfo> target, List<DropInfo> source, int limit) {
        for (int i = 0; i < Math.min(limit, source.size()); i++)
            target.add(source.get(i));
    }

    private static List<DropInfo> filterByType(Set<DropInfo> source, int type) {
        return source.stream().filter(di -> {
            boolean isEq = isMainEquip(di.getItemID());
            boolean isAc = isAccessory(di.getItemID());
            if (type == 1)
                return isEq;
            if (type == 2)
                return isAc;
            return !isEq && !isAc;
        }).collect(Collectors.toList());
    }

    private static int randomRange(int min, int max, int poolSize) {
        int cap = Math.min(max, poolSize);
        return (cap <= min) ? cap : min + Util.getRandom(cap - min);
    }

    private static boolean isMainEquip(int itemId) {
        int p = itemId / 10000;
        return p == 100 || (p >= 104 && p <= 110) || p == 113 || (p >= 121 && p <= 159);
    }

    private static boolean isAccessory(int itemId) {
        int p = itemId / 10000;
        return (p >= 101 && p <= 103) || p == 111 || p == 112 || (p >= 114 && p <= 116) || p == 118 || p == 119
                || p == 120;
    }

    private static List<Integer> getEligibleLanes(int lv) {
        List<Integer> lanes = new ArrayList<>();
        if (lv >= 10 && lv <= 179)
            lanes.add(-3); // Global Acc

        if (lv >= 180 && lv <= 275)
            lanes.add(-4); // Rare Acc

        if (lv >= 150 && lv <= 275)
            lanes.add(-5); // Totem

        if (lv >= 160 && lv <= 275)
            lanes.add(-6); // Medal Item

        if (lv >= 120 && lv <= 275)
            lanes.add(-7); // Usable And Potion

        if (lv >= 195 && lv <= 275)
            lanes.add(-8); // Japan Equip Item

        if (lv >= 170 && lv <= 194)
            lanes.add(-9); // Sweet Water Empress

        if (lv >= 140 && lv <= 180)
            lanes.add(-10); // Armor ETC

        if (lv >= 100 && lv <= 275)
            lanes.add(-11); // Scroll

        if (lv >= 10 && lv <= 119)
            lanes.add(-12); // Global Cape Shield

        if (lv >= 160 && lv <= 220)
            lanes.add(-13); // Shield LV 100-140 Random

        if (lv >= 180)
            lanes.add(-14); // บัพแรง

        if (lv >= 180 && lv <= 275)
            lanes.add(-16); // Emblem

        if (lv >= 160 && lv <= 275)
            lanes.add(-17); // Badge

        if (lv >= 120 && lv <= 275)
            lanes.add(-18); // Pocket Item

        if (lv >= 235)
            lanes.add(-19);

        if (lv >= 250)
            lanes.add(-20);

        // New Lanes 21-30 (Expansion - Uncomment to use)
        /*
         * if (lv >= 250) lanes.add(-21);
         * if (lv >= 250) lanes.add(-22);
         * if (lv >= 250) lanes.add(-23);
         * if (lv >= 250) lanes.add(-24);
         * if (lv >= 250) lanes.add(-25);
         * if (lv >= 250) lanes.add(-26);
         * if (lv >= 250) lanes.add(-27);
         * if (lv >= 250) lanes.add(-28);
         * if (lv >= 250) lanes.add(-29);
         * if (lv >= 250) lanes.add(-30);
         */
        return lanes;
    }

    // [New Helper] Job Check
    private static boolean isJobApplicable(Char chr, int itemId) {
        if (chr == null)
            return true;
        // ถ้าไม่ใช่อาวุธหรืออุปกรณ์ป้องกัน (เช่น ยา, ETC) ให้ผ่านตลอด
        if (!ItemConstants.isEquip(itemId))
            return true;

        EquipItemInfo info = ItemData.getEquipInfoById(itemId);
        if (info == null)
            return true;

        short reqJob = info.getrJob();
        if (reqJob == 0)
            return true; // 0 = Common / All Jobs

        int jobId = chr.getJob();

        // Check Bitmask (Standard MapleStory Logic)
        // 0x1=War, 0x2=Mage, 0x4=Bow, 0x8=Thief, 0x10=Pirate
        boolean isWarrior = (reqJob & 0x1) != 0;
        boolean isMage = (reqJob & 0x2) != 0;
        boolean isBowman = (reqJob & 0x4) != 0;
        boolean isThief = (reqJob & 0x8) != 0;
        boolean isPirate = (reqJob & 0x10) != 0;

        // Beginner (0) or Xenon usually can wear multiple types, but lets stick to
        // basic matching first
        if (JobConstants.isWarriorEquipJob(jobId))
            return isWarrior;
        if (JobConstants.isMageEquipJob(jobId))
            return isMage;
        if (JobConstants.isArcherEquipJob(jobId))
            return isBowman;
        if (JobConstants.isThiefEquipJob(jobId))
            return isThief;
        if (JobConstants.isPirateEquipJob(jobId))
            return isPirate;

        return true; // Unknown/Special jobs (like GM/Beginner), let them have it via default rule
    }

    public static void applyCustomPotential(Equip equip, boolean isBoss, int mobId) {
        if (equip != null)
            JayPotentialHandler.apply(equip, isBoss, mobId);
    }
}