package net.swordie.ms.jaycustom;

import net.swordie.ms.life.mob.Mob;
import net.swordie.ms.world.field.Field;
import net.swordie.ms.world.field.instance.Instance;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Handles Dynamic Boss HP Scaling based on the number of players in the field.
 * Created for Single Player / Small Group support.
 */
public class JayDynamicBossScaling {

    private static final Logger log = LogManager.getLogger(JayDynamicBossScaling.class);

    // ==================================================================================
    // CONFIGURATION
    // ==================================================================================
    public static final boolean ENABLE_SYS = true; // Set to false to disable the entire system
    public static final boolean ENABLE_LOG = true; // Set to false to disable logging

    /**
     * Entry point to process Boss Scaling.
     * Should be called from Field.spawnLife() before the mob is added to the
     * lifecycle.
     *
     * @param mob   The mob being spawned.
     * @param field The field where the mob is spawning.
     */
    public static void init() {
        if (ENABLE_SYS) {
            log.info("=== [JayDynamicBossScaling] System Enabled ===");
            log.info(String.format("   - Scaling: 1 Player = 20%%, 2 Players = 50%%, 3+ Players = 100%%"));
        } else {
            log.info("=== [JayDynamicBossScaling] System Disabled ===");
        }
    }

    public static void process(Mob mob, Field field) {
        if (!ENABLE_SYS) {
            return;
        }

        // Only scale Bosses
        if (mob == null || !mob.isBoss()) {
            return;
        }

        // ===========================================================================
        // [ ปรับปรุง: คำนวณจำนวนผู้เล่นจากหลายแหล่ง ]
        // ===========================================================================
        int playerCount = getPlayerCount(field);

        double scaleMultiplier = 1.0;

        if (playerCount == 1) {
            scaleMultiplier = 1.0; // 20% HP for Solo
        } else if (playerCount == 2) {
            scaleMultiplier = 1.0; // 50% HP for Duo
        } else {
            scaleMultiplier = 1.0; // 100% HP for 3+ players
        }

        if (scaleMultiplier < 1.0) {
            long originalHp = mob.getMaxHp();
            long newHp = (long) (originalHp * scaleMultiplier);

            // Prevent HP from being too low (e.g. < 1000) just in case
            if (newHp < 1000) {
                newHp = 1000;
            }

            mob.setMaxHp(newHp);
            mob.setHp(newHp);

            if (ENABLE_LOG) {
                log.info(String.format("[JayScaling] Scaled Boss (ID: %d) for %d Players. HP: %d -> %d (%.0f%%)",
                        mob.getTemplateId(), playerCount, originalHp, newHp,
                        scaleMultiplier * 100));
            }
        } else {
            if (ENABLE_LOG) {
                log.info(String.format("[JayScaling] Boss (ID: %d) NOT scaled. Players: %d (100%% HP)",
                        mob.getTemplateId(), playerCount));
            }
        }
    }

    /**
     * คำนวณจำนวนผู้เล่นจากหลายแหล่ง:
     * 1. Instance Party (ถ้าเป็น Instance)
     * 2. Field Chars (ถ้าไม่มี Instance)
     * 3. ค่าเริ่มต้น = 1 (Solo)
     */
    private static int getPlayerCount(Field field) {
        // 1. ลองดึงจาก Instance ก่อน (Boss Instance จะมี Party ที่เข้ามา)
        Instance instance = field.getInstance();
        if (instance != null) {
            // ดึงจำนวนคนจาก Party ที่สร้าง Instance
            int instancePartySize = instance.getChars().size();
            if (instancePartySize > 0) {
                return instancePartySize;
            }
        }

        // 2. ดึงจาก Field.getChars()
        int fieldCharCount = field.getChars().size();
        if (fieldCharCount > 0) {
            return fieldCharCount;
        }

        // 3. Default = 1 (Solo)
        return 1;
    }
}
