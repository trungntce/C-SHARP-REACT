using Microsoft.Practices.EnterpriseLibrary.Data;

namespace WebApp;

public class ChecksheetItemCleanEntity : BaseEntity
{
    public string ChecksheetCode { get; set; } = default!;
    public string ItemCode { get; set; } = default!;
    public string? ItemName { get; set; } = default!;
    public string? Remark { get; set; } = default!;
    public char? UseYn { get; set; }
    public DateTime? CreateDt { get; set; }
    public string? CreateUser { get; set; } = default!;
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }
    public override string ToString()
    {
        return $"{ChecksheetCode},{ItemCode}, {ItemName}, {Remark}, {UseYn}";
    }
}

public class ChecksheetItemCleanList : List<ChecksheetItemCleanEntity>
{
    public ChecksheetItemCleanList(IEnumerable<ChecksheetItemCleanEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
