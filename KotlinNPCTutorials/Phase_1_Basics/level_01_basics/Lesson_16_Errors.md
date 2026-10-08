# 🎓 Level 16: ตาข่ายดักบั๊ก (Error Handling)

บางทีเราคุมทุกอย่างไม่ได้ (เช่น ผู้เล่นใส่เลขมั่ว, หารด้วย 0) ถ้าไม่ดักไว้... **Script Crash** หลุดยกแมพ!

## 📜 ภารกิจที่ 20: Try-Catch me if you can
รูปแบบเหมือน Java เป๊ะ แต่ Kotlin ไม่มี Checked Exception (ไม่ต้อง Throws ให้วุ่นวาย)

### **Code ตัวอย่าง (TryCatch.kts)**
```kotlin
try {
    // โค้ดเสี่ยงตาย
    val input = sm.sendAskText("ใส่ตัวเลขเท่านั้นนะ!", "", 1, 10)
    val number = input.toInt() // ถ้าใส่ "abc" -> Crash แน่นอนตรงนี้!
    
    val result = 100 / number // ถ้าใส่ 0 -> Crash (Divide by Zero)!
    sm.sendSayOkay("ผลลัพธ์คือ: $result")

} catch (e: NumberFormatException) {
    // ดักจับกรณีใส่ตัวหนังสือแทนตัวเลข
    sm.sendSayOkay("บอกว่าให้ใส่เลขไงโว้ยยย!")
    
} catch (e: ArithmeticException) {
    // ดักจับกรณีหารด้วย 0
    sm.sendSayOkay("ห้ามหารด้วย 0 สิครับอาจารย์!")
    
} catch (e: Exception) {
    // ดักทุกอย่างที่เหลือ (ท่าไม้ตาย)
    sm.sendSayOkay("Error อะไรไม่รู้: ${e.message}")
}
```

---

## 🧐 **Try เป็น Expression**
ใน Kotlin `try` คืนค่าได้ด้วย! เท่จัดๆ

```kotlin
val number = try {
    "123".toInt()
} catch (e: Exception) {
    0 // ถ้า Error ให้ค่าเป็น 0
}

sm.sendSay("เลขที่ได้คือ: $number")
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** NPC รับของขวัญ (Gift Receiver)
1.  ถามผู้เล่นว่าจะให้เงินเท่าไหร่ `sendAskText` (บังคับรับเป็น Text เพื่อลองของ)
2.  แปลงเป็น Int โดยใช้ `try-catch`
3.  ถ้าแปลงสำเร็จ บอกขอบคุณ
4.  ถ้าแปลงไม่สำเร็จ (ใส่ตัวหนังสือมา) ให้ด่าว่า "อย่ามากวนตีน!"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val txt = sm.sendAskText("ใส่จำนวนเงินมา:", "0", 1, 10)

try {
    val money = txt.toInt()
    sm.sendSayOkay("ขอบใจสำหรับ $money mesos!")
} catch (e: NumberFormatException) {
    sm.sendSayOkay("อย่ามากวนตีน! เอาเลขมา!")
}
```
</details>
