namespace WebApp;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;

using Framework;
using Newtonsoft.Json;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class JigMngEntity : BaseEntity
{    public string JigGrpId { get; set; } = default!;
    public string? JigGrpNm { get; set; }
    public string JigId { get; set; } = default!;
    public string? JigMngNo { get; set; }
    public string UseYn { get; set; } = default!;
    public string? TgIctYn { get; set; }
    public string? TgFctYn { get; set; }
    public string? Rmk { get; set; }
    public string? DelYn { get; set; }
    public string? InsertYmdhms { get; set; }
    public string? InsertUserid { get; set; }
    public string? UpdateYmdhms { get; set; }
    public string? UpdateUserid { get; set; }
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string? Token { get; set; }
    public string? InspeqpType { get; set; }
    public string? SerialNo { get; set; }

    public override string ToString()
    {
        return $"{JigGrpId}, {JigGrpNm}, {JigId}, {Token}";
    }
}
public class JigMngList : List<JigMngEntity>
{
    public JigMngList(IEnumerable<JigMngEntity> list) : base(list) { }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}