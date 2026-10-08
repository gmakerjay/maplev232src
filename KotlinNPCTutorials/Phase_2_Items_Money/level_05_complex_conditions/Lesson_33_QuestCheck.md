# 🎓 Level 33: เริ่มต้นผจญภัย (Quest Checking)

การเขียน Quest ใน NPC Script (โดยไม่ใช้ไฟล์ Quest Data) คือทางเลือกที่ยืดหยุ่นกว่า!

## 📜 ภารกิจที่ 36: เช็คสถานะเควส
เราต้องเข้าถึง `QuestManager` ในตัว `chr`
*   `sm.hasQuest(questID)`: มีเควสนี้ไหม (ไม่ว่าสถานะไหน)
*   `sm.isQuestCompleted(questID)`: ทำจบหรือยัง
*   `sm.isQuestActive(questID)`: กำลังทำอยู่ไหม

### **Code ตัวอย่าง (CheckQuest.kts)**
```kotlin
val questID = 1001

if (sm.isQuestCompleted(questID)) {
    sm.sendSayOkay("ขอบใจที่ช่วยฉันเมื่อคราวก่อนนะ (จบเควสแล้ว)")
} else if (sm.isQuestActive(questID)) {
    sm.sendSayOkay("งานที่สั่งไปถึงไหนแล้ว? (กำลังทำ)")
} else {
    sm.sendNext("ฉันมีงานให้ทำ... สนใจไหม? (ยังไม่เริ่ม)")
}
```

---

## 🧐 **Quest ID ใช้อะไรดี?**
*   ควรใช้เลขเยอะๆ (เช่น 990000+) เพื่อไม่ให้ชนกับเควสหลักของเกม
*   จดไว้ด้วยนะว่าเลขไหนคือเควสอะไร ไม่งั้นงงตาย

---

## ✍️ **แบบฝึกหัดท้าประลอง (Challenge)**

**โจทย์:** ยามเฝ้าประตู (อีกแล้ว)
1.  ถ้าจบเควส 1001 แล้ว -> "ผ่านได้เลยครับนายท่าน"
2.  ถ้ายังไม่จบ -> "กลับไปคุยกับหัวหน้ายามก่อน!"

**เฉลย:**
<details>
<summary>คลิกเพื่อดูเฉลย</summary>

```kotlin
val qID = 1001

if (sm.isQuestCompleted(qID)) {
    sm.sendSayOkay("ผ่านได้! (Completed)")
} else {
    sm.sendSayOkay("เจ้ายังไม่ได้รับอนุญาต! (Not Completed)")
}
```
</details>
