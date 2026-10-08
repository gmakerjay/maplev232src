package net.swordie.ms.scripts;

import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

import javax.script.Bindings;
import javax.script.Compilable;
import javax.script.CompiledScript;
import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import net.swordie.ms.util.Util;

/**
 * Python Script Engine - ระบบ execute Python scripts (.py)
 * 
 * ใช้ Jython (JSR-223 ScriptEngine) เพื่อให้ทำงานร่วมกับ ScriptManagerImpl
 * ได้อย่างราบรื่น
 * 
 * ตัวอย่างการใช้งาน:
 * - สร้างไฟล์ .py ใน scripts/npc/
 * - ใช้ sm.sendSay(), sm.warp()
 * 
 * @author Swordie Team
 */
public class PythonScriptEngine {

    private static final Logger log = LogManager.getLogger(PythonScriptEngine.class);

    public static final String PYTHON_ENGINE_NAME = "python";
    public static final String PYTHON_EXTENSION = ".py";

    private static ScriptEngine pythonEngine;
    private static final Lock pythonEngineLock = new ReentrantLock();
    private static final Map<String, CompiledScript> pythonScriptCache = new HashMap<>();
    private static final Lock fileLock = new ReentrantLock();

    private static boolean initialized = false;
    private static boolean available = false;

    /**
     * Initialize Python Script Engine
     * เรียกครั้งเดียวตอน server start
     */
    public static void initialize() {
        if (initialized) {
            return;
        }

        pythonEngineLock.lock();
        try {
            log.info("Initializing Python Script Engine (Jython)...");

            ScriptEngineManager manager = new ScriptEngineManager();
            pythonEngine = manager.getEngineByName(PYTHON_ENGINE_NAME);

            if (pythonEngine == null) {
                // ลองหาด้วย extension
                pythonEngine = manager.getEngineByExtension("py");
            }

            if (pythonEngine == null) {
                // ลองหาด้วยชื่ออื่น
                pythonEngine = manager.getEngineByName("jython");
            }

            if (pythonEngine != null) {
                available = true;
                log.info("Python Script Engine (Jython) initialized successfully!");
                log.info("Engine: " + pythonEngine.getFactory().getEngineName() +
                        " v" + pythonEngine.getFactory().getEngineVersion());
            } else {
                available = false;
                log.warn("Python Script Engine is not available. Python NPC scripts (.py) will not work.");
                log.warn("Make sure jython-standalone dependency is included.");
            }

            initialized = true;

        } catch (Exception e) {
            log.error("Failed to initialize Python Script Engine: " + e.getMessage(), e);
            available = false;
        } finally {
            pythonEngineLock.unlock();
        }
    }

    /**
     * ตรวจสอบว่า Python Script Engine พร้อมใช้งานหรือไม่
     */
    public static boolean isAvailable() {
        if (!initialized) {
            initialize();
        }
        return available;
    }

    /**
     * Get the Python ScriptEngine instance
     */
    public static ScriptEngine getEngine() {
        if (!initialized) {
            initialize();
        }
        return pythonEngine;
    }

    /**
     * Execute Python script with bindings
     * 
     * @param scriptPath path to .py file
     * @param bindings   script bindings (sm, chr, field, etc.)
     * @return result of script execution
     */
    public static Object execute(String scriptPath, Bindings bindings) throws ScriptException, IOException {
        if (!isAvailable()) {
            throw new ScriptException("Python Script Engine is not available");
        }

        pythonEngineLock.lock();
        try {
            // ตรวจสอบ cache ก่อน
            CompiledScript cached = pythonScriptCache.get(scriptPath);

            if (cached != null) {
                return cached.eval(bindings);
            }

            // อ่านไฟล์ script
            String scriptContent;
            fileLock.lock();
            try {
                scriptContent = Util.readFile(scriptPath, Charset.defaultCharset());
            } finally {
                fileLock.unlock();
            }

            // Compile และ cache script
            if (pythonEngine instanceof Compilable) {
                try {
                    cached = ((Compilable) pythonEngine).compile(scriptContent);
                    pythonScriptCache.put(scriptPath, cached);
                    log.debug("Compiled and cached Python script: " + scriptPath);
                    return cached.eval(bindings);
                } catch (ScriptException e) {
                    log.warn("Could not compile Python script (will interpret): " + e.getMessage());
                    // Fall through to direct eval
                }
            }

            // Execute directly if compilation failed
            return pythonEngine.eval(scriptContent, bindings);

        } finally {
            pythonEngineLock.unlock();
        }
    }

    /**
     * Execute Python script string directly
     */
    public static Object executeScript(String script, Bindings bindings) throws ScriptException {
        if (!isAvailable()) {
            throw new ScriptException("Python Script Engine is not available");
        }

        pythonEngineLock.lock();
        try {
            return pythonEngine.eval(script, bindings);
        } finally {
            pythonEngineLock.unlock();
        }
    }

    /**
     * Create new bindings for script execution
     */
    public static Bindings createBindings() {
        if (!isAvailable()) {
            return null;
        }
        return pythonEngine.createBindings();
    }

    /**
     * Clear script cache
     * เรียกเมื่อต้องการ reload scripts
     */
    public static void clearCache() {
        pythonEngineLock.lock();
        try {
            pythonScriptCache.clear();
            log.info("Python script cache cleared");
        } finally {
            pythonEngineLock.unlock();
        }
    }

    /**
     * Remove a specific script from cache
     * เรียกเมื่อต้องการ reload script เฉพาะตัว
     */
    public static void removeFromCache(String scriptPath) {
        pythonEngineLock.lock();
        try {
            if (pythonScriptCache.remove(scriptPath) != null) {
                log.info("Removed Python script from cache: " + scriptPath);
            }
        } finally {
            pythonEngineLock.unlock();
        }
    }

    /**
     * Check if a script is cached
     */
    public static boolean isCached(String scriptPath) {
        return pythonScriptCache.containsKey(scriptPath);
    }

    /**
     * Get cache size
     */
    public static int getCacheSize() {
        return pythonScriptCache.size();
    }

    /**
     * Check if a script file exists for Python
     */
    public static boolean scriptExists(String dir, String scriptType, String scriptName) {
        String path = String.format("%s/%s/%s%s", dir, scriptType.toLowerCase(), scriptName, PYTHON_EXTENSION);
        return new File(path).exists();
    }

    /**
     * Get script path for Python script
     */
    public static String getScriptPath(String dir, String scriptType, String scriptName) {
        return String.format("%s/%s/%s%s", dir, scriptType.toLowerCase(), scriptName, PYTHON_EXTENSION);
    }

    /**
     * ตรวจสอบว่าไฟล์นี้เป็น Python script หรือไม่
     */
    public static boolean isPythonScript(String fileName) {
        return fileName != null && fileName.endsWith(PYTHON_EXTENSION);
    }

    /**
     * Get Invocable interface for function calls
     */
    public static Invocable getInvocable() {
        if (!isAvailable()) {
            return null;
        }
        if (pythonEngine instanceof Invocable) {
            return (Invocable) pythonEngine;
        }
        return null;
    }
}
