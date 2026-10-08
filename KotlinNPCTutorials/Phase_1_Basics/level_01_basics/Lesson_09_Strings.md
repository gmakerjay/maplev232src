# 🎓 Level 9: นักเล่นแร่แปรธาตุอักษร (String Manipulation)

String ใน Kotlin ไม่ใช่แค่ข้อความโง่ๆ แต่มันมีพลังแฝงเยอะมาก!

## 📜 ภารกิจที่ 13: ตัด ต่อ ตรวจสอบ
คำสั่งที่ใช้บ่อยเวลาทำ NPC:
1.  `.length` -> ความยาวข้อความ
2.  `.contains("คำ")` -> เช็คว่ามีคำนี้อยู่ไหม
3.  `.substring(start, end)` -> ตัดข้อความ
4.  `.toLowerCase()` / `.toUpperCase()` -> แปลงตัวพิมพ์

### **Code ตัวอย่าง (StringMagic.kts)**
```kotlin
val sentence = "I love SwordieMS"

// 1. เช็คความยาว
if (sentence.length > 5) {
    sm.sendSay("ยาวจัง!")
}

// 2. ค้นหาคำ
if (sentence.contains("Love", true)) { // true = ignoreCase (ตัวเล็กใหญ่ไม่สน)
    sm.sendSay("มีความรักอยู่ในอากาศ!")
}

// 3. ตัดคำ (เริ่มที่ 2, จบที่ 6)
// Index: 0123456...
// Text:  I lo...
val sub = sentence.substring(2, 6) // ได้ "love"
sm.sendSay("คำที่ตัดมาคือ: $sub")
```

---

## 🧐 **ไวยากรณ์น่ารู้ (Trim)**
บางทีผู้เล่นพิมพ์เว้นวรรคมาข้างหน้าเยอะๆ เช่น "   pass"
ใช้ `.trim()` เพื่อลบช่องว่างหัวท้ายออกซะ!

```kotlin
val input = "   secret   "
if (input.trim() == "secret") {
    sm.sendSay("ถูกต้อง!")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ระบบกรองคำหยาบ (Censor System)
1.  ให้ผู้เล่นพิมพ์ข้อความทักทาย
2.  ถ้ามีคำว่า "damn" (ไม่สนตัวเล็กใหญ่) ให้เปลี่ยนเป็น "***" หรือบอกว่า "ห้ามพูดคำหยาบ!"
3.  ถ้าไม่มี ให้พูดตามผู้เล่น

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val text = sm.sendAskText("ทักทายหน่อยซิ!", "", 1, 50)

if (text.contains("damn", true)) {
    sm.sendSayOkay("เฮ้ย! พูดจาไม่เพราะเลยนะ!")
} else {
    sm.sendSayOkay("คุณพูดว่า: $text")
}
```
</details>
