namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class EquipRealEntity : BaseEntity
{
    public DateTime MesDt { get; set; }
    public string EqpCode { get; set; }
    public string EqpDescription { get; set; }
    public string EqpType { get; set; }
    public char EqpStatus { get; set; }
    public char Step { get; set; }
    public string FacNo { get; set; }
    public string RoomName { get; set; }
    public int PlanCnt { get; set; }
    public int TargetCnt { get; set; }
    public int ProdCnt { get; set; }
    public int AchieveRate { get; set; }
    public int OnTime { get; set; }
    public int OffTime { get; set; }
    public int ST { get; set; }
    public int TimeRate { get; set; }
    public int PerforRate { get; set; }
    public int Oee { get; set; }
    public DateTime UpdateDt { get; set; }
    public string RoomNameDes { get; set; }
    public string EqpTypeDes { get; set; }
    public int DefaultSt { get; set; }
    public int TotalTime { get; set; }
    public char ParamMonitor { get; set; }

    public override string ToString()
    {
        return $"{FacNo},{RoomName},{EqpDescription}";
    }
}

public class EquipRealList : List<EquipRealEntity>
{
    public EquipRealList(IEnumerable<EquipRealEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
