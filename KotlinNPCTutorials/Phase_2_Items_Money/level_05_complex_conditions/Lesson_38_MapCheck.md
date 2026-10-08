# 🎓 Level 38: ที่นี่ที่ไหน? (Map Check)

NPC ตัวเดิม แต่อยู่คนละแมพ อาจจะพูดไม่เหมือนกัน!

## 📜 ภารกิจที่ 41: เช็ค Map ID
*   `chr.fieldID`: เลขแมพปัจจุบัน
*   `field.id`: (เหมือนกัน)

### **Code ตัวอย่าง (CheckLoc.kts)**
```kotlin
val map = chr.fieldID

if (map == 100000000) {
    sm.sendSayOkay("ยินดีต้อนรับสู่ Henesys เมืองแห่งเห็ด!")
} else if (map == 102000000) {
    sm.sendSayOkay("ที่นี่คือ Perion... ระวังฝุ่นด้วย")
} else {
    sm.sendSayOkay("ที่นี่ที่ไหนเนี่ย? (ID: $map)")
}
```

---

## 🧐 **Field Object**
เราสามารถเช็ค Property อื่นของแมพได้ด้วย (เช่น `field.isTown()`)
```kotlin
if (field.isTown) {
    sm.sendSay("พักผ่อนให้สบายนะ (อยู่ในเมือง)")
} else {
    sm.sendSay("ระวังตัวด้วย! (อยู่นอกเมือง)")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ไกด์ทัวร์
1.  ถ้าอยู่แมพ 0 (Maple Island) -> "เริ่มต้นการผจญภัย!"
2.  ถ้าอยู่แมพอื่น -> "ออกเดินทางไกลแล้วสินะ"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
if (chr.fieldID == 0) {
    sm.sendNext("เริ่มต้นการผจญภัย!")
} else {
    sm.sendNext("โลกกว้างรอเจ้าอยู่!")
}
```
</details>
