namespace WebApp;

using System;
using System.Collections.Generic;

using Framework;
using Microsoft.Practices.EnterpriseLibrary.Data;

public class CodeMngEntity : BaseEntity
{
    public string CodeGrpId { get; set; } = default!;
    public string CodeId { get; set; } = default!;
    public string CodeGrpNm { get; set; } = default!;
    public string CodeNm { get; set; } = default!;
    public string? DelYn { get; set; }
    public string? UseYn { get; set; } = default!;
    public string? Rmk { get; set; }
    public string? InsertUserid { get; set; } 
    public string? InsertYmdhms { get; set; }
    public string? UpdateUserid { get; set; }
    public string? UpdateYmdhms { get; set; }
    public string? Token { get; set; }
    public string? CorpId { get; set; }
    public string? FacId { get; set; }

    public override string ToString()
    {
        return $"{CodeGrpId}, {CodeId}, {Token}";
    }
}

public class CodeMngList : List<CodeMngEntity>
{
    public CodeMngList(IEnumerable<CodeMngEntity> list) : base(list) { }
    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
