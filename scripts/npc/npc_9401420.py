import random
from collections import Counter
from net.swordie.ms.enums.customscripts import JayCustomEnums
from net.swordie.ms.enums import InvType
from net.swordie.ms.util import Util

# =====================
# REWARD ITEM LISTS
# =====================
ITEM_ENCHANTER = 2590004
SHARD_LIST = [2433592, 2431710, 2431662, 2431661, 2431658, 2431657, 2431655, 2431896, 2431964]
BOSS_SOUL_LIST = (
        list(range(2591414, 2591419)) +
        list(range(2591060, 2591065)) +
        list(range(2591260, 2591264)) +
        list(range(2591079, 2591083))
)

# =====================
# INITIALIZE
# =====================
chr = sm.getChr()

# =====================
# HELPER FUNCTIONS
# =====================
def getNPCGradeName(grade):
    if grade == JayCustomEnums.TrashC:
        return "C-Rank Lv. 1 ~ 80"
    elif grade == JayCustomEnums.TrashB:
        return "B-Rank Lv. 81 ~ 120"
    elif grade == JayCustomEnums.TrashA:
        return "A-Rank Lv. 121 ~ 140"
    else:
        return "Unknown"

def getGradeRewardInfo(grade):
    if grade == JayCustomEnums.TrashC:
        return (
            "[Grade C : Lv.1 ~ 80]\n"
            "- Enchanter (30%)\n"
            "- Soul Shard x3 (25%)"
        )
    elif grade == JayCustomEnums.TrashB:
        return (
            "[Grade B : Lv.81 ~ 120]\n"
            "- Enchanter (30%)\n"
            "- Soul Shard x10 (35%)\n"
            "- Boss Soul (15%)"
        )
    elif grade == JayCustomEnums.TrashA:
        return (
            "[Grade A : Lv.121 ~ 140]\n"
            "- Enchanter (30%)\n"
            "- Soul Shard x15 (25%)\n"
            "- Boss Soul (10%)"
        )
    return ""

# =====================
# NPC INTRO
# =====================
sm.sendNext(
    "Greetings, #b{}#k.\n"
    "I am an equipment dismantler.\n"
    "Bring me unwanted gear, and I will extract their value.".format(chr.getName())
)

sm.sendNext(
    "Each dismantle consumes #b10 equipments#k.\n"
    "The higher the level, the better the rewards.\n"
    "This system works like a gacha."
)

# =====================
# SELECTION MENU (C/B/A)
# =====================
menu = (
    "#eSelect dismantle grade:#n\n\n"
    "#L0##bC-Rank#k  Lv. 1 ~ 80#l\n"
    "#L1##bB-Rank#k  Lv. 81 ~ 120#l\n"
    "#L2##bA-Rank#k  Lv. 121 ~ 140#l"
)

selection = sm.sendNext(menu)  # ผู้เล่นคลิกครั้งเดียว

if selection == 0:
    targetGrade = JayCustomEnums.TrashC
elif selection == 1:
    targetGrade = JayCustomEnums.TrashB
elif selection == 2:
    targetGrade = JayCustomEnums.TrashA
else:
    sm.sendSayOkay("No grade selected. Operation cancelled.")
    sm.dispose()

# =====================
# SHOW REWARD INFO
# =====================
sm.sendNext(
    "You selected #b{}#k.\n\n"
    "From this dismantle, you have the following chances:\n\n{}"
    .format(getNPCGradeName(targetGrade), getGradeRewardInfo(targetGrade))
)

# =====================
# FILTER ITEMS
# =====================
equipInv = chr.getInventoryByType(InvType.EQUIP)
validItems = []

for item in equipInv.getItems():
    itemId = item.getItemId()
    level = item.getReqLevel()
    prefix = itemId // 10000

    isMainEquip = prefix == 100 or (104 <= prefix <= 110) or prefix == 113 or (121 <= prefix <= 159)
    isAccessory = (101 <= prefix <= 103) or prefix in [111, 112] or (114 <= prefix <= 116) or (118 <= prefix <= 120)

    if (isMainEquip or isAccessory) and targetGrade.getMinLv() <= level <= targetGrade.getMaxLv():
        validItems.append(item)

# =====================
# CHECK ITEM COUNT
# =====================
if len(validItems) < 10:
    sm.sendSayOkay(
        "You need at least #b10#k items in {}.\n(Current: {})"
        .format(getNPCGradeName(targetGrade), len(validItems))
    )
    sm.dispose()

# =====================
# CONSUME 10 ITEMS
# =====================
to_remove = validItems[:10]
removed_count = 0

for item in to_remove:
    sm.consumeItem(item.getItemId(), 1)
    removed_count += 1

# =====================
# REWARD CALCULATION
# =====================
reward_list = []

def giveRandomShard(amount):
    for _ in range(amount):
        sid = random.choice(SHARD_LIST)
        sm.giveItem(sid, 1)
        reward_list.append(sid)

# Enchanter chance
if Util.succeedProp(30):
    sm.giveItem(ITEM_ENCHANTER, 1)
    reward_list.append(ITEM_ENCHANTER)

# Grade-specific rewards
if targetGrade == JayCustomEnums.TrashC:
    if Util.succeedProp(25):
        giveRandomShard(3)

elif targetGrade == JayCustomEnums.TrashB:
    if Util.succeedProp(35):
        giveRandomShard(10)
    if Util.succeedProp(15):
        soul = random.choice(BOSS_SOUL_LIST)
        sm.giveItem(soul, 1)
        reward_list.append(soul)

elif targetGrade == JayCustomEnums.TrashA:
    if Util.succeedProp(25):
        giveRandomShard(15)
    if Util.succeedProp(10):
        soul = random.choice(BOSS_SOUL_LIST)
        sm.giveItem(soul, 1)
        reward_list.append(soul)

# =====================
# SUMMARIZE REWARDS
# =====================
if reward_list:
    reward_counter = Counter(reward_list)
    reward_text = ""
    for itemId, count in reward_counter.items():
        reward_text += "- #v{}# #z{}# x{}\n".format(itemId, itemId, count)
    final_msg = "Successfully dismantled #b{}#k items.\n\n#e[Rewards Obtained]#n\n{}".format(
        removed_count, reward_text)
else:
    final_msg = "Successfully dismantled #b{}#k items.\n\nSorry, you didn't receive any rewards.".format(
        removed_count)

sm.sendSayOkay(final_msg)
sm.dispose()
