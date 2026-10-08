# 🎓 Level 26: รู้ไว้ใช่ว่า (Inventory Constants)

ก่อนจะเช็คว่ากระเป๋าเต็มไหม เราต้องรู้จักก่อนว่าในเกมมีกระเป๋ากี่ประเภท

## 📜 ภารกิจที่ 29: รู้จัก Enum InvType
SwordieMS เก็บประเภท Inventory ไว้ใน Enum ชื่อ `InvType`
แต่ใน Script เราอาจจะใช้ `getQuantity` ยากหน่อยถ้าไม่ Import
ปกติเราใช้เลข ID แทนได้:

| ID | ประเภท | คืออะไร |
| :--- | :--- | :--- |
| **1** | **EQUIP** | เสื้อผ้า อาวุธ แหวน |
| **2** | **CONSUME** | ยา อาหาร ใบวาร์ป |
| **3** | **INSTALL** | (บางเซิร์ฟคือ Setup) เก้าอี้ โต๊ะ |
| **4** | **ETC** | ขยะ เปลือกหอย ของเควส |
| **5** | **CASH** | ของแคช แฟชั่น |

### **Code ตัวอย่าง (CheckQuantity.kts)**
```kotlin
// อยากรู้ว่าในตัวมี "Red Potion" กี่ขวด?
val count = sm.getQuantityOfItem(2000000)

sm.sendSayOkay("นายมีน้ำแดงอยู่ $count ขวด")
```

---

## 🧐 **การนับไอเทมทั้งหมด**
บางทีเราอยากเช็คว่า "มีขยะเกิน 100 ชิ้นไหม" (ไม่สนว่าเป็นขยะอะไร)
...อันนี้ยาก ต้องวนลูป Inventory (ไว้เรียนใน Phase 5 Advanced)

ตอนนี้เอาแค่ `getQuantityOfItem(id)` ให้แม่นก่อน

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** นักสะสมของเก่า
1.  NPC รับซื้อ "Slime Bubble" (4000001) ชิ้นละ 10 Meso
2.  นับจำนวนในตัวผู้เล่นว่ามีกี่อัน
3.  ถามยืนยัน "คุณมี [จำนวน] อัน จะขายทั้งหมดเป็นเงิน [ราคารวม] ไหม?"
4.  ถ้าตกลง -> Consume ทั้งหมด -> ให้เงินตามจำนวน

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val itemId = 4000001
val total = sm.getQuantityOfItem(itemId)
val price = 10

if (total > 0) {
    val money = total * price
    val sell = sm.sendAskYesNo("คุณมี $total อัน ขายได้ $money Meso เอาไหม?")
    
    if (sell) {
        sm.consumeItem(itemId, total) // ลบทั้งหมด
        chr.addMoney(money)
        sm.sendSayOkay("ขอบคุณที่ใช้บริการ!")
    }
} else {
    sm.sendSayOkay("ไม่มีของมาขายเลยนะนายน่ะ")
}
```
</details>
