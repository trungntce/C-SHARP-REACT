namespace WebApp;

using System;
using System.Collections.Generic;
using System.Numerics;
using Microsoft.Practices.EnterpriseLibrary.Data;
public class CheckSheetGroupEqpEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
    public string ChecksheetGroupCode { get; set; } = default!;
    public string ChecksheetGroupName { get; set; } = default!;
    public string WorkcenterCode { get; set; } = default!;
    public string WorkcenterDescription { get; set; } = default!;
    public string GroupType { get; set; } = default!;
    public string? Remark { get; set; }
    public char? UseYn { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }

    public string? UpdateUser { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{ChecksheetGroupCode},{ChecksheetGroupName}, {Remark}, {UseYn}";
    }
}


public class ChecksheetGroupEqpList : List<CheckSheetGroupEqpEntity>
{
    public ChecksheetGroupEqpList(IEnumerable<CheckSheetGroupEqpEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}