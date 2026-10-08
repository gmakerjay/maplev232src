# 🎓 Level 10: รายการหรรษา (Lists & Arrays)

ถ้าเรามีไอเทม 100 ชิ้น จะประกาศตัวแปร 100 ตัวก็บ้าแล้ว! มาใช้ List กันดีกว่า

## 📜 ภารกิจที่ 14: เก็บของหลายชิ้นในตัวแปรเดียว
ใน Kotlin มีวิธีเก็บข้อมูลเป็นชุดหลายแบบ แต่ที่ง่ายที่สุดคือ `listOf`

### **Code ตัวอย่าง (List.kts)**
```kotlin
// สร้าง List ของ String (แก้ค่าไม่ได้ - Immutable)
val cities = listOf("Henesys", "Ellinia", "Perion", "Kerning")

// ดึงข้อมูล (เริ่มนับที่ 0)
val city1 = cities[0] // Henesys
val cityLast = cities[3] // Kerning

sm.sendSay("เมืองแรกคือ $city1")

// หาขนาด (Size)
sm.sendSay("มีทั้งหมด ${cities.size} เมือง")

// เช็คว่ามีไหม?
if (cities.contains("Ludibrium")) {
    sm.sendSay("มีเมืองของเล่นด้วย!")
} else {
    sm.sendSay("ไม่มีเมืองของเล่นแฮะ")
}
```

---

## 🧐 **Mutable List (ลิสต์ที่แก้ค่าได้)**
ถ้าอยากเพิ่ม/ลบของทีหลัง ต้องใช้ `mutableListOf`

```kotlin
val cart = mutableListOf("Red Potion", "Blue Potion")

cart.add("Orange Potion") // เพิ่ม
cart.remove("Red Potion") // ลบ

sm.sendSay("ในตะกร้าตอนนี้มี: $cart") // พิมพ์ออกมาทั้งก้อนเลย
```

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ตู้ Gachapon (แบบบ้านๆ)
1.  สร้าง List ของรางวัล 3 ชิ้น (เช่น "Sword", "Bow", "Staff")
2.  ให้ NPC บอกว่า "ในตู้มีของ 3 อย่างนะ คือ..." (เอาข้อมูลจาก List มาโชว์)
3.  ถามผู้เล่นว่าอยากดูชิ้นที่เท่าไหร่ (1-3)
4.  แสดงชื่อของชิ้นนั้น (ระวัง! ผู้เล่นพิมพ์ 1 แต่ List เริ่มที่ 0 ต้องคูณ/ลบเลขให้ถูก)

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val rewards = listOf("Sword", "Bow", "Staff")

sm.sendNext("ในตู้มี ${rewards.size} อย่างนะ")
val index = sm.sendAskNumber("อยากดูชิ้นไหน? (1-3)", 1, 1, 3)

// ผู้เล่นพิมพ์ 1 -> เราต้องเรียก rewards[0]
val item = rewards[index - 1] 

sm.sendSayOkay("ชิ้นที่ $index คือ $item จ้า!")
```
</details>
