using System;
using System.IO;
using System.Windows.Forms;

namespace SwordieLauncher;

internal static class Program
{
    [STAThread]
    private static void Main()
    {
        Application.SetHighDpiMode(HighDpiMode.SystemAware);
        Application.EnableVisualStyles();
        Application.SetCompatibleTextRenderingDefault(false);

        AppDomain.CurrentDomain.UnhandledException += (s, e) =>
        {
            try
            {
                File.WriteAllText("launcher_error.log", e.ExceptionObject.ToString());
            }
            catch { }
        };

        Application.ThreadException += (s, e) =>
        {
            try
            {
                File.WriteAllText("launcher_error.log", e.Exception.ToString());
            }
            catch { }
            MessageBox.Show(e.Exception.Message, "SwordieMS Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
        };

        Application.Run(new MainForm());
    }
}
