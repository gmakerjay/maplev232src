# 🎓 Level 42: จุดเซฟ (Saved Location)

เวลาใช้ใบวาร์ปกลับเมือง (Return Scroll) เกมมันรู้ได้ไงว่าต้องกลับไปไหน?
มันใช้ `SavedLocation` ครับ

## 📜 ภารกิจที่ 44: บันทึกและเรียกใช้จุดเซฟ
อันนี้เป็นระบบลึกของ Swordie ปกติเราไม่ต้องยุ่ง
แต่ถ้าทำ EventMap (เช่น เข้าดันเจี้ยน) เราต้อง Save จุดเดิมไว้ก่อน พอจบดันเจี้ยนจะได้ส่งกลับถูก

*   **Save:** `chr.saveLocation(SavedLocationType.FREE_MARKET)` (บันทึกแมพปัจจุบันไว้ใน Slot FREEMARKET)
*   **Return:** `val mapId = chr.getSavedLocation(SavedLocationType.FREE_MARKET)`

แต่สำหรับ NPC ทั่วไป **ไม่ต้องใช้**
เพราะ `Return Scroll` มันเช็ค `Field.returnMap` จาก WZ Data อยู่แล้ว

---

## 🧐 **การส่งกลับเมือง (Nearest Town)**
ถ้าอยากส่งผู้เล่นกลับเมืองที่ใกล้ที่สุด (เหมือนกดใบวาป):

```kotlin
val returnMap = field.returnMap
sm.warp(returnMap)
```

ง่ายไหม? ไม่ต้องมานั่ง hard code ว่าถ้าอยู่ป่านี้ต้องไปเมืองนี้ ระบบมันรู้เอง

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ใบวาร์ปฉุกเฉิน
1.  NPC ถามว่า "อยากกลับบ้านไหม?"
2.  ถ้า Yes -> ส่งกลับเมือง (ใช้ `field.returnMap`)
3.  ถ้าเมืองเป็น 999999999 (แมพที่ไม่มีเมืองกลับ) ให้บอกว่า "ที่นี่ไม่มีทางกลับ..."

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val ret = field.returnMap

if (ret == 999999999) {
    sm.sendSayOkay("เสียใจด้วย... ที่นี่คือนรกไร้ทางออก")
} else {
    val ok = sm.sendAskYesNo("กลับเมือง ($ret) ไหม?")
    if (ok) sm.warp(ret)
}
```
</details>
