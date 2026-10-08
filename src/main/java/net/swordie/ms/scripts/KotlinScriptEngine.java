package net.swordie.ms.scripts;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.script.*;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import net.swordie.ms.util.Util;

/**
 * Kotlin Script Engine - ระบบ execute Kotlin scripts (.kts)
 * 
 * ใช้ JSR-223 ScriptEngine interface เพื่อให้ทำงานร่วมกับ ScriptManagerImpl
 * ได้อย่างราบรื่น
 * 
 * ตัวอย่างการใช้งาน:
 * - สร้างไฟล์ .kts ใน scripts/npc/ เหมือน .py
 * - ใช้ sm.sendSay(), sm.warp() เหมือน Python scripts
 * 
 * @author Swordie Team
 */
public class KotlinScriptEngine {

    private static final Logger log = LogManager.getLogger(KotlinScriptEngine.class);

    public static final String KOTLIN_ENGINE_NAME = "kotlin";
    public static final String KOTLIN_EXTENSION = ".kts";

    private static ScriptEngine kotlinEngine;
    private static final Lock kotlinEngineLock = new ReentrantLock();
    private static final Map<String, CompiledScript> kotlinScriptCache = new HashMap<>();
    private static final Lock fileLock = new ReentrantLock();

    private static boolean initialized = false;
    private static boolean available = false;

    /**
     * Initialize Kotlin Script Engine
     * เรียกครั้งเดียวตอน server start
     */
    public static void initialize() {
        if (initialized) {
            return;
        }

        kotlinEngineLock.lock();
        try {
            log.info("Initializing Kotlin Script Engine...");

            ScriptEngineManager manager = new ScriptEngineManager();
            kotlinEngine = manager.getEngineByExtension("kts");

            if (kotlinEngine == null) {
                // ลองหาด้วย name
                kotlinEngine = manager.getEngineByName("kotlin");
            }

            if (kotlinEngine != null) {
                available = true;
                log.info("Kotlin Script Engine initialized successfully!");
                log.info("Engine: " + kotlinEngine.getFactory().getEngineName() +
                        " v" + kotlinEngine.getFactory().getEngineVersion());
            } else {
                available = false;
                log.warn("Kotlin Script Engine is not available. Kotlin NPC scripts (.kts) will not work.");
                log.warn("Make sure kotlin-scripting-jsr223 dependency is included.");
            }

            initialized = true;

        } catch (Exception e) {
            log.error("Failed to initialize Kotlin Script Engine: " + e.getMessage(), e);
            available = false;
        } finally {
            kotlinEngineLock.unlock();
        }
    }

    /**
     * ตรวจสอบว่า Kotlin Script Engine พร้อมใช้งานหรือไม่
     */
    public static boolean isAvailable() {
        if (!initialized) {
            initialize();
        }
        return available;
    }

    /**
     * Get the Kotlin ScriptEngine instance
     */
    public static ScriptEngine getEngine() {
        if (!initialized) {
            initialize();
        }
        return kotlinEngine;
    }

    /**
     * Execute Kotlin script with bindings
     * 
     * @param scriptPath path to .kts file
     * @param bindings   script bindings (sm, chr, field, etc.)
     * @return result of script execution
     */
    public static Object execute(String scriptPath, Bindings bindings) throws ScriptException, IOException {
        if (!isAvailable()) {
            throw new ScriptException("Kotlin Script Engine is not available");
        }

        kotlinEngineLock.lock();
        try {
            String scriptContent;

            // อ่านไฟล์ script
            fileLock.lock();
            try {
                scriptContent = Util.readFile(scriptPath, Charset.defaultCharset());
            } finally {
                fileLock.unlock();
            }

            // ตรวจสอบ cache
            CompiledScript cached = kotlinScriptCache.get(scriptPath);

            if (cached == null && kotlinEngine instanceof Compilable) {
                // Compile และ cache script
                try {
                    cached = ((Compilable) kotlinEngine).compile(scriptContent);
                    kotlinScriptCache.put(scriptPath, cached);
                    log.debug("Compiled and cached Kotlin script: " + scriptPath);
                } catch (ScriptException e) {
                    log.warn("Could not compile Kotlin script (will interpret): " + e.getMessage());
                }
            }

            // Execute
            if (cached != null) {
                return cached.eval(bindings);
            } else {
                return kotlinEngine.eval(scriptContent, bindings);
            }

        } finally {
            kotlinEngineLock.unlock();
        }
    }

    /**
     * Execute Kotlin script string directly
     */
    public static Object executeScript(String script, Bindings bindings) throws ScriptException {
        if (!isAvailable()) {
            throw new ScriptException("Kotlin Script Engine is not available");
        }

        kotlinEngineLock.lock();
        try {
            return kotlinEngine.eval(script, bindings);
        } finally {
            kotlinEngineLock.unlock();
        }
    }

    /**
     * Create new bindings for script execution
     */
    public static Bindings createBindings() {
        if (!isAvailable()) {
            return null;
        }
        return kotlinEngine.createBindings();
    }

    /**
     * Clear script cache
     * เรียกเมื่อต้องการ reload scripts
     */
    public static void clearCache() {
        kotlinEngineLock.lock();
        try {
            kotlinScriptCache.clear();
            log.info("Kotlin script cache cleared");
        } finally {
            kotlinEngineLock.unlock();
        }
    }

    /**
     * Check if a script is cached
     */
    public static boolean isCached(String scriptPath) {
        return kotlinScriptCache.containsKey(scriptPath);
    }

    /**
     * Get cache size
     */
    public static int getCacheSize() {
        return kotlinScriptCache.size();
    }

    /**
     * Check if a script file exists for Kotlin
     */
    public static boolean scriptExists(String dir, String scriptType, String scriptName) {
        String path = String.format("%s/%s/%s%s", dir, scriptType.toLowerCase(), scriptName, KOTLIN_EXTENSION);
        return new File(path).exists();
    }

    /**
     * Get script path for Kotlin script
     */
    public static String getScriptPath(String dir, String scriptType, String scriptName) {
        return String.format("%s/%s/%s%s", dir, scriptType.toLowerCase(), scriptName, KOTLIN_EXTENSION);
    }

    /**
     * ตรวจสอบว่าไฟล์นี้เป็น Kotlin script หรือไม่
     */
    public static boolean isKotlinScript(String fileName) {
        return fileName != null && fileName.endsWith(KOTLIN_EXTENSION);
    }

    /**
     * List all available ScriptEngines (for debugging)
     */
    public static void listAvailableEngines() {
        ScriptEngineManager manager = new ScriptEngineManager();
        log.info("=== Available Script Engines ===");
        for (ScriptEngineFactory factory : manager.getEngineFactories()) {
            log.info(String.format("Engine: %s (%s) - Language: %s (%s)",
                    factory.getEngineName(),
                    factory.getEngineVersion(),
                    factory.getLanguageName(),
                    factory.getLanguageVersion()));
            log.info("  Extensions: " + factory.getExtensions());
            log.info("  MIME types: " + factory.getMimeTypes());
            log.info("  Names: " + factory.getNames());
        }
        log.info("================================");
    }
}
