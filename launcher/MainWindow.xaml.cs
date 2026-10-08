using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Documents;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using SwordieLauncher.Models;
using SwordieLauncher.Services;

namespace SwordieLauncher;

public partial class MainWindow : Window
{
    private readonly string _projectRoot;
    private readonly PortMonitorService _portMonitor;
    private readonly ServerProcessManager _processManager;
    private readonly DistributionService _distService;
    private readonly DispatcherTimer _portTimer;
    private DatabaseConfig _currentConfig = new();

    public MainWindow()
    {
        InitializeComponent();

        _projectRoot = ConfigService.FindProjectRoot();
        _portMonitor = new PortMonitorService();
        _processManager = new ServerProcessManager(_projectRoot);
        _distService = new DistributionService(_projectRoot);

        // Load Background Image
        LoadBackgroundImage();

        // Bind process manager logs to embedded console
        _processManager.OnLogReceived += ProcessManager_OnLogReceived;
        _processManager.OnServerStateChanged += ProcessManager_OnServerStateChanged;
        _processManager.OnMariaDbStateChanged += ProcessManager_OnMariaDbStateChanged;

        // Load configuration
        LoadConfiguration();

        // Setup Port Monitor Timer (every 2.5 seconds)
        _portTimer = new DispatcherTimer
        {
            Interval = TimeSpan.FromSeconds(2.5)
        };
        _portTimer.Tick += (s, e) => CheckPorts();
        _portTimer.Start();

        // Initial port check
        CheckPorts();

        _processManager.Log("==================================================", LogLevel.Highlight);
        _processManager.Log("  SwordieMS v232 — Server Control Center Ready", LogLevel.Highlight);
        _processManager.Log($"  Project Root: {_projectRoot}", LogLevel.Info);
        _processManager.Log("==================================================", LogLevel.Highlight);
    }

    private void LoadBackgroundImage()
    {
        try
        {
            string bgPath = Path.Combine(_projectRoot, "bgasset.jpg");
            if (File.Exists(bgPath))
            {
                var bitmap = new BitmapImage();
                bitmap.BeginInit();
                bitmap.UriSource = new Uri(bgPath, UriKind.Absolute);
                bitmap.CacheOption = BitmapCacheOption.OnLoad;
                bitmap.EndInit();
                BgImage.Source = bitmap;
            }
        }
        catch
        {
            // Fallback to solid background
        }
    }

    private void LoadConfiguration()
    {
        _currentConfig = ConfigService.LoadConfig(_projectRoot);
        TxtDbHost.Text = _currentConfig.Host;
        TxtDbPort.Text = _currentConfig.Port.ToString();
        TxtDbUser.Text = _currentConfig.User;
        TxtDbPass.Text = _currentConfig.Password;
        TxtDbName.Text = _currentConfig.Name;
        TxtLoginPort.Text = _currentConfig.LoginPort.ToString();
        TxtChannelPort.Text = _currentConfig.ChannelPort.ToString();
        TxtApiPort.Text = _currentConfig.ApiPort.ToString();
    }

