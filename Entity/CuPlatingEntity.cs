namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class CuPlatingEntity : BaseEntity
{
    public DateTime Time { get; set; }
    public string EqCode { get; set; } = default!;
    public float D001 { get; set; }
    public float D002 { get; set; }
    public float D003 { get; set; }
    public float D004 { get; set; }

    public override string ToString()
    {
        return $"{EqCode},{Time}";
    }
}

public class CuPlatingList : List<CuPlatingEntity>
{
    public CuPlatingList(IEnumerable<CuPlatingEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
