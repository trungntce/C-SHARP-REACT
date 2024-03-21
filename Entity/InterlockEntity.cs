namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class InterlockEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string InterlockCode { get; set; } = "";
    public string InterlockName { get; set; } = "";
    public string InterlockType { get; set; } = "";
    public string? Remark { get; set; }
    public char? UseYn { get; set; }
    public string? CreateUser { get; set; }
    public DateTime? CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime? UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{InterlockCode},{InterlockName},{InterlockType}";
    }
}

public class InterlockList : List<InterlockEntity>
{
    public InterlockList(IEnumerable<InterlockEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