    private void CheckPorts()
    {
        try
        {
            var ports = _portMonitor.CheckPorts(_processManager.ServerPid, _processManager.MariaDbPid);
            LvPorts.ItemsSource = ports;

            // MariaDB Status Badge
            var mariaPort = ports.FirstOrDefault(p => p.Port == 3306);
            bool isDbRunning = mariaPort != null && mariaPort.IsListening;
            LedMariaDb.Fill = new SolidColorBrush(isDbRunning ? Color.FromRgb(16, 185, 129) : Color.FromRgb(239, 68, 68));
            TxtMariaDbBadge.Text = isDbRunning ? "MariaDB: Active (3306)" : "MariaDB: Inactive";

            // Server Status Badge
            bool isServerRunning = _processManager.IsServerRunning;
            LedServer.Fill = new SolidColorBrush(isServerRunning ? Color.FromRgb(16, 185, 129) : Color.FromRgb(239, 68, 68));
            TxtServerBadge.Text = isServerRunning ? "Server: Running" : "Server: Stopped";

            // Port Conflict Badge & Alert Banner
            var conflicts = ports.Where(p => p.IsConflict).ToList();
            if (conflicts.Count > 0)
            {
                LedConflict.Fill = new SolidColorBrush(Color.FromRgb(239, 68, 68));
                TxtConflictBadge.Text = $"Conflict: {conflicts.Count} Port(s)";

                var conflictDesc = string.Join(", ", conflicts.Select(c => $"Port {c.Port} ({c.ProcessName} PID: {c.ProcessId})"));
                TxtConflictMessage.Text = $"ตรวจพบพอร์ตชน: {conflictDesc}";
                ConflictAlertBanner.Visibility = Visibility.Visible;
            }
            else
            {
                LedConflict.Fill = new SolidColorBrush(Color.FromRgb(16, 185, 129));
                TxtConflictBadge.Text = "Ports: Clear";
                ConflictAlertBanner.Visibility = Visibility.Collapsed;
            }
        }
        catch (Exception ex)
        {
            try { File.AppendAllText("launcher_startup.log", $"CheckPorts exception: {ex}\n"); } catch { }
        }
    }

    private void ProcessManager_OnLogReceived(string line, LogLevel level)
    {
        Dispatcher.Invoke(() =>
        {
            var p = new Paragraph { Margin = new Thickness(0, 1, 0, 1) };
            var run = new Run(line);

            switch (level)
            {
                case LogLevel.Success:
                    run.Foreground = new SolidColorBrush(Color.FromRgb(52, 211, 153)); // Emerald
                    break;
                case LogLevel.Warning:
                    run.Foreground = new SolidColorBrush(Color.FromRgb(251, 191, 36));  // Amber
                    break;
                case LogLevel.Error:
                    run.Foreground = new SolidColorBrush(Color.FromRgb(248, 113, 113)); // Red
                    break;
                case LogLevel.Highlight:
                    run.Foreground = new SolidColorBrush(Color.FromRgb(192, 132, 252)); // Purple
                    break;
                default:
                    run.Foreground = new SolidColorBrush(Color.FromRgb(148, 163, 184)); // Slate
                    break;
            }

            p.Inlines.Add(run);
            RtbConsole.Document.Blocks.Add(p);

            // Cap buffer at 2000 lines for performance
            if (RtbConsole.Document.Blocks.Count > 2000)
            {
                RtbConsole.Document.Blocks.Remove(RtbConsole.Document.Blocks.FirstBlock);
            }

            if (ChkAutoScroll.IsChecked == true)
            {
                RtbConsole.ScrollToEnd();
            }
        });
    }

    private void ProcessManager_OnServerStateChanged(bool isRunning)
    {
        Dispatcher.Invoke(() =>
        {
            TxtFooterStatus.Text = isRunning ? "🎮 เซิร์ฟเวอร์กำลังทำงาน (Server Online)..." : "เซิร์ฟเวอร์หยุดทำงานแล้ว";
            CheckPorts();
        });
    }

    private void ProcessManager_OnMariaDbStateChanged(bool isRunning)
    {
        Dispatcher.Invoke(() =>
        {
            CheckPorts();
        });
    }

    // Category Tabs Switching
    private void CategoryTab_Checked(object sender, RoutedEventArgs e)
    {
        if (ViewTasks == null || ViewConsole == null || ViewConfig == null || ViewDiagnostics == null || ViewDistribution == null)
            return;

        ViewTasks.Visibility = Visibility.Collapsed;
        ViewConsole.Visibility = Visibility.Collapsed;
        ViewConfig.Visibility = Visibility.Collapsed;
        ViewDiagnostics.Visibility = Visibility.Collapsed;
        ViewDistribution.Visibility = Visibility.Collapsed;

        if (TabTasks.IsChecked == true) ViewTasks.Visibility = Visibility.Visible;
        else if (TabConsole.IsChecked == true) ViewConsole.Visibility = Visibility.Visible;
        else if (TabConfig.IsChecked == true) ViewConfig.Visibility = Visibility.Visible;
        else if (TabDiagnostics.IsChecked == true) ViewDiagnostics.Visibility = Visibility.Visible;
        else if (TabDistribution.IsChecked == true) ViewDistribution.Visibility = Visibility.Visible;
    }

