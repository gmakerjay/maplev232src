/**
 * Maple Equip Buildup - Kotlin Version
 * แปลงจาก soulWeapon_Copy.py เป็น Kotlin (.kts)
 */

import net.swordie.ms.scripts.ScriptManager
import net.swordie.ms.client.character.skills.temp.CharacterTemporaryStat

// Get bindings - ใช้ชื่อที่ไม่ซ้ำกับ bindings เดิม
val sm = bindings["sm"] as ScriptManager

// --- Skill ID Constants ---
val SHARP_EYES = 3121002
val SPEED_INFUSION = 15121005
val MAPLE_WARRIOR = 1321000

// --- Menu ---
val menu = """
    #e#d< Battlefield Support Specialist >#n

    Hello! Do you need combat enchantments for your journey?

    #L0# #bGet Combat Buff Pack#l
    #L1# #rRemove All Active Buffs#l
""".trimIndent()

val selection = sm.sendNext(menu)

when (selection) {
    0 -> {
        // Set duration to 7600 seconds as requested
        val duration = 7600
        val level = 30

        // 1. Register Skills for Icon Display
        val skills = listOf(SHARP_EYES, SPEED_INFUSION, MAPLE_WARRIOR)
        for (sID in skills) {
            sm.giveSkill(sID, level, level)
        }

        // 2. Apply Core Combat Stats (CTS)

        // [Sharp Eyes] Critical Rate & Max Crit Damage
        sm.giveCTS(CharacterTemporaryStat.SharpEyes, 25, SHARP_EYES, duration)

        // [Speed Infusion] Attack Speed -4 (Maximum Speed)
        sm.giveCTS(CharacterTemporaryStat.IndieBooster, -4, SPEED_INFUSION, duration)

        // [Maple Warrior Style] HP/MP 15%
        sm.giveCTS(CharacterTemporaryStat.IndieMHPR, 15, MAPLE_WARRIOR, duration)

        // [Combat Power] Increase Physical & Magic Attack by 35%
        sm.giveCTS(CharacterTemporaryStat.IndiePADR, 40, MAPLE_WARRIOR, duration)
        sm.giveCTS(CharacterTemporaryStat.IndieMADR, 40, MAPLE_WARRIOR, duration)

        // [Additional Stats] Indie Stats
        sm.giveCTS(CharacterTemporaryStat.IndiePAD, 50, MAPLE_WARRIOR, duration)   // Flat Attack
        sm.giveCTS(CharacterTemporaryStat.IndieMAD, 50, MAPLE_WARRIOR, duration)   // Flat Magic
        sm.giveCTS(CharacterTemporaryStat.IndieAllStat, 15, MAPLE_WARRIOR, duration) // All Stats %
        sm.giveCTS(CharacterTemporaryStat.IndieACC, 100, MAPLE_WARRIOR, duration)   // Accuracy

        sm.sendSayOkay("#e#b[BUFFS APPLIED]#n\n\nYour combat abilities have been enhanced!\nDuration: 7,600 Seconds.")
    }
    
    1 -> {
        // Clear all buffs - ใช้ removeAllBuffs แทน removeSkill
        sm.removeAllBuffs()
        
        // ใช้ getChr() เพื่อเข้าถึง character และลบ skill
        val character = sm.chr
        character.removeSkillAndSendPacket(SHARP_EYES)
        character.removeSkillAndSendPacket(SPEED_INFUSION)
        character.removeSkillAndSendPacket(MAPLE_WARRIOR)

        sm.sendSayOkay("All enhancements have been #rpurged#k.")
    }
}

// End script
sm.dispose()
