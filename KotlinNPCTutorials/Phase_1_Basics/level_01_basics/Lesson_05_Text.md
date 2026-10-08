# 🎓 Level 5: อักษรซ่อนเงื่อน (Text Inputs)

บางครั้งตัวเลขก็ไม่พอ เราต้องการชื่อ รหัสผ่าน หรือคำตอบที่เป็นข้อความ!

## 📜 ภารกิจที่ 8: บอกชื่อหน่อย (Ask Text)
คำสั่ง `sm.sendAskText` ใช้รับ String จากผู้เล่น
*   **Arg 1**: คำถาม
*   **Arg 2**: ข้อความ Default
*   **Arg 3**: Min Length
*   **Arg 4**: Max Length

### **Code ตัวอย่าง (AskName.kts)**
```kotlin
// ให้พิมพ์อย่างน้อย 1 ตัวอักษร มากสุด 12 ตัว
val name = sm.sendAskText("อยากให้ฉันเรียกนายว่าอะไร?", "ผู้กล้า", 1, 12)

sm.sendSayOkay("โอเค! ต่อไปนี้นายคือท่าน '$name' นะ!")
```

---

## 🧐 **ไวยากรณ์น่ารู้ (Grammar Breakdown)**

### 1. **String Equality (การเช็คข้อความ)**
ใน Java เราต้องใช้ `.equals()` ให้วุ่นวาย
แต่ใน Kotlin... ใช้ `==` ได้เลยจ้า!

```kotlin
if (password == "123456") {
    sm.sendSay("Login Passed!")
}
```

### 2. **String Templates (การแทรกตัวแปรแบบเทพๆ)**
*   `"Hello $name"`: แทรกตัวแปรเดี่ยวๆ
*   `"Money: ${chr.getMesos()}"`: แทรก Expression หรือเรียกฟังก์ชัน ต้องมีปีกกา `{}`

---

## 📜 ภารกิจที่ 9: ควิซแฟนพันธุ์แท้ (Quiz)
มาลองทำควิซง่ายๆ กัน

### **Code ตัวอย่าง (Quiz.kts)**
```kotlin
val answer = sm.sendAskText("เมืองหลวงของประเทศไทยคือที่ไหน?", "", 1, 20)

// แปลงเป็นตัวพิมพ์เล็กก่อนเช็ค จะได้ไม่ต้องห่วงเรื่อง BAngKoK หรือ bangkok
if (answer.toLowerCase() == "bangkok" || answer == "กรุงเทพ") {
    sm.sendSayOkay("เก่งมาก! เอาไป 10 คะแนน")
} else {
    sm.sendSayOkay("ผิดจ้า! ไปเรียนสังคมใหม่นะ")
}
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** สร้าง NPC รหัสลับ (Secret Agent)
1.  ถามรหัสผ่านจากผู้เล่น
2.  ถ้ารหัสคือ "swordie" ให้บอกว่า "Welcome, Agent."
3.  ถ้าผิด ให้บอกว่า "Access Denied." และตัดจบการสนทนาทันที (`sm.dispose()`)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val pass = sm.sendAskText("Password?", "", 1, 20)

if (pass == "swordie") {
    sm.sendNext("Welcome, Agent.")
    sm.sendSayOkay("ภารกิจของคุณคือ...")
} else {
    sm.sendSayOkay("Access Denied.")
    sm.dispose() // ความจริง sendSayOkay ก็จบอยู่แล้ว แต่อันนี้สั่งจบแบบ Force
}
```
</details>
