namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class DiWaterEntity : BaseEntity
{
    public string EqCode{ get; set; } = default!;
    public DateTime Time { get; set; } = default!;
    public decimal? D006 { get; set; }

    public override string ToString()
    {
        return $"{EqCode},{Time},{D006}";
    }
}

public class DiWaterList : List<DiWaterEntity>
{
    public DiWaterList(IEnumerable<DiWaterEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
