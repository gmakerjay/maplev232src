# 🎓 Level 12: เสี่ยงดวง (Randomness)

NPC จะสนุกได้ไงถ้าทุกอย่างเหมือนเดิมตลอด? ใส่ความสุ่มลงไปหน่อยสิ!

## 📜 ภารกิจที่ 16: สุ่มตัวเลข
Kotlin (Java) มีตัวช่วยคือ `Random`

### **Code ตัวอย่าง (Random.kts)**
```kotlin
import java.util.Random // ต้อง Import ก่อนนะ!

val rand = Random()

// สุ่มเลข 0 ถึง 9 (ไม่รวม 10)
val luck = rand.nextInt(10) 

sm.sendNext("แต้มดวงของคุณคือ: $luck")

if (luck >= 8) {
    sm.sendSayOkay("วันนี้ดวงดีสุดๆ!")
} else if (luck <= 2) {
    sm.sendSayOkay("วันนี้โคตรซวย...")
}
```

---

## 🧐 **สุ่มของจาก List**
เราสามารถใช้ `.random()` กับ List ได้เลย (Kotlin Extension) ง่ายมาก!

```kotlin
val items = listOf("Diamond", "Gold", "Trash", "Air")
val prize = items.random() // สุ่มหยิบมา 1 อัน

sm.sendSayOkay("ยินดีด้วย! คุณเปิดกล่องได้... $prize")
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เป่ายิ้งฉุบ (Rock Paper Scissors)
1.  ให้ผู้เล่นเลือก (ค้อน/กรรไกร/กระดาษ) ผ่านเมนู
2.  ให้ NPC สุ่มเลือกมา 1 อย่าง
3.  ตรวจสอบผลแพ้ชนะ (Case เยอะหน่อยนะ!)
4.  บอกผลลัพธ์ว่าใครชนะ

**เคล็ดลับ:** กำหนดเลข 1=ค้อน, 2=กรรไกร, 3=กระดาษ จะเขียนง่ายขึ้น

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
import java.util.Random

val userMove = sm.sendAskMenu("เป่ายิ้งฉุบ!\r\n#L0#ค้อน#l\r\n#L1#กรรไกร#l\r\n#L2#กระดาษ#l")
val npcMove = Random().nextInt(3) // 0, 1, 2

val moves = listOf("ค้อน", "กรรไกร", "กระดาษ")
sm.sendNext("นายออก: ${moves[userMove]} vs ฉันออก: ${moves[npcMove]}")

if (userMove == npcMove) {
    sm.sendSayOkay("เสมอ!")
} else if ((userMove == 0 && npcMove == 1) || 
           (userMove == 1 && npcMove == 2) || 
           (userMove == 2 && npcMove == 0)) {
    sm.sendSayOkay("นายชนะ! เก่งนี่หว่า")
} else {
    sm.sendSayOkay("อ่อนหัด! ฉันชนะ")
}
```
</details>
