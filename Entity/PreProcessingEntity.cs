namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class PreProcessingEntity : BaseEntity
{
    public string Equip { get; set; } = default!;
    public DateTime Time { get; set; } = default!;
    public decimal? H2so4Pv { get; set; }
    public decimal? H2so41Day { get; set; }
    public int? H2so4Total { get; set; }
    public decimal? H2o2Pv { get; set; }
    public decimal? H2o21Day{ get; set; }
    public int? H2o2Total { get; set; }
    public decimal? CuPv { get; set; }
    public decimal? Cu1Day { get; set; }
    public int? CuTotal { get; set; }
    public decimal? TempPv{ get; set; }
    public decimal? CirFlow{ get; set; }

    public override string ToString()
    {
        return $"{Equip},{Time}";
    }
}

public class PreProcessingList : List<PreProcessingEntity>
{
    public PreProcessingList(IEnumerable<PreProcessingEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
