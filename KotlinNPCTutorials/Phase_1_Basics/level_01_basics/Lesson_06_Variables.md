# 🎓 Level 6: กล่องปริศนาซ่อนค่า (Variables & Data Types)

ก่อนจะไปต่อ เราต้องแม่นเรื่อง "ชนิดข้อมูล" (Data Types) ไม่งั้นคุยกับคอมพิวเตอร์ไม่รู้เรื่อง!

## 📜 ภารกิจที่ 10: รู้จักประเภทตัวแปร
ใน Kotlin มี Type หลักๆ ที่เราใช้บ่อยใน NPC Script:

| Type | คืออะไร | ตัวอย่าง |
| :--- | :--- | :--- |
| `Int` | จำนวนเต็ม | `1`, `42`, `-500` |
| `Double` | ทศนิยม | `3.14`, `10.5` |
| `String` | ข้อความ | `"Hello"`, `"NPC"` |
| `Boolean` | จริง/เท็จ | `true`, `false` |

### **Code ตัวอย่าง (Types.kts)**
```kotlin
// Kotlin ฉลาด! มันเดา Type ให้เอง (Type Inference)
val name = "Snail"  // เป็น String อัตโนมัติ
val hp = 50         // เป็น Int อัตโนมัติ
val rate = 1.5      // เป็น Double อัตโนมัติ

// แต่ถ้าอยากประกาศชัดๆ (Explicit Type) ก็ทำได้:
val maxHp: Int = 100
val message: String = "เลือดเหลือ $hp/$maxHp"

sm.sendSayOkay(message)
```

## 🧐 **การแปลงร่าง (Type Casting)**
บางทีเราได้ `String` มาแต่อยากคำนวณเลข หรือได้เลขมาอยากทำเป็นข้อความ

```kotlin
val strNum = "100"
val realNum = strNum.toInt() // แปลง String -> Int

val pi = 3.14
val piText = pi.toString() // แปลง Double -> String

val bigNum = 100
val longNum = bigNum.toLong() // แปลง Int -> Long (ใช้เก็บเลขเยอะๆ เช่น Mesos หรือ EXP)
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เครื่องคิดเลขบวกเลข 5 ปี
1.  ถามอายุผู้เล่น (Input เป็นตัวเลข)
2.  บวกเพิ่มไปอีก 5 (`age + 5`)
3.  แสดงข้อความ "อีก 5 ปี นายจะอายุ [ผลลัพธ์] ปี"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val age = sm.sendAskNumber("ตอนนี้อายุเท่าไหร่?", 18, 1, 100)
val futureAge = age + 5 // คำนวณตรงนี้

sm.sendSayOkay("อีก 5 ปี นายจะอายุ $futureAge ปี... แก่ขึ้นนะเนี่ย!")
```
</details>
