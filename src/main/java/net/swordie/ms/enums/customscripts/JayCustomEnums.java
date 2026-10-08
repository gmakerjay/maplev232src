package net.swordie.ms.enums.customscripts;

/**
 * Custom Enum for Item Dismantling System
 * Logic: Only store Grade Level Range and Chance %
 * Python NPC will handle prefix and item filtering
 */
public enum JayCustomEnums {

    // Grade(MinLv, MaxLv, EnchanterChance%, SoulChance%)
    TrashC(1, 80, 30, 20),
    TrashB(81, 120, 20, 10),
    TrashA(121, 140, 15, 10),
    TrashS(141, 160, 40, 20),
    None(0, 0, 0, 0);

    private final int minLv;
    private final int maxLv;
    private final int enchanterChance;
    private final int soulChance;

    JayCustomEnums(int minLv, int maxLv, int enchanterChance, int soulChance) {
        this.minLv = minLv;
        this.maxLv = maxLv;
        this.enchanterChance = enchanterChance;
        this.soulChance = soulChance;
    }

    public int getMinLv() { return minLv; }
    public int getMaxLv() { return maxLv; }
    public int getEnchanterChance() { return enchanterChance; }
    public int getSoulChance() { return soulChance; }

    /**
     * Optional: Get grade by level
     * Can be used in Java side or Python NPC
     */
    public static JayCustomEnums getGradeFromLevel(int level) {
        for (JayCustomEnums grade : values()) {
            if (grade == None) continue;
            if (level >= grade.minLv && level <= grade.maxLv) {
                return grade;
            }
        }
        return None;
    }
}
