# 🎓 Level 2: ทางแยกแห่งชะตากรรม (Decisions)

ชีวิตคือทางเลือกครับ NPC ก็เหมือนกัน จะให้มันพูดเป็นนกแก้วนกขุนทองอย่างเดียวไม่ได้ มันต้องถามเราได้ด้วย!

## 📜 ภารกิจที่ 2: ใช่ หรือ ไม่ (Yes or No)
เราจะมาใช้คำสั่ง `sm.sendAskYesNo` เพื่อสร้างทางเลือกให้ผู้เล่น

### **Code ตัวอย่าง (YesNo.kts)**
```kotlin
// NPC ถามคำถาม
// ค่าที่ได้กลับมาจะเป็น Boolean (true/false) อัตโนมัติ! ไม่ต้องแปลง!
val answer = sm.sendAskYesNo("นายคิดว่าฉันหล่อไหม?")

if (answer) {
    // ถ้าผู้เล่นกด Yes (true)
    sm.sendSayOkay("ตาถึงนี่หว่า! เอาไปเลย 10 บาท")
} else {
    // ถ้าผู้เล่นกด No (false)
    sm.sendSayOkay("หนอยแน่ะ! ออกไปเลยนะ!")
}
```

---

## 🧐 **ไวยากรณ์น่ารู้ (Grammar Breakdown)**

### 1. **ตัวแปร (Variables)**
*   `val`: **Value** (ค่าคงที่) ประกาศแล้วเปลี่ยนไม่ได้ (เหมือน `const`) เหมาะกับคำตอบที่รับมาแล้วจบเลย
    *   `val name = "Somsak"` (ถูกต้อง)
    *   `name = "Wichai"` (Error! เปลี่ยนไม่ได้)
*   `var`: **Variable** (ตัวแปร) เปลี่ยนค่าได้ตลอด
    *   `var money = 100`
    *   `money = 50` (ถูกต้อง)

> **💡 Pro Tip:** ใช้ `val` ให้ชิน ถ้าจำเป็นต้องเปลี่ยนค่าค่อยแก้เป็น `var`

### 2. **เงื่อนไข (If/Else)**
ใน Kotlin `if` มันฉลาดมาก มันทำงานเหมือน Expression ได้ด้วย (คล้ายๆ Ternary Operator)

แบบปกติ:
```kotlin
if (answer) {
    sm.sendSay("Good!")
} else {
    sm.sendSay("Bad!")
}
```

แบบเทพ (One-Liner):
```kotlin
if (answer) sm.sendSay("Good!") else sm.sendSay("Bad!")
```

---

## 📜 ภารกิจที่ 3: รับคำท้า (Accept or Decline)
คล้ายๆ Yes/No แต่ปุ่มจะเป็น "Accept" กับ "Decline" เหมาะสำหรับเควส

### **Code ตัวอย่าง (Accept.kts)**
```kotlin
val accept = sm.sendAskAccept("จะรับภารกิจล้างห้องน้ำไหม?")

if (accept) {
    sm.sendSayOkay("ดีมาก! ไม้กวาดอยู่นั่น ไปหยิบเอา")
} else {
    sm.sendSayOkay("น่าเสียดายจัง... ห้องน้ำเหม็นต่อไป")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เขียน NPC ขอเงิน 1,000,000 Meso
*   ถ้ากด Yes -> ให้ NPC พูดว่า "ล้อเล่นน่า ไม่มีระบบหักเงินหรอก"
*   ถ้ากด No -> ให้ NPC พูดว่า "งกจัง!"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val giveMoney = sm.sendAskYesNo("ขอตังค์ล้านนึงดิ?")

if (giveMoney) {
    sm.sendSayOkay("ใจป๋าจังพี่ชาย! แต่ผมล้อเล่นนะ")
} else {
    sm.sendSayOkay("โถ่... แค่นี้ก็ให้ไม่ได้")
}
```
</details>
