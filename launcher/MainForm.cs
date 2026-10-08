using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Forms;
using SwordieLauncher.Models;
using SwordieLauncher.Services;

namespace SwordieLauncher;

public class MainForm : Form
{
    private readonly string _projectRoot;
    private readonly PortMonitorService _portMonitor;
    private readonly ServerProcessManager _processManager;
    private readonly DistributionService _distService;
    private readonly System.Windows.Forms.Timer _portTimer;
    private DatabaseConfig _currentConfig = new();

    // Top Header & Alert Controls
    private Panel _pnlHeader = null!;
    private Label _lblHeaderTitle = null!;
    private Label _lblHeaderSubtitle = null!;
    private Panel _pnlConflictAlert = null!;
    private Label _lblConflictText = null!;
    private Button _btnKillConflict = null!;
    private Button _btnKillAllConflicts = null!;

    // Category Buttons (Left Column)
    private Button _btnCatIntegrate = null!;
    private Button _btnCatTerminal = null!;
    private Button _btnCatSetup = null!;
    private Button _btnCatDiagnose = null!;
    private Button _btnCatCreate = null!;

    // View Panels
    private Panel _pnlContentArea = null!;
    private Panel _viewTasks = null!;
    private Panel _viewConsole = null!;
    private Panel _viewConfig = null!;
    private Panel _viewDiagnostics = null!;
    private Panel _viewDistribution = null!;

    // Task Buttons (Exact nLite Style)
    private Button _btnTaskServer = null!;
    private Button _btnTaskMariaDb = null!;
    private Button _btnTaskBuild = null!;
    private Button _btnTaskImportDb = null!;
    private Button _btnTaskConfig = null!;
    private Button _btnTaskConsole = null!;
    private Button _btnTaskDiagnostics = null!;
    private Button _btnTaskDistribution = null!;

    // Console View Controls
    private RichTextBox _rtbConsole = null!;
    private CheckBox _chkAutoScroll = null!;
    private Button _btnClearLog = null!;
    private Button _btnCopyLog = null!;

    // Config View Controls
    private TextBox _txtDbHost = null!;
    private TextBox _txtDbPort = null!;
    private TextBox _txtDbUser = null!;
    private TextBox _txtDbPass = null!;
    private TextBox _txtDbName = null!;
    private TextBox _txtLoginPort = null!;
    private TextBox _txtChannelPort = null!;
    private TextBox _txtApiPort = null!;
    private Label _lblConfigStatus = null!;

    // Diagnostics View Controls
    private ListView _lvPorts = null!;
    private Button _btnRefreshPorts = null!;

    // Distribution View Controls
    private TextBox _txtDistTarget = null!;
    private Label _lblDistStatus = null!;
    private Button _btnStartExport = null!;

    // Bottom Wizard Bar
    private Label _lblFooterStatus = null!;
    private Label _lblMariaStatus = null!;
    private Label _lblServerStatus = null!;
    private Button _btnTray = null!;
    private Button _btnBack = null!;
    private Button _btnNext = null!;
    private Button _btnExit = null!;

    public MainForm()
    {
        _projectRoot = ConfigService.FindProjectRoot();
        _portMonitor = new PortMonitorService();
        _processManager = new ServerProcessManager(_projectRoot);
        _distService = new DistributionService(_projectRoot);

        InitializeComponents();

        // Process Manager Events
        _processManager.OnLogReceived += ProcessManager_OnLogReceived;
        _processManager.OnServerStateChanged += ProcessManager_OnServerStateChanged;
        _processManager.OnMariaDbStateChanged += ProcessManager_OnMariaDbStateChanged;

        // Load configuration from db.properties
        LoadConfiguration();

        // Setup Port Monitor Timer (every 2.5 seconds)
        _portTimer = new System.Windows.Forms.Timer
        {
            Interval = 2500
        };
        _portTimer.Tick += (s, e) => CheckPorts();
        _portTimer.Start();

        // Initial port check
        CheckPorts();

        // Initial log
        _processManager.Log("==================================================", LogLevel.Highlight);
        _processManager.Log("  SwordieMS - Server Control Center (Classic)", LogLevel.Highlight);
        _processManager.Log($"  Project Root: {_projectRoot}", LogLevel.Info);
        _processManager.Log("==================================================", LogLevel.Highlight);
    }

