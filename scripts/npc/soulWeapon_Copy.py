from net.swordie.ms.client.character.skills.temp import CharacterTemporaryStat

# Get Character Information
chr = sm.getChr()

# --- Skill ID Constants ---
SHARP_EYES = 3121002
SPEED_INFUSION = 15121005
MAPLE_WARRIOR = 1321000

# --- Menu ---
menu = "#e#d< Battlefield Support Specialist >#n\n\n"
menu += "Hello! Do you need combat enchantments for your journey?\n\n"
menu += "#L0# #bGet Combat Buff Pack#l\n"
menu += "#L1# #rRemove All Active Buffs#l"

selection = sm.sendNext(menu)

if selection == 0:
    # Set duration to 7600 seconds as requested
    duration = 7600
    level = 30

    # 1. Register Skills for Icon Display
    skills = [SHARP_EYES, SPEED_INFUSION, MAPLE_WARRIOR]
    for sID in skills:
        sm.giveSkill(sID, level, level)

    # 2. Apply Core Combat Stats (CTS)

    # [Sharp Eyes] Critical Rate & Max Crit Damage
    sm.giveCTS(CharacterTemporaryStat.SharpEyes, 25, SHARP_EYES, duration)

    # [Speed Infusion] Attack Speed -4 (Maximum Speed)
    sm.giveCTS(CharacterTemporaryStat.IndieBooster, -4, SPEED_INFUSION, duration)

    # [Maple Warrior Style] HP/MP 15%
    sm.giveCTS(CharacterTemporaryStat.IndieMHPR, 15, MAPLE_WARRIOR, duration)

    # [Combat Power] Increase Physical & Magic Attack by 35%
    sm.giveCTS(CharacterTemporaryStat.IndiePADR, 40, MAPLE_WARRIOR, duration)
    sm.giveCTS(CharacterTemporaryStat.IndieMADR, 40, MAPLE_WARRIOR, duration)

    # [Additional Stats] Indie Stats
    sm.giveCTS(CharacterTemporaryStat.IndiePAD, 50, MAPLE_WARRIOR, duration)   # Flat Attack
    sm.giveCTS(CharacterTemporaryStat.IndieMAD, 50, MAPLE_WARRIOR, duration)   # Flat Magic
    sm.giveCTS(CharacterTemporaryStat.IndieAllStat, 15, MAPLE_WARRIOR, duration) # All Stats %
    sm.giveCTS(CharacterTemporaryStat.IndieACC, 100, MAPLE_WARRIOR, duration)   # Accuracy

    sm.sendSayOkay("#e#b[BUFFS APPLIED]#n\n\nYour combat abilities have been enhanced!\nDuration: 7,600 Seconds.")

elif selection == 1:
    # Clear all buffs and remove the skill icons
    sm.removeAllBuffs()
    for sID in [SHARP_EYES, SPEED_INFUSION, MAPLE_WARRIOR]:
        sm.removeSkill(sID)

    sm.sendSayOkay("All enhancements have been #rpurged#k.")

# End script
sm.dispose()