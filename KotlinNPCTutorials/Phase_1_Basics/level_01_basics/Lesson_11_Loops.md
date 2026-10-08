# 🎓 Level 11: วงเวียนชีวิต (Loops)

ถ้าต้องแจกของ 100 ชิ้น จะเขียน `giveItem` 100 บรรทัดเหรอ? บ้าไปแล้ว! มาใช้ Loop กันเถอะ

## 📜 ภารกิจที่ 15: For Loop (พระเอกตลอดกาล)
Format: `for (ตัวแปร in ช่วง)`

### **Code ตัวอย่าง (ForLoop.kts)**
```kotlin
// วนลูป 1 ถึง 5 (รวมเลข 5)
// .. อ่านว่า "To" (ถึง)
for (i in 1..5) {
    sm.sendNext("รอบที่ $i")
}

// วนลูปใน List (Foreach)
val mobs = listOf("Slime", "Snail", "Mushroom")
for (mob in mobs) {
    sm.sendNext("ระวัง! เจ้า $mob ปรากฏตัว!")
}
```

---

## 🧐 **Until & DownTo (ลูกเล่นเสริม)**

1.  `1 until 5` => 1, 2, 3, 4 (ไม่เอา 5) เหมือน `< 5`
2.  `5 downTo 1` => 5, 4, 3, 2, 1 (นับถอยหลัง)
3.  `step 2` => ข้ามทีละ 2 (1, 3, 5, ...)

```kotlin
sm.sendNext("นับถอยหลังระเบิด!")
for (t in 10 downTo 1) {
    // สมมติว่ามีระบบหน่วงเวลา (แต่ NPC จริงจะรันรวดเดียวจบนะ)
    // ตรงนี้แค่สาธิต Logic
    sm.sendNext("$t...") 
}
sm.sendSayOkay("บู้มมมม!")
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** สร้างเมนูจาก List (Auto Menu Generator)
1.  มี List ชื่อเมือง `listOf("Henesys", "Ellinia", "Perion")`
2.  ใช้ Loop สร้าง String เมนูอัตโนมัติ (เช่น `#L0# Henesys #l ...`)
3.  แสดงผลด้วย `sendAskMenu`

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val towns = listOf("Henesys", "Ellinia", "Perion")
var msg = "เลือกเมืองที่จะไป:\r\n"

// .indices คือเอา index มาวน (0, 1, 2)
for (i in towns.indices) {
    msg += "#L$i# ${towns[i]}#l\r\n"
}

val sel = sm.sendAskMenu(msg)
sm.sendSayOkay("คุณเลือกเมือง: ${towns[sel]}")
```
</details>
