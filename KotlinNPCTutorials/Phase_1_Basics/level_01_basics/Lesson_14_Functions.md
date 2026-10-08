# 🎓 Level 14: โรงงานผลิตคำสั่ง (Functions)

ถ้าเราต้องเขียนโค้ดซ้ำๆ (เช่น เช็คของ, หักเงิน) ก๊อปวางมันเหนื่อย! สร้างฟังก์ชันใช้เองดีกว่า

## 📜 ภารกิจที่ 18: สร้างฟังก์ชันใช้เอง
Format: `fun ชื่อ(ตัวแปร: Type): ReturnType { ... }`

### **Code ตัวอย่าง (MyFunc.kts)**
```kotlin
// สร้างฟังก์ชัน (ไว้บนสุดหรือล่างสุดของไฟล์ก็ได้)
fun calculateTax(amount: Int): Int {
    return amount * 10 / 100 // ภาษี 10%
}

// ฟังก์ชันแบบย่อ (Single Expression)
fun sayHi(name: String) = sm.sendNext("สวัสดีจ้า $name")

// --- ส่วนทำงานหลัก ---
val price = 1000
val tax = calculateTax(price)

sayHi("ผู้เล่น")
sm.sendSayOkay("สินค้าราคา $price บ. (ภาษี $tax บ.) รวมจ่าย ${price + tax}")
```

---

## 🧐 **ฟังก์ชันที่ return Unit (Void)**
ถ้าฟังก์ชันไม่คืนค่าอะไรเลย ใน Kotlin เรียกว่า `Unit` (เหมือน void ใน Java) ไม่ต้องเขียน Return Type ก็ได้

```kotlin
fun punish() {
    sm.chat("คุณถูกลงโทษ!")
    sm.warp(100000000) // ส่งกลับเมือง
}

// เรียกใช้
punish()
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เครื่องคำนวณราคาขายขยะ (Item Calculator)
1.  สร้างฟังก์ชัน `calcSellPrice(unitPrice: Int, count: Int): Int`
2.  ใน main script ถามผู้เล่นว่า "ชิ้นละกี่บาท?" และ "มีกี่ชิ้น?"
3.  เรียกฟังก์ชันไปคำนวณ
4.  แสดงผลลัพธ์

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
fun calcSellPrice(unitPrice: Int, count: Int): Int {
    return unitPrice * count
}

val p = sm.sendAskNumber("ราคาต่อชิ้น?", 100, 1, 10000)
val c = sm.sendAskNumber("จำนวน?", 1, 1, 999)

val total = calcSellPrice(p, c)
sm.sendSayOkay("ทั้งหมดราคา: $total Meso")
```
</details>