    // Action Buttons
    private async void BtnStartServer_Click(object sender, RoutedEventArgs e)
    {
        TabConsole.IsChecked = true;
        TxtFooterStatus.Text = "กำลังเริ่มต้นระบบเซิร์ฟเวอร์...";
        await _processManager.StartServerAsync();
    }

    private void BtnStopServer_Click(object sender, RoutedEventArgs e)
    {
        _processManager.StopServer();
        TxtFooterStatus.Text = "หยุดการทำงานของเซิร์ฟเวอร์แล้ว";
    }

    private async void BtnStartMariaDb_Click(object sender, RoutedEventArgs e)
    {
        TxtFooterStatus.Text = "กำลังเปิดบริการ Portable MariaDB...";
        await _processManager.StartMariaDbAsync();
        CheckPorts();
    }

    private async void BtnStopMariaDb_Click(object sender, RoutedEventArgs e)
    {
        TxtFooterStatus.Text = "กำลังปิดบริการ MariaDB...";
        await _processManager.StopMariaDbAsync();
        CheckPorts();
    }

    private async void BtnImportDb_Click(object sender, RoutedEventArgs e)
    {
        TabConsole.IsChecked = true;
        TxtFooterStatus.Text = "กำลังนำเข้าฐานข้อมูลเริ่มต้น...";
        await _processManager.ImportDatabaseAsync();
        TxtFooterStatus.Text = "นำเข้าฐานข้อมูลเสร็จสิ้น";
    }

    private async void BtnBuildProject_Click(object sender, RoutedEventArgs e)
    {
        TabConsole.IsChecked = true;
        TxtFooterStatus.Text = "กำลังคอมไพล์โปรเจกต์ด้วย Maven...";
        await _processManager.BuildProjectAsync();
        TxtFooterStatus.Text = "คอมไพล์โปรเจกต์เสร็จสิ้น";
    }

    private void BtnExportDistribution_Click(object sender, RoutedEventArgs e)
    {
        TabDistribution.IsChecked = true;
    }

    private void BtnSaveConfig_Click(object sender, RoutedEventArgs e)
    {
        _currentConfig.Host = TxtDbHost.Text.Trim();
        if (int.TryParse(TxtDbPort.Text, out int port)) _currentConfig.Port = port;
        _currentConfig.User = TxtDbUser.Text.Trim();
        _currentConfig.Password = TxtDbPass.Text.Trim();
        _currentConfig.Name = TxtDbName.Text.Trim();

        if (ConfigService.SaveConfig(_projectRoot, _currentConfig, out string message))
        {
            TxtConfigAlert.Text = message;
            ConfigSavedAlert.Visibility = Visibility.Visible;
            TxtFooterStatus.Text = "บันทึกการตั้งค่าลง resources/db.properties สำเร็จ";
            _processManager.Log($"[OK] {message}", LogLevel.Success);
        }
        else
        {
            MessageBox.Show(message, "Error", MessageBoxButton.OK, MessageBoxImage.Error);
        }
    }

    private void BtnReloadConfig_Click(object sender, RoutedEventArgs e)
    {
        LoadConfiguration();
        TxtFooterStatus.Text = "โหลดการตั้งค่าล่าสุดจากไฟล์เรียบร้อย";
        _processManager.Log("[*] Configuration reloaded from resources/db.properties", LogLevel.Info);
    }

    private void BtnRefreshPorts_Click(object sender, RoutedEventArgs e)
    {
        CheckPorts();
        TxtFooterStatus.Text = "ตรวจสอบสถานะพอร์ตล่าสุดเรียบร้อย";
    }

    private void BtnKillConflict_Click(object sender, RoutedEventArgs e)
    {
        PortMonitorService.KillConflictingGamePorts();
        CheckPorts();
        TxtFooterStatus.Text = "เคลียร์โปรเซสพอร์ตชนเรียบร้อยแล้ว";
    }