    private void InitializeComponents()
    {
        SuspendLayout();

        Text = "SwordieMS - Server Control Center";
        Size = new Size(1000, 720);
        MinimumSize = new Size(940, 660);
        StartPosition = FormStartPosition.CenterScreen;
        Font = new Font("Tahoma", 9F, FontStyle.Regular);
        BackColor = Color.FromArgb(236, 233, 216); // Classic Windows XP Luna Dialog Background

        // Try load bgasset.jpg as background
        string bgPath = Path.Combine(_projectRoot, "bgasset.jpg");
        if (File.Exists(bgPath))
        {
            try
            {
                BackgroundImage = Image.FromFile(bgPath);
                BackgroundImageLayout = ImageLayout.Stretch;
            }
            catch { }
        }

        // 1. Top Luna Blue Header Banner
        _pnlHeader = new Panel
        {
            Dock = DockStyle.Top,
            Height = 74
        };
        _pnlHeader.Paint += PnlHeader_Paint;

        _lblHeaderTitle = new Label
        {
            Text = "Task Selection",
            Font = new Font("Tahoma", 12F, FontStyle.Bold),
            ForeColor = Color.White,
            BackColor = Color.Transparent,
            Location = new Point(20, 12),
            AutoSize = true
        };
        _lblHeaderSubtitle = new Label
        {
            Text = "Choose the tasks you wish to perform. Click any item below to manage, configure, or run server components.",
            Font = new Font("Tahoma", 8.5F, FontStyle.Regular),
            ForeColor = Color.FromArgb(220, 235, 255),
            BackColor = Color.Transparent,
            Location = new Point(22, 38),
            Size = new Size(720, 24)
        };
        var lblLogo = new Label
        {
            Text = "SwordieMS",
            Font = new Font("Trebuchet MS", 16F, FontStyle.Bold | FontStyle.Italic),
            ForeColor = Color.FromArgb(180, 210, 255),
            BackColor = Color.Transparent,
            Location = new Point(830, 20),
            AutoSize = true
        };
        _pnlHeader.Controls.Add(_lblHeaderTitle);
        _pnlHeader.Controls.Add(_lblHeaderSubtitle);
        _pnlHeader.Controls.Add(lblLogo);

        // 2. Conflict Alert Banner (Hidden by default)
        _pnlConflictAlert = new Panel
        {
            Dock = DockStyle.Top,
            Height = 42,
            BackColor = Color.FromArgb(176, 0, 32),
            Visible = false
        };
        _lblConflictText = new Label
        {
            Text = "[ALERT] Port conflict detected!",
            Font = new Font("Tahoma", 9.5F, FontStyle.Bold),
            ForeColor = Color.White,
            Location = new Point(16, 11),
            AutoSize = true
        };
        _btnKillConflict = CreateButton("Kill Conflict PID", 140, 28, 680, 7, Color.FromArgb(240, 240, 240));
        _btnKillConflict.Click += (s, e) => KillCurrentConflict();

        _btnKillAllConflicts = CreateButton("Kill All Game Ports", 150, 28, 830, 7, Color.FromArgb(240, 240, 240));
        _btnKillAllConflicts.Click += (s, e) => KillAllPortsAction();

        _pnlConflictAlert.Controls.Add(_lblConflictText);
        _pnlConflictAlert.Controls.Add(_btnKillConflict);
        _pnlConflictAlert.Controls.Add(_btnKillAllConflicts);

        // 3. Bottom Wizard Footer Bar
        var pnlFooter = new Panel
        {
            Dock = DockStyle.Bottom,
            Height = 52,
            BackColor = Color.FromArgb(236, 233, 216)
        };
        pnlFooter.Paint += (s, e) =>
        {
            e.Graphics.DrawLine(new Pen(Color.FromArgb(170, 170, 170)), 0, 0, pnlFooter.Width, 0);
            e.Graphics.DrawLine(new Pen(Color.White), 0, 1, pnlFooter.Width, 1);
        };

        _btnTray = CreateButton("Tray", 80, 32, 16, 10, Color.FromArgb(240, 240, 240));
        _btnTray.Click += (s, e) => WindowState = FormWindowState.Minimized;

        _lblFooterStatus = new Label
        {
            Text = "Status: Ready",
            Font = new Font("Tahoma", 9F, FontStyle.Regular),
            ForeColor = Color.FromArgb(40, 40, 40),
            Location = new Point(106, 18),
            Size = new Size(350, 20)
        };

        _lblMariaStatus = new Label
        {
            Text = "MariaDB: Inactive",
            Font = new Font("Tahoma", 9F, FontStyle.Bold),
            ForeColor = Color.DarkRed,
            Location = new Point(460, 18),
            AutoSize = true
        };

        _lblServerStatus = new Label
        {
            Text = "Server: Stopped",
            Font = new Font("Tahoma", 9F, FontStyle.Bold),
            ForeColor = Color.DarkRed,
            Location = new Point(600, 18),
            AutoSize = true
        };

        _btnBack = CreateButton("< Back", 85, 32, 720, 10, Color.FromArgb(240, 240, 240));
        _btnBack.Click += (s, e) => SwitchView(_viewTasks);

        _btnNext = CreateButton("Next >", 85, 32, 810, 10, Color.FromArgb(240, 240, 240));
        _btnNext.Click += (s, e) => SwitchView(_viewConsole);

        _btnExit = CreateButton("Exit", 80, 32, 900, 10, Color.FromArgb(240, 240, 240));
        _btnExit.Click += (s, e) => Close();

        pnlFooter.Controls.Add(_btnTray);
        pnlFooter.Controls.Add(_lblFooterStatus);
        pnlFooter.Controls.Add(_lblMariaStatus);
        pnlFooter.Controls.Add(_lblServerStatus);
        pnlFooter.Controls.Add(_btnBack);
        pnlFooter.Controls.Add(_btnNext);
        pnlFooter.Controls.Add(_btnExit);

        // 4. Left Sidebar Category Buttons (Classic nLite Block Buttons)
        var pnlSidebar = new Panel
        {
            Dock = DockStyle.Left,
            Width = 150,
            BackColor = Color.FromArgb(220, 236, 233, 216), // Light tinted
            Padding = new Padding(12, 14, 8, 14)
        };

        _btnCatIntegrate = CreateSidebarButton("Integrate", 0);
        _btnCatIntegrate.Click += (s, e) => SwitchView(_viewTasks);

        _btnCatTerminal = CreateSidebarButton("Terminal", 66);
        _btnCatTerminal.Click += (s, e) => SwitchView(_viewConsole);

        _btnCatSetup = CreateSidebarButton("Setup", 132);
        _btnCatSetup.Click += (s, e) => SwitchView(_viewConfig);

        _btnCatDiagnose = CreateSidebarButton("Diagnose", 198);
        _btnCatDiagnose.Click += (s, e) => SwitchView(_viewDiagnostics);

        _btnCatCreate = CreateSidebarButton("Create", 264);
        _btnCatCreate.Click += (s, e) => SwitchView(_viewDistribution);

        pnlSidebar.Controls.Add(_btnCatIntegrate);
        pnlSidebar.Controls.Add(_btnCatTerminal);
        pnlSidebar.Controls.Add(_btnCatSetup);
        pnlSidebar.Controls.Add(_btnCatDiagnose);
        pnlSidebar.Controls.Add(_btnCatCreate);

        // 5. Central Work Area Panel
        _pnlContentArea = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.FromArgb(245, 250, 252),
            Padding = new Padding(10)
        };

