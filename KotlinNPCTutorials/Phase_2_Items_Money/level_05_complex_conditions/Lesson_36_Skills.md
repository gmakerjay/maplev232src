# 🎓 Level 36: สุดยอดวิชา (Skill Checking)

NPC บางตัวสอนสกิล (Skill Master) หรือเช็คว่าเรามีสกิลนี้หรือยัง

## 📜 ภารกิจที่ 39: เช็คและแจกสกิล
*   `chr.hasSkill(skillID)`: มีสกิลนี้ไหม
*   `chr.addSkill(skillID, level, masterLevel)`: เพิ่มสกิล
*   `chr.getSkillLevel(skillID)`: เช็คเลเวลสกิล

### **Code ตัวอย่าง (SkillMaster.kts)**
```kotlin
val skillID = 1001000 // สมมติสกิล Three Snails
val reqLevel = 10

if (chr.level >= reqLevel) {
    if (!chr.hasSkill(skillID)) {
        sm.sendNext("เจ้ายังไม่มีสกิล Three Snails นี่นา...")
        
        // เพิ่มสกิล (Level 1, Max 3)
        chr.addSkill(skillID, 1, 3)
        
        sm.sendSayOkay("ข้าสอนให้แล้ว! ลองกดใช้ดูสิ")
    } else {
        val slv = chr.getSkillLevel(skillID)
        sm.sendSayOkay("เจ้ามีสกิลนี้แล้ว (Level $slv)")
    }
}
```

---

## 🧐 **Max Level**
อย่าลืมกำหนด Master Level ให้ถูกต้อง ไม่งั้นสกิลจะอัพต่อไม่ได้

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** อาจารย์ลับ
1.  ถ้าผู้เล่นมีสกิล ID 112233 แล้ว บอกว่า "เจ้าเก่งมาก"
2.  ถ้ายังไม่มี ให้แจกสกิลนี้ (Level 1, Master 30)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val s = 112233
if (chr.hasSkill(s)) {
    sm.sendSayOkay("เจ้าเป็นศิษย์มีครู!")
} else {
    chr.addSkill(s, 1, 30)
    sm.sendSayOkay("รับเคล็ดวิชาไปซะ!")
}
```
</details>