    private void BtnKillAllPorts_Click(object sender, RoutedEventArgs e)
    {
        PortMonitorService.KillConflictingGamePorts();
        CheckPorts();
        _processManager.Log("[OK] All conflicting game ports cleared.", LogLevel.Success);
    }

    private void BtnDismissAlert_Click(object sender, RoutedEventArgs e)
    {
        ConflictAlertBanner.Visibility = Visibility.Collapsed;
    }

    private async void BtnExecuteExport_Click(object sender, RoutedEventArgs e)
    {
        string targetDir = TxtDistTarget.Text.Trim();
        if (string.IsNullOrEmpty(targetDir)) targetDir = "dist_release";

        TabConsole.IsChecked = true;
        TxtDistStatus.Text = "กำลังสร้างชุดแจกจ่าย (Exporting)...";
        TxtFooterStatus.Text = "กำลังสร้างชุดแจกจ่าย...";

        var (success, message) = await _distService.ExportDistributionPackageAsync(targetDir, line =>
        {
            _processManager.Log(line, LogLevel.Info);
        });

        if (success)
        {
            TxtDistStatus.Text = "สร้างชุดแจกจ่ายสำเร็จเรียบร้อย!";
            _processManager.Log($"[SUCCESS] {message}", LogLevel.Success);
            MessageBox.Show(message, "Distribution Package Created", MessageBoxButton.OK, MessageBoxImage.Information);
        }
        else
        {
            TxtDistStatus.Text = $"เกิดข้อผิดพลาด: {message}";
            _processManager.Log($"[ERROR] {message}", LogLevel.Error);
            MessageBox.Show(message, "Export Error", MessageBoxButton.OK, MessageBoxImage.Warning);
        }
    }

    private void BtnClearLog_Click(object sender, RoutedEventArgs e)
    {
        RtbConsole.Document.Blocks.Clear();
    }

    private void BtnCopyLog_Click(object sender, RoutedEventArgs e)
    {
        var textRange = new TextRange(RtbConsole.Document.ContentStart, RtbConsole.Document.ContentEnd);
        Clipboard.SetText(textRange.Text);
        MessageBox.Show("คัดลอก Log ทั้งหมดลง Clipboard แล้ว", "Log Copied", MessageBoxButton.OK, MessageBoxImage.Information);
    }

    private void BtnTray_Click(object sender, RoutedEventArgs e)
    {
        WindowState = WindowState.Minimized;
    }

    private async void BtnStartAll_Click(object sender, RoutedEventArgs e)
    {
        TabConsole.IsChecked = true;
        TxtFooterStatus.Text = "กำลังเปิดบริการทั้งหมด (MariaDB + Server)...";
        await _processManager.StartMariaDbAsync();
        await _processManager.StartServerAsync();
    }

    private void BtnStopAll_Click(object sender, RoutedEventArgs e)
    {
        _processManager.StopServer();
        _ = _processManager.StopMariaDbAsync();
        PortMonitorService.KillConflictingGamePorts();
        TxtFooterStatus.Text = "หยุดการทำงานของบริการทั้งหมดแล้ว";
    }

    private void BtnExit_Click(object sender, RoutedEventArgs e)
    {
        _processManager.StopServer();
        Close();
    }

    protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
    {
        _portTimer.Stop();
        if (_processManager.IsServerRunning)
        {
            var result = MessageBox.Show("เซิร์ฟเวอร์กำลังทำงานอยู่ คุณต้องการปิดเซิร์ฟเวอร์ก่อนออกจากโปรแกรมหรือไม่?",
                "Confirm Exit", MessageBoxButton.YesNoCancel, MessageBoxImage.Question);

            if (result == MessageBoxResult.Cancel)
            {
                e.Cancel = true;
                return;
            }
            if (result == MessageBoxResult.Yes)
            {
                _processManager.StopServer();
            }
        }
        base.OnClosing(e);
    }
}