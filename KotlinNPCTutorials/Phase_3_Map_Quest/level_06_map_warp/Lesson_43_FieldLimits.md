# 🎓 Level 43: พื้นที่ต้องห้าม (Field Limits)

บางแมพห้ามกระโดด ห้ามกดสกิล ห้ามเรียกสัตว์เลี้ยง หรือ **ห้ามวาร์ป**!

## 📜 ภารกิจที่ 45: เช็คข้อจำกัดแมพ
`FieldLimit` เป็น Enum ที่บอกว่าแมพนี้ห้ามทำอะไรบ้าง
เราเช็คผ่าน `field.fieldLimit`

แต่ส่วนใหญ่เราจะเช็คว่า **"วาร์ปได้ไหม?"**
เช่น ในคุก หรือใน JUMP QUEST ห้ามใช้สกิลวาร์ปหนี

### **Code ตัวอย่าง (CheckLimit.kts)**
```kotlin
import net.swordie.ms.enums.FieldLimitType

// เช็คว่าแมพนี้ใช้ MysticDoor ได้ไหม
if ((field.fieldLimit and FieldLimitType.MysticDoor.val) != 0) { // Bitwise Check
    sm.sendSayOkay("แมพนี้ห้ามเปิดประตูมิตินะจ๊ะ")
}

// เช็คว่าห้ามวาร์ปออก? (MigrateLimit)
if ((field.fieldLimit and FieldLimitType.MigrateLimit.val) != 0) {
    sm.sendSayOkay("เจ้าติดกับดัก! หนีไปไหนไม่ได้หรอก!")
}
```

---

## 🧐 **คำอธิบาย Bitwise**
`fieldLimit` เป็นตัวเลขรวม (Bitmask) เช่น `001001`
เราเอามา `AND` กับค่าที่เราสงสัย ถ้าได้ผลลัพธ์ไม่เป็น 0 แสดงว่ามีกฎข้อนั้นอยู่

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ไอเทมหนีคุก
1.  เช็คว่าแมพนี้มีกฏ MigrateLimit (ห้ามวาร์ป) ไหม
2.  ถ้ามี -> บอก "หนีไม่ได้!"
3.  ถ้าไม่มี -> วาร์ปไป Henesys

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
import net.swordie.ms.enums.FieldLimitType

val limit = field.fieldLimit
val noWarp = (limit and FieldLimitType.MigrateLimit.val) != 0

if (noWarp) {
    sm.sendSayOkay("ที่นี่มีเวทมนตร์กักขัง... วาร์ปไม่ได้!")
} else {
    sm.warp(100000000)
    sm.sendSayOkay("บ๊ายบาย!")
}
```
</details>
