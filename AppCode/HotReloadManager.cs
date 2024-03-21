using Framework;
using System.Reflection;
using WebApp;

[assembly: System.Reflection.Metadata.MetadataUpdateHandler(typeof(HotReloadManager))]

namespace WebApp;

public static class HotReloadManager
{
    public static void ClearCache(Type[]? updatedTypes)
    {
    }

    public static void UpdateApplication(Type[]? updatedTypes)
    {
        RefreshSql();
    }

    public static void RefreshSql()
    {
        var assembly = Assembly.GetExecutingAssembly().Location;

        var buildPath = Path.GetDirectoryName(assembly)!;
        var buildTime = File.GetLastWriteTime(assembly);

        string sqlPath = Path.Combine(Environment.CurrentDirectory, Setting.Current.SqlFilePath);

        var files = Directory.GetFiles(sqlPath, "*.sql", SearchOption.AllDirectories)
            .Select(f => new FileInfo(f))
            .Where(f => f.LastWriteTime > buildTime);

        foreach (var file in files)
        {
            var toPath = Path.Combine(buildPath, Path.GetRelativePath(Environment.CurrentDirectory, file.FullName));
            file.CopyTo(toPath, true);
        }

        DataContext.SqlCache.RefreshAllSql();
    }
}