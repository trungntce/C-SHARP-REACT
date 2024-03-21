namespace WebApp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

using Framework;
using Newtonsoft.Json;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class PcbItemEntity : BaseEntity
{    public string ItemId { get; set; } = default!;
    public string ItemNm { get; set; } = default!;
    public string? JigGrpId { get; set; }
    public string? TgIctYn { get; set; }
    public string? TgFctYn { get; set; }
    public string UseYn { get; set; } = default!;
    public string? Rmk { get; set; }
    public string? DelYn { get; set; }
    public string? InsertYmdhms { get; set; }
    public string? InsertUserid { get; set; }
    public string? UpdateYmdhms { get; set; }
    public string? UpdateUserid { get; set; }

    public override string ToString()
    {
        return $"{ItemId}, {ItemNm}";
    }
}
public class PcbItemList : List<PcbItemEntity>
{
    public PcbItemList(IEnumerable<PcbItemEntity> list) : base(list) { }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}