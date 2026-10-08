# 🎓 Level 35: ภารกิจเสร็จสิ้น (Complete Quest)

เมื่อผู้เล่นทำตามเงื่อนไขครบ ก็ถึงเวลาจบงานและแจกรางวัล!

## 📜 ภารกิจที่ 38: จบงาน
คำสั่ง: `sm.completeQuest(questID)`
*   เปลี่ยนสถานะเควสเป็น **Completed**
*   **คำเตือน:** 
    1.  เช็คของก่อน (ถ้ามีเงื่อนไขหาของ)
    2.  ลบของ (Consume)
    3.  แจกรางวัล (Give)
    4.  จบเควส (Complete) -> ลำดับนี้สำคัญมาก!

### **Code ตัวอย่าง (EndQuest.kts)**
```kotlin
val qID = 990001
val reqItem = 4000000 // Snail Shell

// ต้องอยู่ในสถานะ Active เท่านั้นถึงจะจบได้
if (sm.isQuestActive(qID)) {
    if (sm.hasItem(reqItem, 10)) {
        sm.sendNext("โอ้ว! ได้ของครบแล้วนี่นา")
        
        sm.consumeItem(reqItem, 10) // ลบของ
        sm.completeQuest(qID)       // จบเควส
        sm.giveItem(2000000, 5)     // ให้รางวัล
        sm.addExp(100)              // ให้ EXP
        
        sm.sendSayOkay("ขอบใจมาก! นี่รางวัลของเจ้า")
    } else {
        sm.sendSayOkay("ยังขาดเปลือกหอยอยู่นะ... ไปหามาให้ครบ 10 อัน")
    }
}
```

---

## 🧐 **Replayable Quest (เควสทำซ้ำได้)**
ถ้าอยากให้ทำซ้ำได้ อย่าใช้ `completeQuest` (เพราะมันจะเช็ค `isQuestCompleted` ได้)
ให้ใช้การเช็คตัวแปร Custom หรือไม่ต้องเก็บสถานะเลย (เช็คของ -> แลกของ จบ)

แต่ถ้าอยากใช้ระบบ Quest จริงๆ ต้องสั่งลบเควส: `sm.stopQuest(questID)` (อันนี้แล้วแต่ Emulator บางตัวไม่มี)

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ส่งจดหมาย (Delivery)
1.  ต้องมี "Letter" (4033000 สมมติ)
2.  ถ้าจบเควส ให้เงิน 500 Meso และ Fame 1

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val q = 888
val letter = 4033000

if (sm.isQuestActive(q) && sm.hasItem(letter)) {
    sm.consumeItem(letter)
    sm.completeQuest(q)
    chr.addMoney(500)
    chr.addFame(1)
    sm.sendSayOkay("ขอบใจที่มาส่งนะ!")
}
```
</details>
