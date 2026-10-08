using System.Diagnostics;
using System.IO;

namespace SwordieLauncher.Services;

public enum LogLevel
{
    Info,
    Warning,
    Error,
    Success,
    Highlight
}

public class ServerProcessManager
{
    private readonly string _projectRoot;
    private Process? _serverProcess;

    public event Action<string, LogLevel>? OnLogReceived;
    public event Action<bool>? OnServerStateChanged;
    public event Action<bool>? OnMariaDbStateChanged;

    public bool IsServerRunning => _serverProcess != null && !_serverProcess.HasExited;
    public int? ServerPid => IsServerRunning ? _serverProcess?.Id : null;
    public int? MariaDbPid
    {
        get
        {
            var procs = Process.GetProcessesByName("mysqld");
            return procs.Length > 0 ? procs[0].Id : null;
        }
    }

    public ServerProcessManager(string projectRoot)
    {
        _projectRoot = projectRoot;
    }

    public void Log(string message, LogLevel level = LogLevel.Info)
    {
        OnLogReceived?.Invoke(message, level);
    }

    public async Task<bool> StartServerAsync()
    {
        if (IsServerRunning)
        {
            Log("[!] Server is already running!", LogLevel.Warning);
            return false;
        }

        // 1. Auto-verify MariaDB is running before server starts
        await EnsureMariaDbRunningAsync();

        // 2. Kill lingering port conflicts on game ports
        Log("[*] Checking and clearing game ports (8484, 8585, 8483, 3000)...", LogLevel.Info);
        PortMonitorService.KillConflictingGamePorts();
        await Task.Delay(500);

        string runBat = Path.Combine(_projectRoot, "tools", "_run.bat");
        if (!File.Exists(runBat))
        {
            Log($"[X] File not found: {runBat}", LogLevel.Error);
            return false;
        }

        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c \"\"{runBat}\"\"",
                WorkingDirectory = _projectRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            _serverProcess = new Process { StartInfo = startInfo, EnableRaisingEvents = true };

            _serverProcess.OutputDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    var level = CategorizeLog(e.Data);
                    Log(e.Data, level);
                }
            };

            _serverProcess.ErrorDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    Log(e.Data, LogLevel.Warning);
                }
            };

            _serverProcess.Exited += (s, e) =>
            {
                Log("[*] Server process has stopped.", LogLevel.Highlight);
                OnServerStateChanged?.Invoke(false);
            };

            _serverProcess.Start();
            _serverProcess.BeginOutputReadLine();
            _serverProcess.BeginErrorReadLine();

            Log($"[OK] Server process started (PID: {_serverProcess.Id})", LogLevel.Success);
            OnServerStateChanged?.Invoke(true);
            return true;
        }
        catch (Exception ex)
        {
            Log($"[X] Failed to launch server: {ex.Message}", LogLevel.Error);
            return false;
        }
    }

    public void StopServer()
    {
        if (!IsServerRunning)
        {
            Log("[*] Server is not running.", LogLevel.Info);
            return;
        }

        try
        {
            Log("[*] Stopping server process...", LogLevel.Info);
            _serverProcess?.Kill(true);
            _serverProcess = null;

            // Also kill Java and game ports
            PortMonitorService.KillConflictingGamePorts();
            Log("[OK] Server stopped successfully.", LogLevel.Success);
            OnServerStateChanged?.Invoke(false);
        }
        catch (Exception ex)
        {
            Log($"[!] Error stopping server: {ex.Message}", LogLevel.Warning);
        }
    }

    public async Task<bool> StartMariaDbAsync()
    {
        string mariadbBat = Path.Combine(_projectRoot, "tools", "_mariadb.bat");
        if (!File.Exists(mariadbBat))
        {
            Log($"[X] File not found: {mariadbBat}", LogLevel.Error);
            return false;
        }

        Log("[*] Starting Portable MariaDB...", LogLevel.Info);
        var result = await RunScriptAsync(mariadbBat, "start");

        OnMariaDbStateChanged?.Invoke(result);
        return result;
    }

    public async Task<bool> StopMariaDbAsync()
    {
        string mariadbBat = Path.Combine(_projectRoot, "tools", "_mariadb.bat");
        if (!File.Exists(mariadbBat)) return false;

        Log("[*] Stopping Portable MariaDB...", LogLevel.Info);
        var result = await RunScriptAsync(mariadbBat, "stop");
        OnMariaDbStateChanged?.Invoke(false);
        return result;
    }

    public async Task<bool> ImportDatabaseAsync()
    {
        string importBat = Path.Combine(_projectRoot, "import_db.bat");
        if (!File.Exists(importBat))
        {
            importBat = Path.Combine(_projectRoot, "tools", "import_db.ps1");
        }

        Log("[*] Starting Database Auto-Import (Base Game)...", LogLevel.Highlight);
        return await RunScriptAsync("powershell", $"-NoProfile -ExecutionPolicy Bypass -File \"{Path.Combine(_projectRoot, "tools", "import_db.ps1")}\" -Auto");
    }

    public async Task<bool> BuildProjectAsync()
    {
        string buildBat = Path.Combine(_projectRoot, "tools", "_build.bat");
        if (!File.Exists(buildBat))
        {
            Log($"[X] Build script not found: {buildBat}", LogLevel.Error);
            return false;
        }

        Log("[*] Building Project with Maven (Offline Portable Repository)...", LogLevel.Highlight);
        Log("    This may take about 1 minute. Please wait...", LogLevel.Info);
        return await RunScriptAsync(buildBat, "");
    }

    private async Task EnsureMariaDbRunningAsync()
    {
        var portChecker = new PortMonitorService();
        var ports = portChecker.CheckPorts();
        var dbPort = ports.FirstOrDefault(p => p.Port == 3306);

        if (dbPort == null || !dbPort.IsListening)
        {
            Log("[*] Database port 3306 is not active. Auto-starting Portable MariaDB...", LogLevel.Info);
            await StartMariaDbAsync();
            await Task.Delay(1500);
        }
        else
        {
            Log("[OK] MariaDB is already active on port 3306.", LogLevel.Success);
        }
    }

    private async Task<bool> RunScriptAsync(string fileName, string arguments)
    {
        try
        {
            var psi = new ProcessStartInfo
            {
                FileName = fileName,
                Arguments = arguments,
                WorkingDirectory = _projectRoot,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var proc = new Process { StartInfo = psi };
            proc.OutputDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    Log(e.Data, CategorizeLog(e.Data));
                }
            };
            proc.ErrorDataReceived += (s, e) =>
            {
                if (!string.IsNullOrEmpty(e.Data))
                {
                    Log(e.Data, LogLevel.Warning);
                }
            };

            proc.Start();
            proc.BeginOutputReadLine();
            proc.BeginErrorReadLine();

            await proc.WaitForExitAsync();
            return proc.ExitCode == 0;
        }
        catch (Exception ex)
        {
            Log($"[X] Script execution failed: {ex.Message}", LogLevel.Error);
            return false;
        }
    }

    private static LogLevel CategorizeLog(string text)
    {
        if (text.Contains("[ERROR]", StringComparison.OrdinalIgnoreCase) || text.Contains("FAILED", StringComparison.OrdinalIgnoreCase) || text.Contains("Exception", StringComparison.OrdinalIgnoreCase))
            return LogLevel.Error;
        if (text.Contains("[WARNING]", StringComparison.OrdinalIgnoreCase) || text.Contains("WARN", StringComparison.OrdinalIgnoreCase))
            return LogLevel.Warning;
        if (text.Contains("SUCCESS", StringComparison.OrdinalIgnoreCase) || text.Contains("[OK]", StringComparison.OrdinalIgnoreCase) || text.Contains("listening on port", StringComparison.OrdinalIgnoreCase) || text.Contains("ready for connections", StringComparison.OrdinalIgnoreCase))
            return LogLevel.Success;
        if (text.Contains("Starting", StringComparison.OrdinalIgnoreCase) || text.Contains("Building", StringComparison.OrdinalIgnoreCase) || text.Contains("===", StringComparison.OrdinalIgnoreCase))
            return LogLevel.Highlight;

        return LogLevel.Info;
    }
}
