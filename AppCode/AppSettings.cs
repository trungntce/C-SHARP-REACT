namespace WebApp;

public class Setting
{
    private static Setting _appSettings;

    public Setting()
    {
        _appSettings = this;
    }

    public static Setting Current
    {
        get
        {
            return _appSettings;
        }
    }


    static public readonly string MesConn = "Postgre.Mes";
    static public readonly string ErpConn = "Oracle.Erp";
    static public readonly string GroupwareConn = "Groupware";
    static public readonly string LoginUserGroup = "login.user";
    static public readonly string IsAdminGroup = "administrators";

    public string SqlFilePath { get; set; } = default!;
    public string UploadFilePath { get; set; } = default!;
    public string AuthKey { get; set; } = default!;
    public string TelesignCustomerId { get; set; } = default!;
    public string TelesignApiKey { get; set; } = default!;
}