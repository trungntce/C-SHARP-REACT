namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class HealthcheckEntity : BaseEntity
{
    public string HcCode { get; set; } = default!;
    public string HcName { get; set; } = default!;
    public char HcType { get; set; } = default!;
    public string HcTypeName
    {
        get
        {
            return CodeService.CodeName("HC_TYPE", HcType.ToString());
        }
    }
    public string Tags { get; set; } = default!;
    public IEnumerable<string> TagList
    {
        get
        {
            if (string.IsNullOrWhiteSpace(Tags))
                return new List<string>();

            return Tags.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(x => x.Trim()).ToList();
        }
    }

    public char UseYn { get; set; }
    public int Sort { get; set; }
    public string? Remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{HcCode},{HcName},{Tags},{UseYn},{Sort}";
    }
}
