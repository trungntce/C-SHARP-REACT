namespace WebApp;

using System;
using System.Collections.Generic;

using Microsoft.Practices.EnterpriseLibrary.Data;

public class WorkCalendarEntity : BaseEntity
{
    public string CorpId { get; set; } = default!;
    public string FacId { get; set; } = default!;
	public DateTime WorkDate { get; set; } = default!;
    public string WorkerId { get; set; } = default!;
	public string? WorkerName { get; set; }
	public DateTime OffDate { get; set; } = default!;
	public string? WorkYn { get; set; } = "N";
    public string? ShiftType { get; set; } = "D";
    public string? remark { get; set; }
    public string CreateUser { get; set; } = default!;
    public DateTime CreateDt { get; set; }
    public string? UpdateUser { get; set; }
    public DateTime UpdateDt { get; set; }

    public override string ToString()
    {
        return $"{CorpId},{FacId},{WorkDate},{ShiftType}";
    }
}

public class WorkCalendarList : List<WorkCalendarEntity>
{
    public WorkCalendarList(IEnumerable<WorkCalendarEntity> list) : base(list)
    {
    }

    public override string ToString()
    {
        return string.Join(Environment.NewLine, this);
    }
}