        // Initialize All Sub-Views
        BuildTasksView();
        BuildConsoleView();
        BuildConfigView();
        BuildDiagnosticsView();
        BuildDistributionView();

        _pnlContentArea.Controls.Add(_viewTasks);
        _pnlContentArea.Controls.Add(_viewConsole);
        _pnlContentArea.Controls.Add(_viewConfig);
        _pnlContentArea.Controls.Add(_viewDiagnostics);
        _pnlContentArea.Controls.Add(_viewDistribution);

        // Add main components to Form
        Controls.Add(_pnlContentArea);
        Controls.Add(pnlSidebar);
        Controls.Add(_pnlConflictAlert);
        Controls.Add(_pnlHeader);
        Controls.Add(pnlFooter);

        // Default view
        SwitchView(_viewTasks);

        ResumeLayout(false);
    }

    private void PnlHeader_Paint(object? sender, PaintEventArgs e)
    {
        var rect = _pnlHeader.ClientRectangle;
        using var brush = new LinearGradientBrush(rect, Color.FromArgb(10, 36, 106), Color.FromArgb(43, 95, 158), LinearGradientMode.Horizontal);
        e.Graphics.FillRectangle(brush, rect);
        e.Graphics.DrawLine(new Pen(Color.FromArgb(5, 20, 60)), 0, rect.Height - 1, rect.Width, rect.Height - 1);
    }

    // ==========================================
    // VIEW 1: Task Selection (Exact nLite Style)
    // ==========================================
    private void BuildTasksView()
    {
        _viewTasks = new Panel
        {
            Dock = DockStyle.Fill,
            AutoScroll = true,
            BackColor = Color.FromArgb(248, 249, 250)
        };

        var lblSelectTitle = new Label
        {
            Text = "Task Selection:",
            Font = new Font("Tahoma", 10F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(14, 10),
            AutoSize = true
        };
        _viewTasks.Controls.Add(lblSelectTitle);

        int startY = 36;
        int gap = 48;

        _btnTaskServer = CreateTaskButton("Service Pack - Start / Stop Game Server Engine", startY, Color.FromArgb(0, 100, 0));
        _btnTaskServer.Click += BtnTaskServer_Click;
        _viewTasks.Controls.Add(_btnTaskServer);

        _btnTaskMariaDb = CreateTaskButton("Drivers - Start / Stop Portable MariaDB Database", startY + gap, Color.FromArgb(0, 70, 140));
        _btnTaskMariaDb.Click += BtnTaskMariaDb_Click;
        _viewTasks.Controls.Add(_btnTaskMariaDb);

        _btnTaskBuild = CreateTaskButton("Hotfixes - Compile Project (Maven Build Offline)", startY + gap * 2, Color.FromArgb(70, 30, 110));
        _btnTaskBuild.Click += async (s, e) =>
        {
            SwitchView(_viewConsole);
            _lblFooterStatus.Text = "Status: Compiling project with Maven...";
            await _processManager.BuildProjectAsync();
            _lblFooterStatus.Text = "Status: Compile complete.";
        };
        _viewTasks.Controls.Add(_btnTaskBuild);

        _btnTaskImportDb = CreateTaskButton("Components - Auto-Import Database (Base Game 90 Tables)", startY + gap * 3, Color.FromArgb(120, 70, 0));
        _btnTaskImportDb.Click += async (s, e) =>
        {
            SwitchView(_viewConsole);
            _lblFooterStatus.Text = "Status: Importing database tables...";
            await _processManager.ImportDatabaseAsync();
            _lblFooterStatus.Text = "Status: Database import finished.";
        };
        _viewTasks.Controls.Add(_btnTaskImportDb);

        _btnTaskConfig = CreateTaskButton("Unattended - Configure Network & Database Properties", startY + gap * 4, Color.FromArgb(30, 80, 80));
        _btnTaskConfig.Click += (s, e) => SwitchView(_viewConfig);
        _viewTasks.Controls.Add(_btnTaskConfig);

        _btnTaskConsole = CreateTaskButton("Options - Live CMD Terminal & Real-Time Server Logs", startY + gap * 5, Color.FromArgb(40, 40, 40));
        _btnTaskConsole.Click += (s, e) => SwitchView(_viewConsole);
        _viewTasks.Controls.Add(_btnTaskConsole);

        _btnTaskDiagnostics = CreateTaskButton("Tweaks - Port Conflict Diagnostics & Kill Conflicting Ports", startY + gap * 6, Color.FromArgb(140, 40, 40));
        _btnTaskDiagnostics.Click += (s, e) => SwitchView(_viewDiagnostics);
        _viewTasks.Controls.Add(_btnTaskDiagnostics);

        _btnTaskDistribution = CreateTaskButton("Bootable ISO - Export Distribution Package (Protected Source)", startY + gap * 7, Color.FromArgb(130, 20, 80));
        _btnTaskDistribution.Click += (s, e) => SwitchView(_viewDistribution);
        _viewTasks.Controls.Add(_btnTaskDistribution);

        // Sub-buttons below task buttons (All / None / Start All / Stop All)
        int subBtnY = startY + gap * 8 + 10;
        var btnStartAll = CreateButton("Start All (DB + Server)", 180, 36, 14, subBtnY, Color.FromArgb(220, 245, 220));
        btnStartAll.Font = new Font("Tahoma", 9.5F, FontStyle.Bold);
        btnStartAll.Click += async (s, e) =>
        {
            SwitchView(_viewConsole);
            _lblFooterStatus.Text = "Status: Starting all services (MariaDB + Server)...";
            await _processManager.StartMariaDbAsync();
            await _processManager.StartServerAsync();
        };

        var btnStopAll = CreateButton("Stop All Services", 160, 36, 204, subBtnY, Color.FromArgb(255, 225, 225));
        btnStopAll.Font = new Font("Tahoma", 9.5F, FontStyle.Bold);
        btnStopAll.Click += (s, e) =>
        {
            _processManager.StopServer();
            _ = _processManager.StopMariaDbAsync();
            PortMonitorService.KillConflictingGamePorts();
            _lblFooterStatus.Text = "Status: All services stopped.";
            CheckPorts();
        };

        var btnClearPorts = CreateButton("Kill Lingering Game Ports", 190, 36, 374, subBtnY, Color.FromArgb(240, 240, 240));
        btnClearPorts.Click += (s, e) => KillAllPortsAction();

        _viewTasks.Controls.Add(btnStartAll);
        _viewTasks.Controls.Add(btnStopAll);
        _viewTasks.Controls.Add(btnClearPorts);
    }

    // ==========================================
    // VIEW 2: Live Embedded CMD Console
    // ==========================================
    private void BuildConsoleView()
    {
        _viewConsole = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.FromArgb(245, 245, 245),
            Visible = false,
            Padding = new Padding(10)
        };

        var pnlConsoleTop = new Panel
        {
            Dock = DockStyle.Top,
            Height = 36
        };

        var lblConsoleTitle = new Label
        {
            Text = "Live Embedded CMD Console:",
            Font = new Font("Tahoma", 10F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(2, 8),
            AutoSize = true
        };

        _chkAutoScroll = new CheckBox
        {
            Text = "Auto Scroll",
            Checked = true,
            Location = new Point(480, 8),
            AutoSize = true
        };

        _btnClearLog = CreateButton("Clear Log", 90, 28, 590, 4, Color.FromArgb(240, 240, 240));
        _btnClearLog.Click += (s, e) => _rtbConsole.Clear();

        _btnCopyLog = CreateButton("Copy Log", 90, 28, 690, 4, Color.FromArgb(240, 240, 240));
        _btnCopyLog.Click += (s, e) =>
        {
            Clipboard.SetText(_rtbConsole.Text);
            MessageBox.Show("All log text copied to Clipboard.", "SwordieMS", MessageBoxButtons.OK, MessageBoxIcon.Information);
        };

        pnlConsoleTop.Controls.Add(lblConsoleTitle);
        pnlConsoleTop.Controls.Add(_chkAutoScroll);
        pnlConsoleTop.Controls.Add(_btnClearLog);
        pnlConsoleTop.Controls.Add(_btnCopyLog);

        _rtbConsole = new RichTextBox
        {
            Dock = DockStyle.Fill,
            BackColor = Color.FromArgb(16, 20, 28),
            ForeColor = Color.FromArgb(220, 225, 230),
            Font = new Font("Consolas", 9.5F, FontStyle.Regular),
            ReadOnly = true,
            BorderStyle = BorderStyle.Fixed3D
        };

        _viewConsole.Controls.Add(_rtbConsole);
        _viewConsole.Controls.Add(pnlConsoleTop);
    }

    // ==========================================
    // VIEW 3: In-App Configuration Editor
    // ==========================================
    private void BuildConfigView()
    {
        _viewConfig = new Panel
        {
            Dock = DockStyle.Fill,
            AutoScroll = true,
            BackColor = Color.FromArgb(245, 245, 245),
            Visible = false,
            Padding = new Padding(12)
        };

        var gbDb = new GroupBox
        {
            Text = "Database Configuration (resources/db.properties)",
            Font = new Font("Tahoma", 9.5F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(14, 12),
            Size = new Size(760, 220)
        };

        AddFormRow(gbDb, "Host / IP Address:", ref _txtDbHost, "127.0.0.1", 30);
        AddFormRow(gbDb, "Port Number:", ref _txtDbPort, "3306", 66);
        AddFormRow(gbDb, "Username:", ref _txtDbUser, "root", 102);
        AddFormRow(gbDb, "Password:", ref _txtDbPass, "root", 138);
        AddFormRow(gbDb, "Database Name:", ref _txtDbName, "swordie232", 174);

        var gbServer = new GroupBox
        {
            Text = "Server Port Configuration",
            Font = new Font("Tahoma", 9.5F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(14, 242),
            Size = new Size(760, 150)
        };

        AddFormRow(gbServer, "Login Server Port:", ref _txtLoginPort, "8484", 30);
        AddFormRow(gbServer, "Channel Server Port:", ref _txtChannelPort, "8585", 66);
        AddFormRow(gbServer, "Client API Port:", ref _txtApiPort, "8483", 102);

        var btnSave = CreateButton("Save Configuration to File", 210, 38, 14, 404, Color.FromArgb(220, 245, 220));
        btnSave.Font = new Font("Tahoma", 10F, FontStyle.Bold);
        btnSave.Click += BtnSaveConfig_Click;

        var btnReload = CreateButton("Reload from File", 140, 38, 234, 404, Color.FromArgb(240, 240, 240));
        btnReload.Click += (s, e) => LoadConfiguration();

        _lblConfigStatus = new Label
        {
            Text = "",
            Font = new Font("Tahoma", 9F, FontStyle.Bold),
            ForeColor = Color.DarkGreen,
            Location = new Point(385, 414),
            AutoSize = true
        };

        _viewConfig.Controls.Add(gbDb);
        _viewConfig.Controls.Add(gbServer);
        _viewConfig.Controls.Add(btnSave);
        _viewConfig.Controls.Add(btnReload);
        _viewConfig.Controls.Add(_lblConfigStatus);
    }

    private void AddFormRow(GroupBox gb, string labelText, ref TextBox tb, string defaultValue, int y)
    {
        var lbl = new Label
        {
            Text = labelText,
            Font = new Font("Tahoma", 9F, FontStyle.Regular),
            ForeColor = Color.FromArgb(30, 30, 30),
            Location = new Point(20, y + 4),
            Size = new Size(180, 20)
        };
        tb = new TextBox
        {
            Text = defaultValue,
            Font = new Font("Tahoma", 9F, FontStyle.Regular),
            Location = new Point(210, y),
            Size = new Size(340, 24)
        };
        gb.Controls.Add(lbl);
        gb.Controls.Add(tb);
    }

    // ==========================================
    // VIEW 4: Port Diagnostics
    // ==========================================
    private void BuildDiagnosticsView()
    {
        _viewDiagnostics = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.FromArgb(245, 245, 245),
            Visible = false,
            Padding = new Padding(12)
        };

        var lblDiagTitle = new Label
        {
            Text = "Port Status & Process Conflict Diagnostics:",
            Font = new Font("Tahoma", 10F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(14, 10),
            AutoSize = true
        };

        _lvPorts = new ListView
        {
            Location = new Point(14, 38),
            Size = new Size(760, 340),
            View = View.Details,
            FullRowSelect = true,
            GridLines = true,
            Font = new Font("Tahoma", 9F, FontStyle.Regular)
        };
        _lvPorts.Columns.Add("Port", 80);
        _lvPorts.Columns.Add("Service Role", 180);
        _lvPorts.Columns.Add("Status", 140);
        _lvPorts.Columns.Add("PID", 80);
        _lvPorts.Columns.Add("Process Name", 160);
        _lvPorts.Columns.Add("Conflict", 90);

        _btnRefreshPorts = CreateButton("Refresh Status Now", 160, 36, 14, 390, Color.FromArgb(240, 240, 240));
        _btnRefreshPorts.Click += (s, e) => CheckPorts();

        var btnKillGamePorts = CreateButton("Kill Conflicting Game Ports", 200, 36, 184, 390, Color.FromArgb(255, 225, 225));
        btnKillGamePorts.Click += (s, e) => KillAllPortsAction();

        _viewDiagnostics.Controls.Add(lblDiagTitle);
        _viewDiagnostics.Controls.Add(_lvPorts);
        _viewDiagnostics.Controls.Add(_btnRefreshPorts);
        _viewDiagnostics.Controls.Add(btnKillGamePorts);
    }

    // ==========================================
    // VIEW 5: Distribution Exporter
    // ==========================================
    private void BuildDistributionView()
    {
        _viewDistribution = new Panel
        {
            Dock = DockStyle.Fill,
            BackColor = Color.FromArgb(245, 245, 245),
            Visible = false,
            Padding = new Padding(14)
        };

        var lblDistTitle = new Label
        {
            Text = "Export Distribution Package (Source Code Protection)",
            Font = new Font("Tahoma", 11F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Location = new Point(14, 14),
            AutoSize = true
        };

        var lblDistDesc = new Label
        {
            Text = "Create a standalone distribution package without exposing proprietary core engine code.\n\n" +
                   "1. Protected Code: The entire 'src/' folder and 'pom.xml' will be strictly OMITTED from export.\n" +
                   "2. Pre-Compiled Execution: The server runs from pre-compiled bytecode in 'bin/maplestory-1.77.3.jar'.\n" +
                   "3. Moddable Scripts: Python (.py) and Kotlin (.kts) scripts in 'scripts/' remain editable.\n" +
                   "4. Portable Tools: Embedded MariaDB, JDK 21, and database tables are included for plug-and-play.",
            Font = new Font("Tahoma", 9F, FontStyle.Regular),
            ForeColor = Color.FromArgb(50, 50, 50),
            Location = new Point(14, 46),
            Size = new Size(760, 100)
        };

        var lblTarget = new Label
        {
            Text = "Target Output Directory:",
            Font = new Font("Tahoma", 9F, FontStyle.Bold),
            Location = new Point(14, 160),
            AutoSize = true
        };

        _txtDistTarget = new TextBox
        {
            Text = "dist_release",
            Font = new Font("Tahoma", 9.5F, FontStyle.Regular),
            Location = new Point(14, 184),
            Size = new Size(340, 24)
        };

        _btnStartExport = CreateButton("Export Distribution Package Now", 260, 40, 14, 224, Color.FromArgb(220, 245, 220));
        _btnStartExport.Font = new Font("Tahoma", 9.5F, FontStyle.Bold);
        _btnStartExport.Click += BtnStartExport_Click;

        _lblDistStatus = new Label
        {
            Text = "",
            Font = new Font("Tahoma", 9F, FontStyle.Bold),
            ForeColor = Color.FromArgb(0, 100, 0),
            Location = new Point(14, 276),
            Size = new Size(740, 40)
        };

        _viewDistribution.Controls.Add(lblDistTitle);
        _viewDistribution.Controls.Add(lblDistDesc);
        _viewDistribution.Controls.Add(lblTarget);
        _viewDistribution.Controls.Add(_txtDistTarget);
        _viewDistribution.Controls.Add(_btnStartExport);
        _viewDistribution.Controls.Add(_lblDistStatus);
    }

    // ==========================================
    // UI Helpers & Actions
    // ==========================================
    private Button CreateButton(string text, int width, int height, int x, int y, Color backColor)
    {
        return new Button
        {
            Text = text,
            Size = new Size(width, height),
            Location = new Point(x, y),
            BackColor = backColor,
            FlatStyle = FlatStyle.Standard,
            Font = new Font("Tahoma", 9F, FontStyle.Regular),
            Cursor = Cursors.Hand
        };
    }

    private Button CreateSidebarButton(string text, int y)
    {
        return new Button
        {
            Text = text,
            Size = new Size(126, 52),
            Location = new Point(12, y),
            BackColor = Color.FromArgb(240, 240, 240),
            FlatStyle = FlatStyle.Standard,
            Font = new Font("Tahoma", 9.5F, FontStyle.Bold),
            ForeColor = Color.FromArgb(20, 40, 80),
            Cursor = Cursors.Hand
        };
    }

    private Button CreateTaskButton(string text, int y, Color bulletColor)
    {
        var btn = new Button
        {
            Text = text,
            Size = new Size(760, 42),
            Location = new Point(14, y),
            BackColor = Color.FromArgb(250, 250, 250),
            FlatStyle = FlatStyle.Standard,
            Font = new Font("Tahoma", 9.5F, FontStyle.Bold),
            ForeColor = Color.FromArgb(30, 30, 30),
            TextAlign = ContentAlignment.MiddleLeft,
            Padding = new Padding(28, 0, 0, 0),
            Cursor = Cursors.Hand
        };

        btn.Paint += (s, e) =>
        {
            // Draw classic nLite bullet
            e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;
            using var brush = new SolidBrush(bulletColor);
            e.Graphics.FillEllipse(brush, 12, (btn.Height - 12) / 2, 12, 12);
            e.Graphics.DrawEllipse(new Pen(Color.FromArgb(50, 0, 0, 0)), 12, (btn.Height - 12) / 2, 12, 12);
        };

        return btn;
    }

    private void SwitchView(Panel targetView)
    {
        _viewTasks.Visible = false;
        _viewConsole.Visible = false;
        _viewConfig.Visible = false;
        _viewDiagnostics.Visible = false;
        _viewDistribution.Visible = false;

        targetView.Visible = true;
        targetView.BringToFront();
    }

    private async void BtnTaskServer_Click(object? sender, EventArgs e)
    {
        if (_processManager.IsServerRunning)
        {
            _processManager.StopServer();
            _lblFooterStatus.Text = "Status: Server stopped.";
        }
        else
        {
            SwitchView(_viewConsole);
            _lblFooterStatus.Text = "Status: Starting server...";
            await _processManager.StartServerAsync();
        }
    }

    private async void BtnTaskMariaDb_Click(object? sender, EventArgs e)
    {
        SwitchView(_viewConsole);
        _lblFooterStatus.Text = "Status: Starting Portable MariaDB...";
        await _processManager.StartMariaDbAsync();
        CheckPorts();
    }

    private void LoadConfiguration()
    {
        _currentConfig = ConfigService.LoadConfig(_projectRoot);
        _txtDbHost.Text = _currentConfig.Host;
        _txtDbPort.Text = _currentConfig.Port.ToString();
        _txtDbUser.Text = _currentConfig.User;
        _txtDbPass.Text = _currentConfig.Password;
        _txtDbName.Text = _currentConfig.Name;

        _txtLoginPort.Text = _currentConfig.LoginPort.ToString();
        _txtChannelPort.Text = _currentConfig.ChannelPort.ToString();
        _txtApiPort.Text = _currentConfig.ApiPort.ToString();

        _lblConfigStatus.Text = "Config loaded from resources/db.properties";
        _lblConfigStatus.ForeColor = Color.DarkGreen;
    }

    private void BtnSaveConfig_Click(object? sender, EventArgs e)
    {
        _currentConfig.Host = _txtDbHost.Text.Trim();
        if (int.TryParse(_txtDbPort.Text, out int port)) _currentConfig.Port = port;
        _currentConfig.User = _txtDbUser.Text.Trim();
        _currentConfig.Password = _txtDbPass.Text.Trim();
        _currentConfig.Name = _txtDbName.Text.Trim();

        if (ConfigService.SaveConfig(_projectRoot, _currentConfig, out string message))
        {
            _lblConfigStatus.Text = message;
            _lblConfigStatus.ForeColor = Color.DarkGreen;
            _lblFooterStatus.Text = "Status: Configuration saved to db.properties.";
            _processManager.Log($"[OK] {message}", LogLevel.Success);
        }
        else
        {
            _lblConfigStatus.Text = message;
            _lblConfigStatus.ForeColor = Color.DarkRed;
            MessageBox.Show(message, "Error Saving Config", MessageBoxButtons.OK, MessageBoxIcon.Error);
        }
    }

    private void CheckPorts()
    {
        try
        {
            var ports = _portMonitor.CheckPorts(_processManager.ServerPid, _processManager.MariaDbPid);

            // Update ListView
            _lvPorts.Items.Clear();
            foreach (var p in ports)
            {
                var item = new ListViewItem(p.Port.ToString());
                item.SubItems.Add(p.Name);
                item.SubItems.Add(p.IsListening ? "LISTENING" : "AVAILABLE");
                item.SubItems.Add(p.ProcessId > 0 ? p.ProcessId.ToString() : "-");
                item.SubItems.Add(string.IsNullOrEmpty(p.ProcessName) ? "-" : p.ProcessName);
                item.SubItems.Add(p.IsConflict ? "CONFLICT" : "OK");

                if (p.IsConflict)
                {
                    item.BackColor = Color.FromArgb(255, 230, 230);
                    item.ForeColor = Color.DarkRed;
                }
                else if (p.IsListening)
                {
                    item.BackColor = Color.FromArgb(235, 255, 235);
                    item.ForeColor = Color.DarkGreen;
                }

                _lvPorts.Items.Add(item);
            }

            // MariaDB Status
            var mariaPort = ports.FirstOrDefault(p => p.Port == 3306);
            bool isDbRunning = mariaPort != null && mariaPort.IsListening;
            _lblMariaStatus.Text = isDbRunning ? "MariaDB: Active (3306)" : "MariaDB: Inactive";
            _lblMariaStatus.ForeColor = isDbRunning ? Color.DarkGreen : Color.DarkRed;

            // Server Status
            bool isServerRunning = _processManager.IsServerRunning;
            _lblServerStatus.Text = isServerRunning ? "Server: Running" : "Server: Stopped";
            _lblServerStatus.ForeColor = isServerRunning ? Color.DarkGreen : Color.DarkRed;

            // Conflict Alert
            var conflicts = ports.Where(p => p.IsConflict).ToList();
            if (conflicts.Count > 0)
            {
                var first = conflicts[0];
                _lblConflictText.Text = $"[CONFLICT] Port {first.Port} is used by {first.ProcessName} (PID: {first.ProcessId})";
                _btnKillConflict.Tag = first.ProcessId;
                _pnlConflictAlert.Visible = true;
            }
            else
            {
                _pnlConflictAlert.Visible = false;
            }
        }
        catch { }
    }

    private void KillCurrentConflict()
    {
        if (_btnKillConflict.Tag is int pid && pid > 0)
        {
            PortMonitorService.KillProcessByPid(pid);
            _processManager.Log($"[OK] Terminated conflicting process PID {pid}", LogLevel.Success);
            CheckPorts();
        }
    }

    private void KillAllPortsAction()
    {
        PortMonitorService.KillConflictingGamePorts();
        _processManager.Log("[OK] Terminated all conflicting game port processes.", LogLevel.Success);
        CheckPorts();
        _lblFooterStatus.Text = "Status: Game ports cleared.";
    }

    private async void BtnStartExport_Click(object? sender, EventArgs e)
    {
        string target = _txtDistTarget.Text.Trim();
        if (string.IsNullOrEmpty(target)) target = "dist_release";

        _btnStartExport.Enabled = false;
        _lblDistStatus.Text = "Exporting distribution package (omitting src/)...";
        _lblDistStatus.ForeColor = Color.DarkBlue;

        var (success, message) = await _distService.ExportDistributionPackageAsync(target, line =>
        {
            _processManager.Log(line, LogLevel.Info);
        });

        _btnStartExport.Enabled = true;
        if (success)
        {
            _lblDistStatus.Text = "Export completed successfully! Check folder: " + target;
            _lblDistStatus.ForeColor = Color.DarkGreen;
            MessageBox.Show(message, "Distribution Created", MessageBoxButtons.OK, MessageBoxIcon.Information);
        }
        else
        {
            _lblDistStatus.Text = "Export error: " + message;
            _lblDistStatus.ForeColor = Color.DarkRed;
            MessageBox.Show(message, "Export Error", MessageBoxButtons.OK, MessageBoxIcon.Warning);
        }
    }

    private void ProcessManager_OnLogReceived(string line, LogLevel level)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => ProcessManager_OnLogReceived(line, level)));
            return;
        }

        Color color = level switch
        {
            LogLevel.Success => Color.LightGreen,
            LogLevel.Warning => Color.Gold,
            LogLevel.Error => Color.Tomato,
            LogLevel.Highlight => Color.MediumPurple,
            _ => Color.Gainsboro
        };

        _rtbConsole.SelectionStart = _rtbConsole.TextLength;
        _rtbConsole.SelectionLength = 0;
        _rtbConsole.SelectionColor = color;
        _rtbConsole.AppendText(line + Environment.NewLine);
        _rtbConsole.SelectionColor = _rtbConsole.ForeColor;

        if (_chkAutoScroll.Checked)
        {
            _rtbConsole.ScrollToCaret();
        }
    }

    private void ProcessManager_OnServerStateChanged(bool isRunning)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => ProcessManager_OnServerStateChanged(isRunning)));
            return;
        }
        CheckPorts();
    }

    private void ProcessManager_OnMariaDbStateChanged(bool isRunning)
    {
        if (InvokeRequired)
        {
            BeginInvoke(new Action(() => ProcessManager_OnMariaDbStateChanged(isRunning)));
            return;
        }
        CheckPorts();
    }

    protected override void OnFormClosing(FormClosingEventArgs e)
    {
        _portTimer.Stop();
        if (_processManager.IsServerRunning)
        {
            var res = MessageBox.Show("Server is currently running. Do you want to stop the server before exiting?",
                "Confirm Exit", MessageBoxButtons.YesNoCancel, MessageBoxIcon.Question);

            if (res == DialogResult.Cancel)
            {
                e.Cancel = true;
                return;
            }
            if (res == DialogResult.Yes)
            {
                _processManager.StopServer();
            }
        }
        base.OnFormClosing(e);
    }
}
