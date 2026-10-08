# 🎓 Level 19: ความจำชั่วคราว (Temporary State)

บางทีเราอยากจำค่าไว้แค่แป๊บเดียวใน Script ตัวนี้ (เช่น นับคะแนนควิซ) ไม่ต้องบันทึกลง Database ให้รก

## 📜 ภารกิจที่ 23: ตัวแปรใน Script Context
ใน Kotlin Script (`.kts`) ตัวแปรที่เราประกาศด้านนอก (`val/var`) จะอยู่ได้จนกว่าจบการสนทนา (`dispose`)

### **Code ตัวอย่าง (Score.kts)**
```kotlin
// ตัวแปรนี้จะจำค่าไว้ ตราบใดที่เรายังคุยอยู่
var score = 0 

// คำถามที่ 1
val q1 = sm.sendAskMenu("1+1 เท่ากับเท่าไหร่?\r\n#L0# 2#l\r\n#L1# 3#l")
if (q1 == 0) {
    score += 1 // ถูก
    sm.sendNext("ถูกต้อง! คะแนนตอนนี้: $score")
} else {
    sm.sendNext("ผิด! คะแนนตอนนี้: $score")
}

// คำถามที่ 2
val q2 = sm.sendAskMenu("ไก่กับไข่อะไรเกิดก่อน?\r\n#L0# ไก่#l\r\n#L1# ไข่#l")
if (q2 == 1) { // สมมติว่าไข่ถูก
    score += 1
    sm.sendNext("เก่งมาก!")
}

sm.sendSayOkay("สรุปคะแนนรวม: $score / 2")
```

---

## 🧐 **Scope ของตัวแปร**
*   **Global (นอกฟังก์ชัน)**: ใช้ได้ทั้งไฟล์ จนกว่าจะปิดหน้าต่างคุย
*   **Local (ใน if/loop)**: ใช้ได้แค่ในปีกกา `{ }` นั้นๆ

```kotlin
var total = 0 // Global

if (true) {
    val temp = 50 // Local
    total += temp
}

// sm.sendSay(temp) // Error! หา temp ไม่เจอ
sm.sendSay("Toal: $total") // OK
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ร้านขายยาแบบตะกร้า (Shopping Cart)
1.  สร้างตัวแปร `totalPrice = 0`
2.  วนลูปถามเมนู:
    *   #L0# Red Potion (50 mesos)
    *   #L1# Blue Potion (100 mesos)
    *   #L2# จ่ายเงิน (Check Bill)
3.  ถ้าเลือกยา ให้บวกราคาเข้า `totalPrice` แล้วถามใหม่ (Loop)
4.  ถ้าเลือกจ่ายเงิน ให้หยุดลูปแล้วบอกราคารวม

**หมายเหตุ:** ใช้ `while(true)` และ `break` (เดี๋ยวเฉลยให้ดู)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
var totalPrice = 0

while (true) {
    val menu = """
        ยอดรวมตอนนี้: $totalPrice Mesos
        #L0# Red Potion (50)#l
        #L1# Blue Potion (100)#l
        #L2# จ่ายเงินจ้า#l
    """.trimIndent()
    
    val sel = sm.sendAskMenu(menu)
    
    if (sel == 0) totalPrice += 50
    else if (sel == 1) totalPrice += 100
    else break // ออกจากลูป (จ่ายเงิน)
}

sm.sendSayOkay("ทั้งหมด $totalPrice Mesos ครับผม!")
```
</details>
