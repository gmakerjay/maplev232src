# 🎓 Level 13: หลุมดำพันล้าน (Null Safety)

ใน Java ถ้าค่าเป็น Null แล้วเราไปใช้มัน... **Booooom! NullPointerException** เกม Crash!
แต่ใน Kotlin เรามี **"Safe Call"** (`?`) มาช่วยชีวิต

## 📜 ภารกิจที่ 17: ตัวแปรที่มีโอกาสว่างเปล่า
สมมติฟังก์ชัน `getItemName(id)` อาจจะคืนค่ากลับมาเป็นชื่อ หรือ `null` (หาไม่เจอ)

### **Code ตัวอย่าง (NullSafety.kts)**
```kotlin
// ใน Kotlin ถ้าตัวแปรมีสิทธิ์เป็น Null ต้องใส่ ? ต่อท้าย Type
var girlfriend: String? = null 

// 1. Safe Call (?.)
// ถ้า girlfriend เป็น null มันจะไม่ทำ .length แต่จะคืนค่า null แทน (ไม่ Error)
val len = girlfriend?.length 

// 2. Elvis Operator (?:)
// ถ้าข้างซ้ายเป็น null ให้ใช้ค่าข้างขวาแทน (Default Value)
val name = girlfriend ?: "ไม่มีแฟนครับ (โสด)"

sm.sendSayOkay("สถานะ: $name")
```

---

## 🧐 **!! (Double Bang Operator)**
อันนี้คือโหมดวัดใจ "กูมั่นใจว่าไม่ Null หรอก! บังคับแปลงเลย!"
ถ้ามัน Null ขึ้นมาจริงๆ... **Server Crash** นะจ๊ะ 
> **คำเตือน:** อย่าใช้ถ้าไม่จำเป็นจริงๆ

```kotlin
val sure = girlfriend!! // ถ้า null -> ตู้ม!
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** เช็คกิลด์ (Guild Check)
1.  เรียก `chr.getGuild()` 
2.  ค่านี้อาจเป็น `null` ได้ (ถ้าผู้เล่นไม่มีกิลด์)
3.  ถ้ามีกิลด์ ให้แสดงชื่อกิลด์
4.  ถ้าไม่มี ให้แสดงว่า "คนไร้สังกัด"
5.  ห้ามใช้ `if/else` แบบปกติ ให้ใช้ `?.` และ `?:` เท่านั้น!

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
// สมมติ chr.getGuild() คืนค่า Guild Object หรือ Null
val guild = chr.getGuild()

// ดึงชื่อ (ถ้ากิลด์ไม่ null) หรือใช้ค่า default
val gName = guild?.getName() ?: "คนไร้สังกัด"

sm.sendSayOkay("สังกัดของคุณ: $gName")
```
</details>
