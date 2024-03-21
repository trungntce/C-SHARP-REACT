namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EquipStEntity : BaseEntity
{
    public string EqpCode { get; set; }
    public string EqpDescription { get; set; }
    public string EqpType { get; set; }
    public string FacNo { get; set; }
    public string FacNoDescription { get; set; }
    public string RoomName { get; set; }
    public string RoomNameDescription { get; set; }
    public string EqpTypeDescription { get; set; }
    public int DefaultSt { get; set; }
    public int TotalTime { get; set; }

    public override string ToString()
    {
        return $"{FacNo},{RoomName},{EqpDescription}";
    }
}

public class EquipStList : List<EquipStEntity>
{
    public EquipStList(IEnumerable<EquipStEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
