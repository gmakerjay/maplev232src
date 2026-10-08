# 🎓 Level 34: รับภารกิจ (Start Quest)

เมื่อผู้เล่นตกลงรับงาน เราต้อง "เริ่ม" เควสให้เขา

## 📜 ภารกิจที่ 37: บันทึกสถานะเริ่ม
คำสั่ง: `sm.startQuest(questID)`
*   คำสั่งนี้จะเปลี่ยนสถานะเควสเป็น **Active**
*   ใน Swordie มันจะเพิ่ม Quest Record เข้าไปใน `QuestManager`

### **Code ตัวอย่าง (StartQuest.kts)**
```kotlin
val qID = 990001
val start = sm.sendAskYesNo("ช่วยไปตี Snail ให้หน่อยได้ไหม?")

if (start) {
    // บังคับเริ่มเควส
    sm.startQuest(qID)
    sm.sendSayOkay("ดีมาก! ไปตีมา 10 ตัวนะ (เควสเริ่มแล้ว)")
} else {
    sm.sendSayOkay("ใจดำจัง... จำไว้เลยนะ")
}
```

---

## 🧐 **Quest Data (QR Value)**
บางครั้งเราอยากเก็บข้อมูลเพิ่ม เช่น "ฆ่าไปกี่ตัวแล้ว"
*   `sm.getQRValue(questID)`: ดึงค่า String ออกมา
*   `sm.setQRValue(questID, "1")`: ตั้งค่า

```kotlin
// สมมติเริ่มเควสแล้วเก็บตัวแปรว่า "0" (ยังไม่ได้ฆ่าสักตัว)
sm.startQuest(qID)
sm.setQRValue(qID, "0") 
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** นักล่ามือใหม่
1.  เช็คว่าเริ่มเควสยัง (isQuestActive)
2.  ถ้ายัง -> ถามว่าจะเริ่มไหม -> กด Yes -> startQuest
3.  ถ้าเริ่มแล้ว -> บอกว่า "สู้ๆ นะ"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val q = 777

if (sm.isQuestActive(q)) {
    sm.sendSayOkay("อย่าอู้งาน! รีบไปทำ!")
} else {
    val accept = sm.sendAskAccept("รับงานล่าสัตว์ไหม?")
    if (accept) {
        sm.startQuest(q)
        sm.sendSayOkay("รับงานแล้ว! ลุยเลย")
    }
}
```
</details>
