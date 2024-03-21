namespace WebApp;

using Microsoft.Practices.EnterpriseLibrary.Data;
using System;
using System.Collections.Generic;
using System.Numerics;

public class CheckSheetGroupEqpItemEntity : BaseEntity
{

    public string ChecksheetGroupCode { get; set; } = default!;
    public string EquipmentCode { get; set; } = default!;
    public char? UseYn { get; set; }
    public DateTime? CreateDt { get; set; }
    public string? CreateUser { get; set; } = default!;
    public override string ToString()
    {
        return $"{ChecksheetGroupCode},{EquipmentCode}, {UseYn}";
    }
}

public class ChecksheetGroupEqpItemList : List<CheckSheetGroupEqpItemEntity>
{
    public ChecksheetGroupEqpItemList(IEnumerable<CheckSheetGroupEqpItemEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
